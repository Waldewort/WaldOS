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
const INTRO_DURATION = 7.5;
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
  const assistantContainer = document.getElementById("assistant-container");
  const starRing = document.getElementById("star-ring");

  if (!title || !subtitle || !assistantContainer) return;

  title.classList.remove("fly-in");
  subtitle.classList.remove("fly-in");
  assistantContainer.classList.remove("fly-in");
  if (starRing) starRing.classList.remove("fly-in");

  void title.offsetWidth;

  title.classList.add("fly-in");
  subtitle.classList.add("fly-in");
  assistantContainer.classList.add("fly-in");
  if (starRing) starRing.classList.add("fly-in");
}

function updateStarsArray(targetCount) {
  const canvas = document.getElementById("starfield");
  const width = canvas ? canvas.width : window.innerWidth;
  const height = canvas ? canvas.height : window.innerHeight;

  const centerX = width / 2;
  const centerY = height / 2;

  const isIntroActive = typeof introTime !== "undefined" && typeof INTRO_DURATION !== "undefined" && introTime < INTRO_DURATION;

  stars.length = 0; // Setzt die Sterne zurück
  shootingStars.length = 0; // Setzt Sternschnuppen für das Intro zurück

  while (stars.length < targetCount) {
    if (isIntroActive) {
      let angle = Math.random() * Math.PI * 2;
      let initialRadius = Math.random() * 470;
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

  // Erzeuge spezielle Intro-Sternschnuppen
  if (isIntroActive) {
    const introShootingStarCount = Math.max(3, maxShootingStars);
    for (let i = 0; i < introShootingStarCount; i++) {
      let angle = Math.random() * Math.PI * 2;
      let initialRadius = Math.random() * 450 + 50;
      let explodeSpeed = Math.random() * 25 + 15;

      shootingStars.push({
        isIntroStar: true,
        x: centerX,
        y: centerY,
        angle: angle,
        orbitRadius: initialRadius,
        // KORREKTUR: Negativer Faktor dreht die Richtung in die entgegengesetzte Seite
        orbitSpeed: -(Math.random() * 0.04 + 0.015),
        vx: Math.cos(angle) * explodeSpeed,
        vy: Math.sin(angle) * explodeSpeed,
        len: Math.random() * 100 + 70,
        speed: Math.random() * 8 + 6,
        size: Math.random() * 1.5 + 1.0,
        alpha: 1
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
    isIntroStar: false,
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

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      isstarted = true;
      lastTime = performance.now();
      if (stars.length === 0) {
        updateStarsArray(numStars);
      }
    } else {
      isstarted = false;
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

    if (!isstarted) {
      return;
    }

    introTime += deltaTime;
    const deltaFactor = deltaTime * 60;

    if (introTime >= 4.33 && !titleFlyInTriggered) {
      titleFlyInTriggered = true;
      triggerTitleFlyIn();
    }

    // Erzeugung regulärer Sternschnuppen im normalen Betrieb (nach dem Intro)
    if (introTime >= INTRO_DURATION && maxShootingStars > 0 && Math.random() < 0.03 && shootingStars.length < maxShootingStars) {
      spawnShootingStar();
    }

    // Aktualisierung & Zeichnen der Sternschnuppen
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      let ss = shootingStars[i];

      if (ss.isIntroStar) {
        if (introTime < 6.0) {
          // Phase 1: Drehung im Kreis zusammen mit den Sternen
          let growthFactor = Math.min(1.0, introTime / 6.0);
          let currentRadius = ss.orbitRadius * growthFactor;

          ss.angle += ss.orbitSpeed * deltaFactor;
          ss.x = (width / 2) + Math.cos(ss.angle) * currentRadius;
          ss.y = (height / 2) + Math.sin(ss.angle) * currentRadius;
        } else {
          // Phase 2: Beim Eintreffen nach außen katapultieren
          ss.x += ss.vx * deltaFactor;
          ss.y += ss.vy * deltaFactor;
        }

        // Entferne Intro-Sternschnuppen, sobald sie den Bildrand verlassen
        if (ss.x < -100 || ss.x > width + 100 || ss.y < -100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }
      } else {
        // Normales Verhalten regulärer Sternschnuppen
        ss.x += Math.cos(ss.angle) * ss.speed * speedMultiplier * deltaFactor;
        ss.y += Math.sin(ss.angle) * ss.speed * speedMultiplier * deltaFactor;
        ss.alpha = Math.max(0, ss.alpha - 0.008 * deltaFactor);

        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }
      }

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);

      let tailX, tailY;

      if (ss.isIntroStar && introTime < 6.0) {
        // ERWEITERUNG: Gebogene Schweife entlang der Kreisbahn zeichnen
        let growthFactor = Math.min(1.0, introTime / 6.0);
        let currentRadius = ss.orbitRadius * growthFactor;
        
        // Berechne den früheren Winkel, aus dem die Schnuppe kam
        let tailAngle = ss.angle - (ss.orbitSpeed * (ss.len / 15));
        tailX = (width / 2) + Math.cos(tailAngle) * currentRadius;
        tailY = (height / 2) + Math.sin(tailAngle) * currentRadius;

        // Kontrollpunkt für die Biege-Kurve (Bézier)
        let midAngle = (ss.angle + tailAngle) / 2;
        let controlX = (width / 2) + Math.cos(midAngle) * currentRadius;
        let controlY = (height / 2) + Math.sin(midAngle) * currentRadius;

        let ssGradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        ssGradient.addColorStop(0, `rgba(${Math.round(currStarColor.r)}, ${Math.round(currStarColor.g)}, ${Math.round(currStarColor.b)}, ${ss.alpha})`);
        ssGradient.addColorStop(0.2, `rgba(${Math.round(currLineColor.r)}, ${Math.round(currLineColor.g)}, ${Math.round(currLineColor.b)}, ${ss.alpha * 0.8})`);
        ssGradient.addColorStop(1, `rgba(${Math.round(currLineColor.r)}, ${Math.round(currLineColor.g)}, ${Math.round(currLineColor.b)}, 0)`);

        ctx.strokeStyle = ssGradient;
        ctx.lineWidth = ss.size;
        ctx.quadraticCurveTo(controlX, controlY, tailX, tailY);
        ctx.stroke();
      } else {
        // Geradliniger Schweife für Explosion oder normale Sternschnuppen
        let tailAngle = ss.isIntroStar ? Math.atan2(ss.vy, ss.vx) + Math.PI : ss.angle;
        tailX = ss.x - Math.cos(tailAngle) * ss.len;
        tailY = ss.y - Math.sin(tailAngle) * ss.len;

        let ssGradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        ssGradient.addColorStop(0, `rgba(${Math.round(currStarColor.r)}, ${Math.round(currStarColor.g)}, ${Math.round(currStarColor.b)}, ${ss.alpha})`);
        ssGradient.addColorStop(0.2, `rgba(${Math.round(currLineColor.r)}, ${Math.round(currLineColor.g)}, ${Math.round(currLineColor.b)}, ${ss.alpha * 0.8})`);
        ssGradient.addColorStop(1, `rgba(${Math.round(currLineColor.r)}, ${Math.round(currLineColor.g)}, ${Math.round(currLineColor.b)}, 0)`);

        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = ssGradient;
        ctx.lineWidth = ss.size;
        ctx.stroke();
      }
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