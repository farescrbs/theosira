/**
 * CoW Protocol Flash Loans SDK - Main Export
 * 
 * This module provides a complete SDK for integrating CoW Protocol flash loans
 * with Aave V3 into your DeFi applications.
 * 
 * @example
 * ```typescript
 * import { CowFlashLoanSDK, AaveFlashLoanType } from './services/cowprotocol'
 * 
 * const sdk = new CowFlashLoanSDK()
 * const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
 *   sellAmount: BigInt('1000000000000000000'),
 *   flashLoanFeeBps: 5, // 0.05%
 * })
 * ```
 */

// Main SDK
export { CowFlashLoanSDK, type CowFlashLoanSDKConfig } from './CowFlashLoanSDK'

// Types
export type {
  SupportedChainId,
  Address,
  AccountAddress,
  FlashLoanHookAmounts,
  FlashLoanHint,
  CollateralOrderData,
  EncodedOrder,
  CollateralSwapHooksGasLimit,
  CollateralSwapParams,
  TradeParameters,
  CollateralSwapTradeParams,
  UnsignedOrder,
  CollateralSwapOrder,
  CollateralSwapQuoteParams,
  CollateralSwapPostParams,
  CollateralParameters,
  CollateralPermitData,
  OrderPostingResult,
  TransactionResponse,
} from './types'

// Constants
export {
  HASH_ZERO,
  AaveFlashLoanType,
  AAVE_POOL_ADDRESS,
  AAVE_ADAPTER_FACTORY,
  AAVE_HOOK_ADAPTER_PER_TYPE,
  DEFAULT_HOOK_GAS_LIMIT,
  PERCENT_SCALE,
  BASIS_POINTS_SCALE,
  HALF_BASIS_POINTS_SCALE,
  DEFAULT_VALIDITY,
  GAS_ESTIMATION_ADDITION_PERCENT,
  ADAPTER_DOMAIN_NAME,
  ADAPTER_DOMAIN_VERSION,
  ADAPTER_SIGNATURE_TYPES,
  EMPTY_PERMIT,
  AAVE_DAPP_ID_PER_TYPE,
  ERC20_ALLOWANCE_ABI,
  ERC20_APPROVE_ABI,
  ZERO_ADDRESS,
} from './constants'

// ABIs
export {
  aaveAdapterFactoryAbi,
  collateralSwapAdapterHookAbi,
  debtSwapAdapterAbi,
  repayWithCollateralAdapterAbi,
} from './abi'

// Default export
export { CowFlashLoanSDK as default } from './CowFlashLoanSDK'
