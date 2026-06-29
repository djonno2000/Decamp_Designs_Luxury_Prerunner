// metrics.js — transparent, clearly-labelled DerivedMetrics for the configurator.
// These are SIMPLE ESTIMATES (drift builds vary hugely); the point is honest, legible
// relative comparison between choices — not a substitute for a corner-weight scale.
import { engines } from './engines.js';
import { gearboxes } from './gearboxes.js';
import { diffs, lsdTypes, lsdAvoidForDrift } from './diffs.js';
import { suspension } from './suspension.js';
import { wheels } from './wheels.js';
import { skins } from './wheels.js';

const byId = (arr, id, key = 'id') => arr.find((x) => x[key] === id);

// representative component weights (kg) for parts the catalog doesn't weigh
const BASE_ROLLING_KG = 650;          // bare tube chassis + suspension + brakes + interior + skin
const GEARBOX_KG = { manual: 42, auto: 91, sequential: 45 };
const DIFF_KG = 35;
const MISC_KG = 40;                    // fuel system, cooling, ancillaries

export const catalogs = { engines, gearboxes, diffs, lsdTypes, suspension, wheels, skins };

export function defaultConfig() {
  return { engineId: 'barra-4-0t', gearboxId: 'cd009', diffId: 'nissan-r200',
    lsd: '2-way', suspensionId: 'shockworks-custom', wheelId: 'rim-10-5-11', skinId: 'raw-black' };
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** @returns {import('./types.js').DerivedMetrics} */
export function computeMetrics(cfg) {
  const e = byId(engines, cfg.engineId) || engines[0];
  const g = byId(gearboxes, cfg.gearboxId) || gearboxes[0];
  const d = byId(diffs, cfg.diffId) || diffs[0];
  const lock = byId(lsdTypes, cfg.lsd, 'type');

  const engineKg = e.weightKg || 200;
  const gbKg = GEARBOX_KG[g.type] ?? 42;
  const estWeightKg = Math.round(BASE_ROLLING_KG + engineKg + gbKg + DIFF_KG + MISC_KG);

  // rear bias: drift wants ~52–57%. A heavier / longer engine forward pulls bias down.
  let rearBias = 54 - (engineKg - 185) / 22;
  if (e.lengthClass === 'long') rearBias -= 1.2;
  if (g.type === 'auto') rearBias -= 0.6;          // 8HP is heavier, forward-ish
  const rearBiasPct = Math.round(clamp(rearBias, 47, 59) * 10) / 10;

  const powerKw = e.builtPowerKw || e.stockPowerKw || 200;
  const powerToWeight = Math.round((powerKw / (estWeightKg / 1000)));   // kW per tonne

  // advisory warnings ("fouls" are soft here — placeholder chassis dims)
  const warnings = [];
  if (e.lengthClass === 'long') warnings.push('Long engine — packaging is tight (the scratch chassis is designed for it).');
  if (lock && lsdAvoidForDrift.includes(lock.type)) warnings.push(`${lock.type} lock is not ideal for drift — it unloads when a wheel goes light.`);
  if (cfg.lsd === 'welded') warnings.push('Welded diff — aggressive and grassroots; harsh on the street, hard on the driveline.');
  if (g.id === 'cd009' && e.layout === 'V8') warnings.push('CD009 has a ~10" clutch — budget a custom clutch to fit an 11" disc behind a V8.');
  if (powerKw > 450 && cfg.lsd === 'welded') warnings.push('That much power through a welded diff is rough on axles — consider a 2-way LSD.');
  if (d.id === 'nissan-r200' && powerKw > 500) warnings.push('An R200 is working hard past ~500 kW — a Ford 9" or billet 8.8" is stronger.');

  const packagingOk = warnings.length === 0;
  return { estWeightKg, rearBiasPct, powerToWeight, packagingOk, warnings };
}

// URL encode/decode (compact keys) for shareable builds
const KEYMAP = { engineId: 'e', gearboxId: 'g', diffId: 'd', lsd: 'l', suspensionId: 's', wheelId: 'w', skinId: 'k' };
export function encodeConfig(cfg) {
  const p = new URLSearchParams();
  for (const k in KEYMAP) if (cfg[k]) p.set(KEYMAP[k], cfg[k]);
  return p.toString();
}
export function decodeConfig(search) {
  const p = new URLSearchParams(search);
  const cfg = defaultConfig();
  for (const k in KEYMAP) { const v = p.get(KEYMAP[k]); if (v) cfg[k] = v; }
  return cfg;
}
