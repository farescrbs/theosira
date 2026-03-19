# 🚀 THESORIA - GUIDE D'INSTALLATION WINDOWS

## Installation Complète sur Windows

---

## ✅ ÉTAPE 1: Corriger les Vulnérabilités NPM

```powershell
# Corriger les vulnérabilités automatiquement
npm audit fix

# Si cela ne suffit pas:
npm audit fix --force

# Vérifier
npm audit
```

---

## ✅ ÉTAPE 2: Installer Python et Dépendances

### Installer Python 3.10+

1. Télécharger depuis: https://www.python.org/downloads/
2. **IMPORTANT**: Cocher "Add Python to PATH"
3. Installer

### Vérifier Installation

```powershell
python --version
# Doit afficher: Python 3.10.x ou supérieur

pip --version
# Doit afficher: pip 23.x.x
```

### Installer Dépendances Python

```powershell
# Créer requirements.txt si pas déjà fait
cd backend

# Installer toutes les dépendances
pip install web3 colorama fastapi uvicorn sqlalchemy redis aiohttp asyncio eth-account requests python-dotenv pyyaml cryptography

# OU installer depuis requirements.txt
pip install -r requirements.txt
```

---

## ✅ ÉTAPE 3: Configuration .env

### Créer Fichier de Configuration

```powershell
# Copier le template
copy .env.example .env.production

# Éditer avec Notepad
notepad .env.production
```

### Configuration MINIMALE Requise

```bash
# Wallet (OBLIGATOIRE)
MAIN_WALLET_PRIVATE_KEY=0xVOTRE_PRIVATE_KEY_ICI
MAIN_WALLET_ADDRESS=0xVOTRE_ADRESSE_WALLET_ICI

# Blockchain RPC (OBLIGATOIRE)
# Obtenir gratuitement sur: https://infura.io
ETH_RPC_URL=https://mainnet.infura.io/v3/VOTRE_PROJECT_ID

# Mode
NODE_ENV=production
TESTNET=false

# Risk Management (IMPORTANT)
MAX_POSITION_SIZE_USD=1000
MAX_DAILY_LOSS_PERCENT=5
DEFAULT_STOP_LOSS_PERCENT=2

# Features (Commencer conservateur)
ENABLE_AUTO_TRADING=false
REQUIRE_MANUAL_APPROVAL=true
```

---

## ✅ ÉTAPE 4: Créer Wallet (Si Pas Déjà Fait)

### Option A: Utiliser Wallet Existant

Si vous avez déjà un wallet MetaMask/TrustWallet:
1. Ouvrir MetaMask
2. Paramètres → Sécurité & Confidentialité
3. Révéler la clé privée (⚠️ DANGEREUX - Garder secret!)
4. Copier dans .env.production

### Option B: Créer Nouveau Wallet

```powershell
# Lancer script Python
python

# Dans Python:
```python
from web3 import Web3
from eth_account import Account
import secrets

# Générer wallet
priv = secrets.token_hex(32)
private_key = "0x" + priv
acct = Account.from_key(private_key)

print("=" * 70)
print("NOUVEAU WALLET CRÉÉ")
print("=" * 70)
print(f"Adresse:     {acct.address}")
print(f"Private Key: {private_key}")
print("=" * 70)
print("⚠️  SAUVEGARDER CES INFORMATIONS EN LIEU SÛR")
print("⚠️  NE JAMAIS PARTAGER LA PRIVATE KEY")
print("=" * 70)
```

**⚠️ IMPORTANT**: 
- Sauvegarder private key sur papier
- Faire backup sur USB
- Ne JAMAIS partager
- Approvisionner le wallet avec des fonds avant trading

---

## ✅ ÉTAPE 5: Test de l'Installation

### Test Connexion Blockchain

```powershell
cd backend

# Créer test_connection.py
notepad test_connection.py
```

Copier ce code:
```python
from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv('../.env.production')

# Test connexion
rpc_url = os.getenv('ETH_RPC_URL')
web3 = Web3(Web3.HTTPProvider(rpc_url))

print("=" * 70)
print("TEST CONNEXION BLOCKCHAIN")
print("=" * 70)

if web3.is_connected():
    print("✅ Connexion réussie!")
    print(f"Block number: {web3.eth.block_number}")
    
    # Test wallet
    wallet = os.getenv('MAIN_WALLET_ADDRESS')
    if wallet:
        balance = web3.eth.get_balance(wallet)
        balance_eth = web3.from_wei(balance, 'ether')
        print(f"Wallet: {wallet}")
        print(f"Balance: {balance_eth} ETH")
else:
    print("❌ Connexion échouée")
    print("Vérifier ETH_RPC_URL dans .env.production")

print("=" * 70)
```

Lancer:
```powershell
python test_connection.py
```

---

## ✅ ÉTAPE 6: Lancement du Système

### Option A: Lancement Simple (Recommandé pour Windows)

```powershell
# Créer dossiers nécessaires
mkdir logs
mkdir backups
mkdir reports

# Lancer système de base
cd backend
python production_trader.py
```

### Option B: Lancement Multiple Systèmes

Créer fichier `start_all.bat`:

```batch
@echo off
echo ======================================
echo THESORIA - LANCEMENT PRODUCTION
echo ======================================

