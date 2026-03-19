/**
 * CoW Protocol Flash Loans - Exemples Pratiques
 * 
 * Ce fichier contient des exemples d'utilisation du SDK pour différents cas d'usage
 */

import { CowFlashLoanSDK, AaveFlashLoanType } from './index'
import {
  formatWeiAmount,
  parseToWei,
  calculateSlippage,
  formatFeePercentage,
  getChainName,
  validateFlashLoanParams,
} from './utils'

/**
 * Exemple 1: Calculer les frais de flash loan
 */
export function calculateFlashLoanFees() {
  const sdk = new CowFlashLoanSDK()
  
  // Montant à emprunter: 100 ETH
  const sellAmount = parseToWei('100', 18)
  
  // Frais Aave: 0.05%
  const flashLoanFeeBps = 5
  
  const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
    sellAmount,
    flashLoanFeeBps,
  })
  
  console.log('=== Flash Loan Fee Calculation ===')
  console.log('Loan Amount:', formatWeiAmount(sellAmount, 18), 'ETH')
  console.log('Fee Rate:', formatFeePercentage(flashLoanFeeBps))
  console.log('Fee Amount:', formatWeiAmount(flashLoanFeeAmount, 18), 'ETH')
  console.log('Amount to Sign:', formatWeiAmount(sellAmountToSign, 18), 'ETH')
  
  return {
    loanAmount: sellAmount,
    feeAmount: flashLoanFeeAmount,
    amountToSign: sellAmountToSign,
  }
}

/**
 * Exemple 2: Calculer le slippage
 */
export function calculateSwapSlippage() {
  // Montant: 50 USDC
  const amount = parseToWei('50', 6) // USDC a 6 decimals
  
  // Slippage toléré: 0.5%
  const slippageBps = 50
  
  const { minAmount, maxAmount } = calculateSlippage(amount, slippageBps)
  
  console.log('=== Slippage Calculation ===')
  console.log('Original Amount:', formatWeiAmount(amount, 6), 'USDC')
  console.log('Slippage:', formatFeePercentage(slippageBps))
  console.log('Min Amount (after slippage):', formatWeiAmount(minAmount, 6), 'USDC')
  console.log('Max Amount (after slippage):', formatWeiAmount(maxAmount, 6), 'USDC')
  
  return { minAmount, maxAmount }
}

/**
 * Exemple 3: Valider les paramètres avant exécution
 */
export function validateBeforeExecution() {
  const params = {
    sellAmount: parseToWei('20', 18),
    flashLoanFeeBps: 5,
    slippageBps: 50,
  }
  
  const validation = validateFlashLoanParams(params)
  
  console.log('=== Parameter Validation ===')
  console.log('Sell Amount:', formatWeiAmount(params.sellAmount, 18), 'ETH')
  console.log('Flash Loan Fee:', formatFeePercentage(params.flashLoanFeeBps))
  console.log('Slippage:', formatFeePercentage(params.slippageBps))
  console.log('Valid:', validation.valid)
  
  if (!validation.valid) {
    console.log('Errors:', validation.errors)
  }
  
  return validation
}

/**
 * Exemple 4: Swap de collatéral WETH -> USDC sur Gnosis Chain
 */
export function collateralSwapExample() {
  const sdk = new CowFlashLoanSDK()
  
  // Configuration
  const chainId = 100 // Gnosis Chain
  const sellToken = '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d' // WXDAI
  const buyToken = '0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0' // USDC.e
  const collateralToken = '0xd0Dd6cEF72143E22cCED4867eb0d5F2328715533' // aGnoWXDAI
  
  // Montants
  const sellAmount = parseToWei('20', 18) // 20 WXDAI
  const flashLoanFeeBps = 5 // 0.05%
  const slippageBps = 80 // 0.8%
  
  // Calculer les frais
  const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
    sellAmount,
    flashLoanFeeBps,
  })
  
  // Calculer le slippage
  const { minAmount } = calculateSlippage(sellAmountToSign, slippageBps)
  
  console.log('=== Collateral Swap Configuration ===')
  console.log('Chain:', getChainName(chainId))
  console.log('Sell Token:', sellToken, '(WXDAI)')
  console.log('Buy Token:', buyToken, '(USDC.e)')
  console.log('Collateral Token:', collateralToken, '(aGnoWXDAI)')
  console.log('')
  console.log('Loan Amount:', formatWeiAmount(sellAmount, 18), 'WXDAI')
  console.log('Flash Loan Fee:', formatWeiAmount(flashLoanFeeAmount, 18), 'WXDAI')
  console.log('Amount to Sign:', formatWeiAmount(sellAmountToSign, 18), 'WXDAI')
  console.log('Min Amount (with slippage):', formatWeiAmount(minAmount, 18), 'WXDAI')
  
  // Construire les hook amounts
  const hookAmounts = {
    flashLoanAmount: sellAmount.toString(),
    flashLoanFeeAmount: flashLoanFeeAmount.toString(),
    sellAssetAmount: sellAmount.toString(),
    buyAssetAmount: '18000000', // Exemple: 18 USDC.e
  }
  
  // Obtenir le flash loan hint
  const flashLoanHint = sdk.getFlashLoanHint(
    chainId,
    sellAmount.toString(),
    sellToken
  )
  
  console.log('')
  console.log('Flash Loan Hint:', JSON.stringify(flashLoanHint, null, 2))
  
  return {
    chainId,
    sellToken,
    buyToken,
    collateralToken,
    sellAmount,
    flashLoanFeeAmount,
    sellAmountToSign,
    hookAmounts,
    flashLoanHint,
  }
}

