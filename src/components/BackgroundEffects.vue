<template>
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden" ref="container">
    <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { getCurrentTheme } from '../themes.js';

const canvas = ref(null);
const container = ref(null);
let animId = null;
let ctx = null;
let particles = [];
let stars = [];
let gridOffset = 0;
let time = 0;
let currentThemeId = 'classic';

// ---- CLASSIC: Floating stars + torch flicker ----
function initClassic(w, h) {
  stars = [];
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 1,
      twinkleSpeed: Math.random() * 2 + 1,
      twinkleOffset: Math.random() * Math.PI * 2,
      brightness: Math.random() * 0.5 + 0.5,
    });
  }
}

function drawClassic(ctx, w, h, t) {
  // Dark gradient background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, '#16213e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Stars with twinkle
  for (const s of stars) {
    const alpha = s.brightness * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
    ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
    // Pixel-style cross for stars
    const sz = s.size;
    ctx.fillRect(s.x - sz, s.y, sz * 2 + 1, 1);
    ctx.fillRect(s.x, s.y - sz, 1, sz * 2 + 1);
  }

  // Torch flicker glow (bottom corners)
  const flicker1 = 0.15 + 0.05 * Math.sin(t * 8) + 0.03 * Math.sin(t * 13);
  const flicker2 = 0.12 + 0.04 * Math.sin(t * 7 + 1) + 0.02 * Math.sin(t * 17);

  const g1 = ctx.createRadialGradient(w * 0.1, h * 0.9, 0, w * 0.1, h * 0.9, h * 0.4);
  g1.addColorStop(0, `rgba(255, 150, 50, ${flicker1})`);
  g1.addColorStop(1, 'rgba(255, 100, 20, 0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, h * 0.5, w * 0.4, h * 0.5);

  const g2 = ctx.createRadialGradient(w * 0.9, h * 0.9, 0, w * 0.9, h * 0.9, h * 0.35);
  g2.addColorStop(0, `rgba(255, 150, 50, ${flicker2})`);
  g2.addColorStop(1, 'rgba(255, 100, 20, 0)');
  ctx.fillStyle = g2;
  ctx.fillRect(w * 0.6, h * 0.5, w * 0.4, h * 0.5);
}

// ---- MILLENNIUM: Mako particle stream + blue nebula ----
function initMillennium(w, h) {
  particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.2,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.7 ? 210 : 150, // blue or green
    });
  }
}

function drawMillennium(ctx, w, h, t) {
  // Deep space gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0a0e1a');
  grad.addColorStop(0.5, '#1a1f3a');
  grad.addColorStop(1, '#0a0e1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Mako glow center
  const cg = ctx.createRadialGradient(w * 0.5, h * 0.6, 0, w * 0.5, h * 0.6, h * 0.5);
  const pulseAlpha = 0.04 + 0.02 * Math.sin(t * 0.5);
  cg.addColorStop(0, `rgba(0, 255, 136, ${pulseAlpha})`);
  cg.addColorStop(1, 'rgba(0, 100, 50, 0)');
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, w, h);

  // Particles
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;

    const pAlpha = p.alpha * (0.6 + 0.4 * Math.sin(t * 2 + p.x));
    const color = p.hue === 150 ? `rgba(0, 255, 136, ${pAlpha})` : `rgba(74, 144, 217, ${pAlpha})`;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Glow
    const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
    const glowColor = p.hue === 150 ? `rgba(0, 255, 136, ${pAlpha * 0.2})` : `rgba(74, 144, 217, ${pAlpha * 0.2})`;
    pg.addColorStop(0, glowColor);
    pg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = pg;
    ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);
  }
}

// ---- SCI-FI: Holographic grid + star field ----
function initScifi(w, h) {
  stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
      alpha: Math.random() * 0.8 + 0.2,
    });
  }
  particles = [];
  gridOffset = 0;
}

