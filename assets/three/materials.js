// materials.js — engineering-drawing materials for the spaceframe scene (Three.js r128).
// THREE is loaded as a global via <script src="assets/lib/three.r128.min.js"> before this module.
const THREE = window.THREE;

// Heat-tinted steel tube — dark, metallic, faint weld-temper emissive.
export function tubeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x6b7178, metalness: 0.55, roughness: 0.42,
    emissive: 0x2a1d08, emissiveIntensity: 0.35,
  });
}

// Glowing gold weld node.
export function nodeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xcda24e, metalness: 0.7, roughness: 0.3,
    emissive: 0xcda24e, emissiveIntensity: 0.55,
  });
}

// Labelled part primitive — translucent panel look.
export function partMaterial(hex = 0x9aa0a6) {
  return new THREE.MeshStandardMaterial({
    color: hex, metalness: 0.4, roughness: 0.55,
    transparent: true, opacity: 0, emissive: 0x0a0a0a, emissiveIntensity: 0.2,
  });
}

// Swappable mount-plate module highlight (DriftCast) — gold wash.
export function swapMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xdcc07e, metalness: 0.6, roughness: 0.35,
    transparent: true, opacity: 0, emissive: 0x8a6a2e, emissiveIntensity: 0.5,
  });
}

// Translucent body shell that skins over at the end — a faint dark "ghost" so the frame
// stays visible through it.
export function shellMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x0f1012, metalness: 0.1, roughness: 0.9,
    transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
    emissive: 0xcda24e, emissiveIntensity: 0.03,
  });
}

// Edge-line material for the wireframe drawing accents.
export function lineMaterial(hex = 0xcda24e, opacity = 0.5) {
  return new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity });
}
