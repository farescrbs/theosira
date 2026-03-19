# 🔥 THESORIA - MEV GOD MODE 🔥

## Orchestrateur Asynchrone de Haute Fréquence
**Production Ready - Profits Réels - IA Maître Autonome**

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  ⚡ Flash Loans Aave V3                                                      ║
║  📊 Multi-DEX Arbitrage (Uniswap V2/V3, Sushiswap, Pancake)                ║
║  🤖 IA Autonome avec ML Predictions                                        ║
║  🔒 Protection Flashbots MEV                                               ║
║  💰 Profits Réels Temps Réel                                               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 🚀 INSTALLATION RAPIDE

### 1️⃣ **Backend Python**

```bash
cd production/mev_god_mode

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OU
venv\Scripts\activate  # Windows

# Installer dépendances
pip install -r requirements.txt

# Configuration
cp .env.example .env
# Éditer .env avec vos clés
```

### 2️⃣ **Smart Contract**

```bash
cd contracts

# Installer Foundry (si pas déjà installé)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compiler
forge build

# Déployer sur Ethereum Mainnet
forge create --rpc-url $ETHEREUM_RPC \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --verify \
  contracts/FlashLoanGodMode.sol:FlashLoanGodMode \
  --constructor-args \
    0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e \  # Aave AddressProvider
    0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D \  # Uniswap V2
    0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F \  # Sushiswap
    0xE592427A0AEce92De3Edee1F18E0157C05861564    # Uniswap V3

# Copier l'adresse du contrat dans .env
```

### 3️⃣ **Frontend React**

```bash
# Retour à la racine
cd ../../../

# L'app est déjà configurée, juste rebuild
npm install
npm run dev
```

---

## ⚙️ CONFIGURATION

### **Clés Obligatoires** (.env)

```env
# RPC (Alchemy recommandé)
ETHEREUM_RPC=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ETHEREUM_WS=wss://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Wallet (⚠️ SÉCURITÉ!)
PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Smart Contract déployé
FLASH_LOAN_EXECUTOR=0xVOTRE_CONTRAT_DEPLOYE

# IA (optionnel mais recommandé)
OPENAI_API_KEY=sk-YOUR_KEY
```

### **Whitelist Tokens**

Avant de trader, whitelist les tokens sur le smart contract :

```python
# Via script Python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider(os.getenv('ETHEREUM_RPC')))
contract = w3.eth.contract(address=FLASH_LOAN_EXECUTOR, abi=ABI)

# Whitelist WETH
tx = contract.functions.whitelistToken(
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',  # WETH
    True
).build_transaction({...})
```

---

## 🎯 DÉMARRAGE

### **1. Lancer Backend Python**

```bash
cd production/mev_god_mode
python main.py
```

Vous devriez voir :

```
╔══════════════════════════════════════════════════════════════════╗
║          🔥 THESORIA MEV GOD MODE - DÉMARRAGE 🔥                ║
╚══════════════════════════════════════════════════════════════════╝

✅ Wallet connecté: 0x1234...5678
💰 Balance Ethereum: 1.2345 ETH
🔍 Démarrage monitoring mempool...
📊 Démarrage scan arbitrage...
🌐 WebSocket frontend: ws://localhost:8765
```

### **2. Lancer Frontend**

```bash
# Autre terminal
npm run dev
```

Ouvrir : `http://localhost:3000`

### **3. Connecter Wallet**

1. Cliquer **"Connecter MetaMask"**
2. Approuver la connexion
3. Vérifier que "Backend Python" est **Online**
4. Cliquer **"Démarrer Bot MEV"**

✅ **Le bot est maintenant actif !**

---

## 📊 STRATÉGIES MEV

### **8 Stratégies Implémentées**

| Stratégie | Risque | ROI Estimé | Description |
|-----------|--------|------------|-------------|
| **Arbitrage DEX** | Medium | 0.5-3% | Différences prix entre DEX |
| **Liquidation** | Low | 2-8% | Liquidation positions sous-collatéralisées |
| **Refinancement** | Low | 0.1-0.5% | Optimisation dette |
| **Tri-DEX Arbitrage** | High | 1-5% | Cycle 3+ DEX |
| **Front-Running** | High | 3-15% | Anticiper transactions mempool |
| **Back-Running** | Medium | 1-7% | Profiter après grosse tx |
| **Sandwich Attack** | High | 5-20% | Front + Back combinés |
| **Liquidation Premium** | Medium | 8-25% | Bonus liquidateur Aave/Compound |

### **IA Maître Autonome**

L'IA prend des décisions basées sur :

