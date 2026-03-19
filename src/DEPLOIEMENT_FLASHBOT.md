# 🚀 GUIDE DE DÉPLOIEMENT FLASHBOT - THESORIA

Guide ultra-simplifié pour déployer votre Smart Contract FlashBot et passer en mode production réelle.

---

## ⚡ DÉPLOIEMENT RAPIDE (5 Minutes)

### Étape 1: Configuration (1 min)

```bash
cd contracts
cp .env.example .env
nano .env  # ou utilisez votre éditeur préféré
```

Ajoutez votre clé privée MetaMask:
```
WALLET_PRIVATE_KEY=votre_cle_sans_0x
```

**Comment obtenir la clé privée:**
1. Ouvrez MetaMask
2. Cliquez sur les **3 points** → **Account Details**
3. **Export Private Key**
4. Entrez votre mot de passe
5. Copiez (enlevez le `0x` au début)

### Étape 2: Obtenir des Tokens (2 min)

#### Pour TESTNET (GRATUIT):
- **Polygon Mumbai**: https://faucet.polygon.technology/
- Connectez MetaMask, obtenez 0.5 MATIC gratuit

#### Pour MAINNET (Production):
- Achetez 1 MATIC sur Binance/Coinbase (~$1)
- Transférez vers votre wallet MetaMask

### Étape 3: Déploiement (2 min)

```bash
cd contracts
chmod +x deploy-quick.sh
./deploy-quick.sh
```

Le script vous guidera automatiquement! ✨

---

## 📋 Commandes Directes

### TESTNET (Gratuit - Recommandé pour tester)

```bash
cd contracts
npm install
npx hardhat run scripts/deploy-flashbot.js --network mumbai
```

### MAINNET POLYGON (~$0.05)

```bash
npx hardhat run scripts/deploy-flashbot.js --network polygon
```

### MAINNET GNOSIS (~$1-3) ⭐ GAS BAS

```bash
npx hardhat run scripts/deploy-flashbot.js --network gnosis
```

---

## ✅ Vérification Post-Déploiement

### 1. Le Contrat est Déployé

Après le déploiement, vous verrez:

```
╔═══════════════════════════════════════════════════════════╗
║  ✅ DÉPLOIEMENT RÉUSSI!                                  ║
╚═══════════════════════════════════════════════════════════╝

📍 Contract Address: 0xABC123...
👤 Owner:            0x685268...
📡 Réseau:           Polygon Mumbai
🔗 Explorer:         https://mumbai.polygonscan.com/address/0xABC123...

💾 Infos sauvegardées: contracts/deployments/mumbai.json
💾 Frontend mis à jour: /public/contracts/deployment.json
```

### 2. Vérifier le Fichier deployment.json

```bash
cat public/contracts/deployment.json
```

Vous devriez voir:
```json
{
  "contractAddress": "0xABC123...",
  "network": "mumbai",
  "owner": "0x685268...",
  ...
}
```

### 3. Tester la Connexion Frontend

```bash
# Dans un autre terminal
npm run dev
```

Ouvrez http://localhost:3000
1. Cliquez **"Connecter MetaMask"**
2. Le badge devrait afficher **"LIVE PRODUCTION"** 🟢
3. L'adresse du contrat s'affiche
4. Les soldes sont visibles

---

## 🎯 Test d'un Flash Loan (Testnet)

### 1. Obtenez des Tokens de Test

Sur Polygon Mumbai:
- https://staging.aave.com/faucet/
- Connectez votre wallet
- Mint **USDC**, **USDT**, **DAI**

### 2. Lancez un Test

Dans le FlashBot Dashboard:
1. Sélectionnez **USDC**
2. Montant: **1000**
3. Cliquez **"Lancer Flash Loan"**

