const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingEnabled = false;

const ui = {
  startScreen: document.querySelector("#start-screen"),
  startButton: document.querySelector("#start-button"),
  startStatus: document.querySelector("#start-status"),
  pauseScreen: document.querySelector("#pause-screen"),
  pauseButton: document.querySelector("#pause-button"),
  resumeButton: document.querySelector("#resume-button"),
  resetButton: document.querySelector("#reset-position-button"),
  newGameButton: document.querySelector("#new-game-button"),
  musicButton: document.querySelector("#music-button"),
  fxButton: document.querySelector("#fx-button"),
  announcement: document.querySelector("#announcement"),
  joystick: document.querySelector("#joystick"),
  joystickKnob: document.querySelector("#joystick-knob"),
  characterButtons: Array.from(
    document.querySelectorAll("#character-controls [data-character]"),
  ),
  touchUse: document.querySelector("#touch-use"),
  touchSkill: document.querySelector("#touch-skill"),
  touchJam: document.querySelector("#touch-jam"),
  bandcampFallback: document.querySelector("#bandcamp-fallback"),
  bandcampFrame: document.querySelector("#bandcamp-frame"),
  closeBandcamp: document.querySelector("#close-bandcamp"),
};

const VIEW_W = 480;
const VIEW_H = 270;
const WORLD_W = 1440;
const WORLD_H = 900;
const WATER_Y = 650;
const SAVE_KEY = "flangame-save-v1";
const TERMINAL_CATALOG =
  "https://flanguage.github.io/Flanguage/data/catalog.js";

const colors = {
  now: {
    ground: "#6c6a5c",
    sidewalk: "#aaa68e",
    road: "#282d2c",
    roadLine: "#d9c87d",
    water: "#174d58",
    waterLine: "#3b7b82",
    brick: "#75463e",
    brick2: "#915b47",
    roof: "#242929",
    trim: "#d5cfb6",
    grass: "#56654a",
  },
  old: {
    ground: "#8a7756",
    sidewalk: "#b7a57f",
    road: "#3d352c",
    roadLine: "#d6bd72",
    water: "#315a5b",
    waterLine: "#69877b",
    brick: "#6d4331",
    brick2: "#8a5a39",
    roof: "#302b25",
    trim: "#d9c9a2",
    grass: "#667050",
  },
};

const CHARACTERS = [
  {
    name: "SANTI",
    role: "GUITAR",
    ability: "FEEDBACK LINE",
    shirt: "#365f91",
    accent: "#79baff",
  },
  {
    name: "NICK",
    role: "DRUMS",
    ability: "BEAT LOCK",
    shirt: "#e5e2d3",
    accent: "#cf4439",
  },
  {
    name: "JAKE",
    role: "BASS",
    ability: "SUB DROP",
    shirt: "#9a673b",
    accent: "#caa25e",
  },
];

const TRACKS = [
  {
    title: "Beats Having a Real Job",
    id: 2665792215,
    url: "https://flanguage.bandcamp.com/track/beats-having-a-real-job",
  },
  {
    title: "Underwear Underwater",
    id: 3462920401,
    url: "https://flanguage.bandcamp.com/track/underwear-underwater",
  },
  {
    title: "23 Skidoo",
    id: 942941542,
    url: "https://flanguage.bandcamp.com/track/23-skidoo",
  },
];

const MISSIONS = [
  {
    title: "BEATS HAVING A REAL JOB",
    track: TRACKS[0].title,
    reward: 20,
  },
  {
    title: "UNDERWEAR UNDERWATER",
    track: TRACKS[1].title,
    reward: 30,
  },
  {
    title: "23 SKIDOO",
    track: TRACKS[2].title,
    reward: 50,
  },
];

const ROADS = [
  { x: 0, y: 150, w: WORLD_W, h: 96 },
  { x: 0, y: 400, w: WORLD_W, h: 90 },
  { x: 0, y: 585, w: WORLD_W, h: 65 },
  { x: 300, y: 0, w: 72, h: WATER_Y },
  { x: 630, y: 0, w: 72, h: WATER_Y },
  { x: 990, y: 0, w: 72, h: WATER_Y },
  { x: 1328, y: 0, w: 72, h: WATER_Y },
];

const PIERS = [
  { x: 432, y: 620, w: 132, h: 174 },
  { x: 962, y: 620, w: 152, h: 150 },
];

const BUILDINGS = [
  { x: 50, y: 38, w: 220, h: 104, label: "MOM'S BASEMENT", kind: "base" },
  { x: 392, y: 30, w: 205, h: 112, label: "ROWHOUSES", kind: "row" },
  { x: 728, y: 36, w: 225, h: 106, label: "MARKET", kind: "market" },
  { x: 1090, y: 28, w: 205, h: 114, label: "STATION", kind: "station" },
  { x: 52, y: 270, w: 214, h: 114, label: "SPAGHETTI ROADHOUSE", kind: "venue" },
  { x: 402, y: 276, w: 190, h: 108, label: "BANK", kind: "bank" },
  { x: 736, y: 274, w: 218, h: 110, label: "RECORDS", kind: "shop" },
  { x: 1096, y: 270, w: 198, h: 114, label: "CLUB 23", kind: "club" },
  { x: 46, y: 508, w: 220, h: 64, label: "WAREHOUSE", kind: "warehouse" },
  { x: 402, y: 510, w: 188, h: 62, label: "PIER OFFICE", kind: "warehouse" },
  { x: 736, y: 510, w: 216, h: 62, label: "GARAGE", kind: "garage" },
  { x: 1096, y: 510, w: 198, h: 62, label: "OLD PORT", kind: "warehouse" },
];

const LANDMARKS = {
  baseDoor: { x: 164, y: 150 },
  bankDoor: { x: 500, y: 400 },
  timeRift: { x: 1258, y: 196 },
  speakeasy: { x: 1192, y: 400 },
};

const VEHICLE_STARTS = [
  { id: "car", type: "car", x: 500, y: 448, angle: 0, color: "#b44c37" },
  { id: "bike", type: "bike", x: 816, y: 198, angle: 0, color: "#d6c85f" },
  { id: "boat", type: "boat", x: 580, y: 744, angle: Math.PI / 2, color: "#e7e5d7" },
  { id: "van", type: "van", x: 214, y: 198, angle: 0, color: "#e1e0d3" },
];

const NPC_STARTS = [
  [350, 208], [415, 198], [545, 215], [680, 184], [790, 224], [920, 190],
  [1040, 220], [1160, 186], [1280, 218], [330, 438], [455, 460], [610, 425],
  [760, 452], [900, 430], [1040, 454], [1210, 430], [300, 612], [680, 612],
  [920, 610], [1250, 612],
];

const LAUNDRY_STARTS = [
  { id: "sock", x: 664, y: 744, color: "#e4da70" },
  { id: "shirt", x: 868, y: 830, color: "#d77aa8" },
  { id: "shorts", x: 1224, y: 738, color: "#72a8da" },
];

const keys = new Set();
const joystick = { x: 0, y: 0, pointerId: null };
const camera = { x: 0, y: 0 };
let announcementTimer = 0;
let saveTimer = 0;
let lastFrame = performance.now();
let catalogTracks = [];
let catalogReady = false;

function freshState() {
  return {
    started: false,
    paused: false,
    era: "now",
    character: 0,
    pocket: 0,
    fund: 0,
    groove: 0,
    mission: 0,
    completed: [false, false, false],
    fanIds: new Set(),
    laundryIds: new Set(),
    vanUnlocked: false,
    timeUnlocked: false,
    freeTimeTravel: false,
    player: { x: 326, y: 208, facing: 0, invulnerable: 0 },
    vehicleId: null,
    vehicles: VEHICLE_STARTS.map((vehicle) => ({
      ...vehicle,
      vx: 0,
      vy: 0,
    })),
    npcs: NPC_STARTS.map(([x, y], index) => ({
      id: `npc-${index}`,
      x,
      y,
      vx: 0,
      vy: 0,
      directionTimer: Math.random() * 3,
      tipCooldown: 0,
      palette: index % 6,
    })),
    slimes: [],
    pickups: [],
    caches: [
      { id: "cache-a", x: 870, y: 535, opened: false },
      { id: "cache-b", x: 1130, y: 86, opened: false },
      { id: "cache-c", x: 92, y: 454, opened: false },
    ],
    effects: [],
    floats: [],
    jam: null,
    skillCooldown: 0,
    timeCooldown: 0,
    slimeTimer: 2,
    missionFinishing: false,
    musicMuted: false,
    fxOn: true,
    currentTrack: null,
  };
}

