function saveUserGPS() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var userGPS = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
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

function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timetext = document.querySelector("#time");
  timetext.innerHTML = currentTime;}
setInterval(updateTime, 1000);

dragElement(document.getElementById("Hauptseite"));
dragElement(document.getElementById("trumpetscreen")); 
dragElement(document.getElementById("notescreen"));
dragElement(document.getElementById("searchmachinescreen"));
dragElement(document.getElementById("youtubescreen"));
dragElement(document.getElementById("wikipediascreen"));
dragElement(document.getElementById("mapscreen"));
dragElement(document.getElementById("stargazerscreen"));
dragElement(document.getElementById("aiscreen"));
dragElement(document.getElementById("clockscreen"));
dragElement(document.getElementById("racerscreen"));


const fullscreenBtn = document.getElementById("fullscreen-btn-WaldOS");
const overlayWaldOS = document.getElementById("fullscreen-btn-WaldOS");

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error trying to enable W(ald)wormhole: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      overlayWaldOS.classList.add("hidden");
    } else {
      overlayWaldOS.classList.remove("hidden");
      pIframe.src = '';
      const windowMappings =[
        { element: welcomescreen, underline: welcome },
        { element: trumpetscreen, underline: trumpet },
        { element: notescreen, underline: notes },
        { element: searchmachinescreen, underline: searchmachine },
        { element: youtubescreen, underline: youtube },
        { element: wikipediascreen},
        { element: calendarscreen},
        { element: mapscreen, underline: map },
        { element: settingscreen, underline: settings },
        { element: calculatorscreen, underline: calculator },
        { element: Stargazerscreen, underline: stargazer },
        { element: aiscreen, underline: waldai },
        { element: clockscreen, underline: clock },
        { element: waldracer, underline: racer },
      ];

      windowMappings.forEach(item => {
          closewindow(item.element, item.underline);
      })
    }
  });


