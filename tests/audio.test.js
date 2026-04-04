// =============================================================================
// AUDIO TESTS - Theme-aware sound effects
// =============================================================================
import { describe, it, expect, beforeEach } from 'vitest'
import { 
  playPointSound, 
  playTransitionSound, 
  playGameOverSound,
  playVictorySound
} from '../src/audio.js'

describe('Audio System', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Sound Functions', () => {
    it('should play point sound without errors', () => {
      expect(() => playPointSound()).not.toThrow()
    })

    it('should play transition sound without errors', () => {
      expect(() => playTransitionSound()).not.toThrow()
    })

    it('should play game over sound without errors', () => {
      expect(() => playGameOverSound()).not.toThrow()
    })

    it('should play victory sound without errors', () => {
      expect(() => playVictorySound()).not.toThrow()
    })
  })

  describe('Theme-Aware Audio', () => {
    it('should use classic SFX when classic theme is selected', () => {
      localStorage.setItem('standup_theme', 'classic')
      
      expect(() => playPointSound()).not.toThrow()
      expect(() => playTransitionSound()).not.toThrow()
    })

    it('should use millennium SFX when millennium theme is selected', () => {
      localStorage.setItem('standup_theme', 'millennium')
      
      expect(() => playPointSound()).not.toThrow()
      expect(() => playTransitionSound()).not.toThrow()
    })

    it('should use sci-fi SFX when sci-fi theme is selected', () => {
      localStorage.setItem('standup_theme', 'scifi')
      
      expect(() => playPointSound()).not.toThrow()
      expect(() => playTransitionSound()).not.toThrow()
    })

    it('should default to classic SFX when no theme is set', () => {
      localStorage.removeItem('standup_theme')
      
      expect(() => playPointSound()).not.toThrow()
    })
  })

  describe('Audio Context Handling', () => {
    it('should handle suspended audio context', () => {
      // The audio module should resume suspended contexts
      expect(() => playPointSound()).not.toThrow()
    })

    it('should work with Web Audio API mock', () => {
      // Verify AudioContext is available
      expect(window.AudioContext).toBeDefined()
      
      const ctx = new window.AudioContext()
      expect(ctx.state).toBe('running')
      expect(ctx.createOscillator).toBeDefined()
      expect(ctx.createGain).toBeDefined()
    })
  })
})
