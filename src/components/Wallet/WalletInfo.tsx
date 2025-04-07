import React, { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { formatEther } from 'viem';
import useWalletActions from '../../hooks/useWallet';
import { useWallet } from '../../contexts/WalletContext';

const WalletInfo: React.FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { checkNOOTBalance } = useWalletActions();
  const { walletState } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        const nootBalance = await checkNOOTBalance();
        setBalance(formatEther(nootBalance));
      }
    };

    fetchBalance();
    // Poll balance every 15 seconds
    const interval = setInterval(fetchBalance, 15000);
    
    return () => clearInterval(interval);
  }, [address, checkNOOTBalance]);

  if (!walletState.isConnected || !walletState.address) return null;

  // Format address for display
  const displayAddress = `${walletState.address.substring(0, 6)}...${walletState.address.substring(walletState.address.length - 4)}`;

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletState.address || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-400 font-medium mb-1">Connected Wallet</p>
          <div className="flex items-center">
            <div className="flex items-center bg-gray-900 rounded-full px-4 py-2 border border-gray-700">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
              <p className="text-lg font-bold text-white">{displayAddress}</p>
              <button
                onClick={copyAddressToClipboard}
                className="ml-2 text-gray-400 hover:text-blue-400 focus:outline-none transition-colors duration-300"
                title="Copy address"
              >
                {isCopied ? (
                  <span className="text-green-400">✓</span>
                ) : (
                  <span>📋</span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
          <div className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-700">
            <p className="text-sm text-gray-400 font-medium">$NOOT Balance</p>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
              {parseFloat(balance).toFixed(4)} NOOT
            </p>
          </div>
          
          <button
            onClick={() => disconnect()}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-500/30"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo; 