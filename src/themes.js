// Theme definitions for Standup Quest
// Each theme includes colors, fonts, backgrounds, and SFX references

export const themes = {
  // Theme 1: Classic Fantasy (Dragon Quest I-III era)
  classic: {
    id: 'classic',
    name: 'Classic Fantasy',
    subtitle: 'Dragon Quest Era (8-bit/16-bit)',
    description: 'Medieval tavern vibes with pixel art charm',
    colors: {
      primary: '#1a1a2e',      // Dark blue-black background
      secondary: '#16213e',    // Slightly lighter blue
      accent: '#e94560',       // Ruby red accent
      gold: '#ffd700',         // Gold for highlights
      text: '#ffffff',         // White text
      textMuted: '#a0a0a0',    // Muted gray text
      border: '#ffffff',       // White borders
      button: '#0f3460',       // Dark blue buttons
      buttonHover: '#1a4a7a',  // Lighter blue hover
      success: '#4ade80',      // Green for success
      danger: '#ef4444',       // Red for danger
      panel: 'rgba(26, 26, 46, 0.95)',
    },
    fonts: {
      main: "'Press Start 2P', monospace",
      heading: "'Press Start 2P', monospace",
    },
    background: {
      type: 'static',
      image: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      pattern: 'tavern',
    },
    sfx: {
      point: 'classic-point',
      transition: 'classic-transition',
      complete: 'classic-complete',
    },
    icon: '🏰',
  },

  // Theme 2: 90s Millennium (FF7/FF8 era)
  millennium: {
    id: 'millennium',
    name: '90s Millennium',
    subtitle: 'Final Fantasy VII/VIII Era',
    description: 'Industrial fantasy with sleek UI and mako vibes',
    colors: {
      primary: '#0a0e1a',      // Deep space blue
      secondary: '#1a1f3a',    // Muted blue
      accent: '#00ff88',       // Mako green (FF7!)
      gold: '#c0a062',         // Antique gold
      text: '#e0e0ff',         // Soft white-blue
      textMuted: '#8899aa',    // Muted blue-gray
      border: '#4a90d9',       // Blue border
      button: '#1e3a5f',       // Dark blue-green
      buttonHover: '#2d5a87',  // Lighter blue
      success: '#00ff88',      // Mako green
      danger: '#ff4444',       // Alert red
      panel: 'rgba(10, 14, 26, 0.85)',
    },
    fonts: {
      main: "'Arial', sans-serif",
      heading: "'Trebuchet MS', sans-serif",
    },
    background: {
      type: 'animated',
      effect: 'particles',
      colors: ['#00ff88', '#4a90d9', '#ffffff'],
      speed: 'slow',
    },
    sfx: {
      point: 'millennium-point',
      transition: 'millennium-transition',
      complete: 'millennium-complete',
    },
    icon: '⚡',
  },

  // Theme 3: Sci-Fi RPG (Star Ocean/Phantasy Star)
  scifi: {
    id: 'scifi',
    name: 'Sci-Fi RPG',
    subtitle: 'Star Ocean / Phantasy Star Era',
    description: 'Futuristic holographic spaceship bridge',
    colors: {
      primary: '#000000',      // Pure black (space!)
      secondary: '#0a0a1a',    // Deep space
      accent: '#00ffff',       // Cyan (holographic)
      gold: '#ffffff',         // Pure white highlights
      text: '#00ffff',         // Cyan text
      textMuted: '#668899',    // Muted cyan-gray
      border: '#00ffff',       // Cyan borders
      button: '#001a33',       // Dark blue-black
      buttonHover: '#003366',  // Dark blue
      success: '#00ff00',      // Terminal green
      danger: '#ff3333',       // Alert red
      panel: 'rgba(0, 0, 0, 0.9)',
    },
    fonts: {
      main: "'Courier New', monospace",
      heading: "'Orbitron', 'Arial Black', sans-serif",
    },
    background: {
      type: 'animated',
      effect: 'grid',
      colors: ['#00ffff', '#0066ff'],
      speed: 'medium',
    },
    sfx: {
      point: 'scifi-point',
      transition: 'scifi-transition',
      complete: 'scifi-complete',
    },
    icon: '🚀',
  },
};

// Get current theme from localStorage or default to classic
export function getCurrentTheme() {
  const saved = localStorage.getItem('standup_theme');
  return saved && themes[saved] ? themes[saved] : themes.classic;
}

// Save theme preference
export function saveTheme(themeId) {
  localStorage.setItem('standup_theme', themeId);
}

// Apply theme to document
export function applyTheme(theme) {
  const root = document.documentElement;
  const colors = theme.colors;

  // Set CSS variables
  root.style.setProperty('--theme-primary', colors.primary);
  root.style.setProperty('--theme-secondary', colors.secondary);
  root.style.setProperty('--theme-accent', colors.accent);
  root.style.setProperty('--theme-gold', colors.gold);
  root.style.setProperty('--theme-text', colors.text);
  root.style.setProperty('--theme-text-muted', colors.textMuted);
  root.style.setProperty('--theme-border', colors.border);
  root.style.setProperty('--theme-button', colors.button);
  root.style.setProperty('--theme-button-hover', colors.buttonHover);
  root.style.setProperty('--theme-success', colors.success);
  root.style.setProperty('--theme-danger', colors.danger);
  root.style.setProperty('--theme-panel', colors.panel);

  // Set fonts
  root.style.setProperty('--theme-font-main', theme.fonts.main);
  root.style.setProperty('--theme-font-heading', theme.fonts.heading);

  // Set theme class on body
  document.body.className = `theme-${theme.id}`;
  document.body.dataset.theme = theme.id;
}

// Initialize theme on load
export function initTheme() {
  const theme = getCurrentTheme();
  applyTheme(theme);
  return theme;
}
