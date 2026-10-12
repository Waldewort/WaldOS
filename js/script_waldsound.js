let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function createWhiteNoiseBuffer(ctx) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  return noise;
}

function createPinkNoiseBuffer(ctx) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11;
    b6 = white * 0.115926;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  return noise;
}

const generators = {
  // WIND
  wind: (ctx) => {
    const noise = createPinkNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200; // Grundfrequenz des Winds
    filter.Q.value = 2.0;

    // 1. Zufallsgenerator über tiefpassgefiltertes Rauschen (Slow Random LFO)
    const modulationNoise = createPinkNoiseBuffer(ctx);
    const slowFilter = ctx.createBiquadFilter();
    slowFilter.type = 'lowpass';
    slowFilter.frequency.value = 0.15; // Steuert, wie schnell sich der Wind ändert

    // Verstärkung der Zufalls-Modulation
    const modGain = ctx.createGain();
    modGain.gain.value = 350; // Maximale Auslenkung der Frequenz

    // Korrektur-Gain, damit die Frequenz nicht in negative Bereiche fällt
    const offsetGain = ctx.createGain();
    offsetGain.gain.value = 1.0;

    modulationNoise.connect(slowFilter);
    slowFilter.connect(modGain);
    modGain.connect(filter.frequency);

    // 2. Ein sehr langsamer Sinus-LFO (Sub-LFO) für langwellige Flaute- & Sturm-Phasen
    const macroLfo = ctx.createOscillator();
    const macroGain = ctx.createGain();
    macroLfo.frequency.value = 0.008; // Wechselt alle ~2 Minuten sanft die Grunddynamik
    macroGain.gain.value = 100;

    macroLfo.connect(macroGain);
    macroGain.connect(filter.frequency);

    noise.connect(filter);

    // Starts
    noise.start();
    modulationNoise.start();
    macroLfo.start();

    return { 
      output: filter, 
      stop: () => { 
        try { 
          noise.stop(); 
          modulationNoise.stop(); 
          macroLfo.stop(); 
        } catch(e){} 
      } 
    };
  },
  
  // REGEN
  rain: (ctx) => {
    const outputGain = ctx.createGain();
    outputGain.gain.value = 1.5;

    let isPlaying = true;

    const rainNoise = createWhiteNoiseBuffer(ctx);
    
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3200;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1400;
    bandpass.Q.value = 0.5;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.6;

    rainNoise.connect(lowpass);
    lowpass.connect(bandpass);
    bandpass.connect(rainGain);
    rainGain.connect(outputGain);
    rainNoise.start();

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.01;
    lfoGain.gain.value = 0.15;

    lfo.connect(lfoGain);
    lfoGain.connect(rainGain.gain);
    lfo.start();

    function generateSoftSplatter() {
      if (!isPlaying) return;

      const now = ctx.currentTime;
      const dropNoise = createWhiteNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      const dur = 0.01 + Math.random() * 0.02;
      const freq = 800 + Math.random() * 1200;

      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 1.2;

      const vol = 0.03 + Math.random() * 1.10;

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + dur);

      dropNoise.connect(filter);
      filter.connect(gain);
      gain.connect(outputGain);

      dropNoise.start(now);
      dropNoise.stop(now + dur + 0.005);

      const nextDelay = 30 + Math.random() * 120;
      setTimeout(generateSoftSplatter, nextDelay);
    }

    function generateDeepRumble() {
      if (!isPlaying) return;

      const now = ctx.currentTime;
      const rumbleNoise = createPinkNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      const dur = 4.0 + Math.random() * 3.0;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(60, now);
      filter.frequency.linearRampToValueAtTime(110, now + 1.5);
      filter.frequency.exponentialRampToValueAtTime(40, now + dur);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.08, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      rumbleNoise.connect(filter);
      filter.connect(gain);
      gain.connect(outputGain);

      rumbleNoise.start(now);
      rumbleNoise.stop(now + dur + 0.1);

      setTimeout(generateDeepRumble, 18000 + Math.random() * 20000);
    }

    generateSoftSplatter();
    setTimeout(generateDeepRumble, 2000);

    return { 
      output: outputGain, 
      stop: () => { 
        isPlaying = false; 
        try { rainNoise.stop(); lfo.stop(); } catch(e){} 
      } 
    };
  },

  // LAGERFEUER
  fire: (ctx) => {
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 10;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.05;

    const outputGain = ctx.createGain();
    outputGain.gain.value = 2.5;

    compressor.connect(outputGain);

    let isPlaying = true;

    const flameNoise = createPinkNoiseBuffer(ctx);
    const flameFilter = ctx.createBiquadFilter();
    flameFilter.type = 'lowpass';
    flameFilter.frequency.value = 140;

    const flameGain = ctx.createGain();
    flameGain.gain.value = 0.15;

    flameNoise.connect(flameFilter);
    flameFilter.connect(flameGain);
    flameGain.connect(compressor);
    flameNoise.start();

    function generateMicroCrackle() {
      if (!isPlaying) return;

      const now = ctx.currentTime;
      const noise = createWhiteNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      const dur = 0.001 + Math.random() * 0.002;
      
      filter.type = 'bandpass';
      filter.frequency.value = 1800 + Math.random() * 3200;
      filter.Q.value = 1.2;

      const vol = 0.04 + Math.random() * 0.08;

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(compressor);

      noise.start(now);
      noise.stop(now + dur + 0.002);

      setTimeout(generateMicroCrackle, Math.random() * 12 + 2);
    }

    function generateWoodCrack() {
      if (!isPlaying) return;

      const now = ctx.currentTime;
      const noise = createWhiteNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      const isBigCrack = Math.random() < 0.2;
      const dur = isBigCrack ? (0.006 + Math.random() * 0.012) : (0.002 + Math.random() * 0.005);

      filter.type = 'highpass';
      filter.frequency.value = isBigCrack ? 500 : 1000;

      const vol = isBigCrack ? (0.45 + Math.random() * 0.35) : (0.12 + Math.random() * 0.18);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(compressor);

      noise.start(now);
      noise.stop(now + dur + 0.002);

      const nextCrack = isBigCrack ? (150 + Math.random() * 350) : (30 + Math.random() * 90);
      setTimeout(generateWoodCrack, nextCrack);
    }

    generateMicroCrackle();
    generateWoodCrack();

    return { 
      output: outputGain, 
      stop: () => { 
        isPlaying = false; 
        try { flameNoise.stop(); } catch(e){} 
      } 
    };
  },

  // BACH
  stream: (ctx) => {
    const outputGain = ctx.createGain();

    const noise = createPinkNoiseBuffer(ctx);
    
    const lowFilter = ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.value = 400;

    const midFilter = ctx.createBiquadFilter();
    midFilter.type = 'bandpass';
    midFilter.frequency.value = 850;
    midFilter.Q.value = 1.0;

    const flowGain = ctx.createGain();
    flowGain.gain.value = 0.3;

    noise.connect(lowFilter);
    noise.connect(midFilter);
    lowFilter.connect(flowGain);
    midFilter.connect(flowGain);
    flowGain.connect(outputGain);
    noise.start();

    let isPlaying = true;
    function generateSplash() {
      if (!isPlaying) return;

      const now = ctx.currentTime;
      const splashNoise = createWhiteNoiseBuffer(ctx);
      const splashFilter = ctx.createBiquadFilter();
      const splashGain = ctx.createGain();

      const dur = 0.03 + Math.random() * 0.06;
      const freq = 1200 + Math.random() * 1800;

      splashFilter.type = 'bandpass';
      splashFilter.frequency.setValueAtTime(freq, now);
      splashFilter.frequency.linearRampToValueAtTime(freq - 300, now + dur);
      splashFilter.Q.value = 4.0;

      splashGain.gain.setValueAtTime(0.001, now);
      splashGain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.05, now + (dur * 0.3));
      splashGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      splashNoise.connect(splashFilter);
      splashFilter.connect(splashGain);
      splashGain.connect(outputGain);

      splashNoise.start(now);
      splashNoise.stop(now + dur + 0.01);

      setTimeout(generateSplash, Math.random() * 30 + 15);
    }

    generateSplash();

    return { 
      output: outputGain, 
      stop: () => { isPlaying = false; try { noise.stop(); } catch(e){} } 
    };
  },

  // VÖGEL
  birds: (ctx) => {
    const outputGain = ctx.createGain();
    let isPlaying = true;

    const echoGain = ctx.createGain();
    echoGain.gain.value = 0.25;

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.18;

    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 2500;

    delay.connect(delayFilter);
    delayFilter.connect(echoGain);
    echoGain.connect(outputGain);

    function playBirdMotif() {
      if (!isPlaying) return;

      const now = ctx.currentTime;
      const species = Math.random();

      if (species < 0.2) {
        // 1. TYP A: Kohlmeise
        const calls = 3 + Math.floor(Math.random() * 2);
        const highPitch = 3800 + Math.random() * 300;
        const lowPitch = highPitch - 800;

        for (let i = 0; i < calls; i++) {
          const startTime = now + (i * 0.22);

          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(highPitch, startTime);
          gain1.gain.setValueAtTime(0, startTime);
          gain1.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
          gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

          osc1.connect(gain1);
          gain1.connect(outputGain);
          gain1.connect(delay);

          osc1.start(startTime);
          osc1.stop(startTime + 0.08);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(lowPitch, startTime + 0.09);
          gain2.gain.setValueAtTime(0, startTime + 0.09);
          gain2.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
          gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.17);

          osc2.connect(gain2);
          gain2.connect(outputGain);
          gain2.connect(delay);

          osc2.start(startTime + 0.09);
          osc2.stop(startTime + 0.18);
        }

      } else if (species < 0.4) {
        // 2. TYP B: Buchfink
        const trillLength = 0.3 + Math.random() * 0.2;
        const osc = ctx.createOscillator();
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        const gain = ctx.createGain();

        const pitch = 2400 + Math.random() * 600;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.linearRampToValueAtTime(pitch + 1000, now + (trillLength * 0.8));
        osc.frequency.exponentialRampToValueAtTime(pitch - 400, now + trillLength);

        mod.type = 'sine';
        mod.frequency.setValueAtTime(28, now);
        modGain.gain.setValueAtTime(300, now);

        mod.connect(osc.frequency);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + trillLength);

        osc.connect(gain);
        gain.connect(outputGain);
        gain.connect(delay);

        osc.start(now);
        mod.start(now);
        osc.stop(now + trillLength + 0.01);
        mod.stop(now + trillLength + 0.01);

      } else if (species < 0.6) {
        // 3. TYP C: Amsel
        const notes = 3 + Math.floor(Math.random() * 3);
        let timeOffset = 0;

        for (let i = 0; i < notes; i++) {
          const startTime = now + timeOffset;
          const noteDur = 0.12 + Math.random() * 0.15;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          const startPitch = 1500 + Math.random() * 1000; 
          const endPitch = startPitch + (Math.random() > 0.5 ? 400 : -300);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(startPitch, startTime);
          osc.frequency.exponentialRampToValueAtTime(Math.max(200, endPitch), startTime + noteDur);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.22, startTime + (noteDur * 0.2));
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDur);

          osc.connect(gain);
          gain.connect(outputGain);
          gain.connect(delay);

          osc.start(startTime);
          osc.stop(startTime + noteDur + 0.01);

          timeOffset += noteDur + 0.04 + Math.random() * 0.06;
        }

      } else if (species < 0.8) {
        // 4. TYP D: Rotkehlchen
        const trillCount = 6 + Math.floor(Math.random() * 6);
        const basePitch = 4200 + Math.random() * 1000;

        for (let i = 0; i < trillCount; i++) {
          const startTime = now + (i * 0.04);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          const currentPitch = basePitch + (Math.sin(i * 0.8) * 600);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(currentPitch, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.12, startTime + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

          osc.connect(gain);
          gain.connect(outputGain);
          gain.connect(delay);

          osc.start(startTime);
          osc.stop(startTime + 0.04);
        }

      } else {
        // 5. TYP E: Kuckuck
        const call1Pitch = 600 + Math.random() * 50;
        const call2Pitch = call1Pitch - 150;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(call1Pitch, now);

        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.25, now + 0.04);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc1.connect(gain1);
        gain1.connect(outputGain);
        gain1.connect(delay);

        osc1.start(now);
        osc1.stop(now + 0.23);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(call2Pitch, now + 0.28);

        gain2.gain.setValueAtTime(0, now + 0.28);
        gain2.gain.linearRampToValueAtTime(0.22, now + 0.32);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc2.connect(gain2);
        gain2.connect(outputGain);
        gain2.connect(delay);

        osc2.start(now + 0.28);
        osc2.stop(now + 0.61);
      }

      const nextChirp = 1000 + Math.random() * 3000;
      setTimeout(playBirdMotif, nextChirp);
    }

    playBirdMotif();

    return { output: outputGain, stop: () => { isPlaying = false; } };
  },

  // EULE 
  owl: (ctx) => {
    const outputGain = ctx.createGain();
    let isPlaying = true;
    let activeTimeout = null;

    // 1. UHU
    function playEagleOwl(now) {
      const pattern = [
        { offset: 0.0, dur: 0.45, pitch: 270, maxVol: 0.35 },
        { offset: 0.75, dur: 0.22, pitch: 290, maxVol: 0.3 },
        { offset: 1.05, dur: 0.22, pitch: 285, maxVol: 0.3 },
        { offset: 1.35, dur: 0.65, pitch: 250, maxVol: 0.4 }
      ];

      pattern.forEach(p => {
        const startTime = now + p.offset;
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        const formant1 = ctx.createBiquadFilter();
        const formant2 = ctx.createBiquadFilter();

        formant1.type = 'bandpass';
        formant1.frequency.setValueAtTime(p.pitch, startTime);
        formant1.Q.value = 5.0;

        formant2.type = 'lowpass';
        formant2.frequency.setValueAtTime(450, startTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.pitch, startTime);
        osc.frequency.exponentialRampToValueAtTime(p.pitch - 25, startTime + p.dur);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(p.pitch / 2, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(p.maxVol, startTime + (p.dur * 0.25));
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + p.dur);

        osc.connect(formant1);
        subOsc.connect(formant1);
        formant1.connect(formant2);
        formant2.connect(gain);
        gain.connect(outputGain);

        osc.start(startTime);
        subOsc.start(startTime);
        osc.stop(startTime + p.dur + 0.02);
        subOsc.stop(startTime + p.dur + 0.02);
      });
    }

    // 2. WALDKAUZ
    function playTawnyOwl(now) {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      const dur = 1.6;
      const basePitch = 420;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(basePitch - 60, now + dur);

      lfo.frequency.setValueAtTime(6.5, now);
      lfoGain.gain.setValueAtTime(15, now);
      lfo.connect(osc.frequency);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(basePitch, now);
      filter.Q.value = 3.0;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(outputGain);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + dur);
      osc.stop(now + dur);
    }

    function triggerCall() {
      if (!isPlaying) return;

      const now = ctx.currentTime;
      const rand = Math.random();
      let nextDelay = 7000 + Math.random() * 7000;

      if (rand < 0.50) {
        playEagleOwl(now);
      } else if (rand < 1) {
        playTawnyOwl(now); 
      }

      activeTimeout = setTimeout(triggerCall, nextDelay);
    }

    triggerCall();

    return {
      output: outputGain,
      stop: () => {
        isPlaying = false;
        if (activeTimeout) clearTimeout(activeTimeout);
      }
    };
  }
};

