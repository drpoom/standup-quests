// Theme-aware sound effects using Web Audio API
// Each theme has its own unique SFX style

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Get current theme
function getCurrentTheme() {
  return localStorage.getItem('standup_theme') || 'classic';
}

// =============================================================================
// CLASSIC FANTASY SFX (8-bit RPG style)
// =============================================================================
const playClassicPoint = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
  osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.05); // E5
  osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.1); // G5
  
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
};

const playClassicTransition = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4
  osc.frequency.exponentialRampToValueAtTime(523.25, audioCtx.currentTime + 0.3); // C5
  
  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
};

const playClassicComplete = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  // Play a little victory arpeggio
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.08 + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + i * 0.08);
    osc.stop(audioCtx.currentTime + i * 0.08 + 0.15);
  });
};

// =============================================================================
// 90s MILLENNIUM SFX (FF7/FF8 style - more polished, synth-based)
// =============================================================================
const playMillenniumPoint = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.08);
  
  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
};

const playMillenniumTransition = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.4);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
};

const playMillenniumComplete = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  // FF7-style victory fanfare
  [440, 554.37, 659.25, 880].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + i * 0.1);
    osc.stop(audioCtx.currentTime + i * 0.1 + 0.2);
  });
};

// =============================================================================
// SCI-FI RPG SFX (Star Ocean/Phantasy Star - digital, futuristic)
// =============================================================================
const playScifiPoint = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.06);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
};

const playScifiTransition = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
};

const playScifiComplete = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  // Sci-fi victory sequence
  [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.07 + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + i * 0.07);
    osc.stop(audioCtx.currentTime + i * 0.07 + 0.1);
  });
};

// =============================================================================
// MAIN EXPORTED FUNCTIONS (theme-aware)
// =============================================================================

export const playPointSound = () => {
  const theme = getCurrentTheme();
  switch(theme) {
    case 'millennium':
      playMillenniumPoint();
      break;
    case 'scifi':
      playScifiPoint();
      break;
    default:
      playClassicPoint();
  }
};

export const playTransitionSound = () => {
  const theme = getCurrentTheme();
  switch(theme) {
    case 'millennium':
      playMillenniumTransition();
      break;
    case 'scifi':
      playScifiTransition();
      break;
    default:
      playClassicTransition();
  }
};

export const playGameOverSound = () => {
  const theme = getCurrentTheme();
  switch(theme) {
    case 'millennium':
      playMillenniumComplete(); // Use victory sound for game over too
      break;
    case 'scifi':
      playScifiComplete();
      break;
    default:
      playClassicComplete();
  }
};

export const playVictorySound = () => {
  const theme = getCurrentTheme();
  switch(theme) {
    case 'millennium':
      playMillenniumComplete();
      break;
    case 'scifi':
      playScifiComplete();
      break;
    default:
      playClassicComplete();
  }
};
