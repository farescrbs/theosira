# CoW Protocol Flash Loans SDK - Documentation Technique

## Vue d'ensemble

Ce SDK fournit une intégration complète des flash loans Aave V3 avec CoW Protocol pour la plateforme THESORIA. Il permet d'exécuter des opérations de swap de collatéral, de swap de dette et de remboursement avec collatéral.

## Architecture

```
/services/cowprotocol/
├── abi/                          # ABIs des contrats Aave
│   ├── AaveAdapterFactory.ts
│   ├── CollateralSwapAdapterHook.ts
│   ├── DebtSwapAdapter.ts
│   ├── RepayWithCollateralAdapter.ts
│   └── index.ts
├── CowFlashLoanSDK.ts           # SDK principal
├── constants.ts                  # Constantes et configurations
├── types.ts                      # Types TypeScript
├── utils.ts                      # Fonctions utilitaires
└── index.ts                      # Point d'entrée principal
```

## Types de Flash Loans Supportés

### 1. Collateral Swap
Permet de swap du collatéral d'un actif à un autre en utilisant un flash loan.

```typescript
import { CowFlashLoanSDK, AaveFlashLoanType } from './services/cowprotocol'

const sdk = new CowFlashLoanSDK()

// Calculer les frais de flash loan
const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount: BigInt('1000000000000000000'), // 1 ETH
  flashLoanFeeBps: 5, // 0.05%
})

console.log('Fee:', flashLoanFeeAmount.toString())
console.log('Amount to sign:', sellAmountToSign.toString())
```

### 2. Debt Swap
Permet de swap de la dette d'un actif à un autre.

### 3. Repay with Collateral
Permet de rembourser une dette en utilisant du collatéral.

## Configuration des Réseaux

Le SDK supporte les réseaux suivants:

| Network | Chain ID | Aave Pool | Adapter Factory |
|---------|----------|-----------|-----------------|
| Ethereum Mainnet | 1 | 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2 | 0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927 |
| Gnosis Chain | 100 | 0xb50201558B00496A145fE76f7424749556E326D8 | 0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927 |
| Sepolia Testnet | 11155111 | - | 0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927 |

## Utilisation de Base

### Initialisation

```typescript
import { CowFlashLoanSDK } from './services/cowprotocol'

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

### Calcul des Frais de Flash Loan

```typescript
const sellAmount = BigInt('20000000000000000000') // 20 tokens
const flashLoanFeeBps = 5 // 0.05% = 5 basis points

const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount,
  flashLoanFeeBps,
})

// flashLoanFeeAmount: 0.01 tokens (0.05% de 20)
// sellAmountToSign: 19.99 tokens (20 - 0.01)
```

### Construction des Hook Order Data

```typescript
const hookAmounts = {
  flashLoanAmount: '1000000000000000000',
  flashLoanFeeAmount: '500000000000000',
  sellAssetAmount: '1000000000000000000',
  buyAssetAmount: '2000000000',
}

