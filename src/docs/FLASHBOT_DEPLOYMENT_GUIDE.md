# 🚀 Guide de Déploiement FlashBot THESORIA

Guide complet pour déployer et utiliser le Smart Contract FlashBot sur Polygon/Ethereum.

---

## 📋 Prérequis

### 1. Outils Nécessaires
- Node.js v18+ 
- MetaMask installé
- Git

### 2. Fonds Requis
- **Polygon Mainnet**: ~5-10 MATIC pour les frais de gas
- **Mumbai Testnet**: MATIC gratuits depuis [Polygon Faucet](https://faucet.polygon.technology/)
- **Ethereum Mainnet**: ~0.05-0.1 ETH pour déploiement

---

## 🛠️ Installation

### Étape 1: Installation des Dépendances

```bash
cd contracts
npm install
```

Packages installés:
- `hardhat` - Framework de développement
- `@aave/core-v3` - Contrats Aave V3
- `@openzeppelin/contracts` - Bibliothèque de contrats sécurisés
- `@uniswap/v2-periphery` - Interfaces DEX
- `ethers` - Bibliothèque Ethereum

### Étape 2: Configuration

Créez un fichier `.env` basé sur `.env.example`:

```bash
cp .env.example .env
```

Remplissez les variables:

```env
PRIVATE_KEY=your_metamask_private_key
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGONSCAN_API_KEY=your_api_key
```

⚠️ **IMPORTANT**: Ne JAMAIS commit votre `.env` avec la vraie clé privée!

### Étape 3: Compilation

```bash
npm run compile
```

Cela compile `FlashBot.sol` et génère les artifacts dans `/artifacts`.

---

## 🚢 Déploiement

### Option 1: Déploiement sur Mumbai Testnet (Recommandé pour débuter)

```bash
npm run deploy:mumbai
```

**Avantages**:
- Gratuit (MATIC testnet)
- Rapide pour tester
- Aucun risque financier

**Adresses Testnet Mumbai**:
- Aave Pool: `0x0b913A76beFF3887d35073b8e5530755D60F78C7`
- USDC: `0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e`

### Option 2: Déploiement sur Polygon Mainnet

```bash
npm run deploy:polygon
```

**Coût**: ~5-10 MATIC ($3-6 USD)

**Adresses Mainnet Polygon**:
- Aave Pool Provider: `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`
- QuickSwap Router: `0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff`
- SushiSwap Router: `0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506`

### Option 3: Déploiement sur Ethereum Mainnet

```bash
npm run deploy:ethereum
```

**Coût**: ~0.05-0.1 ETH ($100-200 USD)

⚠️ Plus cher mais liquidité maximale

---

## ✅ Vérification du Contrat

Après le déploiement, vérifiez automatiquement:

```bash
# Le script deploy.js le fait automatiquement
# Ou manuellement:
npx hardhat verify --network polygon ADRESSE_DU_CONTRAT \
  "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb" \
  "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff" \
  "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
```

Vérification sur:
- Polygon: https://polygonscan.com
- Ethereum: https://etherscan.io

---

## 🎮 Utilisation

### 1. Connecter l'IA Maître

Dans l'interface THESORIA:

1. Allez sur la page **"FlashBot Dashboard"**
2. Cliquez sur **"Connecter MetaMask"**
3. Approuvez la connexion
4. L'adresse du contrat se charge automatiquement depuis `deployment.json`

### 2. Exécuter un Flash Loan

#### Via l'Interface

1. Sélectionnez un **token** (USDC recommandé)
2. Entrez le **montant** (ex: 10000 USDC)
3. Cliquez sur **"Lancer Flash Loan"**
4. Confirmez dans MetaMask
5. Attendez la confirmation (15-30 secondes)

#### Via la Console IA

```typescript
// Dans le Centre de Commande IA
$ flashloan USDC 10000 arbitrage

// Réponse
🚀 Flash Loan lancé: 10000 USDC
📊 Stratégie: Arbitrage Uniswap ↔ SushiSwap
⏳ TX Hash: 0x1234...
💰 Profit estimé: +$247.50
```

### 3. Retirer les Profits

```typescript
// Interface Dashboard
Cliquez sur "Retirer" à côté du token

// Ou via contrat direct
await flashBotContract.withdraw(TOKEN_ADDRESS)
```

---

## 🧪 Tests Locaux

### Forking Polygon Mainnet

Test en local avec données réelles:

```bash
# Dans .env
FORKING=true
POLYGON_RPC_URL=https://polygon-rpc.com

# Lancer le node
npm run node

# Dans un autre terminal
npx hardhat test
```

### Tests Unitaires

```bash
npm run test
```

Tests inclus:
- ✅ Déploiement du contrat
- ✅ Exécution de Flash Loan
- ✅ Arbitrage DEX
- ✅ Calcul des profits
- ✅ Retraits

---

## 📊 Architecture du Système

```
┌─────────────────────────────────────────────────────────┐
│                   THESORIA PLATFORM                     │
│                                                         │
│  ┌──────────────┐         ┌──────────────┐            │
│  │ IA Maître    │────────▶│ FlashBot     │            │
│  │ (Frontend)   │         │ Dashboard    │            │
│  └──────────────┘         └──────────────┘            │
│         │                        │                      │
│         │                        │                      │
│         ▼                        ▼                      │
│  ┌────────────────────────────────────────┐            │
│  │  useFlashBotContract Hook              │            │
│  │  (Web3 Provider + Ethers.js)           │            │
│  └────────────────────────────────────────┘            │
│                      │                                  │
└──────────────────────┼──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN LAYER                        │
│                                                          │
│  ┌────────────────────────────────────────┐             │
│  │   FlashBot.sol Smart Contract          │             │
│  │   (Deployed on Polygon/Ethereum)       │             │
│  └────────────────────────────────────────┘             │
│              │              │              │             │
│              ▼              ▼              ▼             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ Aave V3      │ │ Uniswap V2   │ │ SushiSwap    │    │
│  │ Flash Loans  │ │ Router       │ │ Router       │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow d'un Flash Loan

```
1. IA Maître détecte une opportunité d'arbitrage
   ↓
2. Frontend appelle executeFlashLoan()
   ↓
3. Smart Contract requestFlashLoan() vers Aave
   ↓
4. Aave envoie les fonds au contrat
   ↓
5. Fonction executeOperation() est appelée
   ↓
6. Achat sur DEX 1 (ex: Uniswap)
   ↓
7. Vente sur DEX 2 (ex: SushiSwap)
   ↓
8. Calcul du profit
   ↓
9. Remboursement du Flash Loan + frais (0.09%)
   ↓
10. Profit reste dans le contrat
    ↓
11. Event émis → Frontend mis à jour
    ↓
12. Utilisateur peut retirer le profit
```

---

## 💰 Économie des Flash Loans

### Frais

| Élément | Coût | Notes |
|---------|------|-------|
| Flash Loan Aave | 0.09% | Du montant emprunté |
| Gas Polygon | ~0.01-0.05 MATIC | $0.01-0.03 |
| Gas Ethereum | ~0.005-0.02 ETH | $10-40 |
| Slippage DEX | 0.1-0.5% | Dépend de la liquidité |

### Profit Minimum Recommandé

- **Polygon**: >$50 par trade (frais faibles)
- **Ethereum**: >$200 par trade (frais élevés)

### Exemple Calcul

```
Montant emprunté: 10,000 USDC

Frais Aave: 10,000 × 0.09% = $9
Frais Gas: ~$0.02 MATIC
Frais DEX: 10,000 × 0.3% = $30

Total frais: ~$39

Profit brut: $150
Profit net: $150 - $39 = $111 ✅
ROI: 111 / 39 = 284%
```

---

## 🛡️ Sécurité

### Mécanismes de Protection

1. **Modifier onlyOwner**
   - Seul le propriétaire peut exécuter
   
2. **Circuit Breaker**
   - Transaction revert si profit négatif
   
3. **Validation Multi-Niveau**
   - Vérification des balances
   - Approbations limitées
   
4. **Emergency Withdraw**
   - Fonction d'urgence pour récupérer les fonds

### Best Practices

✅ **À FAIRE**:
- Tester sur testnet avant mainnet
- Commencer avec de petits montants
- Monitorer les transactions
- Retirer les profits régulièrement

❌ **À NE PAS FAIRE**:
- Exposer votre clé privée
- Flash Loans > $100k sans tests
- Ignorer les erreurs de slippage
- Utiliser sur Wi-Fi public

---

## 🐛 Dépannage

### Erreur: "Insufficient funds to repay"

**Cause**: Le profit n'a pas couvert les frais

**Solution**: 
- Augmenter minProfit
- Vérifier la liquidité des pools
- Choisir des paires moins volatiles

### Erreur: "Transaction reverted"

**Cause**: Problème dans executeOperation()

**Solution**:
```bash
# Vérifier les logs
npx hardhat console --network polygon
await flashBot.getBalance(USDC_ADDRESS)
```

### Erreur: "Nonce too low"

**Cause**: Transaction en double

**Solution**:
- Rafraîchir MetaMask
- Attendre la confirmation de la TX précédente

---

## 📈 Optimisations Avancées

### 1. Multi-Path Routing

Modifier `executeOperation()` pour tester plusieurs chemins:

```solidity
// Path 1: USDC → WETH → USDT
// Path 2: USDC → DAI → USDT
// Path 3: USDC → WMATIC → USDT

// Choisir le plus profitable
```

### 2. Gas Optimization

```solidity
// Utiliser assembly pour calculs
assembly {
    let profit := sub(amountOut, amountIn)
}
```

### 3. MEV Protection

```solidity
// Ajouter un deadline très court
deadline: block.timestamp + 30 // 30 secondes max
```

---

## 🚀 Prochaines Étapes

1. ✅ Déployer sur testnet
2. ✅ Tester avec 100 USDC
3. ✅ Vérifier les profits
4. ⬜ Déployer sur mainnet
5. ⬜ Connecter à l'IA Maître
6. ⬜ Automatiser avec des bots
7. ⬜ Scaler à $1M+ volume

---

## 📞 Support

- Documentation: `/docs/`
- Issues: GitHub
- Contact: contact@thesoria.io
- Discord: [THESORIA Community]

---

## 📜 Licence

MIT License - Voir LICENSE.md

---

**THESORIA FlashBot** - Le muscle de votre stratégie DeFi 💪⚡

*Dernière mise à jour: Décembre 2024*
