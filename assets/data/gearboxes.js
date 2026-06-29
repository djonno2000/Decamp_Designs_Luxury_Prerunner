// gearboxes.js — DriftCast gearbox catalog (seeded from driftcast-gearbox-catalog.md).
/** @type {import('./types.js').Gearbox[]} */
export const gearboxes = [
  {
    id: 'cd009', name: 'Nissan CD009 6-speed', type: 'manual', speeds: 6, powerProvenKw: 750,
    costNote: '~$1,700 new, ~half used (AUD)',
    fitNotes: 'THE budget standard / default kit box. Universal adapter-plate ecosystem (LS/JZ/RB/KA/1UZ). Long box, and the stock shifter only fits the Z — budget a relocation. 2005+ for the better synchros.',
    tags: ['DRIFT-DEFAULT', 'budget-standard', 'value-weapon', 'universal-adapters'],
  },
  {
    id: 'r154', name: 'Toyota R154 5-speed', type: 'manual', speeds: 5,
    costNote: 'Now dear — a good setup is >$4k (AUD)',
    fitNotes: 'Classic JZ box and former go-to; the CD009 is now cheaper and stronger.',
    tags: ['jz-authentic', 'classic'],
  },
  {
    id: 'v160', name: 'Toyota V160/V161 (Getrag)', type: 'manual', speeds: 6,
    costNote: 'Expensive / rare',
    fitNotes: 'The Supra benchmark — very strong, drag-proven at big power.',
    tags: ['benchmark', 'strong', 'expensive'],
  },
  {
    id: 't56-magnum', name: 'Tremec T56 / Magnum', type: 'manual', speeds: 6,
    costNote: '~$2,500+ new (AUD), getting scarce',
    fitNotes: 'LS-world standard; the Magnum is the strong one.',
    tags: ['ls-standard', 'strong'],
  },
  {
    id: 'zf-8hp', name: 'ZF 8HP 8-speed auto', type: 'auto', speeds: 8,
    costNote: 'Mid + a standalone controller (AUD)',
    fitNotes: 'Emerging. Needs a TCU; output-shaft bearing limits revs (~8500). Same family as the trophy-truck 8HP — controller knowledge crosses over.',
    tags: ['auto', 'emerging', 'high-torque', 'paddle'],
  },
  {
    id: 'sequential', name: 'Sequential (Samsonas/Holinger/PPG)', type: 'sequential',
    costNote: '$$$$ — the premium tier',
    fitNotes: 'Fast clutchless dog-box shifts, strong, pro-level. The endgame box.',
    tags: ['TOP-TIER', 'premium', 'dog-box'],
  },
];
