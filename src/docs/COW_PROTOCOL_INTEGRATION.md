# Intégration CoW Protocol - Guide Complet

## 🎯 Objectif

Ce document explique l'intégration complète du SDK CoW Protocol dans THESORIA pour les flash loans Aave V3.

## 📁 Structure du Projet

```
/services/cowprotocol/
├── abi/                                  # ABIs des contrats Aave V3
│   ├── AaveAdapterFactory.ts            # Factory pour créer des adapters
│   ├── CollateralSwapAdapterHook.ts     # Hooks pour swap de collatéral
│   ├── DebtSwapAdapter.ts               # Adapter pour swap de dette
│   ├── RepayWithCollateralAdapter.ts    # Adapter pour remboursement
│   └── index.ts                         # Export centralisé
│
├── CowFlashLoanSDK.ts                   # SDK principal
├── constants.ts                          # Constantes et configurations
├── types.ts                              # Types TypeScript
├── utils.ts                              # Fonctions utilitaires
├── examples.ts                           # Exemples d'utilisation
├── tests.ts                              # Tests unitaires
├── index.ts                              # Point d'entrée principal
└── README.md                             # Documentation du module
```

## 🚀 Installation et Configuration

### 1. Import du SDK

```typescript
import { 
  CowFlashLoanSDK, 
  AaveFlashLoanType,
  formatWeiAmount,
  calculateSlippage 
} from './services/cowprotocol'
```

### 2. Initialisation

```typescript
// Configuration par défaut
const sdk = new CowFlashLoanSDK()

// Configuration personnalisée
const customSdk = new CowFlashLoanSDK({
  hooksGasLimit: {
    pre: 500_000n,
    post: 800_000n,
  }
})
```

## 🔧 Fonctionnalités Principales

### 1. Calcul des Frais de Flash Loan

```typescript
const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount: BigInt('1000000000000000000'), // 1 ETH
  flashLoanFeeBps: 5, // 0.05% (frais standard Aave)
})

console.log('Fee:', formatWeiAmount(flashLoanFeeAmount, 18), 'ETH')
// Output: "0.0005 ETH"

console.log('Amount to sign:', formatWeiAmount(sellAmountToSign, 18), 'ETH')
// Output: "0.9995 ETH"
```

### 2. Gestion du Slippage

```typescript
const { minAmount, maxAmount } = calculateSlippage(
  BigInt('1000000000000000000'), // 1 ETH
  50 // 0.5%
)

console.log('Min:', formatWeiAmount(minAmount, 18), 'ETH') // "0.995 ETH"
console.log('Max:', formatWeiAmount(maxAmount, 18), 'ETH') // "1.005 ETH"
```

### 3. Construction des Hooks

```typescript
const hookAmounts = {
  flashLoanAmount: '1000000000000000000',
  flashLoanFeeAmount: '500000000000000',
  sellAssetAmount: '1000000000000000000',
  buyAssetAmount: '2000000000',
}

const encodedOrder = {
  sellToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
  buyToken: '0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0',  // USDC.e
  sellAmount: '1000000000000000000',
  buyAmount: '2000000000',
  kind: 'sell',
  validTo: 1234567890,
}

const orderData = sdk.buildHookOrderData(
  '0x...', // trader address
  hookAmounts,
  encodedOrder
)
```

### 4. Flash Loan Hint

```typescript
const flashLoanHint = sdk.getFlashLoanHint(
  100, // Gnosis Chain
  '1000000000000000000', // 1 WXDAI
  '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d' // WXDAI address
)

console.log(flashLoanHint)
// {
//   amount: "1000000000000000000",
//   receiver: "0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927",
//   liquidityProvider: "0xb50201558B00496A145fE76f7424749556E326D8",
//   protocolAdapter: "0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927",
//   token: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"
// }
```

## 💡 Cas d'Usage

### Cas 1: Swap de Collatéral WETH → USDC