const encodedOrder = {
  sellToken: '0x...',
  buyToken: '0x...',
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

### Obtenir les Hooks de Commande

```typescript
const hooks = await sdk.getOrderHooks(
  AaveFlashLoanType.CollateralSwap,
  1, // chainId (Mainnet)
  '0x...', // trader
  '0x...', // instance address
  hookAmounts,
  encodedOrder,
  undefined, // collateral permit
  {
    preHookGasLimit: 300_000n,
    postHookGasLimit: 600_000n,
  }
)

// hooks.pre: Configuration du pre-hook (déploiement adapter)
// hooks.post: Configuration du post-hook (exécution swap)
```

## Fonctions Utilitaires

Le SDK inclut de nombreuses fonctions utilitaires dans `/services/cowprotocol/utils.ts`:

### Validation des Adresses

```typescript
import { isValidAddress } from './services/cowprotocol/utils'

const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
if (isValidAddress(address)) {
  // Adresse valide
}
```

### Formatage des Montants

```typescript
import { formatWeiAmount, parseToWei } from './services/cowprotocol/utils'

// Wei to human-readable
const formatted = formatWeiAmount(BigInt('1234567890000000000'), 18)
// "1.23456789"

// Human-readable to wei
const wei = parseToWei('1.5', 18)
// 1500000000000000000n
```

### Calcul du Slippage

```typescript
import { calculateSlippage } from './services/cowprotocol/utils'

const amount = BigInt('1000000000000000000')
const slippageBps = 50 // 0.5%

const { minAmount, maxAmount } = calculateSlippage(amount, slippageBps)
// minAmount: 995000000000000000 (0.5% less)
// maxAmount: 1005000000000000000 (0.5% more)
```

### Raccourcir les Adresses

```typescript
import { shortenAddress } from './services/cowprotocol/utils'

const short = shortenAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
// "0x742d...0bEb"
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
  console.error('Errors:', validation.errors)
}
```

## Constantes Importantes

### Types de Flash Loans

```typescript
import { AaveFlashLoanType } from './services/cowprotocol'

AaveFlashLoanType.CollateralSwap    // Swap de collatéral
AaveFlashLoanType.DebtSwap          // Swap de dette
AaveFlashLoanType.RepayCollateral   // Remboursement avec collatéral
```

### Limites de Gas par Défaut

```typescript
import { DEFAULT_HOOK_GAS_LIMIT } from './services/cowprotocol'

DEFAULT_HOOK_GAS_LIMIT.pre   // 300,000
DEFAULT_HOOK_GAS_LIMIT.post  // 600,000
```

### Échelle des Pourcentages

```typescript
import { PERCENT_SCALE } from './services/cowprotocol'

// 10,000 basis points = 100%
// 5 basis points = 0.05%
// 50 basis points = 0.5%
```

## ABIs des Contrats

Tous les ABIs sont exportés et disponibles:

```typescript
import {
  aaveAdapterFactoryAbi,
  collateralSwapAdapterHookAbi,
  debtSwapAdapterAbi,
  repayWithCollateralAdapterAbi,
} from './services/cowprotocol'

// Utilisation avec ethers ou viem
const contract = new ethers.Contract(
  adapterAddress,
  aaveAdapterFactoryAbi,
  provider
)
```

## Gestion des Erreurs

```typescript
import { formatErrorMessage } from './services/cowprotocol/utils'

try {
  const result = await sdk.calculateFlashLoanAmounts({
    sellAmount: BigInt('1000000000000000000'),
    flashLoanFeeBps: 5,
  })
} catch (error) {
  const message = formatErrorMessage(error)
  console.error('Error:', message)
}
```

## Intégration avec ethers.js

```typescript
import { ethers } from 'ethers'
import { CowFlashLoanSDK, aaveAdapterFactoryAbi } from './services/cowprotocol'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const sdk = new CowFlashLoanSDK()

// Lire un contrat
const adapterFactory = new ethers.Contract(
  sdk.aaveAdapterFactory[1], // Mainnet
  aaveAdapterFactoryAbi,
  provider
)
```

## Exemple Complet: Flash Loan Collateral Swap

```typescript
import { CowFlashLoanSDK, AaveFlashLoanType } from './services/cowprotocol'
import { formatWeiAmount, calculateSlippage } from './services/cowprotocol/utils'

async function executeFlashLoanSwap() {
  const sdk = new CowFlashLoanSDK()
  
  // Paramètres
  const sellAmount = BigInt('20000000000000000000') // 20 WETH
  const flashLoanFeeBps = 5 // 0.05%
  const slippageBps = 50 // 0.5%
  
  // 1. Calculer les frais
  const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
    sellAmount,
    flashLoanFeeBps,
  })
  
  console.log('Flash Loan Fee:', formatWeiAmount(flashLoanFeeAmount, 18), 'WETH')
  console.log('Amount to Sign:', formatWeiAmount(sellAmountToSign, 18), 'WETH')
  
  // 2. Calculer le slippage
  const { minAmount, maxAmount } = calculateSlippage(sellAmountToSign, slippageBps)
  
  console.log('Min Amount:', formatWeiAmount(minAmount, 18), 'WETH')
  console.log('Max Amount:', formatWeiAmount(maxAmount, 18), 'WETH')
  
  // 3. Construire les hook amounts
  const hookAmounts = {
    flashLoanAmount: sellAmount.toString(),
    flashLoanFeeAmount: flashLoanFeeAmount.toString(),
    sellAssetAmount: sellAmount.toString(),
    buyAssetAmount: '18000000000', // Example buy amount in USDC (18 USDC)
  }
  
  // 4. Obtenir le flash loan hint
  const flashLoanHint = sdk.getFlashLoanHint(
    1, // Mainnet
    sellAmount.toString(),
    '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d' // WXDAI on Gnosis
  )
  
  console.log('Flash Loan Hint:', flashLoanHint)
  
  // 5. Construire les hooks
  // ... (nécessite des données d'ordre complètes)
  
  return {
    flashLoanFeeAmount,
    sellAmountToSign,
    hookAmounts,
    flashLoanHint,
  }
}
```

## Ressources Additionnelles

- [Documentation Aave V3](https://docs.aave.com/developers/guides/flash-loans)
- [Documentation CoW Protocol](https://docs.cow.fi/)
- [GitHub CoW SDK](https://github.com/cowprotocol/cow-sdk)
- [Aave V3 Addresses](https://docs.aave.com/developers/deployed-contracts/v3-mainnet)

## Support

Pour toute question ou problème:
1. Consultez la documentation technique dans `/docs/AAVE_FLASH_LOANS.md`
2. Vérifiez les types dans `/services/cowprotocol/types.ts`
3. Examinez les constantes dans `/services/cowprotocol/constants.ts`
4. Utilisez les fonctions utilitaires dans `/services/cowprotocol/utils.ts`
