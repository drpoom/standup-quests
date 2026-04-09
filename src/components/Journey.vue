<template>
  <div class="relative h-screen max-h-screen overflow-hidden text-white flex flex-col items-center justify-start py-4 px-4 gap-4">
    
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
          @click="store.awardPoint(member.name)"
          class="relative flex flex-col items-center p-2 border-4 cursor-pointer transition-transform"
          :class="store.currentQuestScoredMembers.has(member.name) 
            ? 'bg-blue-900 border-yellow-400 translate-y-1' 
            : 'bg-black border-white hover:border-blue-400'"
        >
          <!-- Score indicator -->
          <div class="absolute top-1 right-1 text-[8px] text-yellow-400 bg-black px-1 border border-white">
            {{ member.score }}
          </div>
          
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
import { ref, computed } from 'vue';
import { store } from '../store.js';

const newMember = ref('');

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