let game = freshState();
let gameGeneration = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, amount) {
  return a + (b - a) * amount;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointInRect(x, y, rect, padding = 0) {
  return (
    x >= rect.x - padding &&
    x <= rect.x + rect.w + padding &&
    y >= rect.y - padding &&
    y <= rect.y + rect.h + padding
  );
}

function onPier(x, y) {
  return PIERS.some((pier) => pointInRect(x, y, pier));
}

function inBuilding(x, y, padding = 7) {
  return BUILDINGS.some((building) => pointInRect(x, y, building, padding));
}

function isWalkable(x, y) {
  if (x < 8 || x > WORLD_W - 8 || y < 8 || y > WORLD_H - 8) return false;
  if (inBuilding(x, y, 6)) return false;
  if (y >= WATER_Y && !onPier(x, y)) return false;
  return true;
}

function onRoad(x, y) {
  return ROADS.some((road) => pointInRect(x, y, road));
}

function isVehiclePositionValid(vehicle, x, y) {
  if (x < 12 || x > WORLD_W - 12 || y < 12 || y > WORLD_H - 12) return false;
  if (vehicle.type === "boat") {
    return y > WATER_Y + 18 && !onPier(x, y);
  }
  return onRoad(x, y) && !inBuilding(x, y, 12) && y < WATER_Y;
}

function currentVehicle() {
  return game.vehicles.find((vehicle) => vehicle.id === game.vehicleId) || null;
}

function controlledPosition() {
  return currentVehicle() || game.player;
}

function nearest(items, origin, predicate = () => true) {
  let result = null;
  let best = Infinity;
  for (const item of items) {
    if (!predicate(item)) continue;
    const d = distance(item, origin);
    if (d < best) {
      best = d;
      result = item;
    }
  }
  return result ? { item: result, distance: best } : null;
}

function announce(message, duration = 2200) {
  ui.announcement.textContent = message;
  ui.announcement.classList.add("show");
  clearTimeout(announcementTimer);
  announcementTimer = setTimeout(() => {
    ui.announcement.classList.remove("show");
  }, duration);
}

function addFloat(text, x, y, color = "#f1f4e8") {
  game.floats.push({ text, x, y, color, life: 1.2 });
}

function saveGame(force = false) {
  if (!force && saveTimer > 0) return;
  saveTimer = 1;
  const data = {
    era: game.era,
    character: game.character,
    pocket: game.pocket,
    fund: game.fund,
    groove: game.groove,
    mission: game.mission,
    completed: game.completed,
    fanIds: [...game.fanIds],
    laundryIds: [...game.laundryIds],
    vanUnlocked: game.vanUnlocked,
    timeUnlocked: game.timeUnlocked,
    freeTimeTravel: game.freeTimeTravel,
    player: {
      x: game.vehicleId ? controlledPosition().x : game.player.x,
      y: game.vehicleId ? controlledPosition().y : game.player.y,
      facing: game.player.facing,
    },
    caches: game.caches.map((cache) => ({ id: cache.id, opened: cache.opened })),
    musicMuted: game.musicMuted,
    fxOn: game.fxOn,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // Saving is optional when browser storage is unavailable.
  }
}

function loadGame() {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
  } catch {
    data = null;
  }
  if (!data) return;

  game.era = data.era === "old" ? "old" : "now";
  game.character = clamp(Number(data.character) || 0, 0, 2);
  game.pocket = Math.max(0, Math.floor(Number(data.pocket) || 0));
  game.fund = Math.max(0, Math.floor(Number(data.fund) || 0));
  game.groove = clamp(Number(data.groove) || 0, 0, 100);
  game.mission = clamp(Number(data.mission) || 0, 0, MISSIONS.length);
  game.completed = [0, 1, 2].map((index) => Boolean(data.completed?.[index]));
  while (game.mission < MISSIONS.length && game.completed[game.mission]) {
    game.mission += 1;
  }
  game.fanIds = new Set(Array.isArray(data.fanIds) ? data.fanIds : []);
  game.laundryIds = new Set(Array.isArray(data.laundryIds) ? data.laundryIds : []);
  game.vanUnlocked = Boolean(data.vanUnlocked || game.completed[0]);
  game.timeUnlocked = Boolean(data.timeUnlocked || game.completed[1]);
  game.freeTimeTravel = Boolean(data.freeTimeTravel || game.completed[2]);
  game.musicMuted = Boolean(data.musicMuted);
  game.fxOn = data.fxOn !== false;
  const fallback = game.era === "old" ? { x: 1110, y: 440 } : { x: 326, y: 208 };
  const x = Number(data.player?.x);
  const y = Number(data.player?.y);
  game.player.x = Number.isFinite(x) ? clamp(x, 12, WORLD_W - 12) : fallback.x;
  game.player.y = Number.isFinite(y) ? clamp(y, 12, WORLD_H - 12) : fallback.y;
  game.player.facing = Number(data.player?.facing) || 0;
  if (!isWalkable(game.player.x, game.player.y)) {
    game.player.x = fallback.x;
    game.player.y = fallback.y;
  }
  for (const cache of game.caches) {
    cache.opened = Boolean(data.caches?.find((item) => item.id === cache.id)?.opened);
  }
}

const audio = {
  context: null,
  element: null,
  source: null,
  crusher: null,
  filter: null,
  compressor: null,
  gain: null,
  workletReady: false,
  mode: "none",
  token: 0,
  refreshAttempted: false,
  corsByOrigin: new Map(),
  cleanFxTimer: 0,

  async unlock() {
    if (!this.context) {
      this.context = new AudioContext();
    }
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    gain.gain.value = 0.00001;
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.02);
  },

  stop() {
    if (this.element) {
      this.element.__flangStopped = true;
      this.element.pause();
      this.element.removeAttribute("src");
      this.element.load();
    }
    try {
      this.source?.disconnect();
      this.crusher?.disconnect();
      this.filter?.disconnect();
      this.compressor?.disconnect();
      this.gain?.disconnect();
    } catch {
      // Already disconnected.
    }
    this.element = null;
    this.source = null;
    this.crusher = null;
    this.filter = null;
    this.compressor = null;
    this.gain = null;
    this.mode = "none";
  },

  async corsAvailable(url) {
    let origin;
    try {
      origin = new URL(url).origin;
    } catch {
      return false;
    }
    if (this.corsByOrigin.has(origin)) return this.corsByOrigin.get(origin);
    try {
      const response = await fetch(url, { method: "HEAD", mode: "cors" });
      const available = response.ok;
      this.corsByOrigin.set(origin, available);
      return available;
    } catch {
      this.corsByOrigin.set(origin, false);
      return false;
    }
  },

  async play(track, allowRefresh = true) {
    const token = ++this.token;
    this.stop();
    hideBandcamp();
    if (!track?.audio) {
      showBandcamp(track);
      return;
    }

    const processable = await this.corsAvailable(track.audio);
    if (token !== this.token) return;
    if (processable) {
      try {
        await this.playProcessed(track.audio);
        return;
      } catch {
        this.stop();
      }
    }

    try {
      await this.playClean(track.audio, allowRefresh);
    } catch {
      this.stop();
      showBandcamp(track);
    }
  },

  async playProcessed(url) {
    await this.unlock();
    if (!this.workletReady) {
      await this.context.audioWorklet.addModule("./bitcrusher-worklet.js");
      this.workletReady = true;
    }
    const element = new Audio();
    element.crossOrigin = "anonymous";
    element.preload = "auto";
    element.playsInline = true;
    element.loop = false;
    element.src = url;
    const source = this.context.createMediaElementSource(element);
    const crusher = new AudioWorkletNode(this.context, "flang-bitcrusher");
    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 8;
    compressor.ratio.value = 4;
    const gain = this.context.createGain();
    source.connect(crusher).connect(filter).connect(compressor).connect(gain);
    gain.connect(this.context.destination);
    this.element = element;
    this.source = source;
    this.crusher = crusher;
    this.filter = filter;
    this.compressor = compressor;
    this.gain = gain;
    this.mode = "processed";
    this.applySettings();
    element.addEventListener("ended", () => {
      if (game.started && !game.musicMuted) element.play().catch(() => {});
    });
    element.addEventListener("error", () => showBandcamp(currentTrackData()));
    await element.play();
  },

  async playClean(url, allowRefresh = true) {
    const element = new Audio(url);
    element.preload = "auto";
    element.playsInline = true;
    element.loop = true;
    element.volume = game.musicMuted ? 0 : 0.68;
    this.element = element;
    this.mode = "clean";
    element.addEventListener("error", async () => {
      if (element.__flangStopped || element !== this.element) return;
      if (!allowRefresh) {
        showBandcamp(currentTrackData());
        return;
      }
      await loadCatalog(true);
      const freshTrack = currentTrackData();
      if (freshTrack?.audio && freshTrack.audio !== url) {
        this.play(freshTrack, false).catch(() => showBandcamp(freshTrack));
      } else {
        showBandcamp(freshTrack);
      }
    });
    await element.play();
    if (game.fxOn) {
      announce("STREAM FX // LOW-BIT FALLBACK", 2200);
    }
  },

  updateCleanFx(dt) {
    if (this.mode !== "clean" || !this.element) return;
    this.cleanFxTimer -= dt;
    if (this.cleanFxTimer > 0) return;
    this.cleanFxTimer = 0.075 + Math.random() * 0.11;
    if (game.musicMuted) {
      this.element.volume = 0;
      return;
    }
    if (!game.fxOn) {
      this.element.volume = 0.68;
      this.element.playbackRate = 1;
      return;
    }
    const levels = [0.46, 0.54, 0.61, 0.68];
    this.element.volume = levels[Math.floor(Math.random() * levels.length)];
    this.element.playbackRate = Math.random() < 0.22 ? 0.995 : 1;
  },

  applySettings() {
    if (this.element) {
      this.element.muted = game.musicMuted;
      if (this.mode === "clean") this.element.volume = game.musicMuted ? 0 : 0.68;
    }
    if (this.gain && this.context) {
      this.gain.gain.setTargetAtTime(game.musicMuted ? 0 : 0.72, this.context.currentTime, 0.02);
    }
    if (this.crusher && this.context) {
      this.crusher.parameters
        .get("mix")
        ?.setTargetAtTime(game.fxOn ? 1 : 0, this.context.currentTime, 0.03);
      this.crusher.parameters
        .get("bits")
        ?.setTargetAtTime(7, this.context.currentTime, 0.03);
      this.crusher.parameters
        .get("reduction")
        ?.setTargetAtTime(4, this.context.currentTime, 0.03);
    }
    if (this.filter && this.context) {
      this.filter.frequency.setTargetAtTime(
        game.fxOn ? 3900 : 18000,
        this.context.currentTime,
        0.04,
      );
    }
  },

  pause() {
    this.element?.pause();
    hideBandcamp();
  },

  resume() {
    if (game.musicMuted) return;
    if (this.element) this.element.play().catch(() => showBandcamp(currentTrackData()));
    else showBandcamp(currentTrackData());
  },
};

