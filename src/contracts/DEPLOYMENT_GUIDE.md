# 🚀 Guide de Déploiement FlashBot - THESORIA

Guide complet pour déployer le Smart Contract FlashBot sur Polygon ou Gnosis Chain.

---

## 📋 Prérequis

### 1. Installation des Dépendances

```bash
cd contracts
npm install
```

### 2. Configuration MetaMask

#### Pour TESTNET (Mumbai - GRATUIT):
1. Ouvrez MetaMask
2. Ajoutez le réseau **Polygon Mumbai**:
   - Nom: Polygon Mumbai
   - RPC: `https://rpc-mumbai.maticvigil.com`
   - Chain ID: `80001`
   - Symbole: `MATIC`
   - Explorer: `https://mumbai.polygonscan.com`

3. Obtenez des MATIC gratuits:
   - https://faucet.polygon.technology/
   - Collez votre adresse MetaMask
   - Recevez 0.5 MATIC (suffisant pour déployer)

#### Pour MAINNET (Polygon - PRODUCTION):
1. Ajoutez le réseau **Polygon Mainnet** dans MetaMask
2. Achetez du MATIC (minimum 1 MATIC recommandé):
   - Sur Binance/Coinbase
   - Transférez vers votre wallet MetaMask
   - Coût de déploiement: ~0.05-0.15 MATIC (~$0.05-$0.15)

---

## 🔑 Configuration de la Clé Privée

### Option 1: Fichier .env (Recommandé)

Créez un fichier `.env` dans `/contracts/`:

```bash
# Clé privée de votre wallet (SANS le préfixe 0x)
WALLET_PRIVATE_KEY=votre_cle_privee_ici

# RPC URLs (optionnel - utilise les valeurs par défaut sinon)
POLYGON_RPC_URL=https://polygon-rpc.com
GNOSIS_RPC_URL=https://rpc.gnosischain.com

# API Keys pour vérification (optionnel)
POLYGONSCAN_API_KEY=your_key
GNOSISSCAN_API_KEY=your_key
```

**⚠️ IMPORTANT:**
- **NE JAMAIS** commiter le fichier `.env` sur Git
- Le fichier est déjà dans `.gitignore`
- Exportez votre clé privée depuis MetaMask:
  1. MetaMask → Compte → Menu (3 points)
  2. Account Details → Export Private Key
  3. Entrez votre mot de passe
  4. Copiez la clé (enlevez le `0x` au début)

### Option 2: Variable d'environnement temporaire

```bash
export WALLET_PRIVATE_KEY="votre_cle_privee"
```

---

## 🎯 Déploiement

### TESTNET (Mumbai - GRATUIT pour tester)

```bash
cd contracts
npx hardhat run scripts/deploy-flashbot.js --network mumbai
```

**Sortie attendue:**
```
╔═══════════════════════════════════════════════════════════╗
║  🚀 DÉPLOIEMENT SMART CONTRACT FLASHBOT - THESORIA       ║
╚═══════════════════════════════════════════════════════════╝

📡 Réseau: mumbai

📋 Configuration:
   Réseau:              Polygon Mumbai
   Aave Pool Provider:  0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6
   Uniswap Router:      0x8954AfA98594b838bda56FE4C12a09D7739D179b
   SushiSwap Router:    0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506

👤 Déployeur: 0x6852688c085cf61E58Bf14083573F7e96ce8a358
💰 Balance:   0.5 MATIC

⏳ Compilation du Smart Contract FlashBot...
⏳ Déploiement en cours...
⏳ Attente de la confirmation...

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

### MAINNET POLYGON (PRODUCTION RÉELLE)

```bash
cd contracts
npx hardhat run scripts/deploy-flashbot.js --network polygon
```

### MAINNET GNOSIS (GAS BAS - Recommandé pour production)

```bash
cd contracts
npx hardhat run scripts/deploy-flashbot.js --network gnosis
```

---

## ✅ Vérification du Contrat

Après le déploiement, vérifiez le code source sur l'explorateur:

### Mumbai (Testnet)
```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS> <AAVE_PROVIDER> <UNISWAP_ROUTER> <SUSHISWAP_ROUTER>
```

### Polygon Mainnet
```bash
npx hardhat verify --network polygon <CONTRACT_ADDRESS> 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506
```

---

## 🔗 Connexion au Frontend

Le script de déploiement met automatiquement à jour `/public/contracts/deployment.json`.

### Vérifier la Connexion

1. Démarrez le serveur Vite:
```bash
npm run dev
```

2. Ouvrez http://localhost:3000

3. Cliquez sur **"Connecter MetaMask"**

4. Le dashboard FlashBot devrait afficher:
   - ✅ Badge "LIVE PRODUCTION"
   - Adresse du contrat
   - Soldes des tokens
   - Bouton "Lancer Flash Loan"

---

## 🧪 Test d'un Flash Loan (TESTNET SEULEMENT)

### 1. Obtenez des tokens de test

Sur Mumbai, utilisez les faucets Aave:
- https://staging.aave.com/faucet/
- Connectez votre wallet
- Mint USDC, USDT, DAI de test

### 2. Lancez un Flash Loan de test

Dans le dashboard FlashBot:
1. Sélectionnez **USDC**
2. Montant: **1000** (1000 USDC)
3. Cliquez **"Lancer Flash Loan"**

**Note:** Le test échouera probablement car il n'y a pas d'opportunité d'arbitrage réelle. C'est normal! Le but est de vérifier que le contrat fonctionne.

---

## 📊 Monitoring

### Vérifier les Transactions

Après l'exécution d'un Flash Loan, vérifiez sur l'explorateur:

**Mumbai:**
```
https://mumbai.polygonscan.com/address/<CONTRACT_ADDRESS>
```

**Polygon:**
```
https://polygonscan.com/address/<CONTRACT_ADDRESS>
```

### Logs des Events

Le contrat émet 3 events principaux:
- `FlashLoanExecuted` - Flash Loan réussi
- `ArbitrageExecuted` - Arbitrage exécuté
- `ProfitWithdrawn` - Profit retiré

---

## 💰 Retrait des Profits

### Via le Dashboard

1. Ouvrez le FlashBot Dashboard
2. Section **"Soldes Contract"**
3. Cliquez **"Retirer"** à côté du token souhaité

### Via Console Web3

```javascript
// Se connecter au contrat
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  FLASH_BOT_ABI,
  signer
)

