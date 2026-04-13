<template>
  <!-- Transition Overlay -->
  <Transition name="transition-overlay">
    <div v-if="store.state === 'TRANSITION'" class="fixed inset-0 z-50 flex flex-col items-center justify-center transition-screen"
         :class="`theme-${themeId}`">
      
      <!-- Background particles/sparks -->
      <canvas ref="transCanvas" class="absolute inset-0 w-full h-full"></canvas>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center">
        <!-- "NEXT QUEST" text -->
        <div class="text-sm tracking-[0.3em] mb-4 transition-subtitle"
             :style="{ color: accentColor }">
          NEXT QUEST
        </div>
        
        <!-- Countdown number -->
        <div class="text-8xl md:text-9xl font-bold transition-countdown"
             :style="{ color: accentColor, textShadow: `0 0 40px ${accentColor}80` }">
          {{ store.transitionTimeRemaining }}
        </div>
        
        <!-- Quest preview -->
        <div class="mt-8 text-xs max-w-md text-center transition-quest-preview">
          <div class="mb-2 tracking-[0.2em] text-gray-400" style="font-size:8px">PREPARE FOR</div>
          <div class="leading-relaxed uppercase" :style="{ color: `${accentColor}cc` }">
            {{ nextQuestText }}
          </div>
        </div>
        
        <!-- Decorative lines -->
        <div class="flex items-center gap-4 mt-6 w-64">
          <div class="flex-1 h-px transition-line" :style="{ background: `linear-gradient(to right, transparent, ${accentColor}80)` }"></div>
          <div class="text-lg" :style="{ color: accentColor }">⚔️</div>
          <div class="flex-1 h-px transition-line" :style="{ background: `linear-gradient(to left, transparent, ${accentColor}80)` }"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { store } from '../store.js';
import { getCurrentTheme } from '../themes.js';

const transCanvas = ref(null);
let tCtx = null;
let tAnimId = null;
let sparks = [];
let time = 0;

const themeId = computed(() => getCurrentTheme().id || 'classic');
const accentColor = computed(() => getCurrentTheme().colors?.accent || '#ffd700');

const nextQuestText = computed(() => {
  const nextIdx = store.currentQuestIndex + 1;
  if (nextIdx < store.selectedQuests.length) {
    return store.selectedQuests[nextIdx]?.text || '';
  }
  return 'THE FINAL STRETCH';
});

// --- Spark/particle effects for transition ---
function initSparks(w, h) {
  sparks = [];
  const count = 30;
  for (let i = 0; i < count; i++) {
    sparks.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 40,
      vy: -Math.random() * 60 - 20,
      size: Math.random() * 3 + 1,
      life: 1,
      decay: 0.005 + Math.random() * 0.008,
      hue: Math.random() > 0.5,
    });
  }
}

function animateTransition() {
  if (!transCanvas.value || store.state !== 'TRANSITION') {
    tAnimId = null;
    return;
  }

  const canvas = transCanvas.value;
  if (!tCtx) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    tCtx = canvas.getContext('2d');
    tCtx.scale(dpr, dpr);
    initSparks(window.innerWidth, window.innerHeight);
  }

  const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
  const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
  time += 0.016;

  tCtx.clearRect(0, 0, w, h);

  const accent = accentColor.value;

  for (const s of sparks) {
    s.x += s.vx * 0.016;
    s.y += s.vy * 0.016;
    s.vy += 30 * 0.016; // slight gravity
    s.life -= s.decay;

    if (s.life <= 0) {
      // Respawn
      s.x = Math.random() * w;
      s.y = h + 10;
      s.vy = -Math.random() * 80 - 40;
      s.vx = (Math.random() - 0.5) * 60;
      s.life = 1;
    }

    tCtx.globalAlpha = s.life * 0.6;
    tCtx.fillStyle = s.hue ? accent : '#ffffff';
    tCtx.fillRect(s.x, s.y, s.size, s.size);
  }

  tCtx.globalAlpha = 1;
  tAnimId = requestAnimationFrame(animateTransition);
}

// Start/stop animation when transition state changes
watch(() => store.state, (newState) => {
  if (newState === 'TRANSITION') {
    tCtx = null; // reset
    if (!tAnimId) animateTransition();
  } else {
    if (tAnimId) {
      cancelAnimationFrame(tAnimId);
      tAnimId = null;
    }
  }
});

onUnmounted(() => {
  if (tAnimId) cancelAnimationFrame(tAnimId);
});
</script>

<style scoped>
.transition-screen {
  background: #000;
  font-family: 'Press Start 2P', monospace;
}

/* Transition overlay animation */
.transition-overlay-enter-active {
  animation: transEnter 0.5s ease-out;
}

.transition-overlay-leave-active {
  animation: transLeave 0.3s ease-in;
}

@keyframes transEnter {
  0% { opacity: 0; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes transLeave {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.95); }
}

/* Subtitle animation */
.transition-subtitle {
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Countdown number animation */
.transition-countdown {
  animation: countPulse 1s ease-in-out infinite alternate;
}

@keyframes countPulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

/* Quest preview slide in */
.transition-quest-preview {
  animation: slideUp 0.5s ease-out 0.2s both;
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Decorative line animation */
.transition-line {
  animation: lineExpand 0.8s ease-out 0.3s both;
}

@keyframes lineExpand {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
</style>