function currentTrackData() {
  const title = game.currentTrack || MISSIONS[Math.min(game.mission, 2)]?.track;
  const catalogMatch = catalogTracks.find(
    (track) => track.title.toLocaleLowerCase() === title?.toLocaleLowerCase(),
  );
  const fallback = TRACKS.find((track) => track.title === title) || TRACKS[0];
  return { ...fallback, ...catalogMatch };
}

function flattenCatalog() {
  const catalog = window.FLANGUAGE_CATALOG;
  if (!catalog?.albums?.length) return [];
  return catalog.albums.flatMap((album) =>
    album.tracks.map((track) => ({
      ...track,
      album: album.title,
      audio:
        track.audio ||
        track.streamingUrl ||
        track.streamUrl ||
        track.file?.["mp3-128"] ||
        track.file?.mp3 ||
        null,
    })),
  );
}

async function loadCatalog(force = false) {
  if (catalogReady && !force) return;
  try {
    const response = await fetch(
      `${TERMINAL_CATALOG}?game=${Date.now().toString(36)}`,
      { mode: "cors", cache: "no-store" },
    );
    if (!response.ok) throw new Error(`catalog ${response.status}`);
    const source = await response.text();
    const prefix = "window.FLANGUAGE_CATALOG = ";
    const offset = source.indexOf(prefix);
    if (offset < 0) throw new Error("invalid catalog");
    const json = source
      .slice(offset + prefix.length)
      .trim()
      .replace(/;\s*$/, "");
    window.FLANGUAGE_CATALOG = JSON.parse(json);
    catalogTracks = flattenCatalog();
  } catch {
    catalogTracks = [];
  }
  catalogReady = true;
  ui.startStatus.textContent = catalogTracks.length
    ? `TERMINAL LINKED // ${catalogTracks.length} TRACKS // DON'T FEED THE GREEN`
    : "BANDCAMP READY // NO JOBS // DON'T FEED THE GREEN";
}

function showBandcamp(track = currentTrackData()) {
  if (!track?.id || game.musicMuted) return;
  ui.bandcampFrame.src = [
    "https://bandcamp.com/EmbeddedPlayer",
    `track=${track.id}`,
    "size=small",
    "bgcol=000000",
    "linkcol=8cff00",
    "tracklist=false",
    "artwork=none",
    "transparent=true",
    "",
  ].join("/");
  ui.bandcampFallback.hidden = false;
  announce("TAP BANDCAMP PLAY // DIRECT STREAM UNAVAILABLE", 3200);
}

function hideBandcamp() {
  ui.bandcampFallback.hidden = true;
  ui.bandcampFrame.removeAttribute("src");
}

async function playMissionTrack(force = false) {
  const mission = MISSIONS[Math.min(game.mission, MISSIONS.length - 1)];
  const nextTitle = mission?.track || TRACKS[0].title;
  if (!force && game.currentTrack === nextTitle) return;
  game.currentTrack = nextTitle;
  if (!catalogReady) await loadCatalog();
  if (!game.started || game.musicMuted) return;
  await audio.play(currentTrackData());
}

function movementVector() {
  let x = joystick.x;
  let y = joystick.y;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) x -= 1;
  if (keys.has("ArrowRight") || keys.has("KeyD")) x += 1;
  if (keys.has("ArrowUp") || keys.has("KeyW")) y -= 1;
  if (keys.has("ArrowDown") || keys.has("KeyS")) y += 1;
  const length = Math.hypot(x, y);
  if (length > 1) {
    x /= length;
    y /= length;
  }
  return { x, y, length: Math.min(1, length) };
}

function switchCharacter(index = (game.character + 1) % CHARACTERS.length) {
  if (!game.started || game.paused) return;
  game.character = clamp(Number(index) || 0, 0, CHARACTERS.length - 1);
  if (game.jam) finishJam(true);
  updateCharacterButtons();
  announce(`${CHARACTERS[game.character].name} // ${CHARACTERS[game.character].role}`);
  saveGame(true);
}

function updateCharacterButtons() {
  ui.characterButtons.forEach((button, index) => {
    button.classList.toggle("active", index === game.character);
  });
  ui.fxButton.classList.toggle("active", game.fxOn);
  ui.musicButton.textContent = game.musicMuted ? "×" : "♪";
}

function startJam() {
  if (!game.started || game.paused || game.vehicleId || game.jam) return;
  const nearby = game.npcs
    .filter((npc) => distance(npc, game.player) < 145 && npc.tipCooldown <= 0)
    .sort((a, b) => distance(a, game.player) - distance(b, game.player))
    .slice(0, game.groove >= 100 ? 7 : 4);
  if (!nearby.length) {
    announce("NO CROWD // FIND PEOPLE");
    return;
  }
  const trio = game.groove >= 100;
  game.jam = {
    time: 0,
    beat: -1,
    targets: nearby.map((npc) => npc.id),
    paid: new Set(),
    trio,
  };
  if (trio) {
    game.groove = 0;
    for (const slime of game.slimes) {
      if (distance(slime, game.player) < 180) slime.stun = 5;
    }
    announce("TRIO JAM // CASH MULTIPLIER", 2600);
  } else {
    announce(`${CHARACTERS[game.character].role} // PLAYING`);
  }
  game.effects.push({
    type: "ring",
    x: game.player.x,
    y: game.player.y,
    radius: 8,
    max: trio ? 185 : 120,
    life: trio ? 3.4 : 2.9,
    color: trio ? "#8cff00" : CHARACTERS[game.character].accent,
  });
}

function jamPulse() {
  if (!game.jam) return;
  const targetIds = new Set(game.jam.targets);
  for (const npc of game.npcs) {
    if (!targetIds.has(npc.id)) continue;
    const dx = game.player.x - npc.x;
    const dy = game.player.y - npc.y;
    const length = Math.hypot(dx, dy) || 1;
    if (length > 52) {
      npc.x += (dx / length) * 6;
      npc.y += (dy / length) * 6;
    }
    if (game.jam.beat < 3 || game.jam.paid.has(npc.id)) continue;
    game.jam.paid.add(npc.id);
    npc.tipCooldown = 9 + Math.random() * 5;
    const base = 3 + Math.floor(Math.random() * 6);
    const value = game.jam.trio ? base * 2 : base;
    game.pickups.push({
      id: `tip-${npc.id}-${Date.now()}`,
      type: "cash",
      x: npc.x,
      y: npc.y - 8,
      value,
      vx: (game.player.x - npc.x) * 0.35,
      vy: (game.player.y - npc.y) * 0.35,
      life: 8,
      sourceNpc: npc.id,
    });
    game.fanIds.add(npc.id);
    addFloat(`+$${value}`, npc.x, npc.y - 12, "#8cff00");
  }
  game.groove = clamp(game.groove + (game.jam.trio ? 0 : 9), 0, 100);
}

function finishJam(cancelled = false) {
  if (!game.jam) return;
  if (!cancelled && game.jam.paid.size) {
    announce(`${game.jam.paid.size} PEOPLE TIPPED // PICK IT UP`);
  }
  game.jam = null;
  saveGame(true);
}

function hitSlime(slime, power = 1) {
  slime.health -= power;
  slime.stun = Math.max(slime.stun, 0.5);
  if (slime.health > 0) return;
  if (slime.stolen > 0) {
    game.pickups.push({
      id: `recovered-${slime.id}`,
      type: "cash",
      x: slime.x,
      y: slime.y,
      value: slime.stolen,
      vx: 0,
      vy: 0,
      life: 12,
      sourceNpc: null,
    });
    addFloat(`RECOVER $${slime.stolen}`, slime.x, slime.y - 10, "#f1f4e8");
  }
  slime.dead = true;
  game.effects.push({
    type: "splat",
    x: slime.x,
    y: slime.y,
    life: 0.8,
    radius: 22,
    color: "#8cff00",
  });
}

