<template>
  <div class="relative h-screen max-h-screen overflow-hidden text-white flex flex-col items-center justify-start py-4 px-4 gap-4" ref="journeyRoot">
    
    <!-- Screen Flash Overlay -->
    <div v-if="screenFlash" class="fixed inset-0 z-30 pointer-events-none"
         :style="{ background: flashColor, opacity: flashAlpha }"></div>

    <!-- Top Controls -->
    <div class="retro-panel w-full max-w-6xl flex flex-row justify-between items-center py-2 px-4 gap-4 shrink-0">
      <div class="flex flex-wrap justify-center gap-2">
        <button @click="store.togglePause" class="retro-btn text-[10px] px-2 py-1">
          {{ store.paused ? 'RESUME' : 'PAUSE' }}
        </button>
        <button @click="store.skipQuest" class="retro-btn text-[10px] px-2 py-1">
          SKIP
        </button>
        <button @click="store.quitJourney" class="retro-btn text-[10px] px-2 py-1 bg-red-900 hover:bg-red-700">
          QUIT
        </button>
      </div>

      <!-- Add member mid-journey -->
      <form @submit.prevent="handleAddMember" class="flex gap-2">
        <input 
          v-model="newMember" 
          type="text" 
          placeholder="NEW MEMBER..." 
          class="bg-black border-4 border-white text-white px-2 py-1 focus:outline-none focus:border-yellow-400 font-retro text-[8px] uppercase w-24 md:w-40"
        />
        <button type="submit" class="retro-btn text-[8px] px-2 py-1">
          ADD
        </button>
      </form>
    </div>

    <!-- Active Quest Info -->
    <div class="retro-panel w-full max-w-4xl text-center py-4 relative overflow-hidden flex flex-col items-center shrink-0">
      <!-- Decorative corners -->
      <div class="absolute top-2 left-2 w-2 h-2 border-t-4 border-l-4 border-white"></div>
      <div class="absolute top-2 right-2 w-2 h-2 border-t-4 border-r-4 border-white"></div>
      <div class="absolute bottom-2 left-2 w-2 h-2 border-b-4 border-l-4 border-white"></div>
      <div class="absolute bottom-2 right-2 w-2 h-2 border-b-4 border-r-4 border-white"></div>

      <p class="text-yellow-400 mb-2 text-[10px] tracking-widest">
        QUEST {{ store.currentQuestIndex + 1 }} / {{ store.selectedQuests.length }}
      </p>
      
      <h2 class="text-xs md:text-sm leading-relaxed mb-4 px-4 text-white uppercase drop-shadow-[2px_2px_0px_#000]">
        {{ currentQuestText }}
      </h2>
      
      <!-- Timer -->
      <div class="text-2xl md:text-4xl text-white drop-shadow-[4px_4px_0px_#000]" 
           :class="{ 'text-red-500': store.timeRemaining <= 10 }">
        {{ Math.floor(store.timeRemaining / 60) }}:{{ (store.timeRemaining % 60).toString().padStart(2, '0') }}
      </div>
    </div>

    <!-- Party Grid -->
    <div class="w-full max-w-6xl flex-1 min-h-0 overflow-y-auto custom-scrollbar">
      <div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 pr-2 pb-4">
        <div 
          v-for="member in store.party" 
          :key="member.name"
          @click="handleAwardPoint(member.name, $event)"
          class="relative flex flex-col items-center p-2 border-4 cursor-pointer transition-all duration-150"
          :class="[
            store.currentQuestScoredMembers.has(member.name) 
              ? 'bg-blue-900 border-yellow-400' 
              : 'bg-black border-white hover:border-blue-400',
            member._shaking ? 'score-shake' : ''
          ]"
        >
          <!-- Score indicator -->
          <div class="absolute top-1 right-1 text-[8px] text-yellow-400 bg-black px-1 border border-white"
               :class="{ 'score-bump': member._scoreBump }">
            {{ member.score }}
          </div>
          
          <!-- Glow overlay on score -->
          <div v-if="member._glowing" class="absolute inset-0 pointer-events-none score-glow"></div>
          
          <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${member.avatarClass}`" 
               class="w-10 h-10 mb-2 border-2 border-white pixelated" alt="avatar" />
               
          <span class="text-[8px] text-center truncate w-full uppercase text-yellow-200" :title="member.name">
            {{ member.name }}
          </span>
          
          <span class="text-[6px] text-gray-400 uppercase mt-1">
            LV1 {{ member.avatarClass }}
          </span>
        </div>
      </div>
    </div>

    <!-- Floating Score Texts -->
    <div class="fixed inset-0 z-20 pointer-events-none overflow-hidden">
      <div v-for="ft in floatingTexts" :key="ft.id"
           class="absolute floating-score"
           :style="{ left: ft.x + 'px', top: ft.y + 'px', color: ft.color }">
        +1 ⚔️
      </div>
    </div>

    <!-- Particle Canvas -->
    <canvas ref="particleCanvas" class="fixed inset-0 z-15 pointer-events-none"></canvas>

    <!-- Transition Overlay -->
    <div v-if="store.state === 'TRANSITION'" class="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div class="retro-panel border-yellow-400 text-center">
        <div class="text-xl text-white mb-8">PREPARE YOURSELF</div>
        <div class="text-6xl text-yellow-400 animate-pulse">
          {{ store.transitionTimeRemaining }}
        </div>
      </div>
    </div>
    
    <!-- Paused Overlay -->
    <div v-if="store.paused && store.state !== 'TRANSITION'" class="fixed inset-0 z-40 bg-black/80 flex items-center justify-center">
      <div class="retro-panel border-red-500">
        <div class="text-4xl text-red-500 tracking-widest">PAUSED</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { store } from '../store.js';
import { getCurrentTheme } from '../themes.js';

const newMember = ref('');
const journeyRoot = ref(null);
const particleCanvas = ref(null);

// --- Floating score texts ---
const floatingTexts = ref([]);
let ftId = 0;

// --- Screen flash ---
const screenFlash = ref(false);
const flashColor = ref('white');
const flashAlpha = ref(0);

// --- Particle system ---
let pCtx = null;
let particles = [];
let pAnimId = null;

function getThemeAccent() {
  const t = getCurrentTheme();
  return t.colors?.accent || '#ffd700';
}

function handleAwardPoint(name, event) {
  if (store.state !== 'JOURNEY' || store.paused) return;
  if (store.currentQuestScoredMembers.has(name)) return;
  
  const member = store.party.find(m => m.name === name);
  if (!member) return;

  // Award the point
  store.awardPoint(name);
  if (!store.currentQuestScoredMembers.has(name)) return; // didn't actually score

  const accentColor = getThemeAccent();

  // 1. Floating "+1" text at click position
  const rect = journeyRoot.value?.getBoundingClientRect();
  if (rect && event) {
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = ftId++;
    floatingTexts.value.push({ id, x, y, color: accentColor });
    setTimeout(() => {
      floatingTexts.value = floatingTexts.value.filter(f => f.id !== id);
    }, 1000);
  }

  // 2. Particle burst from click position
  if (event && particleCanvas.value) {
    const pRect = particleCanvas.value.getBoundingClientRect();
    const px = event.clientX - pRect.left;
    const py = event.clientY - pRect.top;
    spawnParticleBurst(px, py, accentColor);
  }

  // 3. Card shake + glow
  member._shaking = true;
  member._glowing = true;
  member._scoreBump = true;
  setTimeout(() => { member._shaking = false; }, 400);
  setTimeout(() => { member._glowing = false; }, 600);
  setTimeout(() => { member._scoreBump = false; }, 300);

  // 4. Screen flash
  screenFlash.value = true;
  flashColor.value = accentColor;
  flashAlpha.value = 0.15;
  requestAnimationFrame(() => {
    flashAlpha.value = 0;
    setTimeout(() => { screenFlash.value = false; }, 200);
  });
}

// --- Particle burst ---
function spawnParticleBurst(x, y, color) {
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
    const speed = 80 + Math.random() * 120;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.015 + Math.random() * 0.01,
      size: 2 + Math.random() * 3,
      color,
    });
  }
  if (!pAnimId) animateParticles();
}

function animateParticles() {
  if (!particleCanvas.value) return;
  const canvas = particleCanvas.value;
  if (!pCtx) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    pCtx = canvas.getContext('2d');
    pCtx.scale(dpr, dpr);
  }

  pCtx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * 0.016;
    p.y += p.vy * 0.016;
    p.vy += 200 * 0.016; // gravity
    p.vx *= 0.97; // drag
    p.life -= p.decay;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    pCtx.globalAlpha = p.life;
    pCtx.fillStyle = p.color;
    pCtx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }

  pCtx.globalAlpha = 1;

  if (particles.length > 0) {
    pAnimId = requestAnimationFrame(animateParticles);
  } else {
    pAnimId = null;
    pCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Handle resize
function handleResize() {
  if (particleCanvas.value) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.value.width = window.innerWidth * dpr;
    particleCanvas.value.height = window.innerHeight * dpr;
    pCtx = particleCanvas.value.getContext('2d');
    pCtx.scale(dpr, dpr);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize);
}

onUnmounted(() => {
  if (pAnimId) cancelAnimationFrame(pAnimId);
  window.removeEventListener('resize', handleResize);
});

const currentQuestText = computed(() => {
  return store.selectedQuests[store.currentQuestIndex]?.text || '';
});

const handleAddMember = () => {
  if (newMember.value.trim()) {
    store.addMember(newMember.value.trim());
    newMember.value = '';
  }
};
</script>

<style scoped>
/* Floating score text animation */
.floating-score {
  font-family: 'Press Start 2P', monospace;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 0px #000, -1px -1px 0px #000;
  animation: floatUp 1s ease-out forwards;
  pointer-events: none;
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  50% { transform: translateY(-40px) scale(1.3); opacity: 0.8; }
  100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
}

/* Card shake on score */
.score-shake {
  animation: cardShake 0.4s ease-out;
}

@keyframes cardShake {
  0% { transform: translate(0, 0); }
  20% { transform: translate(-4px, -2px); }
  40% { transform: translate(4px, 2px); }
  60% { transform: translate(-2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0, 0); }
}

/* Score bump animation */
.score-bump {
  animation: scoreBump 0.3s ease-out;
}

@keyframes scoreBump {
  0% { transform: scale(1); }
  50% { transform: scale(1.8); color: #ffd700; }
  100% { transform: scale(1); }
}

/* Glow overlay */
.score-glow {
  animation: glowPulse 0.6s ease-out;
  border-radius: 0;
}

@keyframes glowPulse {
  0% { box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.6); }
  100% { box-shadow: inset 0 0 0px rgba(255, 215, 0, 0); }
}

/* Z-index for particle canvas */
.z-15 {
  z-index: 15;
}
</style>