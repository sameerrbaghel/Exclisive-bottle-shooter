import React, { useEffect, useRef, useState, useCallback } from 'react';

// --- Web Audio API Sound Synthesizer ---
class SoundSynth {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  constructor() {
    // Lazy initialize on first user gesture
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playGunshot() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Noise burst for muzzle blast crack
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 0.1);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(1.0, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // 2. Sub-bass boom & kick for heavy gun caliber
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);

    oscGain.gain.setValueAtTime(0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  playGlassShatter() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Crisp high frequency noise crash
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.06));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4200, now);
    filter.Q.setValueAtTime(3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // Resonant glass ringing pings (chimes)
    const freqs = [1850, 2480, 3720, 5100];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() * 100 - 50), now + idx * 0.015);

      gain.gain.setValueAtTime(0.2, now + idx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + idx * 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.015);
      osc.stop(now + 0.35);
    });
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Deep explosive shockwave
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.55);

    oscGain.gain.setValueAtTime(0.9, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);

    // Rumble noise
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playReload() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Cylinder spin click 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.07);

    // Heavy cartridge slide lock click 2
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(880, now + 0.16);
    osc2.frequency.exponentialRampToValueAtTime(440, now + 0.22);
    gain2.gain.setValueAtTime(0.4, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.16);
    osc2.stop(now + 0.27);
  }

  playDryFire() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playGoldenDing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.25, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.35);
    });
  }

  playComboChime(comboCount: number) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const baseFreq = 523.25; // C5
    const multiplier = 1 + Math.min(comboCount * 0.12, 1.2);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * multiplier, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * multiplier * 1.5, now + 0.14);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playStageWin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const arpeggio = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
    arpeggio.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + idx * 0.09);
      gain.gain.setValueAtTime(0.25, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.4);
    });
  }

  playGameOver() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const sadNotes = [466.16, 440.0, 415.3, 349.23];
    sadNotes.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.16);
      gain.gain.setValueAtTime(0.25, now + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.16);
      osc.stop(now + idx * 0.16 + 0.45);
    });
  }
}

// --- Data Types & Models ---
type BottleType = 'green' | 'amber' | 'blue' | 'golden' | 'explosive';

interface Bottle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  shelfIndex: number;
  type: BottleType;
  points: number;
  vx: number;
  wobbleSpeed: number;
  wobbleAngle: number;
  wobbleOffset: number;
  isFlipping: boolean;
  flipRotation: number;
  flipVy: number;
  isHit: boolean;
}

interface GlassShard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  borderColor: string;
  size: number;
  points: { x: number; y: number }[];
  alpha: number;
  life: number;
  maxLife: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  isSpark?: boolean;
}

interface ScorePopup {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  vy: number;
}