const activeTracks = {};

function toggleSound(soundKey) {
  const ctx = getAudioContext();

  const pad = document.querySelector(`.sound-pad[data-sound="${soundKey}"]`);
  const slider = pad ? pad.querySelector('.sound-volume') : null;
  const initialVol = slider ? parseFloat(slider.value) : 0.7;

  if (activeTracks[soundKey]) {
    activeTracks[soundKey].gen.stop();
    activeTracks[soundKey].masterGain.disconnect();
    delete activeTracks[soundKey];

    if (pad) pad.classList.remove('active');
  } else {
    if (!generators[soundKey]) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(initialVol, ctx.currentTime);

    const gen = generators[soundKey](ctx);
    gen.output.connect(masterGain);
    masterGain.connect(ctx.destination);

    activeTracks[soundKey] = { gen, masterGain };

    if (pad) pad.classList.add('active');
  }
}

function setVolume(soundKey, val) {
  if (activeTracks[soundKey] && audioCtx) {
    activeTracks[soundKey].masterGain.gain.setValueAtTime(parseFloat(val), audioCtx.currentTime);
  }
}

const sound_presets = {
  rainy: { rain: 0.8, wind: 0.4, stream: 0.3 },
  sunny: { birds: 0.8, fire: 0.1, wind: 0.2 },
  night: { wind: 0.1, fire: 0.6, owl: 0.5 },
  forest: { birds: 0.7, wind: 0.2, stream: 0.4 },
  ocean: { wind: 0.6, stream: 0.8 }
};