function drawScifi(ctx, w, h, t) {
  // Pure black space
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // Star field (drifting)
  for (const s of stars) {
    s.y += s.speed;
    if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
    const sa = s.alpha * (0.5 + 0.5 * Math.sin(t * 3 + s.x));
    ctx.fillStyle = `rgba(200, 230, 255, ${sa})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }

  // Holographic perspective grid on bottom half
  gridOffset = (gridOffset + 0.5) % 40;
  const gridY0 = h * 0.55;
  const gridAlpha = 0.08 + 0.03 * Math.sin(t * 0.8);

  ctx.strokeStyle = `rgba(0, 255, 255, ${gridAlpha})`;
  ctx.lineWidth = 1;

  // Horizontal lines (perspective)
  for (let i = 0; i < 12; i++) {
    const yFrac = i / 12;
    const yPos = gridY0 + (h - gridY0) * (yFrac * yFrac); // quadratic for perspective
    const yOff = (i * 40 + gridOffset) % (h - gridY0);
    const y = gridY0 + (yOff / (h - gridY0)) * (yOff / (h - gridY0)) * (h - gridY0);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Vertical lines (converging to center)
  const vanishX = w * 0.5;
  for (let i = -8; i <= 8; i++) {
    const bottomX = vanishX + i * (w / 10);
    ctx.beginPath();
    ctx.moveTo(vanishX, gridY0);
    ctx.lineTo(bottomX, h);
    ctx.stroke();
  }

  // Scan line effect
  const scanY = (t * 50) % h;
  const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
  scanGrad.addColorStop(0, 'rgba(0, 255, 255, 0)');
  scanGrad.addColorStop(0.5, 'rgba(0, 255, 255, 0.03)');
  scanGrad.addColorStop(1, 'rgba(0, 255, 255, 0)');
  ctx.fillStyle = scanGrad;
  ctx.fillRect(0, scanY - 20, w, 40);

  // Holographic HUD corners
  ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 + 0.05 * Math.sin(t)})`;
  ctx.lineWidth = 2;
  const cs = 40;
  // Top-left
  ctx.beginPath(); ctx.moveTo(10, 10 + cs); ctx.lineTo(10, 10); ctx.lineTo(10 + cs, 10); ctx.stroke();
  // Top-right
  ctx.beginPath(); ctx.moveTo(w - 10 - cs, 10); ctx.lineTo(w - 10, 10); ctx.lineTo(w - 10, 10 + cs); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(10, h - 10 - cs); ctx.lineTo(10, h - 10); ctx.lineTo(10 + cs, h - 10); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(w - 10 - cs, h - 10); ctx.lineTo(w - 10, h - 10); ctx.lineTo(w - 10, h - 10 - cs); ctx.stroke();
}

function animate() {
  if (!ctx || !canvas.value) return;
  const w = canvas.value.width;
  const h = canvas.value.height;
  time += 0.016;

  switch (currentThemeId) {
    case 'millennium': drawMillennium(ctx, w, h, time); break;
    case 'scifi': drawScifi(ctx, w, h, time); break;
    default: drawClassic(ctx, w, h, time); break;
  }

  animId = requestAnimationFrame(animate);
}

function resize() {
  if (!canvas.value || !container.value) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = container.value.getBoundingClientRect();
  canvas.value.width = rect.width * dpr;
  canvas.value.height = rect.height * dpr;
  ctx = canvas.value.getContext('2d');
  ctx.scale(dpr, dpr);
  // Re-init for new size
  const w = rect.width;
  const h = rect.height;
  switch (currentThemeId) {
    case 'millennium': initMillennium(w, h); break;
    case 'scifi': initScifi(w, h); break;
    default: initClassic(w, h); break;
  }
}

function updateTheme() {
  const theme = getCurrentTheme();
  currentThemeId = theme.id || 'classic';
  if (container.value) {
    const rect = container.value.getBoundingClientRect();
    switch (currentThemeId) {
      case 'millennium': initMillennium(rect.width, rect.height); break;
      case 'scifi': initScifi(rect.width, rect.height); break;
      default: initClassic(rect.width, rect.height); break;
    }
  }
}

// Watch for theme changes via localStorage
let storageListener = null;

onMounted(() => {
  updateTheme();
  resize();
  animate();
  window.addEventListener('resize', resize);
  storageListener = (e) => {
    if (e.key === 'standup_theme') updateTheme();
  };
  window.addEventListener('storage', storageListener);
  // Also poll for same-tab theme changes
  const interval = setInterval(updateTheme, 1000);
  onUnmounted(() => clearInterval(interval));
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
  window.removeEventListener('resize', resize);
  if (storageListener) window.removeEventListener('storage', storageListener);
});
</script>