document.addEventListener("DOMContentLoaded", function() {
  drawRealisticForest(0, 0);

  const calcBtn = document.querySelector("#travel-calc-btn");
  if (calcBtn) {
    calcBtn.addEventListener("click", calculateTravelStats);
  }

  // Nur das Travel-Fenster beobachten (sicher ohne Crash-Gefahr)
  const travelScreen = document.querySelector("#travelscreen");
  if (travelScreen) {
    const observer = new MutationObserver(() => {
      const isHidden = travelScreen.style.display === 'none' || 
                       travelScreen.classList.contains('hidden') || 
                       travelScreen.style.visibility === 'hidden' || 
                       travelScreen.style.opacity === '0';
      if (isHidden) {
        document.querySelectorAll('.desktop-energy-floating').forEach(el => el.remove());
      }
    });
    observer.observe(travelScreen, { attributes: true, attributeFilter: ["style", "class"] });
  }

  // Performante Animations-Schleife für Wolken-Physik (Heimweh & Kollision)
  let animationFrameId;
  function loop() {
    updateFloatingIconPositions();
    animationFrameId = requestAnimationFrame(loop);
  }
  animationFrameId = requestAnimationFrame(loop);

  // Fokus-Verlust (Tab-Out)
  window.addEventListener('blur', () => {
    document.querySelectorAll('.desktop-energy-floating').forEach(el => el.style.display = 'none');
  });

  window.addEventListener('focus', () => {
    document.querySelectorAll('.desktop-energy-floating').forEach(el => el.style.display = 'block');
  });
});

