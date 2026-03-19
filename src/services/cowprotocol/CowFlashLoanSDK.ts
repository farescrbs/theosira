/**
 * CoW Protocol Flash Loan SDK for Aave V3 Integration
 * 
 * This SDK provides a simplified interface for executing flash loan operations
 * using CoW Protocol and Aave V3. It handles collateral swaps, debt swaps,
 * and repayment with collateral.
 * 
 * @see https://docs.cow.fi/
 * @see https://docs.aave.com/developers/guides/flash-loans
 */

import {
  AccountAddress,
  CollateralOrderData,
  CollateralParameters,
  CollateralPermitData,
  CollateralSwapHooksGasLimit,
  CollateralSwapOrder,
  CollateralSwapParams,
  CollateralSwapPostParams,
  CollateralSwapQuoteParams,
  CollateralSwapTradeParams,
  EncodedOrder,
  FlashLoanHint,
  FlashLoanHookAmounts,
  OrderPostingResult,
  SupportedChainId,
  TransactionResponse,
} from './types'

import {
  AAVE_ADAPTER_FACTORY,
  AAVE_DAPP_ID_PER_TYPE,
  AAVE_HOOK_ADAPTER_PER_TYPE,
  AAVE_POOL_ADDRESS,
  AaveFlashLoanType,
  ADAPTER_DOMAIN_NAME,
  ADAPTER_DOMAIN_VERSION,
  ADAPTER_SIGNATURE_TYPES,
  DEFAULT_HOOK_GAS_LIMIT,
  DEFAULT_VALIDITY,
  EMPTY_PERMIT,
  HASH_ZERO,
  PERCENT_SCALE,
  ERC20_ALLOWANCE_ABI,
  ERC20_APPROVE_ABI,
  ZERO_ADDRESS,
} from './constants'

import {
  aaveAdapterFactoryAbi,
  collateralSwapAdapterHookAbi,
  debtSwapAdapterAbi,
  repayWithCollateralAdapterAbi,
} from './abi'

/**
 * Configuration options for the CowFlashLoanSDK
 */
export interface CowFlashLoanSDKConfig {
  hookAdapterPerType?: Record<AaveFlashLoanType, Record<SupportedChainId, string>>
  aaveAdapterFactory?: Record<SupportedChainId, string>
  aavePoolAddress?: Record<SupportedChainId, string>
  hooksGasLimit?: { pre: bigint; post: bigint }
}

/**
 * Main SDK class for CoW Protocol Flash Loans with Aave V3
 */
export class CowFlashLoanSDK {
  private readonly hookAdapterPerType: Record<AaveFlashLoanType, Record<SupportedChainId, string>>
  private readonly aaveAdapterFactory: Record<SupportedChainId, string>
  private readonly aavePoolAddress: Record<SupportedChainId, string>
  private readonly hooksGasLimit: { pre: bigint; post: bigint }

  constructor(config?: CowFlashLoanSDKConfig) {
    this.hookAdapterPerType = config?.hookAdapterPerType ?? AAVE_HOOK_ADAPTER_PER_TYPE
    this.aaveAdapterFactory = config?.aaveAdapterFactory ?? AAVE_ADAPTER_FACTORY
    this.aavePoolAddress = config?.aavePoolAddress ?? AAVE_POOL_ADDRESS
    this.hooksGasLimit = config?.hooksGasLimit ?? DEFAULT_HOOK_GAS_LIMIT
  }

  /**
   * Calculate flash loan fee amounts
   * 
   * Matches Aave's PercentageMath.percentMul() rounding behavior
   */
  calculateFlashLoanAmounts({
    sellAmount,
    flashLoanFeeBps,
  }: {
    sellAmount: bigint
    flashLoanFeeBps: number
  }): {
    flashLoanFeeAmount: bigint
    sellAmountToSign: bigint
  } {
    const bps = BigInt(Math.round(flashLoanFeeBps))
    const PERCENTAGE_FACTOR = BigInt(PERCENT_SCALE) // 10000

    // Calculate with Aave's formula
    const product = sellAmount * bps
    const quotient = product / PERCENTAGE_FACTOR
    const remainder = product % PERCENTAGE_FACTOR

    // Round up if remainder is present (ceil behavior for fees)
    const flashLoanFeeAmount = quotient + (remainder > 0n ? 1n : 0n)

    return {
      flashLoanFeeAmount,
      sellAmountToSign: sellAmount - flashLoanFeeAmount,
    }
  }

  /**
   * Build hook order data structure
   */
  buildHookOrderData(
    trader: AccountAddress,
    hookAmounts: FlashLoanHookAmounts,
    order: EncodedOrder,
  ): CollateralOrderData {
    const { sellToken, buyToken, sellAmount, buyAmount, kind, validTo } = order
    const parsedValidTo = typeof validTo === 'number' ? validTo : Number(validTo ?? 0)

    return {
      owner: trader,
      receiver: ZERO_ADDRESS,
      sellToken: String(sellToken),
      buyToken: String(buyToken),
      sellAmount: String(sellAmount),
      buyAmount: String(buyAmount),
      kind: String(kind),
      validTo: parsedValidTo,
      flashLoanAmount: hookAmounts.flashLoanAmount,
      flashLoanFeeAmount: hookAmounts.flashLoanFeeAmount,
      hookSellTokenAmount: hookAmounts.sellAssetAmount,
      hookBuyTokenAmount: hookAmounts.buyAssetAmount,
    }
  }

