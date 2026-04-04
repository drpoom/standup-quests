<template>
  <div class="theme-selector fixed top-4 right-4 z-50">
    <!-- Collapsed state - just a button -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="retro-panel p-2 hover:border-yellow-400 cursor-pointer transition-all"
      :class="`theme-${currentTheme.id}`"
      title="Change Theme"
    >
      <span class="text-lg">{{ currentTheme.icon }}</span>
    </button>

    <!-- Expanded selector -->
    <div v-else class="retro-panel p-4 min-w-[320px] theme-panel">
      <!-- Header -->
      <div class="flex justify-between items-center mb-3">
        <h3 class="theme-heading text-xs tracking-widest">🎨 THEME SELECTOR</h3>
        <button
          @click="isExpanded = false"
          class="text-gray-400 hover:text-white text-xs"
          title="Collapse"
        >
          ✕
        </button>
      </div>

      <!-- Theme cards -->
      <div class="space-y-2 mb-4">
        <button
          v-for="theme in allThemes"
          :key="theme.id"
          @click="selectTheme(theme.id)"
          class="w-full text-left p-3 border-2 transition-all hover:scale-[1.02]"
          :class="currentTheme.id === theme.id ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/30 hover:border-white'"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ theme.icon }}</span>
            <div>
              <div class="theme-text text-xs font-bold uppercase">{{ theme.name }}</div>
              <div class="theme-text-muted text-[6px] uppercase tracking-wider">{{ theme.subtitle }}</div>
            </div>
          </div>
        </button>
      </div>

      <!-- Current theme info -->
      <div class="theme-panel-info p-2 text-[8px] uppercase tracking-wider">
        <span class="theme-text-muted">Current: </span>
        <span class="theme-text">{{ currentTheme.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { themes, getCurrentTheme, saveTheme, applyTheme } from '../themes.js';

const isExpanded = ref(false);
const currentTheme = ref(getCurrentTheme());
const allThemes = Object.values(themes);

const selectTheme = (themeId) => {
  const theme = themes[themeId];
  if (!theme) return;
  
  currentTheme.value = theme;
  saveTheme(themeId);
  applyTheme(theme);
  
  // Play a little transition sound
  // (audio will be handled by main audio system)
  isExpanded.value = false;
};

onMounted(() => {
  // Ensure theme is applied on component mount
  applyTheme(currentTheme.value);
});
</script>

<style scoped>
.theme-selector {
  font-family: var(--theme-font-main, 'Press Start 2P', monospace);
}

.theme-panel {
  background: var(--theme-panel, rgba(26, 26, 46, 0.95));
  border: 4px solid var(--theme-border, #ffffff);
}

.theme-heading {
  color: var(--theme-accent, #e94560);
  font-family: var(--theme-font-heading, 'Press Start 2P', monospace);
}

.theme-text {
  color: var(--theme-text, #ffffff);
}

.theme-text-muted {
  color: var(--theme-text-muted, #a0a0a0);
}

.theme-panel-info {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--theme-border, #ffffff);
}

/* Theme-specific button styles */
.theme-classic {
  border-color: #ffffff;
  background: #1a1a2e;
}

.theme-millennium {
  border-color: #4a90d9;
  background: #0a0e1a;
}

.theme-scifi {
  border-color: #00ffff;
  background: #000000;
}
</style>
