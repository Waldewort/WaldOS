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



const windowControlsTemplate = (key) => `
  <button class="minimize-btn" id="minimize${key}screen" title="Minimieren">
    <svg viewBox="0 0 12 12" width="12" height="12">
      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <button class="maximize-btn" id="maximize${key}screen" title="Maximieren">
    <svg viewBox="0 0 12 12" width="12" height="12">
      <rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5" rx="1"/>
    </svg>
  </button>
  <button class="close-button" id="close${key}screen" title="Schließen">
    <svg viewBox="0 0 12 12" width="12" height="12">
      <line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
`;

document.addEventListener("DOMContentLoaded", function() {
  appsConfig.forEach(app => {
    // Finde den passenden Controls-Container im HTML (z.B. per data-app oder über den Screen)
    if (app.screen) {
      const headerControls = app.screen.querySelector(".window-controls");
      if (headerControls && headerControls.innerHTML.trim() === "") {
        // Generiert die Buttons mit dem korrekten App-Key (z.B. "trumpet", "notes" etc.)
        headerControls.innerHTML = windowControlsTemplate(app.key);
      }
    }
  });

  // Danach greifen deine bestehenden Event-Listener für Öffnen, Schließen, Minimieren & Maximieren wieder vollautomatisch!
});

document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("waldos-start-btn");
  const startMenu = document.getElementById("startmenu");
  const closeStartBtn = document.getElementById("closestartmenu");

  if (startBtn && startMenu) {
    startBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = startMenu.style.display === "flex";
      startMenu.style.display = isVisible ? "none" : "flex";
    });
  }

  if (closeStartBtn && startMenu) {
    closeStartBtn.addEventListener("click", () => {
      startMenu.style.display = "none";
    });
  }

  document.addEventListener("click", (e) => {
    if (startMenu && startMenu.style.display === "flex") {
      if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.style.display = "none";
      }
    }
  });
});

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
dragElement(document.getElementById("soundboardscreen"));
dragElement(document.getElementById("todoscreen"));
dragElement(document.getElementById("travelscreen"));

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
        { element: waldracerscreen, underline: waldracer },
        { element: soundboardscreen, underline: soundboard },
        { element: todoscreen, underline: todo },
        { element: travelscreen, underline: travel },
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
var stargazerscreen = document.querySelector("#stargazerscreen");
var aiscreen = document.querySelector("#aiscreen");
var clockscreen = document.querySelector("#clockscreen");
var waldracerscreen = document.querySelector("#racerscreen");
var soundboardscreen = document.querySelector("#soundboardscreen");
var todoscreen = document.querySelector("#todoscreen");
var travelscreen = document.querySelector("#travelscreen");

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
var waldracer = document.querySelector("#waldracer");
var soundboard = document.querySelector("#soundboard");
var todo = document.querySelector("#todo");
var travel = document.querySelector("#travel");

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
var openwaldracerscreen = document.querySelector("#openwaldracerscreen");
var opensoundboardscreen = document.querySelector("#opensoundboardscreen");
var opentodoscreen = document.querySelector("#opentodoscreen");
var opentravelscreen = document.querySelector("#opentravelscreen");

var closewelcomescreen = document.querySelector("#closewelcomescreen");
var closetrumpetscreen = document.querySelector("#closetrumpetscreen");
var closenotescreen = document.querySelector("#closenotescreen");
var closesearchmachinescreen = document.querySelector("#closesearchmachinescreen");
var closeyoutubescreen = document.querySelector("#closeyoutubescreen");
var closemapscreen = document.querySelector("#closemapscreen");
var closecalendarscreen = document.querySelector("#closecalendarscreen");
var closesettingscreen = document.querySelector("#closesettingscreen");
var closecalculatorscreen = document.querySelector("#closecalculatorscreen");
var closestargazerscreen = document.querySelector("#closestargazerscreen");
var closewaldaiscreen = document.querySelector("#closewaldaiscreen");
var closeclockscreen = document.querySelector("#closeclockscreen");
var closewaldracerscreen = document.querySelector("#closewaldracerscreen");
var closesoundboardscreen = document.querySelector("#closesoundboardscreen");
var closetodoscreen = document.querySelector("#closetodoscreen");
var closetravelscreen = document.querySelector("#closetravelscreen");

