<template>
  <div class="app-container min-h-screen font-retro relative selection:bg-blue-600 selection:text-white">
    <!-- Content container -->
    <div class="relative z-10 min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Setup v-if="store.state === 'SETUP'" />
      <Journey v-if="store.state === 'JOURNEY' || store.state === 'TRANSITION'" />
      <HallOfFame v-if="store.state === 'HALL_OF_FAME'" />
    </div>
    
    <!-- Music Player (always visible) -->
    <MusicPlayer />
  </div>
</template>

<script setup>
import { store } from './store.js';
import Setup from './components/Setup.vue';
import Journey from './components/Journey.vue';
import HallOfFame from './components/HallOfFame.vue';
import MusicPlayer from './components/MusicPlayer.vue';
</script>

<style>
.font-retro {
  font-family: 'Press Start 2P', monospace;
  line-height: 1.5;
  -webkit-font-smoothing: none;
}
</style>
