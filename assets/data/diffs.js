// diffs.js — DriftCast rear-end + LSD catalog (seeded from driftcast-diff-rear-catalog.md
// + driftcast-lsd-diff-focus.md). The lock type matters more than the centre, and rides
// on a common diff mount — so they're modelled separately.
/** @type {import('./types.js').Diff[]} */
export const diffs = [
  {
    id: 'nissan-r200', name: 'Nissan R200', lsdTypes: ['2-way', '1.5-way', 'spool'],
    strengthNote: 'Moderate–good, very upgradeable', costNote: 'Cheap, plentiful (AUD)',
    fitNotes: 'The JDM standard — Skyline / Silvia / 350Z-G35. Aftermarket gears 3.13–4.10.',
    tags: ['JDM-STANDARD', 'cheap', 'upgradeable'],
  },
  {
    id: 'ford-9', name: 'Ford 9"', lsdTypes: ['spool', 'LSD', 'gears'],
    strengthNote: 'Very strong, universal', costNote: 'Mid — but endless cheap support (AUD)',
    fitNotes: 'The strong universal choice (the trophy truck runs a 9" + spool). Solid-axle housing or 9" IRS centre. Heavier.',
    tags: ['EXCELLENT', 'very-strong', 'universal', 'solid-or-irs'],
  },
  {
    id: 'ford-8-8', name: 'Ford 8.8"', lsdTypes: ['LSD', 'spool'],
    strengthNote: 'Strong, cheap', costNote: 'Cheap (AUD)',
    fitNotes: 'The strong budget pick. Billet housings drop it into R200 subframes; high-power axle kits exist.',
    tags: ['strong-budget', 'cheap'],
  },
  {
    id: 'winters-qc', name: 'Winters Quick-Change', lsdTypes: ['2-way', 'spool'],
    strengthNote: 'Race-grade, very strong', costNote: '$$$ — premium tier',
    fitNotes: 'Swap final-drive ratios trackside in minutes. The pro/serious option.',
    tags: ['PREMIUM', 'quick-change', 'race-grade'],
  },
];

// LSD lock behaviour — independent of the centre, swappable via the common diff mount.
export const lsdTypes = [
  { type: 'welded', behaviour: 'Fully locked (both wheels, always)', drift: 'Grassroots entry point', costNote: '~free if you can weld', tags: ['grassroots'] },
  { type: 'mini-spool', behaviour: 'Fully locked, bolt-in (no welding)', drift: 'Budget step up from welded', costNote: 'Cheap', tags: ['budget'] },
  { type: '2-way', behaviour: 'Locks under both accel AND decel', drift: 'THE drift standard / default', costNote: 'Premium driving feel', tags: ['DRIFT-DEFAULT', 'value-pick-kaaz'] },
  { type: '1.5-way', behaviour: 'Strong on power, light off', drift: 'Streetable compromise', costNote: 'Mid', tags: ['streetable'] },
  { type: 'full-spool', behaviour: 'Fully locked, one-piece billet', drift: 'High-power / competition (the truck runs this)', costNote: 'Race-grade', tags: ['competition'] },
];

// Explicitly NOT for drift (per source): helical/Torsen and viscous (VLSD) — they unload
// when a wheel goes light. Listed so the configurator can warn.
export const lsdAvoidForDrift = ['helical-torsen', 'vlsd-viscous'];
