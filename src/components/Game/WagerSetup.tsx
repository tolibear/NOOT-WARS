import React, { useState, useEffect } from 'react';
import { useWager } from '../../contexts/WagerContext';
import { useWallet } from '../../contexts/WalletContext';
import { useGame } from '../../contexts/GameContext';

interface WagerSetupProps {
  onWagerConfirmed: () => void;
}

const WagerSetup: React.FC<WagerSetupProps> = ({ onWagerConfirmed }) => {
  const { wagerState, setWagerAmount, approveWager, resetWager, checkApprovalNeeded } = useWager();
  const { walletState } = useWallet();
  const { setWagerApproved } = useGame();
  const [localAmount, setLocalAmount] = useState(wagerState.amount);
  const [needsApproval, setNeedsApproval] = useState(true);

  // Check if approval is needed when component mounts or wager amount changes
  useEffect(() => {
    const checkApproval = async () => {
      const needs = await checkApprovalNeeded();
      setNeedsApproval(needs);
    };
    
    if (walletState.isConnected) {
      checkApproval();
    }
  }, [walletState.isConnected, wagerState.amount, checkApprovalNeeded]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAmount(e.target.value);
  };

  const handleSetAmount = () => {
    setWagerAmount(localAmount);
  };

  const handleApproveWager = async () => {
    const success = await approveWager();
    if (success) {
      setWagerApproved();
      onWagerConfirmed();
    }
  };

  const handleReset = () => {
    resetWager();
    setLocalAmount('1');
  };

  const handleStartGame = () => {
    // If already approved for this amount, just start the game
    setWagerApproved();
    onWagerConfirmed();
  };

  if (!walletState.isConnected) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-purple-700 mb-4">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-300 mb-4">
          Please connect your wallet to place a wager and start playing!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-purple-700 mb-4">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Set Your Wager</h2>
      
      <div className="mb-4">
        <label htmlFor="wagerAmount" className="block text-gray-300 mb-2">
          Wager Amount ($NOOT)
        </label>
        <div className="flex space-x-2">
          <input
            id="wagerAmount"
            type="number"
            min="1"
            step="1"
            value={localAmount}
            onChange={handleAmountChange}
            className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 w-full"
            disabled={wagerState.isProcessing}
          />
          <button
            onClick={handleSetAmount}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300"
            disabled={wagerState.isProcessing || localAmount === wagerState.amount}
          >
            Set
          </button>
        </div>
        <div className="mt-3 text-gray-300">
          <p className="mb-1">
            <span className="font-bold">Current Wager:</span> {wagerState.amount} $NOOT
          </p>
          <p className="mb-1">
            <span className="font-bold">Current Allowance:</span> {wagerState.currentAllowance} $NOOT
          </p>
          <p className={`text-sm ${!needsApproval ? 'text-green-400' : 'text-yellow-400'}`}>
            {!needsApproval 
              ? '✅ You have already approved enough tokens for this wager' 
              : '⚠️ Approval needed for this wager amount'}
          </p>
        </div>
      </div>

      {wagerState.error && (
        <div className="bg-red-900 text-red-200 p-3 rounded mb-4">
          {wagerState.error}
        </div>
      )}

      <div className="flex space-x-3">
        {needsApproval ? (
          <button
            onClick={handleApproveWager}
            className={`px-4 py-2 rounded transition duration-300 w-2/3 ${
              wagerState.isProcessing
                ? 'bg-gray-600 text-white cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
            disabled={wagerState.isProcessing}
          >
            {wagerState.isProcessing
              ? 'Processing...'
              : 'Approve Wager'}
          </button>
        ) : (
          <button
            onClick={handleStartGame}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300 w-2/3"
            disabled={wagerState.isProcessing}
          >
            Start Game
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300 w-1/3"
          disabled={wagerState.isProcessing}
        >
          Reset
        </button>
      </div>

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

export default WagerSetup; 