/**
 * Utility functions for CoW Protocol Flash Loans
 */

import { Address, SupportedChainId } from './types'
import { AAVE_POOL_ADDRESS, AAVE_ADAPTER_FACTORY, AaveFlashLoanType, AAVE_HOOK_ADAPTER_PER_TYPE } from './constants'

/**
 * Check if a chain ID is supported
 */
export function isSupportedChainId(chainId: number): chainId is SupportedChainId {
  return chainId === 1 || chainId === 100 || chainId === 11155111
}

/**
 * Get the Aave pool address for a given chain
 */
export function getAavePoolAddress(chainId: SupportedChainId): string {
  const address = AAVE_POOL_ADDRESS[chainId]
  if (!address || address === '') {
    throw new Error(`Aave pool address not available for chain ID ${chainId}`)
  }
  return address
}

/**
 * Get the Aave adapter factory address for a given chain
 */
export function getAaveAdapterFactory(chainId: SupportedChainId): string {
  const address = AAVE_ADAPTER_FACTORY[chainId]
  if (!address) {
    throw new Error(`Aave adapter factory not available for chain ID ${chainId}`)
  }
  return address
}

/**
 * Get the hook adapter address for a specific flash loan type and chain
 */
export function getHookAdapterAddress(flashLoanType: AaveFlashLoanType, chainId: SupportedChainId): string {
  const address = AAVE_HOOK_ADAPTER_PER_TYPE[flashLoanType][chainId]
  if (!address) {
    throw new Error(`Hook adapter not available for ${flashLoanType} on chain ID ${chainId}`)
  }
  return address
}

/**
 * Format wei amount to human-readable string
 */
export function formatWeiAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals)
  const integerPart = amount / divisor
  const fractionalPart = amount % divisor
  
  if (fractionalPart === 0n) {
    return integerPart.toString()
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmed = fractionalStr.replace(/0+$/, '')
  
  return `${integerPart}.${trimmed}`
}

/**
 * Parse human-readable amount to wei
 */
export function parseToWei(amount: string, decimals: number = 18): bigint {
  const parts = amount.split('.')
  const integerPart = parts[0] || '0'
  const fractionalPart = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals)
  
  const weiString = integerPart + fractionalPart
  return BigInt(weiString)
}

/**
 * Calculate percentage of an amount
 */
export function calculatePercentage(amount: bigint, percentageBps: number): bigint {
  return (amount * BigInt(percentageBps)) / 10000n
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Get chain name from chain ID
 */
export function getChainName(chainId: SupportedChainId): string {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet'
    case 100:
      return 'Gnosis Chain'
    case 11155111:
      return 'Sepolia Testnet'
    default:
      return `Chain ${chainId}`
  }
}

/**
 * Format flash loan fee as percentage string
 */
export function formatFeePercentage(feeBps: number): string {
  return `${(feeBps / 100).toFixed(2)}%`
}

/**
 * Calculate slippage amount
 */
export function calculateSlippage(amount: bigint, slippageBps: number): {
  minAmount: bigint
  maxAmount: bigint
} {
  const slippageAmount = calculatePercentage(amount, slippageBps)
  return {
    minAmount: amount - slippageAmount,
    maxAmount: amount + slippageAmount,
  }
}

/**
 * Estimate gas cost in native token
 */
export function estimateGasCost(gasLimit: bigint, gasPrice: bigint): bigint {
  return gasLimit * gasPrice
}

/**
 * Convert basis points to percentage
 */
export function bpsToPercentage(bps: number): number {
  return bps / 100
}

/**
 * Convert percentage to basis points
 */
export function percentageToBps(percentage: number): number {
  return Math.round(percentage * 100)
}

/**
 * Shorten address for display (0x1234...5678)
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!isValidAddress(address)) return address
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

/**
 * Check if order is expired
 */
export function isOrderExpired(validTo: number): boolean {
  return Date.now() / 1000 > validTo
}

/**
 * Calculate time until expiration
 */
export function getTimeUntilExpiration(validTo: number): {
  isExpired: boolean
  secondsRemaining: number
  minutesRemaining: number
} {
  const now = Date.now() / 1000
  const secondsRemaining = Math.max(0, validTo - now)
  
  return {
    isExpired: secondsRemaining === 0,
    secondsRemaining: Math.floor(secondsRemaining),
    minutesRemaining: Math.floor(secondsRemaining / 60),
  }
}

/**
 * Safely parse bigint from string
 */
export function safeParseBigInt(value: string): bigint | null {
  try {
    return BigInt(value)
  } catch {
    return null
  }
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

/**
 * Validate flash loan parameters
 */
export function validateFlashLoanParams(params: {
  sellAmount: bigint
  flashLoanFeeBps: number
  slippageBps: number
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (params.sellAmount <= 0n) {
    errors.push('Sell amount must be greater than zero')
  }
  
  if (params.flashLoanFeeBps < 0 || params.flashLoanFeeBps > 10000) {
    errors.push('Flash loan fee must be between 0 and 100%')
  }
  
  if (params.slippageBps < 0 || params.slippageBps > 10000) {
    errors.push('Slippage must be between 0 and 100%')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