function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  if (document.getElementById(element.id + "header")) {
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();

    element.style.transform = "none";
    initialX = e.clientX;
    initialY = e.clientY;
  
    document.onmouseup = stopDragging;
    document.onmousemove = Elementdrag;
  }
  function Elementdrag(e) {
    e = e || window.event;
    e.preventDefault();

    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const taskbarHeight = 70;
    
    let targetTop = element.offsetTop - currentY;
    let targetLeft = element.offsetLeft - currentX;

    const maxTop = window.innerHeight - element.offsetHeight - 70; 
    const maxLeft = window.innerWidth - element.offsetWidth;

    element.style.top = Math.max(0, Math.min(targetTop, maxTop)) + "px";
    element.style.left = Math.max(0, Math.min(targetLeft, maxLeft)) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var welcomescreen = document.querySelector("#Hauptseite");
var trumpetscreen = document.querySelector("#trumpetscreen");
var notescreen = document.querySelector("#notescreen");
var searchmachinescreen = document.querySelector("#searchmachinescreen");
var youtubescreen = document.querySelector("#youtubescreen");
var wikipediascreen = document.querySelector("#wikipediascreen");
var mapscreen = document.querySelector("#mapscreen");
var settingscreen = document.querySelector("#settingscreen");
var calculatorscreen = document.querySelector("#calculatorscreen");
var Stargazerscreen = document.querySelector("#stargazerscreen");
var aiscreen = document.querySelector("#aiscreen");
var clockscreen = document.querySelector("#clockscreen");
var waldracer = document.querySelector("#waldracer");

var welcome = document.querySelector("#welcome");
var trumpet = document.querySelector("#trumpet");
var notes = document.querySelector("#notes");
var searchmachine = document.querySelector("#searchmachine");
var youtube = document.querySelector("#youtube");
var map = document.querySelector("#map");
var settings = document.querySelector("#settings");
var calculator = document.querySelector("#calculator");
var stargazer = document.querySelector("#stargazer");
var waldai = document.querySelector("#waldai");
var clock = document.querySelector("#clock");
var racer = document.querySelector("#racer");

var openwelcomescreen = document.querySelector("#openwelcomescreen");
var opentrumpetscreen = document.querySelector("#opentrumpetscreen");
var opennotescreen = document.querySelector("#opennotescreen");
var opensearchmachinescreen = document.querySelector("#opensearchmachinescreen");
var openyoutubescreen = document.querySelector("#openyoutubescreen");
var openmapscreen = document.querySelector("#openmapscreen");
var opensettingscreen = document.querySelector("#opensettingscreen");
var opencalculatorscreen = document.querySelector("#opencalculatorscreen");
var openstargazerscreen = document.querySelector("#openstargazerscreen");
var openwaldaiscreen = document.querySelector("#openwaldaiscreen");
var openclockscreen = document.querySelector("#openclockscreen");
var openracerscreen = document.querySelector("#openracerscreen");

var closewelcomescreen = document.querySelector("#closewelcomescreen");
var closetrumpetscreen = document.querySelector("#closetrumpetscreen");
var closenotescreen = document.querySelector("#closenotescreen");
var closesearchmachinescreen = document.querySelector("#closesearchmachinescreen");
var closeyoutubescreen = document.querySelector("#closeyoutubescreen");
var closemapscreen = document.querySelector("#closemapscreen");
var closecallendarscreen = document.querySelector("#closecalendarscreen");
var closesettingscreen = document.querySelector("#closesettingscreen");
var closecalculatorscreen = document.querySelector("#closecalculatorscreen");
var closestargazerscreen = document.querySelector("#closestargazerscreen");
var closeaiscreen = document.querySelector("#closeaiscreen");
var closeclockscreen = document.querySelector("#closeclockscreen");
var closeracerscreen = document.querySelector("#closeracerscreen");

function closewindow(element, underline) {
  if (!element) return;
  element.style.display = "none";
  if (underline) {
    underline.classList.remove("selected");
    underline.classList.add("unselected");
  }
}

function openwindow(element, underline) {
  if (!element) return;
  element.style.display = "flex";
  
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (Blurscreen) Blurscreen.style.zIndex = biggestIndex + 1;
  if (topbar) topbar.style.zIndex = biggestIndex + 2;
  if (underline){
    underline.classList.remove("unselected");
    underline.classList.add("selected");
  }

  if (element.id === "mapscreen") {
    if (!osmMap && typeof L !== "undefined") {
      var defaultLat = 47.4212;
      var defaultLon = 10.9863;

      osmMap = L.map('mapcontent', { zoomControl: false }).setView([defaultLat, defaultLon], 13);
      const mapElement = document.querySelector("#mapcontent");

      if (mapElement && osmMap) {
        const mapResizeObserver = new ResizeObserver(() => {
          osmMap.invalidateSize();
        });
        
        mapResizeObserver.observe(mapElement);
      }
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        keepBuffer: 200,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(osmMap);

      renderCustomPins();

      osmMap.on('click', function (e) {
        let popupContent = document.createElement('div');
        popupContent.className = 'map-popup-content';

        popupContent.innerHTML = `
          <strong class="map-popup-title">Setup your Launchpad to save it for the rocketstart!</strong>
          <div class="map-popup-input-row">
            <select id="new-pin-emoji" class="map-popup-select">
              <option value="📍">📍 Marker</option>
              <option value="🏠">🏠 Home</option>
              <option value="🚀">🚀 Rocketcenter</option>
              <option value="❤️">❤️ You won´t need this XD</option>
              <option value="🌲">🌲 Some Forest?</option>
              <option value="🍕">🍕 Foodplace</option>
              <option value="☕">☕ Coffeeshop</option>
              <option value="🏖️">🏖️ Beach</option>
              <option value="⛺">⛺ Camping</option>
              <option value="🎯">🎯 Your goal</option>
              <option value="⭐">⭐ Star</option>
              <option value="🚗">🚗 Car</option>
              <option value="✈️">✈️ Plane</option>
              <option value="🏙️">🏙️ Cities</option>
              <option value="🎮">🎮 Gaming</option>
              <option value="💼">💼 Co-Workspace</option>
              <option value="🛒">🛒 Grocery Store</option>
              <option value="🍻">🍻 Bar (don´t go here to often!)</option>
              <option value="🏰">🏰 Castle</option>
              <option value="⚡">⚡ Energy</option>
            </select>
            <input type="text" id="new-pin-name" class="map-popup-input" placeholder="Name your Launchpad...">
          </div>
          <button id="save-pin-btn" class="map-popup-save-btn">Save the location to start the rocket!</button>
        `;

        let popup = L.popup({ minWidth: 100, maxWidth: 370 })
          .setLatLng(e.latlng)
          .setContent(popupContent)
          .openOn(osmMap);

        setTimeout(() => {
          let input = popupContent.querySelector('#new-pin-name');
          if (input) input.focus();
        }, 100);

        let saveBtn = popupContent.querySelector('#save-pin-btn');
        let inputField = popupContent.querySelector('#new-pin-name');
        let emojiSelect = popupContent.querySelector('#new-pin-emoji');

        function savePin() {
          let pinName = inputField ? inputField.value.trim() : '';
          let selectedEmoji = emojiSelect ? emojiSelect.value : '📍';

          if (pinName !== "") {
            customPinsData.push({
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              name: pinName,
              emoji: selectedEmoji
            });

            localStorage.setItem('waldos_custom_pins', JSON.stringify(customPinsData));
            renderCustomPins();
            osmMap.closePopup(popup);
          }
        }

        saveBtn.onclick = savePin;
        inputField.onkeypress = function (evt) {
          if (evt.key === 'Enter') {
            savePin();
          }
        };
      });

      const savedLocation = sessionStorage.getItem("waldsky_location") || localStorage.getItem("userGPS");
      let userLat = null;
      let userLon = null;

      if (savedLocation) {
        try {
          const coords = JSON.parse(savedLocation);
          userLat = coords.lat;
          userLon = coords.lon;
        } catch (e) {
          console.warn("Error parsing saved location:", e);
        }
      }

      L.marker([defaultLat, defaultLon]).addTo(osmMap)
        .bindPopup('WaldOS HQ 💻');

      if (userLat && userLon) {
        osmMap.setView([userLat, userLon], 15);
        L.marker([userLat, userLon]).addTo(osmMap)
          .bindPopup('🚀 Your current spaceship position')
          .openPopup();
      } else {
        osmMap.setView([defaultLat, defaultLon], 13);
      }
    }

    if (osmMap) {
      setTimeout(() => {
        osmMap.invalidateSize();
      }, 50);
    }
  }
}

function visible(element) { 
  return window.getComputedStyle(element).display !== "none"; 
}

// Settingscreen
opensettingscreen.addEventListener("click", function() {
  if (visible(settingsscreen)){
    closewindow(settingsscreen, settings);
  }
  else{
    openwindow(settingsscreen, settings);
  }
})

// Welcomescreen
openwelcomescreen.addEventListener("click", function() {
  if (visible(welcomescreen)){
    closewindow(welcomescreen, welcome);
  }
  else{
    openwindow(welcomescreen, welcome);
  }
});

// Trumpetscreen
opentrumpetscreen.addEventListener("click", function() {
  if (visible(trumpetscreen)){
    closewindow(trumpetscreen, trumpet);
  }
  else{
    openwindow(trumpetscreen, trumpet);
  }
});

// Notesscreen
opennotescreen.addEventListener("click", function() {
  if (visible(notescreen)){
    closewindow(notescreen, notes);
  }
  else{
    openwindow(notescreen, notes);
  }
});

// Searchmachinescreen
opensearchmachinescreen.addEventListener("click", function() {
  if (visible(searchmachinescreen)) {
    closewindow(searchmachinescreen, searchmachine);
  }
  else{
    openwindow(searchmachinescreen, searchmachine);
  }
});

// Youtubescreen
openyoutubescreen.addEventListener("click", function() {
  if (visible(youtubescreen)) {
    closewindow(youtubescreen, youtube);
  }
  else{
    openwindow(youtubescreen, youtube);
  }
});

//Mapscreen
openmapscreen.addEventListener("click", function() {
  if (visible(mapscreen)) {
    closewindow(mapscreen, map);
  } 
  else{
    openwindow(mapscreen, map);
  }
});

//Calculatorscreen
opencalculatorscreen.addEventListener("click", function() {
  if (visible(calculatorscreen)) {
    closewindow(calculatorscreen, calculator);
  } 
  else{
    openwindow(calculatorscreen, calculator);
  }
});

openstargazerscreen.addEventListener("click", function() {
  if (visible(stargazerscreen)) {
    closewindow(stargazerscreen, stargazer);
  } 
  else{
    openwindow(stargazerscreen, stargazer);
  }
})

openwaldaiscreen.addEventListener("click", function() {
  if (visible(aiscreen)) {
    closewindow(aiscreen, waldai);
  } 
  else{
    openwindow(aiscreen, waldai);
  }
})

openclockscreen.addEventListener("click", function() {
  if (visible(clockscreen)) {
    closewindow(clockscreen, clock);
  }
  else{
    openwindow(clockscreen, clock);
  }
})

openracerscreen.addEventListener("click", function() {
  if (visible(racerscreen)) {
    closewindow(racerscreen, racer);
  }
  else{
    openwindow(racerscreen, racer);
  }
})



if (closesettingscreen) {
  closesettingscreen.addEventListener("click", function() {
    closewindow(settingsscreen, settings);
  });
}

if (closewelcomescreen) {
  closewelcomescreen.addEventListener("click", function() {
    closewindow(welcomescreen, welcome);
  });
}

if (closetrumpetscreen) {
  closetrumpetscreen.addEventListener("click", function() {
    closewindow(trumpetscreen, trumpet);
  });
}

if (closenotescreen) {
  closenotescreen.addEventListener("click", function() {
    closewindow(notescreen, notes);
  });
}

if (closesearchmachinescreen) {
  closesearchmachinescreen.addEventListener("click", function() {
    closewindow(searchmachinescreen, searchmachine);
    closewindow(wikipediascreen);
  });
}

if (closeyoutubescreen) {
  closeyoutubescreen.addEventListener("click", function() {
    closewindow(youtubescreen, youtube);
  });
}

if (closemapscreen) {
  closemapscreen.addEventListener("click", function() {
    closewindow(mapscreen, map);
  });
}

if (closewikipediascreen) {
  closewikipediascreen.addEventListener("click", function() {
    closewindow(wikipediascreen);
  });
}

if (closecallendarscreen) {
  closecallendarscreen.addEventListener("click", function() {
    closewindow(calendarscreen);
  });
}

if (closecalculatorscreen) {
  closecalculatorscreen.addEventListener("click", function() {
    closewindow(calculatorscreen, calculator);
  });
}

if (closestargazerscreen) {
  closestargazerscreen.addEventListener("click", function() {
    closewindow(stargazerscreen, stargazer);
  });
}

if (closeaiscreen) {
  closeaiscreen.addEventListener("click", function() {
    closewindow(aiscreen, waldai);
  });
}

if (closeclockscreen) {
  closeclockscreen.addEventListener("click", function() {
    closewindow(clockscreen, clock);
  });
}

if (closeracerscreen) {
  closeracerscreen.addEventListener("click", function() {
    closewindow(racerscreen, racer);
  })
}

var clockelement = document.querySelector("#togglecalendarscreen");
var calendarscreen = document.querySelector("#calendarscreen");

if (clockelement && calendarscreen) {
  clockelement.addEventListener("click", function() {
    var notVisible = window.getComputedStyle(calendarscreen).display === "none";
    if (notVisible) {
      openwindow(calendarscreen);
    } else {
      closewindow(calendarscreen);
    }
  });
}



var Blurscreen = document.querySelector("#fullscreen-btn-WaldOS");

var biggestIndex = 1;

function addwindowtaphandling(element) {
  if (!element) return;
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

addwindowtaphandling(welcomescreen);
addwindowtaphandling(trumpetscreen);
addwindowtaphandling(notescreen);
addwindowtaphandling(searchmachinescreen);
addwindowtaphandling(youtubescreen);
addwindowtaphandling(wikipediascreen);
addwindowtaphandling(calendarscreen);
addwindowtaphandling(mapscreen);
addwindowtaphandling(settingsscreen);
addwindowtaphandling(calculatorscreen);
addwindowtaphandling(stargazerscreen);
addwindowtaphandling(aiscreen);
addwindowtaphandling(clockscreen);
addwindowtaphandling(racerscreen);


function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  Blurscreen.style.zIndex = biggestIndex + 1;
}

var trumpetscreen = document.querySelector("#trumpetscreen");
var maximizeTrumpetScreenButton = document.querySelector("#maximizetrumpetscreen");
var notescreen = document.querySelector("#notescreen");
var maximizeNoteScreenButton = document.querySelector("#maximizenotescreen");
var youtubescreen = document.querySelector("#youtubescreen");
var maximizeYoutubeScreenButton = document.querySelector("#maximizeyoutubescreen");
var searchmachinescreen = document.querySelector("#searchmachinescreen");
var maximizeSearchmachineScreenButton = document.querySelector("#maximizesearchmachinescreen");
var wikipediascreen = document.querySelector("#wikipediascreen");
var maximizeWikipediaScreenButton = document.querySelector("#maximizewikipediascreen");
var mapscreen = document.querySelector("#mapscreen");
var maximizeMapScreenButton = document.querySelector("#maximizemapscreen");
var stargazerscreen = document.querySelector("#stargazerscreen");
var maximizeStargazerScreenButton = document.querySelector("#maximizestargazerscreen");
var aiscreen = document.querySelector("#aiscreen");
var maximizeAIScreenButton = document.querySelector("#maximizeaiscreen");
var clockscreen = document.querySelector("#clockscreen");
var maximizeClockScreenButton = document.querySelector("#maximizeclockscreen");
var racerscreen = document.querySelector("#racerscreen");
var maximizeRacerScreenButton = document.querySelector("#maximizeracerscreen");


function maximizeWindow(element) {
  element.classList.toggle("maximized");
  element.style.top = "";
  element.style.left = "";

  if (!element.classList.contains("maximized")) {
    element.style.width = "";
    element.style.height = "";
  }
}

function fullscreenWindow(element) {
  element.classList.toggle("fullscreen");
  element.style.top = "";
  element.style.left = "";

  if (!element.classList.contains("fullscreen")) {
    element.style.width = "";
    element.style.height = "";
  }
}

if (maximizeTrumpetScreenButton) {
  maximizeTrumpetScreenButton.addEventListener("click", function() {
    maximizeWindow(trumpetscreen);
  });
} 

if (maximizeNoteScreenButton) {
  maximizeNoteScreenButton.addEventListener("click", function() {
    maximizeWindow(notescreen);
  });
}
if (maximizeYoutubeScreenButton) {
  maximizeYoutubeScreenButton.addEventListener("click", function() {
    maximizeWindow(youtubescreen);
  });
}

if (maximizeSearchmachineScreenButton) {
  maximizeSearchmachineScreenButton.addEventListener("click", function(){
    maximizeWindow(searchmachinescreen);
  });
}

if (maximizeWikipediaScreenButton) {
  maximizeWikipediaScreenButton.addEventListener("click", function(){
    maximizeWindow(wikipediascreen);
  });
}

if (maximizeMapScreenButton) {
  maximizeMapScreenButton.addEventListener("click", function(){
    maximizeWindow(mapscreen);
  })
}

if (maximizeStargazerScreenButton) {
  maximizeStargazerScreenButton.addEventListener("click", function(){
    maximizeWindow(stargazerscreen);
  })  
}

if (maximizeAIScreenButton) {
  maximizeAIScreenButton.addEventListener("click", function(){
    maximizeWindow(aiscreen);
  })
}

if (maximizeClockScreenButton) {
  maximizeClockScreenButton.addEventListener("click", function(){
    maximizeWindow(clockscreen);
  })
}

if (maximizeRacerScreenButton) {
  maximizeRacerScreenButton.addEventListener("click", function(){
    fullscreenWindow(racerscreen);
  })
}


// Save notes 

document.addEventListener("DOMContentLoaded", function() {
    var notesTextarea = document.querySelector("#notes-textarea");

    if (notesTextarea) {
        var savedNotes = localStorage.getItem("waldos_notes");
        
        if (savedNotes !== null) {
            notesTextarea.value = savedNotes;
        }

        notesTextarea.addEventListener("input", function() {
            localStorage.setItem("waldos_notes", notesTextarea.value);
        });
    }
});


// YouTube-Surchbar

const API_KEY = "AIzaSyBPTc_wbo3dpmEYEd-g-zNu7vmv8oYLFUQ";

var ytSearchInput = document.querySelector("#yt-search-input");
var ytSearchBtn = document.querySelector("#yt-search-btn");
var ytPlayerContainer = document.querySelector("#yt-player-container");
var ytResultsContainer = document.querySelector("#yt-results-container");
var ytPlayer = document.querySelector("#yt-player");
var ytLogo = document.querySelector("#yt-logo");
var pContainer = ytPlayerContainer || document.querySelector("#yt-player-container");
var pIframe = ytPlayer || document.querySelector("#yt-player");

async function performYtSearch() {
  if (!ytSearchInput) return;
  const query = ytSearchInput.value.trim();
  if (!query) return;

  if (ytLogo) ytLogo.style.display = "none";
  if (pContainer) pContainer.style.display = 'none';
  if (pIframe) {
    pIframe.style.display = 'none';
    pIframe.src = '';
  }

  ytResultsContainer.innerHTML = '<p class="yt-msg-info">Spaceship is diving into the W(ald)wormhole...</p>';

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      ytResultsContainer.innerHTML = `<p class="yt-msg-error">API-Fehler: ${data.error.message}</p>`;
      return;
    }

    if (data.items && data.items.length > 0) {
      ytResultsContainer.innerHTML = '';
      data.items.forEach(item => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const author = item.snippet.channelTitle;
        const thumbnail = item.snippet.thumbnails.medium.url;

        const card = document.createElement('div');
        card.className = 'yt-card';
        card.innerHTML = `
          <img src="${thumbnail}" class="yt-card-thumb">
          <div class="yt-card-info">
            <div class="yt-card-title">${title}</div>
            <div class="yt-card-author">${author}</div>
          </div>
        `;
        
        card.addEventListener('click', () => {
          var activeContainer = document.querySelector("#yt-player-container");
          var activeIframe = document.querySelector("#yt-player");
          var ytApp = document.querySelector(".youtube-app");
          var activeLogo = document.querySelector("#yt-logo");

          if (activeLogo) activeLogo.style.display = "none";

          if (activeContainer && activeIframe) {
            activeContainer.style.display = 'block';
            activeIframe.style.display = 'block';
            activeIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
            
            if (ytApp) {
              ytApp.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        });
        ytResultsContainer.appendChild(card);
      });
    } else {
      ytResultsContainer.innerHTML = '<p class="yt-msg-error">This part of the W(ald)wormhole is empty.</p>';
    }
  } catch (err) {
    ytResultsContainer.innerHTML = '<p class="yt-msg-error">Your Spaceship has a problem by reaching the W(ald)wormhole.</p>';
  }
}

