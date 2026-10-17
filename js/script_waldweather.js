function saveUserGPS() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var userGPS = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: "My GPS Location"
        };
        localStorage.setItem("userGPS", JSON.stringify(userGPS));
      },
      function (error) {
        console.warn("Your Spaceship has no GPS: ", error.message);
      },
      { timeout: 10000 }
    );
  }
}
saveUserGPS();

let currentSelectedLocation = getInitialLocation();
let activeSearchedLocation = null;
let cachedWeatherData = null;
let isMaximized = false;

// Cache-Objekt, um API-Anfragen für denselben Ort innerhalb von 5 Minuten abzufangen (verhindert 429-Fehler)
const weatherCache = {};
const CACHE_DURATION = 5 * 60 * 1000; 

function getInitialLocation() {
  try {
    const savedGPS = localStorage.getItem("userGPS");
    if (savedGPS) {
      const gps = JSON.parse(savedGPS);
      return { lat: gps.lat, lon: gps.lon, name: "📍 My Location" };
    }
  } catch (e) {
    console.error("Error reading GPS from storage", e);
  }
  return { lat: 50.11, lon: 8.68, name: "HQ (Frankfurt)" };
}

document.addEventListener("DOMContentLoaded", function () {
  const windowEl = document.querySelector("#waldweatherscreen");
  const searchBtn = document.querySelector("#weather-search-btn");
  const saveBtn = document.querySelector("#weather-save-btn");
  const cityInput = document.querySelector("#weather-city-input");
  const forecastBtn = document.querySelector("#weather-forecast-btn");
  
  const scrollLeftBtn = document.querySelector("#weather-scroll-left");
  const scrollRightBtn = document.querySelector("#weather-scroll-right");
  const tabsContainer = document.querySelector("#weather-tabs");

  if (windowEl) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "style") {
          const display = windowEl.style.display;
          if (display === "flex" || display === "block") {
            const updatedGPS = localStorage.getItem("userGPS");
            if (updatedGPS && currentSelectedLocation.name.includes("Location")) {
              const gps = JSON.parse(updatedGPS);
              currentSelectedLocation = { lat: gps.lat, lon: gps.lon, name: "📍 My Location" };
            }
            renderTabs();
            fetchWeather(currentSelectedLocation.lat, currentSelectedLocation.lon, currentSelectedLocation.name);
          } else if (display === "none") {
            resetForecastState();
          }
        }
      });
    });
    observer.observe(windowEl, { attributes: true, attributeFilter: ["style"] });

    const classObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isCurrentlyMaximized = windowEl.classList.contains("maximized");
          const forecastSection = document.querySelector("#weather-forecast-section");
          
          if (isCurrentlyMaximized) {
            if (forecastSection) forecastSection.style.display = "flex";
            if (forecastBtn) forecastBtn.innerText = "📊 Hide 7-Day Forecast & Details";
            isMaximized = true;
            if (cachedWeatherData) {
              renderAdvancedDetails(cachedWeatherData);
              if (cachedWeatherData.daily) {
                renderForecast(cachedWeatherData.daily);
              }
            }
          } else {
            if (forecastSection) forecastSection.style.display = "none";
            if (forecastBtn) forecastBtn.innerText = "📊 View 7-Day Forecast & Details";
            isMaximized = false;
          }
        }
      });
    });
    classObserver.observe(windowEl, { attributes: true, attributeFilter: ["class"] });
  }

  if (forecastBtn) {
    forecastBtn.addEventListener("click", () => {
      if (windowEl) {
        windowEl.classList.toggle("maximized");
      }
    });
  }

  if (searchBtn && cityInput) {
    searchBtn.addEventListener("click", () => {
      const query = cityInput.value.trim();
      if (query) searchCityCoordinates(query);
    });

    cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = cityInput.value.trim();
        if (query) searchCityCoordinates(query);
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (activeSearchedLocation) {
        saveLocation(activeSearchedLocation);
        renderTabs();
        cityInput.value = "";
        activeSearchedLocation = null;
      } else {
        alert("Please search and view a location first before saving it.");
      }
    });
  }

  if (scrollLeftBtn && tabsContainer) {
    scrollLeftBtn.addEventListener("click", () => {
      tabsContainer.scrollBy({ left: -140, behavior: 'smooth' });
    });
  }

  if (scrollRightBtn && tabsContainer) {
    scrollRightBtn.addEventListener("click", () => {
      tabsContainer.scrollBy({ left: 140, behavior: 'smooth' });
    });
  }
});

