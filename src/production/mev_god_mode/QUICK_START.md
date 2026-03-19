# ⚡ QUICK START - MEV GOD MODE ⚡

## 🚀 Lancer en 5 Minutes

### ✅ **Prérequis**

- Python 3.10+
- Node.js 18+
- MetaMask installé
- ETH sur wallet (minimum 0.1 ETH pour tests)
- Clés API : Alchemy, OpenAI (optionnel)

---

## 📋 **ÉTAPE 1 : Installation Backend**

```bash
# Cloner/Naviguer
cd production/mev_god_mode

# Environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OU venv\Scripts\activate  # Windows

# Installer
pip install -r requirements.txt

# Configuration
cp .env.example .env
nano .env  # Éditer avec vos clés
```

### **Clés Minimales (.env)**

```env
# RPC (Alchemy gratuit tier OK)
ETHEREUM_RPC=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ETHEREUM_WS=wss://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Wallet (⚠️ Testez d'abord avec petit montant!)
PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Smart Contract (après déploiement)
FLASH_LOAN_EXECUTOR=0xVOTRE_CONTRAT

# Optionnel
OPENAI_API_KEY=sk-YOUR_KEY
```

---

## 📋 **ÉTAPE 2 : Déployer Smart Contract**

### **Option A : Test sur Sepolia (Recommandé d'abord)**

```bash
cd contracts

# Installer Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compiler
forge build

# Déployer sur Sepolia
forge create --rpc-url https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY \
  --private-key $PRIVATE_KEY \
  contracts/FlashLoanGodMode.sol:FlashLoanGodMode \
  --constructor-args \
    0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A \  # Aave Sepolia
    0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D \  # Uniswap V2
    0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F \  # Sushiswap
    0xE592427A0AEce92De3Edee1F18E0157C05861564    # Uniswap V3
```

### **Option B : Production Mainnet**

```bash
# Déployer sur Mainnet (⚠️ Coûts gas!)
forge create --rpc-url $ETHEREUM_RPC \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key $ETHERSCAN_KEY \
  --verify \
  contracts/FlashLoanGodMode.sol:FlashLoanGodMode \
  --constructor-args \
    0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e \  # Aave Mainnet
    0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D \
    0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F \
    0xE592427A0AEce92De3Edee1F18E0157C05861564
```

**Copier l'adresse du contrat dans .env**

---

## 📋 **ÉTAPE 3 : Whitelist Tokens**

```python
# Créer script: whitelist_tokens.py
from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv()

w3 = Web3(Web3.HTTPProvider(os.getenv('ETHEREUM_RPC')))

# ABI simplifié (juste whitelistToken)
abi = [{
    "inputs": [{"name": "token", "type": "address"}, {"name": "status", "type": "bool"}],
    "name": "whitelistToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}]

contract = w3.eth.contract(
    address=os.getenv('FLASH_LOAN_EXECUTOR'),
    abi=abi
)

# Whitelist WETH
weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
tx = contract.functions.whitelistToken(weth, True).build_transaction({
    'from': w3.eth.account.from_key(os.getenv('PRIVATE_KEY')).address,
    'nonce': w3.eth.get_transaction_count(w3.eth.account.from_key(os.getenv('PRIVATE_KEY')).address),
    'gas': 100000,
    'gasPrice': w3.eth.gas_price
})

signed = w3.eth.account.sign_transaction(tx, os.getenv('PRIVATE_KEY'))
tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
print(f"Whitelisted WETH: {tx_hash.hex()}")

# Répéter pour USDC, DAI, etc.
```

```bash
python whitelist_tokens.py
```

---

## 📋 **ÉTAPE 4 : Lancer Backend**

```bash
cd production/mev_god_mode
python main.py
```

**Vous devriez voir :**

```
╔══════════════════════════════════════════════════════════════════╗
║          🔥 THESORIA MEV GOD MODE - DÉMARRAGE 🔥                ║
╚══════════════════════════════════════════════════════════════════╝

✅ Wallet connecté: 0x1234...5678
💰 Balance Ethereum: 0.2500 ETH
🔍 Démarrage monitoring mempool...
📊 Démarrage scan arbitrage...
🌐 WebSocket frontend: ws://localhost:8765

2025-12-24 16:30:15 | INFO | 🎯 OPPORTUNITÉ DÉTECTÉE: $87.50
```

