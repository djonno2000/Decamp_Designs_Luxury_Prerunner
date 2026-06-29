// partSlot.js — render each ChassisSpec.partSlot. A renderer that PREFERS a glTF `model`
// if present, else draws a labelled primitive at the slot's real packaged position — so a
// primitive swaps for a real model later with a one-field change (slot.model = '...').
// Parts "seat in": they drop from above + fade up during the parts phase. Three.js r128.
import { partMaterial, swapMaterial } from './materials.js';
const THREE = window.THREE;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

// shape inference from the slot id
function makeMesh(slot) {
  const id = slot.id;
  if (id.startsWith('tyre') || id.startsWith('wheel')) {
    // wheel: cylinder with its axis lateral (Z)
    const r = slot.tyreRadius || 470, w = 300;
    const g = new THREE.CylinderGeometry(r, r, w, 22, 1);
    g.rotateX(Math.PI / 2);                       // axis -> Z
    return new THREE.Mesh(g, partMaterial(0x26282c));
  }
  if (id.startsWith('shock')) {
    const g = new THREE.CylinderGeometry(34, 34, 360, 12);
    return new THREE.Mesh(g, partMaterial(0xcda24e));
  }
  // boxed components (engine / gearbox / diff / generic)
  const s = slot.size || { l: 400, w: 400, h: 400 };
  const g = new THREE.BoxGeometry(s.l, s.h, s.w); // l along X, h along Y, w along Z
  const mat = slot.swappable ? swapMaterial()
    : partMaterial(id === 'diff' ? 0x9a7d4e : id === 'engine' ? 0x7c7f86 : 0x6a6d74);
  return new THREE.Mesh(g, mat);
}

export function buildParts(spec, opts = {}) {
  const group = new THREE.Group();
  const parts = [];
  const dropFrom = opts.dropFrom ?? 1500;        // mm above seated position
  const slots = spec.partSlots || [];
  const n = Math.max(1, slots.length);

  slots.forEach((slot, i) => {
    // glTF hook for later: if (slot.model) { loadGLTF(slot.model)…; return; }
    const mesh = makeMesh(slot);
    const seated = new THREE.Vector3(slot.pos.x, slot.pos.y, slot.pos.z);
    mesh.position.copy(seated);
    mesh.userData = {
      seatedY: seated.y, targetOpacity: slot.id.startsWith('tyre') ? 0.95 : 0.9,
      order: i / n,
    };
    group.add(mesh);
    parts.push(mesh);
  });

  const start = opts.partsStart ?? 0.55;
  const end = opts.partsEnd ?? 0.86;
  function setProgress(p) {
    const wp = clamp((p - start) / (end - start), 0, 1);
    for (const m of parts) {
      const t = smooth((wp - m.userData.order * 0.4) / 0.6);
      m.position.y = m.userData.seatedY + (1 - t) * (opts.dropFrom ?? dropFrom);
      m.material.opacity = t * m.userData.targetOpacity;
      m.visible = t > 0.001;
    }
  }
  setProgress(0);
  return { group, parts, setProgress };
}