var minimizewelcomescreen = document.querySelectorAll("#minimizewelcomescreen, #minimizewelcomescreen_taskbar");
var minimizetrumpetscreen = document.querySelectorAll("#minimizetrumpetscreen, #minimizetrumpetscreen_taskbar");
var minimizenotescreen = document.querySelectorAll("#minimizenotescreen, #minimizenotescreen_taskbar");
var minimizesearchmachinescreen = document.querySelectorAll("#minimizesearchmachinescreen, #minimizesearchmachinescreen_taskbar");
var minimizeyoutubescreen = document.querySelectorAll("#minimizeyoutubescreen, #minimizeyoutubescreen_taskbar");
var minimizemapscreen = document.querySelectorAll("#minimizemapscreen, #minimizemapscreen_taskbar");
var minimizecalculatorscreen = document.querySelectorAll("#minimizecalculatorscreen, #minimizecalculatorscreen_taskbar");
var minimizestargazerscreen = document.querySelectorAll("#minimizestargazerscreen, #minimizestargazerscreen_taskbar");
var minimizewaldaiscreen = document.querySelectorAll("#minimizewaldaiscreen, #minimizewaldaiscreen_taskbar");
var minimizeclockscreen = document.querySelectorAll("#minimizeclockscreen, #minimizeclockscreen_taskbar");
var minimizewaldracerscreen = document.querySelectorAll("#minimizewaldracerscreen, #minimizewaldracerscreen_taskbar");
var minimizesoundboardscreen = document.querySelectorAll("#minimizesoundboardscreen, #minimizesoundboardscreen_taskbar");
var minimizetodoscreen = document.querySelectorAll("#minimizetodoscreen, #minimizetodoscreen_taskbar");
var minimizetravelscreen = document.querySelectorAll("#minimizetravelscreen, #minimizetravelscreen_taskbar");

function bindMinimizers(nodeList, screen, underline) {
  if (nodeList) {
    nodeList.forEach(function(el) {
      el.addEventListener("click", function(e) {
        e.stopPropagation();
        minimizeWindow(screen, underline);
      });
    });
  }
}

// Für jede App anwenden:
bindMinimizers(minimizewelcomescreen, welcomescreen, welcome);
bindMinimizers(minimizetrumpetscreen, trumpetscreen, trumpet);
bindMinimizers(minimizenotescreen, notescreen, notes);
bindMinimizers(minimizesearchmachinescreen, searchmachinescreen, searchmachine);
bindMinimizers(minimizeyoutubescreen, youtubescreen, youtube);
bindMinimizers(minimizemapscreen, mapscreen, map);
bindMinimizers(minimizecalculatorscreen, calculatorscreen, calculator);
bindMinimizers(minimizestargazerscreen, stargazerscreen, stargazer);
bindMinimizers(minimizewaldaiscreen, aiscreen, waldai);
bindMinimizers(minimizeclockscreen, clockscreen, clock);
bindMinimizers(minimizewaldracerscreen, waldracerscreen, waldracer);
bindMinimizers(minimizesoundboardscreen, soundboardscreen, soundboard);
bindMinimizers(minimizetodoscreen, todoscreen, todo);
bindMinimizers(minimizetravelscreen, travelscreen, travel);

function closewindow(element, underline) {
  if (!element) return;
  element.style.display = "none";
  if (underline) {
    underline.classList.remove("selected");
    underline.classList.add("unselected");
    underline.classList.remove("minimized");
  }
}


function minimizeWindow(element, underline) {
  if (!element) return;

  const isVisible = window.getComputedStyle(element).display !== "none";

  if (isVisible) {
    element.style.display = "none";
    if (underline) {
      underline.classList.remove("selected");
      underline.classList.add("minimized");
      underline.classList.remove("unselected");
    }
  } else {
    element.style.display = "flex";
    if (typeof biggestIndex !== "undefined") {
      biggestIndex++;
      element.style.zIndex = biggestIndex;
    }
    if (underline) {
      underline.classList.remove("minimized");
      underline.classList.remove("unselected");
      underline.classList.add("selected");
    }
  }
}

