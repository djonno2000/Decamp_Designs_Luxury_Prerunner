// scene.js — HeroScene: the spaceframe fly-through. Builds the frame + parts + a translucent
// body shell from a ChassisSpec, exposes setProgress(0..1) driving the whole assembly AND the
// camera fly-through, and renders only while on-screen. Three.js r128 global.
import { buildSpaceframe } from './spaceframe.js';
import { buildParts } from './partSlot.js';
import { shellMaterial } from './materials.js';
import { recommendedDPR } from './deviceTier.js';
const THREE = window.THREE;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

export class HeroScene {
  constructor(container, spec, opts = {}) {
    this.container = container;
    this.tier = opts.tier || 'high';
    this.allowIdle = opts.allowIdle !== false;   // gentle auto-rotate
    this.spec = spec;
    this._raf = 0; this._visible = true; this._t = 0; this._progress = 0;

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 480;

    this.renderer = new THREE.WebGLRenderer({ antialias: this.tier !== 'low', alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(recommendedDPR(this.tier));
    this.renderer.setSize(w, h);
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, w / h, 10, 80000);

    // lights
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xecdcb0, 0.9); key.position.set(3000, 5000, 3000); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xcda24e, 0.5); rim.position.set(-2000, 1500, -2500); this.scene.add(rim);

    // model (chassis coords); centered to origin via model.position
    this.model = new THREE.Group();
    this.scene.add(this.model);

    const wheelR = (spec.tyreRadiusMm || (spec.tyreDiameterIn * 25.4) / 2) || 470;
    spec.partSlots && spec.partSlots.forEach((s) => { if (/^(tyre|wheel)/.test(s.id)) s.tyreRadius = wheelR; });

    this.frame = buildSpaceframe(spec, { tubeOd: 44 });
    this.parts = buildParts(spec, {});
    this.model.add(this.frame.group, this.parts.group);

    // translucent body shell over the cab/cage region (skins in at the end)
    const c = this.frame.center, s = this.frame.size;
    const shellW = Math.min(s.z * 0.95, 1200), shellH = s.y * 0.78, shellL = s.x * 0.42;
    const shellGeo = new THREE.BoxGeometry(shellL, shellH, shellW);
    this.shell = new THREE.Mesh(shellGeo, shellMaterial());
    this.shell.position.set(c.x - s.x * 0.04, c.y + s.y * 0.12, c.z);
    this.model.add(this.shell);

    // ground grid
    const grid = new THREE.GridHelper(Math.max(s.x, s.z) * 2.2, 26, 0x2a2f37, 0x1b1f25);
    grid.position.set(c.x, this.frame.box.min.y, c.z);
    this.model.add(grid);

    // centre the model on origin
    this.model.position.set(-c.x, -c.y, -c.z);

    // camera framing
    this.D = Math.max(s.x, s.z, s.y);
    this._setProgress(0);

    this._onResize = this._resize.bind(this);
    window.addEventListener('resize', this._onResize);

    // pause when offscreen
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver((es) => { this._visible = es[0].isIntersecting; if (this._visible) this._loop(); }, { threshold: 0.01 });
      this._io.observe(container);
    }
    this._loop();
  }

  _camPath(p) {
    const D = this.D;
    // start: wide, low, front-quarter → end: closer hero 3/4
    const sx = D * 0.62, sy = D * 0.46, sz = D * 1.0;
    const ex = D * 0.78, ey = D * 0.34, ez = D * 0.62;
    const e = smooth(p);
    this.camera.position.set(lerp(sx, ex, e), lerp(sy, ey, e), lerp(sz, ez, e));
    this.camera.lookAt(0, this.D * 0.02, 0);
  }

  _setProgress(p) {
    this._progress = clamp(p, 0, 1);
    this.frame.setProgress(this._progress);
    this.parts.setProgress(this._progress);
    this.shell.material.opacity = smooth((this._progress - 0.8) / 0.2) * 0.16;
    this.shell.visible = this._progress > 0.8;
    this._camPath(this._progress);
  }

  setProgress(p) { this._setProgress(p); this._render(); }

  _resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this._render();
  }

  _render() { this.renderer.render(this.scene, this.camera); }

  _loop() {
    cancelAnimationFrame(this._raf);
    const tick = () => {
      if (!this._visible) return;                 // suspend offscreen
      if (this.allowIdle) { this.model.rotation.y += 0.0016; }
      this._render();
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  setIdle(on) { this.allowIdle = on; }

  dispose() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    this._io && this._io.disconnect();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
  }
}
