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
  characterSelect: document.querySelector("#character-select"),
  characterButtons: [...document.querySelectorAll("[data-character]")],
  dexButton: document.querySelector("#song-button"),
  announcement: document.querySelector("#announcement"),
  joystick: document.querySelector("#joystick"),
  joystickKnob: document.querySelector("#joystick-knob"),
  touchA: document.querySelector("#touch-a"),
  touchB: document.querySelector("#touch-b"),
  touchBand: document.querySelector("#touch-band"),
  touchJump: document.querySelector("#touch-jump"),
  touchTeleport: document.querySelector("#touch-teleport"),
  flangadex: document.querySelector("#flangadex"),
  dexClose: document.querySelector("#dex-close"),
  dexCount: document.querySelector("#dex-count"),
  dexLevel: document.querySelector("#dex-level"),
  dexProgress: document.querySelector("#dex-progress"),
  dexMeterFill: document.querySelector("#dex-meter-fill"),
  dexUnlockBanner: document.querySelector("#dex-unlock-banner"),
  dexNowPlaying: document.querySelector("#dex-now-playing"),
  dexList: document.querySelector("#dex-list"),
  dexDetail: document.querySelector("#dex-detail"),
  dexDetailNumber: document.querySelector("#dex-detail-number"),
  dexDetailTitle: document.querySelector("#dex-detail-title"),
  dexDetailAlbum: document.querySelector("#dex-detail-album"),
  dexDetailDuration: document.querySelector("#dex-detail-duration"),
  dexPlay: document.querySelector("#dex-play"),
  dexDetailBack: document.querySelector("#dex-detail-back"),
  dexNext: document.querySelector("#dex-next"),
  bandcampFallback: document.querySelector("#bandcamp-fallback"),
  bandcampFrame: document.querySelector("#bandcamp-frame"),
  closeBandcamp: document.querySelector("#close-bandcamp"),
};

const VIEW_W = 270;
const VIEW_H = 480;
const TILE = 16;
const SAVE_KEY = "flangame-save-v7";
const LEGACY_SAVE_KEYS = ["flangame-save-v6", "flangame-save-v5", "flangame-save-v4", "flangame-save-v3", "flangame-save-v2", "flangame-save-v1"];
const FIRST_TRACK_ID = 2973474876;
const TERMINAL_CATALOG = "https://flanguage.github.io/Flanguage/data/catalog.js";
const MIN_CAMERA_ZOOM = 0.24;
const MAX_CAMERA_ZOOM = 1.55;
const ROAD_WALK_RADIUS = 10.5;
const MAX_SLIMES = 9;
const WORLD_FOOD_COUNT = 120;
const MAX_ROAMING_FOODS = 18;
const ROADSIDE_TRASH_COUNT = 48;
const CITY_COLOR_CELL = 24;
const CITY_COLOR_STRIDE = 512;

const GB = {
  darkest: "#090909",
  dark: "#575757",
  light: "#bdbdb8",
  lightest: "#f5f5ef",
};

const GHOST = {
  darkest: "#526776",
  dark: "#91afc2",
  light: "#c9e1ef",
  lightest: "#eff9ff",
};

const GREEN = {
  darkest: "#063d1c",
  dark: "#0c7435",
  light: "#2dcf68",
  lightest: "#9bf2b5",
};

const GOLD = {
  darkest: "#6b4307",
  dark: "#a86e0a",
  light: "#e5ad2f",
  lightest: "#ffe4a1",
};

const PLAYER_PALETTES = [
  { darkest: "#061b45", dark: "#1453a6", light: "#3187e8", lightest: "#c9e3ff" },
  { darkest: "#200c37", dark: "#54237a", light: "#8650b5", lightest: "#e3cff4" },
  { darkest: "#05271a", dark: "#10563a", light: "#2f805b", lightest: "#ccebd9" },
];

const BAND_FEATURES = {
  skin: "#d89870",
  skinLight: "#ffd0a8",
  hair: "#5a2d18",
  hairLight: "#8b512b",
  jakeHair: "#090b0e",
  jakeHairLight: "#34383e",
  eyeBlue: "#55b9ff",
  black: "#090909",
  metal: "#e8e8e2",
};

const CHARACTERS = [
  { name: "SANTI", role: "GUITAR", ability: "BLUE RIFF" },
  { name: "NICK", role: "DRUMS", ability: "PURPLE BEAT" },
  { name: "JAKE", role: "BASS", ability: "GREEN GROOVE" },
];

const NPC_KINDS = [
  "person", "person", "person", "person", "cat", "person", "dog", "person", "pigeon",
  "person", "rat", "person", "squirrel", "person", "raccoon", "person", "rabbit", "person",
  "fox", "person", "turtle", "person", "duck", "person", "opossum", "person", "deer", "person",
  "goat", "person", "pig", "person", "chicken", "person", "frog", "person",
];

const FOOD_TYPES = [
  { kind: "apple", name: "APPLE", boost: "speed", duration: 32 },
  { kind: "carrot", name: "CARROT", boost: "power", duration: 34 },
  { kind: "broccoli", name: "BROCCOLI", boost: "power", duration: 38 },
  { kind: "tofu", name: "TOFU", boost: "tips", duration: 42 },
  { kind: "avocado", name: "AVOCADO", boost: "jump", duration: 36 },
  { kind: "berries", name: "BERRIES", boost: "speed", duration: 35 },
  { kind: "banana", name: "BANANA", boost: "jump", duration: 32 },
  { kind: "mushroom", name: "MUSHROOM", boost: "tips", duration: 38 },
  { kind: "cauliflower-pizza", name: "CAULIFLOWER PIZZA", boost: "power", duration: 48 },
  { kind: "bean-burger", name: "BEAN BURGER", boost: "speed", duration: 46 },
  { kind: "vegan-fries", name: "VEGAN FRIES", boost: "tips", duration: 40 },
  { kind: "tempeh-taco", name: "TEMPEH TACO", boost: "jump", duration: 44 },
  { kind: "vegan-donut", name: "VEGAN DONUT", boost: "speed", duration: 38 },
  { kind: "seitan-wings", name: "SEITAN WINGS", boost: "power", duration: 45 },
  { kind: "cashew-nachos", name: "CASHEW NACHOS", boost: "tips", duration: 43 },
];

const FOOD_COLORS = {
  apple: { primary: "#d93246", light: "#ff7b76", accent: "#2f8e48" },
  carrot: { primary: "#ed7626", light: "#ffc15c", accent: "#2f9147" },
  broccoli: { primary: "#23824d", light: "#65c96e", accent: "#b6dd78" },
  tofu: { primary: "#f2dfb2", light: "#fff6db", accent: "#b98c62" },
  avocado: { primary: "#267a45", light: "#9bd65e", accent: "#7a4323" },
  berries: { primary: "#7a2d91", light: "#d65b9b", accent: "#32934c" },
  banana: { primary: "#f1c928", light: "#fff07a", accent: "#855326" },
  mushroom: { primary: "#c94d42", light: "#f5d6ad", accent: "#95633e" },
  "cauliflower-pizza": { primary: "#e7ad32", light: "#ffe39b", accent: "#d84434" },
  "bean-burger": { primary: "#9a572f", light: "#e4ae62", accent: "#3f984e" },
  "vegan-fries": { primary: "#d84238", light: "#ffd34e", accent: "#ef852d" },
  "tempeh-taco": { primary: "#e6ae35", light: "#ffe17a", accent: "#3b994d" },
  "vegan-donut": { primary: "#dc6595", light: "#ffacd0", accent: "#9a5b35" },
  "seitan-wings": { primary: "#c65b2b", light: "#f7a34f", accent: "#74391f" },
  "cashew-nachos": { primary: "#e4b42e", light: "#ffe16b", accent: "#4c9b4d" },
};

const SPAWN = { x: 4405, y: 3665 };
const HARBOR = [
  [4300, 5400], [4520, 5250], [4780, 5370], [5170, 5420], [5570, 5300],
  [6130, 5280], [6740, 5740], [6880, 6500], [4300, 6500],
];

const BUILDINGS = [
  { x: 4348, y: 3565, w: 114, h: 74, label: "MOM'S BASEMENT", kind: "hq" },
  { x: 4470, y: 3614, w: 84, h: 66, label: "FUNKY CAT PIZZA", kind: "pizza" },
  { x: 4548, y: 4772, w: 112, h: 66, label: "BANK", kind: "bank" },
  { x: 5498, y: 5175, w: 120, h: 66, label: "CLUB 23", kind: "club" },
  { x: 6342, y: 5364, w: 126, h: 66, label: "CLAMP YARD", kind: "garage" },
  { x: 5378, y: 5150, w: 112, h: 66, label: "SPAGHETTI ROADHOUSE", kind: "roadhouse" },
  { x: 4760, y: 4090, w: 108, h: 66, label: "PORCELAIN PICASSO", kind: "gallery" },
  { x: 5160, y: 4510, w: 104, h: 62, label: "THE BIG BOLOGNA", kind: "deli" },
  { x: 3620, y: 2580, w: 116, h: 68, label: "MT WANNAHOCKALOOGIE", kind: "lookout" },
  { x: 4273, y: 3604, w: 36, h: 40, label: "GRAFFITI ALLEY", kind: "alley" },
  { x: 4371, y: 3750, w: 100, h: 60, label: "CHARLES THEATRE", kind: "theatre" },
  { x: 4355, y: 3832, w: 140, h: 80, label: "PENN STATION", kind: "station" },
  { x: 4430, y: 4417, w: 38, h: 72, label: "WASHINGTON MONUMENT", kind: "monument" },
  { x: 4208, y: 4989, w: 38, h: 82, label: "BROMO TOWER", kind: "tower" },
  { x: 4178, y: 5207, w: 132, h: 82, label: "CAMDEN YARDS", kind: "ballpark" },
  { x: 4724, y: 5067, w: 108, h: 58, label: "NATIONAL AQUARIUM", kind: "aquarium" },
  { x: 5841, y: 4794, w: 62, h: 58, label: "PATTERSON PAGODA", kind: "pagoda" },
  { x: 5288, y: 5260, w: 138, h: 68, label: "DOMINO SUGAR", kind: "factory" },
];

const LANDMARKS = {
  hqDoor: { x: 4405, y: 3641 },
  bankDoor: { x: 4605, y: 4840 },
  timeRift: { x: 6013, y: 4767 },
  speakeasy: { x: 5558, y: 5252 },
};

const VEHICLE_STARTS = [
  { id: "car", type: "car", x: 4448, y: 3666, facing: 2 },
  { id: "bike", type: "bike", x: 4605, y: 4868, facing: 1 },
  { id: "boat", type: "boat", x: 4760, y: 5660, facing: 2 },
  { id: "van", type: "van", x: 4210, y: 5321, facing: 2 },
];

const SEWERS = [
  { id: "north", x: 4450, y: 3710 },
  { id: "downtown", x: 4620, y: 4920 },
  { id: "fells", x: 5565, y: 5290 },
  { id: "canton", x: 6400, y: 5460 },
  { id: "west", x: 3200, y: 3150 },
  { id: "hampden", x: 3780, y: 2430 },
  { id: "east", x: 6650, y: 4350 },
  { id: "federal", x: 4550, y: 5700 },
];

const NEIGHBORHOODS = [
  { x: 4405, y: 3500, name: "STATION NORTH" },
  { x: 4605, y: 4720, name: "DOWNTOWN" },
  { x: 5558, y: 5100, name: "FELLS POINT" },
  { x: 6406, y: 5300, name: "CANTON" },
  { x: 3756, y: 2340, name: "HAMPDEN" },
  { x: 3181, y: 3040, name: "DRUID HILL" },
];

const TERRAIN_ZONES = [
  { x: 2760, y: 2620, w: 850, h: 760, type: "park", label: "DRUID HILL PARK" },
  { x: 3440, y: 2180, w: 620, h: 610, type: "hill", label: "HAMPDEN HILLS" },
  { x: 5590, y: 4540, w: 610, h: 560, type: "park", label: "PATTERSON PARK" },
  { x: 4100, y: 4970, w: 2200, h: 440, type: "waterfront", label: "HARBOR PROMENADE" },
  { x: 6040, y: 4930, w: 760, h: 720, type: "industrial", label: "PORT DISTRICT" },
];

const ROWHOUSE_BLOCKS = [
  { x: 4200, y: 3735, count: 6, direction: "east" },
  { x: 4560, y: 3910, count: 7, direction: "south" },
  { x: 5000, y: 4720, count: 8, direction: "east" },
  { x: 5650, y: 4780, count: 7, direction: "south" },
  { x: 6060, y: 5030, count: 8, direction: "east" },
  { x: 3710, y: 2920, count: 6, direction: "south" },
];

const TRASH_SPOTS = [
  { id: "hq-can", type: "can", x: 4400, y: 3698, songChance: 0.4, foodKind: "apple" },
  { id: "hq-dumpster", type: "dumpster", x: 4308, y: 3666, songChance: 1, recordCount: 2 },
  { id: "roadhouse-can", type: "can", x: 5358, y: 5190, songChance: 0.34, foodKind: "cauliflower-pizza" },
  { id: "gallery-dumpster", type: "dumpster", x: 4740, y: 4144, songChance: 1, recordCount: 1 },
  { id: "monument-can", type: "can", x: 4488, y: 4455, songChance: 0.3, foodKind: "berries" },
  { id: "bromo-dumpster", type: "dumpster", x: 4188, y: 5040, songChance: 0.55 },
  { id: "camden-dumpster", type: "dumpster", x: 4150, y: 5260, songChance: 1, recordCount: 3 },
  { id: "harbor-can", type: "can", x: 4850, y: 5100, songChance: 0.32, foodKind: "banana" },
  { id: "bologna-can", type: "can", x: 5280, y: 4554, songChance: 0.36, foodKind: "bean-burger" },
  { id: "club-dumpster", type: "dumpster", x: 5475, y: 5222, songChance: 1, recordCount: 1 },
  { id: "pagoda-can", type: "can", x: 5920, y: 4825, songChance: 0.3, foodKind: "tofu" },
  { id: "factory-dumpster", type: "dumpster", x: 5270, y: 5305, songChance: 1, recordCount: 2 },
  { id: "clamp-dumpster", type: "dumpster", x: 6320, y: 5410, songChance: 1, recordCount: 2 },
  { id: "hampden-can", type: "can", x: 3768, y: 2505, songChance: 0.36, foodKind: "vegan-donut" },
  { id: "druid-can", type: "can", x: 3190, y: 3090, songChance: 0.32, foodKind: "broccoli" },
  { id: "penn-dumpster", type: "dumpster", x: 4518, y: 3876, songChance: 1, recordCount: 1 },
  { id: "charles-can", type: "can", x: 4350, y: 3788, songChance: 0.38 },
  { id: "aquarium-dumpster", type: "dumpster", x: 4846, y: 5124, songChance: 1, recordCount: 2 },
  { id: "pizza-can", type: "can", x: 4560, y: 3662, songChance: 1, recordCount: 1, foodKind: "cauliflower-pizza", foodCount: 2 },
  { id: "fells-can", type: "can", x: 5620, y: 5205, songChance: 0.4 },
  { id: "fells-dumpster", type: "dumpster", x: 5710, y: 5310, songChance: 0.68 },
  { id: "canton-can", type: "can", x: 6460, y: 5350, songChance: 0.42 },
  { id: "canton-dumpster", type: "dumpster", x: 6540, y: 5460, songChance: 1, recordCount: 2 },
  { id: "patterson-can", type: "can", x: 5795, y: 4880, songChance: 0.38 },
  { id: "federal-can", type: "can", x: 4520, y: 5650, songChance: 0.4 },
  { id: "federal-dumpster", type: "dumpster", x: 4660, y: 5730, songChance: 0.7 },
  { id: "druid-dumpster", type: "dumpster", x: 3320, y: 3200, songChance: 1, recordCount: 2 },
  { id: "hampden-dumpster", type: "dumpster", x: 3850, y: 2460, songChance: 0.72 },
  { id: "west-can", type: "can", x: 3520, y: 4040, songChance: 0.36 },
  { id: "east-can", type: "can", x: 6660, y: 4360, songChance: 0.36 },
  { id: "port-dumpster", type: "dumpster", x: 6210, y: 5580, songChance: 1, recordCount: 3 },
  { id: "waterfront-can", type: "can", x: 5200, y: 5375, songChance: 0.4 },
];

const BASE_TRASH_COUNT = TRASH_SPOTS.length;

const FONT = {
  " ": [0, 0, 0, 0, 0], "!": [0, 0, 95, 0, 0], "#": [20, 127, 20, 127, 20],
  "$": [36, 42, 127, 42, 18], "%": [35, 19, 8, 100, 98], "&": [54, 73, 85, 34, 80],
  "'": [0, 5, 3, 0, 0], "(": [0, 28, 34, 65, 0], ")": [0, 65, 34, 28, 0],
  "+": [8, 8, 62, 8, 8], ",": [0, 80, 48, 0, 0], "-": [8, 8, 8, 8, 8],
  ".": [0, 96, 96, 0, 0], "/": [32, 16, 8, 4, 2], ":": [0, 54, 54, 0, 0],
  "~": [0, 96, 96, 127, 3],
  "?": [2, 1, 81, 9, 6], "@": [62, 65, 93, 89, 78],
  "0": [62, 81, 73, 69, 62], "1": [0, 66, 127, 64, 0], "2": [66, 97, 81, 73, 70],
  "3": [33, 65, 69, 75, 49], "4": [24, 20, 18, 127, 16], "5": [39, 69, 69, 69, 57],
  "6": [60, 74, 73, 73, 48], "7": [1, 113, 9, 5, 3], "8": [54, 73, 73, 73, 54],
  "9": [6, 73, 73, 41, 30],
  A: [126, 17, 17, 17, 126], B: [127, 73, 73, 73, 54], C: [62, 65, 65, 65, 34],
  D: [127, 65, 65, 34, 28], E: [127, 73, 73, 73, 65], F: [127, 9, 9, 9, 1],
  G: [62, 65, 73, 73, 122], H: [127, 8, 8, 8, 127], I: [0, 65, 127, 65, 0],
  J: [32, 64, 65, 63, 1], K: [127, 8, 20, 34, 65], L: [127, 64, 64, 64, 64],
  M: [127, 2, 12, 2, 127], N: [127, 4, 8, 16, 127], O: [62, 65, 65, 65, 62],
  P: [127, 9, 9, 9, 6], Q: [62, 65, 81, 33, 94], R: [127, 9, 25, 41, 70],
  S: [70, 73, 73, 73, 49], T: [1, 1, 127, 1, 1], U: [63, 64, 64, 64, 63],
  V: [31, 32, 64, 32, 31], W: [127, 32, 24, 32, 127], X: [99, 20, 8, 20, 99],
  Y: [3, 4, 120, 4, 3], Z: [97, 81, 73, 69, 67],
};

let streetMap = {
  width: 8464,
  height: 10240,
  chunkSize: 256,
  roads: [],
  chunks: {},
  buildings: [],
  buildingChunks: {},
  parks: [],
  parkChunks: {},
};
let dexTracks = [];
let dexById = new Map();
let audioById = new Map();
let mapReady = false;
let dexReady = false;
let remoteCatalogPromise = null;
let announcementTimer = 0;
let saveTimer = 0;
let lastFrame = performance.now();
let dexReturnToPause = false;
let dexDetailId = null;

const keys = new Set();
const joystickInput = { x: 0, y: 0, pointerId: null, pointerType: "" };
const mapPointers = new Map();
const camera = { x: SPAWN.x - VIEW_W / 2, y: SPAWN.y - VIEW_H / 2, zoom: 1 };
let pinchStart = null;
let roadSampler = [];
let roadSamplerLength = 0;
let roamingFoodSerial = 0;

function freshState() {
  return {
    started: false,
    paused: false,
    dexOpen: false,
    era: "now",
    character: 0,
    characterChosen: false,
    pocket: 0,
    fund: 0,
    careerCash: 0,
    groove: 0,
    paidCount: 0,
    catalogUnlockedCount: 1,
    catalogCashOffset: 0,
    loadedSaveVersion: 7,
    learnedTrackIds: new Set([FIRST_TRACK_ID]),
    foundTrackIds: new Set(),
    newTrackIds: new Set(),
    trashSearchedIds: new Set(),
    collectedPickupIds: new Set(),
    coloredCityCells: new Map(),
    worldSeed: Math.floor(Date.now() % 2147483647),
    selectedTrackId: FIRST_TRACK_ID,
    musicMuted: false,
    player: {
      x: SPAWN.x,
      y: SPAWN.y,
      facing: 0,
      aimX: 0,
      aimY: 1,
      step: 0,
      invulnerable: 0,
      stuckTime: 0,
    },
    vehicleId: null,
    vehicles: VEHICLE_STARTS.map((vehicle) => ({ ...vehicle })),
    npcs: Array.from({ length: 36 }, (_, index) => ({
      id: `audience-${index}`,
      phase: index * 0.73,
      kind: NPC_KINDS[index % NPC_KINDS.length],
      variant: index % 8,
      x: SPAWN.x + ((index % 6) - 2.5) * 38,
      y: SPAWN.y + (Math.floor(index / 6) - 1.5) * 42,
      facing: index % 4,
      moveTimer: Math.random() * 2,
      payCooldown: 0,
      trapped: 0,
      fleeTimer: 0,
      slowTimer: 0,
      redistribute: false,
      vx: 0,
      vy: 0,
    })),
    slimes: [],
    bills: [],
    cashPiles: [],
    foodPickups: [],
    foodSpawnTimer: 3 + Math.random() * 5,
    foodBoosts: { speed: 0, power: 0, tips: 0, jump: 0 },
    foodBoostLabel: "",
    slimeBoostTimer: 0,
    slimeStacks: 0,
    effects: [],
    floats: [],
    jam: null,
    riffPose: null,
    timeCooldown: 0,
    teleportCooldown: 0,
    jump: null,
    slimeTimer: 3 + Math.random() * 5,
    levelFlash: 0,
    crowdLayoutLevel: 0,
  };
}

let game = freshState();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(left, right) {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function pointInRect(x, y, rect, padding = 0) {
  return x >= rect.x - padding && x <= rect.x + rect.w + padding &&
    y >= rect.y - padding && y <= rect.y + rect.h + padding;
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let current = 0, previous = points.length - 1; current < points.length; previous = current, current += 1) {
    const [cx, cy] = points[current];
    const [px, py] = points[previous];
    if ((cy > y) !== (py > y) && x < ((px - cx) * (y - cy)) / (py - cy) + cx) inside = !inside;
  }
  return inside;
}

function inWater(x, y) {
  return pointInPolygon(x, y, HARBOR);
}

function inBuilding(x, y, padding = 5) {
  return BUILDINGS.some((building) => pointInRect(x, y, building, padding));
}