**Laissez ce terminal ouvert !**

---

## 📋 **ÉTAPE 5 : Lancer Frontend**

**Nouveau terminal :**

```bash
# Racine du projet
cd ../../../
npm install
npm run dev
```

Ouvrir : **http://localhost:3000**

---

## 📋 **ÉTAPE 6 : Connecter & Trader**

1. **Cliquez "MEV GOD"** dans le menu
2. **Connecter MetaMask**
   - Cliquez "Connecter MetaMask"
   - Approuvez dans MetaMask
   - Vérifiez que balance s'affiche

3. **Vérifier Statuts**
   - ✅ Wallet : Connecté
   - ✅ Backend Python : Online
   - ✅ MEV Bot : Prêt

4. **Démarrer Bot**
   - Cliquez "Démarrer Bot MEV"
   - Le bot scan automatiquement

5. **Profit !**
   - Les opportunités s'affichent en temps réel
   - L'IA décide automatiquement si profitable
   - Exécution automatique si > $50 profit

---

## 🎯 **VÉRIFICATIONS**

### ✅ Backend OK ?

```bash
# Doit afficher
🌐 WebSocket frontend: ws://localhost:8765
```

### ✅ Frontend OK ?

```
VITE ready in XXXms
➜  Local:   http://localhost:3000/
```

### ✅ Wallet OK ?

- MetaMask connecté
- Balance > 0.1 ETH
- Réseau : Ethereum Mainnet (ou Sepolia test)

### ✅ Smart Contract OK ?

```bash
# Vérifier sur Etherscan
https://etherscan.io/address/VOTRE_CONTRAT_ADDRESS
```

---

## 🐛 **Troubleshooting Rapide**

### **Backend déconnecté**

```bash
# Vérifier que main.py tourne
ps aux | grep main.py

# Relancer
cd production/mev_god_mode
python main.py
```

### **Erreur "Module not found"**

```bash
pip install -r requirements.txt
```

### **WebSocket erreur**

```bash
# Port déjà utilisé ?
lsof -i :8765
kill -9 <PID>
```

### **Gas price trop élevé**

```env
# Dans .env
MAX_GAS_PRICE_GWEI=150  # Réduire
```

---

## 💰 **Premier Trade**

1. **Commencer petit** : MIN_PROFIT_USD=20
2. **Observer logs** pendant 5-10 min
3. **Vérifier opportunités** détectées
4. **Premier profit** = Célébrer ! 🎉

---

## 📊 **Monitoring**

```bash
# Logs Python
tail -f production/mev_god_mode/logs/mev.log

# Stats temps réel
# Frontend : Section stats

# Etherscan : Vérifier transactions
https://etherscan.io/address/VOTRE_WALLET
```

---

## 🔒 **Sécurité**

⚠️ **AVANT PRODUCTION :**

1. **Testez sur Sepolia d'abord**
2. **Commencez avec 0.1-0.5 ETH max**
3. **Sauvegardez private key** offline
4. **Jamais commit .env sur Git**
5. **Utilisez hardware wallet** si possible

---

## 📈 **Optimisations**

### **Augmenter Profits**

```env
MIN_PROFIT_USD=30  # Réduire seuil
MAX_GAS_PRICE_GWEI=500  # Augmenter max gas
```

### **Ajouter DEX**

Modifier `main.py` :
- Ajouter PancakeSwap (BSC)
- Ajouter Curve
- Ajouter Balancer

### **ML Avancé**

Entraîner modèle :
```bash
python train_ml_model.py  # À créer
```

---

## 🎓 **Ressources**

- **Logs** : `production/mev_god_mode/logs/`
- **Docs** : `production/mev_god_mode/README.md`
- **Smart Contract** : `production/mev_god_mode/contracts/`

---

## ✅ **Checklist Finale**

- [ ] Backend Python running
- [ ] Frontend React running
- [ ] MetaMask connecté
- [ ] Smart contract déployé
- [ ] Tokens whitelisted
- [ ] Balance > 0.1 ETH
- [ ] Bot démarré

**Si tout est ✅ → VOUS ÊTES UN MEV GOD ! 🔥**

---

**Temps total installation : 10-15 minutes**

**Premier profit : 5-30 minutes (selon opportunités marché)**

**Good luck, anon! 🚀**