cd backend

echo Starting Production Trader...
start "Production Trader" python production_trader.py

echo Starting ML Prediction Engine...
start "ML Predictions" python ml_prediction_engine.py

echo Starting Whale Tracking...
start "Whale Tracker" python whale_tracking_system.py

echo Starting Market Making Bot...
start "Market Making" python market_making_bot.py

echo.
echo ======================================
echo TOUS LES SYSTEMES SONT LANCES
echo ======================================
echo.
echo Ouvrir logs/ pour voir l'activite
echo Appuyer sur une touche pour arreter tous les systemes...
pause > nul

taskkill /FI "WINDOWTITLE eq Production*" /F
taskkill /FI "WINDOWTITLE eq ML*" /F
taskkill /FI "WINDOWTITLE eq Whale*" /F
taskkill /FI "WINDOWTITLE eq Market*" /F
```

Lancer:
```powershell
.\start_all.bat
```

---

## ✅ ÉTAPE 7: Monitoring

### Voir les Logs en Temps Réel

```powershell
# Avec PowerShell
Get-Content logs\production_trader.log -Wait -Tail 50

# OU avec Git Bash (si installé)
tail -f logs/production_trader.log
```

### Dashboard Web (Si Frontend Installé)

```powershell
# Lancer frontend
cd frontend
npm start

# Ouvrir navigateur: http://localhost:3000
```

---

## 🔧 TROUBLESHOOTING WINDOWS

### Problème: "python n'est pas reconnu"

**Solution**:
```powershell
# Trouver Python
where python

# Si pas trouvé, ajouter au PATH:
# 1. Rechercher "Variables d'environnement"
# 2. Variables système → Path → Modifier
# 3. Ajouter: C:\Users\VOTRE_NOM\AppData\Local\Programs\Python\Python310
```

### Problème: "pip install" échoue

**Solution**:
```powershell
# Mettre à jour pip
python -m pip install --upgrade pip

# Installer avec droits admin (PowerShell en admin)
pip install --user web3 colorama
```

### Problème: "Module not found"

**Solution**:
```powershell
# Vérifier modules installés
pip list

# Réinstaller module manquant
pip install nom_du_module
```

### Problème: Firewall bloque les connexions

**Solution**:
1. Windows Defender Firewall
2. Autoriser Python et Node.js
3. Autoriser ports: 3000, 8000

---

## 📊 COMMANDES UTILES WINDOWS

### Vérifier Processus Python

```powershell
# Voir processus Python actifs
tasklist | findstr python

# Arrêter tous processus Python (⚠️ prudence)
taskkill /F /IM python.exe
```

### Nettoyer Logs

```powershell
# Supprimer vieux logs
del logs\*.log

# OU garder les 7 derniers jours
forfiles /P logs /S /M *.log /D -7 /C "cmd /c del @path"
```

---

## 🚀 DÉMARRAGE RAPIDE WINDOWS

```powershell
# 1. Corriger npm
npm audit fix

# 2. Installer Python deps
pip install web3 colorama fastapi uvicorn

# 3. Configurer .env
copy .env.example .env.production
notepad .env.production

# 4. Tester connexion
cd backend
python test_connection.py

# 5. Lancer
python production_trader.py

# 6. Monitor
# Ouvrir nouveau terminal:
Get-Content logs\production_trader.log -Wait
```

---

## 💰 CAPITAL & RISQUES

### Approvisionner Wallet

Avant de lancer en production:

1. **ETH pour Gas Fees**: 0.1-0.5 ETH minimum
2. **Capital Trading**: $1,000-10,000 (commencer petit)
3. **Stablecoins**: USDC/USDT pour trading

**⚠️ COMMENCER AVEC PETIT CAPITAL**:
- Première semaine: $500-1,000
- Tester tous systèmes
- Valider profitabilité
- Puis scaler progressivement

---

## 🎯 CHECKLIST FINALE

Avant lancement production:

- [ ] Python installé et fonctionnel
- [ ] Node.js installé (npm fonctionne)
- [ ] Dépendances installées (pip + npm)
- [ ] .env.production configuré
- [ ] Wallet créé et approvisionné
- [ ] Test connexion blockchain réussi
- [ ] Risk parameters configurés
- [ ] Logs accessibles
- [ ] Backup wallet créé

---

## 📞 SUPPORT

### Ressources

- **Documentation**: Lire tous les .md
- **Logs**: Toujours dans `logs/`
- **Config**: `.env.production`

### Commandes Debug

```powershell
# Vérifier installation
python --version
node --version
npm --version

# Vérifier modules Python
pip list | findstr web3

# Vérifier config
type .env.production | findstr WALLET
```

---

## 🎉 PRÊT À LANCER !

Une fois tout configuré:

```powershell
# Lancement simple
cd backend
python production_trader.py

# OU lancement complet
.\start_all.bat
```

**BONNE CHANCE ! 🚀💰**

---

**Version**: 1.0 Windows  
**OS**: Windows 10/11  
**Python**: 3.10+  
**Node**: 18+