⚠️ Le test échouera probablement (pas d'arbitrage réel sur testnet). C'est **NORMAL**! Le but est de vérifier que le contrat fonctionne.

### 3. Vérifiez la Transaction

Allez sur l'explorateur (lien dans la notification) pour voir:
- ✅ Transaction envoyée
- ✅ Contrat appelé
- ⚠️ Revert (normal sans opportunité d'arbitrage)

---

## 💰 Passage en Production MAINNET

### Checklist Avant Production

- [ ] ✅ Testé sur Mumbai avec succès
- [ ] ✅ Contrat vérifié sur l'explorateur
- [ ] ✅ Au moins 1 MATIC dans le wallet
- [ ] ✅ Clé privée sauvegardée de manière sécurisée
- [ ] ✅ Compréhension des risques

### Déploiement Production

```bash
cd contracts
npx hardhat run scripts/deploy-flashbot.js --network polygon
```

### Recommandations

1. **Commencez Petit**
   - Flash Loans de 1,000-5,000 USDC
   - Profit minimum: 100+ USDC
   - Testez 24-48h

2. **Surveillez les Coûts**
   - Gas price < 100 Gwei
   - Frais Aave: 0.09%
   - Profit min > Frais totaux

3. **Sécurité**
   - Wallet dédié pour le trading
   - Retirez les profits régulièrement
   - Ne partagez jamais votre clé privée

---

## 🔧 Vérification du Contrat sur l'Explorateur

### Pourquoi Vérifier?

- ✅ Transparence du code
- ✅ Possibilité d'interagir directement
- ✅ Confiance des utilisateurs

### Commande

```bash
npx hardhat verify --network polygon <CONTRACT_ADDRESS> <AAVE_PROVIDER> <UNISWAP_ROUTER> <SUSHISWAP_ROUTER>
```

### Exemple pour Polygon:

```bash
npx hardhat verify --network polygon 0xYourContractAddress \
  0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb \
  0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff \
  0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506
```

---

## 📊 Coûts de Déploiement

| Réseau | Coût | Temps | Recommandation |
|--------|------|-------|----------------|
| **Mumbai** | Gratuit 🆓 | ~30s | ⭐ Pour tester |
| **Gnosis** | ~$1-3 | ~10s | ⭐⭐⭐ Production |
| **Polygon** | ~$0.05-0.15 | ~5s | ⭐⭐ Production |
| **Arbitrum** | ~$0.10-0.30 | ~2s | ⭐⭐ Production |
| **Ethereum** | ~$30-100 | ~15s | ❌ Trop cher |

---

## 🚨 Dépannage Rapide

### ❌ "Balance insuffisante"
```bash
# Testnet: Utilisez le faucet
# Mainnet: Achetez du MATIC
```

### ❌ "Private key not configured"
```bash
# Vérifiez contracts/.env
cat contracts/.env | grep WALLET_PRIVATE_KEY
```

### ❌ "Network not supported"
```bash
# Réseaux disponibles:
# mumbai, polygon, gnosis, arbitrum, mainnet, sepolia
```

### ❌ "Insufficient funds to repay"
```bash
# Normal sur testnet - pas d'opportunité d'arbitrage réelle
# Sur mainnet, attendez une meilleure opportunité
```

### ❌ Le frontend ne charge pas le contrat
```bash
# Vérifiez le fichier
cat public/contracts/deployment.json

# Rechargez le frontend
# Ctrl+Shift+R dans le navigateur
```

---

## 📁 Fichiers Créés Automatiquement

Après déploiement:

```
contracts/
├── deployments/
│   ├── mumbai.json        # Info Mumbai
│   ├── polygon.json       # Info Polygon
│   └── gnosis.json        # Info Gnosis
│
public/contracts/
└── deployment.json         # Utilisé par le frontend
```

---

## 🆘 Besoin d'Aide?

### Documentation Complète
- `/contracts/DEPLOYMENT_GUIDE.md` - Guide détaillé
- `/contracts/README.md` - Documentation contrats

### Resources Externes
- Aave: https://docs.aave.com/developers/
- Hardhat: https://hardhat.org/docs
- Polygon: https://docs.polygon.technology/

### Support
- GitHub Issues
- Discord THESORIA (si disponible)

---

## 🎉 C'est Parti!

```bash
cd contracts
./deploy-quick.sh
```

**Votre FlashBot sera déployé et opérationnel en 5 minutes!** 🚀💰

---

## 📈 Roadmap Post-Déploiement

### Semaine 1: Test (Testnet)
- [x] Déployer sur Mumbai
- [ ] Tester 10+ Flash Loans
- [ ] Vérifier les events
- [ ] Tester les retraits

### Semaine 2: Petit Capital (Mainnet)
- [ ] Déployer sur Polygon/Gnosis
- [ ] Flash Loans 1,000-5,000 USDC
- [ ] Profit min: 100 USDC
- [ ] Surveiller 24/7

### Mois 1: Scale Up
- [ ] Augmenter à 10,000-25,000 USDC
- [ ] Diversifier les paires
- [ ] Optimiser les stratégies
- [ ] Automatisation complète

### Objectif 3 Mois: $50k-120k
- [ ] Flash Loans 50,000+ USDC
- [ ] Multi-pools MEV
- [ ] ROI > 1.5% par trade
- [ ] Profit target atteint! 🎯

---

**Bonne chance avec THESORIA FlashBot! 💎🚀**