  /**
   * Get collateral swap post-hook call data
   */
  getCollateralSwapPostHookCallData(collateralPermit: CollateralPermitData = EMPTY_PERMIT): string {
    // This would normally use ethers or viem to encode the function call
    // For now, returning a placeholder that would be replaced with actual encoding
    return '0x' // Placeholder - needs actual ABI encoding
  }

  /**
   * Get debt swap post-hook call data
   */
  getDebtSwapPostHookCallData(collateralPermit: CollateralPermitData = EMPTY_PERMIT): string {
    return '0x' // Placeholder - needs actual ABI encoding
  }

  /**
   * Get repay post-hook call data
   */
  getRepayPostHookCallData(collateralPermit: CollateralPermitData = EMPTY_PERMIT): string {
    return '0x' // Placeholder - needs actual ABI encoding
  }

  /**
   * Get flash loan post hook based on type
   */
  getFlashLoanPostHook(flashLoanType: AaveFlashLoanType, collateralPermit?: CollateralPermitData): string {
    if (flashLoanType === AaveFlashLoanType.DebtSwap) {
      return this.getDebtSwapPostHookCallData(collateralPermit)
    }

    if (flashLoanType === AaveFlashLoanType.RepayCollateral) {
      return this.getRepayPostHookCallData(collateralPermit)
    }

    return this.getCollateralSwapPostHookCallData(collateralPermit)
  }

  /**
   * Get pre-hook call data for deploying and transferring flash loan
   */
  getPreHookCallData(
    flashLoanType: AaveFlashLoanType,
    chainId: SupportedChainId,
    trader: AccountAddress,
    hookAmounts: FlashLoanHookAmounts,
    order: EncodedOrder,
    instanceAddress: AccountAddress,
  ): string {
    const hookData = this.buildHookOrderData(trader, hookAmounts, order)
    const adapterImplementation = this.hookAdapterPerType[flashLoanType][chainId]

    // This would use actual ABI encoding
    return '0x' // Placeholder
  }

  /**
   * Get order hooks configuration
   */
  async getOrderHooks(
    flashLoanType: AaveFlashLoanType,
    chainId: SupportedChainId,
    trader: AccountAddress,
    expectedInstanceAddress: AccountAddress,
    hookAmounts: FlashLoanHookAmounts,
    order: EncodedOrder,
    collateralPermit?: CollateralPermitData,
    hooksGasLimit?: CollateralSwapHooksGasLimit,
  ): Promise<{
    pre: Array<{ target: string; callData: string; gasLimit: string; dappId: string }>
    post: Array<{ target: string; callData: string; gasLimit: string; dappId: string }>
  }> {
    const preHookCallData = this.getPreHookCallData(
      flashLoanType,
      chainId,
      trader,
      hookAmounts,
      order,
      expectedInstanceAddress,
    )
    const postHookCallData = this.getFlashLoanPostHook(flashLoanType, collateralPermit)
    const dappId = AAVE_DAPP_ID_PER_TYPE[flashLoanType]

    return {
      pre: [
        {
          target: this.aaveAdapterFactory[chainId],
          callData: preHookCallData,
          gasLimit: (hooksGasLimit?.preHookGasLimit ?? this.hooksGasLimit.pre).toString(),
          dappId,
        },
      ],
      post: [
        {
          target: expectedInstanceAddress,
          callData: postHookCallData,
          gasLimit: (hooksGasLimit?.postHookGasLimit ?? this.hooksGasLimit.post).toString(),
          dappId,
        },
      ],
    }
  }

  /**
   * Get flash loan hint metadata
   */
  getFlashLoanHint(
    chainId: SupportedChainId,
    amount: string,
    sellToken: string,
  ): FlashLoanHint {
    return {
      amount,
      receiver: this.aaveAdapterFactory[chainId],
      liquidityProvider: this.aavePoolAddress[chainId],
      protocolAdapter: this.aaveAdapterFactory[chainId],
      token: sellToken,
    }
  }

  /**
   * Export constants for external use
   */
  static get constants() {
    return {
      AAVE_POOL_ADDRESS,
      AAVE_ADAPTER_FACTORY,
      AAVE_HOOK_ADAPTER_PER_TYPE,
      AaveFlashLoanType,
      HASH_ZERO,
      EMPTY_PERMIT,
      DEFAULT_VALIDITY,
      ADAPTER_DOMAIN_NAME,
      ADAPTER_DOMAIN_VERSION,
    }
  }

  /**
   * Export ABIs for external use
   */
  static get abis() {
    return {
      aaveAdapterFactoryAbi,
      collateralSwapAdapterHookAbi,
      debtSwapAdapterAbi,
      repayWithCollateralAdapterAbi,
    }
  }
}

export default CowFlashLoanSDK
