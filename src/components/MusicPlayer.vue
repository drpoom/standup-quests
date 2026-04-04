<template>
  <div class="music-player fixed bottom-4 right-4 z-50">
    <!-- Collapsed state - just a button -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="retro-panel p-2 hover:border-yellow-400 cursor-pointer"
      :class="isPlaying ? 'border-green-400 animate-pulse' : 'border-white'"
      title="Music Player"
    >
      <span class="text-lg">{{ isPlaying ? '🎵' : '🔇' }}</span>
    </button>

    <!-- Expanded player -->
    <div v-else class="retro-panel p-4 min-w-[280px] bg-black/90 border-4 border-white">
      <!-- Header -->
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-yellow-400 text-xs tracking-widest">🎵 MUSIC PLAYER</h3>
        <button
          @click="isExpanded = false"
          class="text-gray-400 hover:text-white text-xs"
          title="Collapse"
        >
          ✕
        </button>
      </div>

      <!-- Play/Pause button -->
      <div class="flex justify-center mb-3">
        <button
          @click="togglePlay"
          class="retro-btn px-6 py-2 text-sm"
          :class="isPlaying ? 'bg-green-700 hover:bg-green-600' : 'bg-blue-700 hover:bg-blue-600'"
        >
          {{ isPlaying ? '⏸ PAUSE' : '▶ PLAY' }}
        </button>
      </div>

      <!-- Track selector -->
      <div class="mb-3">
        <label class="text-gray-400 text-[8px] uppercase tracking-wider block mb-1">Track</label>
        <select
          v-model="selectedTrackIndex"
          @change="changeTrack"
          class="bg-black border-2 border-white text-white px-2 py-1 text-xs w-full focus:outline-none focus:border-yellow-400 font-retro uppercase"
        >
          <option v-for="(track, index) in tracks" :key="track.id" :value="index">
            {{ track.name }}
          </option>
        </select>
      </div>

      <!-- Volume control -->
      <div class="mb-3">
        <label class="text-gray-400 text-[8px] uppercase tracking-wider block mb-1">
          Volume: {{ Math.round(volume * 100) }}%
        </label>
        <input
          type="range"
          v-model="volume"
          @input="changeVolume"
          min="0"
          max="1"
          step="0.01"
          class="w-full h-2 bg-gray-700 cursor-pointer"
        />
      </div>

      <!-- Loop toggle -->
      <div class="flex items-center justify-between">
        <label class="text-gray-400 text-[8px] uppercase tracking-wider">Loop</label>
        <button
          @click="toggleLoop"
          class="retro-btn px-3 py-1 text-[8px]"
          :class="isLooping ? 'bg-green-700' : 'bg-gray-700'"
        >
          {{ isLooping ? 'ON' : 'OFF' }}
        </button>
      </div>

      <!-- Now playing indicator -->
      <div v-if="isPlaying" class="mt-3 text-center">
        <div class="text-green-400 text-[8px] animate-pulse">
          ♫ Now Playing: {{ tracks[selectedTrackIndex].name }} ♫
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const tracks = [
  { id: 1, name: 'Peaceful Village', file: 'music/peaceful-village.mp3', artist: 'Stefan Grossmann' },
  { id: 2, name: 'Heroic Demise (Chiptune)', file: 'music/heroic-demise.mp3', artist: 'OpenGameArt' },
  { id: 3, name: 'Mystic Force', file: 'music/mystic-force.mp3', artist: 'Kevin MacLeod' }
];

const isExpanded = ref(false);
const isPlaying = ref(false);
const isLooping = ref(true);
const volume = ref(0.5);
const selectedTrackIndex = ref(0);
const audio = ref(null);

// Load saved preferences from localStorage
onMounted(() => {
  const savedVolume = localStorage.getItem('standup_music_volume');
  const savedTrack = localStorage.getItem('standup_music_track');
  const savedLoop = localStorage.getItem('standup_music_loop');
  
  if (savedVolume) volume.value = parseFloat(savedVolume);
  if (savedTrack) selectedTrackIndex.value = parseInt(savedTrack);
  if (savedLoop) isLooping.value = savedLoop === 'true';
  
  // Initialize audio
  audio.value = new Audio();
  audio.value.loop = isLooping.value;
  audio.value.volume = volume.value;
  loadTrack(selectedTrackIndex.value);
  
  // Listen for audio events
  audio.value.addEventListener('ended', () => {
    if (!isLooping.value) {
      isPlaying.value = false;
    }
  });
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});

const loadTrack = (index) => {
  if (!audio.value) return;
  
  const track = tracks[index];
  audio.value.src = track.file;
  audio.value.load();
  
  // Save preference
  localStorage.setItem('standup_music_track', index.toString());
};

const togglePlay = () => {
  if (!audio.value) return;
  
  if (isPlaying.value) {
    audio.value.pause();
    isPlaying.value = false;
  } else {
    audio.value.play().catch(err => {
      console.warn('Audio playback failed:', err);
      alert('Click anywhere on the page first to enable audio, then try again!');
    });
    isPlaying.value = true;
  }
};

const changeTrack = () => {
  const wasPlaying = isPlaying.value;
  loadTrack(selectedTrackIndex.value);
  
  if (wasPlaying) {
    audio.value.play();
  }
};

const changeVolume = () => {
  if (audio.value) {
    audio.value.volume = volume.value;
    localStorage.setItem('standup_music_volume', volume.value.toString());
  }
};

const toggleLoop = () => {
  isLooping.value = !isLooping.value;
  if (audio.value) {
    audio.value.loop = isLooping.value;
  }
  localStorage.setItem('standup_music_loop', isLooping.value.toString());
};
</script>

<style scoped>
.music-player {
  font-family: 'Press Start 2P', monospace;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: #333;
  border-radius: 2px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #ffd700;
  border: 2px solid #fff;
  cursor: pointer;
  border-radius: 2px;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #ffd700;
  border: 2px solid #fff;
  cursor: pointer;
  border-radius: 2px;
}
</style>
