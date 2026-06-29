// configuratorSVG.js — 2D side-elevation of the DriftCast build that updates with the SAME
// config (engine block, wheel width, skin colour), used when WebGL is unavailable.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function configuratorSVG(spec, cfg, cat) {
  const nodes = spec.nodes, nv = {};
  for (const n of nodes) nv[n.id] = n;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const n of nodes) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); }
  const wheelR = 230;
  minY = Math.min(minY, 0);                       // include ground/wheels
  const padL = 60, padR = 60, padT = 50, padB = 60, drawW = 900;
  const scale = drawW / (maxX - minX);
  const drawH = (maxY - minY) * scale + wheelR * scale;
  const W = drawW + padL + padR, H = drawH + padT + padB;
  const X = (x) => padL + (x - minX) * scale;
  const Y = (y) => padT + drawH - (y - minY) * scale;

  const e = cat.engines.find((x) => x.id === cfg.engineId) || cat.engines[0];
  const w = cat.wheels.find((x) => x.id === cfg.wheelId) || cat.wheels[0];
  const skin = cat.skins.find((x) => x.id === cfg.skinId) || cat.skins[0];

  // skin body outline (rounded rect over the chassis bounds)
  const bx = X(minX), bw = (maxX - minX) * scale, by = Y(maxY) - 6, bh = (maxY - minY) * scale + 6;
  const body = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${bh * 0.28}" fill="${esc(skin.colorHex)}" opacity="0.18" stroke="${esc(skin.colorHex)}" stroke-opacity="0.5"/>`;

  // frame edges
  let edges = '';
  for (const [a, b] of spec.edges) { if (!nv[a] || !nv[b]) continue; edges += `<line x1="${X(nv[a].x).toFixed(1)}" y1="${Y(nv[a].y).toFixed(1)}" x2="${X(nv[b].x).toFixed(1)}" y2="${Y(nv[b].y).toFixed(1)}"/>`; }

  // wheels at wheel slots (one per axle on the near side)
  let wheelsStr = '';
  const seen = new Set();
  for (const s of (spec.partSlots || [])) {
    if (!/^wheel/.test(s.id)) continue;
    const axle = Math.round(s.pos.x);
    if (seen.has(axle)) continue; seen.add(axle);
    const r = wheelR * scale;
    wheelsStr += `<circle cx="${X(s.pos.x).toFixed(1)}" cy="${Y(wheelR).toFixed(1)}" r="${r.toFixed(1)}" class="wh"/>
      <circle cx="${X(s.pos.x).toFixed(1)}" cy="${Y(wheelR).toFixed(1)}" r="${(r * 0.42).toFixed(1)}" class="hub"/>`;
  }

  // engine block
  const es = spec.partSlots.find((s) => s.id === 'engine');
  let engineStr = '';
  if (es) {
    const ew = (e.layout === 'I6' ? 760 : 560) * scale, eh = 560 * scale;
    engineStr = `<rect x="${(X(es.pos.x) - ew / 2).toFixed(1)}" y="${(Y(es.pos.y + 260)).toFixed(1)}" width="${ew.toFixed(1)}" height="${eh.toFixed(1)}" rx="6" class="eng"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" role="img"
    aria-label="DriftCast build side elevation: ${esc(e.name)}, ${esc(w.widthIn)}-inch wheels, ${esc(skin.name)} skin.">
    <style>
      .fr line{stroke:#cda24e;stroke-width:2;stroke-linecap:round;opacity:.9}
      .wh{fill:#1a1b1f;stroke:#3a3f47;stroke-width:2}.hub{fill:#2a2f37}
      .eng{fill:${esc((cat.engines.find((x)=>x.id===cfg.engineId)||{}).valueRating ? '#7c7f86' : '#7c7f86')};opacity:.9;stroke:#cda24e;stroke-opacity:.4}
      .cap{fill:#7b7d84;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:13px;letter-spacing:.04em}
      .ttl{fill:#edece6;font-family:'Barlow Condensed','Barlow',sans-serif;font-size:18px;letter-spacing:.06em;text-transform:uppercase}
    </style>
    <rect width="${W.toFixed(0)}" height="${H.toFixed(0)}" fill="#0f1012"/>
    <text class="ttl" x="${padL}" y="30">DriftCast · ${esc(e.name)}</text>
    <text class="cap" x="${W - padR}" y="30" text-anchor="end">side elevation · est</text>
    ${body}${engineStr}<g class="fr">${edges}</g>${wheelsStr}
    <text class="cap" x="${padL}" y="${H - 18}">${esc(e.name)} · ${esc(w.widthIn)}" wheels · ${esc(skin.name)} skin</text>
  </svg>`;
}