if (ytSearchBtn && ytSearchInput) {
  ytSearchBtn.addEventListener("click", performYtSearch);
  ytSearchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      performYtSearch();
    }
  });
}

// Waldsearch

var searchInputSearchapp = document.querySelector("#waldos-search-input");
var searchBtnSearchapp = document.querySelector("#waldos-search-btn");
var resultsContainerSearchapp = document.querySelector("#search-results-container");

function runWaldosSearch() {
  var query = searchInputSearchapp.value.trim();
  if (!query) return;

  resultsContainerSearchapp.innerHTML = '<p class="search-msg-info">Diving into the W(ald)wormhole...</p>';

  var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" 
               + encodeURIComponent(query) 
               + "&format=json&origin=*";

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      resultsContainerSearchapp.innerHTML = "";
      var results = data.query.search;

      if (results.length === 0) {
        resultsContainerSearchapp.innerHTML = '<p class="search-msg-error">The W(ald)wormhole is empty.</p>';
        return;
      }

      results.forEach(function(item) {
        var card = document.createElement("div");
        card.className = "search-card";

        var title = document.createElement("h3");
        title.className = "search-card-title";
        
        var link = document.createElement("a");
        link.href = "#";
        link.className = "search-card-link";
        link.textContent = item.title;

        link.addEventListener("click", function(e) {
          e.preventDefault();
          
          var wikiIframe = document.querySelector("#wikipediaframe");
          var wikipediascreen = document.querySelector("#wikipediascreen");

          if (wikiIframe && wikipediascreen) {
            wikiIframe.src = "https://en.m.wikipedia.org/wiki/" + encodeURIComponent(item.title);
            openwindow(wikipediascreen);
          }
        });

        title.appendChild(link);

        var snippet = document.createElement("p");
        snippet.className = "search-card-snippet";
        snippet.innerHTML = item.snippet + "...";

        card.appendChild(title);
        card.appendChild(snippet);
        resultsContainerSearchapp.appendChild(card);
      });
    })
    .catch(function(error) {
      resultsContainerSearchapp.innerHTML = '<p class="search-msg-error">No Results!</p>';
    });
}