function inDumpster(x, y, padding = 2) {
  return TRASH_SPOTS.some((prop) => (
    prop.type === "dumpster" &&
    x >= prop.x - 12 - padding && x <= prop.x + 12 + padding &&
    y >= prop.y - 8 - padding && y <= prop.y + 9 + padding
  ));
}

function isWalkable(x, y) {
  return x > 10 && y > 10 && x < streetMap.width - 10 && y < streetMap.height - 10 &&
    !inWater(x, y) && !inBuilding(x, y, 5) && !inDumpster(x, y, 2);
}

function pointSegmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const amount = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(px - (ax + dx * amount), py - (ay + dy * amount));
}

function nearbyRoadIds(x, y, radius = 1) {
  const ids = new Set();
  const cx = Math.floor(x / streetMap.chunkSize);
  const cy = Math.floor(y / streetMap.chunkSize);
  for (let oy = -radius; oy <= radius; oy += 1) {
    for (let ox = -radius; ox <= radius; ox += 1) {
      for (const id of streetMap.chunks[`${cx + ox},${cy + oy}`] || []) ids.add(id);
    }
  }
  return ids;
}

function roadDistance(x, y, drivableOnly = true) {
  let best = Infinity;
  for (const id of nearbyRoadIds(x, y)) {
    const road = streetMap.roads[id];
    if (!road || (drivableOnly && road[0] === 0)) continue;
    if (x < road[1] - 18 || x > road[3] + 18 || y < road[2] - 18 || y > road[4] + 18) continue;
    for (let index = 5; index < road.length - 2; index += 2) {
      best = Math.min(best, pointSegmentDistance(x, y, road[index], road[index + 1], road[index + 2], road[index + 3]));
      if (best < 2) return best;
    }
  }
  return best;
}

function worldViewWidth() {
  return VIEW_W / camera.zoom;
}

function worldViewHeight() {
  return VIEW_H / camera.zoom;
}

function nearbyFeatureIds(chunks, x, y, radius = 0) {
  const ids = new Set();
  const cx = Math.floor(x / streetMap.chunkSize);
  const cy = Math.floor(y / streetMap.chunkSize);
  for (let oy = -radius; oy <= radius; oy += 1) {
    for (let ox = -radius; ox <= radius; ox += 1) {
      for (const id of chunks?.[`${cx + ox},${cy + oy}`] || []) ids.add(id);
    }
  }
  return ids;
}

const decodedBuildingChunks = new Map();
const decodedParks = new Map();

function pointInRing(x, y, ring) {
  let inside = false;
  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current, current += 1) {
    const [cx, cy] = ring[current];
    const [px, py] = ring[previous];
    if ((cy > y) !== (py > y) && x < ((px - cx) * (y - cy)) / (py - cy) + cx) inside = !inside;
  }
  return inside;
}

function decodeBuildingChunk(key) {
  if (decodedBuildingChunks.has(key)) return decodedBuildingChunks.get(key);
  const stream = streetMap.buildingChunks?.[key] || [];
  const [chunkX, chunkY] = key.split(",").map(Number);
  const originX = chunkX * streetMap.chunkSize;
  const originY = chunkY * streetMap.chunkSize;
  const features = [];
  let cursor = 0;
  while (cursor < stream.length) {
    const ringCount = stream[cursor++];
    const rings = [];
    for (let ringIndex = 0; ringIndex < ringCount; ringIndex += 1) {
      const length = stream[cursor++];
      if (length < 3) {
        cursor += Math.max(0, length * 2);
        continue;
      }
      let px = originX + stream[cursor++];
      let py = originY + stream[cursor++];
      const ring = [[px, py]];
      for (let pointIndex = 1; pointIndex < length; pointIndex += 1) {
        px += stream[cursor++];
        py += stream[cursor++];
        ring.push([px, py]);
      }
      rings.push(ring);
    }
    if (rings.length) features.push(rings);
  }
  decodedBuildingChunks.set(key, features);
  if (decodedBuildingChunks.size > 96) {
    const oldest = decodedBuildingChunks.keys().next().value;
    decodedBuildingChunks.delete(oldest);
  }
  return features;
}

function decodePark(id) {
  if (decodedParks.has(id)) return decodedParks.get(id);
  const park = streetMap.parks?.[id];
  if (!park) return [];
  const rings = [];
  let cursor = 6;
  for (let ringIndex = 0; ringIndex < park[5]; ringIndex += 1) {
    const length = park[cursor++];
    if (length < 3) {
      cursor += Math.max(0, length * 2);
      continue;
    }
    let px = park[cursor++];
    let py = park[cursor++];
    const ring = [[px, py]];
    for (let pointIndex = 1; pointIndex < length; pointIndex += 1) {
      px += park[cursor++];
      py += park[cursor++];
      ring.push([px, py]);
    }
    rings.push(ring);
  }
  decodedParks.set(id, rings);
  return rings;
}

function inMappedBuilding(x, y) {
  const key = `${Math.floor(x / streetMap.chunkSize)},${Math.floor(y / streetMap.chunkSize)}`;
  for (const rings of decodeBuildingChunk(key)) {
    let inside = false;
    for (const ring of rings) if (pointInRing(x, y, ring)) inside = !inside;
    if (inside) return true;
  }
  return false;
}

function inMappedPark(x, y) {
  for (const id of nearbyFeatureIds(streetMap.parkChunks, x, y)) {
    const park = streetMap.parks[id];
    if (!park || x < park[1] || x > park[3] || y < park[2] || y > park[4]) continue;
    let inside = false;
    for (const ring of decodePark(id)) if (pointInRing(x, y, ring)) inside = !inside;
    if (inside) return true;
  }
  return false;
}

function inWalkableOpenSpace(x, y) {
  if (streetMap.parks?.length) return inMappedPark(x, y) && !inMappedBuilding(x, y);
  return TERRAIN_ZONES.some((zone) => (
    (zone.type === "park" || zone.type === "hill") && pointInRect(x, y, zone)
  ));
}

function isTraversalPosition(x, y) {
  if (!isWalkable(x, y)) return false;
  if (roadDistance(x, y, false) <= ROAD_WALK_RADIUS) return true;
  return inWalkableOpenSpace(x, y);
}

function closestRoadPoint(x, y, drivableOnly = false, chunkRadius = 2) {
  let best = null;
  for (const id of nearbyRoadIds(x, y, chunkRadius)) {
    const road = streetMap.roads[id];
    if (!road || (drivableOnly && road[0] === 0)) continue;
    for (let index = 5; index < road.length - 2; index += 2) {
      const ax = road[index];
      const ay = road[index + 1];
      const bx = road[index + 2];
      const by = road[index + 3];
      const dx = bx - ax;
      const dy = by - ay;
      const amount = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
      const px = ax + dx * amount;
      const py = ay + dy * amount;
      const candidateDistance = Math.hypot(x - px, y - py);
      if (!best || candidateDistance < best.distance) {
        best = { x: px, y: py, distance: candidateDistance, type: road[0] };
      }
    }
  }
  return best;
}

function rebuildRoadSampler() {
  roadSampler = [];
  roadSamplerLength = 0;
  streetMap.roads.forEach((road, roadId) => {
    for (let index = 5; index < road.length - 2; index += 2) {
      const length = Math.hypot(road[index + 2] - road[index], road[index + 3] - road[index + 1]);
      if (length < 1) continue;
      roadSamplerLength += length;
      roadSampler.push([roadSamplerLength, roadId, index]);
    }
  });
}

function randomRoadPlacement(random = Math.random) {
  if (!roadSampler.length || !roadSamplerLength) return null;
  const target = random() * roadSamplerLength;
  let low = 0;
  let high = roadSampler.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (roadSampler[middle][0] < target) low = middle + 1;
    else high = middle;
  }
  const [, roadId, index] = roadSampler[low];
  const road = streetMap.roads[roadId];
  const amount = random();
  const dx = road[index + 2] - road[index];
  const dy = road[index + 3] - road[index + 1];
  return {
    x: road[index] + dx * amount,
    y: road[index + 1] + dy * amount,
    dx,
    dy,
  };
}

function randomRoadPoint(random = Math.random) {
  const placement = randomRoadPlacement(random);
  return placement ? { x: placement.x, y: placement.y } : null;
}

function seededRandom(seed) {
  let value = (Number(seed) || 1) >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function generateRoadsideTrash() {
  TRASH_SPOTS.splice(BASE_TRASH_COUNT);
  if (!roadSampler.length) return;
  const random = seededRandom(game.worldSeed ^ 0x4f4f5a45);
  for (let index = 0; index < ROADSIDE_TRASH_COUNT; index += 1) {
    for (let attempt = 0; attempt < 220; attempt += 1) {
      const placement = randomRoadPlacement(random);
      if (!placement) break;
      const length = Math.hypot(placement.dx, placement.dy) || 1;
      const type = index % 3 === 0 ? "dumpster" : "can";
      const offset = type === "dumpster" ? 22 : 15;
      const side = random() < 0.5 ? -1 : 1;
      const x = placement.x - placement.dy / length * offset * side;
      const y = placement.y + placement.dx / length * offset * side;
      const candidate = { x, y };
      if (x < 30 || y < 30 || x > streetMap.width - 30 || y > streetMap.height - 30) continue;
      if (inWater(x, y) || inBuilding(x, y, 8) || inMappedBuilding(x, y)) continue;
      if (distance(candidate, LANDMARKS.hqDoor) < 85) continue;
      if (TRASH_SPOTS.some((prop) => distance(candidate, prop) < 58)) continue;
      const food = FOOD_TYPES[Math.floor(random() * FOOD_TYPES.length)];
      const prop = {
        id: `roadside-${index}`,
        type,
        x,
        y,
        songChance: 0,
      };
      if (index % 6 === 0) prop.recordCount = 2;
      else if (index % 3 === 0) prop.recordCount = 1;
      if (index % 6 !== 0) {
        prop.foodKind = food.kind;
        prop.foodCount = index % 7 === 0 ? 2 : 1;
      }
      TRASH_SPOTS.push(prop);
      break;
    }
  }
}

function isVehiclePositionValid(vehicle, x, y) {
  if (vehicle.type === "boat") return inWater(x, y);
  return !inWater(x, y) && !inBuilding(x, y, 8) && roadDistance(x, y, true) <= (vehicle.type === "bike" ? 10 : 13);
}

function currentVehicle() {
  return game.vehicles.find((vehicle) => vehicle.id === game.vehicleId) || null;
}

function controlledPosition() {
  return currentVehicle() || game.player;
}

function nearest(items, origin, predicate = () => true) {
  let found = null;
  let best = Infinity;
  for (const item of items) {
    if (!predicate(item)) continue;
    const itemDistance = distance(item, origin);
    if (itemDistance < best) {
      found = item;
      best = itemDistance;
    }
  }
  return found ? { item: found, distance: best } : null;
}

function ascii(value) {
  return String(value || "")
    .replaceAll("♪", "~")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "?")
    .toUpperCase();
}

function bitmapText(text, x, y, scale = 1, color = GB.darkest, align = "left", maxChars = Infinity) {
  const output = ascii(text).slice(0, maxChars);
  const width = Math.max(0, output.length * 6 * scale - scale);
  let startX = x;
  if (align === "center") startX -= Math.floor(width / 2);
  if (align === "right") startX -= width;
  ctx.fillStyle = color;
  for (let charIndex = 0; charIndex < output.length; charIndex += 1) {
    const columns = FONT[output[charIndex]] || FONT["?"];
    for (let column = 0; column < columns.length; column += 1) {
      for (let row = 0; row < 7; row += 1) {
        if (columns[column] & (1 << row)) {
          ctx.fillRect(startX + (charIndex * 6 + column) * scale, y + row * scale, scale, scale);
        }
      }
    }
  }
  return width;
}

function marqueeBitmapText(text, x, y, width, scale = 1, color = GB.darkest) {
  const output = ascii(text);
  const fullWidth = Math.max(0, output.length * 6 * scale - scale);
  let offset = 0;
  if (fullWidth > width) {
    const travel = fullWidth - width;
    const phase = performance.now() / 1000 % 12;
    if (phase < 2) offset = 0;
    else if (phase < 6) offset = travel * (phase - 2) / 4;
    else if (phase < 8) offset = travel;
    else offset = travel * (1 - (phase - 8) / 4);
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y - 1, width, 9 * scale);
  ctx.clip();
  bitmapText(output, x - Math.round(offset), y, scale, color);
  ctx.restore();
  return fullWidth;
}

function drawMusicNote(x, y, scale = 1, color = GB.darkest, flip = false) {
  const px = Math.round(x);
  const py = Math.round(y);
  ctx.save();
  ctx.translate(px, py);
  if (flip) ctx.scale(-1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(-3 * scale, 3 * scale, 5 * scale, 4 * scale);
  ctx.fillRect(scale, -7 * scale, 2 * scale, 11 * scale);
  ctx.fillRect(2 * scale, -7 * scale, 5 * scale, 2 * scale);
  ctx.fillRect(5 * scale, -5 * scale, 2 * scale, 3 * scale);
  ctx.restore();
}

function announce(message, duration = 2600) {
  ui.announcement.textContent = message;
  ui.announcement.classList.add("show");
  clearTimeout(announcementTimer);
  announcementTimer = setTimeout(() => ui.announcement.classList.remove("show"), duration);
}

function addFloat(text, x, y, color = GB.darkest) {
  game.floats.push({ text, x, y, color, life: 1.2 });
}

function legacyLevelCash(level) {
  const n = Math.max(0, level - 1);
  return 2 * n * n + 23 * n;
}

function legacyLevelFromCash(cash) {
  if (!dexTracks.length) return 1;
  const maxLevel = 1 + Math.ceil((dexTracks.length - 1) / 5);
  let level = 1;
  while (level < maxLevel && cash >= legacyLevelCash(level + 1)) level += 1;
  return level;
}

function baseSongCash(index) {
  const songIndex = Math.max(0, Math.floor(index));
  return songIndex === 0 ? 0 : 75 * songIndex + 2 * songIndex * (songIndex - 1);
}

function songCash(index) {
  if (index <= 0) return 0;
  return Math.max(0, Math.round(baseSongCash(index) + game.catalogCashOffset));
}

function levelFromCash() {
  if (!dexTracks.length) return 1;
  const maxLevel = 1 + Math.ceil((dexTracks.length - 1) / 5);
  return Math.min(maxLevel, 1 + Math.floor((Math.max(1, game.catalogUnlockedCount) - 1) / 5));
}

function playerSpeedForLevel(level = levelFromCash()) {
  const foodSpeed = game.foodBoosts.speed > 0 ? 1.3 : 1;
  const slimeSpeed = 1 + Math.max(0, slimeMultiplier() - 1) * 0.28;
  return (76 + Math.min(64, Math.max(0, level - 1) * 1.55)) * foodSpeed * slimeSpeed;
}

function slimeMultiplier() {
  return game.slimeBoostTimer > 0 ? 1 + 0.5 * game.slimeStacks : 1;
}

function abilityMultiplier() {
  return slimeMultiplier() * (game.foodBoosts.power > 0 ? 1.35 : 1);
}

function moneyMultiplier() {
  return slimeMultiplier() * (game.foodBoosts.tips > 0 ? 1.5 : 1);
}

function unlockLevelSongs(silent = false) {
  if (!dexTracks.length) return [];
  const beforeLevel = levelFromCash();
  const beforeCount = game.catalogUnlockedCount;
  while (
    game.catalogUnlockedCount < dexTracks.length &&
    game.careerCash >= songCash(game.catalogUnlockedCount)
  ) {
    game.catalogUnlockedCount += 1;
  }
  const learned = [];
  for (const track of dexTracks.slice(beforeCount, game.catalogUnlockedCount)) {
    if (game.learnedTrackIds.has(track.id)) continue;
    game.learnedTrackIds.add(track.id);
    game.newTrackIds.add(track.id);
    learned.push(track);
  }
  game.learnedTrackIds.add(FIRST_TRACK_ID);
  if (!silent && (learned.length || game.catalogUnlockedCount > beforeCount)) {
    const level = levelFromCash();
    const leveledUp = level > beforeLevel;
    game.levelFlash = 1.25;
    const first = learned[0];
    const firstTitle = first
      ? `#${String(dexTracks.indexOf(first) + 1).padStart(3, "0")} ${first.title}`
      : "CATALOG COST CLEARED";
    const next = game.catalogUnlockedCount < dexTracks.length
      ? ` // NEXT SONG $${songCash(game.catalogUnlockedCount)}`
      : " // FLANGADEX COMPLETE";
    announce(
      `${leveledUp ? `LEVEL ${String(level).padStart(2, "0")} // RUN SPEED UP // ` : ""}NEW SONG EARNED // ${firstTitle}${learned.length > 1 ? ` +${learned.length - 1} MORE` : ""}${next} // OPEN SONG`,
      5200,
    );
    renderDex();
  }
  return learned;
}

function earnMoney(amount) {
  const earned = Math.max(0, Math.floor(amount * moneyMultiplier()));
  if (!earned) return;
  const before = levelFromCash();
  game.pocket += earned;
  game.careerCash += earned;
  const focus = controlledPosition();
  addFloat(`+$${earned}`, focus.x, focus.y - 22, GREEN.dark);
  unlockLevelSongs(false);
  const after = levelFromCash();
  if (after > before) game.npcs.forEach((npc) => { npc.redistribute = true; });
  saveGame(true);
}

function normalizeProgress() {
  if (!dexTracks.length) return;
  const validIds = new Set(dexTracks.map((track) => track.id));
  const validLearned = new Set([...game.learnedTrackIds].filter((id) => validIds.has(id)));
  game.foundTrackIds = new Set([...game.foundTrackIds].filter((id) => validIds.has(id)));
  if (game.loadedSaveVersion < 5) {
    const legacyLevel = legacyLevelFromCash(game.careerCash);
    let legacyCount = Math.min(dexTracks.length, 1 + 5 * Math.max(0, legacyLevel - 1));
    while (legacyCount < dexTracks.length && validLearned.has(dexTracks[legacyCount].id)) legacyCount += 1;
    game.catalogUnlockedCount = Math.max(1, legacyCount);
    game.catalogCashOffset = game.careerCash - baseSongCash(game.catalogUnlockedCount - 1);
    game.loadedSaveVersion = 5;
  }
  game.catalogUnlockedCount = clamp(
    Math.floor(Number(game.catalogUnlockedCount) || 1),
    1,
    dexTracks.length,
  );
  game.catalogCashOffset = Math.round(Number(game.catalogCashOffset) || 0);
  while (
    game.catalogUnlockedCount < dexTracks.length &&
    game.careerCash >= songCash(game.catalogUnlockedCount)
  ) {
    game.catalogUnlockedCount += 1;
  }
  const catalogIds = dexTracks.slice(0, game.catalogUnlockedCount).map((track) => track.id);
  const unlockedIds = new Set([...validLearned, ...catalogIds, ...game.foundTrackIds, FIRST_TRACK_ID]);
  game.learnedTrackIds = unlockedIds;
  game.newTrackIds = new Set([...game.newTrackIds].filter((id) => unlockedIds.has(id)));
  unlockLevelSongs(true);
  if (!game.learnedTrackIds.has(game.selectedTrackId)) game.selectedTrackId = FIRST_TRACK_ID;
}

function saveGame(force = false) {
  if (!force && saveTimer > 0) return;
  saveTimer = 1;
  const focus = controlledPosition();
  const data = {
    version: 7,
    era: game.era,
    character: game.character,
    characterChosen: game.characterChosen,
    pocket: game.pocket,
    fund: game.fund,
    careerCash: game.careerCash,
    groove: game.groove,
    paidCount: game.paidCount,
    catalogUnlockedCount: game.catalogUnlockedCount,
    catalogCashOffset: game.catalogCashOffset,
    learnedTrackIds: [...game.learnedTrackIds],
    foundTrackIds: [...game.foundTrackIds],
    newTrackIds: [...game.newTrackIds],
    trashSearchedIds: [...game.trashSearchedIds],
    collectedPickupIds: [...game.collectedPickupIds],
    coloredCityCells: [...game.coloredCityCells],
    worldSeed: game.worldSeed,
    selectedTrackId: game.selectedTrackId,
    musicMuted: game.musicMuted,
    player: {
      x: focus.x,
      y: focus.y,
      facing: game.player.facing,
      aimX: game.player.aimX,
      aimY: game.player.aimY,
    },
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // The game remains playable if local storage is unavailable.
  }
}

function loadGame() {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (!data) {
      for (const key of LEGACY_SAVE_KEYS) {
        data = JSON.parse(localStorage.getItem(key) || "null");
        if (data) break;
      }
    }
  } catch {
    data = null;
  }
  if (!data) return;
  game.loadedSaveVersion = Math.max(1, Math.floor(Number(data.version) || 1));
  game.era = data.era === "old" ? "old" : "now";
  game.character = clamp(Number(data.character) || 0, 0, 2);
  game.characterChosen = game.loadedSaveVersion >= 6 ? Boolean(data.characterChosen) : true;
  game.pocket = Math.max(0, Math.floor(Number(data.pocket) || 0));
  game.fund = Math.max(0, Math.floor(Number(data.fund) || 0));
  game.careerCash = Math.max(
    game.pocket + game.fund,
    Math.floor(Number(data.careerCash) || 0),
  );
  game.groove = clamp(Number(data.groove) || 0, 0, 100);
  game.paidCount = Math.max(
    0,
    Math.floor(Number(data.paidCount) || (Array.isArray(data.fanIds) ? data.fanIds.length : 0)),
  );
  game.catalogUnlockedCount = Math.max(1, Math.floor(Number(data.catalogUnlockedCount) || 1));
  game.catalogCashOffset = Math.round(Number(data.catalogCashOffset) || 0);
  game.learnedTrackIds = new Set(
    Array.isArray(data.learnedTrackIds) ? data.learnedTrackIds.map(Number) : [FIRST_TRACK_ID],
  );
  game.foundTrackIds = new Set(
    Array.isArray(data.foundTrackIds) ? data.foundTrackIds.map(Number) : [],
  );
  game.newTrackIds = new Set(Array.isArray(data.newTrackIds) ? data.newTrackIds.map(Number) : []);
  game.trashSearchedIds = new Set(
    Array.isArray(data.trashSearchedIds) ? data.trashSearchedIds.map(String) : [],
  );
  game.collectedPickupIds = new Set(
    Array.isArray(data.collectedPickupIds) ? data.collectedPickupIds.map(String) : [],
  );
  game.coloredCityCells = new Map(
    (Array.isArray(data.coloredCityCells) ? data.coloredCityCells : [])
      .filter((entry) => (
        Array.isArray(entry) && entry.length === 2 &&
        Number.isInteger(Number(entry[0])) && Number(entry[0]) >= 0 &&
        Number.isInteger(Number(entry[1])) && Number(entry[1]) >= 0 && Number(entry[1]) < PLAYER_PALETTES.length
      ))
      .map(([key, character]) => [Number(key), Number(character)]),
  );
  game.worldSeed = Math.max(1, Math.floor(Number(data.worldSeed) || game.worldSeed));
  game.selectedTrackId = Number(data.selectedTrackId) || FIRST_TRACK_ID;
  game.musicMuted = Boolean(data.musicMuted);
  const x = Number(data.player?.x);
  const y = Number(data.player?.y);
  if (Number.isFinite(x) && Number.isFinite(y) && isWalkable(x, y)) {
    game.player.x = clamp(x, 12, streetMap.width - 12);
    game.player.y = clamp(y, 12, streetMap.height - 12);
    game.player.facing = clamp(Number(data.player?.facing) || 0, 0, 3);
    const fallbackAim = [[0, 1], [-1, 0], [1, 0], [0, -1]][game.player.facing];
    const aimX = Number(data.player?.aimX);
    const aimY = Number(data.player?.aimY);
    const aimLength = Math.hypot(aimX, aimY);
    game.player.aimX = Number.isFinite(aimLength) && aimLength > 0 ? aimX / aimLength : fallbackAim[0];
    game.player.aimY = Number.isFinite(aimLength) && aimLength > 0 ? aimY / aimLength : fallbackAim[1];
  }
}

