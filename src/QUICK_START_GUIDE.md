# 🚀 Guide de Démarrage Rapide - CoW Protocol SDK

## Installation Rapide

Le SDK est déjà intégré dans THESORIA. Aucune installation nécessaire !

## Premier Pas (30 secondes)

```typescript
import { CowFlashLoanSDK } from './services/cowprotocol'

const sdk = new CowFlashLoanSDK()

const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount: BigInt('1000000000000000000'), // 1 ETH
  flashLoanFeeBps: 5, // 0.05%
})

console.log('Fee:', flashLoanFeeAmount.toString()) // "500000000000000" (0.0005 ETH)
```

✅ **Ça marche !**

## 5 Exemples Essentiels

### 1. Calculer des Frais (10 sec)

```typescript
import { CowFlashLoanSDK } from './services/cowprotocol'
import { formatWeiAmount } from './services/cowprotocol/utils'

const sdk = new CowFlashLoanSDK()
const result = sdk.calculateFlashLoanAmounts({
  sellAmount: BigInt('20000000000000000000'), // 20 ETH
  flashLoanFeeBps: 5,
})

console.log('Fee:', formatWeiAmount(result.flashLoanFeeAmount, 18), 'ETH')
// "0.01 ETH"
```

### 2. Calculer le Slippage (10 sec)

```typescript
import { calculateSlippage, formatWeiAmount } from './services/cowprotocol/utils'

const { minAmount, maxAmount } = calculateSlippage(
  BigInt('1000000000000000000'), // 1 ETH
  50 // 0.5%
)

console.log('Min:', formatWeiAmount(minAmount, 18), 'ETH') // "0.995 ETH"
console.log('Max:', formatWeiAmount(maxAmount, 18), 'ETH') // "1.005 ETH"
```

### 3. Formater des Montants (10 sec)

```typescript
import { formatWeiAmount, parseToWei } from './services/cowprotocol/utils'

// Wei → Human
const formatted = formatWeiAmount(BigInt('1500000000000000000'), 18)
console.log(formatted) // "1.5"

// Human → Wei
const wei = parseToWei('1.5', 18)
console.log(wei) // 1500000000000000000n
```

### 4. Valider des Paramètres (10 sec)

```typescript
import { validateFlashLoanParams } from './services/cowprotocol/utils'

const validation = validateFlashLoanParams({
  sellAmount: BigInt('1000000000000000000'),
  flashLoanFeeBps: 5,
  slippageBps: 50,
})

console.log('Valid:', validation.valid) // true
console.log('Errors:', validation.errors) // []
```

### 5. Utiliser les Constantes (10 sec)

```typescript
import { 
  AAVE_POOL_ADDRESS, 
  AAVE_ADAPTER_FACTORY,
  AaveFlashLoanType 
} from './services/cowprotocol'

console.log('Aave Pool (Mainnet):', AAVE_POOL_ADDRESS[1])
// "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"

console.log('Flash Loan Types:', Object.values(AaveFlashLoanType))
// ["CollateralSwap", "DebtSwap", "RepayCollateral"]
```

## Exemple Complet (2 min)

```typescript
import { CowFlashLoanSDK, AaveFlashLoanType } from './services/cowprotocol'
import {
  formatWeiAmount,
  parseToWei,
  calculateSlippage,
  validateFlashLoanParams,
  formatFeePercentage,
} from './services/cowprotocol/utils'

// 1. Initialiser le SDK
const sdk = new CowFlashLoanSDK()

// 2. Configuration
const sellAmount = parseToWei('20', 18) // 20 WXDAI
const flashLoanFeeBps = 5 // 0.05%
const slippageBps = 80 // 0.8%

// 3. Valider
const validation = validateFlashLoanParams({
  sellAmount,
  flashLoanFeeBps,
  slippageBps,
})

if (!validation.valid) {
  console.error('Erreurs:', validation.errors)
  process.exit(1)
}

// 4. Calculer les frais
const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
  sellAmount,
  flashLoanFeeBps,
})

// 5. Calculer le slippage
const { minAmount, maxAmount } = calculateSlippage(sellAmountToSign, slippageBps)

// 6. Afficher le résumé
console.log('\n🎯 Flash Loan Configuration')
console.log('─'.repeat(50))
console.log('Loan Amount:', formatWeiAmount(sellAmount, 18), 'WXDAI')
console.log('Fee Rate:', formatFeePercentage(flashLoanFeeBps))
console.log('Fee Amount:', formatWeiAmount(flashLoanFeeAmount, 18), 'WXDAI')
console.log('Amount to Sign:', formatWeiAmount(sellAmountToSign, 18), 'WXDAI')
console.log('Min Amount:', formatWeiAmount(minAmount, 18), 'WXDAI')
console.log('Max Amount:', formatWeiAmount(maxAmount, 18), 'WXDAI')
console.log('─'.repeat(50))
console.log('✅ Ready to execute!')
```

## Intégration React (5 min)

### Hook Simple

```typescript
import { useMemo } from 'react'
import { CowFlashLoanSDK } from './services/cowprotocol'
import { parseToWei, formatWeiAmount } from './services/cowprotocol/utils'

function useFlashLoanFees(amount: string, decimals: number, feeBps: number) {
  const sdk = useMemo(() => new CowFlashLoanSDK(), [])

  return useMemo(() => {
    try {
      const amountWei = parseToWei(amount, decimals)
      const { flashLoanFeeAmount, sellAmountToSign } = sdk.calculateFlashLoanAmounts({
        sellAmount: amountWei,
        flashLoanFeeBps: feeBps,
      })

      return {
        feeAmount: formatWeiAmount(flashLoanFeeAmount, decimals),
        amountToSign: formatWeiAmount(sellAmountToSign, decimals),
        isValid: true,
      }
    } catch (error) {
      return {
        feeAmount: '0',
        amountToSign: '0',
        isValid: false,
      }
    }
  }, [amount, decimals, feeBps, sdk])
}

// Utilisation
function MyComponent() {
  const fees = useFlashLoanFees('1.0', 18, 5)

  return (
    <div>
      <p>Fee: {fees.feeAmount} ETH</p>
      <p>Amount to Sign: {fees.amountToSign} ETH</p>
    </div>
  )
}
```

