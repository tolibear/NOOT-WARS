import React, { useEffect, useState } from 'react';
import { useWager } from '../../contexts/WagerContext';
import { MatchResult } from '../../contexts/GameContext';
import { updateStats } from '../../services/localStorage';
import { GAME_CONTRACT_ADDRESS } from '../../services/tokenService';

interface WagerConfirmationProps {
  matchResult: MatchResult;
  onTransactionComplete: () => void;
}

const WagerConfirmation: React.FC<WagerConfirmationProps> = ({
  matchResult,
  onTransactionComplete,
}) => {
  const { wagerState, processMatchResult } = useWager();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMatchSettlement = async () => {
      if (matchResult && !isProcessing && !isComplete) {
        setIsProcessing(true);
        setError(null);
        
        try {
          const success = await processMatchResult(matchResult);
          
          if (success) {
            // Update localStorage with match results
            const expGained = matchResult === 'win' ? 10 : 0;
            updateStats(
              matchResult, 
              expGained, 
              wagerState.amount,
              wagerState.transactionHash || undefined
            );
            
            setIsComplete(true);
            setTimeout(() => {
              onTransactionComplete();
            }, 3000); // Show completion message for 3 seconds
          } else {
            setError('Failed to process match result. Please try again.');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error processing match');
        } finally {
          setIsProcessing(false);
        }
      }
    };

    handleMatchSettlement();
  }, [matchResult, processMatchResult, isProcessing, isComplete, onTransactionComplete, wagerState.amount, wagerState.transactionHash]);

  const getResultMessage = () => {
    if (matchResult === 'win') {
      return 'You won! 🎉 +10 EXP gained!';
    } else if (matchResult === 'loss') {
      return `You lost! 😢 ${wagerState.amount} $NOOT has been transferred.`;
    } else {
      return 'It\'s a draw! Your wager has been returned.';
    }
  };

  const getStatusMessage = () => {
    if (isProcessing) {
      return 'Processing transaction...';
    } else if (isComplete) {
      return 'Transaction complete!';
    } else if (error) {
      return `Error: ${error}`;
    } else {
      return 'Preparing transaction...';
    }
  };

  // Format address for display (abbreviate it)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-purple-700 mb-4">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Match Settlement</h2>
      
      <div className="mb-4">
        <div className={`p-4 rounded-lg mb-4 ${
          matchResult === 'win' 
            ? 'bg-green-900 text-green-200' 
            : matchResult === 'loss' 
              ? 'bg-red-900 text-red-200' 
              : 'bg-yellow-900 text-yellow-200'
        }`}>
          <p className="font-bold text-lg">{getResultMessage()}</p>
          
          {/* Display information about the token transfer for losses */}
          {matchResult === 'loss' && !isProcessing && (
            <p className="mt-2 text-sm">
              Tokens transferred to Game Contract: {formatAddress(GAME_CONTRACT_ADDRESS)}
            </p>
          )}
        </div>
        
        <div className="text-gray-300">
          <p className="mb-2">
            <span className="font-bold">Status:</span> {getStatusMessage()}
          </p>
          <p className="mb-2">
            <span className="font-bold">Wager Amount:</span> {wagerState.amount} $NOOT
          </p>
          {matchResult === 'loss' && (
            <p className="mb-2">
              <span className="font-bold">Receiving Address:</span> {formatAddress(GAME_CONTRACT_ADDRESS)}
            </p>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {isComplete && (
        <div className="bg-green-900 text-green-200 p-3 rounded mb-4">
          {matchResult === 'loss' 
            ? `Transaction completed! ${wagerState.amount} $NOOT transferred to Game Contract.`
            : 'Transaction completed successfully!'}
        </div>
      )}

      {wagerState.transactionHash && (
        <div className="mt-4 text-sm text-gray-400">
          <p>Transaction Hash:</p>
          <a
            href={`https://etherscan.io/tx/${wagerState.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 break-words"
          >
            {wagerState.transactionHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default WagerConfirmation; 