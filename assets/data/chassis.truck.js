// chassis.truck.js — MCD1 trophy-truck spaceframe, seeded from build-spec.json (v0.1).
//
// Coordinate system (from build-spec.json, units = mm):
//   X = longitudinal, +X forward · Y = vertical, +Y up · Z = lateral, +Z to the LEFT.
//   Origin (0,0,0) at the rear-axle centreline, on the ground.
//
// HONESTY: this geometry is REPRESENTATIVE — tube centrelines synthesised from measured
// key dimensions (stations, rail heights, cage keypoints), NOT a CAD/LiDAR scan. Component
// positions are published/known envelopes. All clearances are indicative; confirm in CAD.
// A real glTF model or splat scan drops into the same partSlots later (one-field swap).

const RAIL_HW = 560;   // rail half-width
const CAGE_HW = 545;   // cage half-width
const ROOF_HW = 500;   // roof rail half-width
const ROOF_Y = 1660;

// Lower-rail height at each longitudinal station (build-spec chassis.rail_y).
const stations = [
  { id: 'rb', x: -820, y: 540 },  // rear bumper
  { id: 'ra', x: 0,    y: 380 },  // rear axle
  { id: 'cr', x: 1200, y: 360 },  // cab rear (B-pillar)
  { id: 'cf', x: 2150, y: 365 },  // cab front (A-pillar / cowl)
  { id: 'fa', x: 3050, y: 400 },  // front axle
  { id: 'fb', x: 4050, y: 540 },  // front bumper
];

// --- nodes -----------------------------------------------------------------
const nodes = [];
// lower rails (left = +z, right = -z)
for (const s of stations) {
  nodes.push({ id: `${s.id}L`, x: s.x, y: s.y, z: RAIL_HW });
  nodes.push({ id: `${s.id}R`, x: s.x, y: s.y, z: -RAIL_HW });
}
// main hoop (B-pillar, x=1200) + windscreen hoop (A-pillar base x=2150, top swept to x=1680)
nodes.push(
  { id: 'bTopL', x: 1200, y: ROOF_Y, z: ROOF_HW }, { id: 'bTopR', x: 1200, y: ROOF_Y, z: -ROOF_HW },
  { id: 'aTopL', x: 1680, y: ROOF_Y, z: ROOF_HW }, { id: 'aTopR', x: 1680, y: ROOF_Y, z: -ROOF_HW },
  { id: 'aBaseL', x: 2150, y: 365, z: CAGE_HW },    { id: 'aBaseR', x: 2150, y: 365, z: -CAGE_HW },
  { id: 'cowl', x: 2150, y: 1010, z: 0 },
);
// shock towers (front x=3050 top_y 1180 · rear x=-40 top_y 1080)
nodes.push(
  { id: 'ftL', x: 3050, y: 1180, z: 360 }, { id: 'ftR', x: 3050, y: 1180, z: -360 },
  { id: 'rtL', x: -40, y: 1080, z: 360 },  { id: 'rtR', x: -40, y: 1080, z: -360 },
);

// --- edges (tube centrelines) ----------------------------------------------
const edges = [];
const order = ['rb', 'ra', 'cr', 'cf', 'fa', 'fb'];
// longitudinal rails + cross-members at each station
for (let i = 0; i < order.length; i++) {
  edges.push([`${order[i]}L`, `${order[i]}R`]);            // cross member
  if (i < order.length - 1) {
    edges.push([`${order[i]}L`, `${order[i + 1]}L`]);      // left rail
    edges.push([`${order[i]}R`, `${order[i + 1]}R`]);      // right rail
  }
}
edges.push(
  // main hoop
  ['crL', 'bTopL'], ['crR', 'bTopR'], ['bTopL', 'bTopR'],
  // windscreen / A-pillars + roof
  ['aBaseL', 'aTopL'], ['aBaseR', 'aTopR'], ['aTopL', 'aTopR'],
  ['aTopL', 'bTopL'], ['aTopR', 'bTopR'],
  ['cfL', 'aBaseL'], ['cfR', 'aBaseR'], ['aBaseL', 'cowl'], ['aBaseR', 'cowl'],
  // door-bar triangulation
  ['crL', 'aBaseL'], ['crR', 'aBaseR'],
  // front towers
  ['faL', 'ftL'], ['faR', 'ftR'], ['ftL', 'ftR'], ['ftL', 'cfL'], ['ftR', 'cfR'],
  // rear towers
  ['raL', 'rtL'], ['raR', 'rtR'], ['rtL', 'rtR'], ['rtL', 'crL'], ['rtR', 'crR'],
);

// --- part slots (renderer prefers a glTF `model` if present, else a primitive) ---
const partSlots = [
  { id: 'engine', label: 'LS V8', pos: { x: 2600, y: 700, z: 0 }, size: { l: 700, w: 650, h: 760 }, model: null },
  { id: 'gearbox', label: 'TH400 / 8HP', pos: { x: 1940, y: 690, z: 0 }, size: { l: 620, w: 480, h: 430 }, model: null },
  { id: 'diff', label: 'Ford 9" + spool', pos: { x: 0, y: 470, z: 0 }, size: { l: 300, w: 700, h: 300 }, model: null },
  { id: 'shockFL', label: 'King coilover', pos: { x: 3050, y: 940, z: 480 }, model: null },
  { id: 'shockFR', label: 'King coilover', pos: { x: 3050, y: 940, z: -480 }, model: null },
  { id: 'shockRL', label: 'King bypass', pos: { x: 90, y: 1000, z: 540 }, model: null },
  { id: 'shockRR', label: 'King bypass', pos: { x: 90, y: 1000, z: -540 }, model: null },
  { id: 'tyreFL', label: '37" Kenda', pos: { x: 3050, y: 470, z: 1015 }, model: null },
  { id: 'tyreFR', label: '37" Kenda', pos: { x: 3050, y: 470, z: -1015 }, model: null },
  { id: 'tyreRL', label: '37" Kenda', pos: { x: 0, y: 470, z: 925 }, model: null },
  { id: 'tyreRR', label: '37" Kenda', pos: { x: 0, y: 470, z: -925 }, model: null },
];

/** @type {import('./types.js').ChassisSpec} */
export const truckChassis = {
  vertical: 'trophy-truck',
  overallLengthMm: 4900,
  wheelbaseMm: 3050,
  frontTrackMm: 2030,
  rearTrackMm: 1850,
  cageWidthMm: 1765,   // headline figure per build brief; build-spec internal cage_half_width=545 (≈1090) — confirm which is canonical
  cageHeightMm: 1850,
  tyreDiameterIn: 37,
  tyreRadiusMm: 469.9,
  hcgMm: 980,
  nodes,
  edges,
  partSlots,
  representative: true,
};