function parseCatalogSource(source) {
  const prefix = "window.FLANGUAGE_CATALOG = ";
  const start = source.indexOf(prefix);
  if (start < 0) throw new Error("Invalid Terminal catalog");
  return JSON.parse(source.slice(start + prefix.length).trim().replace(/;\s*$/, ""));
}

async function loadRemoteCatalog(force = false) {
  if (remoteCatalogPromise && !force) return remoteCatalogPromise;
  remoteCatalogPromise = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`${TERMINAL_CATALOG}?flangame=${Date.now().toString(36)}`, {
        cache: "no-store",
        mode: "cors",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Terminal ${response.status}`);
      const catalog = parseCatalogSource(await response.text());
      audioById = new Map();
      for (const album of catalog.albums || []) {
        for (const track of album.tracks || []) {
          const audio = track.audio || track.streamingUrl || track.streamUrl || track.file?.["mp3-128"] || null;
          if (audio) audioById.set(Number(track.id), audio);
        }
      }
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  })();
  return remoteCatalogPromise;
}

async function loadData() {
  const [mapResult, dexResult] = await Promise.allSettled([
    fetch("./baltimore-streets.json").then((response) => {
      if (!response.ok) throw new Error("Street map unavailable");
      return response.json();
    }),
    fetch("./flangadex.json").then((response) => {
      if (!response.ok) throw new Error("Flangadex unavailable");
      return response.json();
    }),
  ]);
  if (mapResult.status === "fulfilled") {
    streetMap = {
      buildings: [],
      buildingChunks: {},
      parks: [],
      parkChunks: {},
      ...mapResult.value,
    };
  }
  decodedBuildingChunks.clear();
  decodedParks.clear();
  rebuildRoadSampler();
  generateRoadsideTrash();
  mapReady = true;
  if (dexResult.status === "fulfilled") dexTracks = dexResult.value.tracks || [];
  if (!dexTracks.length) {
    dexTracks = [{
      id: FIRST_TRACK_ID,
      title: "Adugari",
      album: "Fungalage",
      year: 2019,
      duration: 433.178,
      url: "https://flanguage.bandcamp.com/track/adugari",
    }];
  }
  dexById = new Map(dexTracks.map((track) => [Number(track.id), track]));
  dexReady = true;
  normalizeProgress();
  ensurePlayerOnTraversal();
  generateWorldPickups();
  arrangeNpcCrowds(controlledPosition());
  renderDex();
  const linked = streetMap.roads.length ? "48,000+ CITY STREETS" : "CITY GRID FALLBACK";
  ui.startStatus.textContent = `${linked} // ${dexTracks.length} SONGS // #001 ADUGARI`;
  ui.startButton.disabled = false;
  ui.startButton.textContent = hasProgress() ? "RESUME" : "START";
  loadRemoteCatalog().catch(() => {});
}

const music = {
  element: null,
  token: 0,

  stop() {
    this.token += 1;
    if (this.element) {
      this.element.__stopped = true;
      this.element.pause();
      this.element.removeAttribute("src");
      this.element.load();
    }
    this.element = null;
  },

  pause() {
    this.element?.pause();
    hideBandcamp();
  },

  resume() {
    if (game.musicMuted) return;
    if (this.element) this.element.play().catch(() => showBandcamp());
    else this.playSelected().catch(() => showBandcamp());
  },

  async playSelected(allowRefresh = true) {
    const track = dexById.get(game.selectedTrackId) || dexTracks[0];
    if (!track || game.musicMuted || !game.started) return;
    const token = ++this.token;
    if (this.element) {
      this.element.__stopped = true;
      this.element.pause();
    }
    this.element = null;
    hideBandcamp();
    let url = audioById.get(Number(track.id));
    if (!url && allowRefresh) {
      await loadRemoteCatalog(true);
      if (token !== this.token) return;
      url = audioById.get(Number(track.id));
    }
    if (!url) {
      showBandcamp(track);
      return;
    }
    const element = new Audio(url);
    element.preload = "auto";
    element.playsInline = true;
    element.loop = true;
    element.volume = 0.76;
    element.playbackRate = 1;
    this.element = element;
    element.addEventListener("error", async () => {
      if (element.__stopped || element !== this.element) return;
      if (allowRefresh) {
        await this.playSelected(false);
      } else {
        this.stop();
        showBandcamp(track);
      }
    });
    try {
      await element.play();
    } catch {
      if (element.__stopped || element !== this.element) return;
      showBandcamp(track);
    }
  },
};

function showBandcamp(track = dexById.get(game.selectedTrackId) || dexTracks[0]) {
  if (!track?.id || game.musicMuted) return;
  ui.bandcampFrame.src = [
    "https://bandcamp.com/EmbeddedPlayer",
    `track=${track.id}`,
    "size=small",
    "bgcol=f5f5ef",
    "linkcol=090909",
    "tracklist=false",
    "artwork=none",
    "transparent=true",
    "",
  ].join("/");
  ui.bandcampFallback.hidden = false;
  announce("DIRECT STREAM UNAVAILABLE. TAP PLAY ON THE BANDCAMP PLAYER.", 3400);
}

function hideBandcamp() {
  ui.bandcampFallback.hidden = true;
  ui.bandcampFrame.removeAttribute("src");
}

function formatDuration(seconds) {
  const amount = Math.max(0, Math.round(Number(seconds) || 0));
  return `${String(Math.floor(amount / 60)).padStart(2, "0")}:${String(amount % 60).padStart(2, "0")}`;
}

function renderDex() {
  if (!dexTracks.length) return;
  const level = levelFromCash();
  const learnedCount = dexTracks.filter((track) => game.learnedTrackIds.has(track.id)).length;
  const complete = game.catalogUnlockedCount >= dexTracks.length;
  const nextCash = complete ? game.careerCash : songCash(game.catalogUnlockedCount);
  const currentCash = game.catalogUnlockedCount > 1
    ? songCash(game.catalogUnlockedCount - 1)
    : 0;
  const span = Math.max(1, nextCash - currentCash);
  const progress = complete ? 1 : clamp((game.careerCash - currentCash) / span, 0, 1);
  const current = dexById.get(game.selectedTrackId) || dexTracks[0];
  ui.dexCount.textContent = `${String(learnedCount).padStart(3, "0")} / ${dexTracks.length}`;
  ui.dexLevel.textContent = `LV.${String(level).padStart(2, "0")}`;
  ui.dexProgress.textContent = complete ? "COMPLETE" : `$${game.careerCash} / $${nextCash}`;
  ui.dexMeterFill.style.width = `${Math.round(progress * 100)}%`;
  ui.dexNowPlaying.textContent = `♪ #${String(dexTracks.indexOf(current) + 1).padStart(3, "0")} ${current.title}`;
  const newCount = game.newTrackIds.size;
  ui.dexUnlockBanner.hidden = newCount === 0;
  ui.dexUnlockBanner.textContent = newCount === 1
    ? "1 NEW SONG UNLOCKED!"
    : `${newCount} NEW SONGS UNLOCKED!`;
  ui.dexButton.classList.toggle("has-new", newCount > 0);
  ui.dexNext.textContent = newCount > 0
    ? `${newCount} NEW ${newCount === 1 ? "SONG" : "SONGS"} BOXED ABOVE · OPEN TO MARK SEEN`
    : complete
      ? `FLANGADEX COMPLETE · ${dexTracks.length}/${dexTracks.length}`
      : `NEXT SONG #${String(game.catalogUnlockedCount + 1).padStart(3, "0")} AT $${nextCash}`;

  const fragment = document.createDocumentFragment();
  dexTracks.forEach((track, index) => {
    const learned = game.learnedTrackIds.has(track.id);
    const isNew = game.newTrackIds.has(track.id);
    const isFound = game.foundTrackIds.has(track.id);
    const unlockCash = songCash(index);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dex-row${learned ? "" : " locked"}${isFound ? " found" : ""}${isNew ? " new" : ""}${track.id === game.selectedTrackId ? " current" : ""}`;
    button.dataset.trackId = track.id;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(track.id === game.selectedTrackId));
    button.setAttribute(
      "aria-label",
      learned
        ? `Song ${index + 1}, ${track.title}, ${track.album}${isFound ? ", found in Baltimore" : ""}${isNew ? ", newly unlocked" : ""}`
        : `Song ${index + 1}, locked until career cash ${unlockCash} dollars`,
    );
    const mark = isNew ? "NEW" : track.id === game.selectedTrackId ? ">" : isFound ? "FND" : learned ? "♪" : "X";
    button.innerHTML = `
      <span class="number">#${String(index + 1).padStart(3, "0")}</span>
      <span class="song"><strong>${learned ? escapeHtml(track.title) : "?????"}</strong><small>${learned ? `${isFound ? "FOUND IN BALTIMORE · " : ""}${escapeHtml(track.album)}` : `UNLOCKS AT $${unlockCash}`}</small></span>
      <span class="mark">${mark}</span>
    `;
    fragment.append(button);
  });
  ui.dexList.replaceChildren(fragment);
  if (dexDetailId) showDexDetail(dexDetailId, false);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showDexDetail(trackId, markSeen = true) {
  const track = dexById.get(Number(trackId));
  if (!track || !game.learnedTrackIds.has(track.id)) return;
  dexDetailId = track.id;
  if (markSeen) game.newTrackIds.delete(track.id);
  const index = dexTracks.indexOf(track);
  ui.dexDetailNumber.textContent = `#${String(index + 1).padStart(3, "0")}`;
  ui.dexDetailTitle.textContent = track.title;
  ui.dexDetailAlbum.textContent = `${track.album}${track.year ? ` · ${track.year}` : ""}`;
  ui.dexDetailDuration.textContent = formatDuration(track.duration);
  ui.dexPlay.textContent = track.id === game.selectedTrackId ? "PLAYING NOW" : "PLAY THIS SONG";
  ui.dexList.hidden = true;
  ui.dexDetail.hidden = false;
  saveGame(true);
}

function hideDexDetail() {
  dexDetailId = null;
  ui.dexDetail.hidden = true;
  ui.dexList.hidden = false;
  renderDex();
}

function openDex(fromPause = false) {
  if (!dexReady) {
    announce("FLANGADEX IS STILL LOADING.");
    return;
  }
  dexReturnToPause = Boolean(fromPause || (game.started && game.paused));
  resetJoystick();
  mapPointers.clear();
  pinchStart = null;
  game.dexOpen = true;
  if (game.started) game.paused = true;
  ui.pauseScreen.hidden = true;
  ui.flangadex.hidden = false;
  hideDexDetail();
  renderDex();
  requestAnimationFrame(() => {
    (ui.dexList.querySelector(".new") || ui.dexList.querySelector(".current"))
      ?.scrollIntoView({ block: "center" });
  });
}

function closeDex() {
  game.dexOpen = false;
  ui.flangadex.hidden = true;
  hideDexDetail();
  if (!game.started) return;
  game.paused = dexReturnToPause;
  ui.pauseScreen.hidden = !dexReturnToPause;
  dexReturnToPause = false;
}

function toggleMusic() {
  game.musicMuted = !game.musicMuted;
  if (game.musicMuted) {
    music.pause();
    announce("MUSIC OFF");
  } else {
    music.resume();
    announce("FLANGUAGE MUSIC ON");
  }
  saveGame(true);
}

function updateCharacterButtons() {
  ui.touchBand.textContent = "BAND";
  ui.touchBand.setAttribute("aria-label", `Switch band member. Current: ${CHARACTERS[game.character].name}`);
}

function switchCharacter(index = (game.character + 1) % CHARACTERS.length) {
  if (!game.started || game.paused || game.dexOpen) return;
  game.character = clamp(Number(index), 0, CHARACTERS.length - 1);
  updateCharacterButtons();
  saveGame();
}

function resetJoystick() {
  const pointerId = joystickInput.pointerId;
  joystickInput.pointerId = null;
  joystickInput.x = 0;
  joystickInput.y = 0;
  joystickInput.pointerType = "";
  if (pointerId !== null && ui.joystick?.hasPointerCapture?.(pointerId)) {
    try { ui.joystick.releasePointerCapture(pointerId); } catch { /* Capture already ended. */ }
  }
  ui.joystick?.classList.remove("active");
  if (ui.joystickKnob) ui.joystickKnob.style.transform = "translate(-50%, -50%)";
}

function updateJoystickPosition(clientX, clientY) {
  const track = document.querySelector("#joystick-track");
  if (!track) return;
  const rect = track.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const radius = Math.max(20, rect.width * 0.38);
  let x = (clientX - centerX) / radius;
  let y = (clientY - centerY) / radius;
  const length = Math.hypot(x, y);
  if (length > 1) {
    x /= length;
    y /= length;
  }
  const magnitude = Math.min(1, length);
  if (magnitude < 0.12) {
    x = 0;
    y = 0;
  }
  joystickInput.x = x;
  joystickInput.y = y;
  const knobRadius = Math.max(16, rect.width * 0.29);
  ui.joystickKnob.style.transform = `translate(calc(-50% + ${x * knobRadius}px), calc(-50% + ${y * knobRadius}px))`;
}

function movementInput() {
  let x = 0;
  let y = 0;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) x -= 1;
  if (keys.has("ArrowRight") || keys.has("KeyD")) x += 1;
  if (keys.has("ArrowUp") || keys.has("KeyW")) y -= 1;
  if (keys.has("ArrowDown") || keys.has("KeyS")) y += 1;
  const keyboardLength = Math.hypot(x, y);
  if (keyboardLength > 0) {
    x /= keyboardLength;
    y /= keyboardLength;
  }
  x += joystickInput.x;
  y += joystickInput.y;
  const length = Math.hypot(x, y);
  if (length > 1) return { x: x / length, y: y / length };
  return { x, y };
}

function facingFromVector(x, y, fallback = 0) {
  if (Math.abs(x) > Math.abs(y)) return x < 0 ? 1 : 2;
  if (Math.abs(y) > Math.abs(x)) return y < 0 ? 3 : 0;
  if (x && (fallback === 1 || fallback === 2)) return x < 0 ? 1 : 2;
  if (y) return y < 0 ? 3 : 0;
  return fallback;
}

function movePlayer(input, dt) {
  if (!input.x && !input.y) {
    game.player.stuckTime = 0;
    return;
  }
  const player = game.player;
  player.facing = facingFromVector(input.x, input.y, player.facing);
  player.aimX = input.x;
  player.aimY = input.y;
  player.step += dt * 10;
  const speed = playerSpeedForLevel();
  const moved = moveFootActor(player, input.x, input.y, speed * dt);
  player.stuckTime = moved ? 0 : player.stuckTime + dt;
  if (player.stuckTime < 0.3) return;
  const target = {
    x: player.x + input.x * 18,
    y: player.y + input.y * 18,
  };
  const snapped = closestRoadPoint(target.x, target.y, false, 1);
  if (
    snapped && snapped.distance <= ROAD_WALK_RADIUS + 8 &&
    distance(player, snapped) <= 27 && isTraversalPosition(snapped.x, snapped.y)
  ) {
    player.x = snapped.x;
    player.y = snapped.y;
    player.stuckTime = 0;
  }
}

function moveFootActor(actor, vx, vy, amount) {
  const magnitude = Math.min(1, Math.hypot(vx, vy));
  if (!magnitude || amount <= 0) return false;
  const dx = vx / magnitude;
  const dy = vy / magnitude;
  const totalStep = amount * magnitude;
  const substeps = Math.max(1, Math.ceil(totalStep / 2.4));
  const step = totalStep / substeps;
  const desiredAngle = Math.atan2(dy, dx);
  const turns = [
    0, Math.PI / 12, -Math.PI / 12, Math.PI / 6, -Math.PI / 6,
    Math.PI / 4, -Math.PI / 4, Math.PI / 3, -Math.PI / 3,
    Math.PI / 2, -Math.PI / 2,
  ];
  let moved = false;
  for (let substep = 0; substep < substeps; substep += 1) {
    let placed = false;
    for (const scale of [1, 0.72, 0.46, 0.25]) {
      for (const turn of turns) {
        const angle = desiredAngle + turn;
        const candidateX = actor.x + Math.cos(angle) * step * scale;
        const candidateY = actor.y + Math.sin(angle) * step * scale;
        if (!isTraversalPosition(candidateX, candidateY)) continue;
        actor.x = candidateX;
        actor.y = candidateY;
        placed = true;
        moved = true;
        break;
      }
      if (placed) break;
    }
    if (!placed) break;
  }
  return moved;
}

function ensurePlayerOnTraversal() {
  if (isTraversalPosition(game.player.x, game.player.y)) return;
  const snapped = closestRoadPoint(game.player.x, game.player.y, false, 4);
  if (snapped && isTraversalPosition(snapped.x, snapped.y)) {
    game.player.x = snapped.x;
    game.player.y = snapped.y;
    return;
  }
  Object.assign(game.player, SPAWN);
}

function playerAim() {
  const input = movementInput();
  let x = input.x || game.player.aimX;
  let y = input.y || game.player.aimY;
  if (!x && !y) [x, y] = [[0, 1], [-1, 0], [1, 0], [0, -1]][game.player.facing];
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function findJumpLanding(dx, dy) {
  const foodRange = game.foodBoosts.jump > 0 ? 1.35 : 1;
  const maxRange = Math.min(240, 112 * abilityMultiplier() * foodRange);
  const minimumRange = 54;
  const sideX = -dy;
  const sideY = dx;
  for (let range = maxRange; range >= minimumRange; range -= 6) {
    for (const offset of [0, 8, -8, 16, -16, 24, -24]) {
      const x = game.player.x + dx * range + sideX * offset;
      const y = game.player.y + dy * range + sideY * offset;
      if (!isTraversalPosition(x, y)) continue;
      return { x, y };
    }
  }
  return null;
}

function jumpPlayer() {
  if (
    !game.started || game.paused || game.dexOpen || game.jam || game.vehicleId || game.jump
  ) return;
  const aim = playerAim();
  const landing = findJumpLanding(aim.x, aim.y);
  if (!landing) {
    announce("NO ROAD OR PARK IN JUMP RANGE.", 1800);
    return;
  }
  game.player.aimX = aim.x;
  game.player.aimY = aim.y;
  game.player.facing = facingFromVector(aim.x, aim.y, game.player.facing);
  game.jump = {
    fromX: game.player.x,
    fromY: game.player.y,
    toX: landing.x,
    toY: landing.y,
    time: 0,
    duration: 0.38,
    height: 0,
  };
  game.effects.push({ type: "jumpDust", x: game.player.x, y: game.player.y, life: 0.55, maxLife: 0.55 });
}

function updateJump(dt) {
  if (!game.jump) return;
  game.jump.time += dt;
  const amount = clamp(game.jump.time / game.jump.duration, 0, 1);
  const eased = amount < 0.5 ? 2 * amount * amount : 1 - ((-2 * amount + 2) ** 2) / 2;
  game.player.x = game.jump.fromX + (game.jump.toX - game.jump.fromX) * eased;
  game.player.y = game.jump.fromY + (game.jump.toY - game.jump.fromY) * eased;
  game.jump.height = Math.sin(amount * Math.PI) * 30;
  if (amount < 1) return;
  const landing = { x: game.jump.toX, y: game.jump.toY };
  game.jump = null;
  Object.assign(game.player, landing);
  game.effects.push({ type: "jumpDust", x: game.player.x, y: game.player.y, life: 0.55, maxLife: 0.55 });
}

function teleportRandom() {
  if (!game.started || game.paused || game.dexOpen || game.teleportCooldown > 0) return;
  const origin = controlledPosition();
  let destination = null;
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const candidate = randomRoadPoint();
    if (!candidate || distance(candidate, origin) < 420 || !isTraversalPosition(candidate.x, candidate.y)) continue;
    destination = candidate;
    break;
  }
  if (!destination) {
    announce("TELEPORT COULD NOT FIND A CLEAR ROAD.", 1900);
    return;
  }
  game.vehicleId = null;
  game.jam = null;
  game.riffPose = null;
  game.jump = null;
  Object.assign(game.player, destination, { invulnerable: 1.5 });
  game.teleportCooldown = 8;
  resetJoystick();
  arrangeNpcCrowds(game.player);
  game.effects.push({ type: "teleport", x: game.player.x, y: game.player.y, life: 0.9, maxLife: 0.9 });
  const neighborhood = nearest(NEIGHBORHOODS, game.player)?.item?.name || "RANDOM BALTIMORE ROAD";
  announce(`TELEPORT // ${neighborhood} // PINCH MAP TO ZOOM`, 2600);
  saveGame(true);
}

function moveVehicle(vehicle, input, dt) {
  if (!input.x && !input.y) return;
  vehicle.facing = facingFromVector(input.x, input.y, vehicle.facing);
  const speeds = { car: 205, bike: 245, van: 185, boat: 150 };
  const speed = speeds[vehicle.type];
  const nextX = vehicle.x + input.x * speed * dt;
  const nextY = vehicle.y + input.y * speed * dt;
  if (isVehiclePositionValid(vehicle, nextX, vehicle.y)) vehicle.x = nextX;
  if (isVehiclePositionValid(vehicle, vehicle.x, nextY)) vehicle.y = nextY;
  game.player.x = vehicle.x;
  game.player.y = vehicle.y;
  game.player.facing = vehicle.facing;
}

function interactionPrompt() {
  const vehicle = currentVehicle();
  if (vehicle) {
    if (vehicle.type === "van" && distance(vehicle, LANDMARKS.timeRift) < 48) return "JAM: TIME JUMP";
    return "JAM: EXIT";
  }
  if (distance(game.player, LANDMARKS.hqDoor) < 34) {
    return game.pocket ? "JAM: BANK TIPS" : "MOM'S BASEMENT";
  }
  const nearbyTrash = nearest(TRASH_SPOTS, game.player);
  if (nearbyTrash?.distance < (nearbyTrash.item.type === "dumpster" ? 32 : 25)) {
    if (!game.trashSearchedIds.has(nearbyTrash.item.id)) {
      return `JAM: SEARCH ${nearbyTrash.item.type.toUpperCase()}`;
    }
  }
  const nearbyVehicle = nearest(game.vehicles, game.player);
  if (nearbyVehicle?.distance < 30) {
    return `JAM: RIDE ${nearbyVehicle.item.type.toUpperCase()}`;
  }
  if (distance(game.player, LANDMARKS.timeRift) < 40) return "THE RIFT NEEDS THE VAN";
  return "";
}

function interact() {
  if (!game.started || game.paused || game.dexOpen) return;
  const vehicle = currentVehicle();
  if (vehicle) {
    if (vehicle.type === "van" && distance(vehicle, LANDMARKS.timeRift) < 50) {
      timeJump();
      return;
    }
    const offsets = [[0, 22], [22, 0], [-22, 0], [0, -22]];
    const exit = offsets
      .map(([x, y]) => ({ x: vehicle.x + x, y: vehicle.y + y }))
      .find((point) => isTraversalPosition(point.x, point.y));
    if (!exit) {
      announce("NO ROOM TO EXIT HERE.");
      return;
    }
    game.vehicleId = null;
    Object.assign(game.player, exit, { invulnerable: 1.2 });
    announce(`EXITED ${vehicle.type.toUpperCase()}`);
    return;
  }
  if (distance(game.player, LANDMARKS.hqDoor) < 34) {
    if (!game.pocket) {
      announce("MOM'S BASEMENT // BAND HQ");
      return;
    }
    const deposited = game.pocket;
    game.pocket = 0;
    game.fund += deposited;
    addFloat("BANKED", game.player.x, game.player.y - 22, GREEN.dark);
    saveGame(true);
    return;
  }
  const nearbyTrash = nearest(TRASH_SPOTS, game.player);
  if (nearbyTrash?.distance < (nearbyTrash.item.type === "dumpster" ? 32 : 25)) {
    searchTrash(nearbyTrash.item);
    return;
  }
  const nearbyVehicle = nearest(game.vehicles, game.player);
  if (nearbyVehicle?.distance < 30) {
    const vehicleToEnter = nearbyVehicle.item;
    game.vehicleId = vehicleToEnter.id;
    game.player.x = vehicleToEnter.x;
    game.player.y = vehicleToEnter.y;
    announce(`${vehicleToEnter.type.toUpperCase()} // MOVE WITH THE JOYSTICK`);
  }
}

function touchPrimaryAction() {
  if (interactionPrompt()) interact();
  else startJam();
}

function paintCityCell(cellX, cellY, character) {
  const maxX = Math.ceil(streetMap.width / CITY_COLOR_CELL);
  const maxY = Math.ceil(streetMap.height / CITY_COLOR_CELL);
  if (cellX < 0 || cellY < 0 || cellX >= maxX || cellY >= maxY) return;
  game.coloredCityCells.set(
    cellY * CITY_COLOR_STRIDE + cellX,
    clamp(Math.floor(character), 0, PLAYER_PALETTES.length - 1),
  );
}

function paintJamCity(x, y, radius, character, trio) {
  const minX = Math.floor((x - radius) / CITY_COLOR_CELL);
  const maxX = Math.floor((x + radius) / CITY_COLOR_CELL);
  const minY = Math.floor((y - radius) / CITY_COLOR_CELL);
  const maxY = Math.floor((y + radius) / CITY_COLOR_CELL);
  for (let cellY = minY; cellY <= maxY; cellY += 1) {
    for (let cellX = minX; cellX <= maxX; cellX += 1) {
      const centerX = (cellX + 0.5) * CITY_COLOR_CELL;
      const centerY = (cellY + 0.5) * CITY_COLOR_CELL;
      if (Math.hypot(centerX - x, centerY - y) > radius + CITY_COLOR_CELL * 0.7) continue;
      paintCityCell(cellX, cellY, trio ? (cellX + cellY) % PLAYER_PALETTES.length : character);
    }
  }
}

function paintRiffCity(x, y, dx, dy, range, character) {
  const padding = range + CITY_COLOR_CELL;
  const minX = Math.floor((x - padding) / CITY_COLOR_CELL);
  const maxX = Math.floor((x + padding) / CITY_COLOR_CELL);
  const minY = Math.floor((y - padding) / CITY_COLOR_CELL);
  const maxY = Math.floor((y + padding) / CITY_COLOR_CELL);
  for (let cellY = minY; cellY <= maxY; cellY += 1) {
    for (let cellX = minX; cellX <= maxX; cellX += 1) {
      const centerX = (cellX + 0.5) * CITY_COLOR_CELL;
      const centerY = (cellY + 0.5) * CITY_COLOR_CELL;
      const offsetX = centerX - x;
      const offsetY = centerY - y;
      const along = offsetX * dx + offsetY * dy;
      const side = Math.abs(offsetX * dy - offsetY * dx);
      if (along < -CITY_COLOR_CELL * 0.5 || along > range + CITY_COLOR_CELL * 0.5) continue;
      if (side > 16 + Math.max(0, along) * 0.18 + CITY_COLOR_CELL * 0.5) continue;
      paintCityCell(cellX, cellY, character);
    }
  }
}

function startJam() {
  if (!game.started || game.paused || game.dexOpen || game.jam || game.vehicleId) return;
  const trio = game.groove >= 100;
  const multiplier = abilityMultiplier();
  const duration = (trio ? 1.55 : 1.18) * Math.min(1.8, multiplier);
  const radius = Math.min(185, (trio ? 98 : 74) * multiplier);
  const captureChance = clamp((trio ? 0.82 : 0.48) + (multiplier - 1) * 0.13, 0, 0.96);
  const candidates = game.npcs
    .filter((npc) => distance(game.player, npc) <= radius && npc.payCooldown <= 0)
    .sort((left, right) => distance(game.player, left) - distance(game.player, right))
    .slice(0, Math.min(12, Math.round((trio ? 7 : 4) * Math.sqrt(multiplier))));
  const trappedIds = [];
  for (const npc of candidates) {
    const closeness = 1 - clamp(distance(game.player, npc) / radius, 0, 1);
    if (Math.random() <= captureChance + closeness * 0.22) {
      npc.trapped = duration + 0.25;
      npc.vx = 0;
      npc.vy = 0;
      trappedIds.push(npc.id);
    } else {
      npc.fleeTimer = 2.5;
    }
  }
  game.jam = { time: 0, duration, trio, trappedIds, radius, character: game.character };
  game.groove = trio ? 0 : clamp(game.groove + 20, 0, 100);
  paintJamCity(game.player.x, game.player.y, radius, game.character, trio);
  game.effects.push({ type: "burst", x: game.player.x, y: game.player.y, life: 0.8, maxLife: 0.8 });
  for (const slime of game.slimes) {
    if (distance(game.player, slime) <= radius + 28) slime.dance = Math.max(slime.dance, duration + 1.4);
  }
  saveGame(true);
}

function finishJam() {
  const trapped = game.npcs.filter((npc) => game.jam?.trappedIds.includes(npc.id));
  trapped.forEach((npc, index) => {
    const amount = 4 + Math.floor(Math.random() * 7) + (game.jam.trio ? 5 : 0);
    dropBill(npc, amount, index, trapped.length);
    npc.trapped = 0;
    npc.payCooldown = 18 + Math.random() * 18;
    npc.fleeTimer = 4;
    game.paidCount += 1;
    addFloat("PAID!", npc.x, npc.y - 22, GREEN.dark);
  });
  game.jam = null;
  saveGame();
}

function stringHash(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function searchTrash(prop) {
  if (game.trashSearchedIds.has(prop.id)) {
    addFloat("SEARCHED", prop.x, prop.y - 18, GB.darkest);
    return;
  }
  game.trashSearchedIds.add(prop.id);
  const locked = dexTracks
    .filter((track) => !game.learnedTrackIds.has(track.id))
    .slice(0, 30);
  const roll = (stringHash(`${prop.id}:${game.careerCash}`) % 1000) / 1000;
  const recordCount = Math.min(
    locked.length,
    prop.recordCount || (roll < prop.songChance ? 1 : 0),
  );
  const found = [];
  const pool = [...locked];
  for (let index = 0; index < recordCount; index += 1) {
    const pick = stringHash(`${prop.id}:gold-record:${index}`) % pool.length;
    const [track] = pool.splice(pick, 1);
    game.foundTrackIds.add(track.id);
    game.learnedTrackIds.add(track.id);
    game.newTrackIds.add(track.id);
    found.push(track);
  }
  const food = FOOD_TYPES.find((item) => item.kind === prop.foodKind);
  if (food) applyFoodBoost(food, prop.x, prop.y - 10, prop.foodCount || 1);
  if (found.length) {
    game.levelFlash = 1.25;
    addFloat(found.length === 1 ? "GOLD RECORD!" : `${found.length} GOLD RECORDS!`, prop.x, prop.y - 18, GOLD.dark);
    announce(
      found.length === 1
        ? `GOLD RECORD // ${found[0].title} // NEW SONG LEARNED // OPEN SONG`
        : `${found.length} GOLD RECORDS // ${found.length} NEW SONGS LEARNED // OPEN SONG`,
      5200,
    );
    renderDex();
  } else if (!locked.length && !food) {
    addFloat("SONGS COMPLETE", prop.x, prop.y - 18, GOLD.dark);
  } else if (!food) {
    addFloat("EMPTY", prop.x, prop.y - 18, GB.darkest);
  }
  saveGame(true);
}

function useAbility() {
  if (!game.started || game.paused || game.dexOpen || game.vehicleId || game.jam) return;
  const multiplier = abilityMultiplier();
  const player = game.player;
  const input = movementInput();
  const hasInput = Boolean(input.x || input.y);
  let dx = hasInput ? input.x : player.aimX;
  let dy = hasInput ? input.y : player.aimY;
  if (!dx && !dy) [dx, dy] = [[0, 1], [-1, 0], [1, 0], [0, -1]][player.facing];
  const length = Math.hypot(dx, dy) || 1;
  dx /= length;
  dy /= length;
  player.aimX = dx;
  player.aimY = dy;
  const range = Math.min(250, 148 * multiplier);
  const duration = [2.35, 2.65, 2.9][game.character] * multiplier;
  paintRiffCity(player.x, player.y, dx, dy, range, game.character);
  game.riffPose = { time: 0, duration: 0.58, dx, dy, character: game.character };
  game.effects.push({
    type: "riff",
    x: player.x,
    y: player.y,
    dx,
    dy,
    character: game.character,
    range,
    actionLife: 0.72,
    life: 0.72,
    maxLife: 0.72,
  });
  for (const npc of game.npcs) {
    const offsetX = npc.x - player.x;
    const offsetY = npc.y - player.y;
    const along = offsetX * dx + offsetY * dy;
    const side = Math.abs(offsetX * dy - offsetY * dx);
    if (along <= 0 || along >= range || side >= 13 + along * 0.15) continue;
    npc.slowTimer = Math.max(npc.slowTimer, duration);
    npc.fleeTimer = Math.max(npc.fleeTimer, duration + 0.5);
  }
  for (const slime of game.slimes) {
    const offsetX = slime.x - player.x;
    const offsetY = slime.y - player.y;
    const along = offsetX * dx + offsetY * dy;
    const side = Math.abs(offsetX * dy - offsetY * dx);
    if (along > 0 && along < range && side < 13 + along * 0.15) {
      slime.dance = Math.max(slime.dance, duration + 0.8);
    }
  }
  saveGame();
}

function timeJump() {
  if (game.timeCooldown > 0) return;
  game.timeCooldown = 3;
  game.era = game.era === "now" ? "old" : "now";
  game.levelFlash = 0.8;
  announce(game.era === "old" ? "BALTIMORE // 1923" : "BALTIMORE // NOW", 2600);
  saveGame(true);
}

function objectiveText() {
  return `FIND AN AUDIENCE // PAID ${game.paidCount}`;
}

function objectiveTarget() {
  return nearest(
    game.npcs,
    controlledPosition(),
    (npc) => npc.payCooldown <= 0 && npc.trapped <= 0,
  )?.item || game.npcs[0];
}

function crowdProfile(level = levelFromCash()) {
  const maxLevel = 1 + Math.ceil(Math.max(0, dexTracks.length - 1) / 5);
  const t = clamp((level - 1) / Math.max(1, maxLevel - 1), 0, 1);
  return {
    groupChance: 0.86 - 0.76 * t,
    maxGroupSize: Math.round(6 - 4 * t),
    groupRadius: 18 + 24 * t,
    minSpacing: 22 + 58 * t,
    minRadius: 145 + 80 * t,
    maxRadius: 500 + 95 * t,
  };
}

function setNpcPosition(npc, x, y) {
  npc.x = x;
  npc.y = y;
  npc.moveTimer = Math.random() * 1.5;
  npc.trapped = 0;
  npc.fleeTimer = 0;
  npc.slowTimer = 0;
  npc.redistribute = false;
  npc.vx = 0;
  npc.vy = 0;
}

function sampleCrowdSpot(origin, minRadius, maxRadius, occupied = [], minSpacing = 0) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = minRadius + Math.random() * Math.max(1, maxRadius - minRadius);
    let x = clamp(origin.x + Math.cos(angle) * radius, 20, streetMap.width - 20);
    let y = clamp(origin.y + Math.sin(angle) * radius, 20, streetMap.height - 20);
    if (!isTraversalPosition(x, y)) {
      const snapped = closestRoadPoint(x, y, false, 2);
      if (!snapped || snapped.distance > 46 || !isTraversalPosition(snapped.x, snapped.y)) continue;
      x = snapped.x;
      y = snapped.y;
    }
    if (occupied.some((point) => Math.hypot(point.x - x, point.y - y) < minSpacing)) continue;
    return { x, y };
  }
  return null;
}

function arrangeNpcCrowds(origin = controlledPosition()) {
  const profile = crowdProfile();
  const anchors = [];
  let index = 0;
  while (index < game.npcs.length) {
    const remaining = game.npcs.length - index;
    const grouped = remaining > 1 && Math.random() < profile.groupChance;
    const groupSize = grouped
      ? Math.min(remaining, 2 + Math.floor(Math.random() * Math.max(1, profile.maxGroupSize - 1)))
      : 1;
    const anchor = sampleCrowdSpot(
      origin,
      profile.minRadius,
      profile.maxRadius,
      anchors,
      profile.minSpacing * 1.2,
    );
    if (!anchor) {
      repositionNpc(game.npcs[index], origin);
      index += 1;
      continue;
    }
    anchors.push(anchor);
    for (let member = 0; member < groupSize; member += 1) {
      const npc = game.npcs[index + member];
      if (member === 0) {
        setNpcPosition(npc, anchor.x, anchor.y);
        continue;
      }
      const nearby = sampleCrowdSpot(anchor, 10, profile.groupRadius, [], 0);
      if (nearby) setNpcPosition(npc, nearby.x, nearby.y);
      else setNpcPosition(npc, anchor.x, anchor.y);
    }
    index += groupSize;
  }
  game.crowdLayoutLevel = levelFromCash();
}

function repositionNpc(npc, origin = controlledPosition()) {
  const profile = crowdProfile();
  const groupMate = Math.random() < profile.groupChance
    ? game.npcs.find((other) => (
      other !== npc &&
      !other.redistribute &&
      distance(other, origin) > profile.minRadius &&
      distance(other, origin) < profile.maxRadius
    ))
    : null;
  if (groupMate) {
    const nearby = sampleCrowdSpot(groupMate, 10, profile.groupRadius, [], 0);
    if (nearby) {
      setNpcPosition(npc, nearby.x, nearby.y);
      return;
    }
  }
  const others = game.npcs.filter((other) => other !== npc && !other.redistribute);
  const spot = sampleCrowdSpot(
    origin,
    profile.minRadius,
    profile.maxRadius,
    others,
    profile.minSpacing,
  );
  if (spot) setNpcPosition(npc, spot.x, spot.y);
}

function moveNpc(npc, vx, vy, speed, dt) {
  npc.vx = vx;
  npc.vy = vy;
  npc.facing = facingFromVector(vx, vy, npc.facing);
  if (!moveFootActor(npc, vx, vy, speed * dt)) {
    npc.vx *= -1;
    npc.vy *= -1;
    npc.moveTimer = 0;
  }
}

function updateNpcs(dt) {
  const focus = controlledPosition();
  for (const npc of game.npcs) {
    npc.payCooldown = Math.max(0, npc.payCooldown - dt);
    npc.trapped = Math.max(0, npc.trapped - dt);
    npc.fleeTimer = Math.max(0, npc.fleeTimer - dt);
    npc.slowTimer = Math.max(0, npc.slowTimer - dt);
    const focusDistance = distance(npc, focus);
    if (focusDistance > 680 || (npc.redistribute && focusDistance > 290)) repositionNpc(npc, focus);
    if (npc.trapped > 0) {
      npc.vx = 0;
      npc.vy = 0;
      continue;
    }
    const fleeRadius = game.jam ? 225 : 148;
    const slowFactor = npc.slowTimer > 0 ? 0.38 : 1;
    if (focusDistance < fleeRadius || npc.fleeTimer > 0) {
      let dx = npc.x - focus.x;
      let dy = npc.y - focus.y;
      const length = Math.hypot(dx, dy) || 1;
      if (length <= 1) {
        const angle = Math.random() * Math.PI * 2;
        dx = Math.cos(angle);
        dy = Math.sin(angle);
      } else {
        dx /= length;
        dy /= length;
      }
      moveNpc(npc, dx, dy, (npc.payCooldown > 0 ? 72 : 58) * slowFactor, dt);
      continue;
    }
    npc.moveTimer -= dt;
    if (npc.moveTimer <= 0) {
      npc.moveTimer = 0.8 + Math.random() * 2.7;
      const direction = Math.floor(Math.random() * 5);
      const vectors = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
      [npc.vx, npc.vy] = vectors[direction];
    }
    moveNpc(npc, npc.vx, npc.vy, 17 * slowFactor, dt);
  }
}

function generateWorldPickups() {
  game.cashPiles = [];
  game.foodPickups = [];
  if (!roadSampler.length) return;
  const random = seededRandom(game.worldSeed);
  const occupied = [];
  const addPickup = (collection, pickup) => {
    if (game.collectedPickupIds.has(pickup.id)) return;
    collection.push(pickup);
    occupied.push(pickup);
  };
  for (let index = 0; index < 18; index += 1) {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const point = randomRoadPoint(random);
      if (!point || !isTraversalPosition(point.x, point.y)) continue;
      if (occupied.some((item) => distance(item, point) < 70)) continue;
      addPickup(game.cashPiles, {
        id: `cash-${game.worldSeed}-${index}`,
        x: point.x,
        y: point.y,
        amount: 18 + Math.floor(random() * 31),
        phase: random() * Math.PI * 2,
      });
      break;
    }
  }
  for (let index = 0; index < WORLD_FOOD_COUNT; index += 1) {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const anchor = index < NEIGHBORHOODS.length * 5
        ? NEIGHBORHOODS[index % NEIGHBORHOODS.length]
        : null;
      const ring = 52 + Math.floor(index / NEIGHBORHOODS.length) * 40;
      const point = anchor && attempt === 0
        ? closestRoadPoint(
          anchor.x + Math.cos(index * 2.399) * ring,
          anchor.y + Math.sin(index * 2.399) * ring,
          false,
          4,
        )
        : randomRoadPoint(random);
      if (!point || !isTraversalPosition(point.x, point.y)) continue;
      if (occupied.some((item) => distance(item, point) < 54)) continue;
      const food = FOOD_TYPES[Math.floor(random() * FOOD_TYPES.length)];
      addPickup(game.foodPickups, {
        id: `food-${game.worldSeed}-${index}`,
        x: point.x,
        y: point.y,
        food,
        phase: random() * Math.PI * 2,
        persistent: true,
      });
      break;
    }
  }
}

