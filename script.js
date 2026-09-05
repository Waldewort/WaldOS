function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timetext = document.querySelector("#time");
  timetext.innerHTML = currentTime;}
setInterval(updateTime, 1000);

// Make the DIV element draggable:
dragElement(document.getElementById("Hauptseite"));
dragElement(document.getElementById("trumpetscreen")); 
dragElement(document.getElementById("notescreen"));
dragElement(document.getElementById("searchmachinescreen"));
dragElement(document.getElementById("youtubescreen"));
dragElement(document.getElementById("rezeptescreen"));
dragElement(document.getElementById("wikipediascreen"));
dragElement(document.getElementById("mapscreen"));


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
        { element: rezeptescreen, underline: rezepte },
        { element: wikipediascreen},
        { element: calendarscreen},
        { element: mapscreen, underline: map },
      ];

      windowMappings.forEach(item => {
          closewindow(item.element, item.underline);
      })
    }
  });


// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();

    element.style.transform = "none";
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = Elementdrag;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function Elementdrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
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

    // Maximale Grenzen (Bildschirm minus Fenstergröße)
    const maxTop = window.innerHeight - element.offsetHeight - 70; // 70px Taskleiste unten
    const maxLeft = window.innerWidth - element.offsetWidth;

    // Exakte mathematische Begrenzung für alle 4 Seiten
    element.style.top = Math.max(0, Math.min(targetTop, maxTop)) + "px";
    element.style.left = Math.max(0, Math.min(targetLeft, maxLeft)) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
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
var rezeptescreen = document.querySelector("#rezeptescreen");
var wikipediascreen = document.querySelector("#wikipediascreen");
var mapscreen = document.querySelector("#mapscreen");

var welcome = document.querySelector("#welcome");
var trumpet = document.querySelector("#trumpet");
var notes = document.querySelector("#notes");
var searchmachine = document.querySelector("#searchmachine");
var youtube = document.querySelector("#youtube");
var rezepte = document.querySelector("#rezepte");
var map = document.querySelector("#map");

var openwelcomescreen = document.querySelector("#openwelcomescreen");
var opentrumpetscreen = document.querySelector("#opentrumpetscreen");
var opennotescreen = document.querySelector("#opennotescreen");
var opensearchmachinescreen = document.querySelector("#opensearchmachinescreen");
var openyoutubescreen = document.querySelector("#openyoutubescreen");
var openrezeptescreen = document.querySelector("#openrezeptescreen");
var openmapscreen = document.querySelector("#openmapscreen");

var closewelcomescreen = document.querySelector("#closewelcomescreen");
var closetrumpetscreen = document.querySelector("#closetrumpetscreen");
var closenotescreen = document.querySelector("#closenotescreen");
var closesearchmachinescreen = document.querySelector("#closesearchmachinescreen");
var closeyoutubescreen = document.querySelector("#closeyoutubescreen");
var closerezeptescreen = document.querySelector("#closerezeptescreen");
var closemapscreen = document.querySelector("#closemapscreen");

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
  element.style.display = "block";
  
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

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        keepBuffer: 200,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Mitwirkende'
      }).addTo(osmMap);

      renderCustomPins();

      // Klick-Event auf der Karte mit Emoji-Dropdown
      osmMap.on('click', function (e) {
        let popupContent = document.createElement('div');
        popupContent.style.cssText = "display: flex; flex-direction: column; gap: 8px; padding: 4px; width: 350px; box-sizing: border-box;";

        popupContent.innerHTML = `
          <strong style="font-size: 13px; color: #333; line-height: 1.3; display: block;">Setup your Launchpad to save it for the rocketstart!</strong>
          <div style="display: flex; gap: 6px; width: 100%; box-sizing: border-box;">
            <select id="new-pin-emoji" style="flex: 0 0 95px; padding: 6px 2px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; background: #fff; cursor: pointer; box-sizing: border-box;">
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
            <input type="text" id="new-pin-name" placeholder="Name your Launchpad..." style="flex: 1; min-width: 0; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; outline: none; box-sizing: border-box;">
          </div>
          <button id="save-pin-btn" style="width: 100%; padding: 8px 10px; background: #089b9b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; box-sizing: border-box;">Save the location to start the rocket!</button>
        `;

        let popup = L.popup({ minWidth: 350, maxWidth: 360 })
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

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var userLat = position.coords.latitude;
            var userLon = position.coords.longitude;

            osmMap.setView([userLat, userLon], 15);

            L.marker([defaultLat, defaultLon]).addTo(osmMap)
              .bindPopup('WaldOS HQ 💻');
            L.marker([userLat, userLon]).addTo(osmMap)
              .bindPopup('🚀 Your current spaceship position')
          },
          function (error) {
            console.warn("Your Spaceship has no GPS ", error.message);
          },
          { timeout: 10000 }
        );
      } else {
        L.marker([defaultLat, defaultLon]).addTo(osmMap)
          .bindPopup('WaldOS HQ 💻')
          .openPopup();
      }
    }

    if (osmMap) {
      setTimeout(() => {
        osmMap.invalidateSize();
      }, 50);
    }
}
}

