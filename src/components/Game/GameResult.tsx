import React from 'react'
import { Choice, Result } from '../../contexts/GameContext'

interface GameResultProps {
  playerChoice: Choice
  computerChoice: Choice
  result: Result
}

const GameResult: React.FC<GameResultProps> = ({ playerChoice, computerChoice, result }) => {
  // Get image path for each choice
  const getImagePath = (choice: Choice) => {
    switch (choice) {
      case 'rock':
        return '/assets/icons/rock.png'
      case 'paper':
        return '/assets/icons/paper.png'
      case 'scissors':
        return '/assets/icons/scissors.png'
      default:
        return ''
    }
  }

  // Get color for result
  const getResultColor = () => {
    switch (result) {
      case 'win':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500'
      case 'loss':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500' 
      case 'draw':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500'
      default:
        return ''
    }
  }

  // Get result text
  const getResultText = () => {
    switch (result) {
      case 'win':
        return 'You Win!'
      case 'loss':
        return 'You Lose!'
      case 'draw':
        return 'Draw!'
      default:
        return ''
    }
  }

  // Get glowing border based on result
  const getGlowBorder = (isPlayer: boolean) => {
    if (
      (isPlayer && result === 'win') || 
      (!isPlayer && result === 'loss')
    ) {
      return 'ring-4 ring-green-500 ring-opacity-60'
    }
    
    if (
      (isPlayer && result === 'loss') || 
      (!isPlayer && result === 'win')
    ) {
      return 'ring-4 ring-red-500 ring-opacity-60'
    }
    
    return 'ring-4 ring-yellow-500 ring-opacity-40'
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-6 shadow-xl border border-gray-800">
      <h3 className="text-xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Round Result</h3>
      
      <div className="flex justify-between items-center">
        {/* Player choice */}
        <div className="text-center space-y-4">
          <div className="text-lg font-medium text-blue-300">You</div>
          <div className={`
            bg-gradient-to-br from-gray-800 to-gray-900 
            w-32 h-32 mx-auto rounded-full 
            flex items-center justify-center
            shadow-inner transform transition-all duration-500
            ${getGlowBorder(true)}
            ${result === 'win' ? 'scale-110' : ''}
          `}>
            <img 
              src={getImagePath(playerChoice)} 
              alt={playerChoice} 
              className="w-24 h-24 object-contain transform scale-x-[-1]" 
            />
          </div>
          <div className="capitalize text-gray-300 font-medium">{playerChoice}</div>
        </div>

        {/* VS */}
        <div className="text-center transform transition-all duration-500 scale-110">
          <div className={`text-3xl font-extrabold ${getResultColor()} mb-2`}>
            {getResultText()}
          </div>
          <div className="text-gray-400 text-lg font-semibold">VS</div>
        </div>

        {/* Computer choice */}
        <div className="text-center space-y-4">
          <div className="text-lg font-medium text-red-300">Computer</div>
          <div className={`
            bg-gradient-to-br from-gray-800 to-gray-900 
            w-32 h-32 mx-auto rounded-full 
            flex items-center justify-center
            shadow-inner transform transition-all duration-500
            ${getGlowBorder(false)}
            ${result === 'loss' ? 'scale-110' : ''}
          `}>
            <img 
              src={getImagePath(computerChoice)} 
              alt={computerChoice} 
              className="w-24 h-24 object-contain" 
            />
          </div>
          <div className="capitalize text-gray-300 font-medium">{computerChoice}</div>
        </div>
      </div>
    </div>
  )
}

export default GameResult 