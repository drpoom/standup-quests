<template>
  <div class="theme-selector fixed top-4 right-4 z-50">
    <!-- Collapsed state - theme button with icon and glow -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="theme-toggle-btn"
      :style="{ borderColor: accentColor, boxShadow: `0 0 12px ${accentColor}40` }"
      title="Change Theme"
    >
      <span class="text-lg">{{ currentTheme.icon }}</span>
      <div class="theme-toggle-ring" :style="{ borderColor: accentColor }"></div>
    </button>

    <!-- Expanded selector -->
    <div v-else class="theme-panel-expanded" :style="{ borderColor: accentColor }">
      <!-- Header -->
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-[10px] tracking-[0.2em]" :style="{ color: accentColor }">🎨 THEMES</h3>
        <button @click="isExpanded = false" class="text-gray-400 hover:text-white text-xs close-btn">✕</button>
      </div>

      <!-- Theme cards -->
      <div class="space-y-2 mb-4">
        <button
          v-for="theme in allThemes"
          :key="theme.id"
          @click="selectTheme(theme.id)"
          class="w-full text-left p-3 border-2 transition-all hover:scale-[1.02] theme-card"
          :class="currentTheme.id === theme.id ? 'theme-card-active' : 'theme-card-inactive'"
          :style="{ 
            borderColor: currentTheme.id === theme.id ? theme.colors.accent : 'rgba(255,255,255,0.2)',
            background: currentTheme.id === theme.id ? `${theme.colors.accent}15` : 'transparent'
          }"
        >
          <div class="flex items-center gap-3">
            <!-- Mini preview swatch -->
            <div class="w-8 h-8 rounded border-2 flex items-center justify-center text-lg"
                 :style="{ background: theme.colors.primary, borderColor: theme.colors.accent }">
              {{ theme.icon }}
            </div>
            <div class="flex-1">
              <div class="text-[10px] font-bold uppercase" :style="{ color: theme.colors.text }">{{ theme.name }}</div>
              <div class="text-[7px] uppercase tracking-wider" style="color: #888">{{ theme.subtitle }}</div>
            </div>
            <!-- Active indicator -->
            <div v-if="currentTheme.id === theme.id" class="text-xs" :style="{ color: theme.colors.accent }">✓</div>
          </div>
          
          <!-- Color palette preview -->
          <div class="flex gap-1 mt-2">
            <div v-for="colorKey in ['primary', 'accent', 'gold']" :key="colorKey"
                 class="w-3 h-3 border"
                 :style="{ background: theme.colors[colorKey], borderColor: 'rgba(255,255,255,0.3)' }"></div>
          </div>
        </button>
      </div>

      <!-- Current theme description -->
      <div class="text-[7px] uppercase tracking-wider p-2" 
           style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #888">
        {{ currentTheme.description }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { themes, getCurrentTheme, saveTheme, applyTheme } from '../themes.js';

const isExpanded = ref(false);
const currentTheme = ref(getCurrentTheme());
const allThemes = Object.values(themes);

const accentColor = computed(() => currentTheme.value.colors?.accent || '#ffd700');

const selectTheme = (themeId) => {
  const theme = themes[themeId];
  if (!theme) return;
  
  currentTheme.value = theme;
  saveTheme(themeId);
  applyTheme(theme);
  
  isExpanded.value = false;
};

onMounted(() => {
  applyTheme(currentTheme.value);
});
</script>

<style scoped>
.theme-selector {
  font-family: var(--theme-font-main, 'Press Start 2P', monospace);
}

/* Toggle button */
.theme-toggle-btn {
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border: 3px solid;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}

/* Rotating ring */
.theme-toggle-ring {
  position: absolute;
  inset: -4px;
  border: 1px solid;
  opacity: 0.3;
  animation: ringRotate 4s linear infinite;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

@keyframes ringRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Expanded panel */
.theme-panel-expanded {
  background: rgba(0, 0, 0, 0.92);
  border: 3px solid;
  padding: 16px;
  min-width: 300px;
  backdrop-filter: blur(8px);
  animation: panelExpand 0.3s ease-out;
}

@keyframes panelExpand {
  0% { opacity: 0; transform: scale(0.9) translateY(-10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.close-btn {
  transition: all 0.15s;
  padding: 4px;
}

.close-btn:hover {
  color: white;
  transform: scale(1.2);
}

/* Theme card */
.theme-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.theme-card-inactive:hover {
  border-color: rgba(255, 255, 255, 0.5) !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

.theme-card-active {
  position: relative;
  overflow: hidden;
}

.theme-card-active::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: activeShimmer 2s ease-in-out infinite;
}

@keyframes activeShimmer {
  0%, 100% { background: transparent; }
  50% { background: rgba(255, 255, 255, 0.03); }
}
</style>