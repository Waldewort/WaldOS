function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timetext = document.querySelector("#time");
  timetext.innerHTML = currentTime;}
setInterval(updateTime, 1000);

// Make the DIV element draggable:
dragElement(document.getElementById("Hauptseite"));
dragElement(document.getElementById("trumpetscreen")); 
dragElement(document.getElementById("notescreen"));
dragElement(document.getElementById("youtubescreen"));

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
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
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
var youtubescreen = document.querySelector("#youtubescreen");
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
  openwindow(welcomescreen);
  welcome.classList.remove("unselected");
  welcome.classList.add("selected");
});

closetrumpetscreen.addEventListener("click", function() {
  closewindow(trumpetscreen);
  trumpet.classList.add("unselected");
  trumpet.classList.remove("selected");
});

opentrumpetscreen.addEventListener("click", function() {
  openwindow(trumpetscreen);
  trumpet.classList.remove("unselected")
  trumpet.classList.add("selected")
});

closenotescreen.addEventListener("click", function() {
  closewindow(notescreen);
  notes.classList.add("unselected");
  notes.classList.remove("selected");
});

opennotescreen.addEventListener("click", function() {
  openwindow(notescreen);
  notes.classList.add("selected");
  notes.classList.remove("unselected");
});

openyoutubescreen.addEventListener("click", function() {
  openwindow(youtubescreen);
  youtube.classList.add("selected");
  youtube.classList.remove("unselected");
});

closeyoutubescreen.addEventListener("click", function() {
  closewindow(youtubescreen); 
  youtube.classList.add("unselected");
  youtube.classList.remove("selected");
});


var topbar = document.querySelector("#Header");

var biggestIndex = 1;

function addwindowtaphandling(element) {
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

addwindowtaphandling(welcomescreen);
addwindowtaphandling(trumpetscreen);
addwindowtaphandling(notescreen);
addwindowtaphandling(youtubescreen);


function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topbar.style.zIndex = biggestIndex + 1;
}

function openwindow(element) {
  element.style.display ="block";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topbar.style.zIndex = biggestIndex + 1;
}

var trumpetscreen = document.querySelector("#trumpetscreen");
var maximizeTrumpetScreenButton = document.querySelector("#maximizetrumpetscreen");
var notescreen = document.querySelector("#notescreen");
var maximizeNoteScreenButton = document.querySelector("#maximizenotescreen");


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


// YouTube-Suchleisten-Logik
var ytInput = document.querySelector("#yt-search-input");
var ytBtn = document.querySelector("#yt-search-btn");
var ytPlayer = document.querySelector("#yt-player");

if (ytBtn && ytInput && ytPlayer) {
  ytBtn.addEventListener("click", function() {
    var inputVal = ytInput.value.trim();
    var videoId = "";

    if (inputVal !== "") {
      // Prüfen, ob ein kompletter YouTube-Link eingefügt wurde
      if (inputVal.includes("v=")) {
        videoId = inputVal.split("v=")[1].split("&")[0];
      } else if (inputVal.includes("youtu.be/")) {
        videoId = inputVal.split("youtu.be/")[1].split("?")[0];
      } else {
        // Falls nur die ID direkt eingegeben wurde
        videoId = inputVal;
      }

      // Embed-URL mit der extrahierten ID setzen
      ytPlayer.src = "https://www.youtube-nocookie.com/embed/" + videoId;
    }
  });
}


















