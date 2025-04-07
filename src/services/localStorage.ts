import { MatchResult } from '../contexts/GameContext'

// Types for storage data
export interface StorageData {
  stats: {
    wins: number
    losses: number
    draws: number
    totalExp: number
    nootWagered: number
    nootWon: number
    nootLost: number
  }
  matchHistory: MatchHistory[]
}

export interface MatchHistory {
  timestamp: number
  result: MatchResult
  expGained: number
  wager: string
  transactionHash?: string
}

// Storage key
const STORAGE_KEY = 'nootWars'

// Get stored data
export const getStoredData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error retrieving data from local storage:', error)
  }
  
  // Return default data if none exists or on error
  return {
    stats: {
      wins: 0,
      losses: 0,
      draws: 0,
      totalExp: 0,
      nootWagered: 0,
      nootWon: 0,
      nootLost: 0
    },
    matchHistory: []
  }
}

// Save data to storage
export const saveStoredData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving data to local storage:', error)
  }
}

// Update stats after match
export const updateStats = (
  result: MatchResult, 
  expGained: number = 0, 
  wager: string = '1',
  transactionHash?: string
): void => {
  const data = getStoredData()
  
  // Parse wager as number for stats
  const wagerAmount = parseFloat(wager)
  
  // Update stats based on result
  if (result === 'win') {
    data.stats.wins += 1
    data.stats.totalExp += expGained
    // In a win, we don't lose NOOT but gain EXP
  } else if (result === 'loss') {
    data.stats.losses += 1
    data.stats.nootLost += wagerAmount
    data.stats.nootWagered += wagerAmount
  } else {
    data.stats.draws += 1
    // In a draw, wager is returned (no tokens lost)
  }
  
  // Add match to history
  data.matchHistory.push({
    timestamp: Date.now(),
    result,
    expGained,
    wager,
    transactionHash
  })
  
  // Save updated data
  saveStoredData(data)
}

// Get player stats
export const getPlayerStats = () => {
  const data = getStoredData()
  return data.stats
}

// Get match history
export const getMatchHistory = () => {
  const data = getStoredData()
  return data.matchHistory
}

// Add transaction hash to most recent match
export const updateTransactionHash = (transactionHash: string): void => {
  const data = getStoredData()
  
  if (data.matchHistory.length > 0) {
    // Get the most recent match
    const lastMatch = data.matchHistory[data.matchHistory.length - 1]
    lastMatch.transactionHash = transactionHash
    
    // Save updated data
    saveStoredData(data)
  }
}

// Get transaction history (matches with transaction hashes)
export const getTransactionHistory = () => {
  const data = getStoredData()
  return data.matchHistory.filter(match => match.transactionHash)
}

// Clear all stored data
export const clearStoredData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing data from local storage:', error)
  }
} 