function applyFoodBoost(food, x, y, quantity = 1) {
  const quantityMultiplier = 1 + Math.max(0, quantity - 1) * 0.35;
  const duration = food.duration * quantityMultiplier * Math.min(2.2, slimeMultiplier());
  const colors = FOOD_COLORS[food.kind] || FOOD_COLORS.tofu;
  game.foodBoosts[food.boost] = Math.max(game.foodBoosts[food.boost], duration);
  game.foodBoostLabel = food.name;
  game.effects.push({ type: "food", x, y, color: colors.primary, life: 0.8, maxLife: 0.8 });
  addFloat(`${quantity > 1 ? `${quantity}X ` : ""}${food.name} BOOST`, x, y - 18, colors.primary);
}

function collectFood(pickup) {
  if (pickup.persistent !== false) game.collectedPickupIds.add(pickup.id);
  pickup.collected = true;
  applyFoodBoost(pickup.food, pickup.x, pickup.y);
  saveGame(true);
}

function spawnRoamingFood() {
  const roaming = game.foodPickups.filter((pickup) => pickup.roaming && !pickup.collected);
  if (roaming.length >= MAX_ROAMING_FOODS) return;
  const focus = controlledPosition();
  for (let attempt = 0; attempt < 90; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const range = 72 + Math.random() * 250;
    const point = closestRoadPoint(
      focus.x + Math.cos(angle) * range,
      focus.y + Math.sin(angle) * range,
      false,
      3,
    );
    if (!point || !isTraversalPosition(point.x, point.y)) continue;
    if (distance(point, focus) < 64) continue;
    if (game.foodPickups.some((pickup) => !pickup.collected && distance(pickup, point) < 42)) continue;
    const food = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
    roamingFoodSerial += 1;
    game.foodPickups.push({
      id: `food-roaming-${Date.now()}-${roamingFoodSerial}`,
      x: point.x,
      y: point.y,
      food,
      phase: Math.random() * Math.PI * 2,
      persistent: false,
      roaming: true,
      life: 95 + Math.random() * 45,
      collected: false,
    });
    return;
  }
}

