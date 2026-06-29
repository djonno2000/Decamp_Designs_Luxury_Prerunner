// wheels.js — DriftCast wheel/tyre fitment catalog (seeded from driftcast-wheels-tyres.md).
// Strategy: wide at the rear for grip/drive, moderate at the front for response.
// PCD default 5×114.3; diameter sweet spot 17–18". Offsets are designed-in (hubs controlled
// in-house) so numeric offsets are left null until finalised.
/** @type {import('./types.js').Wheel[]} */
export const wheels = [
  { id: 'rim-9',      diameterIn: 18, widthIn: 9.0,  offsetMm: null, tyreWidthMm: '235–265', fitNotes: 'Grassroots / all-round drift width' },
  { id: 'rim-9-5-10', diameterIn: 18, widthIn: 9.75, offsetMm: null, tyreWidthMm: '255–285', fitNotes: 'The competitive staple' },
  { id: 'rim-10-5-11',diameterIn: 18, widthIn: 10.75,offsetMm: null, tyreWidthMm: '275–305', fitNotes: 'Wide grip — strong drive/traction' },
  { id: 'rim-12',     diameterIn: 18, widthIn: 12.0, offsetMm: null, tyreWidthMm: '295–325+', fitNotes: 'Maximum rear grip; big-power builds' },
];

// Per-tier suggested pairing (rear / front).
export const wheelTiers = [
  { tier: 'Grassroots',   rear: 'rim-9',      front: 'rim-9' },
  { tier: 'Performance',  rear: 'rim-10-5-11',front: 'rim-9-5-10' },
  { tier: 'Pro',          rear: 'rim-12',     front: 'rim-10-5-11' },
];

// Quick-swap plastic skin colourways (placeholder palette — finalise with brand).
/** @type {Array<{id:string,name:string,colorHex:string,style:string}>} */
export const skins = [
  { id: 'raw-black',   name: 'Raw Black',   colorHex: '#17181c', style: 'Moulded-in matte — the default' },
  { id: 'bone',        name: 'Bone',        colorHex: '#edece6', style: 'Moulded-in satin' },
  { id: 'heat-gold',   name: 'Heat Gold',   colorHex: '#cda24e', style: 'Studio signature accent' },
  { id: 'desert-rust', name: 'Desert Rust', colorHex: '#b5552f', style: 'Wrap' },
  { id: 'tuner-blue',  name: 'Tuner Blue',  colorHex: '#3f6f9f', style: 'Wrap' },
];