if (searchBtnSearchapp && searchInputSearchapp && resultsContainerSearchapp) {
  searchBtnSearchapp.addEventListener("click", runWaldosSearch);
  
  searchInputSearchapp.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      runWaldosSearch();
    }
  });
}


// Mooncalendar
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var dateInput = document.querySelector("#calendar-date");
    var timeInput = document.querySelector("#calendar-time");
    var textInput = document.querySelector("#calendar-text");
    var addButton = document.querySelector("#calendar-add-button");
    var listContainer = document.querySelector("#calendar-list");

    if (!addButton || !listContainer) return;

    var STORAGE_KEY = "waldos_mooncalendar_events";

    function getStoredEvents() {
      var saved = localStorage.getItem(STORAGE_KEY);
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }

    function setStoredEvents(events) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }

    function renderEvents() {
      var events = getStoredEvents();
      listContainer.innerHTML = "";

      if (events.length === 0) {
        listContainer.innerHTML = '<p class="calendar-empty-msg">No takeoff dates saved yet.</p>';
        return;
      }

      events.sort(function (a, b) {
        var keyA = (a.date || "") + " " + (a.time || "00:00");
        var keyB = (b.date || "") + " " + (b.time || "00:00");
        return keyA.localeCompare(keyB);
      });

      events.forEach(function (eventItem, index) {
        var card = document.createElement("div");
        card.className = "calendar-item";

        var infoContainer = document.createElement("div");
        infoContainer.className = "calendar-item-info";

        var safeText = eventItem.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        infoContainer.innerHTML = '<strong class="calendar-item-text">' + safeText + '</strong>' +
                                  '<small class="calendar-item-date">📅 ' + (eventItem.date || "No date") + (eventItem.time ? ' ⏰ ' + eventItem.time : '') + '</small>';

        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✖";
        deleteBtn.className = "calendar-delete-btn";

        deleteBtn.addEventListener("click", function () {
          var currentEvents = getStoredEvents();
          currentEvents.splice(index, 1);
          setStoredEvents(currentEvents);
          renderEvents();
        });

        card.appendChild(infoContainer);
        card.appendChild(deleteBtn);
        listContainer.appendChild(card);
      });
    }

    addButton.addEventListener("click", function () {
      var dateVal = dateInput ? dateInput.value : "";
      var timeVal = timeInput ? timeInput.value : "";
      var textVal = textInput ? textInput.value.trim() : "";

      if (!textVal) {
        alert("Your litle catbaby needs a name! 😸");
        return;
      }

      if (!dateVal) {
        alert("How shall it work without a date, stupid!");
        return;
      }

      var events = getStoredEvents();
      events.push({
        text: textVal,
        date: dateVal,
        time: timeVal
      });

      setStoredEvents(events);

      if (textInput) textInput.value = "";
      if (timeInput) timeInput.value = "";

      renderEvents();
    });

    renderEvents();
  });
})();

// Waldlas

let osmMap = null;

let customPinsData = JSON.parse(localStorage.getItem('waldos_custom_pins')) || [];
let customMarkers = [];

function renderCustomPins() {
  customMarkers.forEach(m => osmMap.removeLayer(m));
  customMarkers = [];

  customPinsData.forEach((pin, index) => {
    let pinEmoji = pin.emoji || '📍';

    let emojiIcon = L.divIcon({
      className: 'custom-emoji-pin',
      html: `<div class="map-emoji-icon">${pinEmoji}</div>`,
      iconSize: [40, 40],
      iconAnchor: [24, 24]
    });

    let marker = L.marker([pin.lat, pin.lng], { icon: emojiIcon }).addTo(osmMap);

    let container = document.createElement('div');
    container.className = 'map-pin-popup-container';
    container.innerHTML = `<strong class="map-pin-popup-title">${pinEmoji} ${pin.name}</strong><br>`;

    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete this pin";
    deleteBtn.className = "map-delete-pin-btn";

    deleteBtn.onclick = function () {
      customPinsData.splice(index, 1);
      localStorage.setItem('waldos_custom_pins', JSON.stringify(customPinsData));
      renderCustomPins();
    };

    container.appendChild(deleteBtn);
    marker.bindPopup(container);
    customMarkers.push(marker);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var searchBtn = document.querySelector("#map-search-button");
  var searchInput = document.querySelector("#map-search-input");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", performMapSearch);
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performMapSearch();
      }
    });
  }
});

function performMapSearch() {
  var searchInput = document.querySelector("#map-search-input");
  if (!searchInput || !osmMap) return;

  var query = searchInput.value.trim();
  if (!query) return;

  var nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  fetch(nominatimUrl, {
    headers: {
      'User-Agent': 'WaldOS-MapApp'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data && data.length > 0) {
        var lat = parseFloat(data[0].lat);
        var lon = parseFloat(data[0].lon);
        var displayName = data[0].display_name;

        osmMap.setView([lat, lon], 13);

        L.marker([lat, lon]).addTo(osmMap)
          .bindPopup(displayName)
          .openPopup();
      } else {
        alert("The place is in outerspace.");
      }
    })
    .catch(function (err) {
      console.error("Your Spaceship is lost in the W(ald)hormhole.", err);
    });
}

let currentRouteLayer = null;

