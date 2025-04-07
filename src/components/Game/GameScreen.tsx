import React from 'react';
import { useAccount } from 'wagmi';
import ConnectButton from '../Wallet/ConnectButton';
import WalletInfo from '../Wallet/WalletInfo';

// This is a placeholder for the actual game component that will be used
// It should be replaced with the actual Game component from Phase 1
const GamePlaceholder: React.FC = () => {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl mb-4">Game will be displayed here</h2>
      <p>Rock 👊 - Paper ✋ - Scissors ✌️</p>
    </div>
  );
};

const GameScreen: React.FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col space-y-6">
      <div className="mx-auto max-w-md w-full">
        {isConnected ? (
          <WalletInfo />
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg text-center space-y-4">
            <h2 className="text-xl font-bold">Connect Your Wallet</h2>
            <p className="text-gray-300">
              Connect your wallet to play NOOT WARS and start wagering!
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        )}
      </div>

      {isConnected && (
        <div className="bg-gray-800 rounded-lg p-6">
          <GamePlaceholder />
        </div>
      )}
    </div>
  );
};

export default GameScreen; 