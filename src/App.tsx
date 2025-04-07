import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from './contexts/WalletContext';
import WalletInfo from './components/Wallet/WalletInfo';
import ConnectButton from './components/Wallet/ConnectButton';
import { AbstractWalletProvider } from '@abstract-foundation/agw-react';
import { abstractTestnet, abstract } from 'viem/chains';
import { http } from 'wagmi';
import { GameProvider } from './contexts/GameContext';
import Game from './components/Game/Game';
import { useWallet } from './contexts/WalletContext';

// Create the query client
const queryClient = new QueryClient();

// Choose the appropriate chain
const chain = abstract; // Using Abstract mainnet

// Main app content with wallet connection logic
const AppContent = () => {
  const { walletState } = useWallet();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      <header className="p-6 border-b border-gray-700 bg-black/30 backdrop-blur-sm shadow-md">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            NOOT WARS
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 flex-1 flex flex-col items-center justify-center max-w-4xl my-8">
        {!walletState.isConnected ? (
          <div className="w-full max-w-md transform transition-all duration-500 hover:scale-105">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl text-center space-y-6 border border-gray-700">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Connect Your Wallet
              </h2>
              <p className="text-gray-300 text-lg">
                Connect your wallet to play NOOT WARS and start wagering!
              </p>
              <div className="flex justify-center pt-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-8 transform transition-all duration-500">
            {/* Connected wallet info */}
            <div className="w-full">
              <WalletInfo />
            </div>
            
            {/* Game interface */}
            <div className="w-full">
              <GameProvider>
                <Game />
              </GameProvider>
            </div>
          </div>
        )}
      </main>
      
      <footer className="p-6 text-center border-t border-gray-800 bg-black/30 backdrop-blur-sm">
        <p className="text-gray-500">© 2023 NOOT WARS - Rock Paper Scissors Game</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AbstractWalletProvider
        chain={chain}
        transport={http()}
      >
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </AbstractWalletProvider>
    </QueryClientProvider>
  );
}

export default App; 