function visible(element){ return window.getComputedStyle(element).display === "block"};

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

// Rezeptescreen
openrezeptescreen.addEventListener("click", function() {
  if (visible(rezeptescreen)) {
    closewindow(rezeptescreen, rezepte);
  }
  else{
    openwindow(rezeptescreen, rezepte);
  }
});

openmapscreen.addEventListener("click", function() {
  if (visible(mapscreen)) {
    closewindow(mapscreen, map);
  } 
  else{
    openwindow(mapscreen, map);
  }
});

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
  });
}

if (closeyoutubescreen) {
  closeyoutubescreen.addEventListener("click", function() {
    closewindow(youtubescreen, youtube);
  });
}

if (closerezeptescreen) {
  closerezeptescreen.addEventListener("click", function() {
    closewindow(rezeptescreen, rezepte);
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



var topbar = document.querySelector("#Header");
var Blurscreen = document.querySelector("#fullscreen-btn-WaldOS");

var biggestIndex = 1;

function addwindowtaphandling(element) {
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

addwindowtaphandling(welcomescreen);
addwindowtaphandling(trumpetscreen);
addwindowtaphandling(notescreen);
addwindowtaphandling(searchmachinescreen);
addwindowtaphandling(youtubescreen);
addwindowtaphandling(rezeptescreen);
addwindowtaphandling(wikipediascreen);
addwindowtaphandling(calendarscreen);
addwindowtaphandling(mapscreen);


function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  Blurscreen.style.zIndex = biggestIndex + 1;
  topbar.style.zIndex = biggestIndex + 2;
}

//function openwindow(element) {
//  element.style.display ="block";
//  biggestIndex++;
//  element.style.zIndex = biggestIndex;
//  Blurscreen.style.zIndex = biggestIndex + 1;
//  topbar.style.zIndex = biggestIndex + 2;

//}

var trumpetscreen = document.querySelector("#trumpetscreen");
var maximizeTrumpetScreenButton = document.querySelector("#maximizetrumpetscreen");
var notescreen = document.querySelector("#notescreen");
var maximizeNoteScreenButton = document.querySelector("#maximizenotescreen");
var youtubescreen = document.querySelector("#youtubescreen");
var maximizeYoutubeScreenButton = document.querySelector("#maximizeyoutubescreen");
var rezeptescreen = document.querySelector("#rezeptescreen");
var maximizeRezepteScreenButton = document.querySelector("#maximizerezeptescreen");
var searchmachinescreen = document.querySelector("#searchmachinescreen");
var maximizeSearchmachineScreenButton = document.querySelector("#maximizesearchmachinescreen");
var wikipediascreen = document.querySelector("#wikipediascreen");
var maximizeWikipediaScreenButton = document.querySelector("#maximizewikipediascreen");
var mapscreen = document.querySelector("#mapscreen");
var maximizeMapScreenButton = document.querySelector("#maximizemapscreen");

function maximizeWindow(element) {
  element.classList.toggle("maximized");
  element.style.top = "";
  element.style.left = "";

  if (!element.classList.contains("maximized")) {
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

if (maximizeRezepteScreenButton) {
  maximizeRezepteScreenButton.addEventListener("click", function() {
    maximizeWindow(rezeptescreen);
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


// ==========================================
// NOTIZEN SPEICHERN & LADEN (localStorage)
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    var notesTextarea = document.querySelector("#notes-textarea");

    if (notesTextarea) {
        // 1. Beim Laden der Seite: Gespeicherten Text aus dem Browser-Speicher holen
        var savedNotes = localStorage.getItem("waldos_notes");
        
        if (savedNotes !== null) {
            notesTextarea.value = savedNotes;
        }

        // 2. Bei jeder Texteingabe: Sofort im Browser speichern
        notesTextarea.addEventListener("input", function() {
            localStorage.setItem("waldos_notes", notesTextarea.value);
        });
    }
});


// YouTube-Suchleiste

const API_KEY = "AIzaSyBPTc_wbo3dpmEYEd-g-zNu7vmv8oYLFUQ";

// DOM-Elemente für YouTube auswählen
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

  // Beim Start einer neuen Suche das Logo und den Player zurücksetzen
  if (ytLogo) ytLogo.style.display = "none";
  if (pContainer) pContainer.style.display = 'none';
  if (pIframe) {
    pIframe.style.display = 'none';
    pIframe.src = '';
  }

  ytResultsContainer.innerHTML = '<p style="color: #888; text-align: center;">Spaceship is diving into the W(ald)hormhole...</p>';

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      ytResultsContainer.innerHTML = `<p style="color: #ff6b6b; text-align: center;">API-Fehler: ${data.error.message}</p>`;
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
        card.style.cssText = "cursor: pointer; background: #222; padding: 8px; margin-bottom: 8px; border-radius: 4px; display: flex; align-items: center; gap: 10px;";
        card.innerHTML = `
          <img src="${thumbnail}" style="width: 120px; height: 68px; object-fit: cover; border-radius: 4px;">
          <div>
            <div style="font-weight: bold; color: #fff; font-size: 14px;">${title}</div>
            <div style="color: #aaa; font-size: 12px;">${author}</div>
          </div>
        `;
        
        
        card.addEventListener('click', () => {
          console.log("Video geklickt, ID:", videoId);
          var activeContainer = document.querySelector("#yt-player-container");
          var activeIframe = document.querySelector("#yt-player");
          var ytApp = document.querySelector(".youtube-app");
          var ytPlayername = document.querySelector("#yt-playername");
          var activeLogo = document.querySelector("#yt-logo");

          // Logo komplett ausblenden
          if (activeLogo) activeLogo.style.display = "none";

          if (activeContainer && activeIframe) {
            // Wichtig: Den Container und das Iframe jetzt sichtbar machen!
            activeContainer.style.display = 'block';
            activeIframe.style.display = 'block';
            activeIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
            
            if (ytPlayername) {
              ytPlayername.style.display = "none";
            }
            
            if (ytApp) {
              ytApp.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        });
        ytResultsContainer.appendChild(card);
      });
    } else {
      ytResultsContainer.innerHTML = '<p style="color: #ff6b6b; text-align: center;">This part of the W(ald)hormhole is empty.</p>';
    }
  } catch (err) {
    ytResultsContainer.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Your Spaceship has a problem by reaching the W(ald)hormhole.</p>';
  }
}

// Event-Listener für YouTube Suche aktivieren
if (ytSearchBtn && ytSearchInput) {
  ytSearchBtn.addEventListener("click", performYtSearch);
  ytSearchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      performYtSearch();
    }
  });
}

