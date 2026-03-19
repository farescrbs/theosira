/**
 * Tests unitaires pour CoW Protocol Flash Loans SDK
 * 
 * Ces tests vérifient le bon fonctionnement du SDK
 */

import { CowFlashLoanSDK, AaveFlashLoanType } from './CowFlashLoanSDK'
import {
  formatWeiAmount,
  parseToWei,
  calculateSlippage,
  isValidAddress,
  validateFlashLoanParams,
  bpsToPercentage,
  percentageToBps,
  shortenAddress,
  safeParseBigInt,
} from './utils'
import { PERCENT_SCALE, HASH_ZERO, EMPTY_PERMIT } from './constants'

/**
 * Test Suite 1: SDK Initialization
 */
export function testSDKInitialization() {
  console.log('🧪 Test Suite 1: SDK Initialization')
  console.log('─'.repeat(50))
  
  try {
    // Test 1.1: Default configuration
    const sdk1 = new CowFlashLoanSDK()
    console.log('✅ Test 1.1: Default SDK initialization - PASSED')
    
    // Test 1.2: Custom configuration
    const sdk2 = new CowFlashLoanSDK({
      hooksGasLimit: {
        pre: 500_000n,
        post: 800_000n,
      }
    })
    console.log('✅ Test 1.2: Custom SDK initialization - PASSED')
    
    return true
  } catch (error) {
    console.log('❌ SDK Initialization tests - FAILED:', error)
    return false
  }
}

/**
 * Test Suite 2: Flash Loan Fee Calculation
 */
export function testFlashLoanFeeCalculation() {
  console.log('\n🧪 Test Suite 2: Flash Loan Fee Calculation')
  console.log('─'.repeat(50))
  
  const sdk = new CowFlashLoanSDK()
  let allPassed = true
  
  // Test 2.1: Standard fee (0.05%)
  try {
    const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
      sellAmount: BigInt('1000000000000000000'), // 1 ETH
      flashLoanFeeBps: 5, // 0.05%
    })
    
    const expectedFee = BigInt('500000000000000') // 0.0005 ETH
    const expectedAmount = BigInt('999500000000000000') // 0.9995 ETH
    
    if (flashLoanFeeAmount === expectedFee && sellAmountToSign === expectedAmount) {
      console.log('✅ Test 2.1: Standard fee calculation - PASSED')
    } else {
      console.log('❌ Test 2.1: Standard fee calculation - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 2.1: Standard fee calculation - FAILED:', error)
    allPassed = false
  }
  
  // Test 2.2: Zero fee
  try {
    const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
      sellAmount: BigInt('1000000000000000000'),
      flashLoanFeeBps: 0,
    })
    
    if (flashLoanFeeAmount === 0n && sellAmountToSign === BigInt('1000000000000000000')) {
      console.log('✅ Test 2.2: Zero fee calculation - PASSED')
    } else {
      console.log('❌ Test 2.2: Zero fee calculation - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 2.2: Zero fee calculation - FAILED:', error)
    allPassed = false
  }
  
  // Test 2.3: Large amount
  try {
    const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
      sellAmount: BigInt('100000000000000000000'), // 100 ETH
      flashLoanFeeBps: 5,
    })
    
    const expectedFee = BigInt('50000000000000000') // 0.05 ETH
    
    if (flashLoanFeeAmount === expectedFee) {
      console.log('✅ Test 2.3: Large amount calculation - PASSED')
    } else {
      console.log('❌ Test 2.3: Large amount calculation - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 2.3: Large amount calculation - FAILED:', error)
    allPassed = false
  }
  
  return allPassed
}

/**
 * Test Suite 3: Utility Functions
 */
