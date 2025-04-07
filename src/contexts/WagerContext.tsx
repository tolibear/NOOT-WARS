import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useWallet } from './WalletContext';
import useWalletActions from '../hooks/useWallet';
import { MatchResult } from './GameContext';
import { parseUnits, formatUnits } from 'viem';
import { recordTransaction } from '../services/tokenService';

// Define wager state interface
interface WagerState {
  amount: string;
  isApproved: boolean;
  isProcessing: boolean;
  transactionHash: string | null;
  error: string | null;
  currentAllowance: string; // Store current allowance as human-readable string
}

// Define context interface
interface WagerContextProps {
  wagerState: WagerState;
  setWagerAmount: (amount: string) => void;
  approveWager: () => Promise<boolean>;
  processMatchResult: (result: MatchResult) => Promise<boolean>;
  resetWager: () => void;
  checkApprovalNeeded: () => Promise<boolean>; // New function to check if approval is needed
}

// Create context with default values
const WagerContext = createContext<WagerContextProps>({
  wagerState: {
    amount: '1', // Default to 1 NOOT as per requirements
    isApproved: false,
    isProcessing: false,
    transactionHash: null,
    error: null,
    currentAllowance: '0', // Default allowance
  },
  setWagerAmount: () => {},
  approveWager: async () => false,
  processMatchResult: async () => false,
  resetWager: () => {},
  checkApprovalNeeded: async () => true, // Default to needing approval
});

// NOOT token contract address
const NOOT_TOKEN_ADDRESS = '0x85Ca16Fd0e81659e0b8Be337294149E722528731';
// Game contract address that will receive the wagers
const GAME_CONTRACT_ADDRESS = '0x4a3d233114ED63B41e54c90E5F8A285C6D0DC907';

// Wager Provider component
export const WagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial wager state
  const [wagerState, setWagerState] = useState<WagerState>({
    amount: '1', // Default to 1 NOOT
    isApproved: false,
    isProcessing: false,
    transactionHash: null,
    error: null,
    currentAllowance: '0', // Default allowance
  });

  const { walletState } = useWallet();
  const { checkAllowance, approveNOOT, checkNOOTBalance, transferNOOTOnLoss } = useWalletActions();

  // Check approval status and current allowance when component mounts or wallet state changes
  useEffect(() => {
    const fetchAllowanceAndStatus = async () => {
      if (walletState.isConnected) {
        try {
          const allowance = await checkAllowance();
          const allowanceFormatted = formatUnits(allowance, 18); // Format to human-readable
          
          // Check if the current allowance covers the wager amount
          const wagerBigInt = parseUnits(wagerState.amount, 18);
          const isApproved = allowance >= wagerBigInt;
          
          setWagerState(prev => ({
            ...prev,
            isApproved,
            currentAllowance: allowanceFormatted,
          }));
          
          console.log(`Current allowance: ${allowanceFormatted} NOOT`);
        } catch (error) {
          console.error('Error checking approval status:', error);
        }
      }
    };

    fetchAllowanceAndStatus();
  }, [walletState.isConnected, checkAllowance, wagerState.amount]);

  // Set wager amount
  const setWagerAmount = (amount: string) => {
    setWagerState(prev => ({
      ...prev,
      amount,
    }));
    
    // After setting the amount, check if we're still approved for this amount
    checkApprovalNeeded();
  };
  
  // Check if approval is needed based on current allowance vs wager amount
  const checkApprovalNeeded = async (): Promise<boolean> => {
    if (!walletState.isConnected) return true;
    
    try {
      const allowance = await checkAllowance();
      const wagerBigInt = parseUnits(wagerState.amount, 18);
      const needsApproval = allowance < wagerBigInt;
      
      setWagerState(prev => ({
        ...prev,
        isApproved: !needsApproval,
        currentAllowance: formatUnits(allowance, 18),
      }));
      
      return needsApproval;
    } catch (error) {
      console.error('Error checking if approval needed:', error);
      return true; // Default to requiring approval if there's an error
    }
  };

  // Approve wager
  const approveWager = async (): Promise<boolean> => {
    if (!walletState.isConnected) {
      setWagerState(prev => ({
        ...prev,
        error: 'Wallet not connected',
      }));
      return false;
    }

    try {
      // Check if approval is actually needed
      const needsApproval = await checkApprovalNeeded();
      if (!needsApproval) {
        console.log('Approval not needed - already approved for this amount');
        return true;
      }
      
      setWagerState(prev => ({
        ...prev,
        isProcessing: true,
        error: null,
      }));

      // Check if user has enough balance
      const balance = await checkNOOTBalance();
      const wagerBigInt = parseUnits(wagerState.amount, 18);
      if (balance < wagerBigInt) {
        setWagerState(prev => ({
          ...prev,
          isProcessing: false,
          error: 'Insufficient NOOT balance',
        }));
        return false;
      }

      // Approve NOOT tokens
      const txHash = await approveNOOT(wagerState.amount);
      
      // After approval, check the new allowance
      const newAllowance = await checkAllowance();
      const allowanceFormatted = formatUnits(newAllowance, 18);
      
      setWagerState(prev => ({
        ...prev,
        isApproved: true,
        isProcessing: false,
        transactionHash: txHash,
        currentAllowance: allowanceFormatted,
      }));
      
      return true;
    } catch (error) {
      setWagerState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Unknown error approving wager',
      }));
      return false;
    }
  };

  // Process match result
  const processMatchResult = async (result: MatchResult): Promise<boolean> => {
    if (!walletState.isConnected || !wagerState.isApproved) {
      setWagerState(prev => ({
        ...prev,
        error: !walletState.isConnected ? 'Wallet not connected' : 'Wager not approved',
      }));
      return false;
    }

    try {
      setWagerState(prev => ({
        ...prev,
        isProcessing: true,
        error: null,
      }));

      let txHash = '';
      
      // Handle different match results
      if (result === 'loss') {
        // When user loses, transfer tokens to the game contract
        console.log(`Processing loss: Transferring ${wagerState.amount} NOOT tokens`);
        txHash = await transferNOOTOnLoss(wagerState.amount);
      } else if (result === 'win') {
        // For wins, we're just awarding EXP (handled by the calling component)
        console.log(`Processing win: Awarding EXP (no token transfer needed)`);
        // Simulate transaction hash for consistency in records
        txHash = `win_${Date.now()}`;
      } else {
        // For draws, no token transfer needed
        console.log(`Processing draw: No token transfer needed`);
        // Simulate transaction hash for consistency in records
        txHash = `draw_${Date.now()}`;
      }
      
      // Record the transaction in local storage
      recordTransaction(txHash, result, wagerState.amount);
      
      setWagerState(prev => ({
        ...prev,
        isProcessing: false,
        transactionHash: txHash,
      }));
      
      return true;
    } catch (error) {
      setWagerState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Unknown error processing match result',
      }));
      return false;
    }
  };

  // Reset wager
  const resetWager = () => {
    setWagerState(prev => ({
      ...prev,
      amount: '1', // Reset to default
      isProcessing: false,
      transactionHash: null,
      error: null,
      // Keep the current allowance and approval state
    }));
  };

  return (
    <WagerContext.Provider
      value={{
        wagerState,
        setWagerAmount,
        approveWager,
        processMatchResult,
        resetWager,
        checkApprovalNeeded,
      }}
    >
      {children}
    </WagerContext.Provider>
  );
};

// Custom hook for using the wager context
export const useWager = () => {
  const context = useContext(WagerContext);
  if (context === undefined) {
    throw new Error('useWager must be used within a WagerProvider');
  }
  return context;
};

export default WagerContext; 