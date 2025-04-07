import React from 'react'
import { Choice } from '../../contexts/GameContext'

// Import penguin images
// The images were shared by the user, but we're referencing them as if they were saved to the assets folder
// In a real implementation, these images would need to be saved to the public/assets/icons directory
const PENGUIN_IMAGES = {
  rock: '/assets/icons/penguin-rock.png',
  paper: '/assets/icons/penguin-paper.png',
  scissors: '/assets/icons/penguin-scissors.png',
}

interface ChoiceButtonProps {
  choice: Choice
  onClick: () => void
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ choice, onClick }) => {
  // Get image path based on choice
  const getImagePath = () => {
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

  const getGradient = () => {
    switch (choice) {
      case 'rock':
        return 'from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'
      case 'paper':
        return 'from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
      case 'scissors':
        return 'from-green-500 to-green-700 hover:from-green-600 hover:to-green-800'
      default:
        return ''
    }
  }

  const getGlow = () => {
    switch (choice) {
      case 'rock':
        return 'hover:shadow-red-500/50'
      case 'paper':
        return 'hover:shadow-blue-500/50'
      case 'scissors':
        return 'hover:shadow-green-500/50'
      default:
        return ''
    }
  }

  return (
    <button
      onClick={onClick}
      className={`
        relative
        flex flex-col items-center justify-center
        p-6 rounded-2xl 
        text-white font-bold
        bg-gradient-to-b ${getGradient()}
        transition-all duration-300
        transform hover:scale-110 hover:shadow-xl hover:shadow-lg ${getGlow()}
        focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-white
        w-40 h-40
        border border-white/10
        group
      `}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-full bg-white opacity-10 rounded-2xl animate-pulse"></div>
      </div>
      <div className="h-24 w-24 mb-2 transform transition-transform group-hover:scale-125 duration-300 flex items-center justify-center">
        <img src={getImagePath()} alt={choice} className="w-full h-full object-contain" />
      </div>
      <span className="capitalize text-sm font-medium bg-black/30 px-2 py-1 rounded-full">{choice}</span>
    </button>
  )
}

export default ChoiceButton 