function toggleRouteSidebar() {
  let sidebar = document.getElementById('route-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

async function geocodeAddress(query) {
  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error("Netzwerkfehler bei der Adresssuche.");
  }
  
  let data = await response.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  throw new Error(`No result found for address: "${query}". Please only addresses on earth.`);
}

async function calculateCarRoute() {
  let startInput = document.getElementById('route-start').value.trim();
  let endInput = document.getElementById('route-end').value.trim();

  if (!startInput || !endInput) {
    alert("You need a begin and an end address.");
    return;
  }

  try {
    let startCoords = await geocodeAddress(startInput);
    let endCoords = await geocodeAddress(endInput);

    let osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson`;
    
    let routeResponse = await fetch(osrmUrl);
    let routeData = await routeResponse.json();

    if (routeData.code === "Ok" && routeData.routes && routeData.routes.length > 0) {
      clearCarRoute();

      let route = routeData.routes[0];
      let routeGeoJSON = route.geometry;

      let distanceKm = (route.distance / 1000).toFixed(1);
      let distanceMiles = (route.distance / 1609.34).toFixed(1);
      let totalMinutes = Math.round(route.duration / 60);
      let hours = Math.floor(totalMinutes / 60);
      let minutes = totalMinutes % 60;

      let durationText = hours > 0 ? `${hours} Std. ${minutes} Min.` : `${minutes} Min.`;

      document.getElementById('route-distance').innerText = `${distanceKm} km`;
      document.getElementById('route-distance-miles').innerText = `${distanceMiles} mi`;
      document.getElementById('route-duration').innerText = durationText;
      document.getElementById('route-info').style.display = 'flex';

      currentRouteLayer = L.geoJSON(routeGeoJSON, {
        style: {
          color: '#089b9b',
          weight: 6,
          opacity: 0.8
        }
      }).addTo(osmMap);

      osmMap.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });
    } else {
      alert("Your rocket is too big for this route.");
    }
  } catch (error) {
    alert(error.message || "Fehler bei der Routenberechnung.");
  }
}

function clearCarRoute() {
  if (currentRouteLayer && osmMap) {
    osmMap.removeLayer(currentRouteLayer);
    currentRouteLayer = null;
  }
  let infoBox = document.getElementById('route-info');
  if (infoBox) {
    infoBox.style.display = 'none';
  }
}




// Starbackground
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  const toHex = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lerp(start, end, factor = 0.05) {
  return start + (end - start) * factor;
}

// Intro-Steuerung
let introTime = 0;
const INTRO_DURATION = 7.5; // Dauer der Kreis- und Verteilungsanimation in Sekunden
let isstarted = false;

// Flags für Steuerung der CSS-Animationen
let titleFlyInTriggered = false;
let screenShakeTriggered = false;

let speedMultiplier = 1.0;
let connectionRadius = 120;
let cursorRadius = 160;
let numStars = 230;
let maxShootingStars = 3;

let currStarColor = { r: 255, g: 255, b: 255 };
let currLineColor = { r: 8, g: 155, b: 155 };
let currBgInner = { r: 16, g: 21, b: 29 };
let currBgOuter = { r: 5, g: 7, b: 10 };

let targetSpeed = 1.0;
let targetConnRadius = 120;
let targetCursorRadius = 160;
let targetStarColor = { r: 255, g: 255, b: 255 };
let targetLineColor = { r: 8, g: 155, b: 155 };
let targetBgInner = { r: 16, g: 21, b: 29 };
let targetBgOuter = { r: 5, g: 7, b: 10 };
let targetShootingStars = 3;

const stars = [];
const shootingStars = [];

const presets = {
  classic: {
    stars: 300,
    connRadius: 120,
    cursorRadius: 160,
    speed: 1.0,
    starColor: { r: 255, g: 255, b: 255 },
    lineColor: { r: 8, g: 155, b: 155 },
    bgInner: { r: 16, g: 21, b: 29 },
    bgOuter: { r: 5, g: 7, b: 10 },
    shootingStars: 3
  },
  supernova: {
    stars: 280,
    connRadius: 140,
    cursorRadius: 180,
    speed: 1.2,
    starColor: { r: 255, g: 51, b: 51 },
    lineColor: { r: 255, g: 102, b: 0 },
    bgInner: { r: 40, g: 0, b: 0 },
    bgOuter: { r: 10, g: 0, b: 0 },
    shootingStars: 4
  },
  cyberpunk: {
    stars: 350,
    connRadius: 150,
    cursorRadius: 200,
    speed: 1.5,
    starColor: { r: 255, g: 0, b: 127 },
    lineColor: { r: 0, g: 243, b: 255 },
    bgInner: { r: 30, g: 5, b: 50 },
    bgOuter: { r: 13, g: 2, b: 26 },
    shootingStars: 100
  },
  deepspace: {
    stars: 120,
    connRadius: 300,
    cursorRadius: 230,
    speed: 0.5,
    starColor: { r: 130, g: 170, b: 255 },
    lineColor: { r: 199, g: 146, b: 234 },
    bgInner: { r: 10, g: 20, b: 40 },
    bgOuter: { r: 2, g: 4, b: 8 },
    shootingStars: 2
  },
  matrix: {
    stars: 700,
    connRadius: 300,
    cursorRadius: 170,
    speed: 2.0,
    starColor: { r: 0, g: 255, b: 102 },
    lineColor: { r: 0, g: 204, b: 68 },
    bgInner: { r: 0, g: 30, b: 12 },
    bgOuter: { r: 0, g: 10, b: 4 },
    shootingStars: 5
  },
  night: {
    stars: 700,
    connRadius: 100,
    cursorRadius: 400,
    speed: 0.2,
    starColor: { r: 255, g: 0, b: 127 },
    lineColor: { r: 0, g: 10, b: 200 },
    bgInner: { r: 255, g: 0, b: 127 },
    bgOuter: { r: 15, g: 12, b: 30 },
    shootingStars: 2
  }
};

let customPresets = JSON.parse(localStorage.getItem("starfield_custom_presets")) || {};

function renderCustomPresetButtons() {
  const container = document.getElementById("custom-presets-container");
  if (!container) return;

  container.innerHTML = "";

  Object.keys(customPresets).forEach((key) => {
    const p = customPresets[key];
    presets[key] = p;

    const btnWrapper = document.createElement("div");
    btnWrapper.style.display = "inline-flex";
    btnWrapper.style.margin = "2px";

    const btn = document.createElement("button");
    btn.className = "preset-btn";
    btn.setAttribute("data-preset", key);
    btn.textContent = p.presetName || "Custom";
    btn.addEventListener("click", () => applyPreset(key));

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.style.marginLeft = "2px";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      delete customPresets[key];
      delete presets[key];
      localStorage.setItem("starfield_custom_presets", JSON.stringify(customPresets));
      renderCustomPresetButtons();
    });

    btnWrapper.appendChild(btn);
    btnWrapper.appendChild(delBtn);
    container.appendChild(btnWrapper);
  });
}

function triggerTitleFlyIn() {
  const title = document.getElementById("main-title");
  const subtitle = document.getElementById("subtitle");

  if (!title || !subtitle) return;

  title.classList.remove("fly-in");
  subtitle.classList.remove("fly-in");
  void title.offsetWidth; // Reflow zur Zurücksetzung der Animation

  title.classList.add("fly-in");
  subtitle.classList.add("fly-in");
}

function updateStarsArray(targetCount) {
  const canvas = document.getElementById("starfield");
  const width = canvas ? canvas.width : window.innerWidth;
  const height = canvas ? canvas.height : window.innerHeight;

  const centerX = width / 2;
  const centerY = height / 2;

  const isIntroActive = typeof introTime !== "undefined" && typeof INTRO_DURATION !== "undefined" && introTime < INTRO_DURATION;

  stars.length = 0; // Setzt die Sterne zurück, um einen sauberen Neustart zu garantieren

  while (stars.length < targetCount) {
    if (isIntroActive) {
      let angle = Math.random() * Math.PI * 2;
      let initialRadius = Math.random() * 670;
      let speed = Math.random() * 10 + 4; 

      stars.push({
        x: centerX,
        y: centerY,
        angle: angle,
        orbitRadius: initialRadius,
        orbitSpeed: (Math.random() * 0.03 + 0.005) * (Math.random() > 0.5 ? 1.03 : -1),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        normalVx: (Math.random() - 0.5) * 0.2,
        normalVy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 1
      });
    } else {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height - 70),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        normalVx: (Math.random() - 0.5) * 0.2,
        normalVy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 1
      });
    }
  }
}

function spawnShootingStar() {
  const canvas = document.getElementById("starfield");
  const width = canvas ? canvas.width : window.innerWidth;
  const height = canvas ? canvas.height : window.innerHeight;
  const startFromTop = Math.random() > 0.5;

  shootingStars.push({
    x: startFromTop ? Math.random() * (width * 0.8) : 0,
    y: startFromTop ? 0 : Math.random() * height * 0.5,
    len: Math.random() * 80 + 50,
    speed: Math.random() * 8 + 6,
    size: Math.random() * 1.2 + 0.8,
    angle: (Math.PI / 180) * (Math.random() * 15 + 35),
    alpha: 1
  });
}

function applyPreset(presetKey) {
  const p = presets[presetKey];
  if (!p) return;

  targetSpeed = p.speed;
  targetConnRadius = p.connRadius;
  targetCursorRadius = p.cursorRadius;
  targetStarColor = p.starColor;
  targetLineColor = p.lineColor;
  targetBgInner = p.bgInner;
  targetBgOuter = p.bgOuter;
  numStars = p.stars;
  maxShootingStars = p.shootingStars;

  updateStarsArray(numStars);

  const sliderNumStars = document.getElementById("slider-num-stars");
  const sliderConnRadius = document.getElementById("slider-conn-radius");
  const sliderCursorRadius = document.getElementById("slider-cursor-radius");
  const sliderStarSpeed = document.getElementById("slider-star-speed");
  const colorStars = document.getElementById("color-stars");
  const colorLines = document.getElementById("color-lines");
  const colorBg = document.getElementById("color-bg");
  const titleEl = document.getElementById("main-title");
  const inputTitle = document.getElementById("input-title");
  const sliderShootingStars = document.getElementById("slider-shooting-stars");

  if (sliderNumStars) sliderNumStars.value = p.stars;
  if (sliderConnRadius) sliderConnRadius.value = p.connRadius;
  if (sliderCursorRadius) sliderCursorRadius.value = p.cursorRadius;
  if (sliderStarSpeed) sliderStarSpeed.value = p.speed;
  if (sliderShootingStars) sliderShootingStars.value = p.shootingStars;

  if (colorStars) colorStars.value = rgbToHex(p.starColor.r, p.starColor.g, p.starColor.b);
  if (colorLines) colorLines.value = rgbToHex(p.lineColor.r, p.lineColor.g, p.lineColor.b);
  if (colorBg) colorBg.value = rgbToHex(p.bgOuter.r, p.bgOuter.g, p.bgOuter.b);

  if (document.getElementById("val-num-stars")) document.getElementById("val-num-stars").innerText = p.stars;
  if (document.getElementById("val-conn-radius")) document.getElementById("val-conn-radius").innerText = p.connRadius + " px";
  if (document.getElementById("val-cursor-radius")) document.getElementById("val-cursor-radius").innerText = p.cursorRadius + " px";
  if (document.getElementById("val-star-speed")) document.getElementById("val-star-speed").innerText = p.speed.toFixed(1) + "x";
  if (document.getElementById("val-shooting-stars")) document.getElementById("val-shooting-stars").innerText = p.shootingStars;

  if (titleEl && p.titleText) titleEl.textContent = p.titleText;
  if (inputTitle && p.titleText) inputTitle.value = p.titleText;
}

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let mouse = { x: null, y: null };
  let lastTime = performance.now();

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // Überwachung des Vollbildmodus
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      introTime = 0;
      titleFlyInTriggered = false;
      screenShakeTriggered = false;
      isstarted = true;
      lastTime = performance.now();
      updateStarsArray(numStars); // Startet das Intro sauber neu
    } else {
      isstarted = false; // Pausiert die Sternen-Animation beim Verlassen
    }
  });

  window.addEventListener("resize", () => {
    const prevWidth = width;
    const prevHeight = height - 70;

    resizeCanvas();

    if (prevWidth > 0 && prevHeight > 0) {
      stars.forEach(star => {
        star.x = (star.x / prevWidth) * width;
        star.y = (star.y / prevHeight) * (height - 70);
      });
    }
  });

  const resetTime = () => { lastTime = performance.now(); };
  window.addEventListener("focus", resetTime);
  window.addEventListener("blur", resetTime);
  document.addEventListener("visibilitychange", resetTime);

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });
  window.addEventListener("blur", () => { mouse.x = null; mouse.y = null; });

  resizeCanvas();

  renderCustomPresetButtons();

  const sliderNumStars = document.getElementById("slider-num-stars");
  const sliderConnRadius = document.getElementById("slider-conn-radius");
  const sliderCursorRadius = document.getElementById("slider-cursor-radius");
  const sliderStarSpeed = document.getElementById("slider-star-speed");
  const sliderShootingStars = document.getElementById("slider-shooting-stars");
  const colorStars = document.getElementById("color-stars");
  const colorLines = document.getElementById("color-lines");
  const colorBg = document.getElementById("color-bg");
  const inputTitle = document.getElementById("input-title");
  const titleEl = document.getElementById("main-title");

  const btnSave = document.getElementById("btn-save-preset");
  const inputPresetName = document.getElementById("input-preset-name");

  if (btnSave) {
    btnSave.addEventListener("click", () => {
      const name = inputPresetName ? inputPresetName.value.trim() : "";
      if (!name) {
        alert("Your little catbaby needs a name! 😸.");
        return;
      }

      const presetKey = "custom_" + Date.now();
      const newPreset = {
        presetName: name,
        stars: numStars,
        connRadius: targetConnRadius,
        cursorRadius: targetCursorRadius,
        speed: targetSpeed,
        starColor: { ...targetStarColor },
        lineColor: { ...targetLineColor },
        bgInner: { ...targetBgInner },
        bgOuter: { ...targetBgOuter },
        shootingStars: maxShootingStars
      };

      customPresets[presetKey] = newPreset;
      localStorage.setItem("starfield_custom_presets", JSON.stringify(customPresets));

      renderCustomPresetButtons();
      if (inputPresetName) inputPresetName.value = "";
    });
  }

  if (sliderNumStars) {
    sliderNumStars.addEventListener("input", (e) => {
      numStars = parseInt(e.target.value);
      document.getElementById("val-num-stars").innerText = numStars;
      updateStarsArray(numStars);
    });
  }

  if (sliderConnRadius) {
    sliderConnRadius.addEventListener("input", (e) => {
      targetConnRadius = parseInt(e.target.value);
      document.getElementById("val-conn-radius").innerText = targetConnRadius + " px";
    });
  }

  if (sliderCursorRadius) {
    sliderCursorRadius.addEventListener("input", (e) => {
      targetCursorRadius = parseInt(e.target.value);
      document.getElementById("val-cursor-radius").innerText = targetCursorRadius + " px";
    });
  }

  if (sliderStarSpeed) {
    sliderStarSpeed.addEventListener("input", (e) => {
      targetSpeed = parseFloat(e.target.value);
      document.getElementById("val-star-speed").innerText = targetSpeed.toFixed(1) + "x";
    });
  }

  if (sliderShootingStars) {
    sliderShootingStars.addEventListener("input", (e) => {
      maxShootingStars = parseInt(e.target.value);
      document.getElementById("val-shooting-stars").innerText = maxShootingStars;
    });
  }

  if (colorStars) {
    colorStars.addEventListener("input", (e) => { targetStarColor = hexToRgb(e.target.value); });
  }

  if (colorLines) {
    colorLines.addEventListener("input", (e) => { targetLineColor = hexToRgb(e.target.value); });
  }

  if (colorBg) {
    colorBg.addEventListener("input", (e) => {
      const rgb = hexToRgb(e.target.value);
      targetBgOuter = rgb;
      targetBgInner = { r: Math.min(255, rgb.r + 20), g: Math.min(255, rgb.g + 20), b: Math.min(255, rgb.b + 20) };
    });
  }

  if (inputTitle && titleEl) {
    inputTitle.addEventListener("input", (e) => {
      titleEl.textContent = e.target.value;
    });
  }

  const presetButtons = document.querySelectorAll(".preset-btn");
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const presetKey = e.target.getAttribute("data-preset");
      applyPreset(presetKey);
    });
  });

  function animate(currentTime) {
    requestAnimationFrame(animate);

    if (document.hidden) {
      lastTime = currentTime;
      return;
    }

    let deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (deltaTime > 0.1 || deltaTime <= 0 || isNaN(deltaTime)) {
      deltaTime = 1 / 60;
    }

    speedMultiplier = lerp(speedMultiplier, targetSpeed, 0.05);
    connectionRadius = lerp(connectionRadius, targetConnRadius, 0.05);
    cursorRadius = lerp(cursorRadius, targetCursorRadius, 0.05);

    currStarColor.r = lerp(currStarColor.r, targetStarColor.r, 0.05);
    currStarColor.g = lerp(currStarColor.g, targetStarColor.g, 0.05);
    currStarColor.b = lerp(currStarColor.b, targetStarColor.b, 0.05);

    currLineColor.r = lerp(currLineColor.r, targetLineColor.r, 0.05);
    currLineColor.g = lerp(currLineColor.g, targetLineColor.g, 0.05);
    currLineColor.b = lerp(currLineColor.b, targetLineColor.b, 0.05);

    currBgInner.r = lerp(currBgInner.r, targetBgInner.r, 0.05);
    currBgInner.g = lerp(currBgInner.g, targetBgInner.g, 0.05);
    currBgInner.b = lerp(currBgInner.b, targetBgInner.b, 0.05);

    currBgOuter.r = lerp(currBgOuter.r, targetBgOuter.r, 0.05);
    currBgOuter.g = lerp(currBgOuter.g, targetBgOuter.g, 0.05);
    currBgOuter.b = lerp(currBgOuter.b, targetBgOuter.b, 0.05);

    // Hintergrund rendern
    let gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 1.2
    );
    gradient.addColorStop(0, `rgb(${Math.round(currBgInner.r)}, ${Math.round(currBgInner.g)}, ${Math.round(currBgInner.b)})`);
    gradient.addColorStop(1, `rgb(${Math.round(currBgOuter.r)}, ${Math.round(currBgOuter.g)}, ${Math.round(currBgOuter.b)})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Stop, falls Fullscreen nicht gestartet ist
    if (!isstarted) {
      return;
    }

    introTime += deltaTime;
    const deltaFactor = deltaTime * 60;

    // Startet die Einflieganimation genau 1.8 Sekunden vor Phase 2 (bei Sekunde 4.2), damit der Titel bei 6.0 Sekunden vorne ankommt
    if (introTime >= 4.33 && !titleFlyInTriggered) {
      titleFlyInTriggered = true;
      triggerTitleFlyIn();
    }

    if (maxShootingStars > 0 && Math.random() < 0.03 && shootingStars.length < maxShootingStars) {
      spawnShootingStar();
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      let ss = shootingStars[i];

      ss.x += Math.cos(ss.angle) * ss.speed * speedMultiplier * deltaFactor;
      ss.y += Math.sin(ss.angle) * ss.speed * speedMultiplier * deltaFactor;
      ss.alpha = Math.max(0, ss.alpha - 0.008 * deltaFactor);

      if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
        shootingStars.splice(i, 1);
        continue;
      }

      let tailX = ss.x - Math.cos(ss.angle) * ss.len;
      let tailY = ss.y - Math.sin(ss.angle) * ss.len;

      let ssGradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
      ssGradient.addColorStop(0, `rgba(${Math.round(currStarColor.r)}, ${Math.round(currStarColor.g)}, ${Math.round(currStarColor.b)}, ${ss.alpha})`);
      ssGradient.addColorStop(0.2, `rgba(${Math.round(currLineColor.r)}, ${Math.round(currLineColor.g)}, ${Math.round(currLineColor.b)}, ${ss.alpha * 0.8})`);
      ssGradient.addColorStop(1, `rgba(${Math.round(currLineColor.r)}, ${Math.round(currLineColor.g)}, ${Math.round(currLineColor.b)}, 0)`);

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = ssGradient;
      ctx.lineWidth = ss.size;
      ctx.stroke();
    }

    const activeStarColor = `rgb(${Math.round(currStarColor.r)}, ${Math.round(currStarColor.g)}, ${Math.round(currStarColor.b)})`;
    const activeLineRgb = `${Math.round(currLineColor.r)}, ${Math.round(currLineColor.g)}, ${Math.round(currLineColor.b)}`;

    const cursorRadiusSq = cursorRadius * cursorRadius;
    const connRadiusSq = connectionRadius * connectionRadius;

    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < stars.length; i++) {
      let star = stars[i];

      if (introTime < 6.0) {
        let growthFactor = Math.min(1.0, introTime / 6.0);
        let currentRadius = star.orbitRadius * growthFactor;

        star.angle += star.orbitSpeed * deltaFactor;
        star.x = centerX + Math.cos(star.angle) * currentRadius;
        star.y = centerY + Math.sin(star.angle) * currentRadius;

      } else if (introTime < INTRO_DURATION) {
        // Exakt beim Phasenübergang bei Sekunde 6.0 den Bildschirm-Shake triggern
        if (!screenShakeTriggered) {
          screenShakeTriggered = true;
          const container = document.getElementById("intro-container");
          if (container) {
            container.classList.add("screen-shake");
            setTimeout(() => container.classList.remove("screen-shake"), 250);
          }
        }

        let friction = Math.pow(1.0001, deltaFactor);
        star.vx *= friction;
        star.vy *= friction;

        star.x += star.vx * deltaFactor;
        star.y += star.vy * deltaFactor;

      } else {
        star.vx = lerp(star.vx, star.normalVx, 0.02);
        star.vy = lerp(star.vy, star.normalVy, 0.02);

        star.x += star.vx * speedMultiplier * deltaFactor;
        star.y += star.vy * speedMultiplier * deltaFactor;
      }

      if (star.x < 0) {
        star.x = 0;
        star.vx *= -1;
        star.normalVx *= -1;
      } else if (star.x > width) {
        star.x = width;
        star.vx *= -1;
        star.normalVx *= -1;
      }

      if (star.y < 0) {
        star.y = 0;
        star.vy *= -1;
        star.normalVy *= -1;
      } else if (star.y > height - 70) {
        star.y = height - 70;
        star.vy *= -1;
        star.normalVy *= -1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = activeStarColor;
      ctx.fill();

      if (mouse.x !== null) {
        let dxMouse = star.x - mouse.x;
        let dyMouse = star.y - mouse.y;
        let distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

        if (distMouseSq < cursorRadiusSq) {
          let distMouse = Math.sqrt(distMouseSq);
          let alphaCursor = 1 - distMouse / cursorRadius;

          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${activeLineRgb}, ${alphaCursor * 0.4})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();

          for (let j = i + 1; j < stars.length; j++) {
            let otherStar = stars[j];
            let dx = star.x - otherStar.x;
            let dy = star.y - otherStar.y;
            let distStarsSq = dx * dx + dy * dy;

            if (distStarsSq < connRadiusSq) {
              let distStars = Math.sqrt(distStarsSq);
              let alphaLines = (1 - distStars / connectionRadius) * alphaCursor;

              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(otherStar.x, otherStar.y);
              ctx.strokeStyle = `rgba(${activeLineRgb}, ${alphaLines * 0.8})`;
              ctx.lineWidth = 1.6;
              ctx.stroke();
            }
          }
        }
      }
    }
  }

  animate(performance.now());
});





