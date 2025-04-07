import { useState, useEffect } from 'react'
import { Choice, Result, MatchResult } from '../contexts/GameContext'
import { determineWinner, generateComputerChoice, determineMatchResult } from '../utils/gameLogic'
import { updateStats, getPlayerStats } from '../services/localStorage'

interface GameState {
  playerChoice: Choice | null
  computerChoice: Choice | null
  roundResults: Result[]
  currentRound: number
  matchResult: MatchResult | null
  exp: number
  isWagerSet: boolean
}

export const useGameState = () => {
  // Initial state
  const [gameState, setGameState] = useState<GameState>({
    playerChoice: null,
    computerChoice: null,
    roundResults: [],
    currentRound: 1,
    matchResult: null,
    exp: 0,
    isWagerSet: false, // Default to false for Phase 3 to require wager approval
  })

  // Load exp from localStorage on initial render
  useEffect(() => {
    const playerStats = getPlayerStats()
    setGameState(prev => ({
      ...prev,
      exp: playerStats.totalExp
    }))
  }, [])

  // Process the result of a round
  const processRoundResult = (playerChoice: Choice) => {
    const computerChoice = generateComputerChoice()
    const result = determineWinner(playerChoice, computerChoice)
    
    const newRoundResults = [...gameState.roundResults, result]
    
    // Check if match is complete (best of 3)
    let matchResult = determineMatchResult(newRoundResults)
    
    // Save match result to local storage if match is complete
    if (matchResult) {
      const expGained = matchResult === 'win' ? 10 : 0
      // We don't update actual stats until the wager is settled
      // This will be done by the WagerConfirmation component
    }
    
    // Update state
    setGameState(prev => ({
      ...prev,
      playerChoice,
      computerChoice,
      roundResults: newRoundResults,
      currentRound: prev.currentRound + 1,
      matchResult,
      // Don't update exp here, we'll do it after wager settlement
    }))
  }

  // Make a choice
  const makeChoice = (choice: Choice) => {
    // If match is already complete, reset first
    if (gameState.matchResult) {
      resetGame()
    }
    
    // Only allow making a choice if wager is set
    if (gameState.isWagerSet) {
      processRoundResult(choice)
    }
  }

  // Reset game
  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      computerChoice: null,
      roundResults: [],
      currentRound: 1,
      matchResult: null,
      isWagerSet: false, // Reset wager approval status
    }))
  }

  // Set wager status to approved
  const setWagerApproved = () => {
    setGameState(prev => ({
      ...prev,
      isWagerSet: true
    }))
  }

  return {
    gameState,
    makeChoice,
    resetGame,
    setWagerApproved
  }
} 