function updateWorldPickups(dt) {
  const focus = controlledPosition();
  for (const pile of game.cashPiles) {
    pile.phase += dt * 4;
    if (distance(pile, focus) >= 18) continue;
    game.collectedPickupIds.add(pile.id);
    earnMoney(pile.amount);
  }
  game.cashPiles = game.cashPiles.filter((pile) => !game.collectedPickupIds.has(pile.id));
  for (const pickup of game.foodPickups) {
    pickup.phase += dt * 3.5;
    if (pickup.roaming) pickup.life -= dt;
    if (pickup.collected || distance(pickup, focus) >= 17) continue;
    collectFood(pickup);
  }
  game.foodPickups = game.foodPickups.filter((pickup) => (
    !pickup.collected &&
    (!pickup.roaming || pickup.life > 0) &&
    (pickup.persistent === false || !game.collectedPickupIds.has(pickup.id))
  ));
}

function activateSlime(slime) {
  game.slimeStacks = game.slimeBoostTimer > 0 ? Math.min(3, game.slimeStacks + 1) : 1;
  game.slimeBoostTimer = Math.max(game.slimeBoostTimer, 28) + 5;
  slime.gone = true;
  game.effects.push({ type: "slimeBurst", x: slime.x, y: slime.y, life: 1, maxLife: 1 });
  addFloat(`SLIME X${slimeMultiplier().toFixed(1)}`, slime.x, slime.y - 18, GREEN.dark);
}

function spawnSlime() {
  if (game.slimes.length >= MAX_SLIMES) return;
  const focus = controlledPosition();
  const nearbySources = SEWERS.filter((source) => distance(source, focus) < 950);
  let source = nearbySources[Math.floor(Math.random() * nearbySources.length)];
  if (!source) {
    const spot = sampleCrowdSpot(focus, 120, 360, [], 0);
    if (!spot) return;
    source = { id: `street-${Date.now()}`, x: spot.x, y: spot.y };
  }
  if (!isTraversalPosition(source.x, source.y)) {
    const snapped = closestRoadPoint(source.x, source.y, false, 3);
    if (!snapped || !isTraversalPosition(snapped.x, snapped.y)) return;
    source = { ...source, x: snapped.x, y: snapped.y };
  }
  game.slimes.push({
    id: `slime-${Date.now()}`,
    x: source.x,
    y: source.y,
    homeX: source.x,
    homeY: source.y,
    sourceId: source.id,
    age: 0,
    dance: 0,
    returning: false,
    direction: Math.random() * Math.PI * 2,
    directionTimer: 1 + Math.random() * 2,
    emerge: 2,
    wobble: 0,
    trailTimer: 0,
    gone: false,
  });
}

function updateSlimes(dt) {
  for (const slime of game.slimes) {
    slime.age += dt;
    slime.wobble += dt * (slime.dance > 0 ? 15 : 7);
    slime.dance = Math.max(0, slime.dance - dt);
    slime.emerge = Math.max(0, slime.emerge - dt);
    slime.trailTimer -= dt;
    if (slime.trailTimer <= 0) {
      slime.trailTimer = 0.16 + Math.random() * 0.12;
      game.effects.push({
        type: "ooze",
        x: slime.x + (Math.random() - 0.5) * 10,
        y: slime.y + 5 + Math.random() * 5,
        life: 3.8,
        maxLife: 3.8,
      });
    }
    if (!game.vehicleId && distance(slime, game.player) < 18) {
      activateSlime(slime);
      continue;
    }
    if (game.jam && distance(slime, game.player) < 120) {
      slime.dance = Math.max(slime.dance, 1.2);
    }
    if (slime.emerge > 0 || slime.dance > 0) continue;
    if (slime.age > 58) slime.returning = true;
    let dx;
    let dy;
    let speed;
    if (slime.returning) {
      dx = slime.homeX - slime.x;
      dy = slime.homeY - slime.y;
      speed = 28;
    } else {
      slime.directionTimer -= dt;
      if (slime.directionTimer <= 0) {
        slime.direction += (Math.random() - 0.5) * 2.4;
        slime.directionTimer = 0.8 + Math.random() * 2.8;
      }
      dx = Math.cos(slime.direction);
      dy = Math.sin(slime.direction);
      speed = 13;
      if (Math.hypot(slime.x - slime.homeX, slime.y - slime.homeY) > 80) slime.returning = true;
    }
    const length = Math.hypot(dx, dy) || 1;
    if (!moveFootActor(slime, dx / length, dy / length, speed * dt)) {
      slime.direction += Math.PI * (0.35 + Math.random() * 0.4);
    }
    if (slime.returning && Math.hypot(slime.x - slime.homeX, slime.y - slime.homeY) < 7) {
      slime.gone = true;
    }
  }
  game.slimes = game.slimes.filter((slime) => !slime.gone);
}