// --- WaldCalc Logik ---
(function initWaldCalc() {
  const calcScreen = document.getElementById("calculatorscreen");
  const modeToggleBtn = document.getElementById("toggle-calc-mode");

  if (!calcScreen) return;

  if (typeof dragElement === "function") dragElement(calcScreen);
  if (typeof addwindowtaphandling === "function") addwindowtaphandling(calcScreen);

  if (modeToggleBtn) {
    modeToggleBtn.addEventListener("click", () => {
      calcScreen.classList.toggle("scientific-mode");
      modeToggleBtn.textContent = calcScreen.classList.contains("scientific-mode")
        ? "🔢 Noob-Mode"
        : "🧪 Sci-Mode";
    });
  }

  const displayInput = document.getElementById("calc-input");
  const displayHistory = document.getElementById("calc-history");
  const buttons = calcScreen.querySelectorAll(".calc-btn");

  let currentExpr = "0";
  let resetOnNextInput = false;

  function updateDisplay() {
    displayInput.value = currentExpr;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-value");
      const action = btn.getAttribute("data-action");

      if (action === "clear") {
        currentExpr = "0";
        displayHistory.innerText = "";
      } else if (action === "backspace") {
        if (currentExpr.length > 1) {
          currentExpr = currentExpr.slice(0, -1);
        } else {
          currentExpr = "0";
        }
      } else if (action === "plusminus") {
        if (currentExpr !== "0") {
          currentExpr = currentExpr.startsWith("-") ? currentExpr.substring(1) : "-" + currentExpr;
        }
      } else if (action === "calculate") {
        try {
          displayHistory.innerText = currentExpr + " =";
          let evalExpr = currentExpr.replace(/÷/g, "/").replace(/×/g, "*").replace(/%/g, "/100");
          let result = Function('"use strict"; return (' + evalExpr + ')')();
          currentExpr = String(Number(result.toFixed(8)));
          resetOnNextInput = true;
        } catch (e) {
          displayHistory.innerText = currentExpr;
          currentExpr = "Fehler";
          resetOnNextInput = true;
        }
      } else if (["sin", "cos", "tan", "sqrt", "log"].includes(action)) {
        try {
          let evalExpr = currentExpr.replace(/÷/g, "/").replace(/×/g, "*");
          let num = Function('"use strict"; return (' + evalExpr + ')')();
          let mathFunc = action === "log" ? "Math.log10" : action === "sqrt" ? "Math.sqrt" : "Math." + action;
          displayHistory.innerText = `${action}(${currentExpr})`;
          let result = Function('"use strict"; return ' + mathFunc + '(' + num + ')')();
          currentExpr = String(Number(result.toFixed(8)));
          resetOnNextInput = true;
        } catch (e) {
          currentExpr = "Fehler";
          resetOnNextInput = true;
        }
      } else if (action === "pow") {
        currentExpr += "**2";
      } else if (val) {
        if (currentExpr === "0" || resetOnNextInput) {
          currentExpr = (val === ".") ? "0." : val;
          resetOnNextInput = false;
        } else {
          currentExpr += val;
        }
      }

      updateDisplay();
    });
  });
})();


