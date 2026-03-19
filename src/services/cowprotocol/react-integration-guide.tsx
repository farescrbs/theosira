/**
 * Guide d'Intégration React pour CoW Protocol SDK
 * 
 * Ce fichier contient des exemples de hooks et composants React
 * pour intégrer le SDK CoW Protocol dans THESORIA
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { CowFlashLoanSDK, AaveFlashLoanType } from './index'
import {
  formatWeiAmount,
  parseToWei,
  calculateSlippage,
  validateFlashLoanParams,
  formatFeePercentage,
  shortenAddress,
} from './utils'
import type { SupportedChainId } from './types'

/**
 * Hook personnalisé pour le SDK CoW Protocol
 */
export function useCowFlashLoanSDK(config?: {
  preHookGasLimit?: bigint
  postHookGasLimit?: bigint
}) {
  const sdk = useMemo(() => {
    return new CowFlashLoanSDK(
      config
        ? {
            hooksGasLimit: {
              pre: config.preHookGasLimit || 300_000n,
              post: config.postHookGasLimit || 600_000n,
            },
          }
        : undefined
    )
  }, [config?.preHookGasLimit, config?.postHookGasLimit])

  return sdk
}

/**
 * Hook pour calculer les frais de flash loan
 */
export function useFlashLoanFees(sellAmount: string, decimals: number, flashLoanFeeBps: number) {
  const sdk = useCowFlashLoanSDK()

  return useMemo(() => {
    try {
      const amountWei = parseToWei(sellAmount, decimals)
      const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
        sellAmount: amountWei,
        flashLoanFeeBps,
      })

      return {
        feeAmount: formatWeiAmount(flashLoanFeeAmount, decimals),
        amountToSign: formatWeiAmount(sellAmountToSign, decimals),
        feePercentage: formatFeePercentage(flashLoanFeeBps),
        isValid: true,
        error: null,
      }
    } catch (error) {
      return {
        feeAmount: '0',
        amountToSign: '0',
        feePercentage: '0%',
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, [sellAmount, decimals, flashLoanFeeBps, sdk])
}

/**
 * Hook pour calculer le slippage
 */
export function useSlippageCalculation(amount: string, decimals: number, slippageBps: number) {
  return useMemo(() => {
    try {
      const amountWei = parseToWei(amount, decimals)
      const { minAmount, maxAmount } = calculateSlippage(amountWei, slippageBps)

      return {
        minAmount: formatWeiAmount(minAmount, decimals),
        maxAmount: formatWeiAmount(maxAmount, decimals),
        slippagePercentage: formatFeePercentage(slippageBps),
        isValid: true,
        error: null,
      }
    } catch (error) {
      return {
        minAmount: '0',
        maxAmount: '0',
        slippagePercentage: '0%',
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, [amount, decimals, slippageBps])
}

/**
 * Hook pour valider les paramètres de flash loan
 */
export function useFlashLoanValidation(params: {
  sellAmount: string
  decimals: number
  flashLoanFeeBps: number
  slippageBps: number
}) {
  return useMemo(() => {
    try {
      const amountWei = parseToWei(params.sellAmount, params.decimals)
      const validation = validateFlashLoanParams({
        sellAmount: amountWei,
        flashLoanFeeBps: params.flashLoanFeeBps,
        slippageBps: params.slippageBps,
      })

      return {
        isValid: validation.valid,
        errors: validation.errors,
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      }
    }
  }, [params])
}

/**
 * Composant d'exemple: Calculateur de Frais
 */
export function FlashLoanFeeCalculator() {
  const [amount, setAmount] = useState('1.0')
  const [feeBps, setFeeBps] = useState(5) // 0.05%
  const decimals = 18

  const fees = useFlashLoanFees(amount, decimals, feeBps)

  return (
    <div className="space-y-4 p-6 border border-[#d4af37]/20 bg-black/40">
      <h3 className="text-[#d4af37]">Flash Loan Fee Calculator</h3>

      <div className="space-y-2">
        <label className="block text-white/80">Loan Amount (ETH)</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          placeholder="1.0"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-white/80">Fee (bps)</label>
        <input
          type="number"
          value={feeBps}
          onChange={(e) => setFeeBps(Number(e.target.value))}
          className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          min="0"
          max="10000"
        />
        <span className="text-[#d4af37]/60 text-sm">{fees.feePercentage}</span>
      </div>

      {fees.isValid ? (
        <div className="space-y-2 pt-4 border-t border-[#d4af37]/20">
          <div className="flex justify-between text-white/80">
            <span>Fee Amount:</span>
            <span className="text-[#d4af37]">{fees.feeAmount} ETH</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Amount to Sign:</span>
            <span className="text-[#d4af37]">{fees.amountToSign} ETH</span>
          </div>
        </div>
      ) : (
        <div className="text-red-400 text-sm">{fees.error}</div>
      )}
    </div>
  )
}

/**
 * Composant d'exemple: Calculateur de Slippage
 */
export function SlippageCalculator() {
  const [amount, setAmount] = useState('1.0')
  const [slippageBps, setSlippageBps] = useState(50) // 0.5%
  const decimals = 18

  const slippage = useSlippageCalculation(amount, decimals, slippageBps)

  return (
    <div className="space-y-4 p-6 border border-[#d4af37]/20 bg-black/40">
      <h3 className="text-[#d4af37]">Slippage Calculator</h3>

      <div className="space-y-2">
        <label className="block text-white/80">Amount (ETH)</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          placeholder="1.0"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-white/80">Slippage (bps)</label>
        <input
          type="number"
          value={slippageBps}
          onChange={(e) => setSlippageBps(Number(e.target.value))}
          className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          min="0"
          max="10000"
        />
        <span className="text-[#d4af37]/60 text-sm">{slippage.slippagePercentage}</span>
      </div>

      {slippage.isValid ? (
        <div className="space-y-2 pt-4 border-t border-[#d4af37]/20">
          <div className="flex justify-between text-white/80">
            <span>Min Amount:</span>
            <span className="text-green-400">{slippage.minAmount} ETH</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Max Amount:</span>
            <span className="text-red-400">{slippage.maxAmount} ETH</span>
          </div>
        </div>
      ) : (
        <div className="text-red-400 text-sm">{slippage.error}</div>
      )}
    </div>
  )
}

/**
 * Composant d'exemple: Validation de Paramètres
 */
export function FlashLoanValidator() {
  const [sellAmount, setSellAmount] = useState('1.0')
  const [flashLoanFeeBps, setFlashLoanFeeBps] = useState(5)
  const [slippageBps, setSlippageBps] = useState(50)
  const decimals = 18

  const validation = useFlashLoanValidation({
    sellAmount,
    decimals,
    flashLoanFeeBps,
    slippageBps,
  })

  return (
    <div className="space-y-4 p-6 border border-[#d4af37]/20 bg-black/40">
      <h3 className="text-[#d4af37]">Parameter Validator</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-white/80 mb-2">Sell Amount</label>
          <input
            type="text"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          />
        </div>

        <div>
          <label className="block text-white/80 mb-2">Flash Loan Fee (bps)</label>
          <input
            type="number"
            value={flashLoanFeeBps}
            onChange={(e) => setFlashLoanFeeBps(Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          />
        </div>

        <div>
          <label className="block text-white/80 mb-2">Slippage (bps)</label>
          <input
            type="number"
            value={slippageBps}
            onChange={(e) => setSlippageBps(Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[#d4af37]/20">
        {validation.isValid ? (
          <div className="text-green-400 flex items-center gap-2">
            <span>✅</span>
            <span>All parameters are valid</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-red-400">❌ Validation errors:</div>
            {validation.errors.map((error, i) => (
              <div key={i} className="text-red-400/80 text-sm">
                • {error}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Composant d'exemple: Formulaire de Flash Loan Complet
 */
export function FlashLoanForm() {
  const sdk = useCowFlashLoanSDK()

  // State
  const [sellAmount, setSellAmount] = useState('1.0')
  const [sellToken, setSellToken] = useState('0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d')
  const [buyToken, setBuyToken] = useState('0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0')
  const [flashLoanFeeBps, setFlashLoanFeeBps] = useState(5)
  const [slippageBps, setSlippageBps] = useState(50)
  const [flashLoanType, setFlashLoanType] = useState<AaveFlashLoanType>(AaveFlashLoanType.CollateralSwap)
  const [chainId, setChainId] = useState<SupportedChainId>(100)

  const decimals = 18

  // Calculs
  const fees = useFlashLoanFees(sellAmount, decimals, flashLoanFeeBps)
  const slippage = useSlippageCalculation(sellAmount, decimals, slippageBps)
  const validation = useFlashLoanValidation({
    sellAmount,
    decimals,
    flashLoanFeeBps,
    slippageBps,
  })

  // Handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validation.isValid) {
        alert('Please fix validation errors')
        return
      }

      try {
        const amountWei = parseToWei(sellAmount, decimals)
        const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
          sellAmount: amountWei,
          flashLoanFeeBps,
        })

        console.log('Flash Loan Configuration:', {
          chainId,
          flashLoanType,
          sellToken,
          buyToken,
          sellAmount: formatWeiAmount(amountWei, decimals),
          feeAmount: formatWeiAmount(flashLoanFeeAmount, decimals),
          amountToSign: formatWeiAmount(sellAmountToSign, decimals),
        })

        // Ici, vous intégreriez l'appel réel au smart contract
        alert('Flash Loan configured! Check console for details.')
      } catch (error) {
        console.error('Error:', error)
        alert('Error configuring flash loan')
      }
    },
    [
      validation,
      sellAmount,
      decimals,
      sdk,
      flashLoanFeeBps,
      chainId,
      flashLoanType,
      sellToken,
      buyToken,
    ]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-[#d4af37]/20 bg-black/40">
      <h2 className="text-2xl text-[#d4af37]">Flash Loan Configuration</h2>

      {/* Chain Selection */}
      <div>
        <label className="block text-white/80 mb-2">Blockchain</label>
        <select
          value={chainId}
          onChange={(e) => setChainId(Number(e.target.value) as SupportedChainId)}
          className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
        >
          <option value={1}>Ethereum Mainnet</option>
          <option value={100}>Gnosis Chain</option>
          <option value={11155111}>Sepolia Testnet</option>
        </select>
      </div>

      {/* Flash Loan Type */}
      <div>
        <label className="block text-white/80 mb-2">Flash Loan Type</label>
        <select
          value={flashLoanType}
          onChange={(e) => setFlashLoanType(e.target.value as AaveFlashLoanType)}
          className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
        >
          <option value={AaveFlashLoanType.CollateralSwap}>Collateral Swap</option>
          <option value={AaveFlashLoanType.DebtSwap}>Debt Swap</option>
          <option value={AaveFlashLoanType.RepayCollateral}>Repay with Collateral</option>
        </select>
      </div>

      {/* Tokens */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 mb-2">Sell Token</label>
          <input
            type="text"
            value={sellToken}
            onChange={(e) => setSellToken(e.target.value)}
            className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white text-sm"
            placeholder="0x..."
          />
          <span className="text-[#d4af37]/60 text-xs">{shortenAddress(sellToken)}</span>
        </div>

        <div>
          <label className="block text-white/80 mb-2">Buy Token</label>
          <input
            type="text"
            value={buyToken}
            onChange={(e) => setBuyToken(e.target.value)}
            className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white text-sm"
            placeholder="0x..."
          />
          <span className="text-[#d4af37]/60 text-xs">{shortenAddress(buyToken)}</span>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-white/80 mb-2">Sell Amount</label>
        <input
          type="text"
          value={sellAmount}
          onChange={(e) => setSellAmount(e.target.value)}
          className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          placeholder="1.0"
        />
      </div>

      {/* Fees */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 mb-2">Flash Loan Fee (bps)</label>
          <input
            type="number"
            value={flashLoanFeeBps}
            onChange={(e) => setFlashLoanFeeBps(Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          />
          <span className="text-[#d4af37]/60 text-sm">{fees.feePercentage}</span>
        </div>

        <div>
          <label className="block text-white/80 mb-2">Slippage (bps)</label>
          <input
            type="number"
            value={slippageBps}
            onChange={(e) => setSlippageBps(Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/60 border border-[#d4af37]/30 text-white"
          />
          <span className="text-[#d4af37]/60 text-sm">{slippage.slippagePercentage}</span>
        </div>
      </div>

      {/* Summary */}
      {fees.isValid && slippage.isValid && (
        <div className="space-y-2 p-4 bg-black/60 border border-[#d4af37]/20">
          <h3 className="text-[#d4af37] mb-2">Summary</h3>
          <div className="flex justify-between text-sm text-white/80">
            <span>Fee Amount:</span>
            <span className="text-[#d4af37]">{fees.feeAmount}</span>
          </div>
          <div className="flex justify-between text-sm text-white/80">
            <span>Amount to Sign:</span>
            <span className="text-[#d4af37]">{fees.amountToSign}</span>
          </div>
          <div className="flex justify-between text-sm text-white/80">
            <span>Min Amount (after slippage):</span>
            <span className="text-green-400">{slippage.minAmount}</span>
          </div>
        </div>
      )}

      {/* Validation */}
      {!validation.isValid && (
        <div className="p-4 bg-red-500/10 border border-red-500/30">
          {validation.errors.map((error, i) => (
            <div key={i} className="text-red-400 text-sm">
              • {error}
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!validation.isValid}
        className="w-full px-6 py-3 bg-[#d4af37] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4af37]/90 transition-colors"
      >
        Configure Flash Loan
      </button>
    </form>
  )
}

/**
 * Export des composants et hooks
 */
export default {
  // Hooks
  useCowFlashLoanSDK,
  useFlashLoanFees,
  useSlippageCalculation,
  useFlashLoanValidation,

  // Composants
  FlashLoanFeeCalculator,
  SlippageCalculator,
  FlashLoanValidator,
  FlashLoanForm,
}
