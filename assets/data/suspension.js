// suspension.js — DriftCast coilover/suspension catalog (seeded from
// driftcast-suspension-coilovers.md + the Acostal/Shockworks partner docs).
/** @type {import('./types.js').Suspension[]} */
export const suspension = [
  {
    id: 'grassroots-single-adj', name: 'Single-adjustable coilover', vendor: null,
    type: 'Quality single-adjustable monotube',
    travelNote: 'Set ride height + corner weight first, then one damping knob',
    costNote: 'Grassroots tier',
    tags: ['grassroots', 'learner'],
  },
  {
    id: 'shockworks-custom', name: 'Shockworks custom coilover', vendor: 'Shockworks (Melbourne)',
    type: 'Monotube, inverted front, dual-adjustable, custom-valved',
    travelNote: 'Helper/tender springs keep the spring seated at full droop',
    costNote: 'Kits from ~$2,790 (AUD)',
    tags: ['AU-LOCAL', 'performance-default', 'rebuildable', 'drift-line'],
  },
  {
    id: 'pro-custom-damper', name: 'Full-custom motorsport damper', vendor: null,
    type: 'Custom damper + remote reservoir, blow-off / bypass features',
    travelNote: 'Independent low/high-speed; remote res for sustained heat',
    costNote: 'Pro tier',
    tags: ['pro', 'remote-res', 'competition'],
  },
];

// Front steering / angle hardware is a partner system, not a coilover — credited + linked.
export const steeringPartner = {
  name: 'Acostal Motorsport Development', location: 'Adelaide, SA',
  specialty: 'Drift steering & angle hardware — design front hardpoints around their system',
  links: { web: 'https://acostaldev.com', instagram: 'https://instagram.com/acostal_dev' },
  note: 'Confirmed AU partner. Pull live specs from their channels — credited and linked, never reproduced.',
};