```typescript
import { CowFlashLoanSDK, AaveFlashLoanType } from './services/cowprotocol'
import { parseToWei, formatWeiAmount } from './services/cowprotocol/utils'

const sdk = new CowFlashLoanSDK()

// Configuration
const sellAmount = parseToWei('20', 18) // 20 WETH
const flashLoanFeeBps = 5 // 0.05%
const slippageBps = 80 // 0.8%

// Calculer les frais
const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount,
  flashLoanFeeBps,
})

console.log('Loan Amount:', formatWeiAmount(sellAmount, 18), 'WETH')
console.log('Flash Loan Fee:', formatWeiAmount(flashLoanFeeAmount, 18), 'WETH')
console.log('Amount to Sign:', formatWeiAmount(sellAmountToSign, 18), 'WETH')
```

### Cas 2: Arbitrage DEX

```typescript
import { CowFlashLoanSDK } from './services/cowprotocol'
import { calculateSlippage, formatWeiAmount } from './services/cowprotocol/utils'

const sdk = new CowFlashLoanSDK()

// Montant à emprunter pour l'arbitrage
const loanAmount = BigInt('100000000000000000000') // 100 ETH
const feeBps = 5

// Calculer les frais
const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount: loanAmount,
  flashLoanFeeBps: feeBps,
})

// Calculer le profit minimum requis
const totalCost = flashLoanFeeAmount
const minimumProfit = totalCost * 2n // 2x les frais pour être profitable

console.log('Total Cost:', formatWeiAmount(totalCost, 18), 'ETH')
console.log('Minimum Profit Required:', formatWeiAmount(minimumProfit, 18), 'ETH')
```

### Cas 3: Validation avant Exécution

```typescript
import { validateFlashLoanParams } from './services/cowprotocol/utils'

const validation = validateFlashLoanParams({
  sellAmount: BigInt('1000000000000000000'),
  flashLoanFeeBps: 5,
  slippageBps: 50,
})

if (!validation.valid) {
  console.error('Validation failed:', validation.errors)
  // ["Sell amount must be greater than zero"]
} else {
  console.log('✅ Parameters are valid')
  // Procéder avec le flash loan
}
```

## 📊 Réseaux Supportés

| Réseau | Chain ID | Aave Pool | Adapter Factory | Statut |
|--------|----------|-----------|-----------------|--------|
| **Ethereum Mainnet** | 1 | 0x8787...4E2 | 0x43c6...927 | ✅ Actif |
| **Gnosis Chain** | 100 | 0xb502...D8 | 0x43c6...927 | ✅ Actif |
| **Sepolia Testnet** | 11155111 | - | 0x43c6...927 | ⚠️ Test |

## 🛠️ Utilitaires Disponibles

### Formatage

```typescript
import { 
  formatWeiAmount, 
  parseToWei, 
  shortenAddress,
  formatFeePercentage 
} from './services/cowprotocol/utils'

// Wei vers human-readable
formatWeiAmount(BigInt('1500000000000000000'), 18) // "1.5"

// Human-readable vers wei
parseToWei('1.5', 18) // 1500000000000000000n

// Raccourcir une adresse
shortenAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb') // "0x742d...0bEb"

// Formater un pourcentage
formatFeePercentage(50) // "0.50%"
```

### Calculs

```typescript
import { 
  calculateSlippage,
  calculatePercentage,
  estimateGasCost 
} from './services/cowprotocol/utils'

// Slippage
const { minAmount, maxAmount } = calculateSlippage(
  BigInt('1000000000000000000'),
  50 // 0.5%
)

// Pourcentage d'un montant
const fee = calculatePercentage(
  BigInt('1000000000000000000'),
  5 // 0.05%
)

// Coût en gas
const gasCost = estimateGasCost(
  300_000n, // gas limit
  50_000_000_000n // gas price (50 Gwei)
)
```

### Validation

