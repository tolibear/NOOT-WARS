import { parseUnits, formatUnits } from 'viem';
import { updateTransactionHash } from './localStorage';

// NOOT token contract address
export const NOOT_TOKEN_ADDRESS = '0x85Ca16Fd0e81659e0b8Be337294149E722528731' as `0x${string}`;
// Game contract address that will receive the wagers
export const GAME_CONTRACT_ADDRESS = '0x4a3d233114ED63B41e54c90E5F8A285C6D0DC907' as `0x${string}`;

// ERC20 ABI for token interactions
export const ERC20_ABI = [
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

// Format a bigint token amount to a human-readable string
export const formatTokenAmount = (amount: bigint, decimals: number = 18): string => {
  return formatUnits(amount, decimals);
};

// Parse a human-readable string to a bigint token amount
export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  return parseUnits(amount as `${number}`, decimals);
};

// Record a transaction in local storage
export const recordTransaction = (txHash: string, result: 'win' | 'loss' | 'draw', wager: string): void => {
  updateTransactionHash(txHash);
};

// Game contract ABI (simplified mock for this implementation)
export const GAME_CONTRACT_ABI = [
  {
    inputs: [
      { name: 'result', type: 'uint8' }, // 0 = loss, 1 = win, 2 = draw
      { name: 'wagerAmount', type: 'uint256' },
    ],
    name: 'settleGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// Convert match result to uint8 for contract interaction
export const resultToUint8 = (result: 'win' | 'loss' | 'draw'): number => {
  switch (result) {
    case 'win':
      return 1;
    case 'loss':
      return 0;
    case 'draw':
      return 2;
    default:
      return 0; // Default to loss for safety
  }
}; 