// --- WaldAI & Groq API Logik (With Session Memory) ---

document.addEventListener("DOMContentLoaded", function() {
  var aiInput = document.querySelector("#ai-input");
  var aiSendBtn = document.querySelector("#ai-send-btn");
  var aiMessages = document.querySelector("#ai-chat-messages");
  var aiContainer = document.querySelector(".ai-container");

  const API_KEY = "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"; 

  let chatHistory = [
    { role: "system", content: "Du bist WaldAI, ein hilfreicher Assistent im WaldOS System. Waldewort ist dein Erschaffer und für die Gäste ist alles zu machen was diese befehlen. Rede immer zu den Gästen und nicht zu Waldewort!" }
  ];

  var loadingOverlay = document.createElement("div");
  loadingOverlay.className = "ai-loading-overlay";
  loadingOverlay.innerHTML = '<div class="ai-spinner"></div><span>WaldAI is searching in the W(ald)ormhole...</span>';
  
  if (aiContainer) {
    aiContainer.style.position = "relative";
    aiContainer.appendChild(loadingOverlay);
  }

  async function callGroqAPI(promptText) {
    const url = "https://api.groq.com/openai/v1/chat/completions";

    if (!API_KEY || API_KEY.includes("DEIN_ECHTER_GROQ_KEY")) {
      throw new Error("Your API Key is invalid. Please replace the API Key (gsk_...)");
    }
    chatHistory.push({ role: "user", content: promptText });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: chatHistory
      })
    });

    if (!response.ok) {
      chatHistory.pop();
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Fehler Details:", errorData);
      throw new Error(`API Fehler: ${response.status} - ${errorData?.error?.message || 'Invalid Response'}`);
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    chatHistory.push({ role: "assistant", content: botReply });

    return botReply;
  }

  async function sendAiMessage() {
    if (!aiInput || !aiMessages) return;
    var text = aiInput.value.trim();
    if (!text) return;

    // Nutzernachricht anzeigen
    var userMsg = document.createElement("div");
    userMsg.className = "ai-msg user";
    userMsg.textContent = text;
    aiMessages.appendChild(userMsg);

    aiInput.value = "";
    aiMessages.scrollTop = aiMessages.scrollHeight;

    // UI sperren & Loading anzeigen
    loadingOverlay.style.display = "flex";
    aiInput.disabled = true;
    aiSendBtn.disabled = true;

    try {
      const reply = await callGroqAPI(text);
      
      var botMsg = document.createElement("div");
      botMsg.className = "ai-msg bot";
      
      if (typeof marked !== "undefined") {
        botMsg.innerHTML = marked.parse(reply);
      } else {
        botMsg.textContent = reply;
      }
      
      aiMessages.appendChild(botMsg);
    } catch (error) {
      console.error(error);
      var errorMsg = document.createElement("div");
      errorMsg.className = "ai-msg bot";
      errorMsg.textContent = `Fehler: ${error.message} ⚠️`;
      aiMessages.appendChild(errorMsg);
    } finally {
      loadingOverlay.style.display = "none";
      aiInput.disabled = false;
      aiSendBtn.disabled = false;
      aiInput.focus();
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }
  }

  if (aiSendBtn && aiInput) {
    aiSendBtn.addEventListener("click", sendAiMessage);
    aiInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        sendAiMessage();
      }
    });
  }
});

