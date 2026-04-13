<template>
  <div class="flex flex-col items-center justify-center text-white h-screen max-h-screen overflow-hidden py-4 space-y-4">
    
    <!-- Animated Title -->
    <div class="w-full max-w-4xl text-center py-2 relative">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="title-glow"></div>
      </div>
      <h1 class="text-2xl md:text-4xl text-yellow-400 relative z-10 title-text">STANDUP QUEST</h1>
      <p class="text-[8px] md:text-[10px] text-blue-200 mt-2 tracking-[0.2em] relative z-10">⚔️ A RETRO STANDUP ADVENTURE ⚔️</p>
      <div class="flex items-center justify-center gap-3 mt-2 relative z-10">
        <div class="h-px w-16 md:w-24" style="background: linear-gradient(to right, transparent, rgba(255,215,0,0.5))"></div>
        <span class="text-yellow-600 text-[8px]">◆</span>
        <div class="h-px w-16 md:w-24" style="background: linear-gradient(to left, transparent, rgba(255,215,0,0.5))"></div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row w-full max-w-5xl gap-4 flex-1 min-h-0">
      <!-- Left Column: Party Members -->
      <div class="retro-panel flex-1 flex flex-col min-h-0 relative">
        <div class="flex items-center gap-2 mb-2 shrink-0">
          <span class="text-sm">🗡️</span>
          <h2 class="text-sm md:text-base text-yellow-300 border-b-4 border-white pb-1">PARTY MEMBERS</h2>
        </div>
        
        <form @submit.prevent="handleAddMember" class="flex flex-row gap-2 mb-4 shrink-0">
          <input 
            v-model="newMember" 
            type="text" 
            placeholder="ENTER NAME..." 
            class="flex-1 bg-black border-4 border-white text-white px-2 py-1 focus:outline-none focus:border-yellow-400 font-retro text-[10px] uppercase min-w-0 input-glow"
          />
          <button type="submit" class="retro-btn text-[10px] px-3 py-1 shrink-0 add-btn">+ ADD</button>
        </form>

        <ul class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-0">
          <transition-group name="member-list">
            <li v-for="(member, idx) in store.party" :key="member.name" 
                class="flex items-center justify-between bg-black/50 border-4 border-white p-2 member-card"
                :style="{ animationDelay: idx * 0.05 + 's' }">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${member.avatarClass}`" 
                       class="w-10 h-10 border-2 border-white pixelated bg-black" alt="avatar" />
                  <div class="absolute -bottom-1 -right-1 bg-black border border-white px-1 text-[6px] text-yellow-400">
                    {{ classIcon(member.avatarClass) }}
                  </div>
                </div>
                <div class="flex flex-col justify-center">
                  <span class="text-[10px] text-yellow-400 truncate max-w-[120px]" :title="member.name">{{ member.name }}</span>
                  <span class="text-[8px] text-gray-400 uppercase mt-1">
                    LV1 <span :style="{ color: classColor(member.avatarClass) }">{{ member.avatarClass }}</span>
                  </span>
                </div>
              </div>
              <button @click="store.removeMember(member.name)" class="retro-btn bg-red-900 hover:bg-red-500 border-white text-[10px] px-2 py-1 leading-none shrink-0 remove-btn">✕</button>
            </li>
          </transition-group>
          <li v-if="store.party.length === 0" class="text-gray-500 text-center py-8 text-[10px] leading-loose empty-state">
            <div class="text-2xl mb-2">🗡️</div>
            NO HEROES FOUND...<br/>ADD MEMBERS TO BEGIN.
          </li>
        </ul>
        
        <div v-if="store.party.length > 0" class="text-[8px] text-gray-500 text-center mt-2 shrink-0">
          {{ store.party.length }} / 15 PARTY MEMBERS
        </div>
      </div>

      <!-- Middle Column: Custom Questions -->
      <div class="retro-panel flex-1 flex flex-col min-h-0 relative">
        <div class="flex items-center gap-2 mb-2 shrink-0">
          <span class="text-sm">📜</span>
          <h2 class="text-sm md:text-base text-yellow-300 border-b-4 border-white pb-1">CUSTOM QUESTS</h2>
        </div>
        
        <form @submit.prevent="handleAddQuest" class="flex flex-row gap-2 mb-4 shrink-0">
          <input 
            v-model="newQuest" 
            type="text" 
            placeholder="ADD A QUESTION..." 
            class="flex-1 bg-black border-4 border-white text-white px-2 py-1 focus:outline-none focus:border-yellow-400 font-retro text-[10px] min-w-0 input-glow"
          />
          <button type="submit" class="retro-btn text-[10px] px-3 py-1 shrink-0 add-btn">+ ADD</button>
        </form>

        <ul class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-0">
          <transition-group name="member-list">
            <li v-for="(quest, idx) in store.customQuests" :key="quest"
                class="flex items-start justify-between bg-black/50 border-4 border-yellow-800/60 p-2 member-card"
                :style="{ animationDelay: idx * 0.05 + 's' }">
              <div class="flex items-start gap-2 flex-1 min-w-0">
                <span class="text-[8px] text-yellow-600 shrink-0 mt-1">◆</span>
                <span class="text-[10px] text-yellow-200 leading-relaxed break-words flex-1">{{ quest }}</span>
              </div>
              <button @click="store.removeCustomQuest(quest)" class="retro-btn bg-red-900 hover:bg-red-500 border-white text-[10px] px-2 py-1 leading-none shrink-0 ml-2 remove-btn">✕</button>
            </li>
          </transition-group>
          <li v-if="store.customQuests.length === 0" class="text-gray-500 text-center py-4 text-[10px] leading-loose empty-state">
            <div class="text-2xl mb-2">📜</div>
            NO CUSTOM QUESTS...<br/>ADD YOUR OWN QUESTIONS!
          </li>
        </ul>
        
        <div class="text-[8px] text-gray-500 text-center mt-2 shrink-0">
          {{ store.customQuests.length }} CUSTOM + {{ defaultQuestCount }} BUILT-IN = {{ totalQuestCount }} TOTAL
        </div>
      </div>

      <!-- Right Column: Settings & Start -->
      <div class="flex flex-col w-full md:w-64 gap-4 shrink-0">
        <div class="retro-panel flex flex-col">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-sm">⚙️</span>
            <h2 class="text-sm md:text-base text-yellow-300 border-b-4 border-white pb-1">SETTINGS</h2>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="flex flex-col bg-black border-4 border-white p-3 text-center setting-box">
              <span class="text-[10px] text-blue-300 mb-2 tracking-[0.2em]">📜 QUESTS</span>
              <div class="flex items-center justify-center gap-3">
                <button @click="store.settings.questCount = Math.max(1, store.settings.questCount - 1)" 
                        class="retro-btn w-8 h-8 flex items-center justify-center p-0 text-sm setting-btn">−</button>
                <span class="text-lg w-8 text-center text-yellow-400 font-bold">{{ store.settings.questCount }}</span>
                <button @click="store.settings.questCount++" 
                        class="retro-btn w-8 h-8 flex items-center justify-center p-0 text-sm setting-btn">+</button>
              </div>
            </div>
            
            <div class="flex flex-col bg-black border-4 border-white p-3 text-center setting-box">
              <span class="text-[10px] text-blue-300 mb-2 tracking-[0.2em]">⏱️ TIME(S)</span>
              <div class="flex items-center justify-center gap-3">
                <button @click="store.settings.timeLimit = Math.max(30, store.settings.timeLimit - 30)" 
                        class="retro-btn w-8 h-8 flex items-center justify-center p-0 text-sm setting-btn">−</button>
                <span class="text-lg w-12 text-center text-yellow-400 font-bold">{{ store.settings.timeLimit }}s</span>
                <button @click="store.settings.timeLimit += 30" 
                        class="retro-btn w-8 h-8 flex items-center justify-center p-0 text-sm setting-btn">+</button>
              </div>
            </div>
          </div>
        </div>

        <button 
          @click="store.startJourney" 
          :disabled="store.party.length === 0"
          class="retro-btn text-sm py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center start-btn"
          :class="store.party.length > 0 ? 'start-btn-active' : 'start-btn-disabled'"
        >
          <span v-if="store.party.length > 0" class="flex items-center gap-2">
            ⚔️ EMBARK
          </span>
          <span v-else>NEED PARTY</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store } from '../store.js';
import { quests } from '../quests.js';

const newMember = ref('');
const newQuest = ref('');

const defaultQuestCount = computed(() => quests.length);
const totalQuestCount = computed(() => quests.length + store.customQuests.length);

const handleAddMember = () => {
  if (newMember.value.trim()) {
    store.addMember(newMember.value.trim());
    newMember.value = '';
  }
};

const handleAddQuest = () => {
  if (newQuest.value.trim()) {
    store.addCustomQuest(newQuest.value.trim());
    newQuest.value = '';
  }
};

const classIcons = {
  Knight: '🛡️', Mage: '🔮', Rogue: '🗡️', Paladin: '✨', Cleric: '⛪',
  Ranger: '🏹', Barbarian: '🪓', Bard: '🎵', Monk: '👊', Warlock: '👿',
  Druid: '🌿', Sorcerer: '💫', Necromancer: '💀', Assassin: '🗡️', Warrior: '⚔️'
};

const classIcon = (cls) => classIcons[cls] || '⚔️';

const classColors = {
  Knight: '#c0c0c0', Mage: '#8844ff', Rogue: '#44ff44', Paladin: '#ffdd44', Cleric: '#ffffff',
  Ranger: '#44aa44', Barbarian: '#ff4444', Bard: '#ff88ff', Monk: '#ffaa44', Warlock: '#aa00ff',
  Druid: '#00cc66', Sorcerer: '#ff6688', Necromancer: '#66ffcc', Assassin: '#888888', Warrior: '#ff8844'
};

const classColor = (cls) => classColors[cls] || '#ffd700';
</script>

<style scoped>
.title-text {
  animation: titleGlow 3s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

@keyframes titleGlow {
  0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { text-shadow: 0 0 25px rgba(255, 215, 0, 0.7), 0 0 50px rgba(255, 215, 0, 0.3); }
}

.title-glow {
  width: 200px;
  height: 60px;
  background: radial-gradient(ellipse, rgba(255, 215, 0, 0.1), transparent 70%);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.input-glow:focus {
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.add-btn {
  background: #0f3460;
  transition: all 0.15s ease;
}
.add-btn:hover {
  background: #1a4a7a;
  box-shadow: 0 0 8px rgba(74, 144, 217, 0.4);
}

.member-card {
  animation: cardSlideIn 0.3s ease-out both;
}

@keyframes cardSlideIn {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

.member-list-enter-active {
  animation: cardSlideIn 0.3s ease-out;
}

.member-list-leave-active {
  animation: cardSlideOut 0.2s ease-in;
}

@keyframes cardSlideOut {
  0% { opacity: 1; transform: translateX(0) scale(1); }
  100% { opacity: 0; transform: translateX(20px) scale(0.9); }
}

.member-list-move {
  transition: transform 0.3s ease;
}

.remove-btn {
  transition: all 0.15s ease;
}
.remove-btn:hover {
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

.empty-state {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.setting-box {
  transition: border-color 0.2s ease;
}
.setting-box:hover {
  border-color: rgba(255, 215, 0, 0.5);
}

.setting-btn {
  transition: all 0.1s ease;
}
.setting-btn:active {
  transform: scale(0.9);
}

.start-btn {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.start-btn-active {
  background: linear-gradient(180deg, #b8860b, #8b6914) !important;
  border: 4px solid #ffd700;
  color: #fff;
}

.start-btn-active:hover {
  background: linear-gradient(180deg, #daa520, #b8860b) !important;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  transform: translateY(-1px);
}

.start-btn-active::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.start-btn-disabled {
  background: #374151 !important;
  border: 4px solid #6b7280;
}
</style>