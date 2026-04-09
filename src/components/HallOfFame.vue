<template>
  <div class="min-h-screen text-white flex flex-col items-center justify-start pt-12 px-4 space-y-12">
    
    <div class="retro-panel w-full max-w-4xl text-center border-yellow-400">
      <h1 class="text-3xl md:text-5xl text-yellow-400">HALL OF FAME</h1>
    </div>

    <!-- Podium -->
    <div v-if="sortedParty.length > 0" class="w-full max-w-5xl flex flex-col md:flex-row items-end justify-center gap-8 retro-panel">
      
      <!-- 2nd Place -->
      <div v-if="sortedParty[1] && sortedParty[1].score > 0" class="flex flex-col items-center order-2 md:order-1 transform md:-translate-y-8">
        <div class="text-[10px] text-gray-300 mb-2">RANK 2</div>
        <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${sortedParty[1].avatarClass}&size=128`" 
             class="w-24 h-24 border-4 border-gray-400 pixelated bg-black" alt="avatar" />
        <div class="text-sm mt-4 text-white uppercase">{{ sortedParty[1].name }}</div>
        <div class="text-xs text-yellow-400">{{ sortedParty[1].score }} PTS</div>
      </div>

      <!-- 1st Place -->
      <div v-if="sortedParty[0] && sortedParty[0].score > 0" class="flex flex-col items-center order-1 md:order-2 z-10 mb-8 md:mb-0">
        <div class="text-xs text-yellow-400 mb-2 animate-pulse">RANK 1</div>
        <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${sortedParty[0].avatarClass}&size=128`" 
             class="w-32 h-32 border-4 border-yellow-400 pixelated bg-black" alt="avatar" />
        <div class="text-base mt-4 text-white uppercase">{{ sortedParty[0].name }}</div>
        <div class="text-sm text-yellow-400">{{ sortedParty[0].score }} PTS</div>
      </div>

      <!-- 3rd Place -->
      <div v-if="sortedParty[2] && sortedParty[2].score > 0" class="flex flex-col items-center order-3 md:order-3 transform md:-translate-y-12">
        <div class="text-[10px] text-yellow-700 mb-2">RANK 3</div>
        <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${sortedParty[2].avatarClass}&size=128`" 
             class="w-20 h-20 border-4 border-yellow-700 pixelated bg-black" alt="avatar" />
        <div class="text-sm mt-4 text-white uppercase">{{ sortedParty[2].name }}</div>
        <div class="text-xs text-yellow-400">{{ sortedParty[2].score }} PTS</div>
      </div>
      
    </div>

    <!-- The Rest / The Fallen -->
    <div class="w-full max-w-2xl retro-panel">
      <h3 class="text-lg text-yellow-300 mb-6 border-b-4 border-white pb-2 inline-block">
        HONORABLE MENTIONS
      </h3>
      
      <ul class="space-y-4">
        <li v-for="(member, index) in theRest" :key="member.name"
            class="flex items-center justify-between p-4 border-4 border-white"
            :class="member.score === 0 ? 'bg-red-900/50 border-red-500' : 'bg-black'">
            
          <div class="flex items-center gap-4" :class="{ 'grayscale opacity-50': member.score === 0 }">
            <span class="text-xs text-gray-400">{{ podiumCount + index + 1 }}.</span>
            <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${member.avatarClass}`" 
                 class="w-12 h-12 border-2 border-white pixelated bg-black" alt="avatar" />
            <div>
              <span class="block text-sm uppercase" :class="member.score === 0 ? 'text-red-400 line-through' : 'text-white'">
                {{ member.name }}
              </span>
              <span class="block text-[8px] text-gray-400 uppercase">LV 1 {{ member.avatarClass }}</span>
            </div>
          </div>
          
          <div v-if="member.score > 0" class="text-xs text-yellow-400">{{ member.score }} PTS</div>
          <div v-else class="text-xs text-red-500" title="The Fallen">
            🪦 RIP
          </div>
        </li>
      </ul>
      
      <div v-if="theRest.length === 0" class="text-center text-gray-500 text-xs py-4">
        NO OTHER SURVIVORS...
      </div>
    </div>

    <button 
      @click="store.quitJourney" 
      class="retro-btn text-lg py-4 px-8 mt-8 mb-16"
    >
      RETURN TO TAVERN
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../store.js';

const sortedParty = computed(() => {
  return [...store.party].sort((a, b) => b.score - a.score);
});

// We only show members with > 0 on podium.
const podiumMembers = computed(() => {
  return sortedParty.value.filter(m => m.score > 0).slice(0, 3);
});

const podiumCount = computed(() => podiumMembers.value.length);

const theRest = computed(() => {
  return sortedParty.value.filter(m => !podiumMembers.value.includes(m));
});
</script>
