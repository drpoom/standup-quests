# Testing Guide - Standup Quest

## Test Suite Overview

Standup Quest uses **Vitest** for testing - a modern, fast test framework for Vite/Vue 3 projects.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers **68 test cases** across 5 test files:

### 1. **Store Tests** (`tests/store.test.js`) - 20 tests
Core game state management:
- ✅ Member management (add, remove, duplicate prevention)
- ✅ Journey lifecycle (start, end, quit)
- ✅ Point scoring system
- ✅ Timer management
- ✅ Quest navigation
- ✅ Pause/resume functionality

### 2. **Theme Tests** (`tests/themes.test.js`) - 16 tests
Theme system functionality:
- ✅ Theme definitions and structure
- ✅ Theme persistence (localStorage)
- ✅ Theme application (CSS variables, fonts)
- ✅ Theme initialization
- ✅ Theme-specific features (SFX, backgrounds)

### 3. **Quests Tests** (`tests/quests.test.js`) - 12 tests
Question content validation:
- ✅ Quest count and format
- ✅ RPG terminology usage
- ✅ Agile/development references
- ✅ Humorous tone verification
- ✅ Content quality (length, variety)

### 4. **Audio Tests** (`tests/audio.test.js`) - 10 tests
Sound effects system:
- ✅ Sound playback (no errors)
- ✅ Theme-aware SFX selection
- ✅ Audio context handling
- ✅ Web Audio API integration

### 5. **Integration Tests** (`tests/integration.test.js`) - 10 tests
Complete user journeys:
- ✅ Full standup session (setup → hall of fame)
- ✅ Theme persistence across session
- ✅ Quest randomization
- ✅ Music and theme integration
- ✅ Edge cases (skip all, quit mid-journey, etc.)
- ✅ Local storage integration

## Test Structure

```
standup-quests/
├── tests/
│   ├── store.test.js          # Core game logic
│   ├── themes.test.js         # Theme system
│   ├── quests.test.js         # Question content
│   ├── audio.test.js          # Sound effects
│   └── integration.test.js    # End-to-end scenarios
├── src/
│   ├── test/
│   │   └── setup.js           # Test configuration & mocks
│   ├── store.js               # Game state (tested)
│   ├── themes.js              # Theme system (tested)
│   ├── quests.js              # Questions (tested)
│   └── audio.js               # Sound effects (tested)
└── vitest.config.js           # Vitest configuration
```

## Mocked Dependencies

The test suite mocks:
- **localStorage** - For theme/music preferences
- **AudioContext** - Web Audio API for sound effects
- **Vue Test Utils** - For component testing (if needed)

## Continuous Integration

Tests can be run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test
```

## Code Coverage

Generate HTML coverage report:

```bash
npm run test:coverage
```

Open `coverage/index.html` in browser to view detailed coverage.

## Writing New Tests

When adding new features, add corresponding tests:

1. **New feature** → Add to relevant test file
2. **Bug fix** → Add regression test
3. **Component** → Create component test file

Example test structure:

```javascript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../src/myModule.js'

describe('My Feature', () => {
  it('should do something', () => {
    const result = myFunction()
    expect(result).toBe(expected)
  })
})
```

## Test Philosophy

- ✅ **Test user scenarios** - Not just code paths
- ✅ **Test edge cases** - Empty states, errors, boundaries
- ✅ **Test integration** - How features work together
- ✅ **Keep tests fast** - No real API calls, minimal setup
- ✅ **Make tests readable** - Clear descriptions, obvious failures

## Troubleshooting

**Tests failing?**
- Check console output for specific error messages
- Verify mocks are properly configured
- Ensure localStorage is cleared between tests

**Tests slow?**
- Vitest is already fast, but avoid unnecessary setup
- Use `beforeEach` for common setup, not per-test

**Need debugging?**
- Use `console.log()` in tests (shows in output)
- Run single test file: `npx vitest tests/store.test.js`
