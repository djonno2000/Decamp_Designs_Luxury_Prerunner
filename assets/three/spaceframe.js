// spaceframe.js — generate the tube spaceframe from a ChassisSpec and animate it
// "drawing in". Tubes are cylinders along each edge (pivoted at one node so they grow
// from a joint); nodes are glowing gold spheres that pop in as their tubes reach them.
// Three.js r128 global.
import { tubeMaterial, nodeMaterial } from './materials.js';
const THREE = window.THREE;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

export function buildSpaceframe(spec, opts = {}) {
  const group = new THREE.Group();
  const r = (opts.tubeOd || 44) / 2;            // tube radius (mm)
  const nodeR = r * 1.6;

  // node lookup
  const nv = {};
  for (const n of spec.nodes) nv[n.id] = new THREE.Vector3(n.x, n.y, n.z);

  // x-extent for stagger ordering (rear → front)
  let minX = Infinity, maxX = -Infinity;
  for (const n of spec.nodes) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); }
  const span = Math.max(1, maxX - minX);
  const ord = (x) => (x - minX) / span;

  // --- tubes ---
  const tubeMat = tubeMaterial();
  const tubes = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (const [a, b] of spec.edges) {
    const va = nv[a], vb = nv[b];
    if (!va || !vb) continue;
    const len = va.distanceTo(vb);
    if (len < 1) continue;
    const pivot = new THREE.Group();
    pivot.position.copy(va);
    pivot.quaternion.setFromUnitVectors(up, new THREE.Vector3().subVectors(vb, va).normalize());
    const geo = new THREE.CylinderGeometry(r, r, len, 8, 1, false);
    geo.translate(0, len / 2, 0);             // base sits at the pivot (node A)
    pivot.add(new THREE.Mesh(geo, tubeMat));
    pivot.scale.y = 0.0001;
    group.add(pivot);
    tubes.push({ pivot, order: ord((va.x + vb.x) / 2) });
  }

  // --- nodes ---
  const nodeMat = nodeMaterial();
  const nodeGeo = new THREE.SphereGeometry(nodeR, 12, 10);
  const nodes = [];
  for (const n of spec.nodes) {
    const m = new THREE.Mesh(nodeGeo, nodeMat);
    m.position.copy(nv[n.id]);
    m.scale.setScalar(0.0001);
    group.add(m);
    nodes.push({ mesh: m, order: ord(n.x) });
  }

  // draw phase occupies progress [0 .. drawEnd]
  const drawEnd = opts.drawEnd ?? 0.6;
  function setProgress(p) {
    const wp = clamp(p / drawEnd, 0, 1);       // 0..1 across the draw phase
    for (const t of tubes) {
      const g = smooth((wp - t.order * 0.55) / 0.45);
      t.pivot.scale.y = Math.max(0.0001, g);
    }
    for (const n of nodes) {
      const g = smooth((wp - n.order * 0.55) / 0.35);
      n.mesh.scale.setScalar(Math.max(0.0001, g));
    }
  }
  setProgress(0);

  // bounding info for camera framing
  const box = new THREE.Box3().setFromPoints(spec.nodes.map((n) => nv[n.id]));
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  return { group, tubes, nodes, setProgress, center, size, box };
}