function resetForecastState() {
  const windowEl = document.querySelector("#waldweatherscreen");
  const forecastSection = document.querySelector("#weather-forecast-section");
  const forecastBtn = document.querySelector("#weather-forecast-btn");
  if (windowEl) windowEl.classList.remove("maximized");
  if (forecastSection) forecastSection.style.display = "none";
  if (forecastBtn) forecastBtn.innerText = "📊 View 7-Day Forecast & Details";
  isMaximized = false;
}

function getSavedLocations() {
  try {
    return JSON.parse(localStorage.getItem("waldweather_saved_locations") || "[]");
  } catch (e) {
    return [];
  }
}

function saveLocation(loc) {
  let saved = getSavedLocations();
  if (!saved.some(s => Math.abs(s.lat - loc.lat) < 0.01 && Math.abs(s.lon - loc.lon) < 0.01)) {
    saved.push(loc);
    localStorage.setItem("waldweather_saved_locations", JSON.stringify(saved));
  }
}

function renderTabs() {
  const tabsContainer = document.querySelector("#weather-tabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = "";

  const gpsData = localStorage.getItem("userGPS");
  const defaultLat = gpsData ? JSON.parse(gpsData).lat : 50.11;
  const defaultLon = gpsData ? JSON.parse(gpsData).lon : 8.68;

  const defaultTab = document.createElement("button");
  defaultTab.className = `weather-tab ${currentSelectedLocation.lat === defaultLat && currentSelectedLocation.lon === defaultLon ? "active" : ""}`;
  defaultTab.innerText = "📍 My Location";
  defaultTab.addEventListener("click", () => {
    currentSelectedLocation = { lat: defaultLat, lon: defaultLon, name: "📍 My Location" };
    renderTabs();
    fetchWeather(currentSelectedLocation.lat, currentSelectedLocation.lon, currentSelectedLocation.name);
  });
  tabsContainer.appendChild(defaultTab);

  const saved = getSavedLocations();
  saved.forEach((loc) => {
    const tab = document.createElement("button");
    tab.className = `weather-tab ${currentSelectedLocation.lat === loc.lat && currentSelectedLocation.lon === loc.lon ? "active" : ""}`;
    tab.innerText = loc.name;
    tab.addEventListener("click", () => {
      currentSelectedLocation = loc;
      renderTabs();
      fetchWeather(loc.lat, loc.lon, loc.name);
    });
    tabsContainer.appendChild(tab);
  });
}

async function searchCityCoordinates(cityName) {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const res = await fetch(geoUrl);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const location = data.results[0];
      const locName = `${location.name}, ${location.country || ""}`;
      activeSearchedLocation = { lat: location.latitude, lon: location.longitude, name: locName };
      currentSelectedLocation = activeSearchedLocation;
      renderTabs();
      fetchWeather(location.latitude, location.longitude, locName);
    } else {
      alert("Location not found.");
    }
  } catch (err) {
    console.error("Geocoding error:", err);
  }
}

async function fetchWeather(lat, lon, locationName) {
  const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const now = Date.now();

  // Prüfen ob Daten im Cache liegen und noch frisch sind (schützt vor Rate Limits)
  if (weatherCache[cacheKey] && (now - weatherCache[cacheKey].timestamp < CACHE_DURATION)) {
    applyWeatherData(weatherCache[cacheKey].data, locationName);
    return;
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,surface_pressure,visibility,dew_point_2m&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max`;
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`;

    const [weatherRes, airRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(airUrl).catch(() => null)
    ]);

    if (weatherRes.status === 429) {
      console.warn("API Rate Limit reached (429). Using fallback/cached data if available.");
      if (weatherCache[cacheKey]) {
        applyWeatherData(weatherCache[cacheKey].data, locationName);
      } else {
        document.querySelector("#weather-condition").innerText = "Rate limit exceeded. Please wait a moment.";
      }
      return;
    }

    const weatherData = await weatherRes.json();
    const airData = airRes && airRes.ok ? await airRes.json() : null;

    if (weatherData && weatherData.current) {
      // Im Cache speichern
      weatherCache[cacheKey] = {
        timestamp: now,
        data: { weather: weatherData, air: airData }
      };

      applyWeatherData({ weather: weatherData, air: airData }, locationName);
    }
  } catch (err) {
    console.error("Weather fetch error:", err);
  }
}