/**
 * Exemple 5: Estimation du coût total
 */
export function estimateTotalCost() {
  const sdk = new CowFlashLoanSDK()
  
  // Paramètres
  const sellAmount = parseToWei('10', 18) // 10 ETH
  const flashLoanFeeBps = 5 // 0.05% Aave fee
  const protocolFeeBps = 10 // 0.1% CoW Protocol fee (exemple)
  
  // Calculer les frais de flash loan
  const { flashLoanFeeAmount } = sdk.calculateFlashLoanAmounts({
    sellAmount,
    flashLoanFeeBps,
  })
  
  // Calculer les frais de protocole
  const protocolFeeAmount = (sellAmount * BigInt(protocolFeeBps)) / 10000n
  
  // Total des frais
  const totalFees = flashLoanFeeAmount + protocolFeeAmount
  
  // Montant net reçu
  const netAmount = sellAmount - totalFees
  
  console.log('=== Total Cost Estimation ===')
  console.log('Loan Amount:', formatWeiAmount(sellAmount, 18), 'ETH')
  console.log('Flash Loan Fee:', formatWeiAmount(flashLoanFeeAmount, 18), 'ETH', `(${formatFeePercentage(flashLoanFeeBps)})`)
  console.log('Protocol Fee:', formatWeiAmount(protocolFeeAmount, 18), 'ETH', `(${formatFeePercentage(protocolFeeBps)})`)
  console.log('Total Fees:', formatWeiAmount(totalFees, 18), 'ETH')
  console.log('Net Amount:', formatWeiAmount(netAmount, 18), 'ETH')
  
  return {
    sellAmount,
    flashLoanFeeAmount,
    protocolFeeAmount,
    totalFees,
    netAmount,
  }
}

/**
 * Exemple 6: Configuration personnalisée du SDK
 */
export function customSDKConfiguration() {
  // Configuration avec limites de gas personnalisées
  const sdk = new CowFlashLoanSDK({
    hooksGasLimit: {
      pre: 500_000n,   // Plus de gas pour le pre-hook
      post: 800_000n,  // Plus de gas pour le post-hook
    }
  })
  
  console.log('=== Custom SDK Configuration ===')
  console.log('Pre-hook Gas Limit: 500,000')
  console.log('Post-hook Gas Limit: 800,000')
  
  return sdk
}

/**
 * Exemple 7: Scénario complet de swap
 */
export function completeSwapScenario() {
  console.log('\n')
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║  CoW Protocol Flash Loan - Complete Scenario  ║')
  console.log('╚════════════════════════════════════════════════╝')
  console.log('\n')
  
  // 1. Calculer les frais
  console.log('📊 Step 1: Calculate Flash Loan Fees')
  console.log('─'.repeat(50))
  const fees = calculateFlashLoanFees()
  console.log('\n')
  
  // 2. Calculer le slippage
  console.log('📉 Step 2: Calculate Slippage')
  console.log('─'.repeat(50))
  const slippage = calculateSwapSlippage()
  console.log('\n')
  
  // 3. Valider les paramètres
  console.log('✅ Step 3: Validate Parameters')
  console.log('─'.repeat(50))
  const validation = validateBeforeExecution()
  console.log('\n')
  
  // 4. Configuration du swap
  console.log('⚙️  Step 4: Configure Collateral Swap')
  console.log('─'.repeat(50))
  const swap = collateralSwapExample()
  console.log('\n')
  
  // 5. Estimation des coûts
  console.log('💰 Step 5: Estimate Total Cost')
  console.log('─'.repeat(50))
  const costs = estimateTotalCost()
  console.log('\n')
  
  console.log('✨ Scenario Complete!')
  
  return {
    fees,
    slippage,
    validation,
    swap,
    costs,
  }
}

/**
 * Exemple 8: Gestion des erreurs
 */
export function errorHandlingExample() {
  const sdk = new CowFlashLoanSDK()
  
  console.log('=== Error Handling Example ===')
  
  try {
    // Essayer avec un montant invalide
    const result = sdk.calculateFlashLoanAmounts({
      sellAmount: BigInt(0),
      flashLoanFeeBps: 5,
    })
    console.log('Result:', result)
  } catch (error) {
    console.log('Error caught:', error instanceof Error ? error.message : 'Unknown error')
  }
  
  try {
    // Essayer avec des frais invalides
    const validation = validateFlashLoanParams({
      sellAmount: parseToWei('10', 18),
      flashLoanFeeBps: -1, // Invalide
      slippageBps: 50,
    })
    
    if (!validation.valid) {
      console.log('Validation errors:', validation.errors)
    }
  } catch (error) {
    console.log('Error caught:', error instanceof Error ? error.message : 'Unknown error')
  }
}

// Exécuter tous les exemples si ce fichier est exécuté directement
if (require.main === module) {
  completeSwapScenario()
}