function useAbility() {
  if (!game.started || game.paused || game.skillCooldown > 0) return;
  if (game.vehicleId) {
    if (game.vehicleId === "van" && game.freeTimeTravel) travelTime();
    else interact();
    return;
  }
  if (game.jam) finishJam(true);
  game.skillCooldown = 2.7;
  const character = game.character;
  const origin = game.player;

  if (character === 0) {
    const dx = Math.cos(origin.facing);
    const dy = Math.sin(origin.facing);
    game.effects.push({
      type: "beam",
      x: origin.x,
      y: origin.y,
      x2: origin.x + dx * 124,
      y2: origin.y + dy * 124,
      life: 0.32,
      color: CHARACTERS[0].accent,
    });
    for (const slime of game.slimes) {
      const sx = slime.x - origin.x;
      const sy = slime.y - origin.y;
      const forward = sx * dx + sy * dy;
      const side = Math.abs(sx * dy - sy * dx);
      if (forward > 0 && forward < 128 && side < 22) hitSlime(slime, 2);
    }
  } else if (character === 1) {
    game.effects.push({
      type: "ring",
      x: origin.x,
      y: origin.y,
      radius: 8,
      max: 112,
      life: 0.9,
      color: CHARACTERS[1].accent,
    });
    for (const slime of game.slimes) {
      const d = distance(slime, origin);
      if (d < 112) {
        slime.stun = 3.2;
        if (d < 58) hitSlime(slime, 1);
      }
    }
  } else {
    game.effects.push({
      type: "ring",
      x: origin.x,
      y: origin.y,
      radius: 8,
      max: 132,
      life: 1.05,
      color: CHARACTERS[2].accent,
    });
    for (const slime of game.slimes) {
      const d = distance(slime, origin);
      if (d >= 132) continue;
      const dx = (slime.x - origin.x) / Math.max(d, 1);
      const dy = (slime.y - origin.y) / Math.max(d, 1);
      slime.x += dx * 38;
      slime.y += dy * 38;
      hitSlime(slime, 1);
    }
    const cache = nearest(game.caches, origin, (item) => !item.opened);
    if (cache && cache.distance < 150) {
      cache.item.opened = true;
      const value = 12 + Math.floor(Math.random() * 12);
      game.pickups.push({
        id: `cache-${cache.item.id}`,
        type: "cash",
        x: cache.item.x,
        y: cache.item.y,
        value,
        vx: 0,
        vy: -8,
        life: 15,
        sourceNpc: null,
      });
      announce(`JAKE FOUND $${value}`);
    }
  }
}

function depositCash() {
  if (game.pocket <= 0) {
    announce("NO POCKET CASH_");
    return;
  }
  const amount = game.pocket;
  game.pocket = 0;
  game.fund += amount;
  addFloat(`BANKED $${amount}`, LANDMARKS.baseDoor.x, LANDMARKS.baseDoor.y - 12, "#8cff00");
  announce(`BAND FUND +$${amount}`);
  if (game.mission === 0 && game.fanIds.size >= 3) completeMission();
  saveGame(true);
}

function enterVehicle(vehicle) {
  if (vehicle.id === "van" && !game.vanUnlocked) {
    announce("VAN DEAD // FINISH THE FIRST MISSION");
    return;
  }
  game.vehicleId = vehicle.id;
  game.player.x = vehicle.x;
  game.player.y = vehicle.y;
  if (game.jam) finishJam(true);
  announce(`${vehicle.type.toLocaleUpperCase()} // DRIVE`);
}

function findExitPoint(vehicle) {
  const offsets = [
    [22, 0], [-22, 0], [0, 22], [0, -22], [30, 18], [-30, -18],
  ];
  for (const [dx, dy] of offsets) {
    const x = vehicle.x + dx;
    const y = vehicle.y + dy;
    if (isWalkable(x, y)) return { x, y };
  }
  if (vehicle.type === "boat") return null;
  return game.era === "old" ? { x: 1110, y: 440 } : { x: 326, y: 208 };
}

function exitVehicle() {
  const vehicle = currentVehicle();
  if (!vehicle) return;
  const exit = findExitPoint(vehicle);
  if (!exit) {
    announce("PULL UP TO A PIER TO EXIT");
    return;
  }
  game.player.x = exit.x;
  game.player.y = exit.y;
  game.player.facing = vehicle.angle;
  game.vehicleId = null;
  vehicle.vx = 0;
  vehicle.vy = 0;
  announce("ON FOOT");
}

function travelTime() {
  const van = currentVehicle();
  if (!van || van.type !== "van") return;
  if (game.timeCooldown > 0) return;
  if (!game.timeUnlocked && !game.freeTimeTravel) {
    announce("TIME CIRCUIT OFFLINE");
    return;
  }
  if (distance(van, LANDMARKS.timeRift) > 72 && !game.freeTimeTravel) {
    announce("FIND THE GREEN RIFT");
    return;
  }
  game.timeCooldown = 1.2;
  game.era = game.era === "now" ? "old" : "now";
  game.player.invulnerable = 2;
  for (const slime of game.slimes) slime.stun = 2;
  game.effects.push({ type: "flash", life: 1.2, color: "#8cff00" });
  announce(game.era === "old" ? "BALTIMORE // 1923" : "BALTIMORE // NOW", 2600);
  saveGame(true);
}

function interact() {
  if (!game.started || game.paused) return;
  const vehicle = currentVehicle();
  if (vehicle) {
    if (
      vehicle.type === "van" &&
      distance(vehicle, LANDMARKS.timeRift) < 72
    ) {
      travelTime();
      return;
    }
    exitVehicle();
    return;
  }

  if (distance(game.player, LANDMARKS.baseDoor) < 38) {
    depositCash();
    return;
  }

  const nearbyVehicle = nearest(game.vehicles, game.player);
  if (nearbyVehicle && nearbyVehicle.distance < 34) {
    enterVehicle(nearbyVehicle.item);
    return;
  }
  announce("NOTHING TO USE_");
}

function objectiveText() {
  if (game.mission === 0) {
    if (game.fanIds.size < 3) return `PLAY FOR PEOPLE ${game.fanIds.size}/3`;
    return "BANK YOUR TIPS AT MOM'S BASEMENT";
  }
  if (game.mission === 1) {
    if (game.laundryIds.size < 3) return `TAKE THE BOAT // FIND GEAR ${game.laundryIds.size}/3`;
    return "GEAR RECOVERED";
  }
  if (game.mission === 2) {
    if (game.era === "now") return "TAKE THE VAN TO THE GREEN RIFT";
    return "REACH CLUB 23";
  }
  return "FREE ROAM // MAKE MONEY // DON'T WORK";
}

function objectiveTarget() {
  if (game.mission === 0) {
    if (game.fanIds.size >= 3) return LANDMARKS.baseDoor;
    return nearest(game.npcs, controlledPosition(), (npc) => !game.fanIds.has(npc.id))?.item;
  }
  if (game.mission === 1) {
    if (game.vehicleId !== "boat") {
      return game.vehicles.find((vehicle) => vehicle.id === "boat");
    }
    const laundry = LAUNDRY_STARTS.filter((item) => !game.laundryIds.has(item.id));
    return nearest(laundry, controlledPosition())?.item;
  }
  if (game.mission === 2) {
    return game.era === "now" ? LANDMARKS.timeRift : LANDMARKS.speakeasy;
  }
  return null;
}

function completeMission() {
  const index = game.mission;
  if (index >= MISSIONS.length || game.completed[index] || game.missionFinishing) return;
  const generation = gameGeneration;
  game.missionFinishing = true;
  game.completed[index] = true;
  game.fund += MISSIONS[index].reward;
  announce(`MISSION COMPLETE // BAND FUND +$${MISSIONS[index].reward}`, 3600);
  game.effects.push({ type: "flash", life: 1.4, color: "#f1f4e8" });
  if (index === 0) game.vanUnlocked = true;
  if (index === 1) game.timeUnlocked = true;
  if (index === 2) game.freeTimeTravel = true;
  game.mission = index + 1;
  saveGame(true);
  setTimeout(() => {
    if (generation !== gameGeneration || game.mission !== index + 1) return;
    game.missionFinishing = false;
    if (game.mission >= MISSIONS.length) {
      announce("VERTICAL SLICE COMPLETE // SLIME CITY OPEN", 4200);
    } else {
      announce(`NEW MISSION // ${MISSIONS[game.mission].title}`, 3200);
      if (game.paused) game.currentTrack = null;
      else playMissionTrack(true);
    }
    saveGame(true);
  }, 1600);
}

function spawnSlime() {
  if (game.slimes.length >= 4 + Math.floor(game.pocket / 35)) return;
  const origin = controlledPosition();
  const angle = Math.random() * Math.PI * 2;
  const radius = 180 + Math.random() * 170;
  let x = clamp(origin.x + Math.cos(angle) * radius, 20, WORLD_W - 20);
  let y = clamp(origin.y + Math.sin(angle) * radius, 20, WATER_Y - 20);
  if (!isWalkable(x, y)) {
    x = clamp(origin.x + 210, 30, WORLD_W - 30);
    y = clamp(origin.y + 110, 30, WATER_Y - 30);
  }
  if (!isWalkable(x, y)) return;
  game.slimes.push({
    id: `slime-${Date.now()}-${Math.random()}`,
    x,
    y,
    health: 2,
    stolen: 0,
    stun: 0,
    stealCooldown: 0,
    wobble: Math.random() * 10,
    dead: false,
  });
}

function moveWithCollision(entity, dx, dy, validator = isWalkable) {
  const nextX = entity.x + dx;
  if (validator(nextX, entity.y)) entity.x = nextX;
  const nextY = entity.y + dy;
  if (validator(entity.x, nextY)) entity.y = nextY;
}

