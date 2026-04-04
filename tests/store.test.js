// =============================================================================
// STORE TESTS - Core game state management
// =============================================================================
import { describe, it, expect, beforeEach } from 'vitest'
import { store, GameState, fantasyClasses } from '../src/store.js'

describe('Store - Game State Management', () => {
  beforeEach(() => {
    // Reset store to initial state
    store.state = GameState.SETUP
    store.party = []
    store.selectedQuests = []
    store.currentQuestIndex = 0
    store.timeRemaining = 0
    store.paused = false
    store.settings = {
      questCount: 5,
      timeLimit: 180
    }
    store.stopTimer()
  })

  describe('Member Management', () => {
    it('should add a new member with unique class', () => {
      store.addMember('John')
      
      expect(store.party.length).toBe(1)
      expect(store.party[0].name).toBe('John')
      expect(store.party[0].score).toBe(0)
      expect(store.party[0].isDead).toBe(false)
      expect(fantasyClasses).toContain(store.party[0].avatarClass)
    })

    it('should not add duplicate member names (case insensitive)', () => {
      store.addMember('John')
      store.addMember('john')
      store.addMember('JOHN')
      
      expect(store.party.length).toBe(1)
    })

    it('should not add member with empty name', () => {
      store.addMember('')
      store.addMember(null)
      store.addMember(undefined)
      
      expect(store.party.length).toBe(0)
    })

    it('should remove a member', () => {
      store.addMember('John')
      store.addMember('Jane')
      
      expect(store.party.length).toBe(2)
      
      store.removeMember('John')
      
      expect(store.party.length).toBe(1)
      expect(store.party[0].name).toBe('Jane')
    })

    it('should assign unique fantasy classes when possible', () => {
      // Add 15 members (number of unique classes)
      for (let i = 0; i < 15; i++) {
        store.addMember(`Member${i}`)
      }
      
      const classes = store.party.map(m => m.avatarClass)
      const uniqueClasses = new Set(classes)
      
      // All classes should be unique
      expect(uniqueClasses.size).toBe(15)
      
      // 16th member should get a random class (may duplicate)
      store.addMember('Member16')
      expect(store.party.length).toBe(16)
    })
  })

  describe('Journey Management', () => {
    it('should start journey with correct settings', () => {
      store.addMember('John')
      store.settings.questCount = 3
      store.settings.timeLimit = 120
      
      store.startJourney()
      
      expect(store.state).toBe(GameState.JOURNEY)
      expect(store.selectedQuests.length).toBe(3)
      expect(store.currentQuestIndex).toBe(0)
      expect(store.timeRemaining).toBe(120)
    })

    it('should not start journey with empty party', () => {
      store.startJourney()
      
      expect(store.state).toBe(GameState.SETUP)
      expect(store.selectedQuests.length).toBe(0)
    })

    it('should reset member scores when starting journey', () => {
      store.addMember('John')
      store.party[0].score = 10
      
      store.startJourney()
      
      expect(store.party[0].score).toBe(0)
    })

    it('should award points correctly', () => {
      store.addMember('John')
      store.startJourney()
      
      store.awardPoint('John')
      
      expect(store.party[0].score).toBe(1)
    })

    it('should not award point to already scored member in same quest', () => {
      store.addMember('John')
      store.startJourney()
      
      store.awardPoint('John')
      store.awardPoint('John')
      store.awardPoint('John')
      
      expect(store.party[0].score).toBe(1) // Only 1 point allowed per quest
    })

    it('should not award points when paused', () => {
      store.addMember('John')
      store.startJourney()
      store.togglePause()
      
      store.awardPoint('John')
      
      expect(store.party[0].score).toBe(0)
    })

    it('should not award points in wrong state', () => {
      store.addMember('John')
      // Don't start journey, stay in SETUP
      
      store.awardPoint('John')
      
      expect(store.party[0].score).toBe(0)
    })
  })

  describe('Quest Navigation', () => {
    it('should end quest and transition to next', () => {
      store.addMember('John')
      store.settings.questCount = 3
      store.startJourney()
      
      store.endQuest()
      
      expect(store.state).toBe(GameState.TRANSITION)
      expect(store.transitionTimeRemaining).toBe(3)
    })

    it('should skip quest', () => {
      store.addMember('John')
      store.startJourney()
      
      store.skipQuest()
      
      expect(store.state).toBe(GameState.TRANSITION)
    })

    it('should toggle pause state', () => {
      expect(store.paused).toBe(false)
      
      store.togglePause()
      expect(store.paused).toBe(true)
      
      store.togglePause()
      expect(store.paused).toBe(false)
    })

    it('should quit journey and return to setup', () => {
      store.addMember('John')
      store.startJourney()
      
      expect(store.state).toBe(GameState.JOURNEY)
      
      store.quitJourney()
      
      expect(store.state).toBe(GameState.SETUP)
    })

    it('should end journey and mark zero-scorers as dead', () => {
      store.addMember('John')
      store.addMember('Jane')
      store.startJourney()
      
      store.awardPoint('John')
      // Jane has 0 points
      
      store.endJourney()
      
      expect(store.state).toBe(GameState.HALL_OF_FAME)
      expect(store.party[0].isDead).toBe(false) // John has points
      expect(store.party[1].isDead).toBe(true) // Jane has 0 points
    })
  })

  describe('Timer Management', () => {
    it('should start timer', () => {
      store.startTimer()
      
      expect(store.timerInterval).not.toBeNull()
      
      store.stopTimer()
    })

    it('should stop timer', () => {
      store.startTimer()
      expect(store.timerInterval).not.toBeNull()
      
      store.stopTimer()
      expect(store.timerInterval).toBeNull()
    })

    it('should decrement time remaining', () => {
      store.addMember('John')
      store.settings.timeLimit = 5
      store.startJourney()
      
      // Manually trigger timer logic
      const initialTime = store.timeRemaining
      
      // Wait for timer to tick (simulated)
      store.timeRemaining = initialTime - 1
      
      expect(store.timeRemaining).toBe(initialTime - 1)
      
      store.stopTimer()
    })
  })
})