// Retirer USDC
await contract.withdraw("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174")

// Retirer MATIC
await contract.withdrawETH()
```

---

## 🚨 Dépannage

### Erreur: "Balance insuffisante"
- **Solution:** Ajoutez du MATIC dans votre wallet
- Testnet: Utilisez le faucet
- Mainnet: Achetez du MATIC

### Erreur: "Network not supported"
- **Solution:** Vérifiez que le réseau est bien configuré dans `hardhat.config.js`

### Erreur: "Missing private key"
- **Solution:** Vérifiez que `WALLET_PRIVATE_KEY` est bien dans le `.env`

### Erreur: "Insufficient funds to repay"
- **Solution:** Aucune opportunité d'arbitrage n'a été trouvée
- Sur testnet, c'est normal (pas de vrais arbitrages)
- Sur mainnet, attendez une meilleure opportunité

### Le contrat ne se charge pas dans le frontend
- **Solution 1:** Vérifiez `/public/contracts/deployment.json`
- **Solution 2:** Rechargez la page avec `Ctrl+Shift+R`
- **Solution 3:** Vérifiez que MetaMask est sur le bon réseau

---

## 📁 Fichiers de Déploiement

Après déploiement, vous aurez:

```
contracts/
├── deployments/
│   ├── mumbai.json         # Info déploiement Mumbai
│   ├── polygon.json        # Info déploiement Polygon
│   └── gnosis.json         # Info déploiement Gnosis
│
public/contracts/
└── deployment.json         # Utilisé par le frontend
```

**Contenu de `deployment.json`:**
```json
{
  "network": "polygon",
  "networkName": "Polygon",
  "contractAddress": "0xABC123...",
  "owner": "0x685268...",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "addressProvider": "0xa97684...",
  "uniswapRouter": "0xa5E082...",
  "sushiswapRouter": "0x1b02dA...",
  "explorerUrl": "https://polygonscan.com/address/0xABC123...",
  "gasPrice": "30 Gwei"
}
```

---

## 🎯 Passage en Production

### Checklist Avant Production

- [ ] ✅ Testé sur Mumbai avec succès
- [ ] ✅ Vérifié le code sur l'explorateur
- [ ] ✅ Solde suffisant en MATIC (minimum 1 MATIC)
- [ ] ✅ Clé privée sécurisée (backup)
- [ ] ✅ Paramètres de profit minimum configurés
- [ ] ✅ Monitoring actif (Telegram/Discord alerts)

### Recommandations Production

1. **Commencez petit:**
   - Flash Loans de 1,000-5,000 USDC
   - Profit minimum: 100+ USDC
   - Testez pendant 24-48h

2. **Surveillez:**
   - Gas prices (évitez >100 Gwei)
   - Slippage des DEX
   - Liquidité des pools

3. **Sécurité:**
   - Ne partagez JAMAIS votre clé privée
   - Utilisez un wallet dédié
   - Activez 2FA sur MetaMask mobile

4. **Scaling:**
   - Augmentez progressivement les montants
   - Diversifiez les paires de tokens
   - Utilisez plusieurs DEX

---

## 🆘 Support

### Documentation
- Aave V3: https://docs.aave.com/developers/
- Hardhat: https://hardhat.org/docs
- Polygon: https://docs.polygon.technology/

### Communauté THESORIA
- GitHub Issues: Créez une issue pour les bugs
- Discord: (votre lien Discord ici)
- Telegram: (votre lien Telegram ici)

---

## ⚖️ Licence

MIT License - THESORIA 2025

**Disclaimer:** Les Flash Loans et l'arbitrage comportent des risques. Testez toujours sur testnet avant la production. Ne tradez jamais plus que ce que vous pouvez vous permettre de perdre.

---

**🎉 Félicitations! Votre FlashBot est prêt pour la production!**
