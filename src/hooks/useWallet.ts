import { useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { parseUnits, hexToString, stringToHex, encodeFunctionData } from 'viem';
import { useWallet } from '../contexts/WalletContext';

// ERC20 ABI for token interactions - minimal for what we need
const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// NOOT token contract address
const NOOT_TOKEN_ADDRESS = '0x85Ca16Fd0e81659e0b8Be337294149E722528731' as `0x${string}`;
// Game contract address that will receive the wagers
const GAME_CONTRACT_ADDRESS = '0x4a3d233114ED63B41e54c90E5F8A285C6D0DC907' as `0x${string}`;

export const useWalletActions = () => {
  const { walletState } = useWallet();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  // Check token allowance
  const checkAllowance = useCallback(async () => {
    if (!publicClient || !address) return BigInt(0);

    try {
      const data = await publicClient.readContract({
        address: NOOT_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, GAME_CONTRACT_ADDRESS],
      });
      
      return data as bigint;
    } catch (error) {
      console.error('Error checking allowance:', error);
      return BigInt(0);
    }
  }, [publicClient, address]);

  // Approve tokens to be spent by the game contract
  const approveNOOT = useCallback(async (amount: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      // Convert human-readable amount to token units (assuming 18 decimals)
      const tokenAmount = parseUnits(amount, 18);
      
      // This is a placeholder since we're not using the actual Abstract client
      // In a real implementation, you would use the client's writeContract method
      console.log(`Would approve ${tokenAmount} NOOT tokens`);
      
      // Return a mock transaction hash
      return '0x0000000000000000000000000000000000000000000000000000000000000000';
    } catch (error) {
      console.error('Error approving NOOT tokens:', error);
      throw error;
    }
  }, [address]);

  // Check NOOT balance
  const checkNOOTBalance = useCallback(async () => {
    if (!publicClient || !address) return BigInt(0);

    try {
      const data = await publicClient.readContract({
        address: NOOT_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      });
      
      return data as bigint;
    } catch (error) {
      console.error('Error checking NOOT balance:', error);
      return BigInt(0);
    }
  }, [publicClient, address]);

  return {
    checkAllowance,
    approveNOOT,
    checkNOOTBalance,
    isConnected: walletState.isConnected,
    address: walletState.address,
    balance: walletState.balance,
  };
};

export default useWalletActions; 