// chassis.driftcast.js — DriftCast modular tube chassis (seeded from
// driftcast-chassis-driveline.md + the suspension/steering briefs).
//
// HONESTY: the source notes are an early v1 to react to. They give the PHILOSOPHY and a
// few hard targets (60°+ steering angle, reduced/zero Ackermann), but NO finalised
// wheelbase / track / length / weight numbers (track is described only as "wide"). The
// numbers below marked `placeholder:true` are reasonable stand-ins so the Phase-5
// configurator has geometry to draw — confirm with Stewie before treating as real.
//
// Same coordinate convention as the truck: X fwd, Y up, Z left; origin at rear axle, ground.

const TRACK = 1600;   // placeholder "wide" track
const WB = 2550;      // placeholder wheelbase
const HW = TRACK / 2;

const stations = [
  { id: 'rb', x: -450, y: 360 },
  { id: 'ra', x: 0,    y: 340 },
  { id: 'cr', x: 1050, y: 320 },  // main hoop
  { id: 'cf', x: 1750, y: 330 },  // dash hoop / front bulkhead
  { id: 'fa', x: 2550, y: 360 },
  { id: 'fb', x: 3150, y: 420 },
];

const nodes = [];
for (const s of stations) {
  nodes.push({ id: `${s.id}L`, x: s.x, y: s.y, z: HW });
  nodes.push({ id: `${s.id}R`, x: s.x, y: s.y, z: -HW });
}
nodes.push(
  { id: 'hoopL', x: 1050, y: 1180, z: HW - 60 }, { id: 'hoopR', x: 1050, y: 1180, z: -(HW - 60) },
  { id: 'dashL', x: 1750, y: 980, z: HW - 70 },  { id: 'dashR', x: 1750, y: 980, z: -(HW - 70) },
);

const edges = [];
const order = ['rb', 'ra', 'cr', 'cf', 'fa', 'fb'];
for (let i = 0; i < order.length; i++) {
  edges.push([`${order[i]}L`, `${order[i]}R`]);
  if (i < order.length - 1) {
    edges.push([`${order[i]}L`, `${order[i + 1]}L`]);
    edges.push([`${order[i]}R`, `${order[i + 1]}R`]);
  }
}
edges.push(
  ['crL', 'hoopL'], ['crR', 'hoopR'], ['hoopL', 'hoopR'],
  ['cfL', 'dashL'], ['cfR', 'dashR'], ['dashL', 'dashR'],
  ['hoopL', 'dashL'], ['hoopR', 'dashR'],
);

// Swappable mount-plate modules are the whole point — highlight them in 3D.
const partSlots = [
  { id: 'engine', label: 'Swappable engine plate', pos: { x: 1500, y: 560, z: 0 }, swappable: true, model: null },
  { id: 'gearbox', label: 'Common bellhousing', pos: { x: 1000, y: 520, z: 0 }, swappable: true, model: null },
  { id: 'diff', label: 'Common diff mount', pos: { x: 0, y: 360, z: 0 }, swappable: true, model: null },
  { id: 'wheelFL', label: 'Front wheel', pos: { x: 2550, y: 340, z: HW + 30 }, model: null },
  { id: 'wheelFR', label: 'Front wheel', pos: { x: 2550, y: 340, z: -(HW + 30) }, model: null },
  { id: 'wheelRL', label: 'Rear wheel', pos: { x: 0, y: 340, z: HW + 30 }, model: null },
  { id: 'wheelRR', label: 'Rear wheel', pos: { x: 0, y: 340, z: -(HW + 30) }, model: null },
];

/** @type {import('./types.js').ChassisSpec} */
export const driftcastChassis = {
  vertical: 'driftcast',
  overallLengthMm: 3600, placeholderDims: true,
  wheelbaseMm: WB,
  frontTrackMm: TRACK,
  rearTrackMm: TRACK,
  tyreDiameterIn: 18,
  nodes,
  edges,
  partSlots,
  // hard targets the source DOES commit to:
  targets: {
    steeringAngleDeg: 60,            // "60°+" — the headline front-end target
    ackermann: 'reduced / zero / reverse (driver preference)',
    rearCamberStaticDeg: '+0.5 to +1',  // positive static cancels power-squat → flat loaded tyre
    rearToe: 'static toe-in 0.5–2 mm/wheel; geometric dynamic toe-in under squat',
    rearBiasPct: '52–57',
    antiSquat: 'moderate — controlled power squat',
  },
  representative: true,
};