interface Shelf {
  y: number;
  height: number;
}

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 750;
const MAX_BULLETS = 6;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Audio system ref
  const soundRef = useRef<SoundSynth>(new SoundSynth());
  const [isMuted, setIsMuted] = useState(false);

  // High score & stats from localStorage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('saloon_bottle_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [bestAccuracy, setBestAccuracy] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('saloon_bottle_best_accuracy') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Game React States for UI synchronization
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'STAGE_CLEAR' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);
  const [bullets, setBullets] = useState(MAX_BULLETS);
  const [isReloading, setIsReloading] = useState(false);
  const [stage, setStage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(35);
  const [accuracy, setAccuracy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [targetGoal, setTargetGoal] = useState({ current: 0, required: 10 });

  // Game internal mutable refs for 60FPS loop
  const gameRef = useRef({
    state: 'START' as 'START' | 'PLAYING' | 'STAGE_CLEAR' | 'GAME_OVER',
    score: 0,
    highScore: 0,
    bestAccuracy: 0,
    bullets: MAX_BULLETS,
    isReloading: false,
    reloadProgress: 0,
    stage: 1,
    timeRemaining: 35,
    lastTime: performance.now(),
    bottles: [] as Bottle[],
    shards: [] as GlassShard[],
    particles: [] as Particle[],
    popups: [] as ScorePopup[],
    totalShots: 0,
    totalHits: 0,
    combo: 0,
    screenShake: 0,
    muzzleFlash: 0,
    muzzlePos: { x: 0, y: 0 },
    mousePos: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, inCanvas: false },
    shelves: [
      { y: 220, height: 18 },
      { y: 400, height: 18 },
      { y: 580, height: 18 },
    ] as Shelf[],
    stageClearedTimer: 0,
    bottleCounter: 0,
    bottlesClearedThisStage: 0,
    bottlesRequiredThisStage: 10,
    nextSpawnTimer: 0,
  });

  // Keep sound state in sync
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundRef.current.muted = next;
      return next;
    });
  }, []);

  // Spawn a bottle on a shelf
  const spawnBottle = useCallback((shelfIndex?: number, forcedType?: BottleType, startX?: number): Bottle => {
    const g = gameRef.current;
    g.bottleCounter++;
    const sIndex = shelfIndex !== undefined ? shelfIndex : Math.floor(Math.random() * 3);
    const shelf = g.shelves[sIndex];

    let type: BottleType = forcedType || 'green';
    if (!forcedType) {
      const rand = Math.random();
      if (g.stage >= 2 && rand < 0.18) {
        type = 'golden';
      } else if (g.stage >= 3 && rand < 0.35) {
        type = 'explosive';
      } else if (rand < 0.6) {
        type = 'amber';
      } else if (rand < 0.8) {
        type = 'blue';
      } else {
        type = 'green';
      }
    }

    let points = 100;
    if (type === 'blue') points = 150;
    if (type === 'golden') points = 300;
    if (type === 'explosive') points = 200;

    const bottleW = 34;
    const bottleH = 82;
    const posX = startX !== undefined ? startX : 80 + Math.random() * (GAME_WIDTH - 200);
    const posY = shelf.y - bottleH;

    // Movement speeds for moving stages
    let vx = 0;
    if (g.stage >= 2) {
      const baseSpeed = 1.0 + (g.stage - 1) * 0.45;
      const dir = sIndex % 2 === 0 ? 1 : -1;
      vx = (type === 'golden' ? baseSpeed * 1.8 : baseSpeed) * dir;
    }

    // Flipping mechanics for high stages
    const isFlipping = g.stage >= 4 && Math.random() < 0.2;

    return {
      id: g.bottleCounter,
      x: posX,
      y: posY,
      width: bottleW,
      height: bottleH,
      shelfIndex: sIndex,
      type,
      points,
      vx,
      wobbleSpeed: Math.random() * 0.05 + 0.03,
      wobbleAngle: Math.random() * Math.PI * 2,
      wobbleOffset: 0,
      isFlipping,
      flipRotation: 0,
      flipVy: isFlipping ? -7 - Math.random() * 3 : 0,
      isHit: false,
    };
  }, []);

  // Setup Stage Target & Initial Bottles
  const initStage = useCallback((stageNum: number) => {
    const g = gameRef.current;
    g.stage = stageNum;
    g.bottles = [];
    g.shards = [];
    g.particles = [];
    g.popups = [];
    g.bottlesClearedThisStage = 0;

    // Required bottles to clear stage
    const required = Math.min(8 + stageNum * 3, 25);
    g.bottlesRequiredThisStage = required;
    g.timeRemaining = Math.max(38 - stageNum * 2, 22);

    setStage(stageNum);
    setTimeLeft(g.timeRemaining);
    setTargetGoal({ current: 0, required });

    // Populate shelves with starting bottles
    const initialCount = Math.min(10 + stageNum * 2, 18);
    for (let i = 0; i < initialCount; i++) {
      const shelfIdx = i % 3;
      const xSpacing = (GAME_WIDTH - 240) / (initialCount / 3 + 1);
      const rowCol = Math.floor(i / 3);
      const x = 120 + rowCol * xSpacing + (Math.random() * 20 - 10);
      g.bottles.push(spawnBottle(shelfIdx, undefined, x));
    }
  }, [spawnBottle]);

  // Trigger manual reload
  const reloadGun = useCallback(() => {
    const g = gameRef.current;
    if (g.isReloading || g.bullets === MAX_BULLETS) return;
    g.isReloading = true;
    g.reloadProgress = 0;
    setIsReloading(true);
    soundRef.current.playReload();
  }, []);

  // Break a bottle into realistic glass shards & particles
  const shatterBottle = useCallback((b: Bottle, originX?: number, originY?: number) => {
    const g = gameRef.current;
    b.isHit = true;

    // Audio cue
    if (b.type === 'golden') {
      soundRef.current.playGoldenDing();
      soundRef.current.playGlassShatter();
    } else if (b.type === 'explosive') {
      soundRef.current.playExplosion();
      soundRef.current.playGlassShatter();
    } else {
      soundRef.current.playGlassShatter();
    }

    // Color palettes for bottle glass shards
    let fill = '#2e7d32';
    let stroke = '#81c784';
    if (b.type === 'amber') {
      fill = '#8d4f1c';
      stroke = '#d79b5c';
    } else if (b.type === 'blue') {
      fill = '#1565c0';
      stroke = '#64b5f6';
    } else if (b.type === 'golden') {
      fill = '#f59e0b';
      stroke = '#fef08a';
    } else if (b.type === 'explosive') {
      fill = '#dc2626';
      stroke = '#fca5a5';
    }

    // Generate 18 to 26 realistic polygon glass shards
    const shardCount = b.type === 'explosive' ? 36 : 22;
    for (let i = 0; i < shardCount; i++) {
      const offsetX = (Math.random() - 0.5) * b.width;
      const offsetY = (Math.random() - 0.5) * b.height;
      const shardX = b.x + b.width / 2 + offsetX;
      const shardY = b.y + b.height / 2 + offsetY;

      // Burst velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 6 + 2) * (b.type === 'explosive' ? 1.8 : 1);
      const vx = Math.cos(angle) * speed + (b.vx ? b.vx * 0.5 : 0);
      const vy = Math.sin(angle) * speed - (Math.random() * 4 + 2);

      // Random polygon vertices for glass shard shape
      const polyPoints = [
        { x: (Math.random() - 0.5) * 14, y: (Math.random() - 0.5) * 14 },
        { x: (Math.random() - 0.5) * 14, y: (Math.random() - 0.5) * 14 },
        { x: (Math.random() - 0.5) * 14, y: (Math.random() - 0.5) * 14 },
      ];
      if (Math.random() > 0.4) {
        polyPoints.push({ x: (Math.random() - 0.5) * 16, y: (Math.random() - 0.5) * 16 });
      }

      g.shards.push({
        x: shardX,
        y: shardY,
        vx,
        vy,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.35,
        color: fill,
        borderColor: stroke,
        size: Math.random() * 7 + 4,
        points: polyPoints,
        alpha: 1.0,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }

    // Cork/cap popping off
    g.particles.push({
      x: b.x + b.width / 2,
      y: b.y + 4,
      vx: (Math.random() - 0.5) * 4,
      vy: -7 - Math.random() * 4,
      radius: 4.5,
      color: '#b45309',
      alpha: 1,
      life: 0,
      maxLife: 50,
    });

    // Explosive TNT bottle chain reaction blast
    if (b.type === 'explosive') {
      g.screenShake = 16;
      // Fiery blast particles
      for (let p = 0; p < 45; p++) {
        const fireAngle = Math.random() * Math.PI * 2;
        const fireSpeed = Math.random() * 8 + 2;
        g.particles.push({
          x: b.x + b.width / 2,
          y: b.y + b.height / 2,
          vx: Math.cos(fireAngle) * fireSpeed,
          vy: Math.sin(fireAngle) * fireSpeed,
          radius: Math.random() * 6 + 3,
          color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
          alpha: 1,
          life: 0,
          maxLife: 35 + Math.random() * 20,
          isSpark: true,
        });
      }

      // Chain reaction: hit other nearby bottles within blast radius
      const blastRadius = 150;
      const bCenterX = b.x + b.width / 2;
      const bCenterY = b.y + b.height / 2;

      g.bottles.forEach((other) => {
        if (!other.isHit && other.id !== b.id) {
          const ocX = other.x + other.width / 2;
          const ocY = other.y + other.height / 2;
          const dist = Math.hypot(ocX - bCenterX, ocY - bCenterY);
          if (dist <= blastRadius) {
            // Delay slightly for chain effect
            setTimeout(() => {
              if (!other.isHit) {
                shatterBottle(other);
                const chainPts = 100 * (g.combo >= 2 ? g.combo : 1);
                g.score += chainPts;
                g.bottlesClearedThisStage++;
                g.popups.push({
                  x: ocX,
                  y: ocY,
                  text: `CHAIN BLAST! +${chainPts}`,
                  color: '#fbbf24',
                  alpha: 1,
                  scale: 1.1,
                  vy: -1.5,
                });
              }
            }, 120);
          }
        }
      });
    }

    // Sparkles and smoke from bullet impact
    const hitX = originX || b.x + b.width / 2;
    const hitY = originY || b.y + b.height / 2;
    for (let s = 0; s < 12; s++) {
      const sAngle = Math.random() * Math.PI * 2;
      const sSpeed = Math.random() * 5 + 1;
      g.particles.push({
        x: hitX,
        y: hitY,
        vx: Math.cos(sAngle) * sSpeed,
        vy: Math.sin(sAngle) * sSpeed - 1,
        radius: Math.random() * 2.5 + 1,
        color: '#fef08a',
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 15,
        isSpark: true,
      });
    }
  }, []);

  // Handle firing shot
  const handleShoot = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const shotX = (clientX - rect.left) * scaleX;
    const shotY = (clientY - rect.top) * scaleY;

    const g = gameRef.current;

    // If on start or game over, click starts the game
    if (g.state === 'START' || g.state === 'GAME_OVER') {
      startGame();
      return;
    }

    if (g.state === 'STAGE_CLEAR') return;

    // Check if reloading
    if (g.isReloading) {
      soundRef.current.playDryFire();
      return;
    }

    // Out of ammo!
    if (g.bullets <= 0) {
      soundRef.current.playDryFire();
      reloadGun();
      return;
    }

    // Spend bullet
    g.bullets--;
    g.totalShots++;
    setBullets(g.bullets);
    soundRef.current.playGunshot();

    // Visual recoil & muzzle flash
    g.screenShake = 9;
    g.muzzleFlash = 4;
    g.muzzlePos = { x: shotX, y: shotY };

    // Check hit test against bottles (topmost/nearest)
    let hitBottle: Bottle | null = null;

    // Iterate backwards so top rendered bottle gets hit
    for (let i = g.bottles.length - 1; i >= 0; i--) {
      const b = g.bottles[i];
      if (b.isHit) continue;

      // Generous hit box with neck and body
      const padding = 6;
      if (
        shotX >= b.x - padding &&
        shotX <= b.x + b.width + padding &&
        shotY >= b.y - padding &&
        shotY <= b.y + b.height + padding
      ) {
        hitBottle = b;
        break;
      }
    }

    if (hitBottle) {
      g.totalHits++;
      g.combo++;
      g.bottlesClearedThisStage++;

      // Combo multiplier: 1x, 2x (combo>=2), 3x (combo>=4), 4x (combo>=6), 5x (combo>=8)
      const multiplier = Math.min(Math.floor(g.combo / 2) + 1, 5);
      const pointsEarned = hitBottle.points * multiplier;
      g.score += pointsEarned;

      setScore(g.score);
      setCombo(g.combo);
      setTargetGoal({
        current: g.bottlesClearedThisStage,
        required: g.bottlesRequiredThisStage,
      });

      if (g.combo > 1) {
        soundRef.current.playComboChime(g.combo);
      }

      // Popup indicator
      let popupText = `+${pointsEarned}`;
      let popupColor = '#34d399';
      if (hitBottle.type === 'golden') {
        popupText = `GOLDEN! +${pointsEarned}`;
        popupColor = '#fbbf24';
      } else if (multiplier > 1) {
        popupText = `+${pointsEarned} (x${multiplier}!)`;
        popupColor = '#38bdf8';
      }

      g.popups.push({
        x: hitBottle.x + hitBottle.width / 2,
        y: hitBottle.y,
        text: popupText,
        color: popupColor,
        alpha: 1,
        scale: 1.2,
        vy: -2,
      });

      // Break it!
      shatterBottle(hitBottle, shotX, shotY);

      // Check if stage cleared
      if (g.bottlesClearedThisStage >= g.bottlesRequiredThisStage) {
        handleStageClear();
      }
    } else {
      // Missed shot: reset combo & puff dust particle
      g.combo = 0;
      setCombo(0);

      // Wood dust on miss
      for (let d = 0; d < 8; d++) {
        g.particles.push({
          x: shotX,
          y: shotY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: Math.random() * 3 + 1,
          color: '#d4a373',
          alpha: 0.8,
          life: 0,
          maxLife: 20,
        });
      }
    }

    // Update accuracy
    const acc = g.totalShots > 0 ? Math.round((g.totalHits / g.totalShots) * 100) : 100;
    setAccuracy(acc);

    // Auto reload prompt if empty
    if (g.bullets === 0) {
      setTimeout(() => {
        if (gameRef.current.bullets === 0 && !gameRef.current.isReloading) {
          reloadGun();
        }
      }, 400);
    }
  }, [shatterBottle, reloadGun]);

  // Stage clear transition
  const handleStageClear = useCallback(() => {
    const g = gameRef.current;
    g.state = 'STAGE_CLEAR';
    setGameState('STAGE_CLEAR');
    soundRef.current.playStageWin();

    // Bonus for remaining time & accuracy
    const timeBonus = Math.floor(g.timeRemaining) * 50;
    const accBonus = g.totalShots > 0 ? Math.round((g.totalHits / g.totalShots) * 200) : 0;
    g.score += timeBonus + accBonus;
    setScore(g.score);

    g.popups.push({
      x: GAME_WIDTH / 2,
      y: 260,
      text: `STAGE CLEAR! Time Bonus: +${timeBonus} | Accuracy Bonus: +${accBonus}`,
      color: '#4ade80',
      alpha: 1,
      scale: 1.4,
      vy: -1,
    });

    setTimeout(() => {
      if (gameRef.current.state === 'STAGE_CLEAR') {
        const nextStage = gameRef.current.stage + 1;
        initStage(nextStage);
        gameRef.current.state = 'PLAYING';
        setGameState('PLAYING');
      }
    }, 2800);
  }, [initStage]);

  // Game Over trigger
  const handleGameOver = useCallback(() => {
    const g = gameRef.current;
    g.state = 'GAME_OVER';
    setGameState('GAME_OVER');
    soundRef.current.playGameOver();

    // Check high scores
    if (g.score > g.highScore) {
      g.highScore = g.score;
      setHighScore(g.score);
      try {
        localStorage.setItem('saloon_bottle_highscore', g.score.toString());
      } catch {
        // Ignore
      }
    }

    const currentAcc = g.totalShots > 0 ? Math.round((g.totalHits / g.totalShots) * 100) : 0;
    if (currentAcc > g.bestAccuracy) {
      g.bestAccuracy = currentAcc;
      setBestAccuracy(currentAcc);
      try {
        localStorage.setItem('saloon_bottle_best_accuracy', currentAcc.toString());
      } catch {
        // Ignore
      }
    }
  }, []);

  // Start new game
  const startGame = useCallback(() => {
    soundRef.current.init();
    const g = gameRef.current;
    g.state = 'PLAYING';
    g.score = 0;
    g.bullets = MAX_BULLETS;
    g.isReloading = false;
    g.reloadProgress = 0;
    g.totalShots = 0;
    g.totalHits = 0;
    g.combo = 0;
    g.screenShake = 0;
    g.muzzleFlash = 0;

    setGameState('PLAYING');
    setScore(0);
    setBullets(MAX_BULLETS);
    setIsReloading(false);
    setCombo(0);
    setAccuracy(100);

    initStage(1);
  }, [initStage]);

  // Keyboard controls (R for reload, Esc to pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        reloadGun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reloadGun]);

  // Main 60FPS Game Loop & Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = (timestamp: number) => {
      const g = gameRef.current;
      const dt = Math.min((timestamp - g.lastTime) / 1000, 0.1);
      g.lastTime = timestamp;

      // Update game logic if playing
      if (g.state === 'PLAYING') {
        // Countdown timer
        g.timeRemaining -= dt;
        if (g.timeRemaining <= 0) {
          g.timeRemaining = 0;
          handleGameOver();
        }
        setTimeLeft(Math.ceil(g.timeRemaining));

        // Reload logic
        if (g.isReloading) {
          g.reloadProgress += dt / 0.85; // ~0.85 seconds to reload
          if (g.reloadProgress >= 1) {
            g.bullets = MAX_BULLETS;
            g.isReloading = false;
            g.reloadProgress = 0;
            setBullets(MAX_BULLETS);
            setIsReloading(false);
          }
        }

        // Spawn new bottles if bottle count on screen is low
        const activeBottles = g.bottles.filter((b) => !b.isHit);
        if (activeBottles.length < 8) {
          g.nextSpawnTimer += dt;
          if (g.nextSpawnTimer > 0.6) {
            g.nextSpawnTimer = 0;
            // Spawn on random shelf from outside view or open slot
            const shelfIdx = Math.floor(Math.random() * 3);
            const startSide = Math.random() > 0.5 ? -40 : GAME_WIDTH + 10;
            g.bottles.push(spawnBottle(shelfIdx, undefined, startSide));
          }
        }

        // Update bottle positions & movements
        g.bottles.forEach((b) => {
          if (b.isHit) return;

          // Lateral movement for moving rows
          if (b.vx !== 0) {
            b.x += b.vx;
            // Wrap around or bounce on shelf edges
            if (b.vx > 0 && b.x > GAME_WIDTH + 50) {
              b.x = -50;
            } else if (b.vx < 0 && b.x < -60) {
              b.x = GAME_WIDTH + 40;
            }
          }

          // Flipping bottles (launched up or tumbling)
          if (b.isFlipping) {
            b.y += b.flipVy;
            b.flipVy += 0.28; // gravity
            b.flipRotation += 0.08;
            const shelf = g.shelves[b.shelfIndex];
            if (b.y > shelf.y - b.height) {
              b.y = shelf.y - b.height;
              b.flipVy = -Math.abs(b.flipVy) * 0.7; // bounce
              if (Math.abs(b.flipVy) < 1.5) {
                b.isFlipping = false;
                b.flipRotation = 0;
              }
            }
          } else {
            // Wind drift / subtle idle wobble
            b.wobbleAngle += b.wobbleSpeed;
            b.wobbleOffset = Math.sin(b.wobbleAngle) * (g.stage >= 3 ? 3.5 : 1.5);
          }
        });
      }

      // Update glass shards physics
      for (let i = g.shards.length - 1; i >= 0; i--) {
        const s = g.shards[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.38; // gravity
        s.rotation += s.rotSpeed;
        s.life++;
        s.alpha = Math.max(0, 1 - s.life / s.maxLife);

        // Bounce on shelves
        g.shelves.forEach((sh) => {
          if (s.y >= sh.y && s.y <= sh.y + sh.height && s.vy > 0) {
            s.y = sh.y;
            s.vy = -s.vy * 0.45; // bounce damping
            s.vx *= 0.7; // friction
            s.rotSpeed *= 0.6;
          }
        });

        // Floor bounce
        if (s.y > GAME_HEIGHT - 20 && s.vy > 0) {
          s.y = GAME_HEIGHT - 20;
          s.vy = -s.vy * 0.35;
          s.vx *= 0.6;
        }

        if (s.life >= s.maxLife || s.alpha <= 0) {
          g.shards.splice(i, 1);
        }
      }

      // Update smoke & spark particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (!p.isSpark) {
          p.vy += 0.2; // light gravity for corks
        } else {
          p.vy += 0.1;
        }
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife || p.alpha <= 0) {
          g.particles.splice(i, 1);
        }
      }

      // Update floating score text
      for (let i = g.popups.length - 1; i >= 0; i--) {
        const pop = g.popups[i];
        pop.y += pop.vy;
        pop.alpha -= 0.02;
        if (pop.alpha <= 0) {
          g.popups.splice(i, 1);
        }
      }

      // Screen shake decay
      if (g.screenShake > 0) {
        g.screenShake *= 0.82;
        if (g.screenShake < 0.1) g.screenShake = 0;
      }
      if (g.muzzleFlash > 0) {
        g.muzzleFlash--;
      }

      // ==========================================
      // RENDERING CANVAS PIPELINE
      // ==========================================
      ctx.save();

      // Apply screen recoil shake
      if (g.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * g.screenShake * 1.5;
        const shakeY = (Math.random() - 0.5) * g.screenShake * 1.5;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw Saloon Wooden Background
      drawSaloonBackdrop(ctx);

      // 2. Draw 3 Wooden Shelves with Brass Wall Brackets
      drawShelves(ctx, g.shelves);

      // 3. Draw Bottles
      g.bottles.forEach((b) => {
        if (!b.isHit) {
          drawBottle(ctx, b);
        }
      });

      // 4. Draw Glass Shards with realistic refraction shine
      drawShards(ctx, g.shards);

      // 5. Draw Particles (Sparks, smoke, corks)
      drawParticles(ctx, g.particles);

      // 6. Draw Muzzle Flash at gun coordinate
      if (g.muzzleFlash > 0) {
        drawMuzzleFlash(ctx, g.muzzlePos.x, g.muzzlePos.y);
      }

      // 7. Draw Floating Score & Combo Text
      drawScorePopups(ctx, g.popups);

      // 8. Draw Custom Crosshair (if mouse inside canvas and playing)
      if (g.state === 'PLAYING' && g.mousePos.inCanvas) {
        drawCrosshair(ctx, g.mousePos.x, g.mousePos.y, g.bullets > 0 && !g.isReloading);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [handleGameOver, spawnBottle]);

  // Mouse coordinate tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    gameRef.current.mousePos = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      inCanvas: true,
    };
  };

  const handleMouseEnter = () => {
    gameRef.current.mousePos.inCanvas = true;
  };

  const handleMouseLeave = () => {
    gameRef.current.mousePos.inCanvas = false;
  };

  // Canvas Drawing Subroutines
  const drawSaloonBackdrop = (ctx: CanvasRenderingContext2D) => {
    // Warm gradient for saloon wall
    const wallGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    wallGrad.addColorStop(0, '#2d1810');
    wallGrad.addColorStop(0.5, '#452617');
    wallGrad.addColorStop(1, '#1b0d09');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Vertical wooden plank lines & grain
    const plankWidth = 80;
    ctx.strokeStyle = '#1a0b06';
    ctx.lineWidth = 3;
    for (let x = 0; x < GAME_WIDTH; x += plankWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GAME_HEIGHT);
      ctx.stroke();

      // Planks grain & nail heads
      ctx.fillStyle = '#140804';
      ctx.beginPath();
      ctx.arc(x + 12, 100, 3, 0, Math.PI * 2);
      ctx.arc(x + 12, 320, 3, 0, Math.PI * 2);
      ctx.arc(x + 12, 500, 3, 0, Math.PI * 2);
      ctx.arc(x + plankWidth - 12, 100, 3, 0, Math.PI * 2);
      ctx.arc(x + plankWidth - 12, 320, 3, 0, Math.PI * 2);
      ctx.arc(x + plankWidth - 12, 500, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Saloon Top Header Arch / Sign
    ctx.fillStyle = '#22110a';
    ctx.fillRect(0, 0, GAME_WIDTH, 48);

    // Warm atmospheric lantern glow spotlight in center
    const lightGlow = ctx.createRadialGradient(GAME_WIDTH / 2, 180, 50, GAME_WIDTH / 2, 280, 580);
    lightGlow.addColorStop(0, 'rgba(255, 191, 105, 0.16)');
    lightGlow.addColorStop(0.6, 'rgba(255, 140, 66, 0.05)');
    lightGlow.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = lightGlow;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Decorative saloon bunting banner
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.quadraticCurveTo(GAME_WIDTH / 2, 70, GAME_WIDTH, 32);
    ctx.stroke();
    // Pennants
    for (let i = 40; i < GAME_WIDTH - 40; i += 70) {
      const bannerY = 32 + Math.sin((i / GAME_WIDTH) * Math.PI) * 35;
      ctx.fillStyle = (i / 70) % 2 === 0 ? '#b91c1c' : '#d97706';
      ctx.beginPath();
      ctx.moveTo(i - 15, bannerY);
      ctx.lineTo(i + 15, bannerY);
      ctx.lineTo(i, bannerY + 28);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };

  const drawShelves = (ctx: CanvasRenderingContext2D, shelves: Shelf[]) => {
    shelves.forEach((shelf) => {
      // Shelf drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(30, shelf.y + shelf.height, GAME_WIDTH - 60, 14);

      // Shelf Top wood board (highlighted)
      const woodGrad = ctx.createLinearGradient(0, shelf.y, 0, shelf.y + shelf.height);
      woodGrad.addColorStop(0, '#8c502b');
      woodGrad.addColorStop(0.25, '#aa673c');
      woodGrad.addColorStop(0.7, '#673618');
      woodGrad.addColorStop(1, '#431f0a');
      ctx.fillStyle = woodGrad;

      // Rounded edge shelf plank
      ctx.beginPath();
      ctx.roundRect(40, shelf.y, GAME_WIDTH - 80, shelf.height, 4);
      ctx.fill();

      // Top bevel highlight
      ctx.strokeStyle = '#c48253';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(42, shelf.y + 1);
      ctx.lineTo(GAME_WIDTH - 42, shelf.y + 1);
      ctx.stroke();

      // Brass Support Brackets
      const bracketPositions = [120, 360, 600, 840, 1080];
      bracketPositions.forEach((bx) => {
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.moveTo(bx - 10, shelf.y + shelf.height);
        ctx.lineTo(bx + 10, shelf.y + shelf.height);
        ctx.lineTo(bx, shelf.y + shelf.height + 26);
        ctx.closePath();
        ctx.fill();

        // Brass bolt
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(bx, shelf.y + shelf.height + 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  };

  const drawBottle = (ctx: CanvasRenderingContext2D, b: Bottle) => {
    ctx.save();
    ctx.translate(b.x + b.width / 2, b.y + b.height);

    if (b.isFlipping) {
      ctx.rotate(b.flipRotation);
    } else if (b.wobbleOffset !== 0) {
      ctx.rotate((b.wobbleOffset * Math.PI) / 180);
    }

    const w = b.width;
    const h = b.height;
    const halfW = w / 2;

    // Palette per type
    let bodyColor1 = '#15803d';
    let bodyColor2 = '#14532d';
    let highlightColor = 'rgba(255, 255, 255, 0.45)';
    let corkColor = '#b45309';

    if (b.type === 'amber') {
      bodyColor1 = '#b45309';
      bodyColor2 = '#78350f';
    } else if (b.type === 'blue') {
      bodyColor1 = '#1d4ed8';
      bodyColor2 = '#1e3a8a';
    } else if (b.type === 'golden') {
      bodyColor1 = '#fbbf24';
      bodyColor2 = '#b45309';
      highlightColor = 'rgba(255, 255, 255, 0.85)';
    } else if (b.type === 'explosive') {
      bodyColor1 = '#ef4444';
      bodyColor2 = '#991b1b';
      corkColor = '#1f2937';
    }

    // Bottle drop shadow on shelf
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 2, halfW * 0.9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden bottle aura glow
    if (b.type === 'golden') {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 15;
    }

    // Path of authentic glass bottle
    // Top neck width: w * 0.35, shoulder at -h * 0.55, body to 0
    const neckW = w * 0.38;
    const neckHalf = neckW / 2;
    const shoulderY = -h * 0.52;
    const lipY = -h;

    ctx.beginPath();
    // Bottom base
    ctx.moveTo(-halfW + 4, 0);
    ctx.lineTo(halfW - 4, 0);
    ctx.quadraticCurveTo(halfW, 0, halfW, -4);
    // Right body side
    ctx.lineTo(halfW, shoulderY);
    // Right shoulder taper
    ctx.quadraticCurveTo(halfW, shoulderY - 12, neckHalf, shoulderY - 20);
    // Right neck
    ctx.lineTo(neckHalf, lipY + 4);
    // Right rim
    ctx.lineTo(neckHalf + 3, lipY + 4);
    ctx.lineTo(neckHalf + 3, lipY);
    // Lip
    ctx.lineTo(-neckHalf - 3, lipY);
    ctx.lineTo(-neckHalf - 3, lipY + 4);
    ctx.lineTo(-neckHalf, lipY + 4);
    // Left neck
    ctx.lineTo(-neckHalf, shoulderY - 20);
    // Left shoulder taper
    ctx.quadraticCurveTo(-halfW, shoulderY - 12, -halfW, shoulderY);
    // Left body side
    ctx.lineTo(-halfW, -4);
    ctx.quadraticCurveTo(-halfW, 0, -halfW + 4, 0);
    ctx.closePath();

    // Glass body linear gradient
    const bGrad = ctx.createLinearGradient(-halfW, 0, halfW, 0);
    bGrad.addColorStop(0, bodyColor2);
    bGrad.addColorStop(0.35, bodyColor1);
    bGrad.addColorStop(0.7, bodyColor2);
    bGrad.addColorStop(1, bodyColor1);
    ctx.fillStyle = bGrad;
    ctx.fill();

    // Glass stroke outline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cork Stopper
    ctx.fillStyle = corkColor;
    ctx.fillRect(-neckHalf + 1, lipY - 8, neckW - 2, 9);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(-neckHalf + 1, lipY - 8, 3, 9);

    // Label on bottle body
    if (b.type === 'explosive') {
      // TNT skull or hazard cross
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-halfW + 5, shoulderY + 12, w - 10, 24);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TNT', 0, shoulderY + 24);
    } else if (b.type === 'golden') {
      // Star badge
      ctx.fillStyle = '#fffbeb';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★ 300', 0, shoulderY + 22);
    } else {
      // Vintage Saloon paper label
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.roundRect(-halfW + 4, shoulderY + 10, w - 8, 22, 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 9px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SALOON', 0, shoulderY + 21);
    }

    // Glass Reflection Highlight Stripe (Left curve)
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-halfW + 5, -8);
    ctx.lineTo(-halfW + 5, shoulderY);
    ctx.quadraticCurveTo(-halfW + 5, shoulderY - 14, -neckHalf + 2, shoulderY - 22);
    ctx.lineTo(-neckHalf + 2, lipY + 4);
    ctx.stroke();

    ctx.restore();
  };

  const drawShards = (ctx: CanvasRenderingContext2D, shards: GlassShard[]) => {
    shards.forEach((s) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.globalAlpha = s.alpha;

      ctx.beginPath();
      s.points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();

      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.strokeStyle = s.borderColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Shard glint reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.isSpark) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Cork / debris
        ctx.beginPath();
        ctx.roundRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2, 2);
        ctx.fill();
      }
      ctx.restore();
    });
  };

  const drawMuzzleFlash = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    const flashGrad = ctx.createRadialGradient(x, y, 2, x, y, 48);
    flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    flashGrad.addColorStop(0.3, 'rgba(253, 224, 71, 0.85)');
    flashGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.4)');
    flashGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = flashGrad;
    ctx.beginPath();
    ctx.arc(x, y, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawScorePopups = (ctx: CanvasRenderingContext2D, popups: ScorePopup[]) => {
    popups.forEach((pop) => {
      ctx.save();
      ctx.globalAlpha = pop.alpha;
      ctx.font = `bold ${Math.round(20 * pop.scale)}px sans-serif`;
      ctx.fillStyle = pop.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    });
  };

  const drawCrosshair = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    readyToFire: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);

    const radius = 18;
    const ringColor = readyToFire ? '#ef4444' : '#9ca3af';

    // Outer crosshair ring
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner reticle center dot
    ctx.fillStyle = ringColor;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 4 crosshair reticle ticks
    const tickLen = 8;
    ctx.beginPath();
    // Top
    ctx.moveTo(0, -radius - tickLen);
    ctx.lineTo(0, -radius + 4);
    // Bottom
    ctx.moveTo(0, radius - 4);
    ctx.lineTo(0, radius + tickLen);
    // Left
    ctx.moveTo(-radius - tickLen, 0);
    ctx.lineTo(-radius + 4, 0);
    // Right
    ctx.moveTo(radius - 4, 0);
    ctx.lineTo(radius + tickLen, 0);
    ctx.stroke();

    ctx.restore();
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-amber-100 select-none font-sans p-2 sm:p-4 overflow-hidden"
    >
      {/* Top Retro HUD Header Bar */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 px-4 py-2 mb-2 bg-gradient-to-r from-stone-900 via-amber-950/80 to-stone-900 border-2 border-amber-800/60 rounded-xl shadow-2xl backdrop-blur-md">
        {/* Game Title & Stage */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-amber-400/80 font-bold">
              Wild West Gallery
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wider drop-shadow">
                STAGE {stage}
              </h1>
              {combo > 1 && (
                <span className="bg-amber-500 text-stone-950 text-xs font-extrabold px-2 py-0.5 rounded-full animate-bounce shadow">
                  {combo}x STREAK
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Score & Target Goals */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
              Score
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono drop-shadow">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
              Target
            </div>
            <div className="text-lg sm:text-xl font-bold text-amber-300 font-mono">
              {targetGoal.current} / {targetGoal.required}
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
              Time
            </div>
            <div
              className={`text-xl sm:text-2xl font-black font-mono ${
                timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-amber-200'
              }`}
            >
              {timeLeft}s
            </div>
          </div>

          <div className="text-center hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
              Accuracy
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Ammo Cylinder & Audio Controls */}
        <div className="flex items-center gap-3">
          {/* 6-Bullet Revolver Chamber Display */}
          <div
            onClick={reloadGun}
            title="Click or press 'R' to reload"
            className="flex items-center gap-1 bg-stone-900/90 border border-amber-700/60 px-2.5 py-1.5 rounded-lg cursor-pointer hover:border-amber-400 transition group"
          >
            <div className="flex items-center gap-1">
              {[...Array(MAX_BULLETS)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-6 rounded-t-sm transition-all duration-150 ${
                    i < bullets
                      ? 'bg-gradient-to-t from-yellow-600 via-amber-400 to-yellow-200 shadow-[0_0_6px_rgba(234,179,8,0.5)]'
                      : 'bg-stone-800 border border-stone-700 opacity-40'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 ml-1.5">
              {isReloading ? 'RELOAD...' : `${bullets}/6`}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-stone-900 border border-amber-700/60 text-amber-300 hover:text-white hover:bg-stone-800 transition"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Interactive HTML5 Canvas Container */}
      <div className="relative w-full max-w-5xl aspect-[16/10] bg-stone-950 rounded-2xl overflow-hidden border-4 border-amber-900/80 shadow-[0_0_50px_rgba(0,0,0,0.9)] cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          onMouseDown={(e) => handleShoot(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              const touch = e.touches[0];
              handleShoot(touch.clientX, touch.clientY);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full object-contain block select-none touch-none"
        />

        {/* Reload Overlay Indicator */}
        {isReloading && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-stone-900/90 border-2 border-amber-500 text-amber-300 px-6 py-2 rounded-full font-bold text-sm tracking-wider shadow-2xl flex items-center gap-2 pointer-events-none animate-pulse">
            <svg className="w-4 h-4 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            RELOADING SIX-SHOOTER...
          </div>
        )}

        {/* Start Game Modal Overlay */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="max-w-md w-full bg-gradient-to-b from-stone-900 to-amber-950 p-6 sm:p-8 rounded-2xl border-4 border-amber-700/80 shadow-[0_0_60px_rgba(245,158,11,0.2)]">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-extrabold">
                Authentic Arcade Gallery
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-amber-200 tracking-wider mt-1 mb-3 drop-shadow-md">
                SALOON SHOOTOUT
              </h2>
              <p className="text-amber-100/80 text-sm mb-6 leading-relaxed">
                Step up to the counter, gunslinger! Shatter the whiskey bottles, trigger explosive TNT chain reactions, and shoot the golden bottles before time runs out.
              </p>

              {/* Legend & Target Types */}
              <div className="grid grid-cols-3 gap-2 bg-stone-950/70 p-3 rounded-xl border border-amber-900/40 mb-6 text-xs text-amber-200">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-8 bg-green-700 rounded-t-sm mb-1 border border-green-500 shadow"></div>
                  <span className="font-bold">Green / Blue</span>
                  <span className="text-[10px] text-amber-400">100-150 Pts</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-8 bg-amber-400 rounded-t-sm mb-1 border border-yellow-200 shadow"></div>
                  <span className="font-bold">Gold Bottle</span>
                  <span className="text-[10px] text-yellow-300">300 Pts (Fast!)</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-8 bg-red-600 rounded-t-sm mb-1 border border-red-400 shadow"></div>
                  <span className="font-bold">Red TNT</span>
                  <span className="text-[10px] text-red-300">Chain Blast!</span>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={startGame}
                className="w-full py-4 px-8 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-black text-lg sm:text-xl rounded-xl shadow-xl transform active:scale-95 transition tracking-wider border-2 border-yellow-200 cursor-pointer"
              >
                AIM & FIRE (START)
              </button>

              <div className="mt-4 flex items-center justify-between text-xs text-amber-400/80 font-mono">
                <span>Best Score: {highScore.toLocaleString()}</span>
                <span>Best Acc: {bestAccuracy}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage Clear Banner Overlay */}
        {gameState === 'STAGE_CLEAR' && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center pointer-events-none z-20 animate-fade-in">
            <div className="bg-stone-900/95 border-4 border-emerald-500 px-8 py-6 rounded-2xl text-center shadow-2xl">
              <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">
                Territory Cleared!
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 mb-2 tracking-wide">
                STAGE {stage} COMPLETE!
              </h2>
              <p className="text-amber-200 text-sm font-medium">
                Bonus awarded for remaining time & accuracy. Next round coming up...
              </p>
            </div>
          </div>
        )}

        {/* Game Over Modal Overlay */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="max-w-md w-full bg-gradient-to-b from-stone-900 to-amber-950 p-6 sm:p-8 rounded-2xl border-4 border-red-700/80 shadow-[0_0_60px_rgba(220,38,38,0.3)]">
              <span className="text-xs uppercase tracking-widest text-red-400 font-extrabold">
                Time Expired
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-red-400 tracking-wider mt-1 mb-4 drop-shadow">
                GAME OVER
              </h2>

              <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Final Score:</span>
                  <span className="font-bold text-amber-300 font-mono text-lg">
                    {score.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">High Score:</span>
                  <span className="font-bold text-yellow-400 font-mono text-lg">
                    {highScore.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Accuracy:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {accuracy}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Rank:</span>
                  <span className="font-bold text-amber-200">
                    {accuracy >= 85 ? 'Deadeye Legend 🤠' : accuracy >= 65 ? 'Sharpshooter 🎯' : 'Saloon Rookie 🍺'}
                  </span>
                </div>
              </div>

              <button
                onClick={startGame}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-lg rounded-xl shadow-xl transform active:scale-95 transition tracking-wider border-2 border-red-300 cursor-pointer"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls & Instructions Strip */}
      <footer className="w-full max-w-5xl flex flex-wrap items-center justify-between text-xs text-amber-300/70 mt-3 px-3 py-1.5 bg-stone-900/50 rounded-lg border border-amber-900/30">
        <div className="flex items-center gap-4">
          <span>🎯 <b>Left-Click / Tap:</b> Shoot</span>
          <span>🔄 <b>R Key / Cylinder:</b> Reload</span>
          <span>⚡ <b>Combos:</b> Consecutive hits multiply points</span>
        </div>
        <div className="text-right text-stone-500 text-[11px]">
          HTML5 Canvas & Web Audio API
        </div>
      </footer>
    </div>
  );
}
