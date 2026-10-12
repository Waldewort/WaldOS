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