function setSoundVolume(soundKey, volume) {
  const pad = document.querySelector(`.sound-pad[data-sound="${soundKey}"]`);
  const slider = pad ? pad.querySelector('.sound-volume') : null;

  if (slider) {
    slider.value = volume;
  }

  if (activeTracks[soundKey] && activeTracks[soundKey].masterGain) {
    const ctx = getAudioContext();
    activeTracks[soundKey].masterGain.gain.setValueAtTime(volume, ctx.currentTime);
  }
}

function toggleSound(soundKey, targetVolume = null) {
  const ctx = getAudioContext();
  const pad = document.querySelector(`.sound-pad[data-sound="${soundKey}"]`);
  const slider = pad ? pad.querySelector('.sound-volume') : null;
  
  const volume = targetVolume !== null ? targetVolume : (slider ? parseFloat(slider.value) : 0.7);

  if (activeTracks[soundKey]) {
    activeTracks[soundKey].gen.stop();
    activeTracks[soundKey].masterGain.disconnect();
    delete activeTracks[soundKey];

    if (pad) pad.classList.remove('active');
  } else {
    if (!generators[soundKey]) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);

    const gen = generators[soundKey](ctx);
    gen.output.connect(masterGain);
    masterGain.connect(ctx.destination);

    activeTracks[soundKey] = { gen, masterGain };

    if (pad) pad.classList.add('active');
    if (slider) slider.value = volume;
  }

  checkPresetState();
}