### Composant Complet

Voir `/services/cowprotocol/react-integration-guide.tsx` pour des exemples complets de:
- `FlashLoanFeeCalculator`
- `SlippageCalculator`
- `FlashLoanValidator`
- `FlashLoanForm`

## Tests Rapides (1 min)

```typescript
import { runAllTests } from './services/cowprotocol/tests'

// Exécuter tous les tests
runAllTests()

// Output:
// ✅ Test Suite 1: SDK Initialization - PASSED
// ✅ Test Suite 2: Flash Loan Fee Calculation - PASSED
// ✅ Test Suite 3: Utility Functions - PASSED
// ✅ Test Suite 4: Parameter Validation - PASSED
// ✅ Test Suite 5: Constants - PASSED
// 🎉 All tests passed!
```

## Exemples Avancés (3 min)

```typescript
import {
  calculateFlashLoanFees,
  calculateSwapSlippage,
  collateralSwapExample,
  estimateTotalCost,
  completeSwapScenario,
} from './services/cowprotocol/examples'

// Exemple 1: Calculer frais
calculateFlashLoanFees()

// Exemple 2: Calculer slippage
calculateSwapSlippage()

// Exemple 3: Swap de collatéral complet
collateralSwapExample()

// Exemple 4: Estimer coûts totaux
estimateTotalCost()

// Exemple 5: Scénario complet
completeSwapScenario()
```

## Documentation Complète

1. **Guide du SDK**: `/docs/COW_PROTOCOL_SDK.md` (150+ lignes)
2. **Guide d'Intégration**: `/docs/COW_PROTOCOL_INTEGRATION.md` (200+ lignes)
3. **README**: `/services/cowprotocol/README.md` (150+ lignes)
4. **Résumé**: `/INTEGRATION_SUMMARY.md` (200+ lignes)

## Références Rapides

### Fonctions les Plus Utilisées

```typescript
// Calculs
calculateFlashLoanAmounts()  // Frais de flash loan
calculateSlippage()           // Min/max avec slippage
calculatePercentage()         // % d'un montant

// Formatage
formatWeiAmount()            // Wei → Human
parseToWei()                 // Human → Wei
formatFeePercentage()        // BPS → %
shortenAddress()             // Raccourcir adresse

// Validation
validateFlashLoanParams()    // Valider tous params
isValidAddress()             // Valider adresse
isSupportedChainId()         // Vérifier chain

// Helpers
getAavePoolAddress()         // Pool Aave par chain
getAaveAdapterFactory()      // Factory par chain
getChainName()               // Nom du réseau
```

### Constantes les Plus Utilisées

```typescript
AAVE_POOL_ADDRESS           // Pools Aave
AAVE_ADAPTER_FACTORY        // Factories
AAVE_HOOK_ADAPTER_PER_TYPE  // Adapters par type
AaveFlashLoanType           // Types de flash loans
DEFAULT_HOOK_GAS_LIMIT      // Limites gas
PERCENT_SCALE               // 10,000
HASH_ZERO                   // bytes32(0)
EMPTY_PERMIT                // Permit vide
```

## Commandes Utiles

```bash
# Rien à installer - tout est déjà intégré!

# Pour voir le code
cat /services/cowprotocol/index.ts

# Pour voir les exemples
cat /services/cowprotocol/examples.ts

# Pour voir les tests
cat /services/cowprotocol/tests.ts
```

## Support Rapide

**Problème**: Comment calculer les frais?
```typescript
const sdk = new CowFlashLoanSDK()
const { flashLoanFeeAmount } = sdk.calculateFlashLoanAmounts({
  sellAmount: BigInt('1000000000000000000'),
  flashLoanFeeBps: 5,
})
```

**Problème**: Comment formater un montant?
```typescript
import { formatWeiAmount } from './services/cowprotocol/utils'
const formatted = formatWeiAmount(BigInt('1500000000000000000'), 18) // "1.5"
```

**Problème**: Comment valider des paramètres?
```typescript
import { validateFlashLoanParams } from './services/cowprotocol/utils'
const validation = validateFlashLoanParams({ sellAmount, flashLoanFeeBps, slippageBps })
if (!validation.valid) console.error(validation.errors)
```

**Problème**: Comment utiliser dans React?
```typescript
// Voir /services/cowprotocol/react-integration-guide.tsx
import { useFlashLoanFees } from './services/cowprotocol/react-integration-guide'
const fees = useFlashLoanFees('1.0', 18, 5)
```

## Prochaines Étapes

1. ✅ Lire ce guide (vous l'avez fait!)
2. 📖 Consulter `/docs/COW_PROTOCOL_SDK.md`
3. 💡 Tester les exemples dans `/services/cowprotocol/examples.ts`
4. 🧪 Exécuter les tests avec `runAllTests()`
5. ⚛️ Intégrer dans React avec les hooks
6. 🚀 Connecter au composant `FlashLoanBotSection.tsx`

---

**C'est tout ! En moins de 5 minutes, vous êtes prêt à utiliser le SDK CoW Protocol dans THESORIA. 🎉**
