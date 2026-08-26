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
      // Blendet das gesamte Overlay-DIV inklusive Hintergrund aus
      overlayWaldOS.classList.add("hidden");
    } else {
      // Stellt das Overlay beim Verlassen des Vollbildmodus wieder her
      overlayWaldOS.classList.remove("hidden");
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

var welcome = document.querySelector("#welcome");
var trumpet = document.querySelector("#trumpet");
var notes = document.querySelector("#notes");
var searchmachine = document.querySelector("#searchmachine");
var youtube = document.querySelector("#youtube");
var rezepte = document.querySelector("#rezepte");

function closewindow(element) {
  element.style.display = "none";
}

function openwindow(element) {
  element.style.display = "block";
}

closewelcomescreen.addEventListener("click", function() {
  closewindow(welcomescreen);
  welcome.classList.add("unselected");
  welcome.classList.remove("selected");
});

openwelcomescreen.addEventListener("click", function() {
  if (welcomescreen.style.display === "block") {
    welcomescreen.style.display = "none";
    welcome.classList.add("unselected");
    welcome.classList.remove("selected");
  }
  else{
    openwindow(welcomescreen);
    welcome.classList.remove("unselected");
    welcome.classList.add("selected");
  }
});

closetrumpetscreen.addEventListener("click", function() {
  closewindow(trumpetscreen);
  trumpet.classList.add("unselected");
  trumpet.classList.remove("selected");
});

opentrumpetscreen.addEventListener("click", function() {
  if (trumpetscreen.style.display === "block") {
    trumpetscreen.style.display = "none";
    trumpet.classList.add("unselected");
    trumpet.classList.remove("selected");
  }
  else{
    openwindow(trumpetscreen);
    trumpet.classList.remove("unselected");
    trumpet.classList.add("selected");
  }
});

closenotescreen.addEventListener("click", function() {
  closewindow(notescreen);
  notes.classList.add("unselected");
  notes.classList.remove("selected");
});

opennotescreen.addEventListener("click", function() {
  if (notescreen.style.display === "block") {
    notescreen.style.display = "none";
    notes.classList.add("unselected");
    notes.classList.remove("selected");
  }
  else{
    openwindow(notescreen);
    notes.classList.remove("unselected");
    notes.classList.add("selected");
  }
});


opensearchmachinescreen.addEventListener("click", function() {
  if (searchmachinescreen.style.display === "block") {
    searchmachinescreen.style.display = "none";
    searchmachine.classList.add("unselected");
    searchmachine.classList.remove("selected");
  }
  else{
    openwindow(searchmachinescreen);
    searchmachine.classList.remove("unselected");
    searchmachine.classList.add("selected");
  }
});

closesearchmachinescreen.addEventListener("click", function() {
  closewindow(searchmachinescreen);
  searchmachine.classList.add("unselected");
  searchmachine.classList.remove("selected");
});

closewikipediascreen.addEventListener("click", function() {
  closewindow(wikipediascreen);
})

openyoutubescreen.addEventListener("click", function() {
  if (youtubescreen.style.display === "block") {
    youtubescreen.style.display = "none";
    youtube.classList.add("unselected");
    youtube.classList.remove("selected");
  }
  else{
    openwindow(youtubescreen);
    youtube.classList.remove("unselected");
    youtube.classList.add("selected");
  }
});

closeyoutubescreen.addEventListener("click", function() {
  closewindow(youtubescreen); 
  youtube.classList.add("unselected");
  youtube.classList.remove("selected");
});

openrezeptescreen.addEventListener("click", function() {
  if (rezeptescreen.style.display === "block") {
    rezeptescreen.style.display = "none";
    rezepte.classList.add("unselected");
    rezepte.classList.remove("selected");
  }
  else{
    openwindow(rezeptescreen);
    rezepte.classList.add("selected");
    rezepte.classList.remove("unselected");
  }
});

closerezeptescreen.addEventListener("click", function() {
  closewindow(rezeptescreen);
  rezepte.classList.add("unselected");
  rezepte.classList.remove("selected");
});

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


function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  Blurscreen.style.zIndex = biggestIndex + 1;
  topbar.style.zIndex = biggestIndex + 2;
}

function openwindow(element) {
  element.style.display ="block";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  Blurscreen.style.zIndex = biggestIndex + 1;
  topbar.style.zIndex = biggestIndex + 2;

}

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
  })
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
  ytLogo.style.display = "none";
  pContainer.style.display = 'none';
  pIframe.style.display = 'none';
  pIframe.src = '';
  if (!ytSearchInput) return;
  const query = ytSearchInput.value.trim();
  if (!query) return;

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
          var pContainer = ytPlayerContainer || document.querySelector("#yt-player-container");
          var pIframe = ytPlayer || document.querySelector("#yt-player");
          var ytApp = document.querySelector(".youtube-app");
          var ytPlayername = document.querySelector("#yt-playername");
          var ytLogo = document.querySelector("#yt-logo");

          if (pContainer && pIframe) {
            pContainer.style.display = 'flex';
            pIframe.style.display = 'flex';
            ytPlayername.style.display = "none";
            pIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
            
            // Scrollt das Innenfenster der YouTube-App gezielt nach ganz oben
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


