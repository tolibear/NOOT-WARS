import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGlobalWalletSignerAccount } from '@abstract-foundation/agw-react';

// Define our wallet state interface
interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: bigint;
  isApproved: boolean;
  transactionPending: boolean;
  error: string | null;
}

// Define context interface
interface WalletContextProps {
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

// Create the context with default values
const WalletContext = createContext<WalletContextProps>({
  walletState: {
    isConnected: false,
    address: null,
    balance: BigInt(0),
    isApproved: false,
    transactionPending: false,
    error: null,
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

// NOOT token contract address (placeholder - should be replaced with actual address)
const NOOT_TOKEN_ADDRESS = '0x85Ca16Fd0e81659e0b8Be337294149E722528731';

// Wallet Provider component
export const WalletProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Initial wallet state
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: BigInt(0),
    isApproved: false,
    transactionPending: false,
    error: null,
  });
  
  // Use AGW hooks for account information
  const { address, isConnected } = useGlobalWalletSignerAccount();
  
  // Update wallet state when account changes
  useEffect(() => {
    if (isConnected && address) {
      setWalletState(prev => ({
        ...prev,
        isConnected: true,
        address: address,
        // Note: For actual token balance, you would need to implement a separate
        // function to fetch the balance from your token contract
        balance: BigInt(0),
      }));
    } else {
      setWalletState(prev => ({
        ...prev,
        isConnected: false,
        address: null,
        balance: BigInt(0),
      }));
    }
  }, [isConnected, address]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setWalletState(prev => ({ ...prev, transactionPending: true, error: null }));
      
      // The actual connection flow will be handled by AGW hooks
      // This function is mainly used to track state and handle errors
      
      setWalletState(prev => ({ ...prev, transactionPending: false }));
    } catch (error) {
      setWalletState(prev => ({ 
        ...prev, 
        transactionPending: false, 
        error: error instanceof Error ? error.message : 'Unknown error connecting wallet'
      }));
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    try {
      // Disconnect wallet logic (will be handled by AGW hooks)
      // We'll update our state accordingly
      setWalletState({
        isConnected: false,
        address: null,
        balance: BigInt(0),
        isApproved: false,
        transactionPending: false,
        error: null,
      });
    } catch (error) {
      setWalletState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error disconnecting wallet'
      }));
    }
  };

  // Provide the context value
  return (
    <WalletContext.Provider 
      value={{
        walletState,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook for using the wallet context
export const useWallet = () => useContext(WalletContext);

export default WalletContext; 