import React, { createContext, useContext, ReactNode } from 'react'
import { useGameState } from '../hooks/useGameState'

// Define types
export type Choice = 'rock' | 'paper' | 'scissors'
export type Result = 'win' | 'loss' | 'draw'
export type MatchResult = 'win' | 'loss' | 'draw'

interface GameState {
  playerChoice: Choice | null
  computerChoice: Choice | null
  roundResults: Result[]
  currentRound: number
  matchResult: MatchResult | null
  exp: number
  isWagerSet: boolean
}

interface GameContextProps {
  gameState: GameState
  makeChoice: (choice: Choice) => void
  resetGame: () => void
}

// Create context
const GameContext = createContext<GameContextProps | undefined>(undefined)

// Create provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { gameState, makeChoice, resetGame } = useGameState()

  return (
    <GameContext.Provider value={{ gameState, makeChoice, resetGame }}>
      {children}
    </GameContext.Provider>
  )
}

// Custom hook for using the game context
export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
} 