function updatePlayer(dt) {
  game.player.invulnerable = Math.max(0, game.player.invulnerable - dt);
  const movement = movementVector();
  if (movement.length > 0.05) {
    if (game.jam) finishJam(true);
    game.player.facing = Math.atan2(movement.y, movement.x);
    moveWithCollision(
      game.player,
      movement.x * 92 * dt,
      movement.y * 92 * dt,
    );
  }
}

function updateVehicle(dt) {
  const vehicle = currentVehicle();
  if (!vehicle) return;
  const movement = movementVector();
  const topSpeed = vehicle.type === "bike" ? 188 : vehicle.type === "boat" ? 126 : 156;
  const acceleration = vehicle.type === "bike" ? 590 : 440;
  vehicle.vx += movement.x * acceleration * dt;
  vehicle.vy += movement.y * acceleration * dt;
  const drag = Math.pow(movement.length > 0.05 ? 0.24 : 0.055, dt);
  vehicle.vx *= drag;
  vehicle.vy *= drag;
  const speed = Math.hypot(vehicle.vx, vehicle.vy);
  if (speed > topSpeed) {
    vehicle.vx = (vehicle.vx / speed) * topSpeed;
    vehicle.vy = (vehicle.vy / speed) * topSpeed;
  }
  if (speed > 4) vehicle.angle = Math.atan2(vehicle.vy, vehicle.vx);
  const valid = (x, y) => isVehiclePositionValid(vehicle, x, y);
  const beforeX = vehicle.x;
  const beforeY = vehicle.y;
  moveWithCollision(vehicle, vehicle.vx * dt, vehicle.vy * dt, valid);
  if (Math.abs(vehicle.x - beforeX) < 0.01) vehicle.vx *= -0.16;
  if (Math.abs(vehicle.y - beforeY) < 0.01) vehicle.vy *= -0.16;
  game.player.x = vehicle.x;
  game.player.y = vehicle.y;

  if (vehicle.type !== "boat" && speed > 58) {
    for (const slime of game.slimes) {
      if (!slime.dead && distance(vehicle, slime) < 19) {
        const recovered = slime.stolen;
        hitSlime(slime, 3);
        addFloat(recovered ? `SPLAT +$${recovered}` : "SPLAT", slime.x, slime.y, "#8cff00");
      }
    }
  }
}

function updateNPCs(dt) {
  for (const npc of game.npcs) {
    npc.tipCooldown = Math.max(0, npc.tipCooldown - dt);
    npc.directionTimer -= dt;
    if (npc.directionTimer <= 0) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 8 + Math.random() * 14;
      npc.vx = Math.cos(angle) * speed;
      npc.vy = Math.sin(angle) * speed;
      npc.directionTimer = 1.1 + Math.random() * 3.8;
    }
    if (game.jam?.targets.includes(npc.id)) continue;
    const oldX = npc.x;
    const oldY = npc.y;
    moveWithCollision(npc, npc.vx * dt, npc.vy * dt);
    if (npc.x === oldX) npc.vx *= -1;
    if (npc.y === oldY) npc.vy *= -1;
  }
}

function updateJam(dt) {
  if (!game.jam) return;
  game.jam.time += dt;
  const beat = Math.floor(game.jam.time / 0.5);
  if (beat !== game.jam.beat) {
    game.jam.beat = beat;
    jamPulse();
    game.effects.push({
      type: "note",
      x: game.player.x + (Math.random() - 0.5) * 22,
      y: game.player.y - 16,
      life: 0.9,
      color: game.jam.trio ? "#8cff00" : CHARACTERS[game.character].accent,
    });
  }
  if (game.jam.time >= (game.jam.trio ? 3.5 : 3)) finishJam(false);
}

function updateSlimes(dt) {
  const target = controlledPosition();
  for (const slime of game.slimes) {
    if (slime.dead) continue;
    slime.stun = Math.max(0, slime.stun - dt);
    slime.stealCooldown = Math.max(0, slime.stealCooldown - dt);
    slime.wobble += dt * 8;
    if (slime.stun <= 0 && !game.vehicleId) {
      const dx = target.x - slime.x;
      const dy = target.y - slime.y;
      const d = Math.hypot(dx, dy) || 1;
      const speed = 24 + Math.min(18, game.pocket * 0.25);
      moveWithCollision(slime, (dx / d) * speed * dt, (dy / d) * speed * dt);
    }

    if (
      !game.vehicleId &&
      slime.stun <= 0 &&
      slime.stealCooldown <= 0 &&
      game.player.invulnerable <= 0 &&
      distance(slime, game.player) < 16
    ) {
      const amount = Math.min(game.pocket, 2 + Math.floor(Math.random() * 7));
      slime.stealCooldown = 1.6;
      game.player.invulnerable = 1.25;
      if (amount > 0) {
        game.pocket -= amount;
        slime.stolen += amount;
        announce(`GREEN SLIME STOLE $${amount} // HIT IT BACK`, 2300);
        addFloat(`-$${amount}`, game.player.x, game.player.y - 16, "#8cff00");
      } else {
        announce("THE GREEN FOUND EMPTY POCKETS");
      }
      const dx = game.player.x - slime.x;
      const dy = game.player.y - slime.y;
      const length = Math.hypot(dx, dy) || 1;
      moveWithCollision(game.player, (dx / length) * 20, (dy / length) * 20);
    }
  }
  game.slimes = game.slimes.filter((slime) => !slime.dead);
}

function updatePickups(dt) {
  const target = controlledPosition();
  for (const pickup of game.pickups) {
    pickup.life -= dt;
    pickup.vx *= Math.pow(0.09, dt);
    pickup.vy *= Math.pow(0.09, dt);
    pickup.x += pickup.vx * dt;
    pickup.y += pickup.vy * dt;
    const d = distance(pickup, target);
    if (d < 70 && !game.vehicleId) {
      pickup.x += ((target.x - pickup.x) / Math.max(1, d)) * 72 * dt;
      pickup.y += ((target.y - pickup.y) / Math.max(1, d)) * 72 * dt;
    }
    if (d < (game.vehicleId ? 18 : 14)) {
      game.pocket += pickup.value;
      game.groove = clamp(game.groove + 3, 0, 100);
      pickup.life = -1;
      addFloat(`+$${pickup.value}`, target.x, target.y - 16, "#8cff00");
    }
  }
  game.pickups = game.pickups.filter((pickup) => pickup.life > 0);

  const boat = currentVehicle();
  if (game.mission === 1 && boat?.type === "boat") {
    for (const item of LAUNDRY_STARTS) {
      if (game.laundryIds.has(item.id) || distance(boat, item) >= 24) continue;
      game.laundryIds.add(item.id);
      addFloat(item.id.toLocaleUpperCase(), item.x, item.y - 10, item.color);
      announce(`GEAR FOUND // ${game.laundryIds.size}/3`);
      game.effects.push({ type: "flash", life: 0.35, color: item.color });
      saveGame(true);
    }
  }
}

function updateEffects(dt) {
  for (const effect of game.effects) {
    effect.life -= dt;
    if (effect.type === "ring") {
      effect.radius = lerp(effect.radius, effect.max, 1 - Math.pow(0.001, dt));
    }
    if (effect.type === "note") effect.y -= 18 * dt;
  }
  for (const float of game.floats) {
    float.life -= dt;
    float.y -= 14 * dt;
  }
  game.effects = game.effects.filter((effect) => effect.life > 0);
  game.floats = game.floats.filter((float) => float.life > 0);
}

function updateMissionState() {
  if (game.missionFinishing) return;
  if (game.mission === 1 && game.laundryIds.size >= 3) {
    completeMission();
  } else if (
    game.mission === 2 &&
    game.era === "old" &&
    distance(controlledPosition(), LANDMARKS.speakeasy) < 54
  ) {
    completeMission();
  }
}

function update(dt) {
  saveTimer = Math.max(0, saveTimer - dt);
  game.skillCooldown = Math.max(0, game.skillCooldown - dt);
  game.timeCooldown = Math.max(0, game.timeCooldown - dt);
  game.slimeTimer -= dt;
  if (game.slimeTimer <= 0) {
    spawnSlime();
    game.slimeTimer = 4.5 + Math.random() * 5.5;
  }
  if (game.vehicleId) updateVehicle(dt);
  else updatePlayer(dt);
  updateNPCs(dt);
  updateJam(dt);
  updateSlimes(dt);
  updatePickups(dt);
  updateEffects(dt);
  updateMissionState();
  audio.updateCleanFx(dt);
  saveGame(false);
}

function pixelText(text, x, y, size = 7, color = "#f1f4e8", align = "left") {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px "Courier New", monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillText(text, Math.round(x), Math.round(y));
}

