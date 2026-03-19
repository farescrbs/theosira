/**
 * Types for CoW Protocol Flash Loans integration
 */

export type SupportedChainId = 1 | 100 | 11155111 // Mainnet, Gnosis Chain, Sepolia

export type Address = `0x${string}`
export type AccountAddress = Address

export interface FlashLoanHookAmounts {
  flashLoanAmount: string
  flashLoanFeeAmount: string
  sellAssetAmount: string
  buyAssetAmount: string
}

export interface FlashLoanHint {
  amount: string
  receiver: string
  liquidityProvider: string
  protocolAdapter: string
  token: string
}

export interface CollateralOrderData {
  owner: string
  receiver: string
  sellToken: string
  buyToken: string
  sellAmount: string
  buyAmount: string
  kind: string
  validTo: number
  flashLoanAmount: string
  flashLoanFeeAmount: string
  hookSellTokenAmount: string
  hookBuyTokenAmount: string
}

export type EncodedOrder = Record<string, string | number>

export interface CollateralSwapHooksGasLimit {
  preHookGasLimit?: bigint
  postHookGasLimit?: bigint
}

export interface CollateralSwapParams {
  chainId: SupportedChainId
  tradeParameters: TradeParameters
  collateralToken: Address
  flashLoanFeePercent?: number
  settings?: {
    preventApproval?: boolean
    collateralPermit?: CollateralPermitData
    hooksGasLimit?: CollateralSwapHooksGasLimit
  }
}

export interface TradeParameters {
  sellToken: Address
  sellTokenDecimals: number
  buyToken: Address
  buyTokenDecimals: number
  amount: string
  kind: 'sell' | 'buy'
  validFor?: number
  validTo?: number
  slippageBps: number
  owner?: AccountAddress
}

export interface CollateralSwapTradeParams {
  chainId: SupportedChainId
  validTo: number
  owner: AccountAddress
  flashLoanFeeAmount: bigint
  hooksGasLimit?: CollateralSwapHooksGasLimit
}

export interface UnsignedOrder {
  sellToken: Address
  buyToken: Address
  receiver: Address
  sellAmount: string
  buyAmount: string
  validTo: number
  appData: string
  feeAmount: string
  kind: 'sell' | 'buy'
  partiallyFillable: boolean
}

export interface CollateralSwapOrder {
  sellAmount: bigint
  buyAmount: bigint | string
  orderToSign: UnsignedOrder
  collateralPermit?: CollateralPermitData
}

export interface CollateralSwapQuoteParams extends Omit<TradeParameters, 'owner' | 'validTo'>, CollateralSwapTradeParams {
  flashLoanFeeAmount: bigint
}

export interface CollateralSwapPostParams {
  swapSettings: any // SwapAdvancedSettings from @cowprotocol/sdk-trading
  instanceAddress: AccountAddress
}

export interface CollateralParameters {
  trader: AccountAddress
  collateralToken: string
  amount: bigint
  instanceAddress: AccountAddress
}

export interface CollateralPermitData {
  amount: string
  deadline: number
  v: number
  r: string
  s: string
}

export interface OrderPostingResult {
  orderId: string
}

export interface TransactionResponse {
  hash: string
  wait?: () => Promise<any>
}
