<template>
  <div class="music-player fixed bottom-4 right-4 z-50">
    <!-- Collapsed state - music button with visualizer -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="music-toggle-btn"
      :class="isPlaying ? 'music-playing' : 'music-stopped'"
      :style="{ borderColor: isPlaying ? '#4ade80' : 'rgba(255,255,255,0.3)' }"
      title="Music Player"
    >
      <span class="text-lg">{{ isPlaying ? '🎵' : '🔇' }}</span>
      <!-- Mini equalizer bars when playing -->
      <div v-if="isPlaying" class="mini-eq">
        <div class="eq-bar" style="--delay: 0s; --h: 60%"></div>
        <div class="eq-bar" style="--delay: 0.1s; --h: 80%"></div>
        <div class="eq-bar" style="--delay: 0.2s; --h: 45%"></div>
        <div class="eq-bar" style="--delay: 0.15s; --h: 70%"></div>
      </div>
    </button>

    <!-- Expanded player -->
    <div v-else class="music-panel" :style="{ borderColor: isPlaying ? '#4ade8040' : 'rgba(255,255,255,0.2)' }">
      <!-- Header -->
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-[10px] tracking-[0.2em]" :style="{ color: isPlaying ? '#4ade80' : '#ffd700' }">
          🎵 MUSIC
        </h3>
        <button @click="isExpanded = false" class="text-gray-400 hover:text-white text-xs transition-all hover:scale-110">✕</button>
      </div>

      <!-- Now playing -->
      <div v-if="isPlaying" class="text-center mb-3 now-playing">
        <div class="text-[8px] text-green-400 animate-pulse tracking-[0.1em]">♫ NOW PLAYING ♫</div>
        <div class="text-[9px] text-white mt-1">{{ tracks[selectedTrackIndex].name }}</div>
        <div class="text-[7px] text-gray-500 mt-1">by {{ tracks[selectedTrackIndex].artist }}</div>
      </div>

      <!-- Equalizer visualization -->
      <div v-if="isPlaying" class="flex items-end justify-center gap-1 h-6 mb-3">
        <div v-for="i in 16" :key="i" class="eq-bar-full"
             :style="{ animationDelay: (i * 0.08) + 's' }"></div>
      </div>

      <!-- Play/Pause + Skip -->
      <div class="flex justify-center gap-3 mb-3">
        <button @click="prevTrack" class="retro-btn px-2 py-1 text-[10px]">⏮</button>
        <button @click="togglePlay" class="retro-btn px-6 py-2 text-sm play-btn"
                :class="isPlaying ? 'play-active' : 'play-inactive'">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button @click="nextTrack" class="retro-btn px-2 py-1 text-[10px]">⏭</button>
      </div>

      <!-- Track selector -->
      <div class="mb-3">
        <div class="flex flex-col gap-1">
          <button v-for="(track, index) in tracks" :key="track.id"
                  @click="selectedTrackIndex = index; changeTrack()"
                  class="text-left px-2 py-1 text-[8px] border transition-all track-item"
                  :class="selectedTrackIndex === index ? 'border-green-500 bg-green-900/20' : 'border-transparent hover:border-white/30'"
                  :style="{ color: selectedTrackIndex === index ? '#4ade80' : '#888' }">
            {{ selectedTrackIndex === index ? '♫' : '○' }} {{ track.name }}
          </button>
        </div>
      </div>

      <!-- Volume control -->
      <div class="mb-2">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[8px] text-gray-400 uppercase">Vol</span>
          <span class="text-[8px] text-gray-400">{{ Math.round(volume * 100) }}%</span>
        </div>
        <input
          type="range"
          v-model="volume"
          @input="changeVolume"
          min="0"
          max="1"
          step="0.01"
          class="w-full volume-slider"
        />
      </div>

      <!-- Loop toggle -->
      <div class="flex items-center justify-between">
        <span class="text-[8px] text-gray-400 uppercase">Loop</span>
        <button @click="toggleLoop" class="retro-btn px-3 py-1 text-[8px]"
                :class="isLooping ? 'bg-green-700' : 'bg-gray-700'">
          {{ isLooping ? 'ON' : 'OFF' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const tracks = [
  { id: 1, name: 'Peaceful Village', file: 'music/peaceful-village.mp3', artist: 'Stefan Grossmann' },
  { id: 2, name: 'Heroic Demise', file: 'music/heroic-demise.mp3', artist: 'OpenGameArt' },
  { id: 3, name: 'Mystic Force', file: 'music/mystic-force.mp3', artist: 'Kevin MacLeod' }
];

const isExpanded = ref(false);
const isPlaying = ref(false);
const isLooping = ref(true);
const volume = ref(0.5);
const selectedTrackIndex = ref(0);
const audio = ref(null);

onMounted(() => {
  const savedVolume = localStorage.getItem('standup_music_volume');
  const savedTrack = localStorage.getItem('standup_music_track');
  const savedLoop = localStorage.getItem('standup_music_loop');
  
  if (savedVolume) volume.value = parseFloat(savedVolume);
  if (savedTrack) selectedTrackIndex.value = parseInt(savedTrack);
  if (savedLoop) isLooping.value = savedLoop === 'true';
  
  audio.value = new Audio();
  audio.value.loop = isLooping.value;
  audio.value.volume = volume.value;
  loadTrack(selectedTrackIndex.value);
  
  audio.value.addEventListener('ended', () => {
    if (!isLooping.value) isPlaying.value = false;
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
      alert('Click anywhere on the page first to enable audio!');
    });
    isPlaying.value = true;
  }
};

const changeTrack = () => {
  const wasPlaying = isPlaying.value;
  loadTrack(selectedTrackIndex.value);
  if (wasPlaying) audio.value.play();
};

const prevTrack = () => {
  selectedTrackIndex.value = (selectedTrackIndex.value - 1 + tracks.length) % tracks.length;
  changeTrack();
};

const nextTrack = () => {
  selectedTrackIndex.value = (selectedTrackIndex.value + 1) % tracks.length;
  changeTrack();
};

const changeVolume = () => {
  if (audio.value) {
    audio.value.volume = volume.value;
    localStorage.setItem('standup_music_volume', volume.value.toString());
  }
};

const toggleLoop = () => {
  isLooping.value = !isLooping.value;
  if (audio.value) audio.value.loop = isLooping.value;
  localStorage.setItem('standup_music_loop', isLooping.value.toString());
};
</script>

<style scoped>
.music-player {
  font-family: 'Press Start 2P', monospace;
}

/* Toggle button */
.music-toggle-btn {
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border: 3px solid;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 6px;
}

.music-toggle-btn:hover {
  transform: scale(1.1);
}

.music-playing {
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.3);
}

/* Mini equalizer bars */
.mini-eq {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
}

.eq-bar {
  width: 3px;
  height: var(--h);
  background: #4ade80;
  animation: eqBounce 0.4s ease-in-out infinite alternate;
  animation-delay: var(--delay);
}

@keyframes eqBounce {
  0% { height: 30%; }
  100% { height: var(--h); }
}

/* Expanded panel */
.music-panel {
  background: rgba(0, 0, 0, 0.92);
  border: 3px solid;
  padding: 16px;
  min-width: 280px;
  backdrop-filter: blur(8px);
  animation: panelExpand 0.3s ease-out;
}

@keyframes panelExpand {
  0% { opacity: 0; transform: scale(0.9) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* Now playing */
.now-playing {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Full equalizer bars */
.eq-bar-full {
  width: 4px;
  height: 20px;
  background: linear-gradient(to top, #4ade80, #22d3ee);
  animation: eqFullBounce 0.5s ease-in-out infinite alternate;
  transform-origin: bottom;
}

@keyframes eqFullBounce {
  0% { transform: scaleY(0.3); }
  100% { transform: scaleY(1); }
}

/* Play button */
.play-btn {
  transition: all 0.15s ease;
}

.play-active {
  background: #166534;
  border-color: #4ade80;
}

.play-active:hover {
  background: #15803d;
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
}

.play-inactive {
  background: #1e3a5f;
  border-color: #4a90d9;
}

.play-inactive:hover {
  background: #2d5a87;
}

/* Track item */
.track-item {
  border-radius: 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

/* Volume slider */
.volume-slider {
  -webkit-appearance: none;
  appearance: none;
  background: #333;
  height: 6px;
  border: 2px solid #555;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #ffd700;
  border: 2px solid #fff;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #ffd700;
  border: 2px solid #fff;
  cursor: pointer;
}
</style>