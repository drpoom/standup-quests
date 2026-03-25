# Standup Quest ⚔️🛡️

A gamified, fantasy-themed software engineering standup tracker to turn boring morning meetings into an epic journey.

## Features ✨

- **Gather Your Party**: Easily add members to your team. (Saves locally so you don't have to redo it!)
- **Dynamic Fantasy Avatars**: Members automatically receive a unique pixel-art avatar (powered by [DiceBear Adventurer](https://dicebear.com/styles/adventurer/)).
- **Customizable Quests**: Encounter random agile-themed challenges like "What dark beast (blocker) blocks your path today?" or "Did any of your spells (tests) backfire during the last cycle?".
- **Interactive Journey**:
  - Live countdown timer for each question to keep meetings snappy.
  - Interactive grid to award 1 point per member per quest.
  - Dynamic pause, skip, and "add mid-journey" functionalities.
- **Hall of Fame**: Top contributors are honored on a podium at the end, while those who scored zero points are respectfully remembered with a tombstone (`[RIP] 🪦 The Fallen`).
- **Retro Audio**: Custom synthesized 8-bit sound effects using the Web Audio API for point accumulation, transitions, and finishing the quest.
- **Fantasy Skin**: Dark tavern vibes, a magical UI with Tailwind CSS, and MedievalSharp typography.

## Tech Stack 🛠

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API (zero dependencies)
- **Avatars**: DiceBear API
- **Backgrounds**: Unsplash API

## Getting Started 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/drpoom/standup-quests.git
   cd standup-quests
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```
   The built files will be output to the `dist` directory.

## Contributing 🤝

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/drpoom/standup-quests/issues).

## License 📝

MIT
