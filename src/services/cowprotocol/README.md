# CoW Protocol Flash Loans SDK

SDK professionnel pour l'intégration des flash loans Aave V3 avec CoW Protocol dans THESORIA.

## 🚀 Installation

Le SDK est déjà intégré dans THESORIA. Pour l'utiliser:

```typescript
import { CowFlashLoanSDK, AaveFlashLoanType } from './services/cowprotocol'
```

## 📋 Fonctionnalités

- ✅ **Collateral Swap**: Swap de collatéral avec flash loan
- ✅ **Debt Swap**: Swap de dette avec flash loan
- ✅ **Repay with Collateral**: Remboursement de dette avec collatéral
- ✅ **Fee Calculation**: Calcul automatique des frais Aave
- ✅ **Slippage Protection**: Gestion du slippage
- ✅ **Multi-Chain Support**: Ethereum, Gnosis Chain, Sepolia
- ✅ **Type Safety**: TypeScript complet avec types stricts
- ✅ **Utilities**: Fonctions utilitaires complètes
- ✅ **ABIs**: Tous les ABIs des contrats Aave

## 🎯 Quick Start

### Exemple Basique

```typescript
import { CowFlashLoanSDK } from './services/cowprotocol'

const sdk = new CowFlashLoanSDK()

// Calculer les frais de flash loan
const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount: BigInt('1000000000000000000'), // 1 ETH
  flashLoanFeeBps: 5, // 0.05% (frais Aave standard)
})

console.log('Fee:', flashLoanFeeAmount.toString())
// Output: "500000000000000" (0.0005 ETH)

console.log('Amount to sign:', sellAmountToSign.toString())
// Output: "999500000000000000" (0.9995 ETH)
```

### Exemple Avancé

```typescript
import { 
  CowFlashLoanSDK, 
  AaveFlashLoanType,
  formatWeiAmount,
  calculateSlippage 
} from './services/cowprotocol'

const sdk = new CowFlashLoanSDK()

// 1. Configuration
const sellAmount = BigInt('20000000000000000000') // 20 WXDAI
const flashLoanFeeBps = 5 // 0.05%
const slippageBps = 80 // 0.8%

// 2. Calculer les frais
const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount,
  flashLoanFeeBps,
})

// 3. Calculer le slippage
const { minAmount, maxAmount } = calculateSlippage(sellAmountToSign, slippageBps)

// 4. Afficher les résultats
console.log('Loan Amount:', formatWeiAmount(sellAmount, 18), 'WXDAI')
console.log('Fee:', formatWeiAmount(flashLoanFeeAmount, 18), 'WXDAI')
console.log('Amount to Sign:', formatWeiAmount(sellAmountToSign, 18), 'WXDAI')
console.log('Min Amount:', formatWeiAmount(minAmount, 18), 'WXDAI')
```

## 📚 Documentation

### Structure du Projet

```
/services/cowprotocol/
├── abi/                          # ABIs des contrats
│   ├── AaveAdapterFactory.ts     # ABI factory adapter
│   ├── CollateralSwapAdapterHook.ts
│   ├── DebtSwapAdapter.ts
│   └── RepayWithCollateralAdapter.ts
├── CowFlashLoanSDK.ts           # SDK principal
├── constants.ts                  # Constantes et config
├── types.ts                      # Types TypeScript
├── utils.ts                      # Fonctions utilitaires
├── examples.ts                   # Exemples d'utilisation
├── index.ts                      # Point d'entrée
└── README.md                     # Ce fichier
```

### Types de Flash Loans

#### 1. Collateral Swap
Permet de swap du collatéral d'un actif à un autre.

```typescript
const flashLoanType = AaveFlashLoanType.CollateralSwap
```

#### 2. Debt Swap
Permet de swap de la dette d'un actif à un autre.

```typescript
const flashLoanType = AaveFlashLoanType.DebtSwap
```

#### 3. Repay with Collateral
Permet de rembourser une dette en utilisant du collatéral.

```typescript
const flashLoanType = AaveFlashLoanType.RepayCollateral
```

## 🌐 Réseaux Supportés

