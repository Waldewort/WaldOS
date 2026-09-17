(function initStellariumRealEngine() {
  const windowEl = document.getElementById("stargazerscreen");
  const iconEl = document.getElementById("openstargazerscreen");
  const taskbarItem = document.getElementById("stargazer");
  const closeBtn = document.getElementById("closestargazerscreen");
  const container = document.getElementById("sky-3d-container");

  if (!windowEl || !container) return;

  // --- Schließen-Funktion & Markierung entfernen ---
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      windowEl.style.display = "none";
      windowEl.classList.remove("active", "open", "show");

      [taskbarItem, iconEl].forEach((el) => {
        if (!el) return;
        el.classList.remove("active", "selected", "open", "running", "active-app");
        if (el.parentElement) {
          el.parentElement.classList.remove("active", "selected", "open");
        }
      });
    });
  }

  // --- Ortsfinder mit Suchleiste & Geocoding ---
  const searchInput = document.getElementById("sky-search-input");
  const searchBtn = document.getElementById("sky-search-btn");
  const geoBtn = document.getElementById("sky-geolocation-btn");

  function updateLocation(lat, lon) {
    currentLat = parseFloat(lat);
    currentLon = parseFloat(lon);
  }

  async function searchLocation(query) {
    if (!query.trim()) return;

    const originalBtnText = searchBtn.textContent;
    searchBtn.textContent = "⌛...";
    searchBtn.disabled = true;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Netzwerkfehler bei der Standortabfrage");

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        updateLocation(lat, lon);
        searchInput.value = result.display_name.split(",")[0];
      } else {
        alert("Ort konnte nicht gefunden werden. Bitte prüfen Sie die Eingabe.");
      }
    } catch (error) {
      console.error("Geocoding-Fehler:", error);
      alert("Fehler bei der Ortssuche.");
    } finally {
      searchBtn.textContent = originalBtnText;
      searchBtn.disabled = false;
    }
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => searchLocation(searchInput.value));
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchLocation(searchInput.value);
    });
  }

  if (geoBtn) {
    geoBtn.addEventListener("click", () => {
      if ("geolocation" in navigator) {
        geoBtn.textContent = "⌛...";
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateLocation(position.coords.latitude, position.coords.longitude);
            geoBtn.textContent = "📍 GPS";
            if (searchInput) searchInput.value = "Aktueller Standort";
          },
          (error) => {
            geoBtn.textContent = "📍 GPS";
            alert("GPS-Zugriff nicht möglich: " + error.message);
          }
        );
      } else {
        alert("Geolocation wird von Ihrem Browser nicht unterstützt.");
      }
    });
  }

  // --- High-Definition Three.js Renderer & Szene Setup ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020307);
  scene.fog = new THREE.FogExp2(0x0a101d, 0.0003);

  const camera = new THREE.PerspectiveCamera(55, (container.clientWidth || 1) / (container.clientHeight || 1), 0.1, 4000);
  camera.position.set(0, 0, 0.1);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    precision: "highp"
  });

  const updatePixelRatio = () => Math.min(window.devicePixelRatio || 1, 2.5);
  renderer.setPixelRatio(updatePixelRatio());
  renderer.setSize(container.clientWidth || 300, container.clientHeight || 150);
  container.appendChild(renderer.domElement);

  const celestialSphere = new THREE.Group();
  scene.add(celestialSphere);

  const SPHERE_RADIUS = 1200;

  function bvToRGB(bv) {
    let r = 1.0, g = 1.0, b = 1.0;
    bv = Math.max(-0.4, Math.min(2.0, bv));

    if (bv < 0.0) {
      r = 0.6 + 0.4 * (bv + 0.4); g = 0.7 + 0.3 * (bv + 0.4); b = 1.0;
    } else if (bv < 0.4) {
      r = 0.8 + 0.2 * (bv / 0.4); g = 0.8 + 0.2 * (bv / 0.4); b = 1.0 - 0.2 * (bv / 0.4);
    } else if (bv < 0.8) {
      r = 1.0; g = 1.0 - 0.15 * ((bv - 0.4) / 0.4); b = 0.8 - 0.3 * ((bv - 0.4) / 0.4);
    } else if (bv < 1.4) {
      r = 1.0; g = 0.85 - 0.25 * ((bv - 0.8) / 0.6); b = 0.5 - 0.3 * ((bv - 0.8) / 0.6);
    } else {
      r = 1.0; g = 0.6 - 0.2 * ((bv - 1.4) / 0.6); b = 0.2;
    }
    return new THREE.Color(r, g, b);
  }

  async function loadRealStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.98,
      sizeAttenuation: false
    });

    try {
      const res = await fetch("https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/stars.6.json");
      if (!res.ok) throw new Error("Netzwerkfehler");
      const data = await res.json();
      const features = data.features;
      const count = features.length;

      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      features.forEach((star, i) => {
        const [raDeg, decDeg] = star.geometry.coordinates;
        const mag = star.properties.mag;
        const bv = star.properties.bv !== undefined ? star.properties.bv : 0.4;
        const name = star.properties.n;

        const raRad = (raDeg / 15) * 15 * (Math.PI / 180);
        const decRad = decDeg * (Math.PI / 180);

        const x = SPHERE_RADIUS * Math.cos(decRad) * Math.cos(raRad);
        const y = SPHERE_RADIUS * Math.sin(decRad);
        const z = SPHERE_RADIUS * Math.cos(decRad) * Math.sin(raRad);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const color = bvToRGB(bv);
        if (mag < 1.2) color.multiplyScalar(1.4);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        if (name && mag < 1.8) {
          createStarLabel(name, x, y, z);
        }
      });

      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      celestialSphere.add(new THREE.Points(starGeometry, starMaterial));
    } catch (e) {
      console.warn("Lade Fallback-Sterne...", e);
      generateProceduralHDStars();
    }
  }

  function generateProceduralHDStars() {
    const count = 4500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * 2.0 * Math.PI, phi = Math.acos(2.0 * v - 1.0);
      positions[i * 3] = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = SPHERE_RADIUS * Math.cos(phi);

      const c = bvToRGB((Math.random() - 0.2) * 1.8);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    celestialSphere.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 2.2, vertexColors: true, sizeAttenuation: false })));
  }

  function createStarLabel(text, x, y, z, colorStr = "rgba(0, 243, 255, 0.85)") {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = colorStr;
    ctx.font = "Bold 24px -apple-system, sans-serif";
    ctx.fillText(text, 8, 40);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.position.set(x * 0.98, y * 0.98 + 14, z * 0.98);
    sprite.scale.set(70, 17.5, 1);
    celestialSphere.add(sprite);
  }

  // --- IAU Kürzel zu englischen Namen ---
  const constellationNamesMap = {
    "And": "Andromeda", "Ant": "Antlia", "Aps": "Apus", "Aqr": "Aquarius", "Aql": "Aquila",
    "Ara": "Ara", "Ari": "Aries", "Aur": "Auriga", "Boo": "Boötes", "Cae": "Caelum",
    "Cam": "Camelopardalis", "Cnc": "Cancer", "CVn": "Canes Venatici", "CMa": "Canis Major",
    "CMi": "Canis Minor", "Cap": "Capricornus", "Car": "Carina", "Cas": "Cassiopeia",
    "Cen": "Centaurus", "Cep": "Cepheus", "Cet": "Cetus", "Cha": "Chamaeleon",
    "Cir": "Circinus", "Col": "Columba", "Com": "Coma Berenices", "CrA": "Corona Australis",
    "CrB": "Corona Borealis", "Crv": "Corvus", "Crt": "Crater", "Cru": "Crux",
    "Cyg": "Cygnus", "Del": "Delphinus", "Dor": "Dorado", "Dra": "Draco",
    "Equ": "Equuleus", "Eri": "Eridanus", "For": "Fornax", "Gem": "Gemini",
    "Gru": "Grus", "Her": "Hercules", "Hor": "Horologium", "Hya": "Hydra",
    "Hyi": "Hydrus", "Ind": "Indus", "Lac": "Lacerta", "Leo": "Leo",
    "LMi": "Leo Minor", "Lep": "Lepus", "Lib": "Libra", "Lup": "Lupus",
    "Lyn": "Lynx", "Lyr": "Lyra", "Men": "Mensa", "Mic": "Microscopium",
    "Mon": "Monoceros", "Mus": "Musca", "Nor": "Norma", "Oct": "Octans",
    "Oph": "Ophiuchus", "Ori": "Orion", "Pav": "Pavo", "Peg": "Pegasus",
    "Per": "Perseus", "Phe": "Phoenix", "Pic": "Pictor", "Psc": "Pisces",
    "PsA": "Piscis Austrinus", "Pup": "Puppis", "Pyx": "Pyxis", "Ret": "Reticulum",
    "Sge": "Sagitta", "Sgr": "Sagittarius", "Sco": "Scorpius", "Scl": "Sculptor",
    "Sct": "Scutum", "Ser": "Serpens", "Sex": "Sextans", "Tau": "Taurus",
    "Tel": "Telescopium", "Tri": "Triangulum", "TrA": "Triangulum Australe",
    "Tuc": "Tucana", "UMa": "Ursa Major", "UMi": "Ursa Minor", "Vel": "Vela",
    "Vir": "Virgo", "Vol": "Volans", "Vul": "Vulpecula"
  };

  // --- Sternbildlinien & Interaktive Klick-Bereiche ---
  let constellationLinesMesh = null;
  let constellationRanges = [];

  async function loadRealConstellations() {
    const linePositions = [];
    constellationRanges = [];

    try {
      const res = await fetch("https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.lines.json");
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();

      data.features.forEach(feature => {
        const geom = feature.geometry;
        if (!geom) return;

        const rawName = feature.id || (feature.properties && feature.properties.name) || "";
        const englishName = constellationNamesMap[rawName] || rawName || "Constellation";

        let paths = [];
        if (geom.type === "LineString") {
          paths = [geom.coordinates];
        } else if (geom.type === "MultiLineString") {
          paths = geom.coordinates;
        }

        const startVertex = linePositions.length / 3;

        paths.forEach(path => {
          if (!Array.isArray(path) || path.length < 2) return;
          
          for (let i = 0; i < path.length - 1; i++) {
            const pt1 = path[i];
            const pt2 = path[i + 1];

            if (!Array.isArray(pt1) || !Array.isArray(pt2) || pt1.length < 2 || pt2.length < 2) continue;

            const ra1 = pt1[0], dec1 = pt1[1];
            const ra2 = pt2[0], dec2 = pt2[1];

            const r1 = ra1 * (Math.PI / 180), d1 = dec1 * (Math.PI / 180);
            const r2 = ra2 * (Math.PI / 180), d2 = dec2 * (Math.PI / 180);

            linePositions.push(
              SPHERE_RADIUS * Math.cos(d1) * Math.cos(r1), SPHERE_RADIUS * Math.sin(d1), SPHERE_RADIUS * Math.cos(d1) * Math.sin(r1),
              SPHERE_RADIUS * Math.cos(d2) * Math.cos(r2), SPHERE_RADIUS * Math.sin(d2), SPHERE_RADIUS * Math.cos(d2) * Math.sin(r2)
            );
          }
        });

        const endVertex = linePositions.length / 3;
        if (endVertex > startVertex) {
          constellationRanges.push({
            name: englishName,
            startVertex: startVertex,
            endVertex: endVertex
          });
        }
      });

      buildConstellationMesh(linePositions);
    } catch (e) {
      console.warn("Verbindung fehlgeschlagen. Lade Offline-Datenbank...", e);
      buildFallbackConstellations();
    }
  }

  function buildConstellationMesh(linePositions) {
    if (constellationLinesMesh) {
      celestialSphere.remove(constellationLinesMesh);
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00d8ff,
      transparent: true,
      opacity: 0.65,
      linewidth: 1.5
    });

    constellationLinesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    celestialSphere.add(constellationLinesMesh);
  }

  function buildFallbackConstellations() {
    const famousConstellations = {
      "Ursa Major": [[[166.4, 61.7], [165.9, 56.4]], [[165.9, 56.4], [178.5, 53.7]], [[178.5, 53.7], [182.6, 57.0]], [[182.6, 57.0], [166.4, 61.7]], [[178.5, 53.7], [193.5, 54.9]], [[193.5, 54.9], [206.9, 49.3]], [[206.9, 49.3], [206.4, 54.9]]],
      "Ursa Minor": [[[37.9, 89.2], [220.6, 74.2]], [[220.6, 74.2], [228.3, 71.8]], [[228.3, 71.8], [236.4, 77.8]], [[236.4, 77.8], [226.1, 75.8]], [[226.1, 75.8], [220.6, 74.2]], [[236.4, 77.8], [230.1, 82.0]], [[230.1, 82.0], [37.9, 89.2]]],
      "Orion": [[[88.8, 7.4], [81.3, 6.3]], [[81.3, 6.3], [78.6, -8.2]], [[78.6, -8.2], [85.2, -9.6]], [[85.2, -9.6], [88.8, 7.4]], [[84.0, -1.2], [84.7, -1.9]], [[84.7, -1.9], [85.4, -2.4]], [[88.8, 7.4], [84.0, -1.2]], [[81.3, 6.3], [85.4, -2.4]], [[84.0, -1.2], [78.6, -8.2]], [[85.4, -2.4], [85.2, -9.6]]],
      "Cassiopeia": [[[1.2, 59.1], [9.2, 56.5]], [[9.2, 56.5], [14.2, 60.7]], [[14.2, 60.7], [21.5, 60.2]], [[21.5, 60.2], [28.6, 63.7]]],
      "Cygnus": [[[296.2, 45.3], [304.8, 40.2]], [[304.8, 40.2], [311.1, 33.9]], [[304.8, 40.2], [292.4, 28.0]], [[304.8, 40.2], [318.0, 52.2]], [[311.1, 33.9], [320.7, 30.2]]],
      "Lyra": [[[283.4, 38.8], [284.8, 36.9]], [[284.8, 36.9], [288.7, 32.7]], [[288.7, 32.7], [289.8, 36.1]], [[289.8, 36.1], [284.8, 36.9]], [[288.7, 32.7], [285.5, 33.4]]],
      "Aquila": [[[297.7, 8.8], [296.2, 0.7]], [[296.2, 0.7], [289.3, -4.7]], [[296.2, 0.7], [302.8, -3.1]], [[297.7, 8.8], [290.7, 13.9]]],
      "Taurus": [[[68.9, 16.5], [67.1, 15.9]], [[68.9, 16.5], [84.4, 28.6]], [[67.1, 15.9], [79.2, 19.2]]],
      "Gemini": [[[116.4, 31.9], [113.6, 28.3]], [[113.6, 28.3], [99.3, 16.4]], [[116.4, 31.9], [107.6, 25.1]], [[107.6, 25.1], [95.7, 20.1]]],
      "Leo": [[[152.1, 11.9], [155.5, 19.8]], [[155.5, 19.8], [153.4, 26.0]], [[153.4, 26.0], [146.5, 23.8]], [[146.5, 23.8], [147.9, 14.6]], [[147.9, 14.6], [152.1, 11.9]], [[152.1, 11.9], [175.9, 14.6]], [[175.9, 14.6], [177.3, 20.5]], [[177.3, 20.5], [168.5, 20.5]], [[168.5, 20.5], [155.5, 19.8]]]
    };

    const linePositions = [];
    constellationRanges = [];

    Object.entries(famousConstellations).forEach(([name, lines]) => {
      const startVertex = linePositions.length / 3;

      lines.forEach(([p1, p2]) => {
        const r1 = p1[0] * (Math.PI / 180), d1 = p1[1] * (Math.PI / 180);
        const r2 = p2[0] * (Math.PI / 180), d2 = p2[1] * (Math.PI / 180);

        linePositions.push(
          SPHERE_RADIUS * Math.cos(d1) * Math.cos(r1), SPHERE_RADIUS * Math.sin(d1), SPHERE_RADIUS * Math.cos(d1) * Math.sin(r1),
          SPHERE_RADIUS * Math.cos(d2) * Math.cos(r2), SPHERE_RADIUS * Math.sin(d2), SPHERE_RADIUS * Math.cos(d2) * Math.sin(r2)
        );
      });

      const endVertex = linePositions.length / 3;
      if (endVertex > startVertex) {
        constellationRanges.push({
          name: name,
          startVertex: startVertex,
          endVertex: endVertex
        });
      }
    });

    buildConstellationMesh(linePositions);
  }

  // --- Popup-Anzeige für den englischen Namen ---
  function showConstellationInfo(name) {
    let popup = document.getElementById("sky-constellation-toast");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "sky-constellation-toast";
      popup.style.cssText = `
        position: absolute;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(8, 26, 36, 0.92);
        border: 1px solid #00d8ff;
        box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
        color: #ffffff;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        z-index: 100;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
      `;
      container.appendChild(popup);
    }

    popup.textContent = `✨ Constellation: ${name}`;
    popup.style.opacity = "1";
    popup.style.transform = "translateX(-50%) translateY(0)";

    clearTimeout(popup.timeout);
    popup.timeout = setTimeout(() => {
      popup.style.opacity = "0";
      popup.style.transform = "translateX(-50%) translateY(-10px)";
    }, 3200);
  }

  // --- Äquatorialnetz (Gitter) ---
  let gridLinesMesh = null;
  function createEquatorialGrid() {
    const gridPositions = [];
    const SPHERE_R = SPHERE_RADIUS * 0.99;

    [-60, -30, 0, 30, 60].forEach(decDeg => {
      const decRad = decDeg * (Math.PI / 180);
      const segments = 96;
      for (let i = 0; i < segments; i++) {
        const ra1 = (i / segments) * Math.PI * 2;
        const ra2 = ((i + 1) / segments) * Math.PI * 2;
        gridPositions.push(
          SPHERE_R * Math.cos(decRad) * Math.cos(ra1), SPHERE_R * Math.sin(decRad), SPHERE_R * Math.cos(decRad) * Math.sin(ra1),
          SPHERE_R * Math.cos(decRad) * Math.cos(ra2), SPHERE_R * Math.sin(decRad), SPHERE_R * Math.cos(decRad) * Math.sin(ra2)
        );
      }
    });

    for (let h = 0; h < 24; h += 2) {
      const raRad = (h / 24) * Math.PI * 2;
      const segments = 48;
      for (let i = 0; i < segments; i++) {
        const dec1 = (-80 + (i / segments) * 160) * (Math.PI / 180);
        const dec2 = (-80 + ((i + 1) / segments) * 160) * (Math.PI / 180);
        gridPositions.push(
          SPHERE_R * Math.cos(dec1) * Math.cos(raRad), SPHERE_R * Math.sin(dec1), SPHERE_R * Math.cos(dec1) * Math.sin(raRad),
          SPHERE_R * Math.cos(dec2) * Math.cos(raRad), SPHERE_R * Math.sin(dec2), SPHERE_R * Math.cos(dec2) * Math.sin(raRad)
        );
      }
    }

    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    gridLinesMesh = new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({
      color: 0x089b9b,
      transparent: true,
      opacity: 0.45
    }));
    gridLinesMesh.visible = false;
    celestialSphere.add(gridLinesMesh);
  }

  createEquatorialGrid();

  const gridBtn = document.getElementById("sky-grid-btn");
  if (gridBtn) {
    gridBtn.addEventListener("click", () => {
      if (gridLinesMesh) {
        gridLinesMesh.visible = !gridLinesMesh.visible;
        gridBtn.classList.toggle("active", gridLinesMesh.visible);
      }
    });
  }

  // --- Milchstraße ---
  function createMilkyWayDust() {
    const particleCount = 16000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const inc = 62.87 * (Math.PI / 180);
    const node = 282.85 * (Math.PI / 180);

    for (let i = 0; i < particleCount; i++) {
      const b = (Math.random() - 0.5) * 0.38;
      const l = Math.random() * Math.PI * 2;

      const sinDec = Math.sin(b) * Math.cos(inc) + Math.cos(b) * Math.sin(inc) * Math.sin(l);
      const dec = Math.asin(sinDec);
      const ra = Math.atan2(
        Math.cos(b) * Math.cos(l),
        Math.sin(b) * Math.sin(inc) - Math.cos(b) * Math.cos(inc) * Math.sin(l)
      ) + node;

      positions[i * 3] = SPHERE_RADIUS * Math.cos(dec) * Math.cos(ra);
      positions[i * 3 + 1] = SPHERE_RADIUS * Math.sin(dec);
      positions[i * 3 + 2] = SPHERE_RADIUS * Math.cos(dec) * Math.sin(ra);

      const intensity = 0.1 + Math.random() * 0.3;
      colors[i * 3] = 0.15 * intensity;
      colors[i * 3 + 1] = 0.4 * intensity;
      colors[i * 3 + 2] = 0.6 * intensity;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    celestialSphere.add(new THREE.Points(geometry, new THREE.PointsMaterial({
      size: 5.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: false
    })));
  }

  loadRealStars();
  loadRealConstellations();
  createMilkyWayDust();

  // --- Horizont & Kompass ---
  function createStellariumLandscape() {
    const groundGeo = new THREE.CylinderGeometry(850, 850, 2000, 64, 1, true);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x020403,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.98
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1000;
    scene.add(ground);

    const directions = [
      { text: "N", angle: 0 }, { text: "NO", angle: 45 },
      { text: "O", angle: 90 }, { text: "SO", angle: 135 },
      { text: "S", angle: 180 }, { text: "SW", angle: 225 },
      { text: "W", angle: 270 }, { text: "NW", angle: 315 }
    ];

    directions.forEach(d => {
      const canvas = document.createElement("canvas");
      canvas.width = 128; canvas.height = 128;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ff2222";
      ctx.font = "Bold 64px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.text, 64, 80);

      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
      const rad = d.angle * (Math.PI / 180);
      const dist = 780;

      sprite.position.set(dist * Math.sin(rad), -2, -dist * Math.cos(rad));
      sprite.scale.set(45, 45, 1);
      scene.add(sprite);
    });
  }
  createStellariumLandscape();

  // --- Kamera- & Maussteuerung sowie Klick-Erkennung ---
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let clickStartX = 0, clickStartY = 0;
  let lon = 185, lat = 18;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
    clickStartX = e.clientX;
    clickStartY = e.clientY;
  });

  window.addEventListener('mouseup', () => isDragging = false);

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    lon -= (e.clientX - prevMouse.x) * 0.15;
    lat = Math.max(3, Math.min(85, lat + (e.clientY - prevMouse.y) * 0.15));
    prevMouse = { x: e.clientX, y: e.clientY };
  }, { passive: true });

  container.addEventListener('click', (e) => {
    const distMoved = Math.hypot(e.clientX - clickStartX, e.clientY - clickStartY);
    if (distMoved > 6) return; // Nicht als Klick werten, wenn gedreht wurde

    if (!constellationLinesMesh || !constellationLinesMesh.visible) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.params.Line.threshold = 22; // Hohe Klick-Sensitivität
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

    const intersects = raycaster.intersectObject(constellationLinesMesh);

    if (intersects.length > 0) {
      const hitIndex = intersects[0].index;
      const found = constellationRanges.find(r => hitIndex >= r.startVertex && hitIndex < r.endVertex);
      if (found) {
        showConstellationInfo(found.name);
      }
    }
  });

  container.addEventListener('wheel', (e) => {
    camera.fov = Math.max(10, Math.min(80, camera.fov + e.deltaY * 0.04));
    camera.updateProjectionMatrix();
  }, { passive: true });

  // --- Zeit- & Positionssimulation ---
  let currentLat = 49.27;
  let currentLon = 8.32;
  let simulationTime = new Date();
  let isTimelapse = true;
  let timeSpeed = 100;

  const constellationsBtn = document.getElementById("sky-constellations-btn");
  const timelapseBtn = document.getElementById("sky-timelapse-btn");
  const speedSelect = document.getElementById("sky-speed-select");
  const dateTimePicker = document.getElementById("sky-datetime-picker");
  const currentTimeEl = document.getElementById("sky-current-time");

  if (constellationsBtn) {
    constellationsBtn.addEventListener("click", () => {
      if (constellationLinesMesh) {
        constellationLinesMesh.visible = !constellationLinesMesh.visible;
        constellationsBtn.classList.toggle("active", constellationLinesMesh.visible);
      }
    });
  }

  if (timelapseBtn) {
    timelapseBtn.addEventListener("click", () => {
      isTimelapse = !isTimelapse;
      timelapseBtn.classList.toggle("active", isTimelapse);
    });
  }

  if (speedSelect) speedSelect.addEventListener("change", (e) => timeSpeed = parseFloat(e.target.value));

  function onWindowResize() {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(updatePixelRatio());
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", onWindowResize);

  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        onWindowResize();
      }
    });
    resizeObserver.observe(container);
  }

  const triggerResize = () => setTimeout(onWindowResize, 50);
  if (iconEl) iconEl.addEventListener("click", triggerResize);
  if (taskbarItem) taskbarItem.addEventListener("click", triggerResize);

  const toggleBtn = document.getElementById("sky-toggle-controls-btn");
  const topControls = document.getElementById("sky-top-controls");
  if (toggleBtn && topControls) {
    toggleBtn.addEventListener("click", () => {
      topControls.classList.toggle("collapsed");
    });
  }

  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);

    const delta = (now - lastTime) / 1000;
    lastTime = now;

    if (isTimelapse) {
      simulationTime = new Date(simulationTime.getTime() + delta * 1000 * timeSpeed);
      if (dateTimePicker) {
        const local = new Date(simulationTime.getTime() - simulationTime.getTimezoneOffset() * 60000);
        dateTimePicker.value = local.toISOString().slice(0, 16);
      }
    }

    if (currentTimeEl) {
      const isoStr = simulationTime.toISOString();
      currentTimeEl.textContent = `${isoStr.slice(0, 10)} ${isoStr.slice(11, 19)} UTC`;
    }

    const jd = (simulationTime.getTime() / 86400000) + 2440587.5;
    const d = jd - 2451545.0;
    const lstRad = (((18.697374558 + 24.06570982441908 * d) + currentLon / 15) % 24) * 15 * (Math.PI / 180);

    celestialSphere.rotation.x = (90 - currentLat) * (Math.PI / 180);
    celestialSphere.rotation.y = lstRad;

    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    camera.lookAt(new THREE.Vector3(
      100 * Math.sin(phi) * Math.cos(theta),
      100 * Math.cos(phi),
      100 * Math.sin(phi) * Math.sin(theta)
    ));

    renderer.render(scene, camera);
  }

  onWindowResize();
  animate(performance.now());
})();