function dropBill(origin, amount, index = 0, total = 1) {
  const spread = (index - (total - 1) / 2) * 0.42;
  const angle = -Math.PI / 2 + spread + (Math.random() - 0.5) * 0.24;
  game.bills.push({
    id: `bill-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    x: origin.x,
    y: origin.y - 4,
    vx: Math.cos(angle) * (19 + Math.random() * 9),
    vy: Math.sin(angle) * (19 + Math.random() * 9),
    amount,
    life: 45,
    wobble: Math.random() * Math.PI * 2,
    collected: false,
  });
}

function updateBills(dt) {
  const focus = controlledPosition();
  for (const bill of game.bills) {
    bill.life -= dt;
    bill.wobble += dt * 7;
    const nextX = bill.x + bill.vx * dt;
    const nextY = bill.y + bill.vy * dt;
    if (isWalkable(nextX, bill.y)) bill.x = nextX;
    else bill.vx *= -0.35;
    if (isWalkable(bill.x, nextY)) bill.y = nextY;
    else bill.vy *= -0.35;
    bill.vx *= Math.pow(0.09, dt);
    bill.vy *= Math.pow(0.09, dt);
    if (!bill.collected && distance(bill, focus) < 17) {
      bill.collected = true;
      earnMoney(bill.amount);
    }
  }
  game.bills = game.bills.filter((bill) => !bill.collected && bill.life > 0);
}

function updateEffects(dt) {
  for (const effect of game.effects) effect.life -= dt;
  for (const float of game.floats) {
    float.life -= dt;
    float.y -= dt * 15;
  }
  game.effects = game.effects.filter((effect) => effect.life > 0);
  if (game.effects.length > 190) game.effects.splice(0, game.effects.length - 190);
  game.floats = game.floats.filter((float) => float.life > 0);
}

function updateControlLabels() {
  const teleportLabel = game.teleportCooldown > 0 ? `TP ${Math.ceil(game.teleportCooldown)}` : "TP";
  if (ui.touchJump.textContent !== "JUMP") ui.touchJump.textContent = "JUMP";
  if (ui.touchTeleport.textContent !== teleportLabel) ui.touchTeleport.textContent = teleportLabel;
  ui.touchJump.disabled = Boolean(game.jump);
  ui.touchTeleport.disabled = game.teleportCooldown > 0;
  ui.touchB.disabled = Boolean(game.jam);
  ui.touchA.disabled = Boolean(game.jam);
}

function update(dt) {
  saveTimer = Math.max(0, saveTimer - dt);
  game.player.invulnerable = Math.max(0, game.player.invulnerable - dt);
  game.timeCooldown = Math.max(0, game.timeCooldown - dt);
  game.teleportCooldown = Math.max(0, game.teleportCooldown - dt);
  game.slimeBoostTimer = Math.max(0, game.slimeBoostTimer - dt);
  if (game.slimeBoostTimer <= 0) game.slimeStacks = 0;
  for (const boost of Object.keys(game.foodBoosts)) {
    game.foodBoosts[boost] = Math.max(0, game.foodBoosts[boost] - dt);
  }
  game.levelFlash = Math.max(0, game.levelFlash - dt);
  if (game.riffPose) {
    game.riffPose.time += dt;
    if (game.riffPose.time >= game.riffPose.duration) game.riffPose = null;
  }
  const input = movementInput();
  const vehicle = currentVehicle();
  if (vehicle) moveVehicle(vehicle, input, dt);
  else if (game.jump) updateJump(dt);
  else if (!game.jam) movePlayer(input, dt);
  if (game.jam) {
    game.jam.time += dt;
    if (game.jam.time >= game.jam.duration) finishJam();
  }
  updateNpcs(dt);
  updateSlimes(dt);
  updateBills(dt);
  updateWorldPickups(dt);
  game.foodSpawnTimer -= dt;
  if (game.foodSpawnTimer <= 0) {
    spawnRoamingFood();
    const roamingCount = game.foodPickups.filter((pickup) => pickup.roaming).length;
    game.foodSpawnTimer = roamingCount >= MAX_ROAMING_FOODS
      ? 12 + Math.random() * 10
      : 5 + Math.random() * 7;
  }
  updateEffects(dt);
  game.slimeTimer -= dt;
  if (game.slimeTimer <= 0) {
    spawnSlime();
    game.slimeTimer = game.slimes.length >= MAX_SLIMES
      ? 12 + Math.random() * 10
      : 4 + Math.random() * 7;
  }
  updateControlLabels();
  if (Math.random() < dt * 0.08) saveGame();
}

function hashTile(x, y) {
  let value = Math.imul(x + 101, 374761393) ^ Math.imul(y + 37, 668265263);
  value = (value ^ (value >>> 13)) >>> 0;
  return value;
}

function visibleChunkKeys(margin = 20) {
  const keysInView = [];
  const chunk = streetMap.chunkSize;
  const x0 = Math.floor((camera.x - margin) / chunk);
  const y0 = Math.floor((camera.y - margin) / chunk);
  const x1 = Math.floor((camera.x + worldViewWidth() + margin) / chunk);
  const y1 = Math.floor((camera.y + worldViewHeight() + margin) / chunk);
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      keysInView.push(`${x},${y}`);
    }
  }
  return keysInView;
}

function visibleRoadIds() {
  const ids = new Set();
  for (const key of visibleChunkKeys()) {
    for (const id of streetMap.chunks[key] || []) ids.add(id);
  }
  return ids;
}

function pathRoad(road) {
  ctx.beginPath();
  ctx.moveTo(road[5], road[6]);
  for (let index = 7; index < road.length; index += 2) ctx.lineTo(road[index], road[index + 1]);
  ctx.stroke();
}

function rectVisible(rect, margin = 24) {
  return rect.x + rect.w >= camera.x - margin &&
    rect.x <= camera.x + worldViewWidth() + margin &&
    rect.y + rect.h >= camera.y - margin &&
    rect.y <= camera.y + worldViewHeight() + margin;
}

function drawTerrainZone(zone) {
  if (!rectVisible(zone)) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(zone.x, zone.y, zone.w, zone.h);
  ctx.clip();
  if (zone.type === "park") {
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    ctx.strokeStyle = GB.dark;
    ctx.lineWidth = 2;
    for (let y = zone.y + 12; y < zone.y + zone.h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(zone.x, y);
      ctx.lineTo(zone.x + zone.w, y + 18);
      ctx.stroke();
    }
  } else if (zone.type === "hill") {
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    ctx.strokeStyle = GB.dark;
    ctx.lineWidth = 2;
    const cx = zone.x + zone.w / 2;
    const cy = zone.y + zone.h / 2;
    for (let ring = 0; ring < 7; ring += 1) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, 70 + ring * 48, 45 + ring * 38, -0.18, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (zone.type === "waterfront") {
    ctx.fillStyle = GB.light;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    for (let y = zone.y; y < zone.y + zone.h; y += 12) {
      for (let x = zone.x; x < zone.x + zone.w; x += 16) {
        if ((Math.floor(x / 16) + Math.floor(y / 12)) % 2) {
          ctx.fillStyle = GB.lightest;
          ctx.fillRect(x, y, 8, 6);
        }
      }
    }
  } else if (zone.type === "industrial") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    ctx.fillStyle = GB.light;
    for (let y = zone.y; y < zone.y + zone.h; y += 18) {
      for (let x = zone.x; x < zone.x + zone.w; x += 24) ctx.fillRect(x, y, 12, 3);
    }
  }
  ctx.restore();
  ctx.strokeStyle = GB.darkest;
  ctx.lineWidth = 2;
  ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
}

function drawTerrain() {
  const viewWidth = worldViewWidth();
  const viewHeight = worldViewHeight();
  ctx.fillStyle = GB.light;
  ctx.fillRect(camera.x - 2, camera.y - 2, viewWidth + 4, viewHeight + 4);
  for (const zone of TERRAIN_ZONES) drawTerrainZone(zone);
  const startX = Math.floor(camera.x / TILE) * TILE;
  const startY = Math.floor(camera.y / TILE) * TILE;
  for (let y = startY; y < camera.y + viewHeight + TILE; y += TILE) {
    for (let x = startX; x < camera.x + viewWidth + TILE; x += TILE) {
      const hash = hashTile(x / TILE, y / TILE);
      const zone = TERRAIN_ZONES.find((area) => pointInRect(x, y, area));
      if ((zone?.type === "park" || zone?.type === "hill") && hash % 13 === 0) {
        drawTree(x + 8, y + 9);
      } else if (!zone && hash % 11 === 0) {
        ctx.fillStyle = GB.dark;
        ctx.fillRect(x + 3, y + 10, 2, 3);
        ctx.fillRect(x + 7, y + 8, 2, 5);
        ctx.fillRect(x + 11, y + 11, 2, 2);
      } else if (!zone && hash % 29 === 0) {
        drawTree(x + 8, y + 9);
      }
    }
  }

  ctx.fillStyle = GB.dark;
  ctx.beginPath();
  ctx.moveTo(HARBOR[0][0], HARBOR[0][1]);
  for (const point of HARBOR.slice(1)) ctx.lineTo(point[0], point[1]);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = GB.darkest;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = GB.light;
  for (let y = Math.floor(camera.y / 24) * 24; y < camera.y + viewHeight + 24; y += 24) {
    for (let x = Math.floor(camera.x / 32) * 32; x < camera.x + viewWidth + 32; x += 32) {
      if (inWater(x, y)) {
        ctx.fillRect(x, y, 8, 2);
        ctx.fillRect(x + 12, y + 5, 6, 2);
      }
    }
  }
}

function drawMappedParks() {
  if (!streetMap.parks?.length) return;
  const ids = new Set();
  for (const key of visibleChunkKeys()) {
    for (const id of streetMap.parkChunks?.[key] || []) ids.add(id);
  }
  for (const id of ids) {
    const park = streetMap.parks[id];
    if (!park || park[3] < camera.x || park[1] > camera.x + worldViewWidth() || park[4] < camera.y || park[2] > camera.y + worldViewHeight()) continue;
    ctx.beginPath();
    for (const ring of decodePark(id)) {
      ctx.moveTo(ring[0][0], ring[0][1]);
      for (const point of ring.slice(1)) ctx.lineTo(point[0], point[1]);
      ctx.closePath();
    }
    ctx.fillStyle = GB.lightest;
    ctx.fill("evenodd");
    ctx.save();
    ctx.clip("evenodd");
    const textureX0 = Math.floor(Math.max(park[1], camera.x) / 28) * 28;
    const textureY0 = Math.floor(Math.max(park[2], camera.y) / 28) * 28;
    const textureX1 = Math.min(park[3], camera.x + worldViewWidth());
    const textureY1 = Math.min(park[4], camera.y + worldViewHeight());
    for (let y = textureY0; y <= textureY1; y += 28) {
      for (let x = textureX0; x <= textureX1; x += 28) {
        const hash = hashTile(Math.round(x / 7), Math.round(y / 7));
        if (hash % 7 === 0) drawTree(x + 8, y + 10);
        else if (hash % 3 === 0) {
          ctx.fillStyle = GB.dark;
          ctx.fillRect(x + 5, y + 8, 2, 4);
          ctx.fillRect(x + 11, y + 11, 3, 2);
        }
      }
    }
    ctx.restore();
    ctx.strokeStyle = GB.dark;
    ctx.lineWidth = 1;
    ctx.stroke();
    const name = streetMap.parkNames?.[park[0]];
    if (name && park[3] - park[1] > 48 && park[4] - park[2] > 28) {
      bitmapText(name, (park[1] + park[3]) / 2, (park[2] + park[4]) / 2, 1, GB.dark, "center", 20);
    }
  }
}

function drawMappedBuildings() {
  if (!streetMap.buildingChunks) return;
  for (const key of visibleChunkKeys(4)) {
    const features = decodeBuildingChunk(key);
    if (!features.length) continue;
    ctx.beginPath();
    for (const rings of features) {
      for (const ring of rings) {
        ctx.moveTo(ring[0][0], ring[0][1]);
        for (const point of ring.slice(1)) ctx.lineTo(point[0], point[1]);
        ctx.closePath();
      }
    }
    ctx.fillStyle = GB.dark;
    ctx.fill("evenodd");
    if (camera.zoom > 0.78) {
      ctx.strokeStyle = GB.darkest;
      ctx.lineWidth = 0.75;
      ctx.stroke();
    }
  }
}

function drawTree(x, y) {
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 5, y - 8, 10, 10);
  ctx.fillRect(x - 7, y - 5, 14, 7);
  ctx.fillStyle = GB.dark;
  ctx.fillRect(x - 3, y - 6, 5, 4);
  ctx.fillStyle = GB.lightest;
  ctx.fillRect(x - 2, y + 2, 4, 5);
}

function drawRoads() {
  const ids = visibleRoadIds();
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  for (const type of [1, 2, 3]) {
    ctx.strokeStyle = GB.darkest;
    ctx.lineWidth = [0, 6, 8, 11][type];
    for (const id of ids) {
      const road = streetMap.roads[id];
      if (road?.[0] === type) pathRoad(road);
    }
  }
  for (const type of [1, 2, 3]) {
    ctx.strokeStyle = GB.lightest;
    ctx.lineWidth = [0, 3, 5, 7][type];
    for (const id of ids) {
      const road = streetMap.roads[id];
      if (road?.[0] === type) pathRoad(road);
    }
  }
  ctx.strokeStyle = GB.dark;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  for (const id of ids) {
    const road = streetMap.roads[id];
    if (road?.[0] === 0) pathRoad(road);
  }
  ctx.setLineDash([]);
}

function drawBuildingTag(building, y = building.y + building.h - 14, maxChars = 22) {
  const label = ascii(building.label).slice(0, maxChars);
  const width = Math.min(138, label.length * 6 + 6);
  const x = building.x + building.w / 2 - width / 2;
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 2, y - 2, width + 4, 13);
  ctx.fillStyle = GB.lightest;
  ctx.fillRect(x, y, width, 9);
  bitmapText(label, building.x + building.w / 2, y + 1, 1, GB.darkest, "center", maxChars);
}

function drawSpecialBuilding(building) {
  const { x, y, w, h, kind } = building;
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = GB.lightest;
  ctx.fillRect(x, y, w, h);
  if (kind === "monument") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + 5, y + h - 12, w - 10, 12);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x + 13, y + 10, 12, h - 20);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + 10, y + 7, 18, 5);
    ctx.fillRect(x + 16, y, 6, 8);
  } else if (kind === "tower") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + 5, y + 14, w - 10, h - 14);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x + 9, y + 19, w - 18, h - 26);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + 8, y + 4, w - 16, 14);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x + 13, y + 7, w - 26, 8);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + w / 2 - 1, y + 9, 2, 5);
    ctx.fillRect(x + w / 2, y + 11, 4, 2);
  } else if (kind === "pagoda") {
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + 6, y + 10, w - 12, 4);
    ctx.fillRect(x, y + 14, w, 5);
    ctx.fillRect(x + 10, y + 27, w - 20, 4);
    ctx.fillRect(x + 4, y + 31, w - 8, 5);
    ctx.fillRect(x + 18, y + 36, 4, h - 36);
    ctx.fillRect(x + w - 22, y + 36, 4, h - 36);
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + w / 2 - 2, y, 4, 11);
  } else if (kind === "ballpark") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + 4, y + 6, w - 8, h - 10);
    ctx.fillStyle = GB.lightest;
    for (let bx = x + 8; bx < x + w - 7; bx += 12) ctx.fillRect(bx, y + 12, 7, 13);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + 12, y + 34, w - 24, h - 38);
    ctx.fillStyle = GB.light;
    ctx.fillRect(x + w / 2 - 13, y + 40, 26, 18);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x + w / 2 - 2, y + 44, 4, 4);
  } else if (kind === "aquarium") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + 6, y + 8, w - 12, h - 8);
    ctx.fillStyle = GB.lightest;
    for (let bx = x + 10; bx < x + w - 8; bx += 15) ctx.fillRect(bx, y + 13, 10, 22);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + w - 34, y, 24, 13);
    ctx.fillRect(x + w - 27, y - 8, 10, 9);
    ctx.fillStyle = GB.light;
    ctx.fillRect(x + w - 23, y - 12, 2, 4);
  } else if (kind === "station") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + 5, y + 17, w - 10, h - 17);
    ctx.fillStyle = GB.darkest;
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + w, y + 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x + w / 2 - 7, y + 7, 14, 9);
    for (let bx = x + 12; bx < x + w - 10; bx += 22) ctx.fillRect(bx, y + 26, 12, 18);
  } else if (kind === "theatre") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + 4, y + 4, w - 8, h - 4);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x + 8, y + 10, w - 16, 14);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + 2, y + 27, w - 4, 8);
    for (let bx = x + 7; bx < x + w - 5; bx += 12) {
      ctx.fillStyle = (bx / 12) % 2 ? GB.light : GB.lightest;
      ctx.fillRect(bx, y + 29, 7, 4);
    }
  } else if (kind === "alley") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + 3, y + 3, w - 6, h - 3);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x + 7, y + 8, 7, 4);
    ctx.fillRect(x + 20, y + 15, 10, 3);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + 10, y + 23, 18, 4);
    ctx.fillRect(x + 5, y + 30, 8, 3);
  } else if (kind === "factory") {
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x + 4, y + 18, w - 8, h - 18);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + 10, y - 20, 14, 39);
    ctx.fillRect(x + 31, y - 10, 11, 29);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x + 52, y + 25, w - 60, 18);
    bitmapText("DOMINO", x + 56, y + 31, 1, GB.darkest, "left", 10);
  }
  drawBuildingTag(building, y + h - 12);
}

function drawBuilding(building) {
  if (!rectVisible(building, 150)) return;
  if (["alley", "theatre", "station", "monument", "tower", "ballpark", "aquarium", "pagoda", "factory"].includes(building.kind)) {
    drawSpecialBuilding(building);
    return;
  }
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(building.x - 3, building.y - 3, building.w + 6, building.h + 6);
  ctx.fillStyle = GB.dark;
  ctx.fillRect(building.x, building.y, building.w, 19);
  for (let bx = building.x + 4; bx < building.x + building.w - 4; bx += 12) {
    ctx.fillStyle = Math.floor(bx / 12) % 2 ? GB.light : GB.lightest;
    ctx.fillRect(bx, building.y + 4, 8, 6);
  }
  ctx.fillStyle = GB.lightest;
  ctx.fillRect(building.x + 3, building.y + 19, building.w - 6, building.h - 22);
  ctx.fillStyle = GB.dark;
  for (let bx = building.x + 10; bx < building.x + building.w - 10; bx += 24) {
    ctx.fillRect(bx, building.y + 28, 9, 10);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(bx + 2, building.y + 30, 2, 6);
    ctx.fillRect(bx + 6, building.y + 30, 1, 6);
    ctx.fillStyle = GB.dark;
  }
  if (building.kind === "gallery") {
    ctx.strokeStyle = GB.darkest;
    ctx.lineWidth = 2;
    ctx.strokeRect(building.x + 42, building.y + 24, 24, 20);
  } else if (building.kind === "deli" || building.kind === "roadhouse") {
    for (let bx = building.x + 4; bx < building.x + building.w - 4; bx += 10) {
      ctx.fillStyle = Math.floor(bx / 10) % 2 ? GB.darkest : GB.light;
      ctx.fillRect(bx, building.y + 19, 8, 7);
    }
  }
  const doorX = building.kind === "hq" ? LANDMARKS.hqDoor.x : building.x + Math.floor(building.w / 2);
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(doorX - 5, building.y + building.h - 17, 10, 17);
  ctx.fillStyle = GB.light;
  ctx.fillRect(doorX - 2, building.y + building.h - 13, 3, 3);
  drawBuildingTag(building, building.y + building.h - 13);
}

function drawRowhouseBlock(block) {
  const vertical = block.direction === "south";
  const bounds = {
    x: block.x - 4,
    y: block.y - 4,
    w: vertical ? 22 : block.count * 15 + 8,
    h: vertical ? block.count * 20 + 8 : 28,
  };
  if (!rectVisible(bounds)) return;
  for (let index = 0; index < block.count; index += 1) {
    const x = block.x + (vertical ? 0 : index * 15);
    const y = block.y + (vertical ? index * 20 : 0);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x, y, 14, 24);
    ctx.fillStyle = index % 2 ? GB.dark : GB.lightest;
    ctx.fillRect(x + 2, y + 3, 10, 19);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x + 4, y + 6, 3, 4);
    ctx.fillRect(x + 8, y + 6, 2, 4);
    ctx.fillRect(x + 7, y + 14, 4, 8);
    ctx.fillRect(x + 10, y + 21, 6, 2);
  }
}

function drawGoldRecord(x, y) {
  ctx.fillStyle = GOLD.darkest;
  ctx.fillRect(x - 5, y - 3, 10, 7);
  ctx.fillRect(x - 3, y - 5, 7, 10);
  ctx.fillStyle = GOLD.light;
  ctx.fillRect(x - 4, y - 2, 8, 5);
  ctx.fillRect(x - 2, y - 4, 5, 8);
  ctx.fillStyle = GOLD.lightest;
  ctx.fillRect(x - 2, y - 2, 4, 4);
  ctx.fillStyle = GOLD.darkest;
  ctx.fillRect(x - 1, y - 1, 2, 2);
}

function drawTrashFoodHint(prop, x, y) {
  const colors = FOOD_COLORS[prop.foodKind] || FOOD_COLORS.tofu;
  const foodX = x + (prop.recordCount ? 11 : 0);
  const foodY = y - 14;
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(foodX - 5, foodY - 4, 10, 9);
  ctx.fillRect(foodX - 2, foodY - 7, 4, 4);
  ctx.fillStyle = colors.primary;
  ctx.fillRect(foodX - 3, foodY - 2, 6, 5);
  ctx.fillStyle = colors.light;
  ctx.fillRect(foodX - 2, foodY - 1, 2, 2);
  ctx.fillStyle = colors.accent;
  ctx.fillRect(foodX - 1, foodY - 6, 3, 3);
  if ((prop.foodCount || 1) > 1 && !prop.recordCount) {
    bitmapText(`X${prop.foodCount}`, x, y - 28, 1, colors.primary, "center");
  }
}

function drawTrash(prop) {
  const searched = game.trashSearchedIds.has(prop.id);
  const x = Math.round(prop.x);
  const y = Math.round(prop.y);
  ctx.fillStyle = GB.darkest;
  if (prop.type === "dumpster") {
    ctx.fillRect(x - 12, y - 7, 24, 15);
    ctx.fillStyle = searched ? GB.light : GB.dark;
    ctx.fillRect(x - 9, y - 4, 18, 9);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x - 13, y - (searched ? 13 : 9), 26, 4);
    ctx.fillRect(x - 9, y + 8, 4, 3);
    ctx.fillRect(x + 5, y + 8, 4, 3);
  } else {
    ctx.fillRect(x - 6, y - 8, 12, 17);
    ctx.fillStyle = searched ? GB.light : GB.dark;
    ctx.fillRect(x - 4, y - 5, 8, 12);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x - 7, y - (searched ? 12 : 9), 14, 3);
    ctx.fillRect(x - 3, y + 9, 2, 3);
    ctx.fillRect(x + 2, y + 9, 2, 3);
  }
  if (!searched && prop.recordCount) {
    const count = Math.min(3, prop.recordCount);
    for (let index = 0; index < count; index += 1) {
      const offset = Math.round((index - (count - 1) / 2) * 7);
      drawGoldRecord(x + offset, y - 13 - (index % 2) * 3);
    }
    if (count > 1) bitmapText(`X${count}`, x, y - 28, 1, GOLD.darkest, "center");
  }
  if (!searched && prop.foodKind) drawTrashFoodHint(prop, x, y);
  if (!searched && !prop.recordCount && !prop.foodKind && distance(prop, game.player) < 64) {
    const pulse = Math.floor(performance.now() / 180) % 2;
    bitmapText("?", x, y - 20 - pulse * 2, 1, GB.darkest, "center");
  }
}

function drawTrashProps() {
  for (const prop of TRASH_SPOTS) drawTrash(prop);
}

function drawLandmarks() {
  for (const block of ROWHOUSE_BLOCKS) drawRowhouseBlock(block);
  for (const building of BUILDINGS) drawBuilding(building);
  for (const sewer of SEWERS) {
    const pulse = Math.floor(performance.now() / 400) % 2;
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(sewer.x - 5, sewer.y - 3, 10, 6);
    ctx.fillStyle = GB.dark;
    ctx.fillRect(sewer.x - 3, sewer.y - 1, 6, 2);
    ctx.fillRect(sewer.x - 7 - pulse, sewer.y + 3, 14 + pulse * 2, 2);
  }
  for (const area of NEIGHBORHOODS) {
    if (
      Math.abs(area.x - camera.x - worldViewWidth() / 2) > worldViewWidth() ||
      Math.abs(area.y - camera.y - worldViewHeight() / 2) > worldViewHeight()
    ) continue;
    const width = Math.min(114, ascii(area.name).length * 6 + 8);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(area.x - width / 2, area.y - 8, width, 15);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(area.x - width / 2 + 2, area.y - 6, width - 4, 11);
    bitmapText(area.name, area.x, area.y - 4, 1, GB.darkest, "center", 18);
  }
  const rift = LANDMARKS.timeRift;
  const pulse = Math.floor(performance.now() / 140) % 3;
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(rift.x - 8 - pulse, rift.y - 14, 4, 28);
  ctx.fillRect(rift.x + 4 + pulse, rift.y - 14, 4, 28);
  ctx.fillStyle = GB.lightest;
  ctx.fillRect(rift.x - 3, rift.y - 11 - pulse, 6, 22 + pulse * 2);
}

function drawPersonBase(x, y, colors = GB, facing = 0, step = 0, drawHead = true) {
  const leg = Math.floor(step) % 2 ? 1 : -1;
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 5, y + 7, 4, 7 + leg);
  ctx.fillRect(x + 1, y + 7, 4, 7 - leg);
  ctx.fillStyle = colors.dark;
  ctx.fillRect(x - 6, y - 4, 12, 12);
  if (!drawHead) return;
  ctx.fillStyle = colors.lightest;
  ctx.fillRect(x - 4, y - 13, 8, 9);
  ctx.fillStyle = colors.darkest;
  if (facing === 3) ctx.fillRect(x - 5, y - 14, 10, 5);
  else {
    ctx.fillRect(x - 5, y - 14, 10, 3);
    ctx.fillRect(x + (facing === 1 ? -4 : 2), y - 8, 2, 2);
  }
}

function drawPrescriptionGlasses(x, y, facing) {
  ctx.fillStyle = BAND_FEATURES.black;
  if (facing === 0) {
    for (const lensX of [x - 5, x + 1]) {
      ctx.fillRect(lensX, y - 13, 4, 1);
      ctx.fillRect(lensX, y - 9, 4, 1);
      ctx.fillRect(lensX, y - 13, 1, 5);
      ctx.fillRect(lensX + 3, y - 13, 1, 5);
    }
    ctx.fillRect(x - 1, y - 11, 2, 1);
    ctx.fillRect(x - 3, y - 11, 1, 1);
    ctx.fillRect(x + 2, y - 11, 1, 1);
    ctx.fillStyle = BAND_FEATURES.metal;
    ctx.fillRect(x - 4, y - 12, 1, 1);
    ctx.fillRect(x + 2, y - 12, 1, 1);
  } else {
    const lensX = facing === 1 ? x - 5 : x;
    ctx.fillRect(lensX, y - 13, 5, 1);
    ctx.fillRect(lensX, y - 9, 5, 1);
    ctx.fillRect(lensX, y - 13, 1, 5);
    ctx.fillRect(lensX + 4, y - 13, 1, 5);
    ctx.fillRect(facing === 1 ? x - 7 : x + 4, y - 12, 3, 1);
    ctx.fillRect(facing === 1 ? x - 3 : x + 2, y - 11, 1, 1);
    ctx.fillStyle = BAND_FEATURES.metal;
    ctx.fillRect(facing === 1 ? x - 4 : x + 1, y - 12, 1, 1);
  }
}

function drawCharacterHead(x, y, character, facing) {
  const front = facing !== 3;
  ctx.fillStyle = BAND_FEATURES.skinLight;
  ctx.fillRect(x - 5, y - 15, 10, 11);
  if (character === 0) {
    ctx.fillStyle = BAND_FEATURES.hair;
    ctx.fillRect(x - 5, y - 18, 10, 4);
    ctx.fillRect(x - 6, y - 15, 2, 4);
    ctx.fillRect(x + 4, y - 15, 2, 4);
    ctx.fillStyle = BAND_FEATURES.hairLight;
    ctx.fillRect(x - 3, y - 17, 6, 1);
    if (front) {
      ctx.fillStyle = BAND_FEATURES.eyeBlue;
      if (facing === 1) ctx.fillRect(x - 4, y - 11, 2, 2);
      else if (facing === 2) ctx.fillRect(x + 2, y - 11, 2, 2);
      else {
        ctx.fillRect(x - 3, y - 11, 2, 2);
        ctx.fillRect(x + 2, y - 11, 2, 2);
      }
      ctx.fillStyle = BAND_FEATURES.skin;
      ctx.fillRect(x, y - 7, 2, 1);
    }
  } else if (character === 1) {
    ctx.fillStyle = BAND_FEATURES.hair;
    ctx.fillRect(x - 7, y - 18, 14, 4);
    ctx.fillRect(x - 8, y - 15, 4, 14);
    ctx.fillRect(x + 4, y - 15, 4, 14);
    ctx.fillStyle = BAND_FEATURES.hairLight;
    ctx.fillRect(x - 6, y - 14, 2, 9);
    ctx.fillRect(x + 4, y - 13, 2, 8);
    if (front) {
      ctx.fillStyle = BAND_FEATURES.black;
      if (facing === 1) ctx.fillRect(x - 5, y - 12, 5, 3);
      else if (facing === 2) ctx.fillRect(x, y - 12, 5, 3);
      else {
        ctx.fillRect(x - 5, y - 12, 4, 3);
        ctx.fillRect(x + 1, y - 12, 4, 3);
        ctx.fillRect(x - 1, y - 11, 2, 1);
      }
      ctx.fillStyle = BAND_FEATURES.hair;
      ctx.fillRect(x - 5, y - 8, 10, 5);
      ctx.fillRect(x - 3, y - 3, 6, 3);
      ctx.fillRect(x - 1, y, 2, 2);
      ctx.fillStyle = BAND_FEATURES.skinLight;
      ctx.fillRect(x - 2, y - 8, 4, 2);
    } else {
      ctx.fillStyle = BAND_FEATURES.hair;
      ctx.fillRect(x - 4, y - 14, 8, 10);
    }
  } else {
    ctx.fillStyle = BAND_FEATURES.jakeHair;
    const curls = [
      [-7, -17], [-3, -19], [1, -19], [5, -17],
      [-8, -13], [5, -13], [-8, -9], [6, -8], [-7, -5], [5, -4],
    ];
    for (const [cx, cy] of curls) ctx.fillRect(x + cx, y + cy, 4, 4);
    ctx.fillStyle = BAND_FEATURES.jakeHairLight;
    ctx.fillRect(x - 2, y - 17, 4, 2);
    if (front) {
      drawPrescriptionGlasses(x, y, facing);
      ctx.fillStyle = BAND_FEATURES.jakeHair;
      ctx.fillRect(x - 5, y - 8, 10, 2);
      ctx.fillRect(x - 3, y - 6, 6, 2);
      ctx.fillRect(x - 2, y - 4, 4, 2);
      ctx.fillRect(x - 1, y - 2, 2, 3);
      ctx.fillRect(x, y + 1, 1, 2);
    } else {
      ctx.fillStyle = BAND_FEATURES.jakeHair;
      ctx.fillRect(x - 5, y - 14, 10, 10);
    }
  }
}

function drawGuitarBody(colors, pulse) {
  ctx.fillStyle = GB.darkest;
  ctx.beginPath();
  ctx.moveTo(3, -7);
  ctx.lineTo(8, -9);
  ctx.lineTo(12, -6);
  ctx.lineTo(9, -1);
  ctx.lineTo(12, 3);
  ctx.lineTo(11, 10);
  ctx.lineTo(6, 15);
  ctx.lineTo(-1, 15);
  ctx.lineTo(-7, 11);
  ctx.lineTo(-8, 5);
  ctx.lineTo(-4, 1);
  ctx.lineTo(-8, -2);
  ctx.lineTo(-7, -7);
  ctx.lineTo(-2, -9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = colors.light;
  ctx.beginPath();
  ctx.moveTo(2, -5);
  ctx.lineTo(7, -7);
  ctx.lineTo(9, -5);
  ctx.lineTo(6, 0);
  ctx.lineTo(9, 4);
  ctx.lineTo(8, 9);
  ctx.lineTo(4, 12);
  ctx.lineTo(-1, 12);
  ctx.lineTo(-5, 9);
  ctx.lineTo(-5, 5);
  ctx.lineTo(-1, 1);
  ctx.lineTo(-5, -2);
  ctx.lineTo(-4, -5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = colors.lightest;
  ctx.beginPath();
  ctx.moveTo(0, -3);
  ctx.lineTo(6, -4);
  ctx.lineTo(7, 0);
  ctx.lineTo(4, 3);
  ctx.lineTo(6, 8);
  ctx.lineTo(0, 9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(1, -1, 2, 7);
  ctx.fillRect(5, -1, 2, 7);
  ctx.fillStyle = BAND_FEATURES.metal;
  ctx.fillRect(0, 8 + pulse, 8, 2);
}

function drawBassBody(colors, pulse) {
  ctx.fillStyle = GB.darkest;
  ctx.beginPath();
  ctx.moveTo(3, -8);
  ctx.lineTo(9, -11);
  ctx.lineTo(13, -8);
  ctx.lineTo(9, -2);
  ctx.lineTo(13, 3);
  ctx.lineTo(12, 11);
  ctx.lineTo(7, 17);
  ctx.lineTo(0, 18);
  ctx.lineTo(-7, 14);
  ctx.lineTo(-9, 8);
  ctx.lineTo(-6, 3);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-9, -5);
  ctx.lineTo(-4, -8);
  ctx.lineTo(0, -4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = colors.light;
  ctx.beginPath();
  ctx.moveTo(3, -5);
  ctx.lineTo(8, -8);
  ctx.lineTo(10, -7);
  ctx.lineTo(6, -1);
  ctx.lineTo(10, 4);
  ctx.lineTo(9, 10);
  ctx.lineTo(5, 14);
  ctx.lineTo(0, 15);
  ctx.lineTo(-5, 12);
  ctx.lineTo(-6, 8);
  ctx.lineTo(-3, 3);
  ctx.lineTo(-7, 0);
  ctx.lineTo(-6, -3);
  ctx.lineTo(-3, -5);
  ctx.lineTo(0, -1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = colors.dark;
  ctx.fillRect(-1, -2, 8, 12);
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(1, 0, 2, 9);
  ctx.fillRect(5, -1, 2, 10);
  ctx.fillStyle = BAND_FEATURES.metal;
  ctx.fillRect(-1, 10 + pulse, 9, 2);
}

function drawStringInstrument(x, y, facing, colors, bass = false, pulse = 0) {
  const direction = facing === 1 ? -1 : 1;
  const instrumentScale = bass ? 0.74 : 0.82;
  const neckLength = bass ? 38 : 32;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(direction * instrumentScale, instrumentScale);
  if (bass) drawBassBody(colors, pulse);
  else drawGuitarBody(colors, pulse);
  ctx.save();
  ctx.translate(7, -3);
  ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(0, -3, neckLength, 6);
  ctx.fillStyle = colors.dark;
  ctx.fillRect(2, -2, neckLength - 3, 4);
  ctx.fillStyle = GB.darkest;
  ctx.beginPath();
  if (bass) {
    ctx.moveTo(neckLength - 1, -3);
    ctx.lineTo(neckLength + 12, -4);
    ctx.lineTo(neckLength + 14, 2);
    ctx.lineTo(neckLength + 2, 4);
  } else {
    ctx.moveTo(neckLength - 1, -3);
    ctx.lineTo(neckLength + 11, -5);
    ctx.lineTo(neckLength + 13, 2);
    ctx.lineTo(neckLength + 2, 4);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = colors.dark;
  ctx.beginPath();
  ctx.moveTo(neckLength + 1, -2);
  ctx.lineTo(neckLength + (bass ? 11 : 10), -3);
  ctx.lineTo(neckLength + 11, 1);
  ctx.lineTo(neckLength + 2, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = BAND_FEATURES.metal;
  const stringRows = bass ? [-2, -1, 1, 2] : [-2, 0, 2];
  for (const stringY of stringRows) ctx.fillRect(1, stringY, neckLength + 5, 1);
  for (let fret = 6; fret < neckLength; fret += 5) ctx.fillRect(fret, -2, 1, 4);
  ctx.fillStyle = GB.lightest;
  const tunerOffsets = bass
    ? [[2, -5], [5, 3], [8, -5], [11, 2]]
    : [[2, -5], [5, 3], [7, -5], [9, 3], [11, -4], [12, 1]];
  for (const [offsetX, offsetY] of tunerOffsets) {
    ctx.fillRect(neckLength + offsetX, offsetY, 2, 2);
  }
  ctx.restore();
  ctx.restore();
}

function drawDrumKit(x, y, colors, jam, pulse) {
  ctx.fillStyle = GB.darkest;
  if (!jam) {
    ctx.fillRect(x - 10, y - 1, 20, 10);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 8, y + 1, 16, 6);
    ctx.fillStyle = BAND_FEATURES.metal;
    ctx.fillRect(x - 8, y + 3, 16, 1);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x - 7, y - 8, 2, 11);
    ctx.fillRect(x + 5, y - 8, 2, 11);
    return;
  }
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 11, y - 2, 22, 18);
  ctx.fillStyle = colors.light;
  ctx.fillRect(x - 8, y + 1, 16, 12);
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 4, y + 5, 8, 8);
  ctx.fillStyle = colors.lightest;
  ctx.fillRect(x - 2, y + 7, 4, 4);
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 24, y - 2, 13, 9);
  ctx.fillRect(x + 11, y - 5, 12, 10);
  ctx.fillStyle = colors.light;
  ctx.fillRect(x - 22, y, 9, 5);
  ctx.fillRect(x + 13, y - 3, 8, 6);
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 25, y - 15, 2, 20);
  ctx.fillRect(x + 23, y - 15, 2, 20);
  ctx.fillRect(x - 32, y - 16, 16, 3);
  ctx.fillRect(x + 17, y - 16, 16, 3);
  ctx.fillStyle = BAND_FEATURES.metal;
  ctx.fillRect(x - 30, y - 15, 12, 1);
  ctx.fillRect(x + 19, y - 15, 12, 1);
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 7, y - 15 - pulse * 4, 2, 17);
  ctx.fillRect(x + 6, y - 15 + pulse * 4, 2, 17);
}

function drawPlayerSprite(x, y, character, facing, step, jam = null, riffPose = null) {
  const colors = PLAYER_PALETTES[character];
  const riffing = Boolean(riffPose && riffPose.character === character);
  const actionTime = jam?.time || riffPose?.time || 0;
  const pulse = (jam || riffing) ? Math.floor(actionTime * (character === 1 ? 13 : 10)) % 2 : 0;
  const danceStep = jam ? Math.floor(jam.time * 8) % 4 : 0;
  if (jam) {
    if (character === 0) {
      x += danceStep === 1 ? -2 : danceStep === 3 ? 2 : 0;
      y -= pulse * 2;
    } else if (character === 1) {
      y += pulse;
    } else {
      x += danceStep < 2 ? -3 : 3;
      y += pulse ? 1 : -1;
      step += jam.time * 12;
    }
  } else if (riffing) {
    const kick = Math.sin(clamp(riffPose.time / riffPose.duration, 0, 1) * Math.PI);
    x += Math.round(riffPose.dx * kick * 4);
    y += Math.round(riffPose.dy * kick * 3) - Math.round(kick * 2);
  }
  if (jam) {
    ctx.fillStyle = colors.darkest;
    const stageWidth = character === 1 ? 54 : 42;
    ctx.fillRect(x - stageWidth / 2, y + 12, stageWidth, 3);
  }
  drawPersonBase(x, y, colors, facing, step, false);
  ctx.fillStyle = BAND_FEATURES.skin;
  const strum = (jam || riffing) && character !== 1 ? (pulse ? 3 : -1) : 0;
  ctx.fillRect(x - 8, y - 2 + (character === 2 ? strum : 0), 3, 8);
  ctx.fillRect(x + 5, y - 2 + (character === 0 ? strum : 0), 3, 8);
  drawCharacterHead(x, y, character, facing);
  if (character === 0) drawStringInstrument(x + (facing === 1 ? -4 : 2), y, facing, colors, false, pulse);
  else if (character === 1) drawDrumKit(x, y + 4, colors, jam || (riffing ? riffPose : null), pulse);
  else drawStringInstrument(x + (facing === 1 ? -5 : 1), y, facing, colors, true, pulse);

  if (character === 0 && (jam || riffing)) {
    ctx.fillStyle = colors.lightest;
    ctx.fillRect(x + (facing === 1 ? -13 : 9), y - 1 + strum, 8, 2);
    ctx.fillStyle = colors.darkest;
    ctx.fillRect(x + (facing === 1 ? -12 : 10), y + 2 - strum, 6, 2);
  } else if (character === 1 && (jam || riffing)) {
    ctx.strokeStyle = colors.lightest;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 8);
    ctx.lineTo(x - 13, y - 20 + pulse * 10);
    ctx.moveTo(x + 6, y - 8);
    ctx.lineTo(x + 14, y - 10 - pulse * 10);
    ctx.stroke();
  } else if (character === 2 && (jam || riffing)) {
    ctx.fillStyle = colors.lightest;
    ctx.fillRect(x + (facing === 1 ? -9 : 6), y + (pulse ? 1 : 5), 5, 3);
    ctx.fillStyle = colors.darkest;
    ctx.fillRect(x - 10, y + 12, 7, 3);
    ctx.fillRect(x + 4, y + 12, 7, 3);
  }

  if (jam) {
    const orbit = jam.time * (character === 2 ? 5 : 7);
    const orbitRadius = character === 1 ? 34 : 29;
    for (let note = 0; note < 3; note += 1) {
      const angle = orbit + note * Math.PI * 2 / 3;
      const noteY = y - 16 + Math.sin(angle) * (character === 2 ? 11 : 17);
      drawMusicNote(
        x + Math.cos(angle) * orbitRadius,
        noteY,
        character === 2 && note === 0 ? 2 : 1,
        colors.darkest,
        note % 2 === 1,
      );
    }
  } else if (riffing) {
    const kick = clamp(riffPose.time / riffPose.duration, 0, 1);
    drawMusicNote(
      x + riffPose.dx * (15 + kick * 13),
      y - 12 + riffPose.dy * 8,
      character === 2 ? 2 : 1,
      colors.darkest,
      riffPose.dx < 0,
    );
  }
}

function drawGhostPerson(npc, x, y) {
  const variant = npc.variant % 8;
  const tall = variant === 2 || variant === 6;
  drawPersonBase(x, y - (tall ? 3 : 0), GHOST, npc.facing, performance.now() / (npc.fleeTimer > 0 ? 90 : 240));
  ctx.fillStyle = GHOST.darkest;
  if (variant === 0) {
    ctx.fillRect(x - 6, y - 16, 12, 3);
    ctx.fillRect(x - 8, y - 14, 4, 4);
  } else if (variant === 1) {
    ctx.fillRect(x - 7, y - 17, 14, 3);
    ctx.fillRect(x - 3, y - 21, 6, 4);
  } else if (variant === 2) {
    ctx.fillRect(x - 6, y - 20, 12, 5);
    ctx.fillRect(x + 5, y - 11, 3, 12);
  } else if (variant === 3) {
    ctx.fillRect(x - 7, y - 14, 3, 12);
    ctx.fillRect(x + 4, y - 14, 3, 12);
    ctx.fillStyle = GHOST.light;
    ctx.fillRect(x - 8, y + 1, 16, 9);
  } else if (variant === 4) {
    ctx.fillRect(x - 6, y - 16, 12, 3);
    ctx.fillRect(x - 6, y - 9, 5, 2);
    ctx.fillRect(x + 1, y - 9, 5, 2);
    ctx.fillRect(x - 1, y - 9, 2, 1);
  } else if (variant === 5) {
    ctx.fillRect(x - 7, y - 17, 4, 7);
    ctx.fillRect(x + 3, y - 17, 4, 7);
    ctx.fillRect(x + 6, y - 2, 5, 11);
  } else if (variant === 6) {
    ctx.fillRect(x - 5, y - 21, 10, 5);
    ctx.fillStyle = GHOST.light;
    ctx.fillRect(x - 8, y - 1, 16, 4);
  } else {
    ctx.fillRect(x - 7, y - 16, 14, 4);
    ctx.fillRect(x - 9, y - 12, 4, 7);
    ctx.fillRect(x + 5, y - 12, 4, 7);
    ctx.fillStyle = GHOST.lightest;
    ctx.fillRect(x - 8, y + 2, 3, 8);
    ctx.fillRect(x + 5, y + 2, 3, 8);
  }
}

function drawGhostAnimal(npc, x, y) {
  const left = npc.facing === 1;
  const direction = left ? -1 : 1;
  const step = Math.floor(performance.now() / (npc.fleeTimer > 0 ? 90 : 220)) % 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction, 1);
  ctx.fillStyle = GHOST.darkest;
  if (["pigeon", "duck", "chicken"].includes(npc.kind)) {
    ctx.fillRect(-7, -5, 13, 10);
    ctx.fillRect(3, -10, 8, 8);
    ctx.fillStyle = GHOST.light;
    ctx.fillRect(-4, -3, 7, 5);
    ctx.fillStyle = GHOST.lightest;
    ctx.fillRect(5, -8, 2, 2);
    ctx.fillStyle = GHOST.darkest;
    ctx.fillRect(11, -6, 5, 2);
    ctx.fillRect(-4, 5, 2, 5 + step);
    ctx.fillRect(3, 5, 2, 6 - step);
    if (npc.kind === "pigeon") ctx.fillRect(-11, -4, 5, 5);
    if (npc.kind === "chicken") ctx.fillRect(5, -13, 2, 3);
  } else if (npc.kind === "frog") {
    ctx.fillRect(-8, -4, 16, 10);
    ctx.fillRect(-9, -8, 5, 5);
    ctx.fillRect(4, -8, 5, 5);
    ctx.fillStyle = GHOST.lightest;
    ctx.fillRect(-7, -7, 2, 2);
    ctx.fillRect(5, -7, 2, 2);
    ctx.fillStyle = GHOST.darkest;
    ctx.fillRect(-12, 5, 8, 3);
    ctx.fillRect(4, 5, 8, 3);
  } else if (npc.kind === "turtle") {
    ctx.fillRect(-10, -5, 18, 11);
    ctx.fillRect(8, -2, 7, 6);
    ctx.fillStyle = GHOST.light;
    ctx.fillRect(-7, -3, 12, 7);
    ctx.fillStyle = GHOST.darkest;
    ctx.fillRect(-7, 6, 3, 3);
    ctx.fillRect(4, 6, 3, 3);
  } else {
    const longLegs = npc.kind === "deer" || npc.kind === "goat";
    const bodyLength = npc.kind === "rat" || npc.kind === "squirrel" ? 14 : 18;
    ctx.fillRect(-bodyLength / 2, -5, bodyLength, 11);
    ctx.fillRect(bodyLength / 2 - 2, -10, 9, 10);
    ctx.fillStyle = GHOST.light;
    ctx.fillRect(-bodyLength / 2 + 3, -3, bodyLength - 5, 6);
    ctx.fillStyle = GHOST.darkest;
    ctx.fillRect(-bodyLength / 2 + 2, 5, 3, (longLegs ? 10 : 6) + step);
    ctx.fillRect(bodyLength / 2 - 5, 5, 3, (longLegs ? 11 : 7) - step);
    ctx.fillRect(-bodyLength / 2 - 7, -5, 8, 3);
    if (["cat", "fox", "squirrel", "raccoon"].includes(npc.kind)) {
      ctx.fillRect(-bodyLength / 2 - 10, -10, 4, 8);
    }
    if (["cat", "dog", "fox", "rabbit", "deer", "goat", "pig"].includes(npc.kind)) {
      ctx.fillRect(bodyLength / 2, -14, 3, 5);
      ctx.fillRect(bodyLength / 2 + 4, -14, 3, 5);
    }
    if (npc.kind === "rabbit") ctx.fillRect(bodyLength / 2, -21, 3, 9);
    if (npc.kind === "rabbit") ctx.fillRect(bodyLength / 2 + 5, -21, 3, 9);
    if (npc.kind === "deer") ctx.fillRect(bodyLength / 2 + 1, -18, 1, 7);
    if (npc.kind === "deer") ctx.fillRect(bodyLength / 2 + 6, -18, 1, 7);
    if (npc.kind === "opossum") ctx.fillRect(-bodyLength / 2 - 14, -3, 8, 1);
    ctx.fillStyle = GHOST.lightest;
    ctx.fillRect(bodyLength / 2 + 3, -7, 2, 2);
  }
  ctx.restore();
}

function drawNpc(npc) {
  const x = Math.round(npc.x);
  const y = Math.round(npc.y + Math.sin(performance.now() / 260 + npc.phase));
  const moving = Math.abs(npc.vx) + Math.abs(npc.vy) > 0.2;
  if (moving && npc.trapped <= 0) {
    ctx.fillStyle = GHOST.light;
    ctx.fillRect(x - Math.sign(npc.vx || 1) * 10, y + 2, 3, 7);
    ctx.fillRect(x - Math.sign(npc.vx || 1) * 15, y + 7, 2, 4);
  }
  if (npc.kind === "person") drawGhostPerson(npc, x, y);
  else drawGhostAnimal(npc, x, y);
  if (npc.slowTimer > 0) {
    const pulse = Math.floor(performance.now() / 120) % 2;
    ctx.strokeStyle = GHOST.darkest;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(x - 10 - pulse, y + 10, 20 + pulse * 2, 5);
    ctx.setLineDash([]);
    bitmapText("~", x + 10, y - 20 - pulse, 1, GHOST.darkest, "center");
  }
  if (npc.trapped > 0) {
    const pulse = Math.floor(performance.now() / 160) % 2;
    ctx.strokeStyle = GHOST.darkest;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 14 - pulse, y - 20 - pulse, 28 + pulse * 2, 38 + pulse * 2);
    drawMusicNote(x - 19, y - 22, 1, GHOST.darkest);
    drawMusicNote(x + 18, y - 15, 1, GHOST.darkest, true);
  }
}

function drawVehicle(vehicle) {
  const x = Math.round(vehicle.x);
  const y = Math.round(vehicle.y);
  const vertical = vehicle.facing === 0 || vehicle.facing === 3;
  ctx.fillStyle = GB.darkest;
  if (vehicle.type === "boat") {
    ctx.fillRect(x - (vertical ? 7 : 15), y - (vertical ? 15 : 7), vertical ? 14 : 30, vertical ? 30 : 14);
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(x - (vertical ? 4 : 11), y - (vertical ? 11 : 4), vertical ? 8 : 22, vertical ? 22 : 8);
    ctx.fillStyle = GB.dark;
    ctx.fillRect(x - 3, y - 3, 6, 6);
    return;
  }
  const length = vehicle.type === "bike" ? 17 : vehicle.type === "van" ? 27 : 23;
  const width = vehicle.type === "bike" ? 7 : 13;
  ctx.fillRect(x - (vertical ? width / 2 : length / 2), y - (vertical ? length / 2 : width / 2), vertical ? width : length, vertical ? length : width);
  ctx.fillStyle = vehicle.type === "van" ? GB.lightest : GB.light;
  ctx.fillRect(x - (vertical ? width / 2 - 2 : length / 2 - 3), y - (vertical ? length / 2 - 3 : width / 2 - 2), vertical ? width - 4 : length - 6, vertical ? length - 6 : width - 4);
  ctx.fillStyle = GB.dark;
  if (vertical) ctx.fillRect(x - 3, y - 4, 6, 7);
  else ctx.fillRect(x - 4, y - 3, 7, 6);
}

function drawSlime(slime) {
  const x = Math.round(slime.x);
  const danceBob = slime.dance > 0 ? Math.abs(Math.round(Math.sin(slime.wobble) * 4)) : 0;
  const y = Math.round(slime.y + (slime.emerge > 0 ? 8 * (slime.emerge / 2) : 0) - danceBob);
  const wobble = Math.round(Math.sin(slime.wobble) * (slime.dance > 0 ? 3 : 2));
  ctx.fillStyle = GREEN.darkest;
  ctx.fillRect(x - 9 - wobble, y + 4, 18 + wobble * 2, 4);
  ctx.fillStyle = GREEN.light;
  ctx.fillRect(x - 7 - wobble, y - 5, 14 + wobble * 2, 10);
  ctx.fillStyle = GREEN.lightest;
  ctx.fillRect(x - 4, y - 9, 8, 4);
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(x - 4, y - 3, 2, 2);
  ctx.fillRect(x + 2, y - 3, 2, 2);
  if (slime.dance > 0) {
    drawMusicNote(x - 13, y - 18, 1, GREEN.darkest);
    drawMusicNote(x + 14, y - 23, 1, GREEN.darkest, true);
  }
}

function drawCashPile(pile) {
  const x = Math.round(pile.x);
  const y = Math.round(pile.y + Math.sin(pile.phase) * 2);
  ctx.fillStyle = GREEN.darkest;
  ctx.fillRect(x - 10, y + 1, 18, 7);
  ctx.fillRect(x - 7, y - 5, 16, 7);
  ctx.fillRect(x - 9, y - 10, 14, 7);
  ctx.fillStyle = GREEN.light;
  ctx.fillRect(x - 7, y + 3, 12, 3);
  ctx.fillRect(x - 4, y - 3, 10, 3);
  ctx.fillRect(x - 6, y - 8, 9, 3);
  bitmapText("$", x, y - 7, 1, GREEN.darkest, "center");
}

function drawFoodPickup(pickup) {
  const x = Math.round(pickup.x);
  const y = Math.round(pickup.y + Math.sin(pickup.phase) * 2);
  const kind = pickup.food.kind;
  const colors = FOOD_COLORS[kind] || FOOD_COLORS.mushroom;
  ctx.fillStyle = GB.darkest;
  if (kind === "apple") {
    ctx.fillRect(x - 7, y - 5, 14, 12);
    ctx.fillRect(x - 3, y - 8, 7, 17);
    ctx.fillRect(x, y - 12, 2, 5);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 5, y - 4, 10, 10);
    ctx.fillRect(x - 2, y - 6, 5, 13);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x + 1, y - 11, 5, 3);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 4, y - 3, 3, 4);
  } else if (kind === "carrot") {
    ctx.fillRect(x - 6, y - 8, 12, 6);
    ctx.fillRect(x - 4, y - 2, 8, 6);
    ctx.fillRect(x - 2, y + 4, 4, 7);
    ctx.fillRect(x - 8, y - 12, 4, 5);
    ctx.fillRect(x + 4, y - 12, 4, 5);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 4, y - 6, 8, 5);
    ctx.fillRect(x - 3, y - 1, 6, 5);
    ctx.fillRect(x - 1, y + 4, 2, 5);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 6, y - 11, 3, 5);
    ctx.fillRect(x + 3, y - 11, 3, 5);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 2, y - 5, 2, 4);
  } else if (kind === "broccoli") {
    ctx.fillRect(x - 9, y - 8, 18, 9);
    ctx.fillRect(x - 6, y - 12, 7, 7);
    ctx.fillRect(x + 2, y - 11, 7, 7);
    ctx.fillRect(x - 2, y, 5, 10);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 7, y - 7, 14, 6);
    ctx.fillRect(x - 5, y - 10, 6, 5);
    ctx.fillRect(x + 2, y - 9, 5, 5);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 1, y, 3, 8);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 5, y - 6, 4, 3);
    ctx.fillRect(x + 2, y - 7, 3, 3);
  } else if (kind === "tofu") {
    ctx.fillRect(x - 8, y - 8, 16, 16);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 6, y - 6, 12, 12);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 4, y - 4, 6, 5);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 3, y - 3, 2, 2);
    ctx.fillRect(x + 2, y + 1, 2, 2);
  } else if (kind === "avocado") {
    ctx.fillRect(x - 7, y - 8, 14, 16);
    ctx.fillRect(x - 4, y - 11, 8, 22);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 5, y - 7, 10, 14);
    ctx.fillRect(x - 2, y - 9, 5, 18);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 3, y - 5, 6, 11);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 2, y, 4, 4);
  } else if (kind === "berries") {
    for (const [bx, by] of [[-5, -4], [1, -5], [-2, 1], [4, 1], [-5, 6]]) {
      ctx.fillStyle = GB.darkest;
      ctx.fillRect(x + bx, y + by, 6, 6);
      ctx.fillStyle = colors.primary;
      ctx.fillRect(x + bx + 1, y + by + 1, 4, 4);
      ctx.fillStyle = colors.light;
      ctx.fillRect(x + bx + 1, y + by + 1, 1, 1);
    }
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 1, y - 10, 2, 5);
  } else if (kind === "banana") {
    ctx.fillRect(x - 8, y - 7, 5, 10);
    ctx.fillRect(x - 5, y, 8, 7);
    ctx.fillRect(x + 2, y + 3, 7, 4);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 6, y - 5, 2, 8);
    ctx.fillRect(x - 4, y + 1, 7, 4);
    ctx.fillRect(x + 2, y + 4, 5, 2);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 5, y - 4, 1, 5);
    ctx.fillRect(x - 2, y + 2, 5, 1);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 8, y - 7, 3, 2);
  } else if (kind === "cauliflower-pizza") {
    ctx.fillRect(x - 9, y - 8, 18, 4);
    ctx.fillRect(x - 7, y - 4, 14, 4);
    ctx.fillRect(x - 5, y, 10, 4);
    ctx.fillRect(x - 3, y + 4, 6, 5);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 7, y - 6, 14, 2);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 5, y - 3, 10, 3);
    ctx.fillRect(x - 3, y, 6, 6);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 5, y - 5, 3, 3);
    ctx.fillRect(x + 2, y - 3, 3, 3);
    ctx.fillRect(x - 1, y + 2, 3, 3);
  } else if (kind === "bean-burger") {
    ctx.fillRect(x - 9, y - 8, 18, 5);
    ctx.fillRect(x - 11, y - 3, 22, 4);
    ctx.fillRect(x - 9, y + 1, 18, 7);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 6, y - 6, 12, 2);
    ctx.fillRect(x - 7, y + 3, 14, 3);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 9, y - 2, 18, 3);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 7, y + 1, 14, 2);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 7, y + 3, 14, 2);
  } else if (kind === "vegan-fries") {
    ctx.fillRect(x - 8, y - 4, 16, 14);
    ctx.fillRect(x - 7, y - 12, 3, 11);
    ctx.fillRect(x - 2, y - 14, 3, 13);
    ctx.fillRect(x + 3, y - 11, 3, 10);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 6, y - 11, 2, 10);
    ctx.fillRect(x - 1, y - 13, 2, 12);
    ctx.fillRect(x + 4, y - 10, 2, 9);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 6, y - 2, 12, 10);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 3, y + 1, 6, 2);
  } else if (kind === "tempeh-taco") {
    ctx.fillRect(x - 10, y - 1, 20, 8);
    ctx.fillRect(x - 7, y - 7, 14, 9);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 8, y, 16, 5);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 5, y - 5, 10, 4);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 5, y - 4, 3, 4);
    ctx.fillRect(x, y - 6, 3, 5);
    ctx.fillRect(x + 5, y - 3, 2, 4);
  } else if (kind === "vegan-donut") {
    ctx.fillRect(x - 8, y - 9, 16, 18);
    ctx.fillRect(x - 11, y - 6, 22, 12);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 8, y - 7, 16, 14);
    ctx.fillRect(x - 9, y - 4, 18, 8);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 7, y - 6, 14, 6);
    ctx.fillRect(x - 8, y - 3, 16, 4);
    ctx.fillStyle = GB.darkest;
    ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 6, y - 5, 3, 2);
    ctx.fillRect(x + 4, y - 3, 2, 2);
  } else if (kind === "seitan-wings") {
    ctx.fillRect(x - 10, y - 8, 9, 14);
    ctx.fillRect(x + 1, y - 6, 9, 14);
    ctx.fillRect(x - 6, y + 5, 12, 5);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 8, y - 6, 6, 11);
    ctx.fillRect(x + 3, y - 4, 5, 11);
    ctx.fillRect(x - 4, y + 5, 8, 3);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 7, y - 5, 3, 7);
    ctx.fillRect(x + 4, y - 3, 3, 7);
  } else if (kind === "cashew-nachos") {
    ctx.fillRect(x - 10, y + 5, 20, 4);
    ctx.fillRect(x - 8, y - 3, 7, 9);
    ctx.fillRect(x - 1, y - 9, 8, 15);
    ctx.fillRect(x + 5, y - 4, 6, 10);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 6, y - 1, 5, 6);
    ctx.fillRect(x, y - 7, 5, 11);
    ctx.fillRect(x + 6, y - 2, 4, 6);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 4, y + 1, 3, 3);
    ctx.fillRect(x + 2, y - 2, 3, 3);
  } else {
    ctx.fillRect(x - 9, y - 7, 18, 8);
    ctx.fillRect(x - 6, y - 11, 12, 8);
    ctx.fillRect(x - 2, y, 5, 10);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(x - 7, y - 6, 14, 6);
    ctx.fillRect(x - 5, y - 9, 10, 5);
    ctx.fillStyle = colors.light;
    ctx.fillRect(x - 4, y - 8, 3, 3);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x - 1, y, 3, 8);
  }
}

function drawWorldPickups() {
  for (const pile of game.cashPiles) drawCashPile(pile);
  for (const pickup of game.foodPickups) drawFoodPickup(pickup);
}

function drawBills() {
  for (const bill of game.bills) {
    const bob = Math.round(Math.sin(bill.wobble) * 2);
    const x = Math.round(bill.x);
    const y = Math.round(bill.y + bob);
    ctx.fillStyle = GREEN.darkest;
    ctx.fillRect(x - 7, y - 5, 14, 10);
    ctx.fillStyle = GREEN.light;
    ctx.fillRect(x - 5, y - 3, 10, 6);
    ctx.fillStyle = GREEN.lightest;
    ctx.fillRect(x - 4, y - 2, 3, 1);
    ctx.fillRect(x + 1, y + 1, 3, 1);
    bitmapText("$", x, y - 3, 1, GREEN.darkest, "center");
  }
}

function drawCityColorEffects() {
  if (!game.coloredCityCells.size) return;
  const minCellX = Math.max(0, Math.floor(camera.x / CITY_COLOR_CELL) - 1);
  const maxCellX = Math.min(
    Math.ceil(streetMap.width / CITY_COLOR_CELL) - 1,
    Math.ceil((camera.x + worldViewWidth()) / CITY_COLOR_CELL) + 1,
  );
  const minCellY = Math.max(0, Math.floor(camera.y / CITY_COLOR_CELL) - 1);
  const maxCellY = Math.min(
    Math.ceil(streetMap.height / CITY_COLOR_CELL) - 1,
    Math.ceil((camera.y + worldViewHeight()) / CITY_COLOR_CELL) + 1,
  );
  ctx.save();
  ctx.globalCompositeOperation = "color";
  ctx.globalAlpha = 0.9;
  for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
    for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
      const key = cellY * CITY_COLOR_STRIDE + cellX;
      if (!game.coloredCityCells.has(key)) continue;
      const character = game.coloredCityCells.get(key);
      ctx.fillStyle = (PLAYER_PALETTES[character] || PLAYER_PALETTES[0]).light;
      ctx.fillRect(
        cellX * CITY_COLOR_CELL,
        cellY * CITY_COLOR_CELL,
        CITY_COLOR_CELL + 0.5,
        CITY_COLOR_CELL + 0.5,
      );
    }
  }
  ctx.restore();
}

function drawEffects() {
  for (const effect of game.effects) {
    const amount = 1 - effect.life / effect.maxLife;
    if (effect.type === "ooze") {
      ctx.save();
      ctx.globalAlpha = clamp(effect.life / effect.maxLife, 0, 0.8);
      ctx.fillStyle = GREEN.light;
      const width = 4 + Math.round(amount * 7);
      ctx.fillRect(effect.x - width / 2, effect.y, width, 3);
      ctx.fillStyle = GREEN.darkest;
      ctx.fillRect(effect.x - 1, effect.y + 2, 3, 2);
      ctx.restore();
      continue;
    }
    if (effect.type === "slimeBurst") {
      const radius = Math.round(8 + amount * 34);
      ctx.strokeStyle = GREEN.darkest;
      ctx.lineWidth = 3;
      ctx.strokeRect(effect.x - radius, effect.y - radius, radius * 2, radius * 2);
      ctx.fillStyle = GREEN.light;
      ctx.fillRect(effect.x - radius, effect.y - 2, 5, 5);
      ctx.fillRect(effect.x + radius - 5, effect.y + 2, 5, 5);
      continue;
    }
    if (effect.type === "food" || effect.type === "jumpDust") {
      ctx.fillStyle = effect.type === "food" ? (effect.color || GB.lightest) : GB.darkest;
      const radius = Math.round(5 + amount * 24);
      for (let index = 0; index < 8; index += 1) {
        const angle = index * Math.PI / 4;
        ctx.fillRect(effect.x + Math.cos(angle) * radius - 2, effect.y + Math.sin(angle) * radius - 2, 4, 4);
      }
      continue;
    }
    if (effect.type === "teleport") {
      const radius = Math.round(8 + amount * 54);
      ctx.strokeStyle = GB.darkest;
      ctx.lineWidth = amount < 0.5 ? 5 : 2;
      ctx.strokeRect(effect.x - radius, effect.y - radius, radius * 2, radius * 2);
      ctx.strokeRect(effect.x - radius / 2, effect.y - radius, radius, radius * 2);
      continue;
    }
    ctx.fillStyle = GB.darkest;
    ctx.strokeStyle = GB.darkest;
    ctx.lineWidth = 2;
    if (effect.type === "burst" || effect.type === "ring") {
      const radius = Math.round(10 + amount * (effect.type === "ring" ? 85 : 42));
      ctx.strokeRect(effect.x - radius, effect.y - radius, radius * 2, radius * 2);
    } else if (effect.type === "riff") {
      const elapsed = effect.maxLife - effect.life;
      if (elapsed > effect.actionLife) continue;
      const actionAmount = clamp(elapsed / effect.actionLife, 0, 1);
      const reach = Math.max(18, Math.round(effect.range * Math.min(1, actionAmount * 1.85)));
      ctx.save();
      ctx.translate(Math.round(effect.x), Math.round(effect.y));
      ctx.rotate(Math.atan2(effect.dy, effect.dx));
      ctx.globalAlpha = clamp(1.2 - actionAmount, 0, 1);
      if (effect.character === 0) {
        ctx.strokeStyle = PLAYER_PALETTES[0].darkest;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        for (let step = 16; step <= reach; step += 8) {
          ctx.lineTo(step, Math.sin(step * 0.19 + actionAmount * 10) * (4 + step * 0.035));
        }
        ctx.stroke();
        for (let note = 29; note < reach; note += 31) {
          drawMusicNote(note, Math.sin(note * 0.19 + actionAmount * 10) * 9 - 8, 1, PLAYER_PALETTES[0].light, note % 2 === 0);
        }
      } else if (effect.character === 1) {
        for (let beat = 0; beat < 4; beat += 1) {
          const center = reach - beat * 27;
          if (center < 10) continue;
          const size = 7 + beat * 4 + Math.round(actionAmount * 4);
          ctx.strokeStyle = beat % 2 ? PLAYER_PALETTES[1].light : PLAYER_PALETTES[1].darkest;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(center, 0, size, 0, Math.PI * 2);
          ctx.stroke();
          drawMusicNote(center + 3, -size - 7, 1, PLAYER_PALETTES[1].darkest, beat % 2 === 1);
        }
      } else {
        const spread = 7 + Math.round(reach * 0.1);
        ctx.fillStyle = PLAYER_PALETTES[2].darkest;
        for (let step = 8; step < reach; step += 5) {
          const wave = Math.sin(step * 0.13 + actionAmount * 12) * spread;
          ctx.fillRect(step, wave - 2, 7, 5);
          ctx.fillRect(step, -wave - 1, 7, 3);
        }
        for (let note = 35; note < reach; note += 42) {
          const wave = Math.sin(note * 0.13 + actionAmount * 12) * spread;
          drawMusicNote(note, wave - 12, 2, PLAYER_PALETTES[2].light, note % 2 === 1);
        }
      }
      ctx.restore();
    } else if (effect.type === "beam") {
      ctx.lineWidth = amount < 0.5 ? 6 : 3;
      ctx.beginPath();
      ctx.moveTo(effect.x, effect.y);
      ctx.lineTo(effect.x2, effect.y2);
      ctx.stroke();
    } else if (effect.type === "wave") {
      const width = Math.round(20 + amount * 110);
      ctx.fillRect(effect.x - width, effect.y - 12, width * 2, 3);
      ctx.fillRect(effect.x - width, effect.y + 10, width * 2, 3);
    }
  }
  for (const float of game.floats) {
    bitmapText(float.text, float.x, float.y, 1, float.color || GB.darkest, "center", 24);
  }
}

function drawObjective() {
  const target = objectiveTarget();
  if (!target) return;
  const pulse = Math.floor(performance.now() / 180) % 2;
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(target.x - 2, target.y - 27 - pulse * 3, 5, 9);
  ctx.fillRect(target.x - 6, target.y - 23 - pulse * 3, 13, 3);
}

function drawWorld() {
  drawTerrain();
  drawMappedParks();
  drawMappedBuildings();
  drawRoads();
  drawLandmarks();
  drawCityColorEffects();
  drawTrashProps();
  drawWorldPickups();
  drawBills();
  drawObjective();
  for (const vehicle of game.vehicles) drawVehicle(vehicle);
  for (const npc of game.npcs) drawNpc(npc);
  for (const slime of game.slimes) drawSlime(slime);
  if (!game.vehicleId) {
    if (game.jump) {
      ctx.fillStyle = GB.dark;
      const shadowWidth = Math.max(5, 16 - game.jump.height * 0.25);
      ctx.fillRect(game.player.x - shadowWidth / 2, game.player.y + 12, shadowWidth, 3);
    }
    if (game.jam?.trio) {
      drawPlayerSprite(game.player.x - 25, game.player.y + 2, 0, 2, 0, game.jam);
      drawPlayerSprite(game.player.x, game.player.y - 4, 1, 0, 0, game.jam);
      drawPlayerSprite(game.player.x + 25, game.player.y + 2, 2, 1, 0, game.jam);
    } else {
      const jumpHeight = game.jump?.height || 0;
      drawPlayerSprite(
        Math.round(game.player.x),
        Math.round(game.player.y - jumpHeight),
        game.character,
        game.player.facing,
        game.player.step,
        game.jam,
        game.riffPose,
      );
    }
  }
  drawEffects();
}

function drawHud() {
  const level = levelFromCash();
  const current = dexById.get(game.selectedTrackId) || dexTracks[0];
  ctx.fillStyle = GB.darkest;
  ctx.fillRect(0, 0, VIEW_W, 65);
  ctx.fillStyle = GB.lightest;
  ctx.fillRect(0, 63, VIEW_W, 2);

  ctx.fillStyle = GB.dark;
  ctx.fillRect(2, 3, 16, 17);
  ctx.fillRect(20, 3, 190, 17);
  drawMusicNote(9, 12, 1, game.musicMuted ? GB.light : GB.lightest);
  if (game.musicMuted) {
    ctx.strokeStyle = GB.lightest;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, 4);
    ctx.lineTo(17, 19);
    ctx.stroke();
  }
  marqueeBitmapText(current?.title || "ADUGARI", 23, 7, 184, 1, GB.lightest);
  bitmapText(`$${game.pocket}`, 265, 7, 1, GREEN.light, "right", 9);
  bitmapText(`${CHARACTERS[game.character].name} LV${String(level).padStart(2, "0")}`, 5, 20, 1, GB.light, "left", 22);
  bitmapText(`PAID ${game.paidCount}`, 265, 20, 1, GB.light, "right", 14);
  bitmapText("JAM", 5, 33, 1, GB.lightest, "left", 5);
  ctx.fillStyle = GB.dark;
  ctx.fillRect(29, 34, 91, 5);
  ctx.fillStyle = game.groove >= 100 ? PLAYER_PALETTES[game.character].light : GB.lightest;
  ctx.fillRect(29, 34, Math.round(91 * game.groove / 100), 5);
  const actionStatus = game.jam ? "JAMMING" : game.riffPose ? "RIFFING" : "";
  if (actionStatus) {
    bitmapText(actionStatus, 265, 32, 1, PLAYER_PALETTES[game.character].light, "right", 12);
  }

  const activeFood = Object.entries(game.foodBoosts)
    .filter(([, seconds]) => seconds > 0)
    .sort((left, right) => right[1] - left[1])[0];
  const prompt = interactionPrompt();
  let contextText = prompt;
  let contextColor = GB.lightest;
  if (!contextText && (game.slimeBoostTimer > 0 || activeFood)) {
    contextText = [
      game.slimeBoostTimer > 0
        ? `SLIME X${slimeMultiplier().toFixed(1)} ${Math.ceil(game.slimeBoostTimer)}S`
        : "",
      activeFood ? `${game.foodBoostLabel || activeFood[0].toUpperCase()} ${Math.ceil(activeFood[1])}S` : "",
    ].filter(Boolean).join(" // ");
    contextColor = game.slimeBoostTimer > 0 ? GREEN.light : GB.lightest;
  }
  const target = objectiveTarget();
  if (!contextText && target) {
    contextText = `AUDIENCE ${Math.round(distance(controlledPosition(), target) / 16)}T`;
  }
  ctx.fillStyle = GB.dark;
  ctx.fillRect(0, 45, VIEW_W, 17);
  bitmapText(contextText || objectiveText(), 5, 50, 1, contextColor, "left", 37);
  if (target && !prompt) {
    const focus = controlledPosition();
    const angle = Math.atan2(target.y - focus.y, target.x - focus.x);
    ctx.save();
    ctx.translate(258, 53);
    ctx.rotate(Math.round(angle / (Math.PI / 4)) * (Math.PI / 4));
    ctx.fillStyle = GB.lightest;
    ctx.fillRect(-5, -2, 10, 4);
    ctx.fillRect(2, -5, 4, 10);
    ctx.restore();
  }
}

function render() {
  const focus = controlledPosition();
  const viewWidth = worldViewWidth();
  const viewHeight = worldViewHeight();
  camera.x = clamp(focus.x - viewWidth / 2, 0, Math.max(0, streetMap.width - viewWidth));
  camera.y = clamp(focus.y - viewHeight / 2, 0, Math.max(0, streetMap.height - viewHeight));
  ctx.save();
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);
  drawWorld();
  ctx.restore();
  if (game.era === "old") {
    ctx.fillStyle = GB.darkest;
    for (let y = 45; y < VIEW_H; y += 4) {
      for (let x = (y / 4) % 2 ? 0 : 2; x < VIEW_W; x += 4) ctx.fillRect(x, y, 1, 1);
    }
  }
  if (game.started) drawHud();
  if (game.levelFlash > 0) {
    ctx.strokeStyle = GB.lightest;
    ctx.lineWidth = 5;
    ctx.strokeRect(3, 3, VIEW_W - 6, VIEW_H - 6);
  }
}

function setPaused(paused) {
  if (!game.started || game.dexOpen) return;
  game.paused = paused;
  ui.pauseScreen.hidden = !paused;
  if (paused) {
    keys.clear();
    resetJoystick();
    mapPointers.clear();
    pinchStart = null;
    saveGame(true);
  }
}

function resetPosition() {
  game.vehicleId = null;
  game.jam = null;
  game.riffPose = null;
  game.jump = null;
  Object.assign(game.player, SPAWN, { facing: 0, invulnerable: 2 });
  const car = game.vehicles.find((vehicle) => vehicle.id === "car");
  Object.assign(car, VEHICLE_STARTS.find((vehicle) => vehicle.id === "car"));
  setPaused(false);
  resetJoystick();
  announce("BACK AT MOM'S BASEMENT.");
}

function hasProgress() {
  return game.characterChosen || game.careerCash > 0 || game.paidCount > 0 ||
    game.learnedTrackIds.size > 1 || game.trashSearchedIds.size > 0;
}

function startGameSession(message) {
  game.started = true;
  game.paused = false;
  ui.startScreen.hidden = true;
  ui.pauseScreen.hidden = true;
  ui.characterSelect.hidden = true;
  updateCharacterButtons();
  music.playSelected().catch(() => showBandcamp());
  announce(message, 3000);
  saveGame(true);
}

function showCharacterSelect() {
  game.started = false;
  game.paused = false;
  game.dexOpen = false;
  ui.startScreen.hidden = true;
  ui.pauseScreen.hidden = true;
  ui.flangadex.hidden = true;
  ui.characterSelect.hidden = false;
  keys.clear();
  resetJoystick();
}

function chooseStartingCharacter(index) {
  game.character = clamp(Number(index), 0, CHARACTERS.length - 1);
  game.characterChosen = true;
  startGameSession(`${CHARACTERS[game.character].name} // #001 ADUGARI // JAM FOR THE CROWD // COLLECT GREEN BILLS`);
}

async function beginGame() {
  if (!mapReady || !dexReady) return;
  if (!game.characterChosen) {
    showCharacterSelect();
    return;
  }
  startGameSession("#001 ADUGARI // FIND AN AUDIENCE");
}

function newGame() {
  if (!window.confirm("Erase this local Flangame save and start over?")) return;
  try {
    localStorage.removeItem(SAVE_KEY);
    for (const key of LEGACY_SAVE_KEYS) localStorage.removeItem(key);
  } catch {
    // A new in-memory game still works.
  }
  music.stop();
  game = freshState();
  normalizeProgress();
  generateRoadsideTrash();
  generateWorldPickups();
  arrangeNpcCrowds(controlledPosition());
  showCharacterSelect();
}

function bindControls() {
  window.addEventListener("keydown", (event) => {
    const controlled = [
      "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Enter",
      "KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyQ", "KeyF", "KeyZ", "KeyX", "KeyC", "KeyV",
      "ShiftLeft", "ShiftRight", "Digit1", "Digit2", "Digit3", "Escape",
    ];
    if (controlled.includes(event.code)) event.preventDefault();
    if (!ui.characterSelect.hidden) {
      if (event.code === "Digit1") chooseStartingCharacter(0);
      if (event.code === "Digit2") chooseStartingCharacter(1);
      if (event.code === "Digit3") chooseStartingCharacter(2);
      return;
    }
    if (game.dexOpen) {
      if (event.code === "Escape" || event.code === "KeyX") closeDex();
      return;
    }
    keys.add(event.code);
    if (event.repeat) return;
    if (event.code === "Space" || event.code === "KeyZ") touchPrimaryAction();
    if (event.code === "KeyE") interact();
    if (event.code === "KeyX" || event.code === "ShiftLeft" || event.code === "ShiftRight") useAbility();
    if (event.code === "KeyC") jumpPlayer();
    if (event.code === "KeyV") teleportRandom();
    if (event.code === "KeyQ") switchCharacter();
    if (event.code === "Digit1") switchCharacter(0);
    if (event.code === "Digit2") switchCharacter(1);
    if (event.code === "Digit3") switchCharacter(2);
    if (event.code === "Enter" || event.code === "KeyF") openDex(false);
    if (event.code === "Escape") setPaused(!game.paused);
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  window.addEventListener("blur", () => {
    keys.clear();
    resetJoystick();
    mapPointers.clear();
    pinchStart = null;
  });

  const releaseJoystick = (event) => {
    if (joystickInput.pointerId !== event.pointerId) return;
    if (event.cancelable) event.preventDefault();
    resetJoystick();
  };
  ui.joystick.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (joystickInput.pointerId !== null && joystickInput.pointerId !== event.pointerId) resetJoystick();
    joystickInput.pointerId = event.pointerId;
    joystickInput.pointerType = event.pointerType;
    ui.joystick.setPointerCapture?.(event.pointerId);
    ui.joystick.classList.add("active");
    updateJoystickPosition(event.clientX, event.clientY);
  });
  ui.joystick.addEventListener("pointermove", (event) => {
    if (joystickInput.pointerId !== event.pointerId) return;
    event.preventDefault();
    if (event.pointerType !== "touch" && event.buttons === 0) {
      resetJoystick();
      return;
    }
    updateJoystickPosition(event.clientX, event.clientY);
  });
  ui.joystick.addEventListener("pointerup", releaseJoystick);
  ui.joystick.addEventListener("pointercancel", releaseJoystick);
  ui.joystick.addEventListener("lostpointercapture", releaseJoystick);
  window.addEventListener("pointerup", releaseJoystick, true);
  window.addEventListener("pointercancel", releaseJoystick, true);
  window.addEventListener("pagehide", resetJoystick);

  const mapPointerEnd = (event) => {
    if (!mapPointers.has(event.pointerId)) return;
    event.preventDefault();
    mapPointers.delete(event.pointerId);
    pinchStart = null;
    if (mapPointers.size >= 2) {
      const points = [...mapPointers.values()];
      pinchStart = {
        distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y),
        zoom: camera.zoom,
      };
    }
  };
  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const hudX = (event.clientX - rect.left) * VIEW_W / rect.width;
    const hudY = (event.clientY - rect.top) * VIEW_H / rect.height;
    if (game.started && !game.dexOpen && hudY >= 0 && hudY <= 23) {
      if (hudX >= 0 && hudX <= 20) toggleMusic();
      else if (hudX <= 212) openDex(game.paused);
      else return;
      event.preventDefault();
      return;
    }
    if (event.pointerType !== "touch") return;
    event.preventDefault();
    canvas.setPointerCapture?.(event.pointerId);
    mapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (mapPointers.size === 2) {
      const points = [...mapPointers.values()];
      pinchStart = {
        distance: Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)),
        zoom: camera.zoom,
      };
    }
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!mapPointers.has(event.pointerId)) return;
    event.preventDefault();
    mapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (!pinchStart || mapPointers.size < 2) return;
    const points = [...mapPointers.values()];
    const currentDistance = Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y));
    camera.zoom = clamp(pinchStart.zoom * currentDistance / pinchStart.distance, MIN_CAMERA_ZOOM, MAX_CAMERA_ZOOM);
  });
  canvas.addEventListener("pointerup", mapPointerEnd);
  canvas.addEventListener("pointercancel", mapPointerEnd);
  canvas.addEventListener("lostpointercapture", mapPointerEnd);

  ui.touchA.addEventListener("pointerdown", (event) => { event.preventDefault(); touchPrimaryAction(); });
  ui.touchB.addEventListener("pointerdown", (event) => { event.preventDefault(); useAbility(); });
  ui.touchBand.addEventListener("pointerdown", (event) => { event.preventDefault(); switchCharacter(); });
  ui.touchJump.addEventListener("pointerdown", (event) => { event.preventDefault(); jumpPlayer(); });
  ui.touchTeleport.addEventListener("pointerdown", (event) => { event.preventDefault(); teleportRandom(); });
  ui.startButton.addEventListener("click", beginGame);
  ui.pauseButton.addEventListener("click", () => setPaused(!game.paused));
  ui.resumeButton.addEventListener("click", () => setPaused(false));
  ui.resetButton.addEventListener("click", resetPosition);
  ui.newGameButton.addEventListener("click", newGame);
  for (const button of ui.characterButtons) {
    button.addEventListener("click", () => chooseStartingCharacter(button.dataset.character));
  }
  ui.dexButton.addEventListener("click", () => openDex(game.paused));
  ui.dexClose.addEventListener("click", closeDex);
  ui.dexDetailBack.addEventListener("click", hideDexDetail);
  ui.dexList.addEventListener("click", (event) => {
    const row = event.target.closest("[data-track-id]");
    if (!row) return;
    const id = Number(row.dataset.trackId);
    if (!game.learnedTrackIds.has(id)) {
      const index = dexTracks.findIndex((track) => track.id === id);
      announce(`LOCKED // EARN $${songCash(index)} CAREER CASH OR FIND IT IN BALTIMORE.`);
      return;
    }
    showDexDetail(id);
  });
  ui.dexPlay.addEventListener("click", () => {
    if (!dexDetailId || !game.learnedTrackIds.has(dexDetailId)) return;
    game.selectedTrackId = dexDetailId;
    game.newTrackIds.delete(dexDetailId);
    renderDex();
    music.playSelected().catch(() => showBandcamp());
    announce(`NOW PLAYING: ${dexById.get(dexDetailId)?.title || "FLANGUAGE"}`, 2300);
    saveGame(true);
  });
  ui.closeBandcamp.addEventListener("click", hideBandcamp);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetJoystick();
    if (document.hidden && game.started && !game.paused && !game.dexOpen) setPaused(true);
  });
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("selectstart", (event) => event.preventDefault());
  document.addEventListener("dragstart", (event) => event.preventDefault());
  document.addEventListener("dblclick", (event) => event.preventDefault(), { passive: false });
  for (const gestureEvent of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(gestureEvent, (event) => event.preventDefault(), { passive: false });
  }
}

function frame(now) {
  const dt = clamp((now - lastFrame) / 1000, 0, 0.033);
  lastFrame = now;
  if (game.started && !game.paused && !game.dexOpen) update(dt);
  render();
  requestAnimationFrame(frame);
}

function initialize() {
  loadGame();
  updateCharacterButtons();
  bindControls();
  ui.startButton.disabled = true;
  loadData().catch(() => {
    mapReady = true;
    dexReady = true;
    ui.startButton.disabled = false;
    ui.startButton.textContent = "START";
    ui.startStatus.textContent = "OFFLINE FALLBACK // #001 ADUGARI";
  });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
  requestAnimationFrame(frame);
}

initialize();