function drawRoads(palette) {
  ctx.fillStyle = palette.ground;
  ctx.fillRect(0, 0, WORLD_W, WATER_Y);
  ctx.fillStyle = palette.grass;
  ctx.fillRect(0, 0, WORLD_W, 24);

  ctx.fillStyle = palette.sidewalk;
  for (const road of ROADS) {
    ctx.fillRect(road.x - 7, road.y - 7, road.w + 14, road.h + 14);
  }
  ctx.fillStyle = palette.road;
  for (const road of ROADS) ctx.fillRect(road.x, road.y, road.w, road.h);

  ctx.fillStyle = palette.roadLine;
  for (const road of ROADS) {
    if (road.w > road.h) {
      for (let x = road.x + 18; x < road.x + road.w; x += 46) {
        ctx.fillRect(x, road.y + Math.floor(road.h / 2), 24, 2);
      }
    } else {
      for (let y = road.y + 18; y < road.y + road.h; y += 46) {
        ctx.fillRect(road.x + Math.floor(road.w / 2), y, 2, 24);
      }
    }
  }

  pixelText("PRATT ST", 18, 157, 7, "#aaa68e");
  pixelText("FLEET ST", 724, 407, 7, "#aaa68e");
  pixelText("KEY HWY", 1120, 592, 7, "#aaa68e");
}

function drawWater(palette) {
  ctx.fillStyle = palette.water;
  ctx.fillRect(0, WATER_Y, WORLD_W, WORLD_H - WATER_Y);
  ctx.fillStyle = palette.waterLine;
  const offset = Math.floor(performance.now() / 180) % 28;
  for (let y = WATER_Y + 14; y < WORLD_H; y += 22) {
    for (let x = -20 + ((y / 22) % 2) * 13 + offset; x < WORLD_W; x += 56) {
      ctx.fillRect(x, y, 24, 2);
    }
  }
  for (const pier of PIERS) {
    ctx.fillStyle = "#5a4330";
    ctx.fillRect(pier.x, pier.y, pier.w, pier.h);
    ctx.fillStyle = "#846449";
    for (let x = pier.x + 3; x < pier.x + pier.w; x += 9) {
      ctx.fillRect(x, pier.y, 5, pier.h);
    }
    ctx.fillStyle = "#29251f";
    ctx.fillRect(pier.x - 3, pier.y, 3, pier.h);
    ctx.fillRect(pier.x + pier.w, pier.y, 3, pier.h);
  }
  pixelText(game.era === "old" ? "THE BASIN" : "INNER HARBOR", 38, 676, 10, palette.waterLine);
}

function drawBuilding(building, palette) {
  const old = game.era === "old";
  ctx.fillStyle = "rgba(0,0,0,.28)";
  ctx.fillRect(building.x + 7, building.y + 8, building.w, building.h);
  ctx.fillStyle = building.kind === "base" ? "#454a3e" : palette.brick;
  ctx.fillRect(building.x, building.y, building.w, building.h);
  ctx.fillStyle = palette.brick2;
  for (let y = building.y + 14; y < building.y + building.h - 10; y += 12) {
    for (let x = building.x + ((y / 12) % 2 ? 6 : 12); x < building.x + building.w; x += 25) {
      ctx.fillRect(x, y, 15, 2);
    }
  }
  ctx.fillStyle = palette.roof;
  ctx.fillRect(building.x - 3, building.y - 5, building.w + 6, 9);
  ctx.fillStyle = palette.trim;
  ctx.fillRect(building.x + 7, building.y + 8, building.w - 14, 2);

  const windows = Math.max(2, Math.floor(building.w / 48));
  for (let index = 0; index < windows; index += 1) {
    const wx = building.x + 16 + index * ((building.w - 32) / windows);
    const wy = building.y + 27;
    ctx.fillStyle = old ? "#d7a554" : "#77a4a8";
    ctx.fillRect(Math.round(wx), wy, 15, 18);
    ctx.fillStyle = palette.roof;
    ctx.fillRect(Math.round(wx + 7), wy, 2, 18);
    ctx.fillRect(Math.round(wx), wy + 8, 15, 2);
  }

  const doorX = building.x + Math.floor(building.w / 2) - 8;
  ctx.fillStyle = "#252421";
  ctx.fillRect(doorX, building.y + building.h - 23, 17, 23);
  ctx.fillStyle = "#d4c86f";
  ctx.fillRect(doorX + 12, building.y + building.h - 12, 2, 2);
  ctx.fillStyle = "rgba(3,5,4,.82)";
  ctx.fillRect(building.x + 6, building.y + building.h - 39, building.w - 12, 11);
  let label = building.label;
  if (old && building.kind === "station") label = "STEAM DEPOT";
  if (old && building.kind === "shop") label = "PHONOGRAPHS";
  if (old && building.kind === "club") label = "CLUB 23 // 1923";
  pixelText(label, building.x + building.w / 2, building.y + building.h - 37, 7, palette.trim, "center");

  if (building.kind === "base") {
    ctx.fillStyle = "#8cff00";
    ctx.fillRect(building.x + building.w / 2 - 2, building.y + building.h + 5, 5, 3);
  }
}

function drawStreetDetails() {
  for (let x = 18; x < WORLD_W; x += 122) {
    ctx.fillStyle = "#272b27";
    ctx.fillRect(x, 116, 3, 35);
    ctx.fillStyle = game.era === "old" ? "#f0c976" : "#c9dddb";
    ctx.fillRect(x - 3, 114, 9, 5);
  }
  for (let x = 80; x < WORLD_W; x += 210) {
    ctx.fillStyle = "#4b5446";
    ctx.fillRect(x, 244, 7, 8);
    ctx.fillStyle = "#263124";
    ctx.fillRect(x - 5, 248, 17, 6);
  }
  if (game.era === "now") {
    ctx.fillStyle = "#e8d21b";
    ctx.fillRect(1018, 250, 28, 10);
    pixelText("BUS", 1032, 252, 6, "#151815", "center");
  } else {
    ctx.strokeStyle = "#b8a36d";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 176);
    ctx.lineTo(WORLD_W, 176);
    ctx.stroke();
  }
}

function drawRift() {
  const rift = LANDMARKS.timeRift;
  const phase = performance.now() / 170;
  ctx.save();
  ctx.translate(rift.x, rift.y);
  ctx.strokeStyle = "#8cff00";
  ctx.lineWidth = 2;
  for (let index = 0; index < 3; index += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, 10 + index * 7 + Math.sin(phase + index) * 3, phase + index, phase + index + 4.4);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(140,255,0,.18)";
  ctx.fillRect(-25, -25, 50, 50);
  ctx.restore();
}

function drawWorld() {
  const palette = colors[game.era];
  drawRoads(palette);
  drawWater(palette);
  drawStreetDetails();
  for (const building of BUILDINGS) drawBuilding(building, palette);
  drawRift();
}

function drawVehicle(vehicle) {
  ctx.save();
  ctx.translate(Math.round(vehicle.x), Math.round(vehicle.y));
  ctx.rotate(vehicle.angle);
  if (vehicle.type === "boat") {
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.fillRect(-18, 7, 36, 5);
    ctx.fillStyle = vehicle.color;
    ctx.beginPath();
    ctx.moveTo(-20, -8);
    ctx.lineTo(18, -6);
    ctx.lineTo(24, 0);
    ctx.lineTo(16, 9);
    ctx.lineTo(-18, 9);
    ctx.fill();
    ctx.fillStyle = "#b94e38";
    ctx.fillRect(-8, -11, 16, 10);
  } else if (vehicle.type === "bike") {
    ctx.strokeStyle = "#151815";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-9, 5, 5, 0, Math.PI * 2);
    ctx.arc(9, 5, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = vehicle.color;
    ctx.fillRect(-7, -2, 14, 5);
    ctx.fillRect(3, -6, 3, 6);
  } else {
    const van = vehicle.type === "van";
    const length = van ? 32 : 27;
    ctx.fillStyle = "rgba(0,0,0,.32)";
    ctx.fillRect(-length / 2 + 2, -7, length, 17);
    ctx.fillStyle = vehicle.color;
    ctx.fillRect(-length / 2, -9, length, 16);
    ctx.fillStyle = "#7aa0a3";
    ctx.fillRect(length / 2 - 9, -7, 7, 6);
    ctx.fillStyle = "#151815";
    ctx.fillRect(-length / 2 + 4, -11, 7, 3);
    ctx.fillRect(length / 2 - 11, -11, 7, 3);
    ctx.fillRect(-length / 2 + 4, 7, 7, 3);
    ctx.fillRect(length / 2 - 11, 7, 7, 3);
    if (van) pixelText("F", -7, -5, 8, "#101310");
  }
  if (game.vehicleId === vehicle.id) {
    ctx.strokeStyle = "#8cff00";
    ctx.lineWidth = 1;
    ctx.strokeRect(-22, -15, 44, 30);
  }
  ctx.restore();
}

function drawPersonBase(x, y, shirt, skin = "#d6a879") {
  ctx.fillStyle = "rgba(0,0,0,.28)";
  ctx.fillRect(x - 7, y + 8, 14, 4);
  ctx.fillStyle = "#242726";
  ctx.fillRect(x - 6, y + 3, 4, 7);
  ctx.fillRect(x + 2, y + 3, 4, 7);
  ctx.fillStyle = shirt;
  ctx.fillRect(x - 7, y - 7, 14, 12);
  ctx.fillStyle = skin;
  ctx.fillRect(x - 5, y - 15, 10, 9);
}