- **Risk Score** : Calcul probabilité échec
- **Profit Probability** : ML prediction succès
- **Historical Performance** : Learning des trades passés
- **Market Conditions** : Gas price, spread, liquidité

**Seuils Décision :**
- Risk < 0.7
- Profit Probability > 0.75
- Profit > $50 USD

---

## 💰 GESTION PROFITS

### **Retrait Profits**

Les profits s'accumulent sur le smart contract. Pour retirer :

```bash
# Via interface React (à venir)
# OU via Etherscan
# OU script Python:

contract.functions.emergencyWithdraw(WETH_ADDRESS).transact({
    'from': your_address,
    'gas': 100000
})
```

### **Stats Temps Réel**

Le frontend affiche :
- ✅ **Total Profit** : Cumulé depuis démarrage
- ✅ **Total Trades** : Nombre exécutions
- ✅ **Win Rate** : % succès
- ✅ **Profit Moyen** : Par trade

---

## 🔒 SÉCURITÉ

### **Protection MEV**

- ✅ **Flashbots** : Transactions privées, pas de frontrunning
- ✅ **Slippage Protection** : 0.5% max
- ✅ **Gas Limit** : 300 Gwei max
- ✅ **Emergency Stop** : Pause instantanée

### **Smart Contract Security**

- ✅ Reentrancy Guard
- ✅ Owner-only functions
- ✅ Token whitelist
- ✅ Emergency withdraw

### **Best Practices**

⚠️ **JAMAIS commit .env sur Git**
⚠️ **Utiliser hardware wallet (Ledger/Trezor) en production**
⚠️ **Commencer avec petits montants** (10-100 USD)
⚠️ **Monitor gas price** avant exécution
⚠️ **Backup private keys** de manière sécurisée

---

## 📈 MONITORING

### **Logs Python**

Tous les événements sont loggés :

```
2025-12-24 15:23:45 | INFO | 🎯 OPPORTUNITÉ DÉTECTÉE: $127.32
2025-12-24 15:23:46 | INFO | 🤖 IA: Arbitrage Uniswap V2 → Sushiswap, Spread: 1.85%, Risque: 30.0%, Probabilité succès: 90.0%
2025-12-24 15:23:47 | INFO | ⚡ EXÉCUTION: Uniswap V2 → Sushiswap
2025-12-24 15:23:48 | INFO | 💰 Profit estimé: $127.32
2025-12-24 15:24:15 | INFO | ✅ Transaction envoyée: 0xabc123...
2025-12-24 15:24:45 | INFO | 🎉 SUCCÈS! Profit: $127.32
```

### **Prometheus + Grafana** (Optionnel)

```bash
# Lancer monitoring stack
docker-compose -f monitoring/docker-compose.yml up -d

# Grafana: http://localhost:3001
# Prometheus: http://localhost:9090
```

---

## 🐛 TROUBLESHOOTING

### **Backend déconnecté**

```bash
# Vérifier que main.py tourne
ps aux | grep main.py

# Relancer si nécessaire
cd production/mev_god_mode
python main.py
```

### **Wallet pas connecté**

- Installer MetaMask extension
- Vérifier réseau : Ethereum Mainnet
- Hard refresh : `Ctrl + Shift + R`

### **Gas price trop élevé**

Modifier dans `.env` :

```env
MAX_GAS_PRICE_GWEI=150  # Réduire si trop cher
```

### **Pas d'opportunités détectées**

C'est normal ! Les opportunités MEV sont rares et compétitives.

- Augmenter liquidité (plus de ETH)
- Réduire `MIN_PROFIT_USD` (attention aux gas fees)
- Scanner plus de DEX
- Activer plus de stratégies

---

## 📚 RESSOURCES

- **Aave V3 Docs** : https://docs.aave.com/developers/
- **Flashbots** : https://docs.flashbots.net/
- **Uniswap V2** : https://docs.uniswap.org/contracts/v2/overview
- **MEV Explained** : https://ethereum.org/en/developers/docs/mev/

---

## ⚖️ DISCLAIMER

⚠️ **RISQUES**

- Trading crypto = risque total perte capital
- MEV = compétition intense
- Gas fees peuvent dépasser profits
- Smart contracts = risque bugs

**Utilisez à vos propres risques. Pas de garantie de profits.**

---

## 📞 SUPPORT

- **GitHub Issues** : Pour bugs techniques
- **Discord** : Pour questions générales
- **Docs** : `/docs/MEV_GUIDE.md`

---

## 🏆 LICENCE

MIT License - Libre d'utilisation et modification

---

**Made with 🔥 by THESORIA Team**

*"From Zero to MEV God"*