var eintöpfeButton = document.querySelector("#stews");
var breadButton = document.querySelector("#bread");
var cakeButton = document.querySelector("#cake");

var linseneintopf = document.querySelector("#Linseneintopf");
var kartoffeleintopf = document.querySelector("#Kartoffeleintopf");
var bohneneintopf = document.querySelector("#Bohneneintopf");

var vollkornbrot = document.querySelector("#Vollkornbrot");
var weißbrot = document.querySelector("#Weißbrot");

var brownies = document.querySelector("#brownies");


var stewsschrift = document.querySelector("#stews-schrift");
var breadschrift = document.querySelector("#bread-schrift");
var cakeschrift = document.querySelector("#cake-schrift");

function togglehideRecipes(element){
  if (element.classList.contains("versteckt")) {
    element.classList.remove("versteckt");
  } else {
    element.classList.add("versteckt");
  }
}

eintöpfeButton.addEventListener("click", function() {
  togglehideRecipes(linseneintopf);
  togglehideRecipes(kartoffeleintopf);
  togglehideRecipes(bohneneintopf);
  togglehideRecipes(stewsschrift);
});

breadButton.addEventListener("click", function() {
  togglehideRecipes(vollkornbrot);
  togglehideRecipes(breadschrift);
  togglehideRecipes(weißbrot);
});