function drawPlayerSprite(x, y, characterIndex) {
  const character = CHARACTERS[characterIndex];
  const bob = game.jam ? Math.round(Math.sin(game.jam.time * 18) * 2) : 0;
  y += bob;
  drawPersonBase(x, y, character.shirt);
  if (characterIndex === 0) {
    ctx.fillStyle = "#392d24";
    ctx.fillRect(x - 5, y - 17, 10, 3);
    ctx.fillRect(x - 4, y - 19, 8, 2);
    ctx.fillStyle = "#75baff";
    ctx.fillRect(x - 3, y - 12, 2, 1);
    ctx.fillRect(x + 2, y - 12, 2, 1);
    ctx.strokeStyle = "#d0aa5c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 5);
    ctx.lineTo(x + 9, y + 3);
    ctx.stroke();
    ctx.fillStyle = "#c7893e";
    ctx.fillRect(x + 5, y, 6, 6);
  } else if (characterIndex === 1) {
    ctx.fillStyle = "#171817";
    ctx.fillRect(x - 7, y - 18, 14, 6);
    ctx.fillRect(x - 7, y - 14, 3, 13);
    ctx.fillRect(x + 4, y - 14, 3, 13);
    ctx.fillRect(x - 5, y - 9, 10, 7);
    ctx.fillStyle = "#bf3f34";
    ctx.beginPath();
    ctx.arc(x, y + 1, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#eee8d8";
    ctx.fillRect(x - 1, y - 1, 2, 4);
  } else {
    ctx.fillStyle = "#32241d";
    for (const [dx, dy] of [[-6,-17],[-2,-19],[3,-19],[6,-16],[-7,-13]]) {
      ctx.fillRect(x + dx, y + dy, 4, 4);
    }
    ctx.fillStyle = "#171817";
    ctx.fillRect(x - 5, y - 13, 4, 3);
    ctx.fillRect(x + 1, y - 13, 4, 3);
    ctx.fillRect(x - 1, y - 12, 2, 1);
    ctx.fillRect(x - 5, y - 8, 10, 2);
    ctx.fillRect(x - 1, y - 6, 2, 5);
    ctx.strokeStyle = "#d0aa5c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 6);
    ctx.lineTo(x + 9, y + 4);
    ctx.stroke();
    ctx.fillStyle = "#8c532e";
    ctx.fillRect(x + 5, y, 5, 8);
  }
  if (game.player.invulnerable > 0 && Math.floor(performance.now() / 90) % 2) {
    ctx.strokeStyle = "#f1f4e8";
    ctx.strokeRect(x - 9, y - 21, 18, 32);
  }
}

function drawNPC(npc) {
  const shirts = ["#a35e47", "#426d78", "#89764b", "#5d5a7f", "#858b78", "#b0796b"];
  drawPersonBase(Math.round(npc.x), Math.round(npc.y), shirts[npc.palette]);
  ctx.fillStyle = npc.palette % 2 ? "#3b281e" : "#715132";
  ctx.fillRect(Math.round(npc.x - 5), Math.round(npc.y - 17), 10, 3);
  if (game.fanIds.has(npc.id)) pixelText("♪", npc.x, npc.y - 25, 8, "#8cff00", "center");
}

function drawSlime(slime) {
  const wobble = Math.sin(slime.wobble) * 2;
  const x = Math.round(slime.x);
  const y = Math.round(slime.y);
  ctx.fillStyle = "rgba(0,0,0,.3)";
  ctx.fillRect(x - 9, y + 6, 18, 4);
  ctx.fillStyle = slime.stun > 0 ? "#bafc77" : "#69de00";
  ctx.beginPath();
  ctx.moveTo(x - 10 - wobble, y + 7);
  ctx.lineTo(x - 7, y - 7);
  ctx.lineTo(x, y - 12 - wobble);
  ctx.lineTo(x + 8, y - 6);
  ctx.lineTo(x + 11 + wobble, y + 7);
  ctx.fill();
  ctx.fillStyle = "#091006";
  ctx.fillRect(x - 5, y - 4, 3, 3);
  ctx.fillRect(x + 3, y - 4, 3, 3);
  if (slime.stolen > 0) pixelText(`$${slime.stolen}`, x, y - 22, 7, "#8cff00", "center");
}

function drawPickups() {
  for (const item of LAUNDRY_STARTS) {
    if (game.mission !== 1 || game.laundryIds.has(item.id)) continue;
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.fillRect(item.x - 7, item.y + 5, 14, 3);
    ctx.fillStyle = item.color;
    if (item.id === "sock") {
      ctx.fillRect(item.x - 3, item.y - 7, 5, 10);
      ctx.fillRect(item.x, item.y + 1, 7, 5);
    } else if (item.id === "shirt") {
      ctx.fillRect(item.x - 6, item.y - 6, 12, 11);
      ctx.fillRect(item.x - 10, item.y - 5, 4, 6);
      ctx.fillRect(item.x + 6, item.y - 5, 4, 6);
    } else {
      ctx.fillRect(item.x - 7, item.y - 5, 14, 6);
      ctx.fillRect(item.x - 7, item.y, 5, 7);
      ctx.fillRect(item.x + 2, item.y, 5, 7);
    }
  }
  for (const pickup of game.pickups) {
    ctx.fillStyle = "#8cff00";
    ctx.fillRect(Math.round(pickup.x - 6), Math.round(pickup.y - 4), 12, 8);
    pixelText("$", pickup.x, pickup.y - 3, 7, "#071004", "center");
  }
  for (const cache of game.caches) {
    if (cache.opened) continue;
    ctx.fillStyle = "#332e25";
    ctx.fillRect(cache.x - 6, cache.y - 4, 12, 8);
    ctx.fillStyle = "#8c7f5a";
    ctx.fillRect(cache.x - 4, cache.y - 2, 8, 2);
  }
}

function drawEffects() {
  for (const effect of game.effects) {
    ctx.save();
    ctx.globalAlpha = clamp(effect.life, 0, 1);
    if (effect.type === "ring") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.type === "beam") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(effect.x, effect.y);
      ctx.lineTo(effect.x2, effect.y2);
      ctx.stroke();
      ctx.strokeStyle = "#f1f4e8";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (effect.type === "splat") {
      ctx.fillStyle = effect.color;
      for (let index = 0; index < 9; index += 1) {
        const angle = index * 2.4;
        const r = effect.radius * (1 - effect.life);
        ctx.fillRect(effect.x + Math.cos(angle) * r, effect.y + Math.sin(angle) * r, 4, 4);
      }
    } else if (effect.type === "note") {
      pixelText("♪", effect.x, effect.y, 11, effect.color, "center");
    }
    ctx.restore();
  }
  for (const float of game.floats) {
    ctx.save();
    ctx.globalAlpha = clamp(float.life, 0, 1);
    pixelText(float.text, float.x, float.y, 8, float.color, "center");
    ctx.restore();
  }
}

function drawObjectiveMarker() {
  const target = objectiveTarget();
  if (!target) return;
  const pulse = 9 + Math.sin(performance.now() / 140) * 3;
  ctx.strokeStyle = "#8cff00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(target.x, target.y, pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#8cff00";
  ctx.beginPath();
  ctx.moveTo(target.x, target.y - 18 - pulse * 0.25);
  ctx.lineTo(target.x - 4, target.y - 25 - pulse * 0.25);
  ctx.lineTo(target.x + 4, target.y - 25 - pulse * 0.25);
  ctx.fill();
}

function interactionPrompt() {
  const vehicle = currentVehicle();
  if (vehicle) {
    if (
      vehicle.type === "van" &&
      distance(vehicle, LANDMARKS.timeRift) < 72
    ) {
      return "E / USE // TIME JUMP";
    }
    if (vehicle.type === "van" && game.freeTimeTravel) {
      return "E EXIT // FX TIME JUMP";
    }
    return "E / USE // EXIT";
  }
  if (distance(game.player, LANDMARKS.baseDoor) < 38) {
    return game.pocket ? "E / USE // BANK TIPS" : "MOM'S BASEMENT // BAND HQ";
  }
  const nearbyVehicle = nearest(game.vehicles, game.player);
  if (nearbyVehicle?.distance < 34) {
    if (nearbyVehicle.item.id === "van" && !game.vanUnlocked) return "VAN NEEDS CASH";
    return `E / USE // ${nearbyVehicle.item.type.toLocaleUpperCase()}`;
  }
  return "";
}

