<template>
  <div class="min-h-screen text-white flex flex-col items-center justify-start pt-8 px-4 space-y-8 relative overflow-hidden">
    
    <!-- Confetti Canvas -->
    <canvas ref="confettiCanvas" class="fixed inset-0 z-0 pointer-events-none"></canvas>
    
    <!-- Content -->
    <div class="relative z-10 w-full flex flex-col items-center space-y-8">
      
      <!-- Title -->
      <div class="retro-panel w-full max-w-4xl text-center border-yellow-400">
        <h1 class="text-2xl md:text-4xl text-yellow-400 hof-title">HALL OF FAME</h1>
        <div class="text-[8px] text-gray-400 mt-2 tracking-[0.3em]">THE HEROES HAVE SPOKEN</div>
      </div>

      <!-- Podium -->
      <div v-if="sortedParty.length > 0 && podiumMembers.length > 0" class="w-full max-w-5xl relative">
        <!-- Podium platform -->
        <div class="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 pt-8 md:pt-12">
          
          <!-- 2nd Place -->
          <div v-if="podiumMembers[1]" class="flex flex-col items-center order-2 md:order-1 podium-slot podium-2"
               :style="{ animationDelay: '0.6s' }">
            <div class="text-[10px] text-gray-300 mb-2 tracking-[0.2em]">🥈 RANK 2</div>
            <div class="podium-avatar-container podium-silver">
              <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${podiumMembers[1].avatarClass}&size=128`" 
                   class="w-20 h-20 md:w-24 md:h-24 border-4 border-gray-400 pixelated bg-black" alt="avatar" />
            </div>
            <div class="podium-base podium-base-2">
              <div class="text-sm mt-1 text-white uppercase">{{ podiumMembers[1].name }}</div>
              <div class="text-xs text-yellow-400 mt-1">{{ podiumMembers[1].score }} PTS</div>
            </div>
          </div>

          <!-- 1st Place -->
          <div v-if="podiumMembers[0]" class="flex flex-col items-center order-1 md:order-2 z-10 podium-slot podium-1"
               :style="{ animationDelay: '0s' }">
            <div class="text-xs text-yellow-400 mb-2 tracking-[0.2em] crown-bounce">👑 CHAMPION</div>
            <div class="podium-avatar-container podium-gold">
              <div class="crown-glow"></div>
              <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${podiumMembers[0].avatarClass}&size=128`" 
                   class="w-24 h-24 md:w-32 md:h-32 border-4 border-yellow-400 pixelated bg-black" alt="avatar" />
            </div>
            <div class="podium-base podium-base-1">
              <div class="text-base mt-2 text-white uppercase">{{ podiumMembers[0].name }}</div>
              <div class="text-sm text-yellow-400 mt-1">{{ podiumMembers[0].score }} PTS</div>
            </div>
          </div>

          <!-- 3rd Place -->
          <div v-if="podiumMembers[2]" class="flex flex-col items-center order-3 podium-slot podium-3"
               :style="{ animationDelay: '1.2s' }">
            <div class="text-[10px] text-yellow-700 mb-2 tracking-[0.2em]">🥉 RANK 3</div>
            <div class="podium-avatar-container podium-bronze">
              <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${podiumMembers[2].avatarClass}&size=128`" 
                   class="w-16 h-16 md:w-20 md:h-20 border-4 border-yellow-700 pixelated bg-black" alt="avatar" />
            </div>
            <div class="podium-base podium-base-3">
              <div class="text-sm mt-1 text-white uppercase">{{ podiumMembers[2].name }}</div>
              <div class="text-xs text-yellow-400 mt-1">{{ podiumMembers[2].score }} PTS</div>
            </div>
          </div>
          
        </div>
      </div>

      <!-- The Rest / The Fallen -->
      <div class="w-full max-w-2xl retro-panel">
        <h3 class="text-sm md:text-base text-yellow-300 mb-4 border-b-4 border-white pb-2 inline-block">
          HONORABLE MENTIONS
        </h3>
        
        <ul class="space-y-3">
          <li v-for="(member, index) in theRest" :key="member.name"
              class="flex items-center justify-between p-3 border-4 border-white hof-entry"
              :class="[
                member.score === 0 ? 'bg-red-900/50 border-red-500' : 'bg-black',
                { 'hof-fallen': member.score === 0 }
              ]"
              :style="{ animationDelay: (1.5 + index * 0.1) + 's' }">
            
            <div class="flex items-center gap-3" :class="{ 'grayscale opacity-50': member.score === 0 }">
              <span class="text-xs text-gray-400 w-6">{{ podiumCount + index + 1 }}.</span>
              <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${member.avatarClass}`" 
                   class="w-10 h-10 border-2 border-white pixelated bg-black" alt="avatar" />
              <div>
                <span class="block text-[10px] uppercase" :class="member.score === 0 ? 'text-red-400 line-through' : 'text-white'">
                  {{ member.name }}
                </span>
                <span class="block text-[7px] text-gray-400 uppercase">LV 1 {{ member.avatarClass }}</span>
              </div>
            </div>
            
            <div v-if="member.score > 0" class="text-xs text-yellow-400">{{ member.score }} PTS</div>
            <div v-else class="text-xs text-red-500" title="The Fallen">
              🪦 RIP
            </div>
          </li>
        </ul>
        
        <div v-if="theRest.length === 0" class="text-center text-gray-500 text-[8px] py-4">
          NO OTHER SURVIVORS...
        </div>
      </div>

      <button 
        @click="store.quitJourney" 
        class="retro-btn text-sm py-3 px-8 mb-8 hof-btn"
      >
        RETURN TO TAVERN
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { store } from '../store.js';

