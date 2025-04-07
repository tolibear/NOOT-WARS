import React from 'react'
import { Result } from '../../contexts/GameContext'

interface RoundTrackerProps {
  results: Result[]
  currentRound: number
}

const RoundTracker: React.FC<RoundTrackerProps> = ({ results, currentRound }) => {
  // Generate an array of 3 rounds (best of 3)
  const rounds = [1, 2, 3]
  
  // Get the result icon for each round
  const getResultIcon = (roundIndex: number) => {
    const result = results[roundIndex]
    
    if (result === undefined) {
      // Round not played yet
      return null
    }
    
    switch (result) {
      case 'win':
        return <span className="text-green-400 animate-pulse">✓</span>
      case 'loss':
        return <span className="text-red-400">✗</span>
      case 'draw':
        return <span className="text-yellow-400">⟳</span>
      default:
        return null
    }
  }
  
  // Get background color for each round indicator
  const getRoundStyle = (roundNum: number) => {
    // Current round
    if (roundNum === currentRound) {
      return 'border-blue-400 bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-500/30 animate-pulse'
    }
    
    // Completed round
    if (roundNum < currentRound) {
      const result = results[roundNum - 1]
      
      switch (result) {
        case 'win':
          return 'border-green-400 bg-gradient-to-br from-green-800 to-green-950 shadow-md'
        case 'loss':
          return 'border-red-400 bg-gradient-to-br from-red-800 to-red-950 shadow-md'
        case 'draw':
          return 'border-yellow-400 bg-gradient-to-br from-yellow-800 to-yellow-950 shadow-md'
        default:
          return 'border-gray-600 bg-gradient-to-br from-gray-700 to-gray-900'
      }
    }
    
    // Future round
    return 'border-gray-600 bg-gradient-to-br from-gray-700 to-gray-900 opacity-70'
  }

  return (
    <div>
      <h3 className="text-center text-gray-300 mb-4 font-medium">Best of 3</h3>
      <div className="flex items-center justify-center space-x-10">
        {rounds.map(roundNum => (
          <div 
            key={roundNum} 
            className="text-center transform transition-all duration-500 hover:scale-110"
          >
            <div 
              className={`
                w-16 h-16 rounded-full 
                border-2 ${getRoundStyle(roundNum)}
                flex items-center justify-center
                text-xl font-bold
                transition-all duration-300
              `}
            >
              {getResultIcon(roundNum - 1) || roundNum}
            </div>
            <div className="mt-3 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
              Round {roundNum}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoundTracker 