import { reactive, watch } from 'vue';
import { quests } from './quests.js';
import { playPointSound, playTransitionSound, playGameOverSound } from './audio.js';

export const GameState = {
  SETUP: 'SETUP',
  JOURNEY: 'JOURNEY',
  TRANSITION: 'TRANSITION',
  HALL_OF_FAME: 'HALL_OF_FAME'
};

const savedParty = JSON.parse(localStorage.getItem('standup_party') || '[]');
const savedCustomQuests = JSON.parse(localStorage.getItem('standup_custom_quests') || '[]');

export const fantasyClasses = [
  "Knight", "Mage", "Rogue", "Paladin", "Cleric", 
  "Ranger", "Barbarian", "Bard", "Monk", "Warlock", 
  "Druid", "Sorcerer", "Necromancer", "Assassin", "Warrior"
];

export const store = reactive({
  state: GameState.SETUP,
  party: savedParty,
  customQuests: savedCustomQuests,
  selectedQuests: [],
  currentQuestIndex: 0,
  timeRemaining: 0,
  transitionTimeRemaining: 0,
  paused: false,
  settings: {
    questCount: 5,
    timeLimit: 180
  },
  currentQuestScoredMembers: new Set(),
  timerInterval: null,
  
  // Methods
  addMember(name) {
    if (!name || this.party.find(m => m.name.toLowerCase() === name.toLowerCase())) return;
    
    const usedClasses = this.party.map(m => m.avatarClass);
    const availableClasses = fantasyClasses.filter(c => !usedClasses.includes(c));
    const avatarClass = availableClasses.length > 0 
      ? availableClasses[Math.floor(Math.random() * availableClasses.length)]
      : fantasyClasses[Math.floor(Math.random() * fantasyClasses.length)];

    this.party.push({
      name,
      avatarClass,
      score: 0,
      isDead: false
    });
  },

  addCustomQuest(text) {
    if (!text || !text.trim()) return;
    if (this.customQuests.find(q => q.toLowerCase() === text.trim().toLowerCase())) return;
    this.customQuests.push(text.trim());
    localStorage.setItem('standup_custom_quests', JSON.stringify(this.customQuests));
  },

  removeCustomQuest(text) {
    this.customQuests = this.customQuests.filter(q => q !== text);
    localStorage.setItem('standup_custom_quests', JSON.stringify(this.customQuests));
  },

  removeMember(name) {
    this.party = this.party.filter(m => m.name !== name);
  },

  startJourney() {
    if (this.party.length === 0) return;
    
    // Combine default + custom quests
    const allQuests = [...quests, ...this.customQuests];
    const shuffled = [...allQuests].sort(() => 0.5 - Math.random());
    this.selectedQuests = shuffled.slice(0, Math.min(this.settings.questCount, allQuests.length)).map(q => ({
      text: q,
      timeLimit: this.settings.timeLimit
    }));
    
    this.currentQuestIndex = 0;
    
    // Reset scores
    this.party.forEach(member => {
      member.score = 0;
      member.isDead = false;
    });
    
    this.startQuest();
  },

  startQuest() {
    this.state = GameState.JOURNEY;
    this.currentQuestScoredMembers.clear();
    const quest = this.selectedQuests[this.currentQuestIndex];
    this.timeRemaining = quest.timeLimit;
    this.startTimer();
    playTransitionSound();
  },

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.paused) return;
      
      if (this.state === GameState.JOURNEY) {
        this.timeRemaining -= 1;
        if (this.timeRemaining <= 0) {
          this.endQuest();
        }
      } else if (this.state === GameState.TRANSITION) {
        this.transitionTimeRemaining -= 1;
        if (this.transitionTimeRemaining <= 0) {
          this.currentQuestIndex++;
          if (this.currentQuestIndex >= this.selectedQuests.length) {
            this.endJourney();
          } else {
            this.startQuest();
          }
        }
      }
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  endQuest() {
    this.state = GameState.TRANSITION;
    this.transitionTimeRemaining = 3;
    this.timeRemaining = 0;
  },

  skipQuest() {
    if (this.state === GameState.JOURNEY) {
      this.endQuest();
    }
  },

  togglePause() {
    this.paused = !this.paused;
  },

  quitJourney() {
    this.stopTimer();
    this.state = GameState.SETUP;
  },

  endJourney() {
    this.stopTimer();
    this.state = GameState.HALL_OF_FAME;
    this.party.forEach(member => {
      if (member.score === 0) {
        member.isDead = true;
      }
    });
    playGameOverSound();
  },

  awardPoint(name) {
    if (this.state !== GameState.JOURNEY || this.paused) return;
    if (this.currentQuestScoredMembers.has(name)) return;
    
    const member = this.party.find(m => m.name === name);
    if (member) {
      member.score += 1;
      this.currentQuestScoredMembers.add(name);
      playPointSound();
    }
  }
});

// Watch for party changes to save to localStorage
watch(() => store.party, (newParty) => {
  localStorage.setItem('standup_party', JSON.stringify(newParty));
}, { deep: true });