| Réseau | Chain ID | Statut |
|--------|----------|--------|
| Ethereum Mainnet | 1 | ✅ |
| Gnosis Chain | 100 | ✅ |
| Sepolia Testnet | 11155111 | ⚠️ (Pool non disponible) |

## 🔧 Configuration

### Configuration par Défaut

```typescript
const sdk = new CowFlashLoanSDK()
```

### Configuration Personnalisée

```typescript
const sdk = new CowFlashLoanSDK({
  hooksGasLimit: {
    pre: 500_000n,   // Gas limit pour pre-hook
    post: 800_000n,  // Gas limit pour post-hook
  }
})
```

## 🛠️ Fonctions Utilitaires

### Formatage des Montants

```typescript
import { formatWeiAmount, parseToWei } from './services/cowprotocol/utils'

// Wei vers human-readable
const formatted = formatWeiAmount(BigInt('1500000000000000000'), 18)
// "1.5"

// Human-readable vers wei
const wei = parseToWei('1.5', 18)
// 1500000000000000000n
```

### Validation d'Adresse

```typescript
import { isValidAddress } from './services/cowprotocol/utils'

if (isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')) {
  console.log('Adresse valide!')
}
```

### Calcul de Slippage

```typescript
import { calculateSlippage } from './services/cowprotocol/utils'

const { minAmount, maxAmount } = calculateSlippage(
  BigInt('1000000000000000000'),
  50 // 0.5%
)
```

### Validation des Paramètres

```typescript
import { validateFlashLoanParams } from './services/cowprotocol/utils'

const validation = validateFlashLoanParams({
  sellAmount: BigInt('1000000000000000000'),
  flashLoanFeeBps: 5,
  slippageBps: 50,
})

if (!validation.valid) {
  console.error('Erreurs:', validation.errors)
}
```

## 📊 Constantes

```typescript
import {
  AAVE_POOL_ADDRESS,
  AAVE_ADAPTER_FACTORY,
  DEFAULT_HOOK_GAS_LIMIT,
  PERCENT_SCALE,
} from './services/cowprotocol'

console.log('Aave Pool (Mainnet):', AAVE_POOL_ADDRESS[1])
console.log('Adapter Factory (Gnosis):', AAVE_ADAPTER_FACTORY[100])
console.log('Pre-hook Gas:', DEFAULT_HOOK_GAS_LIMIT.pre)
console.log('Percent Scale:', PERCENT_SCALE) // 10000
```

## 🧪 Exemples

Des exemples complets sont disponibles dans `/services/cowprotocol/examples.ts`:

```typescript
import {
  calculateFlashLoanFees,
  calculateSwapSlippage,
  validateBeforeExecution,
  collateralSwapExample,
  estimateTotalCost,
  completeSwapScenario,
} from './services/cowprotocol/examples'

// Exécuter un scénario complet
completeSwapScenario()
```

## 📖 Ressources

- [Documentation Technique Complète](/docs/COW_PROTOCOL_SDK.md)
- [Documentation Aave Flash Loans](/docs/AAVE_FLASH_LOANS.md)
- [Aave V3 Documentation](https://docs.aave.com/developers/guides/flash-loans)
- [CoW Protocol Documentation](https://docs.cow.fi/)

## 🔐 Sécurité

- ✅ Validation stricte des paramètres
- ✅ Protection contre le slippage
- ✅ Calcul précis des frais (matching Aave PercentageMath)
- ✅ Gestion d'erreurs complète
- ✅ Types TypeScript stricts

## 🤝 Support

Pour toute question ou problème:

1. Consultez la documentation dans `/docs/COW_PROTOCOL_SDK.md`
2. Examinez les exemples dans `/services/cowprotocol/examples.ts`
3. Vérifiez les types dans `/services/cowprotocol/types.ts`

## 📝 License

Ce SDK est intégré dans THESORIA et suit la même licence que le projet principal.

## 🎨 Style THESORIA

Ce SDK suit le style ultra-minimaliste et luxueux de THESORIA:
- Code professionnel et optimisé
- Documentation complète en français
- Types TypeScript stricts
- Aucune dépendance externe inutile
- Performance optimale
