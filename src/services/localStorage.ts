import { MatchResult } from '../contexts/GameContext'

// Types for storage data
export interface StorageData {
  stats: {
    wins: number
    losses: number
    draws: number
    totalExp: number
  }
  matchHistory: MatchHistory[]
}

export interface MatchHistory {
  timestamp: number
  result: MatchResult
  expGained: number
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
      totalExp: 0
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
export const updateStats = (result: MatchResult, expGained: number = 0): void => {
  const data = getStoredData()
  
  // Update stats based on result
  if (result === 'win') {
    data.stats.wins += 1
    data.stats.totalExp += expGained
  } else if (result === 'loss') {
    data.stats.losses += 1
  } else {
    data.stats.draws += 1
  }
  
  // Add match to history
  data.matchHistory.push({
    timestamp: Date.now(),
    result,
    expGained
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

// Clear all stored data
export const clearStoredData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing data from local storage:', error)
  }
} 