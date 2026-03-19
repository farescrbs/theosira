# 🎯 COMMANDES ESSENTIELLES

## Guide ultra-rapide des commandes THESORIA

---

## 🚀 DÉMARRAGE RAPIDE

### Test Ultra-Rapide (10 secondes)
```bash
chmod +x test_quick.sh
./test_quick.sh
```
→ Vérifie configuration + connexion blockchain

---

### Test Complet (1 minute)
```bash
chmod +x run_tests.sh
./run_tests.sh
```
→ Teste TOUS les composants

---

### Installation Automatique
```bash
chmod +x install.sh
./install.sh
```
→ Installe dépendances + configure système

---

### Lancement Système
```bash
chmod +x 🚀_PRODUCTION_LAUNCHER.sh
./🚀_PRODUCTION_LAUNCHER.sh
```
→ Menu interactif pour choisir mode

---

## 📋 TESTS DISPONIBLES

| Script | Durée | Description |
|--------|-------|-------------|
| `./test_quick.sh` | 10s | Test minimal configuration |
| `./run_tests.sh` | 1min | Tests complets système |
| `python3 test_system.py` | 1min | Tests détaillés avec rapport |

---

## 🎮 MODES LANCEMENT

### 1️⃣ Mode Démo
```bash
./🚀_PRODUCTION_LAUNCHER.sh
→ Choisir: 1
```
- Simulation complète
- 0 configuration requise
- Idéal pour apprendre

### 2️⃣ Mode Testnet
```bash
./🚀_PRODUCTION_LAUNCHER.sh
→ Choisir: 2
```
- Transactions testnet réelles
- Gratuit (faucets)
- Tester stratégies

### 3️⃣ Mode Production
```bash
./🚀_PRODUCTION_LAUNCHER.sh
→ Choisir: 3
```
- ⚠️ Argent RÉEL
- Smart contract déployé requis
- Capital recommandé: $1,000+

### 4️⃣ Mode Surveillance
```bash
./🚀_PRODUCTION_LAUNCHER.sh
→ Choisir: 4
```
- Monitoring uniquement
- Aucune exécution
- Analyse opportunités

### 5️⃣ Installation Smart Contracts
```bash
./🚀_PRODUCTION_LAUNCHER.sh
→ Choisir: 5
```
- Compile contrats
- Déploie testnet/mainnet
- Configure addresses

---

## 🔧 CONFIGURATION

### Éditer Configuration
```bash
nano backend/.env
```

### Variables Critiques
```bash
WALLET_ADDRESS=0x...           # Ton wallet Ethereum
WALLET_PRIVATE_KEY=...         # Clé privée (SECRÈTE!)
ETH_RPC_URL=...                # RPC endpoint
ARBITRAGE_CONTRACT_ADDRESS=0x  # Après déploiement
```

### Modes
```bash
TESTNET_MODE=false             # true = testnet
DEMO_MODE=true                 # true = simulation
AUTO_EXECUTE=false             # true = auto-trading
```

---

## 🏗️ SMART CONTRACTS

### Compiler
```bash
cd contracts
npm install
npx hardhat compile
```

### Déployer Testnet (Gratuit)
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Déployer Mainnet (⚠️ Coûte gas)
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Vérifier sur Etherscan
```bash
npx hardhat verify --network mainnet CONTRACT_ADDRESS ARGS...
```

---

## 📊 MONITORING

### Logs Temps Réel
```bash
# Arbitrage
tail -f logs/arbitrage_prod.log

# Monitor
tail -f logs/monitor.log

# WebSocket
tail -f logs/websocket.log

# Tous les logs
tail -f logs/*.log
```

### Rechercher Opportunités
```bash
grep "OPPORTUNITÉ" logs/arbitrage_prod.log
grep "Profit net" logs/arbitrage_prod.log
grep "EXÉCUTION" logs/arbitrage_prod.log
```

### Compter Statistiques
```bash
# Opportunités trouvées
grep -c "OPPORTUNITÉ" logs/arbitrage_prod.log

# Trades exécutés
grep -c "Arbitrage réussi" logs/arbitrage_prod.log
```

---

## 🌐 ACCÈS WEB

### Interfaces
```
http://localhost:5173          # Frontend principal
http://localhost:5173/live     # Dashboard live trading
ws://localhost:8765            # WebSocket endpoint
```

### Ouvrir Browser
```bash
# Linux
xdg-open http://localhost:5173

# macOS
open http://localhost:5173

# Windows
start http://localhost:5173
```

---

## 🛠️ MAINTENANCE

### Arrêter Tous Processus
```bash
# Via CTRL+C dans launcher

# Ou forcer:
pkill -f "python3 god_mode_bot.py"
pkill -f "python3 real_arbitrage_detector.py"
pkill -f "python3 websocket_server.py"
pkill -f "npm run dev"
```

### Nettoyer Logs
```bash
rm -rf logs/*.log
mkdir -p logs
```

### Réinstaller Dépendances
```bash
# Python
cd backend
pip3 install -r requirements.txt

# Node.js
cd ..
npm install

# Contracts
cd contracts
npm install
```

### Reset Complet
```bash
# Arrêter tout
pkill -f python3
pkill -f node

# Nettoyer
rm -rf logs/*.log
rm -rf backend/__pycache__
rm -rf node_modules
rm -rf contracts/node_modules

# Réinstaller
./install.sh
```

---

## 🐍 PYTHON DIRECT

### Lancer Composants Individuellement

#### Bot Simulation
```bash
cd backend
python3 god_mode_bot.py
```

#### Détecteur Arbitrage Réel
```bash
cd backend
python3 real_arbitrage_detector.py
```

#### WebSocket Server
```bash
cd backend
python3 websocket_server.py
```