const confettiCanvas = ref(null);
let cCtx = null;
let confetti = [];
let cAnimId = null;

const sortedParty = computed(() => {
  return [...store.party].sort((a, b) => b.score - a.score);
});

const podiumMembers = computed(() => {
  return sortedParty.value.filter(m => m.score > 0).slice(0, 3);
});

const podiumCount = computed(() => podiumMembers.value.length);

const theRest = computed(() => {
  return sortedParty.value.filter(m => !podiumMembers.value.includes(m));
});

// --- Confetti system ---
function initConfetti() {
  confetti = [];
  const colors = ['#ffd700', '#ff4444', '#44ff44', '#4488ff', '#ff44ff', '#ffaa00', '#ffffff'];
  for (let i = 0; i < 80; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -Math.random() * window.innerHeight * 0.5,
      vx: (Math.random() - 0.5) * 60,
      vy: Math.random() * 100 + 50,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 300,
      w: 4 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: 0.001 + Math.random() * 0.002,
    });
  }
}

function animateConfetti() {
  if (!confettiCanvas.value) return;
  const canvas = confettiCanvas.value;
  if (!cCtx) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    cCtx = canvas.getContext('2d');
    cCtx.scale(dpr, dpr);
    initConfetti();
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  cCtx.clearRect(0, 0, w, h);

  let alive = 0;
  for (const c of confetti) {
    c.x += c.vx * 0.016;
    c.y += c.vy * 0.016;
    c.vy += 40 * 0.016; // gravity
    c.vx *= 0.999;
    c.rotation += c.rotSpeed * 0.016;
    c.life -= c.decay;

    if (c.life <= 0 || c.y > h + 20) {
      // Respawn from top
      c.y = -10;
      c.x = Math.random() * w;
      c.vy = Math.random() * 80 + 40;
      c.vx = (Math.random() - 0.5) * 50;
      c.life = 1;
    }

    cCtx.save();
    cCtx.translate(c.x, c.y);
    cCtx.rotate(c.rotation * Math.PI / 180);
    cCtx.globalAlpha = Math.min(c.life, 1) * 0.8;
    cCtx.fillStyle = c.color;
    cCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    cCtx.restore();
    alive++;
  }

  cCtx.globalAlpha = 1;

  if (alive > 0) {
    cAnimId = requestAnimationFrame(animateConfetti);
  }
}

onMounted(() => {
  animateConfetti();
  // Stop confetti after 8 seconds (it just becomes ambient particles)
});

onUnmounted(() => {
  if (cAnimId) cancelAnimationFrame(cAnimId);
});
</script>

<style scoped>
/* Title animation */
.hof-title {
  animation: titleReveal 1s ease-out;
}

@keyframes titleReveal {
  0% { opacity: 0; transform: scale(0.5); letter-spacing: 0.5em; }
  50% { opacity: 1; transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Podium slot reveal */
.podium-slot {
  opacity: 0;
  animation: podiumReveal 0.8s ease-out forwards;
}

@keyframes podiumReveal {
  0% { opacity: 0; transform: translateY(30px); }
  60% { opacity: 1; transform: translateY(-5px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Crown bounce */
.crown-bounce {
  animation: crownBounce 2s ease-in-out infinite;
}

@keyframes crownBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Gold avatar glow */
.podium-gold {
  position: relative;
}

.crown-glow {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent 70%);
  animation: goldPulse 2s ease-in-out infinite;
}

@keyframes goldPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Podium bases */
.podium-base {
  border: 4px solid white;
  padding: 8px 16px;
  text-align: center;
  margin-top: -4px;
}

.podium-base-1 {
  background: linear-gradient(180deg, #b8860b, #8b6914);
  min-height: 60px;
  border-color: #ffd700;
}

.podium-base-2 {
  background: linear-gradient(180deg, #808080, #606060);
  min-height: 45px;
  border-color: #c0c0c0;
}

.podium-base-3 {
  background: linear-gradient(180deg, #cd7f32, #8b5a2b);
  min-height: 35px;
  border-color: #cd7f32;
}

/* Avatar containers */
.podium-avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Entry list reveal */
.hof-entry {
  opacity: 0;
  animation: entryReveal 0.5s ease-out forwards;
}

@keyframes entryReveal {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* Fallen member effect */
.hof-fallen {
  animation: fallenReveal 0.5s ease-out forwards;
}

@keyframes fallenReveal {
  0% { opacity: 0; transform: translateX(-20px) rotate(-2deg); }
  100% { opacity: 1; transform: translateX(0) rotate(0deg); }
}

/* Return button */
.hof-btn {
  animation: btnReveal 0.5s ease-out 2s both;
}

@keyframes btnReveal {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>