function openwindow(element, underline) {
  if (!element) return;
  element.style.display = "flex";
  
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (Blurscreen) Blurscreen.style.zIndex = biggestIndex + 1;
  if (underline){
    underline.classList.remove("unselected");
    underline.classList.add("selected");
    underline.classList.remove("minimized");
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
  if (!element || !(element instanceof Element)) return false;
  return window.getComputedStyle(element).display !== 'none';
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

openwaldracerscreen.addEventListener("click", function() {
  if (visible(waldracerscreen)) {
    closewindow(waldracerscreen, waldracer);
  }
  else{
    openwindow(waldracerscreen, waldracer);
  }
})

opensoundboardscreen.addEventListener("click", function() {
  if (visible(soundboardscreen)) {
    closewindow(soundboardscreen, soundboard);
  }
  else{
    openwindow(soundboardscreen, soundboard);   
  }
})

opentodoscreen.addEventListener("click", function() {
  if (visible(todoscreen)) {
    closewindow(todoscreen, todo);
  }
  else{
    openwindow(todoscreen, todo);
  }
})

opentravelscreen.addEventListener("click", function() {
  if (visible(travelscreen)) {
    closewindow(travelscreen, travel);
  }
  else{
    openwindow(travelscreen, travel);
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

if (closecalendarscreen) {
  closecalendarscreen.addEventListener("click", function() {
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

if (closewaldaiscreen) {
  closewaldaiscreen.addEventListener("click", function() {
    closewindow(aiscreen, waldai);
  });
}

if (closeclockscreen) {
  closeclockscreen.addEventListener("click", function() {
    closewindow(clockscreen, clock);
  });
}

if (closewaldracerscreen) {
  closewaldracerscreen.addEventListener("click", function() {
    closewindow(waldracerscreen, waldracer);
  })
}

if (closesoundboardscreen) {
  closesoundboardscreen.addEventListener("click", function() {
    closewindow(soundboardscreen, soundboard);
  })
}

if (closetodoscreen) {
  closetodoscreen.addEventListener("click", function() {
    closewindow(todoscreen, todo);
  })
}

if (closetravelscreen) {
  closetravelscreen.addEventListener("click", function() {
    closewindow(travelscreen, travel);
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
addwindowtaphandling(soundboardscreen);
addwindowtaphandling(todoscreen);
addwindowtaphandling(travelscreen);


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
var maximizewaldAIScreenButton = document.querySelector("#maximizewaldaiscreen");
var racerscreen = document.querySelector("#racerscreen");
var maximizeRacerScreenButton = document.querySelector("#maximizeracerscreen");
var soundboardscreen = document.querySelector("#soundboardscreen");
var maximizeSoundboardScreenButton = document.querySelector("#maximizesoundboardscreen");
var todoscreen = document.querySelector("#todoscreen");
var maximizeTodoScreenButton = document.querySelector("#maximizetodoscreen");
var travelscreen = document.querySelector("#travelscreen");
var maximizeTravelScreenButton = document.querySelector("#maximizetravelscreen");

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

if (maximizewaldAIScreenButton) {
  maximizewaldAIScreenButton.addEventListener("click", function(){
    maximizeWindow(aiscreen);
  })
}

if (maximizeRacerScreenButton) {
  maximizeRacerScreenButton.addEventListener("click", function(){
    fullscreenWindow(racerscreen);
  })
}

if (maximizeSoundboardScreenButton) {
  maximizeSoundboardScreenButton.addEventListener("click", function(){
    maximizeWindow(soundboardscreen);
  })
}

if (maximizeTodoScreenButton) {
  maximizeTodoScreenButton.addEventListener("click", function(){
    maximizeWindow(todoscreen);
  })
}

if (maximizeTravelScreenButton) {
  maximizeTravelScreenButton.addEventListener("click", function(){
    maximizeWindow(travelscreen);
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

document.addEventListener("DOMContentLoaded", function () {
  const settingsTabBtns = document.querySelectorAll(".settings-tab-btn");
  const settingsTabContents = document.querySelectorAll(".settings-tab-content");

  settingsTabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      settingsTabBtns.forEach((b) => b.classList.remove("active"));
      settingsTabContents.forEach((c) => c.classList.remove("active"));

      this.classList.add("active");
      const targetTab = this.getAttribute("data-tab");
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add("active");
      }
    });
  });
});