#### Monitor
```bash
cd backend
python3 quantum_monitor.py
```

#### Auto-Backup
```bash
cd backend
python3 auto_backup.py
```

---

## 🧪 TESTS PYTHON

### Test Configuration Rapide
```bash
cd backend
python3 -c "from dotenv import load_dotenv; import os; load_dotenv(); print('RPC:', os.getenv('ETH_RPC_URL'))"
```

### Test Connexion Web3
```bash
cd backend
python3 << 'EOF'
from web3 import Web3
import os
from dotenv import load_dotenv
load_dotenv()
w3 = Web3(Web3.HTTPProvider(os.getenv("ETH_RPC_URL")))
print("Connecté:", w3.is_connected())
print("Bloc:", w3.eth.block_number)
EOF
```

### Test Balance Wallet
```bash
cd backend
python3 << 'EOF'
from web3 import Web3
import os
from dotenv import load_dotenv
load_dotenv()
w3 = Web3(Web3.HTTPProvider(os.getenv("ETH_RPC_URL")))
balance = w3.eth.get_balance(os.getenv("WALLET_ADDRESS"))
print(f"Balance: {w3.from_wei(balance, 'ether')} ETH")
EOF
```

---

## 📦 INSTALLATION DÉPENDANCES

### Python
```bash
pip3 install web3 aiohttp python-dotenv eth-abi websockets colorama requests
```

### Node.js (Frontend)
```bash
npm install
```

### Hardhat (Smart Contracts)
```bash
cd contracts
npm install
```

---

## 🔐 SÉCURITÉ

### Vérifier .env non committé
```bash
git status | grep .env
# Ne doit rien afficher!
```

### Backup .env
```bash
cp backend/.env backend/.env.backup
# Stocker dans endroit sécurisé (PAS git)
```

### Générer Nouveau Wallet (si besoin)
```bash
cd backend
python3 << 'EOF'
from web3 import Web3
from eth_account import Account
import secrets

# Générer clé privée aléatoire
private_key = "0x" + secrets.token_hex(32)
account = Account.from_key(private_key)

print("Nouveau Wallet Généré:")
print(f"Address: {account.address}")
print(f"Private Key: {private_key}")
print("\n⚠️ GARDER PRIVATE KEY SECRÈTE!")
EOF
```

---

## 📚 DOCUMENTATION

### Lire Guides
```bash
# Quick start
cat 🎯_QUICK_START_PRODUCTION.md | less

# Guide complet
cat 🔥_DEPLOYMENT_GUIDE_PRODUCTION.md | less

# Transparence
cat ⚠️_VÉRITÉ_IMPORTANTE.txt | less

# Lancement rapide
cat LANCEMENT_RAPIDE.md | less
```

### Ouvrir dans Éditeur
```bash
# Tous les guides
nano README_PRODUCTION.md
nano 🎯_QUICK_START_PRODUCTION.md
nano 🔥_DEPLOYMENT_GUIDE_PRODUCTION.md
nano LANCEMENT_RAPIDE.md
```

---

## 🎯 WORKFLOW COMPLET

### Première Installation
```bash
# 1. Installation
chmod +x install.sh
./install.sh

# 2. Tests
chmod +x run_tests.sh
./run_tests.sh

# 3. Lancement démo
chmod +x 🚀_PRODUCTION_LAUNCHER.sh
./🚀_PRODUCTION_LAUNCHER.sh
→ Choisir: 1
```

### Passage Testnet
```bash
# 1. Obtenir ETH testnet
# https://sepoliafaucet.com

# 2. Configurer wallet
nano backend/.env
# Ajouter WALLET_PRIVATE_KEY

# 3. Déployer contrat testnet
cd contracts
npx hardhat run scripts/deploy.js --network sepolia

# 4. Lancer testnet
cd ..
./🚀_PRODUCTION_LAUNCHER.sh
→ Choisir: 2
```

### Passage Production
```bash
# 1. Vérifier tests testnet (1-3 mois)

# 2. Déployer mainnet
cd contracts
npx hardhat run scripts/deploy.js --network mainnet

# 3. Configurer contract address
echo "ARBITRAGE_CONTRACT_ADDRESS=0x..." >> ../backend/.env

# 4. Lancer surveillance
cd ..
./🚀_PRODUCTION_LAUNCHER.sh
→ Choisir: 4

# 5. Après validation, activer auto-execute
nano backend/.env
# AUTO_EXECUTE=true
```

---

## 🆘 DÉPANNAGE RAPIDE

### "Command not found"
```bash
# Rendre exécutable
chmod +x *.sh
```

### "Module not found"
```bash
pip3 install -r backend/requirements.txt
```

### "Connection refused"
```bash
# Vérifier RPC URL
nano backend/.env
# Essayer: ETH_RPC_URL=https://eth.llamarpc.com
```

### "Permission denied"
```bash
chmod +x install.sh run_tests.sh test_quick.sh 🚀_PRODUCTION_LAUNCHER.sh
```

---

## ✅ CHECKLIST QUOTIDIENNE PRODUCTION

```bash
# Vérifier logs
tail -100 logs/arbitrage_prod.log

# Vérifier balance
cd backend && python3 -c "from web3 import Web3; import os; from dotenv import load_dotenv; load_dotenv(); w3=Web3(Web3.HTTPProvider(os.getenv('ETH_RPC_URL'))); print(w3.from_wei(w3.eth.get_balance(os.getenv('WALLET_ADDRESS')), 'ether'), 'ETH')"

# Vérifier opportunités
grep -c "OPPORTUNITÉ" logs/arbitrage_prod.log

# Backup profits si > threshold
# (automatique si AUTO_BACKUP_ENABLED=true)
```

---

**Toutes les commandes sont prêtes à l'emploi !** 🚀

**Date** : 24 Décembre 2024