async function calculateTravelStats() {
  const startInput = document.querySelector("#travel-start").value.trim();
  const endInput = document.querySelector("#travel-end").value.trim();
  const transportMode = document.querySelector("#travel-transport").value;
  const resultsBox = document.querySelector("#travel-results");
  const forestViewport = document.querySelector("#forest-viewport");
  const canvas = document.querySelector("#travel-forest-canvas");

  if (!startInput || !endInput) {
    alert("Please enter both start and destination locations!");
    return;
  }

  try {
    const startCoords = await geocodeAddressForTravel(startInput);
    const endCoords = await geocodeAddressForTravel(endInput);

    let distanceKm = 0;
    let airDistanceKm = 0;
    let routeDuration = 0;

    const isPlane = (transportMode === "plane_commercial" || transportMode === "plane_private");

    if (isPlane) {
      // Direkte Luftlinie über Ozeane/Meere via Haversine-Formel berechnen
      const R = 6371; // Erdradius in km
      const dLat = (endCoords.lat - startCoords.lat) * Math.PI / 180;
      const dLon = (endCoords.lon - startCoords.lon) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(startCoords.lat * Math.PI / 180) * Math.cos(endCoords.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distanceKm = (R * c).toFixed(1);
      airDistanceKm = distanceKm;
      routeDuration = (distanceKm / 800) * 3600; // Geschätzte Flugdauer in Sekunden
    } else {
      // OSRM für Straßen-Fahrzeuge (funktioniert nur auf festem Land)
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=false`;
      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        distanceKm = (route.distance / 1000).toFixed(1);
        airDistanceKm = distanceKm * 0.8;
        routeDuration = route.duration;
      } else {
        alert("You´re car can´t swim that good. Please choose a different transport mode or check your locations.");
        return;
      }
    }

    let totalMinutes = 0;
    let durationText = "";
    let fuelText = "-";
    let co2Kg = 0;
    let additionalInfo = "";

    const totalLifetimeKm = 200000;
    const batteryProductionTotalKg = 6000;
    const batteryCo2PerKm = batteryProductionTotalKg / totalLifetimeKm;
    const routeBatteryCo2 = distanceKm * batteryCo2PerKm;

    switch (transportMode) {
      case "petrol_car":
        totalMinutes = Math.round(routeDuration / 60);
        const petrolLiters = (distanceKm * 7.5) / 100;
        fuelText = `${petrolLiters.toFixed(1)} Liters Gasoline`;
        co2Kg = petrolLiters * 2.33;
        break;

      case "diesel_car":
        totalMinutes = Math.round(routeDuration / 60);
        const dieselLiters = (distanceKm * 6.0) / 100;
        fuelText = `${dieselLiters.toFixed(1)} Liters Diesel`;
        co2Kg = dieselLiters * 2.64;
        break;

      case "electric_green":
        totalMinutes = Math.round(routeDuration / 60);
        const kwhGreen = (distanceKm * 18) / 100;
        fuelText = `${kwhGreen.toFixed(1)} kWh Green Electricity`;
        co2Kg = routeBatteryCo2;
        additionalInfo = `<br>🔋 <strong>Battery Production Share:</strong> ${routeBatteryCo2.toFixed(1)} kg CO₂.`;
        break;

      case "electric_gray":
        totalMinutes = Math.round(routeDuration / 60);
        const kwhGray = (distanceKm * 18) / 100;
        fuelText = `${kwhGray.toFixed(1)} kWh Gray Grid Electricity`;
        const drivingCo2Gray = kwhGray * 0.40;
        co2Kg = drivingCo2Gray + routeBatteryCo2;
        additionalInfo = `<br>🔌 <strong>Energy Breakdown:</strong> Driving: ${drivingCo2Gray.toFixed(1)} kg CO₂ + Battery: ${routeBatteryCo2.toFixed(1)} kg CO₂.`;
        break;

      case "motorcycle":
        totalMinutes = Math.round((routeDuration / 60) * 0.95);
        const motoLiters = (distanceKm * 4.5) / 100;
        fuelText = `${motoLiters.toFixed(1)} Liters Fuel`;
        co2Kg = motoLiters * 2.33;
        break;

      case "plane_commercial":
        const flightHours = (airDistanceKm / 800) + 1.5;
        totalMinutes = Math.round(flightHours * 60);
        const totalPlaneLiters = airDistanceKm * 3.5;
        const totalPlaneCo2 = totalPlaneLiters * 3.16;
        const passengerCount = 180;
        co2Kg = totalPlaneCo2 / passengerCount;
        fuelText = `~${(totalPlaneLiters / passengerCount).toFixed(1)} Liters Kerosene (Share)`;
        additionalInfo = `<br>✈️ <strong>Commercial Flight:</strong> Shared among ${passengerCount} passengers.`;
        break;

      case "plane_private":
        const jetHours = (airDistanceKm / 750) + 0.5;
        totalMinutes = Math.round(jetHours * 60);
        const totalJetLiters = airDistanceKm * 2.5;
        const totalJetCo2 = totalJetLiters * 3.16;
        const jetPassengers = 6;
        co2Kg = totalJetCo2 / jetPassengers;
        fuelText = `~${(totalJetLiters / jetPassengers).toFixed(1)} Liters Jet Fuel (Share)`;
        additionalInfo = `<br>🛫 <strong>Private Jet:</strong> Massive footprint shared by only ${jetPassengers} passengers.`;
        break;

      case "bike":
        const bikeHours = distanceKm / 18;
        totalMinutes = Math.round(bikeHours * 60);
        fuelText = `0 kcal / Muscle Power 💪`;
        co2Kg = 0;
        break;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    durationText = hours > 0 ? `${hours} hrs ${minutes} mins` : `${minutes} mins`;

    if (forestViewport && canvas) {
      forestViewport.classList.remove("large");
      forestViewport.classList.add("compact");
      canvas.width = 420;
      canvas.height = 85;
    }

    const co2PerKm = co2Kg / distanceKm;
    const intensityFactor = Math.min(1, co2PerKm / 1.5);
    const volumeFactor = Math.min(1, Math.log10(co2Kg + 1) / 3.5);
    const combinedDamage = (intensityFactor * 0.5) + (volumeFactor * 0.5);

    drawRealisticForest(combinedDamage, co2Kg);

    let cloudUnitWeight = 1; 
    if (co2Kg > 500) {
      cloudUnitWeight = 20; 
    } else if (co2Kg > 200) {
      cloudUnitWeight = 10;  
    } else if (co2Kg > 50) {
      cloudUnitWeight = 5;  
    } else if (co2Kg > 10) {
      cloudUnitWeight = 1;   
    }

    const cloudCount = Math.min(Math.round(co2Kg / cloudUnitWeight), 1000);
    renderCo2IconsEverywhere(cloudCount);

    document.querySelector("#travel-dist").innerText = `${distanceKm} km`;
    document.querySelector("#travel-time").innerText = durationText;
    document.querySelector("#travel-fuel").innerText = fuelText;
    document.querySelector("#travel-co2").innerText = `${co2Kg.toFixed(1)} kg`;

    let comparisonHTML = `<strong>💡 CO₂ Insights & Legend:</strong><br>`;
    if (co2Kg === 0) {
      comparisonHTML += `Flawless! 100% emission-free. Mother Nature thanks you! 🌲`;
    } else {
      const treeDays = Math.ceil(co2Kg / 0.06);
      comparisonHTML += `Requires <strong>1 tree about ${treeDays} days</strong> to absorb this CO₂! 🌳`;
      comparisonHTML += `<br><span style="color: #089b9b; font-size: 11px;">☁️ <strong>Cloud Legend:</strong> 1 Cloud = ${cloudUnitWeight} kg CO₂ (${cloudCount} clouds on desktop)</span>${additionalInfo}`;
    }

    document.querySelector("#travel-comparison").innerHTML = comparisonHTML;
    resultsBox.style.display = "flex";

  } catch (error) {
    alert("Error searching location: " + error.message);
  }
}

async function geocodeAddressForTravel(query) {
  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  let response = await fetch(url);
  let data = await response.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  throw new Error(`Location not found: "${query}"`);
}

function renderCo2IconsEverywhere(totalCount) {
  document.querySelectorAll('.desktop-energy-floating').forEach(el => el.remove());
  if (totalCount <= 0) return;

  for (let i = 0; i < totalCount; i++) {
    const icon = document.createElement("div");
    icon.className = "desktop-energy-floating";
    icon.innerText = "☁️";

    let x = Math.random() * (window.innerWidth - 50);
    let y = Math.random() * (window.innerHeight - 50);

    icon.dataset.originX = x;
    icon.dataset.originY = y;

    icon.style.position = "fixed";
    icon.style.zIndex = "998";
    icon.style.pointerEvents = "none";
    icon.style.fontSize = "20px";
    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;

    document.body.appendChild(icon);
  }
}

function updateFloatingIconPositions() {
  const icons = document.querySelectorAll('.desktop-energy-floating');
  if (icons.length === 0) return;

  const windows = document.querySelectorAll('#travelscreen, .window, .os-window, [class*="window"]');
  const activeWindows = Array.from(windows).filter(win => win.style.display !== 'none');

  icons.forEach(icon => {
    const originX = parseFloat(icon.dataset.originX || 0);
    const originY = parseFloat(icon.dataset.originY || 0);

    let currentX = parseFloat(icon.style.left) || originX;
    let currentY = parseFloat(icon.style.top) || originY;

    // Heimweh: Versuche sanft zum Spawnpunkt zurückzukehren
    currentX += (originX - currentX) * 0.15;
    currentY += (originY - currentY) * 0.15;

    const iconSize = 25;

    activeWindows.forEach(win => {
      const rect = win.getBoundingClientRect();
      if (rect.width > 0) {
        const padding = 10;
        if (
          currentX + iconSize >= rect.left - padding &&
          currentX <= rect.right + padding &&
          currentY + iconSize >= rect.top - padding &&
          currentY <= rect.bottom + padding
        ) {
          const distLeft = Math.abs(currentX - (rect.left - padding));
          const distRight = Math.abs((rect.right + padding) - currentX);
          const distTop = Math.abs(currentY - (rect.top - padding));
          const distBottom = Math.abs((rect.bottom + padding) - currentY);

          const minDist = Math.min(distLeft, distRight, distTop, distBottom);

          if (minDist === distLeft) currentX = rect.left - padding - iconSize;
          else if (minDist === distRight) currentX = rect.right + padding;
          else if (minDist === distTop) currentY = rect.top - padding - iconSize;
          else currentY = rect.bottom + padding;
        }
      }
    });

    icon.style.left = `${currentX}px`;
    icon.style.top = `${currentY}px`;
  });
}

function drawRealisticForest(damage, totalCo2) {
  const canvas = document.querySelector("#travel-forest-canvas");
  const badge = document.querySelector("#forest-status-badge");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;

  let skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (damage < 0.25) {
    skyGrad.addColorStop(0, "#0f2027");
    skyGrad.addColorStop(1, "#203a43");
    badge.innerText = `Ecosystem: Pristine 🌲 (${totalCo2.toFixed(0)} kg CO₂ total)`;
    badge.style.color = "#4cd137";
  } else if (damage < 0.65) {
    skyGrad.addColorStop(0, "#2c221e");
    skyGrad.addColorStop(1, "#3d3024");
    badge.innerText = `Ecosystem: Stressed 🍂 (${totalCo2.toFixed(0)} kg CO₂ total)`;
    badge.style.color = "#fbc531";
  } else {
    skyGrad.addColorStop(0, "#1a1a1a");
    skyGrad.addColorStop(1, "#2b2321");
    badge.innerText = `Ecosystem: Collapsed 💀 (${totalCo2.toFixed(0)} kg CO₂ total)`;
    badge.style.color = "#e84118";
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = `rgb(${Math.floor(34 - damage * 15)}, ${Math.floor(49 - damage * 30)}, ${Math.floor(34 - damage * 20)})`;
  ctx.fillRect(0, height - 15, width, 15);

  const treeCount = 20;
  for (let i = 0; i < treeCount; i++) {
    let x = (width / treeCount) * i + (i % 2) * 6 + 4;
    let y = height - 12;
    let treeHeight = (height > 100 ? 55 : 32) + (i % 5) * 8;
    let treeWidth = 14 + (i % 3) * 5;
    let individualDamage = Math.min(1, Math.max(0, damage * 1.2 - (i % 4) * 0.08));

    drawDetailedTree(ctx, x, y, treeWidth, treeHeight, individualDamage);
  }
}

function drawDetailedTree(ctx, x, y, w, h, damage) {
  ctx.fillStyle = damage > 0.8 ? "#3d2817" : "#4a3525";
  ctx.fillRect(x - w / 6, y - h * 0.35, w / 3, h * 0.35);

  if (damage >= 0.9) {
    ctx.fillStyle = "#261a10";
    ctx.fillRect(x - w / 4, y - h * 0.15, w / 2, h * 0.15);
    return;
  }

  let r = Math.floor(34 + damage * 150);
  let g = Math.floor(139 - damage * 90);
  let b = Math.floor(34 - damage * 30);
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

  if (damage < 0.4) {
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x - w, y - h * 0.3);
    ctx.lineTo(x + w, y - h * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y - h * 0.7);
    ctx.lineTo(x - w * 1.2, y - h * 0.1);
    ctx.lineTo(x + w * 1.2, y - h * 0.1);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(x, y - h * 0.7, w * 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#2b1d12";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - h * 0.4);
    ctx.lineTo(x - w * 0.8, y - h * 0.7);
    ctx.moveTo(x, y - h * 0.5);
    ctx.lineTo(x + w * 0.9, y - h * 0.8);
    ctx.stroke();
  }
}