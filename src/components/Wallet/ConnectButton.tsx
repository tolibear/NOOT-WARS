import React, { useState } from 'react';
import { useLoginWithAbstract } from '@abstract-foundation/agw-react';
import { useWallet } from '../../contexts/WalletContext';

const ConnectButton: React.FC = () => {
  const { login, logout } = useLoginWithAbstract();
  const { walletState } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      if (walletState.isConnected) {
        await logout();
      } else {
        await login();
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-blue-600 to-purple-600 
        hover:from-blue-700 hover:to-purple-700 
        text-white font-bold py-3 px-8 
        rounded-xl
        shadow-lg hover:shadow-xl
        transform transition-all duration-300 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
        ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
      `}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <span className={`${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {walletState.isConnected ? 'Disconnect' : 'Connect Wallet'}
      </span>
    </button>
  );
};

export default ConnectButton; 