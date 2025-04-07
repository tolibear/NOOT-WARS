# NOOT WARS

A meme-themed Rock-Paper-Scissors style game with blockchain elements.

## Game Overview

NOOT WARS is a fun singleplayer game where players battle against the computer in a classic Rock-Paper-Scissors format with a blockchain twist. Players can wager $NOOT tokens on matches and earn phantom "EXP" for victories.

### Features

- Rock-Paper-Scissors gameplay (🪨 📄 ✂️)
- Best-of-three match format
- $NOOT token wagering system
- Phantom "EXP" earning system
- Wallet integration with Abstract Global Wallet (AGW)
- Local storage for game statistics

## Tech Stack

- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS
- Wallet: Abstract Global Wallet (AGW)
- Blockchain interaction: viem and wagmi libraries
- Token contracts: ERC20 standard
- Data storage: Browser local storage
- Visual assets: Emoji-based art

## Implementation Status

### Completed:
- ✅ Core game mechanics (player choice, computer choice, winner determination)
- ✅ Best-of-three match system with round tracking
- ✅ Game UI components (choice buttons, round tracker, result display)
- ✅ Wallet connection with AGW
- ✅ Local storage for game statistics and match history
- ✅ NOOT token contract integration
- ✅ Token approval workflow
- ✅ Wager setup and confirmation UI

### In Progress:
- ⏳ Transaction settlement for match results
- ⏳ Display of $NOOT balance
- ⏳ UI polish and animations

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-username/noot-wars.git
   cd noot-wars
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Game Flow

1. Connect your wallet using the AGW connector
2. Set your wager amount (default: 1 $NOOT)
3. Approve token spending if needed
4. Start a match and make your choice (Rock, Paper, or Scissors)
5. Win 2 out of 3 rounds to win the match
6. On win: Earn EXP
7. On loss: Lose wagered $NOOT tokens
8. View your stats and match history

## Project Structure

```
src/
├── components/        # UI components
│   ├── Game/          # Game-specific components
│   └── Wallet/        # Wallet connection components
├── contexts/          # React contexts
├── hooks/             # Custom React hooks
├── services/          # Service modules for storage and tokens
└── utils/             # Utility functions
```

## License

[MIT License](LICENSE)