export function testUtilityFunctions() {
  console.log('\n🧪 Test Suite 3: Utility Functions')
  console.log('─'.repeat(50))
  
  let allPassed = true
  
  // Test 3.1: formatWeiAmount
  try {
    const formatted = formatWeiAmount(BigInt('1500000000000000000'), 18)
    if (formatted === '1.5') {
      console.log('✅ Test 3.1: formatWeiAmount - PASSED')
    } else {
      console.log('❌ Test 3.1: formatWeiAmount - FAILED (expected "1.5", got "' + formatted + '")')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 3.1: formatWeiAmount - FAILED:', error)
    allPassed = false
  }
  
  // Test 3.2: parseToWei
  try {
    const wei = parseToWei('1.5', 18)
    if (wei === BigInt('1500000000000000000')) {
      console.log('✅ Test 3.2: parseToWei - PASSED')
    } else {
      console.log('❌ Test 3.2: parseToWei - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 3.2: parseToWei - FAILED:', error)
    allPassed = false
  }
  
  // Test 3.3: calculateSlippage
  try {
    const { minAmount, maxAmount } = calculateSlippage(
      BigInt('1000000000000000000'),
      50 // 0.5%
    )
    
    const expectedMin = BigInt('995000000000000000')
    const expectedMax = BigInt('1005000000000000000')
    
    if (minAmount === expectedMin && maxAmount === expectedMax) {
      console.log('✅ Test 3.3: calculateSlippage - PASSED')
    } else {
      console.log('❌ Test 3.3: calculateSlippage - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 3.3: calculateSlippage - FAILED:', error)
    allPassed = false
  }
  
  // Test 3.4: isValidAddress
  try {
    const valid = isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
    const invalid = isValidAddress('invalid')
    
    if (valid && !invalid) {
      console.log('✅ Test 3.4: isValidAddress - PASSED')
    } else {
      console.log('❌ Test 3.4: isValidAddress - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 3.4: isValidAddress - FAILED:', error)
    allPassed = false
  }
  
  // Test 3.5: bpsToPercentage / percentageToBps
  try {
    const percentage = bpsToPercentage(50)
    const bps = percentageToBps(0.5)
    
    if (percentage === 0.5 && bps === 50) {
      console.log('✅ Test 3.5: bpsToPercentage/percentageToBps - PASSED')
    } else {
      console.log('❌ Test 3.5: bpsToPercentage/percentageToBps - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 3.5: bpsToPercentage/percentageToBps - FAILED:', error)
    allPassed = false
  }
  
  // Test 3.6: shortenAddress
  try {
    const shortened = shortenAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
    if (shortened === '0x742d...0bEb') {
      console.log('✅ Test 3.6: shortenAddress - PASSED')
    } else {
      console.log('❌ Test 3.6: shortenAddress - FAILED (got "' + shortened + '")')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 3.6: shortenAddress - FAILED:', error)
    allPassed = false
  }
  
  // Test 3.7: safeParseBigInt
  try {
    const valid = safeParseBigInt('1000000000000000000')
    const invalid = safeParseBigInt('invalid')
    
    if (valid === BigInt('1000000000000000000') && invalid === null) {
      console.log('✅ Test 3.7: safeParseBigInt - PASSED')
    } else {
      console.log('❌ Test 3.7: safeParseBigInt - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 3.7: safeParseBigInt - FAILED:', error)
    allPassed = false
  }
  
  return allPassed
}

/**
 * Test Suite 4: Parameter Validation
 */
export function testParameterValidation() {
  console.log('\n🧪 Test Suite 4: Parameter Validation')
  console.log('─'.repeat(50))
  
  let allPassed = true
  
  // Test 4.1: Valid parameters
  try {
    const validation = validateFlashLoanParams({
      sellAmount: BigInt('1000000000000000000'),
      flashLoanFeeBps: 5,
      slippageBps: 50,
    })
    
    if (validation.valid && validation.errors.length === 0) {
      console.log('✅ Test 4.1: Valid parameters - PASSED')
    } else {
      console.log('❌ Test 4.1: Valid parameters - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 4.1: Valid parameters - FAILED:', error)
    allPassed = false
  }
  
  // Test 4.2: Invalid sell amount
  try {
    const validation = validateFlashLoanParams({
      sellAmount: BigInt(0),
      flashLoanFeeBps: 5,
      slippageBps: 50,
    })
    
    if (!validation.valid && validation.errors.length > 0) {
      console.log('✅ Test 4.2: Invalid sell amount - PASSED')
    } else {
      console.log('❌ Test 4.2: Invalid sell amount - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 4.2: Invalid sell amount - FAILED:', error)
    allPassed = false
  }
  
  // Test 4.3: Invalid fee
  try {
    const validation = validateFlashLoanParams({
      sellAmount: BigInt('1000000000000000000'),
      flashLoanFeeBps: -1,
      slippageBps: 50,
    })
    
    if (!validation.valid && validation.errors.length > 0) {
      console.log('✅ Test 4.3: Invalid fee - PASSED')
    } else {
      console.log('❌ Test 4.3: Invalid fee - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 4.3: Invalid fee - FAILED:', error)
    allPassed = false
  }
  
  return allPassed
}

/**
 * Test Suite 5: Constants
 */
export function testConstants() {
  console.log('\n🧪 Test Suite 5: Constants')
  console.log('─'.repeat(50))
  
  let allPassed = true
  
  // Test 5.1: PERCENT_SCALE
  try {
    if (PERCENT_SCALE === 10_000) {
      console.log('✅ Test 5.1: PERCENT_SCALE - PASSED')
    } else {
      console.log('❌ Test 5.1: PERCENT_SCALE - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 5.1: PERCENT_SCALE - FAILED:', error)
    allPassed = false
  }
  
  // Test 5.2: HASH_ZERO
  try {
    if (HASH_ZERO === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      console.log('✅ Test 5.2: HASH_ZERO - PASSED')
    } else {
      console.log('❌ Test 5.2: HASH_ZERO - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 5.2: HASH_ZERO - FAILED:', error)
    allPassed = false
  }
  
  // Test 5.3: EMPTY_PERMIT
  try {
    if (
      EMPTY_PERMIT.amount === '0' &&
      EMPTY_PERMIT.deadline === 0 &&
      EMPTY_PERMIT.v === 0 &&
      EMPTY_PERMIT.r === HASH_ZERO &&
      EMPTY_PERMIT.s === HASH_ZERO
    ) {
      console.log('✅ Test 5.3: EMPTY_PERMIT - PASSED')
    } else {
      console.log('❌ Test 5.3: EMPTY_PERMIT - FAILED')
      allPassed = false
    }
  } catch (error) {
    console.log('❌ Test 5.3: EMPTY_PERMIT - FAILED:', error)
    allPassed = false
  }
  
  return allPassed
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('\n')
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║   CoW Protocol Flash Loans SDK - Test Suite   ║')
  console.log('╚════════════════════════════════════════════════╝')
  console.log('\n')
  
  const results = {
    initialization: testSDKInitialization(),
    feeCalculation: testFlashLoanFeeCalculation(),
    utilities: testUtilityFunctions(),
    validation: testParameterValidation(),
    constants: testConstants(),
  }
  
  console.log('\n')
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║              Test Results Summary              ║')
  console.log('╚════════════════════════════════════════════════╝')
  console.log('\n')
  
  console.log('SDK Initialization:', results.initialization ? '✅ PASSED' : '❌ FAILED')
  console.log('Fee Calculation:', results.feeCalculation ? '✅ PASSED' : '❌ FAILED')
  console.log('Utility Functions:', results.utilities ? '✅ PASSED' : '❌ FAILED')
  console.log('Parameter Validation:', results.validation ? '✅ PASSED' : '❌ FAILED')
  console.log('Constants:', results.constants ? '✅ PASSED' : '❌ FAILED')
  
  const allPassed = Object.values(results).every(r => r === true)
  
  console.log('\n')
  if (allPassed) {
    console.log('🎉 All tests passed!')
  } else {
    console.log('⚠️  Some tests failed. Please check the details above.')
  }
  console.log('\n')
  
  return allPassed
}

// Exécuter tous les tests si ce fichier est exécuté directement
if (require.main === module) {
  runAllTests()
}
