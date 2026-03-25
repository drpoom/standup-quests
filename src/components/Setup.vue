<template>
  <div class="flex flex-col items-center justify-center text-white h-screen max-h-screen overflow-hidden py-4 space-y-4">
    
    <div class="retro-panel w-full max-w-4xl text-center py-2">
      <h1 class="text-2xl md:text-4xl text-yellow-400 animate-pulse">STANDUP QUEST</h1>
      <p class="text-[8px] md:text-[10px] text-blue-200 mt-1">A RETRO STANDUP ADVENTURE</p>
    </div>

    <div class="flex flex-col md:flex-row w-full max-w-4xl gap-4 flex-1 min-h-0">
      <!-- Left Column: Party Members -->
      <div class="retro-panel flex-1 flex flex-col min-h-0 relative">
        <h2 class="text-sm md:text-base text-yellow-300 mb-2 border-b-4 border-white pb-1 inline-block shrink-0">PARTY MEMBERS</h2>
        
        <form @submit.prevent="handleAddMember" class="flex flex-row gap-2 mb-4 shrink-0">
          <input 
            v-model="newMember" 
            type="text" 
            placeholder="ENTER NAME..." 
            class="flex-1 bg-black border-4 border-white text-white px-2 py-1 focus:outline-none focus:border-yellow-400 font-retro text-[10px] uppercase min-w-0"
          />
          <button type="submit" class="retro-btn text-[10px] px-2 py-1 shrink-0">ADD</button>
        </form>

        <ul class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-0">
          <li v-for="member in store.party" :key="member.name" 
              class="flex items-center justify-between bg-black/50 border-4 border-white p-2">
            <div class="flex items-center gap-3">
              <img :src="`https://minotar.net/helm/${member.avatarClass}/64.png`" 
                   class="w-10 h-10 border-2 border-white pixelated bg-black" alt="avatar" />
              <div class="flex flex-col justify-center">
                <span class="text-[10px] text-yellow-400 truncate max-w-[120px]" :title="member.name">{{ member.name }}</span>
                <span class="text-[8px] text-gray-400 uppercase mt-1">LV 1 {{ member.avatarClass }}</span>
              </div>
            </div>
            <button @click="store.removeMember(member.name)" class="retro-btn bg-red-700 hover:bg-red-500 border-white text-[10px] px-2 py-1 leading-none shrink-0">X</button>
          </li>
          <li v-if="store.party.length === 0" class="text-gray-500 text-center py-8 text-[10px] leading-loose">
            NO HEROES FOUND...<br/>ADD MEMBERS TO BEGIN.
          </li>
        </ul>
      </div>

      <!-- Right Column: Settings & Start -->
      <div class="flex flex-col w-full md:w-64 gap-4 shrink-0">
        <div class="retro-panel flex flex-col">
          <h2 class="text-sm md:text-base text-yellow-300 mb-4 border-b-4 border-white pb-1 inline-block">SETTINGS</h2>
          
          <div class="flex flex-col gap-4">
            <!-- Quests Setting -->
            <div class="flex flex-col bg-black border-4 border-white p-2 text-center">
              <span class="text-[10px] text-blue-300 mb-2">QUESTS</span>
              <div class="flex items-center justify-center gap-2">
                <button @click="store.settings.questCount = Math.max(1, store.settings.questCount - 1)" class="retro-btn w-8 h-8 flex items-center justify-center p-0 text-sm">-</button>
                <span class="text-sm w-8 text-center text-yellow-400">{{ store.settings.questCount }}</span>
                <button @click="store.settings.questCount++" class="retro-btn w-8 h-8 flex items-center justify-center p-0 text-sm">+</button>
              </div>
            </div>
            
            <!-- Timer Setting -->
            <div class="flex flex-col bg-black border-4 border-white p-2 text-center">
              <span class="text-[10px] text-blue-300 mb-2">TIME(S)</span>
              <div class="flex items-center justify-center gap-2">
                <button @click="store.settings.timeLimit = Math.max(30, store.settings.timeLimit - 30)" class="retro-btn w-8 h-8 flex items-center justify-center p-0 text-sm">-</button>
                <span class="text-sm w-12 text-center text-yellow-400">{{ store.settings.timeLimit }}</span>
                <button @click="store.settings.timeLimit += 30" class="retro-btn w-8 h-8 flex items-center justify-center p-0 text-sm">+</button>
              </div>
            </div>
          </div>
        </div>

        <button 
          @click="store.startJourney" 
          :disabled="store.party.length === 0"
          class="retro-btn text-sm py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-600 hover:bg-yellow-400 disabled:bg-gray-700 flex-1 flex items-center justify-center"
        >
          START GAME
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store.js';

const newMember = ref('');

const handleAddMember = () => {
  if (newMember.value.trim()) {
    store.addMember(newMember.value.trim());
    newMember.value = '';
  }
};
</script>
