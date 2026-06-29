// fallbackSVG.js — static engineering-drawing still of the spaceframe, generated from the
// SAME ChassisSpec. Side elevation (X = length, Y = height) with dimension callouts. Used as
// the no-WebGL / low-tier / reduced-motion fallback — preserves the brand + the real numbers.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => n.toLocaleString('en-AU');

export function spaceframeSVG(spec) {
  const nodes = spec.nodes;
  const nv = {};
  for (const n of nodes) nv[n.id] = n;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const n of nodes) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); }

  const padL = 70, padR = 70, padT = 60, padB = 110;
  const drawW = 1040;
  const scale = drawW / (maxX - minX);
  const drawH = (maxY - minY) * scale;
  const W = drawW + padL + padR;
  const H = drawH + padT + padB;
  const X = (x) => padL + (x - minX) * scale;
  const Y = (y) => padT + drawH - (y - minY) * scale;   // flip Y

  // edges
  let edgeStr = '';
  for (const [a, b] of spec.edges) {
    if (!nv[a] || !nv[b]) continue;
    edgeStr += `<line x1="${X(nv[a].x).toFixed(1)}" y1="${Y(nv[a].y).toFixed(1)}" x2="${X(nv[b].x).toFixed(1)}" y2="${Y(nv[b].y).toFixed(1)}"/>`;
  }
  // nodes
  let nodeStr = '';
  for (const n of nodes) nodeStr += `<circle cx="${X(n.x).toFixed(1)}" cy="${Y(n.y).toFixed(1)}" r="3.4"/>`;
  // part slots (project to side elevation)
  let partStr = '';
  for (const s of (spec.partSlots || [])) {
    if (/^(tyre|wheel)F?[LR]?$/.test(s.id) && /[LR]$/.test(s.id) && s.id.endsWith('R')) continue; // one wheel per axle
    const cx = X(s.pos.x), cy = Y(s.pos.y);
    partStr += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" class="pt"/>`;
  }

  // dimension line (overall length) along the bottom
  const dimY = padT + drawH + 46;
  const x0 = X(minX), x1 = X(maxX);
  const dim = `
    <g class="dim">
      <line x1="${x0}" y1="${dimY}" x2="${x1}" y2="${dimY}"/>
      <line x1="${x0}" y1="${dimY - 6}" x2="${x0}" y2="${dimY + 6}"/>
      <line x1="${x1}" y1="${dimY - 6}" x2="${x1}" y2="${dimY + 6}"/>
      <text x="${(x0 + x1) / 2}" y="${dimY + 22}" text-anchor="middle">${fmt(spec.overallLengthMm)} mm overall</text>
    </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" role="img"
    aria-label="Engineering side elevation of the ${esc(spec.vertical)} spaceframe, ${fmt(spec.overallLengthMm)} mm long, ${fmt(spec.wheelbaseMm)} mm wheelbase.">
    <style>
      .frame line{stroke:#cda24e;stroke-width:2;stroke-linecap:round;opacity:.85}
      .nodes circle{fill:#dcc07e}
      .pt{fill:none;stroke:#5f9e74;stroke-width:2}
      .dim line{stroke:#7b7d84;stroke-width:1}
      .dim text,.cap{fill:#7b7d84;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:13px;letter-spacing:.04em}
      .ttl{fill:#edece6;font-family:'Barlow Condensed','Barlow',sans-serif;font-size:20px;letter-spacing:.06em;text-transform:uppercase}
    </style>
    <rect width="${W.toFixed(0)}" height="${H.toFixed(0)}" fill="#0f1012"/>
    <text class="ttl" x="${padL}" y="34">${esc(spec.vertical === 'trophy-truck' ? 'MCD1 Spaceframe' : 'DriftCast chassis')} · side elevation</text>
    <text class="cap" x="${W - padR}" y="34" text-anchor="end">REV A · mm${spec.representative ? ' · representative' : ''}</text>
    <g class="frame">${edgeStr}</g>
    <g class="nodes">${nodeStr}</g>
    <g>${partStr}</g>
    ${dim}
    <text class="cap" x="${padL}" y="${H - 24}">WB ${fmt(spec.wheelbaseMm)} · track F/R ${fmt(spec.frontTrackMm)}/${fmt(spec.rearTrackMm)} · tyre ${spec.tyreDiameterIn}"</text>
  </svg>`;
}
