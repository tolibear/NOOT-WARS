import { useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
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
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// NOOT token contract address
const NOOT_TOKEN_ADDRESS = '0x85Ca16Fd0e81659e0b8Be337294149E722528731' as `0x${string}`;
// Game contract address that will receive the wagers
const GAME_CONTRACT_ADDRESS = '0x4a3d233114ED63B41e54c90E5F8A285C6D0DC907' as `0x${string}`;

// Maximum uint256 value for unlimited approvals
const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

export const useWalletActions = () => {
  const { walletState } = useWallet();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

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
    if (!address || !walletClient || !publicClient) {
      throw new Error('Wallet not connected');
    }

    try {
      // Use MAX_UINT256 for unlimited approval instead of a specific amount
      // This means the user only needs to approve once
      
      // Prepare the approve transaction
      const hash = await walletClient.writeContract({
        address: NOOT_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [GAME_CONTRACT_ADDRESS, MAX_UINT256],
      });
      
      console.log(`Approved maximum amount of NOOT tokens, transaction hash: ${hash}`);
      
      // Wait for transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction confirmed:', receipt);
      
      return hash;
    } catch (error) {
      console.error('Error approving NOOT tokens:', error);
      throw error;
    }
  }, [address, walletClient, publicClient]);

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

  // Transfer NOOT tokens when the user loses
  const transferNOOTOnLoss = useCallback(async (amount: string) => {
    if (!address || !walletClient || !publicClient) {
      throw new Error('Wallet not connected');
    }

    try {
      // Convert amount to bigint with 18 decimals
      const wagerBigInt = parseUnits(amount, 18);
      
      // Send tokens to the game contract
      const hash = await walletClient.writeContract({
        address: NOOT_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [GAME_CONTRACT_ADDRESS, wagerBigInt],
      });
      
      console.log(`Transferred ${amount} NOOT tokens to contract, transaction hash: ${hash}`);
      
      // Wait for transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction confirmed:', receipt);
      
      return hash;
    } catch (error) {
      console.error('Error transferring NOOT tokens:', error);
      throw error;
    }
  }, [address, walletClient, publicClient]);

  return {
    checkAllowance,
    approveNOOT,
    checkNOOTBalance,
    transferNOOTOnLoss,
    isConnected: walletState.isConnected,
    address: walletState.address,
    balance: walletState.balance,
  };
};

export default useWalletActions; 