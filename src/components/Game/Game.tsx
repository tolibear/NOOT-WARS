import React, { useState } from 'react'
import { useGame, Choice } from '../../contexts/GameContext'
import { useWager } from '../../contexts/WagerContext'
import ChoiceButton from './ChoiceButton'
import GameResult from './GameResult'
import RoundTracker from './RoundTracker'
import WagerSetup from './WagerSetup'
import WagerConfirmation from './WagerConfirmation'

const Game: React.FC = () => {
  const { gameState, makeChoice, resetGame } = useGame()
  const { resetWager } = useWager()
  const [wagerConfirmed, setWagerConfirmed] = useState(false)
  const [showingSettlement, setShowingSettlement] = useState(false)

  const handleWagerConfirmed = () => {
    setWagerConfirmed(true)
  }

  const handleTransactionComplete = () => {
    setShowingSettlement(false)
    resetGame()
    resetWager()
    setWagerConfirmed(false)
  }

  // Show settlement confirmation when match is complete
  const handleMatchComplete = () => {
    if (gameState.matchResult && !showingSettlement) {
      setShowingSettlement(true)
    }
  }

  // Check if match is complete and show settlement
  if (gameState.matchResult && !showingSettlement) {
    handleMatchComplete()
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700 transform transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8">NOOT WARS</h2>
        
        {/* Wager Setup - show if wager not confirmed */}
        {!wagerConfirmed && !showingSettlement && (
          <WagerSetup onWagerConfirmed={handleWagerConfirmed} />
        )}

        {/* Settlement Confirmation - show after match is complete */}
        {showingSettlement && gameState.matchResult && (
          <WagerConfirmation 
            matchResult={gameState.matchResult} 
            onTransactionComplete={handleTransactionComplete} 
          />
        )}
        
        {/* Round Tracker */}
        <div className="mb-8">
          <RoundTracker results={gameState.roundResults} currentRound={gameState.currentRound} />
        </div>
        
        {/* Game Results Display (if round completed) */}
        {gameState.playerChoice && gameState.computerChoice && (
          <div className="mb-8">
            <GameResult 
              playerChoice={gameState.playerChoice} 
              computerChoice={gameState.computerChoice}
              result={gameState.roundResults[gameState.roundResults.length - 1]}
            />
          </div>
        )}
        
        {/* Match Result (if match completed) */}
        {gameState.matchResult && !showingSettlement && (
          <div className="text-center my-8 p-6 bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl border border-gray-800 shadow-inner">
            <h3 className={`text-3xl font-extrabold mb-3 ${
              gameState.matchResult === 'win' 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500' 
                : gameState.matchResult === 'loss' 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500'
            }`}>
              Match {gameState.matchResult === 'win' ? 'Won!' : gameState.matchResult === 'loss' ? 'Lost!' : 'Draw!'}
            </h3>
            {gameState.matchResult === 'win' && (
              <div className="animate-pulse mb-3">
                <p className="text-green-300 text-lg">✨ You earned 10 EXP! ✨</p>
              </div>
            )}
            <p className="text-blue-300 font-semibold mb-5 text-lg">Total EXP: {gameState.exp}</p>
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setShowingSettlement(true)}
            >
              Settle Wager
            </button>
          </div>
        )}
        
        {/* Choice Buttons (if match not completed and wager confirmed) */}
        {!gameState.matchResult && wagerConfirmed && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Choose your move:</h3>
            <div className="flex justify-center flex-wrap gap-6">
              <ChoiceButton choice="rock" onClick={() => makeChoice('rock')} />
              <ChoiceButton choice="paper" onClick={() => makeChoice('paper')} />
              <ChoiceButton choice="scissors" onClick={() => makeChoice('scissors')} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game 