function drawHud() {
  ctx.fillStyle = "rgba(3,5,4,.88)";
  ctx.fillRect(0, 0, VIEW_W, 35);
  ctx.fillStyle = "#8cff00";
  ctx.fillRect(0, 34, VIEW_W, 1);
  const mission = MISSIONS[Math.min(game.mission, MISSIONS.length - 1)];
  const missionLabel = game.mission >= MISSIONS.length ? "FREE ROAM" : mission.title;
  pixelText(`M${Math.min(game.mission + 1, 3)} // ${missionLabel}`, 8, 6, 8, "#f1f4e8");
  pixelText(objectiveText(), 8, 19, 7, "#8cff00");

  pixelText(`POCKET $${game.pocket}`, 325, 5, 8, "#8cff00", "right");
  pixelText(`FUND $${game.fund}`, 325, 18, 8, "#f1f4e8", "right");
  pixelText(game.era === "old" ? "1923" : "NOW", 348, 6, 9, "#8cff00");

  const character = CHARACTERS[game.character];
  pixelText(character.name, 472, 5, 8, character.accent, "right");
  pixelText(character.role, 472, 17, 7, "#f1f4e8", "right");
  ctx.fillStyle = "#313630";
  ctx.fillRect(348, 28, 124, 3);
  ctx.fillStyle = "#8cff00";
  ctx.fillRect(348, 28, Math.round(124 * (game.groove / 100)), 3);
  pixelText(game.groove >= 100 ? "TRIO READY" : "GROOVE", 346, 27, 5, "#f1f4e8", "right");

  const prompt = interactionPrompt();
  if (prompt) {
    const width = ctx.measureText(prompt).width + 12;
    ctx.fillStyle = "rgba(3,5,4,.84)";
    ctx.fillRect(VIEW_W / 2 - width / 2, 210, width, 16);
    pixelText(prompt, VIEW_W / 2, 214, 7, "#8cff00", "center");
  }

  if (game.skillCooldown > 0) {
    const amount = clamp(game.skillCooldown / 2.7, 0, 1);
    ctx.fillStyle = "rgba(3,5,4,.8)";
    ctx.fillRect(399, 40, 73, 8);
    ctx.fillStyle = character.accent;
    ctx.fillRect(401, 42, 69 * (1 - amount), 4);
  }

  const target = objectiveTarget();
  if (target) {
    const sx = target.x - camera.x;
    const sy = target.y - camera.y;
    if (sx < 12 || sx > VIEW_W - 12 || sy < 42 || sy > VIEW_H - 12) {
      const centerX = VIEW_W / 2;
      const centerY = VIEW_H / 2;
      const angle = Math.atan2(sy - centerY, sx - centerX);
      const x = clamp(centerX + Math.cos(angle) * 195, 20, VIEW_W - 20);
      const y = clamp(centerY + Math.sin(angle) * 90, 48, VIEW_H - 20);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "#8cff00";
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-4, -5);
      ctx.lineTo(-4, 5);
      ctx.fill();
      ctx.restore();
      pixelText(`${Math.round(distance(controlledPosition(), target) / 10)}M`, x, y + 7, 6, "#8cff00", "center");
    }
  }
}

function render() {
  const focus = controlledPosition();
  const desiredX = clamp(focus.x - VIEW_W / 2, 0, WORLD_W - VIEW_W);
  const desiredY = clamp(focus.y - VIEW_H / 2, 0, WORLD_H - VIEW_H);
  camera.x = lerp(camera.x, desiredX, 0.13);
  camera.y = lerp(camera.y, desiredY, 0.13);

  ctx.save();
  ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
  drawWorld();
  drawPickups();
  drawObjectiveMarker();
  for (const vehicle of game.vehicles) drawVehicle(vehicle);
  for (const npc of game.npcs) drawNPC(npc);
  for (const slime of game.slimes) drawSlime(slime);
  if (!game.vehicleId) drawPlayerSprite(Math.round(game.player.x), Math.round(game.player.y), game.character);
  drawEffects();
  ctx.restore();

  if (game.era === "old") {
    ctx.fillStyle = "rgba(117,74,28,.10)";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  if (game.started) drawHud();
  const flash = game.effects.find((effect) => effect.type === "flash");
  if (flash) {
    ctx.save();
    ctx.globalAlpha = clamp(flash.life * 0.48, 0, 0.48);
    ctx.fillStyle = flash.color;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.restore();
  }
}

function resetJoystick() {
  joystick.x = 0;
  joystick.y = 0;
  joystick.pointerId = null;
  ui.joystickKnob.style.transform = "translate(-50%, -50%)";
}

function updateJoystick(event) {
  const rect = ui.joystick.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const radius = rect.width * 0.36;
  const length = Math.hypot(dx, dy) || 1;
  const scale = Math.min(1, radius / length);
  const px = dx * scale;
  const py = dy * scale;
  joystick.x = clamp(dx / radius, -1, 1);
  joystick.y = clamp(dy / radius, -1, 1);
  const normalized = Math.hypot(joystick.x, joystick.y);
  if (normalized > 1) {
    joystick.x /= normalized;
    joystick.y /= normalized;
  }
  ui.joystickKnob.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
}

function setPaused(paused) {
  if (!game.started) return;
  game.paused = paused;
  ui.pauseScreen.hidden = !paused;
  if (paused) {
    keys.clear();
    resetJoystick();
    audio.pause();
    saveGame(true);
  } else {
    audio.resume();
  }
}

function resetPosition() {
  const vehicle = currentVehicle();
  if (vehicle) {
    const start = VEHICLE_STARTS.find((item) => item.id === vehicle.id);
    Object.assign(vehicle, start, { vx: 0, vy: 0 });
  }
  if (game.mission === 1 && vehicle?.type !== "boat") {
    const boat = game.vehicles.find((item) => item.id === "boat");
    const boatStart = VEHICLE_STARTS.find((item) => item.id === "boat");
    Object.assign(boat, boatStart, { vx: 0, vy: 0 });
  }
  game.vehicleId = null;
  const safe = game.era === "old" ? { x: 1110, y: 440 } : { x: 326, y: 208 };
  Object.assign(game.player, safe, { invulnerable: 2 });
  setPaused(false);
  announce("BACK ON THE MAP");
}

async function beginGame() {
  game.started = true;
  game.paused = false;
  ui.startScreen.hidden = true;
  ui.pauseScreen.hidden = true;
  try {
    await audio.unlock();
  } catch {
    // The Bandcamp fallback remains available without Web Audio.
  }
  playMissionTrack(true).catch(() => showBandcamp(currentTrackData()));
  if (!game.slimes.length) {
    spawnSlime();
    spawnSlime();
  }
  announce(`${MISSIONS[Math.min(game.mission, 2)]?.title || "FREE ROAM"} // GO`, 2500);
}

function bindControls() {
  window.addEventListener("keydown", (event) => {
    const controlled = [
      "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space",
      "KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyQ",
      "ShiftLeft", "ShiftRight", "Digit1", "Digit2", "Digit3", "Escape",
    ];
    if (controlled.includes(event.code)) event.preventDefault();
    keys.add(event.code);
    if (event.repeat) return;
    if (event.code === "Space") startJam();
    if (event.code === "KeyE") interact();
    if (event.code === "KeyQ") switchCharacter();
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") useAbility();
    if (event.code === "Digit1") switchCharacter(0);
    if (event.code === "Digit2") switchCharacter(1);
    if (event.code === "Digit3") switchCharacter(2);
    if (event.code === "Escape") setPaused(!game.paused);
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  window.addEventListener("blur", () => keys.clear());

  ui.joystick.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    joystick.pointerId = event.pointerId;
    ui.joystick.setPointerCapture(event.pointerId);
    updateJoystick(event);
  });
  ui.joystick.addEventListener("pointermove", (event) => {
    if (event.pointerId === joystick.pointerId) updateJoystick(event);
  });
  const releaseJoystick = (event) => {
    if (event.pointerId === joystick.pointerId) resetJoystick();
  };
  ui.joystick.addEventListener("pointerup", releaseJoystick);
  ui.joystick.addEventListener("pointercancel", releaseJoystick);

  ui.characterButtons.forEach((button, index) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      switchCharacter(index);
    });
  });
  ui.touchUse.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    interact();
  });
  ui.touchSkill.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    useAbility();
  });
  ui.touchJam.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    startJam();
  });

  ui.startButton.addEventListener("click", beginGame);
  ui.pauseButton.addEventListener("click", () => setPaused(!game.paused));
  ui.resumeButton.addEventListener("click", () => setPaused(false));
  ui.resetButton.addEventListener("click", resetPosition);
  ui.newGameButton.addEventListener("click", () => {
    if (!window.confirm("Erase this local Flangame save and start over?")) return;
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // A fresh in-memory game still works.
    }
    audio.stop();
    gameGeneration += 1;
    game = freshState();
    game.started = true;
    updateCharacterButtons();
    ui.pauseScreen.hidden = true;
    spawnSlime();
    playMissionTrack(true).catch(() => {});
    announce("NEW GAME // MAKE MONEY, DON'T WORK", 2800);
  });
  ui.musicButton.addEventListener("click", async () => {
    game.musicMuted = !game.musicMuted;
    if (game.musicMuted) {
      audio.pause();
      hideBandcamp();
      announce("MUSIC OFF");
    } else {
      await audio.unlock().catch(() => {});
      playMissionTrack(true).catch(() => showBandcamp(currentTrackData()));
      announce("FLANGUAGE STREAM ON");
    }
    updateCharacterButtons();
    saveGame(true);
  });
  ui.fxButton.addEventListener("click", () => {
    game.fxOn = !game.fxOn;
    audio.applySettings();
    updateCharacterButtons();
    announce(game.fxOn ? "LOW-BIT FX ON" : "LOW-BIT FX BYPASSED");
    saveGame(true);
  });
  ui.closeBandcamp.addEventListener("click", hideBandcamp);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && game.started && !game.paused) setPaused(true);
  });
  document.addEventListener("contextmenu", (event) => event.preventDefault());
}

function frame(now) {
  const dt = clamp((now - lastFrame) / 1000, 0, 0.033);
  lastFrame = now;
  if (game.started && !game.paused) update(dt);
  render();
  requestAnimationFrame(frame);
}

function initialize() {
  loadGame();
  updateCharacterButtons();
  bindControls();
  const hasProgress = game.mission > 0 || game.pocket > 0 || game.fund > 0 || game.fanIds.size > 0;
  if (hasProgress) ui.startButton.textContent = "RESUME";
  loadCatalog().catch(() => {});
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
  requestAnimationFrame(frame);
}

initialize();