```typescript
import { 
  isValidAddress,
  validateFlashLoanParams,
  isSupportedChainId 
} from './services/cowprotocol/utils'

// Valider une adresse
isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb') // true
isValidAddress('invalid') // false

// Valider un chain ID
isSupportedChainId(1) // true
isSupportedChainId(999) // false

// Valider tous les paramètres
const validation = validateFlashLoanParams({
  sellAmount: BigInt('1000000000000000000'),
  flashLoanFeeBps: 5,
  slippageBps: 50,
})
```

## 📖 Types de Flash Loans

### 1. Collateral Swap

Swap de collatéral d'un actif à un autre.

```typescript
import { AaveFlashLoanType } from './services/cowprotocol'

const flashLoanType = AaveFlashLoanType.CollateralSwap
```

**Use Case**: Convertir aWETH en aUSDC sans retirer le collatéral.

### 2. Debt Swap

Swap de dette d'un actif à un autre.

```typescript
const flashLoanType = AaveFlashLoanType.DebtSwap
```

**Use Case**: Convertir une dette en USDC vers une dette en DAI.

### 3. Repay with Collateral

Rembourser une dette en utilisant du collatéral.

```typescript
const flashLoanType = AaveFlashLoanType.RepayCollateral
```

**Use Case**: Rembourser une dette en vendant une partie du collatéral.

## 🧪 Tests

Le SDK inclut une suite de tests complète:

```typescript
import { runAllTests } from './services/cowprotocol/tests'

// Exécuter tous les tests
const allPassed = runAllTests()

// Tests individuels
import {
  testSDKInitialization,
  testFlashLoanFeeCalculation,
  testUtilityFunctions,
  testParameterValidation,
  testConstants
} from './services/cowprotocol/tests'

testSDKInitialization()
testFlashLoanFeeCalculation()
// etc.
```

## 📚 Documentation Complète

- **Guide du SDK**: `/docs/COW_PROTOCOL_SDK.md`
- **README du Module**: `/services/cowprotocol/README.md`
- **Exemples Pratiques**: `/services/cowprotocol/examples.ts`
- **Documentation Aave**: `/docs/AAVE_FLASH_LOANS.md`

## 🔐 Sécurité

### Validations Intégrées

1. ✅ Validation des adresses Ethereum
2. ✅ Validation des montants (> 0)
3. ✅ Validation des frais (0-100%)
4. ✅ Validation du slippage (0-100%)
5. ✅ Protection contre les overflows
6. ✅ Calcul précis des frais (matching Aave)

### Best Practices

```typescript
// ✅ Toujours valider avant exécution
const validation = validateFlashLoanParams(params)
if (!validation.valid) {
  throw new Error(validation.errors.join(', '))
}

// ✅ Gérer les erreurs
try {
  const result = await sdk.calculateFlashLoanAmounts(params)
} catch (error) {
  console.error(formatErrorMessage(error))
}

// ✅ Vérifier les adresses
if (!isValidAddress(tokenAddress)) {
  throw new Error('Invalid token address')
}
```

## 🎨 Exemples Complets

Consultez `/services/cowprotocol/examples.ts` pour des exemples complets:

```typescript
import {
  calculateFlashLoanFees,
  calculateSwapSlippage,
  validateBeforeExecution,
  collateralSwapExample,
  estimateTotalCost,
  completeSwapScenario
} from './services/cowprotocol/examples'

// Exécuter un scénario complet
completeSwapScenario()
```

## 🚀 Prochaines Étapes

1. **Intégration UI**: Connecter le SDK au composant `FlashLoanBotSection.tsx`
2. **Web3 Provider**: Intégrer ethers.js ou viem pour les appels blockchain
3. **Trading SDK**: Intégrer `@cowprotocol/sdk-trading` pour les ordres
4. **Monitoring**: Ajouter des logs et métriques
5. **Testing**: Tests d'intégration avec testnet

## 📞 Support

Pour toute question:
1. Consultez `/docs/COW_PROTOCOL_SDK.md`
2. Examinez `/services/cowprotocol/examples.ts`
3. Vérifiez `/services/cowprotocol/README.md`
