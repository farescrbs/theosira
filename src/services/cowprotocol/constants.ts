/**
 * Constants for CoW Protocol Flash Loans integration with Aave V3
 */

import { SupportedChainId, CollateralPermitData } from './types'

export const HASH_ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000'

export enum AaveFlashLoanType {
  CollateralSwap = 'CollateralSwap',
  DebtSwap = 'DebtSwap',
  RepayCollateral = 'RepayCollateral',
}

// Aave V3 Pool addresses per chain
// See https://aave.com/docs/resources/addresses
export const AAVE_POOL_ADDRESS: Record<SupportedChainId, string> = {
  [1]: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', // Mainnet
  [100]: '0xb50201558B00496A145fE76f7424749556E326D8', // Gnosis Chain
  [11155111]: '', // Sepolia
}

// CoW Protocol Aave Adapter Factory addresses
export const AAVE_ADAPTER_FACTORY: Record<SupportedChainId, string> = {
  [1]: '0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927',
  [100]: '0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927',
  [11155111]: '0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927',
}

// Hook adapter addresses per flash loan type
const AAVE_COLLATERAL_SWAP_ADAPTER_HOOK: Record<SupportedChainId, string> = {
  [1]: '0x29A9b0a13c81d59f13BA0f39DBDCAA1AB2adc95F',
  [100]: '0x29A9b0a13c81d59f13BA0f39DBDCAA1AB2adc95F',
  [11155111]: '0x29A9b0a13c81d59f13BA0f39DBDCAA1AB2adc95F',
}

const AAVE_DEBT_SWAP_ADAPTER_HOOK: Record<SupportedChainId, string> = {
  [1]: '0xbE9A121bb958BBBb027dA728DEC0D5496811b7d1',
  [100]: '0xbE9A121bb958BBBb027dA728DEC0D5496811b7d1',
  [11155111]: '0xbE9A121bb958BBBb027dA728DEC0D5496811b7d1',
}

const AAVE_REPAY_COLLATERAL_ADAPTER_HOOK: Record<SupportedChainId, string> = {
  [1]: '0x8e25d1210FabB0fcAdE92a82C4a89568B4b10E0F',
  [100]: '0x8e25d1210FabB0fcAdE92a82C4a89568B4b10E0F',
  [11155111]: '0x8e25d1210FabB0fcAdE92a82C4a89568B4b10E0F',
}

export const AAVE_HOOK_ADAPTER_PER_TYPE: Record<AaveFlashLoanType, Record<SupportedChainId, string>> = {
  [AaveFlashLoanType.CollateralSwap]: AAVE_COLLATERAL_SWAP_ADAPTER_HOOK,
  [AaveFlashLoanType.DebtSwap]: AAVE_DEBT_SWAP_ADAPTER_HOOK,
  [AaveFlashLoanType.RepayCollateral]: AAVE_REPAY_COLLATERAL_ADAPTER_HOOK,
}

export const DEFAULT_HOOK_GAS_LIMIT = {
  pre: 300_000n,
  post: 600_000n,
}

export const PERCENT_SCALE = 10_000

// Constants for flash loan fee calculation matching Aave's PercentageMath.percentMul()
export const BASIS_POINTS_SCALE = BigInt(100 * PERCENT_SCALE) // 1_000_000
export const HALF_BASIS_POINTS_SCALE = BASIS_POINTS_SCALE / 2n // 500_000

export const DEFAULT_VALIDITY = 10 * 60 // 10 min

export const GAS_ESTIMATION_ADDITION_PERCENT = 10 // 10%

export const ADAPTER_DOMAIN_NAME = 'AaveV3AdapterFactory'
export const ADAPTER_DOMAIN_VERSION = '1'

export const ADAPTER_SIGNATURE_TYPES = {
  AdapterOrderSig: [
    { name: 'instance', type: 'address' },
    { name: 'sellToken', type: 'address' },
    { name: 'buyToken', type: 'address' },
    { name: 'sellAmount', type: 'uint256' },
    { name: 'buyAmount', type: 'uint256' },
    { name: 'kind', type: 'bytes32' },
    { name: 'validTo', type: 'uint32' },
    { name: 'appData', type: 'bytes32' },
  ],
}

export const EMPTY_PERMIT: CollateralPermitData = {
  amount: '0',
  deadline: 0,
  v: 0,
  r: HASH_ZERO,
  s: HASH_ZERO,
}

export const AAVE_DAPP_ID_PER_TYPE: Record<AaveFlashLoanType, string> = {
  [AaveFlashLoanType.CollateralSwap]: 'cow-sdk://flashloans/aave/v3/collateral-swap',
  [AaveFlashLoanType.DebtSwap]: 'cow-sdk://flashloans/aave/v3/debt-swap',
  [AaveFlashLoanType.RepayCollateral]: 'cow-sdk://flashloans/aave/v3/repay-with-collateral',
}

// ERC20 ABIs for allowance and approve
export const ERC20_ALLOWANCE_ABI = [
  {
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const

export const ERC20_APPROVE_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
