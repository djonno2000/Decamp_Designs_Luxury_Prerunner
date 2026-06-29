// engines.js — DriftCast engine catalog (seeded from driftcast-engine-catalog.md +
// forced-induction notes). kW figures are rounded representative build targets for the
// configurator; source quotes are mostly hp. valueRating = AU value/availability (1–5).
/** @type {import('./types.js').Engine[]} */
export const engines = [
  {
    id: 'barra-4-0t', name: 'Ford Barra 4.0T', family: 'Ford Barra', displacementL: 4.0,
    weightKg: 232, stockPowerKw: 270, builtPowerKw: 600, layout: 'I6', lengthClass: 'long',
    valueRating: 5, sourceCostNote: "Dirt cheap in AU; 'green-top' long blocks for next to nothing",
    fitNotes: 'Long and tall — packaging matters (a scratch chassis solves it). Do valve springs + oil-pump gears.',
    tags: ['VALUE-WEAPON', 'au-2jz', 'top-au-pick', 'turbo', 'cheap-big-power'],
  },
  {
    id: 'ls-v8', name: 'GM LS V8', family: 'GM LS', displacementL: 6.0,
    weightKg: 195, stockPowerKw: 300, builtPowerKw: 560, layout: 'V8', lengthClass: 'short',
    valueRating: 5, sourceCostNote: 'Cheap; iron truck blocks (4.8/5.3/6.0) are the budget path',
    fitNotes: 'Compact, light-for-power, bolt-in everything. The value/power king.',
    tags: ['VALUE-WEAPON', 'value-power-king', 'v8', 'compact'],
  },
  {
    id: 'sr20det', name: 'Nissan SR20DET', family: 'Nissan SR', displacementL: 2.0,
    weightKg: 150, stockPowerKw: 150, builtPowerKw: 280, layout: 'I4', lengthClass: 'short',
    valueRating: 3, sourceCostNote: 'Authentic but pricey for big power',
    fitNotes: 'The OG S-chassis motor — light, compact, beautifully balanced.',
    tags: ['jdm', 'authentic', 'light', 'drift-default-i4'],
  },
  {
    id: '1jz-gte', name: 'Toyota 1JZ-GTE', family: 'Toyota JZ', displacementL: 2.5,
    weightKg: 205, stockPowerKw: 206, builtPowerKw: 450, layout: 'I6', lengthClass: 'long',
    valueRating: 4, sourceCostNote: 'Cheaper than a 2JZ — the value sweet spot for many',
    fitNotes: 'Strong, reliable, sounds great. Single-turbo conversions make big power.',
    tags: ['jdm', 'i6', 'value-power', 'reliable'],
  },
  {
    id: '2jz-gte', name: 'Toyota 2JZ-GTE', family: 'Toyota JZ', displacementL: 3.0,
    weightKg: 230, stockPowerKw: 240, builtPowerKw: 600, layout: 'I6', lengthClass: 'long',
    valueRating: 3, sourceCostNote: 'The legend — dearer, iron block is heavy',
    fitNotes: 'Bottomless aftermarket and a sky-high ceiling. Heavy.',
    tags: ['jdm', 'legend', 'i6', 'high-ceiling'],
  },
  {
    id: 'rb25det-neo', name: 'Nissan RB25DET NEO', family: 'Nissan RB', displacementL: 2.5,
    weightKg: 250, stockPowerKw: 184, builtPowerKw: 450, layout: 'I6', lengthClass: 'long',
    valueRating: 3, sourceCostNote: 'Capable Skyline six, but heavier and costs to push hard',
    fitNotes: 'The NEO is the one to have. Iron block = weight.',
    tags: ['jdm', 'i6', 'skyline', 'heavy'],
  },
  {
    id: 'rb26dett', name: 'Nissan RB26DETT', family: 'Nissan RB', displacementL: 2.6,
    weightKg: 255, stockPowerKw: 206, builtPowerKw: 650, layout: 'I6', lengthClass: 'long',
    valueRating: 2, sourceCostNote: 'Expensive and maintenance-heavy',
    fitNotes: 'GT-R legend, factory ITBs, huge power capable. The pricey, fussy option.',
    tags: ['jdm', 'gtr', 'twin-turbo', 'expensive'],
  },
  {
    id: '1uz-fe', name: 'Toyota 1UZ-FE V8', family: 'Toyota UZ', displacementL: 4.0,
    weightKg: 225, stockPowerKw: 220, builtPowerKw: 340, layout: 'V8', lengthClass: 'short',
    valueRating: 3, sourceCostNote: 'Cheap Toyota V8',
    fitNotes: 'Smooth, reliable NA torque. Heavier; smaller aftermarket than LS.',
    tags: ['v8', 'cheap', 'reliable'],
  },
  {
    id: 'k20-k24', name: 'Honda K20/K24', family: 'Honda K', displacementL: 2.4,
    weightKg: 170, stockPowerKw: 150, builtPowerKw: 450, layout: 'I4', lengthClass: 'short',
    valueRating: 2, sourceCostNote: 'Light and revvy, but FWD-origin needs RWD adaptation',
    fitNotes: 'Less common in drift; big turbo numbers are possible.',
    tags: ['i4', 'light', 'revvy', 'fwd-origin'],
  },
];

// AU value ranking the source draws: Barra > LS > SR20 / 1JZ > 2JZ / RB.
export const engineValueOrder = ['barra-4-0t', 'ls-v8', 'sr20det', '1jz-gte', '2jz-gte'];