cakeButton.addEventListener("click", function() {
  togglehideRecipes(brownies);
  togglehideRecipes(cakeschrift);
});

// ==========================================
// WALDSEARCH (Native Wikipedia API)
// ==========================================
var searchInputSearchapp = document.querySelector("#waldos-search-input");
var searchBtnSearchapp = document.querySelector("#waldos-search-btn");
var resultsContainerSearchapp = document.querySelector("#search-results-container");


function runWaldosSearch() {
  var query = searchInputSearchapp.value.trim();
  if (!query) return;

  resultsContainerSearchapp.innerHTML = "<p style='text-align: center; color: #aaa;'>Diving into the W(ald)hormhole...</p>";

  // Kostenlose Wikipedia-API abfragen (erlaubt direkte Anfragen ohne Blockaden)
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
        resultsContainerSearchapp.innerHTML = "<p style='text-align: center; color: #ff6b6b;'>The W(ald)hormhole is empty.</p>";
        return;
      }

      results.forEach(function(item) {
        var card = document.createElement("div");
        card.style.cssText = "background: #282828; padding: 12px 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid rgb(8, 155, 155);";

        var title = document.createElement("h3");
        title.style.cssText = "margin: 0 0 5px 0; font-size: 16px;";
        
        var link = document.createElement("a");
        link.href = "#";
        link.style.cssText = "color: #58a6ff; text-decoration: none;";
        link.textContent = item.title;

        link.addEventListener("click", function(e) {
          e.preventDefault();
          
          var wikiIframe = document.querySelector("#wikipediaframe");
          var wikipediascreen = document.querySelector("#wikipediascreen");

          if (wikiIframe && wikipediascreen) {
            // Nutzt die mobile Wikipedia-URL (wird im iFrame nicht blockiert)
            wikiIframe.src = "https://en.m.wikipedia.org/wiki/" + encodeURIComponent(item.title);
            openwindow(wikipediascreen);
          }
        });

        title.appendChild(link);

        var snippet = document.createElement("p");
        snippet.style.cssText = "margin: 0; font-size: 13px; color: #ccc; line-height: 1.4;";
        snippet.innerHTML = item.snippet + "...";

        card.appendChild(title);
        card.appendChild(snippet);
        resultsContainerSearchapp.appendChild(card);
      });
    })
    .catch(function(error) {
      resultsContainerSearchapp.innerHTML = "<p style='text-align: center; color: #ff6b6b;'>No Results!</p>";
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


// ==========================================
// MOONCALENDAR LOGIK
// ==========================================


(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var dateInput = document.querySelector("#calendar-date");
    var timeInput = document.querySelector("#calendar-time");
    var textInput = document.querySelector("#calendar-text");
    var addButton = document.querySelector("#calendar-add-button");
    var listContainer = document.querySelector("#calendar-list");

    if (!addButton || !listContainer) return;

    var STORAGE_KEY = "waldos_mooncalendar_events";

    // 1. Events aus localStorage auslesen
    function getStoredEvents() {
      var saved = localStorage.getItem(STORAGE_KEY);
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }

    // 2. Events in localStorage schreiben
    function setStoredEvents(events) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }

    // 3. Liste im HTML zeichnen
    function renderEvents() {
      var events = getStoredEvents();
      listContainer.innerHTML = "";

      if (events.length === 0) {
        listContainer.innerHTML = '<p style="color: #888; text-align: center; margin: 10px 0;">No takeoff dates saved yet.</p>';
        return;
      }

      // Chronologisch nach Datum und Zeit sortieren
      events.sort(function (a, b) {
        var keyA = (a.date || "") + " " + (a.time || "00:00");
        var keyB = (b.date || "") + " " + (b.time || "00:00");
        return keyA.localeCompare(keyB);
      });

      // HTML-Elemente für jeden Eintrag erstellen
      events.forEach(function (eventItem, index) {
        var card = document.createElement("div");
        card.style.cssText = "background: #282828; color: #fff; padding: 10px; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid rgb(8, 155, 155);"

        var infoContainer = document.createElement("div");
        var safeText = eventItem.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        infoContainer.innerHTML = '<strong style="font-size: 15px; color: #58a6ff;">' + safeText + '</strong><br>' +
                                  '<small style="color: #aaa;">📅 ' + (eventItem.date || "Kein Datum") + (eventItem.time ? ' ⏰ ' + eventItem.time : '') + '</small>';

        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✖";
        deleteBtn.style.cssText = "background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: 16px; padding: 4px 8px;";

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

    // 4. Klick-Event für den Hinzufügen-Button
    addButton.addEventListener("click", function () {
      var dateVal = dateInput ? dateInput.value : "";
      var timeVal = timeInput ? timeInput.value : "";
      var textVal = textInput ? textInput.value.trim() : "";

      if (!textVal) {
        alert("Bitte gib einen Text für das Event ein!");
        return;
      }

      if (!dateVal) {
        alert("Bitte wähle ein Datum aus!");
        return;
      }

      var events = getStoredEvents();
      events.push({
        text: textVal,
        date: dateVal,
        time: timeVal
      });

      setStoredEvents(events);

      // Eingabefelder leeren
      if (textInput) textInput.value = "";
      if (timeInput) timeInput.value = "";

      renderEvents();
    });

    // Beim Laden der Seite direkt rendern
    renderEvents();
  });
})();

// ==========================================
// MAP LOGIC
// ==========================================
let osmMap = null;

// Speicher für eigene Pins initialisieren
let customPinsData = JSON.parse(localStorage.getItem('waldos_custom_pins')) || [];
let customMarkers = [];

// Funktion zum Rendern der Pins mit Emojis als Marker
function renderCustomPins() {
  // Alte Marker von der Karte entfernen
  customMarkers.forEach(m => osmMap.removeLayer(m));
  customMarkers = [];

  customPinsData.forEach((pin, index) => {
    let pinEmoji = pin.emoji || '📍'; // Fallback für ältere Pins ohne Emoji

    // Erstellt ein Custom Leaflet-Icon mit dem gewählten Emoji
    let emojiIcon = L.divIcon({
      className: 'custom-emoji-pin',
      html: `<div style="font-size: 28px; line-height: 1; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); cursor: pointer;">${pinEmoji}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16] // Zentriert das Emoji exakt auf den Koordinaten
    });

    let marker = L.marker([pin.lat, pin.lng], { icon: emojiIcon }).addTo(osmMap);

    // Popup mit Namen und Lösch-Button
    let container = document.createElement('div');
    container.innerHTML = `<strong style="color: #333; font-size: 14px;">${pinEmoji} ${pin.name}</strong><br>`;

    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete this pin";
    deleteBtn.style.cssText = "margin-top: 8px; padding: 4px 8px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;";

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
// Variable zum Speichern der aktuellen Routen-Linie
let currentRouteLayer = null;

// Seitenleiste ein-/ausklappen
function toggleRouteSidebar() {
  let sidebar = document.getElementById('route-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

// Hilfsfunktion: Adresse zu Koordinaten über Nominatim (ohne verbotene Header)
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
  throw new Error(`Ort nicht gefunden: "${query}". Bitte eine reale Adresse eingeben.`);
}

// Auto-Route berechnen und auf der Karte zeichnen
async function calculateCarRoute() {
  let startInput = document.getElementById('route-start').value.trim();
  let endInput = document.getElementById('route-end').value.trim();

  if (!startInput || !endInput) {
    alert("Bitte geben Sie sowohl einen Start- als auch einen Zielort ein.");
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

      // Umrechnung von Meter in KM und Sekunden in Std/Min
      let distanceKm = (route.distance / 1000).toFixed(1);
      let distanceMiles = (route.distance / 1609.34).toFixed(1);
      let totalMinutes = Math.round(route.duration / 60);
      let hours = Math.floor(totalMinutes / 60);
      let minutes = totalMinutes % 60;

      let durationText = hours > 0 ? `${hours} Std. ${minutes} Min.` : `${minutes} Min.`;

      // Werte in der UI anzeigen
      document.getElementById('route-distance').innerText = `${distanceKm} km`;
      document.getElementById('route-distance-miles').innerText = `${distanceMiles} mi`;
      document.getElementById('route-duration').innerText = durationText;
      document.getElementById('route-info').style.display = 'flex';

      // Route auf der Karte darstellen
      currentRouteLayer = L.geoJSON(routeGeoJSON, {
        style: {
          color: '#089b9b',
          weight: 6,
          opacity: 0.8
        }
      }).addTo(osmMap);

      osmMap.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });
    } else {
      alert("Es konnte keine Straßenverbindung zwischen diesen Orten gefunden werden.");
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