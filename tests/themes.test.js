// =============================================================================
// THEME SYSTEM TESTS - Theme switching and persistence
// =============================================================================
import { describe, it, expect, beforeEach } from 'vitest'
import { themes, getCurrentTheme, saveTheme, applyTheme, initTheme } from '../src/themes.js'

describe('Theme System', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.className = ''
    document.body.removeAttribute('data-theme')
  })

  describe('Theme Definitions', () => {
    it('should have 3 themes defined', () => {
      expect(Object.keys(themes).length).toBe(3)
      expect(themes.classic).toBeDefined()
      expect(themes.millennium).toBeDefined()
      expect(themes.scifi).toBeDefined()
    })

    it('should have correct theme structure', () => {
      const theme = themes.classic
      
      expect(theme.id).toBe('classic')
      expect(theme.name).toBeDefined()
      expect(theme.colors).toBeDefined()
      expect(theme.fonts).toBeDefined()
      expect(theme.background).toBeDefined()
      expect(theme.sfx).toBeDefined()
      expect(theme.icon).toBeDefined()
    })

    it('should have all required color properties', () => {
      const colors = themes.classic.colors
      const requiredColors = [
        'primary', 'secondary', 'accent', 'gold',
        'text', 'textMuted', 'border', 'button',
        'buttonHover', 'success', 'danger', 'panel'
      ]
      
      requiredColors.forEach(color => {
        expect(colors).toHaveProperty(color)
      })
    })

    it('should have unique theme IDs', () => {
      const ids = Object.values(themes).map(t => t.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('Theme Persistence', () => {
    it('should get default theme (classic) when nothing saved', () => {
      const theme = getCurrentTheme()
      
      expect(theme.id).toBe('classic')
    })

    it('should save theme preference', () => {
      saveTheme('millennium')
      
      const saved = localStorage.getItem('standup_theme')
      expect(saved).toBe('millennium')
    })

    it('should get saved theme', () => {
      localStorage.setItem('standup_theme', 'scifi')
      
      const theme = getCurrentTheme()
      
      expect(theme.id).toBe('scifi')
    })

    it('should return classic for invalid saved theme', () => {
      localStorage.setItem('standup_theme', 'invalid-theme')
      
      const theme = getCurrentTheme()
      
      expect(theme.id).toBe('classic')
    })
  })

  describe('Theme Application', () => {
    it('should apply theme CSS variables', () => {
      const theme = themes.millennium
      applyTheme(theme)
      
      const root = document.documentElement
      const styles = getComputedStyle(root)
      
      expect(styles.getPropertyValue('--theme-accent')).toContain('00ff88') // Mako green
    })

    it('should set theme class on body', () => {
      applyTheme(themes.scifi)
      
      expect(document.body.className).toBe('theme-scifi')
      expect(document.body.dataset.theme).toBe('scifi')
    })

    it('should apply different fonts per theme', () => {
      applyTheme(themes.classic)
      let root = document.documentElement
      expect(getComputedStyle(root).getPropertyValue('--theme-font-main'))
        .toContain('Press Start 2P')

      applyTheme(themes.scifi)
      root = document.documentElement
      expect(getComputedStyle(root).getPropertyValue('--theme-font-main'))
        .toContain('Courier New')
    })
  })

  describe('Theme Initialization', () => {
    it('should initialize with saved theme', () => {
      localStorage.setItem('standup_theme', 'millennium')
      
      const theme = initTheme()
      
      expect(theme.id).toBe('millennium')
      expect(document.body.className).toBe('theme-millennium')
    })

    it('should initialize with default theme if nothing saved', () => {
      const theme = initTheme()
      
      expect(theme.id).toBe('classic')
      expect(document.body.className).toBe('theme-classic')
    })
  })

  describe('Theme-Specific Features', () => {
    it('should have SFX references for each theme', () => {
      Object.values(themes).forEach(theme => {
        expect(theme.sfx).toHaveProperty('point')
        expect(theme.sfx).toHaveProperty('transition')
        expect(theme.sfx).toHaveProperty('complete')
      })
    })

    it('should have background configuration', () => {
      Object.values(themes).forEach(theme => {
        expect(theme.background).toHaveProperty('type')
      })
      
      expect(themes.classic.background.type).toBe('static')
      expect(themes.millennium.background.type).toBe('animated')
      expect(themes.scifi.background.type).toBe('animated')
    })

    it('should have unique icons for each theme', () => {
      const icons = Object.values(themes).map(t => t.icon)
      expect(icons).toEqual(['🏰', '⚡', '🚀'])
    })
  })
})
