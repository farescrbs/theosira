# Aave V3 Flash Loans - Documentation Technique

## Vue d'ensemble

Les Flash Loans Aave V3 permettent d'emprunter des actifs sans collatéral, à condition de rembourser le prêt dans la même transaction blockchain.

### Intégration CoW Protocol

THESORIA intègre maintenant le SDK CoW Protocol pour une utilisation avancée des flash loans Aave V3. Le SDK complet est disponible dans `/services/cowprotocol/`.

**Documentation du SDK CoW Protocol:**
- [Guide d'utilisation du SDK](/docs/COW_PROTOCOL_SDK.md)
- [README du SDK](/services/cowprotocol/README.md)
- [Exemples pratiques](/services/cowprotocol/examples.ts)

## Architecture des Contrats

### Contrats Principaux

#### 1. FlashLoanLogic.sol
Implémente la logique des flash loans dans le protocole Aave V3.

**Fonctions principales:**
- `executeFlashLoan()`: Exécute un flash loan multiple
- `executeFlashLoanSimple()`: Exécute un flash loan simple (un seul actif)
- `_handleFlashLoanRepayment()`: Gère le remboursement du flash loan

#### 2. IFlashLoanReceiver.sol
Interface que doit implémenter le contrat receveur du flash loan.

```solidity
interface IFlashLoanReceiver {
  function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata params
  ) external returns (bool);
}
```

#### 3. IFlashLoanSimpleReceiver.sol
Interface simplifiée pour les flash loans d'un seul actif.

```solidity
interface IFlashLoanSimpleReceiver {
  function executeOperation(
    address asset,
    uint256 amount,
    uint256 premium,
    address initiator,
    bytes calldata params
  ) external returns (bool);
}
```

## Paramètres des Flash Loans

### Frais
- **FLASHLOAN_PREMIUM_TOTAL**: 9 bps (0.09%)
- **FLASHLOAN_PREMIUM_TO_PROTOCOL**: 30% des frais totaux

### Modes d'intérêt
```typescript
enum InterestRateMode {
  NONE = 0,    // Remboursement immédiat
  STABLE = 1,  // Taux stable (conversion en dette)
  VARIABLE = 2 // Taux variable (conversion en dette)
}
```

## Utilisation dans THESORIA

### 1. Flash Loan Standard
```typescript
// Emprunter plusieurs actifs
await pool.flashLoan(
  receiverAddress,
  [asset1, asset2],
  [amount1, amount2],
  [0, 0], // mode NONE = remboursement
  initiatorAddress,
  params,
  referralCode
);
```

### 2. Flash Loan Simple
```typescript
// Emprunter un seul actif
await pool.flashLoanSimple(
  receiverAddress,
  asset,
  amount,
  params,
  referralCode
);
```

## Stratégies Supportées

### 1. Arbitrage DEX
Exploiter les différences de prix entre plusieurs DEX.

**Frais**: 0.09%
**Risque**: Moyen
**Retour potentiel**: 0.5% - 3%

### 2. Liquidation
Liquider des positions sous-collatéralisées.

**Frais**: 0.09%
**Risque**: Faible
**Retour potentiel**: 2% - 8%

### 3. Refinancement Collatéral
Refinancer une dette avec de meilleures conditions.

**Frais**: 0.09%
**Risque**: Faible
**Retour potentiel**: 0.1% - 0.5%

### 4. Arbitrage Tri-DEX
Cycles d'arbitrage sur trois échanges ou plus.

**Frais**: 0.09%
**Risque**: Élevé
**Retour potentiel**: 1% - 5%

## Oracles et Prix

### AaveOracle
Gère les prix des actifs via des agrégateurs Chainlink.

**Fonctionnalités:**
- Prix en temps réel via Chainlink
- Oracle de secours (fallback)
- Support multi-devises
- Unité de base configurable

### PriceOracleSentinel
Validateur de santé de l'oracle pour les opérations critiques.

**Protection:**
- Vérifie l'état du séquenceur (L2)
- Période de grâce après une panne
- Blocage des emprunts/liquidations si nécessaire

## Sécurité

### Validations
1. **Montant non nul**: Le montant emprunté doit être > 0
2. **Liquidité suffisante**: Vérification de la liquidité disponible
3. **Caps respectés**: Respect des plafonds d'emprunt
4. **Retour correct**: Le contrat receveur doit retourner `true`
5. **Remboursement**: Le montant + frais doit être remboursé

### Ré-entrance
Protection contre les attaques de ré-entrance via:
- Modèle "Checks-Effects-Interactions"
- Mise à jour d'état avant callbacks
- Validation post-callback

## Tests et Mocks

### MockFlashLoanReceiver
Contrat de test pour simuler des flash loans.

**Fonctionnalités:**
- Simulation de succès/échec
- Approbation configurable
- Simulation EOA

### MockFlashLoanSimpleReceiver
Version simplifiée pour un seul actif.

## Intégration ERC-3156

Aave V3 supporte également le standard ERC-3156 pour les flash loans.

### Interface ERC-3156
```solidity
interface IERC3156FlashLender {
  function maxFlashLoan(address token) external view returns (uint256);
  function flashFee(address token, uint256 amount) external view returns (uint256);
  function flashLoan(
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  ) external returns (bool);
}
```

## Déploiement

### Adresses des Contrats (Mainnet)
```typescript
const AAVE_V3_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const AAVE_V3_ORACLE = "0x54586bE62E3c3580375aE3723C145253060Ca0C2";
const AAVE_V3_POOL_DATA_PROVIDER = "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3";
```

### Configuration du Robot
```typescript
const ROBOT_CONFIG = {
  maxLoanAmount: parseUnits("1000000", 6), // 1M USDC
  minProfitThreshold: 50, // 0.5%
  maxGasPrice: 100, // Gwei
  autoRestart: true,
  riskLevel: "balanced"
};
```

## Événements

### FlashLoan
```solidity
event FlashLoan(
  address indexed target,
  address initiator,
  address indexed asset,
  uint256 amount,
  DataTypes.InterestRateMode interestRateMode,
  uint256 premium,
  uint16 indexed referralCode
);
```

## Erreurs Courantes

1. **INVALID_FLASHLOAN_EXECUTOR_RETURN**: Le contrat receveur n'a pas retourné true
2. **FLASHLOAN_DISABLED**: Les flash loans sont désactivés pour cet actif
3. **RESERVE_PAUSED**: La réserve est en pause
4. **RESERVE_INACTIVE**: La réserve est inactive
5. **INSUFFICIENT_LIQUIDITY**: Pas assez de liquidité disponible

## Ressources

- [Documentation Aave V3](https://docs.aave.com/developers/v/v3.0/)
- [Code source](https://github.com/aave/aave-v3-core)
- [ERC-3156 Standard](https://eips.ethereum.org/EIPS/eip-3156)
- [Chainlink Oracles](https://docs.chain.link/data-feeds)