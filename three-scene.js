// ============================================================
// BHAKTI LATA BEEJ — Three.js Atmospheric Background v3
// Updated palette: forest green + gold + saffron
// ============================================================

let scene, camera, renderer;
let particles, particleGeometry;
let targetRot = { x: 0, y: 0 };
let currentRot = { x: 0, y: 0 };
let animFrameId = null;

const C = {
  gold:      0xC5A059,
  saffron:   0xD45B34,
  forest:    0x2A3600,
  cream:     0xF8F4EE,
};

function initThree() {
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(C.cream, 0.045);

  // Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 9);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(C.forest, 0.5));

  const keyLight = new THREE.DirectionalLight(C.gold, 1.1);
  keyLight.position.set(4, 8, 3);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(C.saffron, 0.35);
  fillLight.position.set(-5, 2, 5);
  scene.add(fillLight);

  createParticles();

  window.addEventListener('resize', onResize);
  document.addEventListener('mousemove', onMouseMove, { passive: true });

  animate();
}

// Floating gold dust particles
function createParticles() {
  const COUNT = 280;
  particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const sizes     = new Float32Array(COUNT);
  const speeds    = new Float32Array(COUNT);
  const drifts    = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    sizes[i]  = 0.1 + Math.random() * 0.2;
    speeds[i] = 0.007 + Math.random() * 0.011;
    drifts[i] = Math.random() * Math.PI * 2;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Soft glow texture
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 24;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(12, 12, 0, 12, 12, 12);
  grad.addColorStop(0,   'rgba(255, 220, 130, 1)');
  grad.addColorStop(0.35,'rgba(212, 160, 80, 0.7)');
  grad.addColorStop(1,   'rgba(197, 160, 89, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 24, 24);

  const pMat = new THREE.PointsMaterial({
    color: C.gold,
    size: 0.17,
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  particles = new THREE.Points(particleGeometry, pMat);
  particles.userData = { speeds, drifts };
  scene.add(particles);
}

function updateParticles(t) {
  if (!particles) return;
  const pos    = particleGeometry.attributes.position.array;
  const speeds = particles.userData.speeds;
  const drifts = particles.userData.drifts;

  for (let i = 0; i < pos.length; i += 3) {
    const idx = i / 3;
    pos[i + 1] += speeds[idx];
    pos[i]     += Math.sin(t * 0.45 + drifts[idx]) * 0.004;

    if (pos[i + 1] > 7) {
      pos[i + 1] = -7;
      pos[i]     = (Math.random() - 0.5) * 12;
    }
  }
  particleGeometry.attributes.position.needsUpdate = true;
}

function onMouseMove(e) {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  targetRot.x = y * 0.05;
  targetRot.y = x * 0.05;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.setThreeScrollProgress = function () {};

function animate(time) {
  animFrameId = requestAnimationFrame(animate);
  const t = (time || 0) * 0.001;

  currentRot.x += (targetRot.x - currentRot.x) * 0.07;
  currentRot.y += (targetRot.y - currentRot.y) * 0.07;

  camera.position.x = Math.sin(currentRot.y) * 9;
  camera.position.z = Math.cos(currentRot.y) * 9;
  camera.position.y = 1.5 + currentRot.x * 3;
  camera.lookAt(0, 0.5, 0);

  updateParticles(t);
  renderer.render(scene, camera);
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(initThree, 120);
});
