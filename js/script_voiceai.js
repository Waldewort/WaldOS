document.addEventListener("DOMContentLoaded", function () {
  const assistantBtn = document.getElementById("voice-assistant-btn");
  const stars = document.querySelectorAll("#star-ring .star");

  // DOM-Elemente für UI / Visualisierungen
  const voiceAiScreen = document.getElementById("voiceaiscreen");
  const closeVoiceBtn = document.getElementById("closevoiceaiscreen");
  const startVoiceBtn = document.getElementById("start-voice-btn");
  const stopVoiceBtn = document.getElementById("stop-voice-btn");
  const voiceStatusText = document.getElementById("voice-status-text");
  const voiceIndicator = document.getElementById("voice-indicator");
  const voiceTranscript = document.getElementById("voice-transcript");
  const voiceCommandLog = document.getElementById("voice-command-log");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;
  let isStarting = false;
  let audioStream = null;

  // Web Audio API
  let audioCtx = null;
  let analyser = null;
  let microphoneSource = null;
  let animFrameId = null;

  let waveOffset = 0;

  async function initPermissions() {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access active.");
    } catch (err) {
      console.warn("Microphone access denied:", err);
      if (assistantBtn) assistantBtn.disabled = true;
      if (startVoiceBtn) startVoiceBtn.disabled = true;
    }
  }

  initPermissions();

  function startAudioVisualizer() {
    if (!audioStream) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    microphoneSource = audioCtx.createMediaStreamSource(audioStream);
    microphoneSource.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function updateVolume() {
      if (!isListening) return;

      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }

      const bass = (dataArray[1] + dataArray[2] + dataArray[3]) / 3;
      const mids = (dataArray[6] + dataArray[7] + dataArray[8]) / 3;
      const treble = (dataArray[12] + dataArray[13] + dataArray[14]) / 3;

      const totalStars = stars.length;
      const baseDistance = 16;
      const maxExtraDistance = 32;

      waveOffset += 0.08;

      stars.forEach((star, index) => {
        const angle = (index / totalStars) * Math.PI * 2;
        const wave1 = Math.sin(angle * 2 + waveOffset);
        const wave2 = Math.cos(angle * 3 - waveOffset * 0.5);
        const combinedWave = (wave1 + wave2 * 0.5) / 1.5;

        const freqImpact = (bass * 0.4 + mids * 0.4 + treble * 0.2) / 255;
        const intensity = Math.max(0, (combinedWave + 1) / 2) * freqImpact;

        const starDistance = baseDistance + intensity * maxExtraDistance;
        const starScale = 1 + intensity * 0.4;

        star.style.setProperty("--star-offset", `${starDistance.toFixed(2)}px`);
        star.style.setProperty("--star-scale", starScale.toFixed(2));
      });

      animFrameId = requestAnimationFrame(updateVolume);
    }

    updateVolume();
  }

  function stopAudioVisualizer() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    stars.forEach((star) => {
      star.style.setProperty("--star-offset", "16px");
      star.style.setProperty("--star-scale", "1");
    });
    if (microphoneSource) {
      microphoneSource.disconnect();
      microphoneSource = null;
    }
  }

  function updateUIStatus(listening, statusText, logText) {
    if (voiceStatusText) voiceStatusText.textContent = statusText;
    if (voiceCommandLog && logText) voiceCommandLog.textContent = logText;

    if (voiceIndicator) {
      voiceIndicator.className = listening ? "listening" : "ready";
    }
    if (startVoiceBtn) startVoiceBtn.disabled = listening;
    if (stopVoiceBtn) stopVoiceBtn.disabled = !listening;
  }

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Alle Anfragen auf Englisch
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
      isStarting = false;
      updateUIStatus(true, "Listening...", "Speak now.");
    };

    recognition.onresult = function (event) {
      if (!isListening) return;

      let currentText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }

      if (voiceTranscript) {
        voiceTranscript.textContent = `"${currentText}"`;
      }

      processCommand(currentText);
    };

    recognition.onerror = function (event) {
      isStarting = false;
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.warn("Speech recognition error:", event.error);
        updateUIStatus(false, "Error occurred", "Error: " + event.error);
      }
    };

    recognition.onend = function () {
      isStarting = false;
      if (isListening) {
        setTimeout(() => {
          if (isListening && !isStarting) {
            try {
              isStarting = true;
              recognition.start();
            } catch (e) {
              isStarting = false;
            }
          }
        }, 300);
      } else {
        updateUIStatus(false, "Ready for voice command", "Ready.");
      }
    };
  } else {
    console.warn("Speech recognition not supported in this browser.");
    if (assistantBtn) assistantBtn.disabled = true;
    if (startVoiceBtn) startVoiceBtn.disabled = true;
    if (voiceStatusText) voiceStatusText.textContent = "Speech recognition not supported!";
  }

  function startListening() {
    if (!recognition || isStarting) return;

    isListening = true;
    isStarting = true;

    try {
      recognition.start();
    } catch (e) {
      isStarting = false;
      console.log("Recognition active or starting.");
    }

    if (assistantBtn) {
      assistantBtn.classList.remove("ready");
      assistantBtn.classList.add("listening");
    }

    updateUIStatus(true, "Listening started...", "Listening...");
    startAudioVisualizer();
  }

  function stopListening() {
    isListening = false;
    isStarting = false;

    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.warn("Error stopping recognition:", e);
      }
    }

    if (assistantBtn) {
      assistantBtn.classList.remove("listening");
      assistantBtn.classList.add("ready");
    }

    updateUIStatus(false, "Ready for voice command", "Stopped.");
    stopAudioVisualizer();
  }

  if (assistantBtn) {
    assistantBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    });
  }

  if (closeVoiceBtn) {
    closeVoiceBtn.addEventListener("click", () => {
      stopListening();
      if (voiceAiScreen) {
        voiceAiScreen.style.display = "none";
        voiceAiScreen.classList.remove("open");
      }
    });
  }

  if (startVoiceBtn) startVoiceBtn.addEventListener("click", startListening);
  if (stopVoiceBtn) stopVoiceBtn.addEventListener("click", stopListening);

  // --- App-Fenster-Steuerung ---

  function openApp(windowId, containerId) {
    const win = document.getElementById(windowId);
    const container = containerId ? document.getElementById(containerId) : null;

    if (typeof openwindow === "function" && win) {
      openwindow(win, container);
    } else if (win) {
      win.style.display = "flex";
    }
  }

  function closeApp(windowId, containerId) {
    const win = document.getElementById(windowId);
    const container = containerId ? document.getElementById(containerId) : null;

    if (typeof closewindow === "function" && win) {
      closewindow(win, container);
    } else if (win) {
      win.style.display = "none";
    }
  }

  function maximizeApp(windowId, containerId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    openApp(windowId, containerId);

    if (typeof maximizeWindow === "function") {
      if (!win.classList.contains("maximized")) {
        maximizeWindow(win);
      }
    } else {
      win.classList.add("maximized");
    }
  }

  function restoreApp(windowId, containerId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    openApp(windowId, containerId);

    if (typeof maximizeWindow === "function") {
      if (win.classList.contains("maximized")) {
        maximizeWindow(win);
      }
    } else {
      win.classList.remove("maximized");
    }
  }

  function closeAllApps() {
    apps.forEach((app) => {
      closeApp(app.windowId, app.containerId);
    });
  }

  function setInputValue(el, val) {
    if (!el) return;
    el.value = val;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function logCommand(msg) {
    if (voiceCommandLog) {
      voiceCommandLog.textContent = msg;
    }
  }

  // --- Erweiterte App-Zuordnungstabelle mit viel mehr Keywords ---

  const apps = [
    { name: "notes", windowId: "notescreen", containerId: "notes", keywords: ["notes", "notepad", "notebook", "memo", "text editor"] },
    { name: "todo", windowId: "todoscreen", containerId: "todo", keywords: ["todo", "to-do", "to do", "tasks", "tasklist", "checklist",] },
    { name: "clock", windowId: "clockscreen", containerId: "clock", keywords: ["clock", "timer", "stopwatch", "alarm", "world clock", "waldclock"] },
    { name: "trumpet", windowId: "trumpetscreen", containerId: "trumpet", keywords: ["trumpet", "trumpet learn", "horn", "brass", "trompete"] },
    { name: "welcome", windowId: "Hauptseite", containerId: "welcome", keywords: ["welcome", "about", "home", "info", "head", "waldos"] },
    { name: "map", windowId: "mapscreen", containerId: "map", keywords: ["map", "maps", "navigation", "gps", "route", "satellite", "karte"] },
    { name: "search", windowId: "searchmachinescreen", containerId: "searchmachine", keywords: ["search", "waldsearch", "search machine", "browser", "web search", "google"] },
    { name: "youtube", windowId: "youtubescreen", containerId: "youtube", keywords: ["youtube", "waldiverse", "video", "videos", "media player", "waldvideo"] },
    { name: "calculator", windowId: "calculatorscreen", containerId: "calculator", keywords: ["calculator", "waldcalc", "calc", "math"] },
    { name: "stargazer", windowId: "stargazerscreen", containerId: "stargazer", keywords: ["stargazer", "waldsky", "sky", "stars", "space", "astronomy", "stellarium"] },
    { name: "waldai", windowId: "aiscreen", containerId: "waldai", keywords: ["waldai", "ai", "chat", "chatbot", "assistant", "artificial intelligence"] },
    { name: "racer", windowId: "racerscreen", containerId: "racer", keywords: ["racer", "waldracer", "game", "car game", "racing", "slowroads"] },
    { name: "sound", windowId: "soundboardscreen", containerId: "waldsound", keywords: ["sound", "soundboard", "waldience", "waldsound", "audio", "ambient", "nature sounds", "music"] },
    { name: "settings", windowId: "settingsscreen", containerId: "opensettingscreen", keywords: ["settings", "preferences", "options", "config", "galaxies"] },
    { name: "calendar", windowId: "calendarscreen", containerId: "togglecalendarscreen", keywords: ["calendar", "mooncalendar", "events", "takeoff dates", "schedule"] }
  ];


  function processInAppCommands(originalText) {
    const text = originalText.trim();
    const lower = text.toLowerCase();

    // 1. NOTES
    if (lower.startsWith("notes ") || lower.startsWith("note ") || lower.startsWith("write ")) {
      if (lower.endsWith(" clear") || lower.endsWith(" delete all")) {
        const noteArea = document.querySelector("#notes-textarea");
        if (noteArea) {
          setInputValue(noteArea, "");
          logCommand("Notes cleared.");
          return true;
        }
      }

      const noteText = text.replace(/^(notes|note|write)\s*(write|add|put)?\s*/i, "").trim();
      const textarea = document.querySelector("#notes-textarea");

      if (textarea && noteText) {
        const newContent = textarea.value ? `${textarea.value}\n${noteText}` : noteText;
        setInputValue(textarea, newContent);
        logCommand(`Note added: "${noteText}"`);
        return true;
      }
    }

    // 2. TO-DO
    if (lower.startsWith("todo ") || lower.startsWith("to-do ") || lower.startsWith("task ") || lower.startsWith("add task ")) {
      const todoText = text.replace(/^(todo|to-do|task|add task)\s*(add|write|create)?\s*/i, "").trim();
      const input = document.querySelector("#todo-input");
      const btn = document.querySelector("#add-todo-btn");

      if (input && todoText) {
        setInputValue(input, todoText);
        if (btn) btn.click();
        logCommand(`Task added: "${todoText}"`);
        return true;
      }
    }

    // 3. YOUTUBE / WALDIVERSE
    if (lower.startsWith("youtube ") || lower.startsWith("waldiverse ") || lower.startsWith("play video ") || lower.startsWith("watch ")) {
      const query = text.replace(/^(youtube|waldiverse|play video|watch)\s*(search|play|find)?\s*/i, "").trim();
      const input = document.querySelector("#yt-search-input");
      const btn = document.querySelector("#yt-search-btn");

      if (input && query) {
        setInputValue(input, query);
        if (btn) btn.click();
        logCommand(`Waldiverse: Search started for "${query}"`);
        return true;
      }
    }

    // 4. STARGAZER / WALDSKY
    if (lower.startsWith("stargazer ") || lower.startsWith("waldsky ") || lower.startsWith("teleport to ") || lower.startsWith("sky search ")) {
      const location = text.replace(/^(stargazer|waldsky|teleport to|sky search)\s*(search|find)?\s*/i, "").trim();
      const input = document.querySelector("#sky-search-input");
      const btn = document.querySelector("#sky-search-btn");

      if (input && location) {
        setInputValue(input, location);
        if (btn) btn.click();
        logCommand(`WaldSky: Teleporting to "${location}"`);
        return true;
      }
    }

    // 5. SEARCH MACHINE / WALDSEARCH
    if (lower.startsWith("search ") || lower.startsWith("waldsearch ") || lower.startsWith("search for ")) {
      const query = text.replace(/^(search|waldsearch|search for)\s*(search)?\s*/i, "").trim();
      const input = document.querySelector("#waldos-search-input");
      const btn = document.querySelector("#waldos-search-btn");

      if (input && query) {
        setInputValue(input, query);
        if (btn) btn.click();
        logCommand(`WaldSearch: Search started for "${query}"`);
        return true;
      }
    }

    // 6. WALDAI / CHAT
    if (lower.startsWith("waldai ") || lower.startsWith("ai ") || lower.startsWith("ask ai ") || lower.startsWith("ask waldai ")) {
      const query = text.replace(/^(waldai|ai|ask ai|ask waldai)\s*(ask|write|tell)?\s*/i, "").trim();
      const input = document.querySelector("#ai-input");
      const btn = document.querySelector("#ai-send-btn");

      if (input && query) {
        setInputValue(input, query);
        if (btn) btn.click();
        logCommand(`WaldAI: Request sent: "${query}"`);
        return true;
      }
    }

    // 7. MAPS / NAVIGATION
    if (lower.startsWith("map ") || lower.startsWith("maps ") || lower.startsWith("navigate to ") || lower.startsWith("find location ")) {
      const rest = text.replace(/^(map|maps|navigate to|find location)\s*/i, "").trim();

      if (rest.toLowerCase() === "clear") {
        const clearBtn = document.querySelector("#clear-route-btn");
        if (clearBtn) {
          clearBtn.click();
        } else if (typeof clearCarRoute === "function") {
          clearCarRoute();
        }
        logCommand("Maps: Route cleared.");
        return true;
      }

      if (/^route\s+/i.test(rest)) {
        const routeStr = rest.replace(/^route\s+/i, "").trim();
        const match = routeStr.match(/from (.+) to (.+)/i) || routeStr.match(/(.+) to (.+)/i);
        if (match) {
          const start = match[1].trim();
          const end = match[2].trim();

          const sidebar = document.querySelector("#route-sidebar");
          if (sidebar && !sidebar.classList.contains("active") && typeof toggleRouteSidebar === "function") {
            toggleRouteSidebar();
          }

          const startInput = document.querySelector("#route-start");
          const endInput = document.querySelector("#route-end");
          const calcRouteBtn = document.querySelector("#calc-route-btn");

          if (startInput && endInput) {
            setInputValue(startInput, start);
            setInputValue(endInput, end);
            if (calcRouteBtn) {
              calcRouteBtn.click();
            } else if (typeof calculateCarRoute === "function") {
              calculateCarRoute();
            }
            logCommand(`Maps: Route calculated from "${start}" to "${end}"`);
            return true;
          }
        }
      }

      const location = rest.replace(/^search\s+/i, "").trim();
      const input = document.querySelector("#map-search-input");
      const btn = document.querySelector("#map-search-button");

      if (input && location) {
        setInputValue(input, location);
        if (btn) btn.click();
        logCommand(`Maps: Searching location "${location}"`);
        return true;
      }
    }

    // 8. CALCULATOR
    if (lower.startsWith("calculator ") || lower.startsWith("calc ") || lower.startsWith("waldcalc ")) {
      const rest = text.replace(/^(calculator|calc|waldcalc)\s*/i, "").trim();

      if (rest.toLowerCase() === "clear") {
        const clearBtn = document.querySelector('#calculatorscreen .calc-btn[data-action="clear"]');
        if (clearBtn) clearBtn.click();
        logCommand("Calculator cleared.");
        return true;
      }

      const expr = rest
        .replace(/^calculate\s+/i, "")
        .replace(/plus/g, "+")
        .replace(/minus/g, "-")
        .replace(/times|multiplied by/g, "*")
        .replace(/divided by|over/g, "/");

      if (expr) {
        const calcInput = document.querySelector("#calc-input");
        if (calcInput) {
          setInputValue(calcInput, expr);
          const calcBtn = document.querySelector('#calculatorscreen .calc-btn[data-action="calculate"]');
          if (calcBtn) calcBtn.click();
          logCommand(`Calculator executed: ${expr}`);
          return true;
        }
      }
    }

    // 9. CLOCK / TIMER
    if (lower.startsWith("clock ") || lower.startsWith("timer ") || lower.startsWith("waldclock ")) {
      const rest = text.replace(/^(clock|timer|waldclock)\s*/i, "").trim();

      if (/^timer\s+/i.test(rest) || /^\d+/.test(rest)) {
        const timerMatch = rest.match(/(\d+)/);
        if (timerMatch) {
          const minutes = timerMatch[1];
          const timerTab = document.querySelector('.clock-tab-btn[data-tab="timer"]');
          const minInput = document.querySelector("#timer-min");
          const secInput = document.querySelector("#timer-sec");
          const startTimerBtn = document.querySelector("#timer-start-btn");

          if (timerTab) timerTab.click();
          if (minInput) setInputValue(minInput, minutes);
          if (secInput) setInputValue(secInput, 0);
          if (startTimerBtn) startTimerBtn.click();
          logCommand(`Timer set to ${minutes} minute(s).`);
          return true;
        }
      }

      if (rest.toLowerCase() === "start") {
        const startTimerBtn = document.querySelector("#timer-start-btn");
        const timerTab = document.querySelector('.clock-tab-btn[data-tab="timer"]');
        if (timerTab) timerTab.click();
        if (startTimerBtn) startTimerBtn.click();
        logCommand("Timer started.");
        return true;
      }

      if (rest.toLowerCase() === "reset") {
        const resetTimerBtn = document.querySelector("#timer-reset-btn");
        if (resetTimerBtn) resetTimerBtn.click();
        logCommand("Timer reset.");
        return true;
      }
    }

    // 10. CALENDAR / MOONCALENDAR
    if (lower.startsWith("calendar ") || lower.startsWith("mooncalendar ") || lower.startsWith("add event ")) {
      const eventText = text.replace(/^(calendar|mooncalendar|add event)\s*(add|write)?\s*/i, "").trim();
      const calText = document.querySelector("#calendar-text");
      const dateInput = document.querySelector("#calendar-date");
      const calBtn = document.querySelector("#calendar-add-button");

      if (calText && eventText) {
        setInputValue(calText, eventText);
        if (dateInput && !dateInput.value) {
          dateInput.value = new Date().toISOString().split("T")[0];
        }
        if (calBtn) calBtn.click();
        logCommand(`Event added: "${eventText}"`);
        return true;
      }
    }

    return false;
  }

  // --- Haupt-Parser ---

  function processCommand(text) {
    const lower = text.toLowerCase().trim();

    if (lower === "close all" || lower === "close everything") {
      closeAllApps();
      logCommand("All apps closed.");
      return;
    }

    const isOpenAction = lower.startsWith("open ") || lower.startsWith("launch ") || lower.startsWith("start ");
    const isCloseAction = lower.startsWith("close ") || lower.startsWith("quit ") || lower.startsWith("exit ");
    const isMaximizeAction = lower.startsWith("maximize ") || lower.startsWith("expand ");
    const isRestoreAction = lower.startsWith("restore ") || lower.startsWith("minimize ") || lower.startsWith("unmaximize ");

    if (isOpenAction || isCloseAction || isMaximizeAction || isRestoreAction) {
      const cleanText = lower.replace(/^(open|launch|start|close|quit|exit|maximize|expand|restore|minimize|unmaximize)\s+/i, "").trim();

      for (const app of apps) {
        const hasKeyword = app.keywords.some((kw) => cleanText === kw || cleanText.includes(kw));

        if (hasKeyword) {
          if (isOpenAction) {
            openApp(app.windowId, app.containerId);
            logCommand(`App opened: ${app.name}`);
          } else if (isCloseAction) {
            closeApp(app.windowId, app.containerId);
            logCommand(`App closed: ${app.name}`);
          } else if (isMaximizeAction) {
            maximizeApp(app.windowId, app.containerId);
            logCommand(`App maximized: ${app.name}`);
          } else if (isRestoreAction) {
            restoreApp(app.windowId, app.containerId);
            logCommand(`App restored: ${app.name}`);
          }
          return;
        }
      }
    }
    processInAppCommands(text);
  }
});