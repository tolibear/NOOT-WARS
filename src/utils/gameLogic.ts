import { Choice, Result } from '../contexts/GameContext'

// Determine the winner of a rock-paper-scissors match
export const determineWinner = (playerChoice: Choice, computerChoice: Choice): Result => {
  // If choices are the same, it's a draw
  if (playerChoice === computerChoice) {
    return 'draw'
  }
  
  // Check win conditions
  if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    return 'win'
  }
  
  // If not a draw or win, it's a loss
  return 'loss'
}

// Generate a random choice for the computer
export const generateComputerChoice = (): Choice => {
  const choices: Choice[] = ['rock', 'paper', 'scissors']
  const randomIndex = Math.floor(Math.random() * choices.length)
  return choices[randomIndex]
}

// Calculate EXP earned from a win
export const calculateExpEarned = (): number => {
  // For Phase 1, we'll use a fixed value of 10 EXP per win
  return 10
}

// Determine match result from round results
export const determineMatchResult = (roundResults: Result[]): Result | null => {
  // Need at least 3 rounds to determine a match result
  if (roundResults.length < 3) {
    return null
  }
  
  // Count wins, losses, and draws
  const wins = roundResults.filter(result => result === 'win').length
  const losses = roundResults.filter(result => result === 'loss').length
  
  // Determine match result
  if (wins > losses) {
    return 'win'
  } else if (losses > wins) {
    return 'loss'
  } else {
    return 'draw'
  }
} 