// --- Waldclock Logic ---

document.addEventListener("DOMContentLoaded", function () {
  // Tab Switching
  const tabBtns = document.querySelectorAll(".clock-tab-btn");
  const tabContents = document.querySelectorAll(".clock-tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      this.classList.add("active");
      const targetTab = this.dataset.tab;
      document.querySelector(`#tab-${targetTab}`).classList.add("active");
    });
  });
  function updateWorldClocks() {
    const now = new Date();

    // Local Time
    const localDisplay = document.querySelector("#local-clock-display");
    const localDateDisplay = document.querySelector("#local-date-display");
    if (localDisplay) localDisplay.textContent = now.toLocaleTimeString("en-US", { hour12: false });
    if (localDateDisplay) {
      localDateDisplay.textContent = now.toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
      });
    }

    // World Cities
    const cities = {
      "#city-ny": "America/New_York",
      "#city-london": "Europe/London",
      "#city-tokyo": "Asia/Tokyo",
      "#city-sydney": "Australia/Sydney"
    };

    Object.entries(cities).forEach(([selector, timeZone]) => {
      const el = document.querySelector(selector);
      if (el) {
        el.textContent = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }).format(now);
      }
    });
  }

  setInterval(updateWorldClocks, 1000);
  updateWorldClocks();

  let swInterval = null;
  let swElapsed = 0;
  let lapCount = 0;

  const swDisplay = document.querySelector("#stopwatch-display");
  const swStartBtn = document.querySelector("#sw-start-btn");
  const swLapBtn = document.querySelector("#sw-lap-btn");
  const swResetBtn = document.querySelector("#sw-reset-btn");
  const swLapsList = document.querySelector("#sw-laps-list");

  function formatStopwatchTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const mins = String(Math.floor(totalSecs / 60)).padStart(2, "0");
    const secs = String(totalSecs % 60).padStart(2, "0");
    const centis = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${mins}:${secs}.${centis}`;
  }

  if (swStartBtn) {
    swStartBtn.addEventListener("click", function () {
      if (swInterval) {
        // Pause
        clearInterval(swInterval);
        swInterval = null;
        this.textContent = "Start";
        this.className = "clock-btn btn-start";
        swLapBtn.disabled = true;
      } else {
        // Start
        const startTime = Date.now() - swElapsed;
        swInterval = setInterval(() => {
          swElapsed = Date.now() - startTime;
          swDisplay.textContent = formatStopwatchTime(swElapsed);
        }, 10);
        this.textContent = "Stop";
        this.className = "clock-btn btn-stop";
        swLapBtn.disabled = false;
      }
    });
  }

  if (swLapBtn) {
    swLapBtn.addEventListener("click", function () {
      if (!swInterval) return;
      lapCount++;
      const lapEl = document.createElement("div");
      lapEl.className = "lap-item";
      lapEl.innerHTML = `<span>Lap ${lapCount}</span> <span>${formatStopwatchTime(swElapsed)}</span>`;
      swLapsList.prepend(lapEl);
    });
  }

  if (swResetBtn) {
    swResetBtn.addEventListener("click", function () {
      clearInterval(swInterval);
      swInterval = null;
      swElapsed = 0;
      lapCount = 0;
      swDisplay.textContent = "00:00.00";
      swLapsList.innerHTML = "";
      swStartBtn.textContent = "Start";
      swStartBtn.className = "clock-btn btn-start";
      swLapBtn.disabled = true;
    });
  }

  let timerInterval = null;
  let timerTotalSecs = 0;

  const timerDisplay = document.querySelector("#timer-display");
  const timerMinInput = document.querySelector("#timer-min");
  const timerSecInput = document.querySelector("#timer-sec");
  const timerStartBtn = document.querySelector("#timer-start-btn");
  const timerResetBtn = document.querySelector("#timer-reset-btn");
  const timerInputsWrapper = document.querySelector("#timer-inputs-wrapper");

  function formatTimerDisplay(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  }
  function playAlarm() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Wir spielen 3 kurze Pieptöne hintereinander
    [0, 0.2, 0.4, 1, 1.2, 1.4, 2, 2.2, 2.4].forEach(delay => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine'; 
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + delay); 

      gainNode.gain.setValueAtTime(100, audioCtx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 0.15);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime + delay);
      oscillator.stop(audioCtx.currentTime + delay + 0.15);
    });
  }

  if (timerStartBtn) {
    timerStartBtn.addEventListener("click", function () {
      if (timerInterval) {
        // Pause
        clearInterval(timerInterval);
        timerInterval = null;
        this.textContent = "Start";
        this.className = "clock-btn btn-start";
      } else {
        // Start / Resume
        if (timerTotalSecs === 0) {
          const mins = parseInt(timerMinInput.value) || 0;
          const secs = parseInt(timerSecInput.value) || 0;
          timerTotalSecs = mins * 60 + secs;
        }

        if (timerTotalSecs <= 0) return;

        timerInputsWrapper.style.display = "none";
        this.textContent = "Pause";
        this.className = "clock-btn btn-stop";

        timerInterval = setInterval(() => {
          timerTotalSecs--;
          timerDisplay.textContent = formatTimerDisplay(timerTotalSecs);

          if (timerTotalSecs <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            openwindow(clockscreen, clock);
            playAlarm();
            timerResetBtn.click();
          }
        }, 1000);
      }
    });
  }

  if (timerResetBtn) {
    timerResetBtn.addEventListener("click", function () {
      clearInterval(timerInterval);
      timerInterval = null;
      timerTotalSecs = 0;
      timerInputsWrapper.style.display = "flex";
      timerDisplay.textContent = formatTimerDisplay((parseInt(timerMinInput.value) || 0) * 60 + (parseInt(timerSecInput.value) || 0));
      timerStartBtn.textContent = "Start";
      timerStartBtn.className = "clock-btn btn-start";
    });
  }
});