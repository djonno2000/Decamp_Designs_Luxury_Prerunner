// configurator.js — the live DriftCast tube chassis. Frame from chassis.driftcast.js (fully
// assembled), with configurable engine / gearbox / diff / wheels / skin that update on selection,
// swappable mount-plate modules highlighted gold, and OrbitControls for inspection. Three.js r128.
import { buildSpaceframe } from './spaceframe.js';
import { swapMaterial } from './materials.js';
import { recommendedDPR } from './deviceTier.js';
const THREE = window.THREE;

const ENGINE_BOX = {
  I4: { l: 480, w: 480, h: 600 }, I6: { l: 760, w: 440, h: 620 },
  V6: { l: 540, w: 600, h: 560 }, V8: { l: 640, w: 700, h: 580 }, rotary: { l: 420, w: 460, h: 500 },
};
const ENGINE_HUE = { 'Ford Barra': 0xb5552f, 'GM LS': 0xc0c4c8, 'Toyota JZ': 0xcda24e, 'Nissan SR': 0x6f86a8, 'Nissan RB': 0x8f6f3a, 'Toyota UZ': 0x9aa0a6, 'Honda K': 0xb33b3b };

export class ConfiguratorScene {
  constructor(container, spec, opts = {}) {
    this.container = container; this.spec = spec; this.tier = opts.tier || 'high';
    this._raf = 0; this._visible = true;
    const w = container.clientWidth || 800, h = container.clientHeight || 480;

    this.renderer = new THREE.WebGLRenderer({ antialias: this.tier !== 'low', alpha: true });
    this.renderer.setPixelRatio(recommendedDPR(this.tier));
    this.renderer.setSize(w, h);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, w / h, 10, 60000);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xecdcb0, 0.9); key.position.set(2500, 4000, 2500); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fb6c9, 0.4); rim.position.set(-2000, 1500, -2000); this.scene.add(rim);

    this.model = new THREE.Group(); this.scene.add(this.model);
    this.frame = buildSpaceframe(spec, { tubeOd: 40 });
    this.frame.setProgress(1);
    this.model.add(this.frame.group);

    const c = this.frame.center, s = this.frame.size;
    // ground grid
    const grid = new THREE.GridHelper(Math.max(s.x, s.z) * 2.4, 24, 0x2a2f37, 0x1b1f25);
    grid.position.set(c.x, this.frame.box.min.y, c.z); this.model.add(grid);

    // configurable meshes
    this.parts = {};
    this._addEngine(); this._addBlock('gearbox', 0x6a6d74); this._addBlock('diff', 0x9a7d4e);
    this._addWheels(); this._addSkin(s, c);
    this._highlightSwappable();

    this.model.position.set(-c.x, -c.y, -c.z);

    this.D = Math.max(s.x, s.z, s.y);
    this.camera.position.set(this.D * 0.85, this.D * 0.5, this.D * 0.95);
    this.camera.lookAt(0, s.y * 0.1, 0);

    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; this.controls.dampingFactor = 0.08;
      this.controls.minDistance = this.D * 0.5; this.controls.maxDistance = this.D * 2.2;
      this.controls.maxPolarAngle = Math.PI * 0.49; this.controls.target.set(0, s.y * 0.08, 0);
      this.controls.autoRotate = !opts.reduced; this.controls.autoRotateSpeed = 0.5;
    }

    this._onResize = this._resize.bind(this); window.addEventListener('resize', this._onResize);
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver((es) => { this._visible = es[0].isIntersecting; if (this._visible) this._loop(); }, { threshold: 0.01 });
      this._io.observe(container);
    }
    this._loop();
  }

  _slot(id) { return (this.spec.partSlots || []).find((p) => p.id === id); }

  _addEngine() {
    const slot = this._slot('engine');
    const geo = new THREE.BoxGeometry(600, 600, 480);
    const mat = new THREE.MeshStandardMaterial({ color: 0xc0c4c8, metalness: 0.5, roughness: 0.5 });
    const m = new THREE.Mesh(geo, mat);
    if (slot) m.position.set(slot.pos.x, slot.pos.y + 220, slot.pos.z);
    this.model.add(m); this.parts.engine = m;
  }
  _addBlock(id, hex) {
    const slot = this._slot(id);
    const m = new THREE.Mesh(new THREE.BoxGeometry(380, 320, 320),
      new THREE.MeshStandardMaterial({ color: hex, metalness: 0.45, roughness: 0.55 }));
    if (slot) m.position.set(slot.pos.x, slot.pos.y + 160, slot.pos.z);
    this.model.add(m); this.parts[id] = m;
  }
  _addWheels() {
    this.parts.wheels = [];
    for (const slot of (this.spec.partSlots || [])) {
      if (!/^wheel/.test(slot.id)) continue;
      const g = new THREE.CylinderGeometry(230, 230, 250, 24); g.rotateX(Math.PI / 2);
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x26282c, metalness: 0.3, roughness: 0.7 }));
      m.position.set(slot.pos.x, slot.pos.y, slot.pos.z);
      m.userData.z = slot.pos.z;
      this.model.add(m); this.parts.wheels.push(m);
    }
  }
  _addSkin(s, c) {
    const geo = new THREE.BoxGeometry(s.x * 0.92, s.y * 0.7, s.z * 0.92);
    this.parts.skin = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x17181c, metalness: 0.2, roughness: 0.8, transparent: true, opacity: 0.0, side: THREE.DoubleSide, depthWrite: false,
    }));
    this.parts.skin.position.set(c.x, c.y + s.y * 0.16, c.z);
    this.model.add(this.parts.skin);
  }
  _highlightSwappable() {
    this.swaps = [];
    for (const slot of (this.spec.partSlots || [])) {
      if (!slot.swappable) continue;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(120, 30, 360), swapMaterial());
      plate.material.opacity = 0.55;
      plate.position.set(slot.pos.x, slot.pos.y - 40, slot.pos.z);
      this.model.add(plate); this.swaps.push(plate);
    }
  }

  applyConfig(cfg, cat) {
    const e = cat.engines.find((x) => x.id === cfg.engineId);
    if (e && this.parts.engine) {
      const box = ENGINE_BOX[e.layout] || ENGINE_BOX.I6;
      this.parts.engine.geometry.dispose();
      this.parts.engine.geometry = new THREE.BoxGeometry(box.l, box.h, box.w);
      this.parts.engine.material.color.setHex(ENGINE_HUE[e.family] || 0xc0c4c8);
    }
    const w = cat.wheels.find((x) => x.id === cfg.wheelId);
    if (w && this.parts.wheels) {
      const width = (w.widthIn || 10) * 25.4;
      for (const wheel of this.parts.wheels) wheel.scale.z = width / 250;
    }
    const skin = cat.skins.find((x) => x.id === cfg.skinId);
    if (skin && this.parts.skin) {
      this.parts.skin.material.color.set(skin.colorHex);
      this.parts.skin.material.opacity = skin.id === 'raw-black' ? 0.14 : 0.30;
    }
    this._render();
  }

  _resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight; if (!w || !h) return;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h); this._render();
  }
  _render() { this.controls && this.controls.update(); this.renderer.render(this.scene, this.camera); }
  _loop() {
    cancelAnimationFrame(this._raf);
    const tick = () => { if (!this._visible) return; this._render(); this._raf = requestAnimationFrame(tick); };
    this._raf = requestAnimationFrame(tick);
  }
  dispose() {
    cancelAnimationFrame(this._raf); window.removeEventListener('resize', this._onResize);
    this._io && this._io.disconnect(); this.controls && this.controls.dispose(); this.renderer.dispose();
    if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
  }
}
