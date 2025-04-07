# NOOT WARS Implementation Plan

## Game Overview
NOOT WARS is a meme-themed Rock-Paper-Scissors style singleplayer game incorporating blockchain elements in a light, fun, and viral way.

### Core Gameplay
- Players choose between 3 actions: Rock, Paper, and Scissors 🪨 💵 ✂️
- Singleplayer format: player vs computer
- Each battle triggers a result: Win, Loss, or Draw
- Matches are best-of-three rounds
- On win: Player earns phantom "EXP"
- On loss: Player loses wagered $NOOT tokens
- Wager amount: 1 $NOOT per match

### Tech Stack
- Frontend: React + Tailwind CSS
- Wallet: Abstract Global Wallet (AGW)
- Blockchain interaction: viem and wagmi libraries
- Data storage: Browser local storage
- Visual assets: Emoji-based art
- simple design, black background, bootstrap library

## Phase 1: Core Game Mechanics (Off-chain)

### Tasks
1. **Project Setup**
   - Initialize React project with Vite
   - Install and configure Tailwind CSS
   - Set up project structure and routing

2. **UI Component Creation**
   - Create main game container and responsive layout
   - Design player/computer choice display using emoji (👊, ✋, ✌️)
   - Implement round tracker for best-of-three format
   - Add result notification component for win/loss/draw

3. **Game Logic Implementation**
   - Create choice selection mechanism for player
   - Implement computer random choice generation
   - Develop winner determination logic (Rock > Scissors > Paper > Rock)
   - Build best-of-three match resolution system

4. **Local Storage Integration**
   - Set up local storage structure for game data
   - Save basic game stats (wins, losses, draws)
   - Store player "EXP" gained from wins

### Deliverables
- Functioning Rock-Paper-Scissors game with best-of-three match format
- Basic game statistics saved to local storage
- Complete game flow from start to match resolution

## Phase 2: Wallet Connection

### Tasks
1. **AGW Integration**
   - Install AGW and related dependencies
   - Import and set up AbstractWalletProvider
   - Create AbstractWalletProvider wrapper for the application

2. **Connection Flow**
   - Implement wallet connect button component
   - Create authentication flow UI
   - Add connection status indicators
   - Display connected wallet address

3. **Token Interface**
   - Define NOOT token interface with ABI
   - Set up contract interaction using viem/wagmi
   - Implement balance checking functionality
   - Display user's $NOOT balance

### Deliverables
- Functional wallet connection UI
- Ability to connect/disconnect wallet
- Display of user's wallet address and $NOOT balance

## Phase 3: Wagering Implementation

### Tasks
1. **Wager UI**
   - Design wager setup interface to appear before match starts
   - Create wager confirmation dialog
   - Add match start button contingent on successful wager

2. **Token Approval**
   - Implement $NOOT token approval flow
   - Create approval status indicators
   - Develop transaction status notifications

3. **Match Settlement**
   - Implement transaction handling for match wagering
   - Set up win/loss token transfer logic
   - Update UI based on transaction status
   - Track phantom "EXP" for wins

4. **Data Persistence**
   - Expand local storage to include transaction history
   - Store match results with associated wagers
   - Save cumulative EXP from wins

### Deliverables
- Complete wagering system using $NOOT tokens
- Token approval and transaction flows
- Match settlement process for wins/losses
- Transaction history and EXP tracking

## Phase 4: Polish & UX Improvements

### Tasks
1. **Visual Enhancements**
   - Add animations for game actions (selection, result reveal)
   - Implement transitions between game states
   - Create visual feedback for wins/losses/draws
   - Polish emoji-based visual elements

2. **Player Dashboard**
   - Design stats dashboard showing:
     - Win/loss/draw record
     - Total EXP gained
     - $NOOT wagered/won/lost
   - Add match history view

3. **Loading States**
   - Implement loading indicators during blockchain transactions
   - Add transaction confirmation visuals
   - Create fallback UI for network issues

4. **Error Handling**
   - Develop comprehensive error handling system
   - Add user-friendly error messages
   - Implement recovery flows for failed transactions
   - Create wallet connection troubleshooting guide

### Deliverables
- Polished, animated game interface
- Complete player stats dashboard
- Robust loading states and error handling
- Improved overall user experience

## Phase 5: Future Expansion (Post-MVP)

### Potential Features
1. **Special Moves/Power-ups**
   - Special moves that can be unlocked with EXP
   - Power-ups that modify game rules

2. **Social Features**
   - Leaderboard implementation
   - Result sharing to social media
   - Friend challenges

3. **Achievement System**
   - Milestone-based achievements
   - Rewards for achievement completion

4. **Visual Themes**
   - Different visual theme options
   - Seasonal/special event themes

5. **Gameplay Variations**
   - Extended game variants (Rock-Paper-Scissors-Lizard-Spock)
   - Tournament mode

## Technical Implementation Details

### Project Structure
```
noot-wars/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Game/
│   │   ├── Wallet/
│   │   └── UI/
│   ├── contexts/
│   │   ├── GameContext.tsx
│   │   └── WalletContext.tsx
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   └── useWallet.ts
│   ├── services/
│   │   ├── localStorage.ts
│   │   └── tokenService.ts
│   ├── utils/
│   │   └── gameLogic.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── tailwind.config.js
```

### Data Models

**Game State:**
```typescript
interface GameState {
  playerChoice: Choice | null;
  computerChoice: Choice | null;
  roundResults: Result[];
  currentRound: number;
  matchResult: MatchResult | null;
  exp: number;
  isWagerSet: boolean;
}

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'loss' | 'draw';
type MatchResult = 'win' | 'loss' | 'draw';
```

**Wallet State:**
```typescript
interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: bigint;
  isApproved: boolean;
  transactionPending: boolean;
  error: string | null;
}
```

**Local Storage Schema:**
```typescript
interface StorageData {
  stats: {
    wins: number;
    losses: number;
    draws: number;
    totalExp: number;
    nootWagered: number;
    nootWon: number;
    nootLost: number;
  };
  matchHistory: {
    timestamp: number;
    result: MatchResult;
    wager: number;
    expGained: number;
  }[];
}
```

## Implementation Timeline

| Phase | Estimated Duration | Key Milestones |
|-------|-------------------|----------------|
| Phase 1 | 1-2 weeks | Core game mechanics, Local storage |
| Phase 2 | 1 week | Wallet connection, Token interface |
| Phase 3 | 1-2 weeks | Wagering system, Match settlement |
| Phase 4 | 1-2 weeks | UI polish, Error handling, Stats dashboard |
| Phase 5 | Ongoing | Feature expansion based on user feedback |

This implementation plan provides a roadmap for developing NOOT WARS in stages, with each phase building upon the previous one to deliver a complete and engaging gaming experience. 