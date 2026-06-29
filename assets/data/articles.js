// articles.js — Engineering Notebook manifest. `status: 'published'` entries link to a
// page in /notebook/; `status: 'stub'` entries are scaffolded (content to be pasted/written).
/**
 * @typedef {Object} Article
 * @property {string} slug @property {string} title @property {('trophy-truck'|'driftcast')} vertical
 * @property {string[]} tags @property {string} [confidence] @property {string} summary
 * @property {string} updated @property {('published'|'stub')} status
 */
/** @type {Article[]} */
export const articles = [
  {
    slug: 'roll-control', title: 'Holding roll without the waddle', vertical: 'trophy-truck',
    tags: ['suspension', 'roll-control', 'bypass-shock', 'prior-art'],
    confidence: 'Concept under bench-test — not yet built',
    summary: 'Bypass-shock internals, cross-linked hydraulic roll control and the proven prior art — landing on the honest optimum: a steel bar plus exactly one blow-off shock.',
    updated: '2026-06', status: 'published',
  },
  {
    slug: 'drift-dynamics', title: 'Designed to drive sideways', vertical: 'driftcast',
    tags: ['suspension', 'geometry', 'anti-squat', 'dynamic-toe'],
    confidence: 'Starting reference ranges — validate with testing',
    summary: 'The engineering case for a blank-sheet drift chassis: camber curves, dynamic toe, anti-squat and weight balance placed exactly where the physics wants them.',
    updated: '2026-06', status: 'published',
  },
  // --- scaffolded stubs (bodies to come) ---
  { slug: 'bypass-rebound-tuning', title: 'Bypass rebound: where the truck settles', vertical: 'trophy-truck',
    tags: ['suspension', 'bypass-shock', 'tuning'], summary: 'Reading and tuning the rebound zones of a bypass shock so the truck recovers without packing down.', updated: '2026-06', status: 'stub' },
  { slug: 'diff-mounted-arb', title: 'The diff-mounted rear ARB', vertical: 'trophy-truck',
    tags: ['suspension', 'anti-roll-bar', 'packaging'], summary: 'Why the MCD/Kirby layout clamps the bar to the housing — what it really buys, and what it costs in unsprung mass.', updated: '2026-06', status: 'stub' },
  { slug: 'forced-induction-ls', title: 'Boosting an LS to live, not to grenade', vertical: 'trophy-truck',
    tags: ['engine', 'forced-induction', 'reliability'], summary: 'Supercharging an iron LS for a desert race — heat, cooling derate, and the 500–600 hp that finishes.', updated: '2026-06', status: 'stub' },
  { slug: 'grip-and-drive', title: 'Grip and drive while sliding', vertical: 'driftcast',
    tags: ['drift', 'friction-circle', 'rear-grip'], summary: 'The friction-circle budget of a drifting rear tyre, and the three ways to make the circle bigger.', updated: '2026-06', status: 'stub' },
  { slug: 'rear-hardpoints', title: 'Rear suspension hardpoints from scratch', vertical: 'driftcast',
    tags: ['geometry', 'IRS', 'hardpoints'], summary: 'Placing the rear pickups so anti-squat, camber curve and dynamic toe all land right at once.', updated: '2026-06', status: 'stub' },
  { slug: 'rear-toe-catchability', title: 'Rear toe-in & catchability', vertical: 'driftcast',
    tags: ['geometry', 'dynamic-toe', 'stability'], summary: 'How static and dynamic rear toe make big angle catchable without scrubbing the front.', updated: '2026-06', status: 'stub' },
  { slug: 'weight-balance-layout', title: 'Weight, balance & layout', vertical: 'driftcast',
    tags: ['chassis', 'weight', 'polar-moment'], summary: 'Low and central mass, ~52–57% rear bias, and why polar moment decides how the car transitions.', updated: '2026-06', status: 'stub' },
];