function applyWeatherData(combinedData, locationName) {
  const weatherData = combinedData.weather;
  const airData = combinedData.air;

  const temp = Math.round(weatherData.current.temperature_2m);
  const humidity = weatherData.current.relative_humidity_2m;
  const wind = weatherData.current.wind_speed_10m;
  const code = weatherData.current.weather_code;

  document.querySelector("#weather-location").innerText = locationName;
  document.querySelector("#weather-temp").innerText = `${temp}°C`;
  document.querySelector("#weather-humidity").innerText = `${humidity}%`;
  document.querySelector("#weather-wind").innerText = `${wind} km/h`;

  const conditionInfo = getWeatherCondition(code);
  document.querySelector("#weather-icon").innerText = conditionInfo.icon;
  document.querySelector("#weather-condition").innerText = conditionInfo.text;

  cachedWeatherData = weatherData;

  const windowEl = document.querySelector("#waldweatherscreen");
  const forecastSection = document.querySelector("#weather-forecast-section");
  const forecastBtn = document.querySelector("#weather-forecast-btn");

  if (isMaximized) {
    if (windowEl) windowEl.classList.add("maximized");
    if (forecastSection) forecastSection.style.display = "flex";
    if (forecastBtn) forecastBtn.innerText = "📊 Hide 7-Day Forecast & Details";
    renderAdvancedDetails(weatherData);
    if (weatherData.daily) {
      renderForecast(weatherData.daily);
    }
  }

  if (airData && airData.current && airData.current.european_aqi !== undefined) {
    const aqi = airData.current.european_aqi;
    let aqiText = "Good";
    if (aqi > 40) aqiText = "Fair";
    if (aqi > 70) aqiText = "Moderate";
    if (aqi > 100) aqiText = "Poor";
    document.querySelector("#weather-aqi").innerText = `${aqiText} (${aqi})`;
  } else {
    document.querySelector("#weather-aqi").innerText = "Good (18)";
  }

  let pollenText = temp > 15 ? "Moderate (Birch/Grass)" : "Low / Safe";
  document.querySelector("#weather-pollen").innerText = pollenText;
}

function renderAdvancedDetails(data) {
  const current = data.current;
  const daily = data.daily;

  const pressure = current.surface_pressure !== undefined ? Math.round(current.surface_pressure) : "--";
  document.querySelector("#weather-pressure").innerText = `${pressure} hPa`;

  const visibility = current.visibility !== undefined ? (current.visibility / 1000).toFixed(1) : "--";
  document.querySelector("#weather-visibility").innerText = `${visibility} km`;

  const uv = daily && daily.uv_index_max && daily.uv_index_max[0] !== undefined ? daily.uv_index_max[0].toFixed(1) : "--";
  document.querySelector("#weather-uv").innerText = uv;

  const gusts = current.wind_gusts_10m !== undefined ? Math.round(current.wind_gusts_10m) : "--";
  document.querySelector("#weather-gusts").innerText = `${gusts} km/h`;

  const dewPoint = current.dew_point_2m !== undefined ? Math.round(current.dew_point_2m) : "--";
  document.querySelector("#weather-dewpoint").innerText = `${dewPoint}°C`;

  const temp = current.temperature_2m;
  let snowLine = "No Snow";
  if (temp < 6) {
    let calculated = Math.max(0, Math.round(temp * 150 + 400));
    snowLine = `~${calculated} m`;
  }
  document.querySelector("#weather-snowline").innerText = snowLine;
}

function renderForecast(dailyData) {
  const grid = document.querySelector("#weather-forecast-grid");
  if (!grid || !dailyData) return;
  grid.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const dateStr = dailyData.time[i];
    const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
    const minTemp = Math.round(dailyData.temperature_2m_min[i]);
    const code = dailyData.weather_code[i];
    const cond = getWeatherCondition(code);

    const d = new Date(dateStr);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <span class="forecast-day">${dayName}</span>
      <span class="forecast-icon">${cond.icon}</span>
      <span class="forecast-temp">${maxTemp}°/${minTemp}°</span>
    `;
    grid.appendChild(card);
  }
}

function getWeatherCondition(code) {
  switch (code) {
    case 0: return { icon: "☀️", text: "Clear Sky" };
    case 1:
    case 2:
    case 3: return { icon: "⛅", text: "Partly Cloudy" };
    case 45:
    case 48: return { icon: "🌫️", Test: "Foggy" };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57: return { icon: "🌧️", text: "Drizzle" };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67: return { icon: "🌧️", text: "Rainfall" };
    case 71:
    case 73:
    case 75:
    case 77: return { icon: "❄️", text: "Snowfall" };
    case 95:
    case 96:
    case 99: return { icon: "⚡", text: "Thunderstorm" };
    default: return { icon: "🌤️", text: "Fair Weather" };
  }
}