function stopAllSounds() {
  Object.keys(activeTracks).forEach(soundKey => {
    toggleSound(soundKey);
  });
}

function playPreset(presetKey) {
  getAudioContext();

  const targetBtn = Array.from(document.querySelectorAll('.preset-btn')).find(btn => 
    btn.getAttribute('onclick')?.includes(`'${presetKey}'`)
  );

  const isCurrentlyActive = targetBtn ? targetBtn.classList.contains('active') : false;

  stopAllSounds();
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));

  if (isCurrentlyActive) {
    return;
  }

  const presetData = sound_presets[presetKey];

  if (presetData) {
    if (targetBtn) targetBtn.classList.add('active');
    
    Object.entries(presetData).forEach(([soundKey, volume]) => {
      toggleSound(soundKey, volume);
    });
  }
}

function checkPresetState() {
  const currentActiveSounds = Object.keys(activeTracks);

  document.querySelectorAll('.preset-btn').forEach(btn => {
    const match = btn.getAttribute('onclick')?.match(/'([^']+)'/);
    if (match) {
      const pKey = match[1];
      const pData = sound_presets[pKey] || {};
      const pSounds = Object.keys(pData);
      
      const isExactMatch = pSounds.length === currentActiveSounds.length &&
        pSounds.every(s => currentActiveSounds.includes(s));

      if (isExactMatch) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
}