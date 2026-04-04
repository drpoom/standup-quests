// =============================================================================
// QUESTS TESTS - Question content and validation
// =============================================================================
import { describe, it, expect } from 'vitest'
import { quests, bonusQuests } from '../src/quests.js'

describe('Quest Questions', () => {
  describe('Main Quests', () => {
    it('should have 30 main quests', () => {
      expect(quests.length).toBe(30)
    })

    it('should all be non-empty strings', () => {
      quests.forEach(quest => {
        expect(typeof quest).toBe('string')
        expect(quest.trim().length).toBeGreaterThan(0)
      })
    })

    it('should contain fantasy/RPG terminology', () => {
      const rpgTerms = ['beast', 'artifact', 'scroll', 'party', 'cursed', 
                       'heroic', 'goblins', 'mystical', 'spells', 'treasure',
                       'prophecy', 'potions', 'wizards', 'labyrinth', 'wards',
                       'incantation', 'alliances', 'armor', 'strongholds', 'familiar']
      
      const allQuestions = quests.join(' ').toLowerCase()
      
      // At least 10 RPG terms should be present
      const foundTerms = rpgTerms.filter(term => allQuestions.includes(term))
      expect(foundTerms.length).toBeGreaterThanOrEqual(10)
    })

    it('should contain agile/development references', () => {
      const devTerms = ['blocker', 'feature', 'documentation', 'resources',
                       'legacy code', 'completed task', 'bugs', 'API', 'integration',
                       'tests', 'new feature', 'optimizations', 'teammate',
                       'sprint goal', 'tickets', 'senior devs', 'code review',
                       'infrastructure', 'server outages', 'architecture', 
                       'cross-team', 'AI assistant']
      
      const allQuestions = quests.join(' ').toLowerCase()
      
      // At least 15 dev terms should be present
      const foundTerms = devTerms.filter(term => allQuestions.includes(term))
      expect(foundTerms.length).toBeGreaterThanOrEqual(15)
    })

    it('should have humorous tone', () => {
      const humorIndicators = [
        'eating your soul',
        'caffeinated',
        'pretend to read',
        'made you cry',
        'shamelessly proud',
        'yeeting into the sun',
        'without reading the manual',
        'summon demons',
        'questioning your life choices',
        'technical debt',
        'running on spite',
        'too proud to ask',
        'muttering curses',
        'hoping nobody notices',
        'copy-pasting from Stack Overflow',
        'passive-aggressive',
        'without a backup plan',
        'question your entire career path',
        'definitely work in production',
        'personally visit you',
        'definitely NOT out of date',
        'existential dread',
        'secretly panicking',
        'confidently wrong'
      ]
      
      const allQuestions = quests.join(' ').toLowerCase()
      
      // At least 5 humorous phrases should be present
      const foundHumor = humorIndicators.filter(phrase => allQuestions.includes(phrase))
      expect(foundHumor.length).toBeGreaterThanOrEqual(5)
    })

    it('should not have duplicate questions', () => {
      const uniqueQuests = new Set(quests)
      expect(uniqueQuests.size).toBe(quests.length)
    })

    it('should end with question marks', () => {
      quests.forEach(quest => {
        expect(quest.trim().endsWith('?')).toBe(true)
      })
    })
  })

  describe('Bonus Quests', () => {
    it('should have bonus quests defined', () => {
      expect(Array.isArray(bonusQuests)).toBe(true)
      expect(bonusQuests.length).toBeGreaterThan(0)
    })

    it('should all be non-empty strings', () => {
      bonusQuests.forEach(quest => {
        expect(typeof quest).toBe('string')
        expect(quest.trim().length).toBeGreaterThan(0)
      })
    })

    it('should have humorous bonus content', () => {
      const bonusText = bonusQuests.join(' ').toLowerCase()
      
      expect(bonusText).toContain('production fire')
      expect(bonusText).toContain('curse word')
      expect(bonusText).toContain('deploy on friday')
    })
  })

  describe('Quest Content Quality', () => {
    it('should have appropriate length (not too short, not too long)', () => {
      quests.forEach(quest => {
        const length = quest.trim().length
        expect(length).toBeGreaterThan(20) // Not too short
        expect(length).toBeLessThan(200) // Not too long
      })
    })

    it('should have varied sentence structures', () => {
      const startsWithWhat = quests.filter(q => q.trim().toLowerCase().startsWith('what')).length
      const startsWithIs = quests.filter(q => q.trim().toLowerCase().startsWith('is ')).length
      const startsWithHave = quests.filter(q => q.trim().toLowerCase().startsWith('have')).length
      const startsWithDid = quests.filter(q => q.trim().toLowerCase().startsWith('did')).length
      const startsWithAre = quests.filter(q => q.trim().toLowerCase().startsWith('are ')).length
      
      // Should have variety, not all starting with same word
      const maxSameStart = Math.max(startsWithWhat, startsWithIs, startsWithHave, startsWithDid, startsWithAre)
      expect(maxSameStart).toBeLessThan(quests.length * 0.6) // No more than 60% start same way
    })
  })
})
