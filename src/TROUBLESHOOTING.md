# 🔧 THESORIA - GUIDE DE DÉPANNAGE

## "Ça ne fonctionne pas" - Solutions Rapides

---

## 🎯 DIAGNOSTIC AUTOMATIQUE (COMMENCEZ ICI)

```powershell
.\diagnose.bat
```

Ce script va :
- ✅ Vérifier Python
- ✅ Vérifier les modules
- ✅ Vérifier la configuration
- ✅ Identifier le problème exact
- ✅ Donner la solution

**Lancez-le en premier !**

---

## 🔴 PROBLÈMES COURANTS & SOLUTIONS

### 1️⃣ "python n'est pas reconnu comme commande"

**Cause** : Python pas installé ou pas dans PATH

**Solution A - Vérifier installation** :
```powershell
# Chercher Python
where python
where py

# Essayer avec py
py --version
```

**Solution B - Réinstaller Python** :
1. Télécharger : https://www.python.org/downloads/
2. ⚠️ **COCHER "Add Python to PATH"**
3. Installer
4. Redémarrer PowerShell
5. Vérifier : `python --version`

**Solution C - Ajouter manuellement au PATH** :
1. Touche Windows → "Variables d'environnement"
2. Variables système → Path → Modifier
3. Nouveau → Ajouter :
   - `C:\Users\VOTRE_NOM\AppData\Local\Programs\Python\Python310`
   - `C:\Users\VOTRE_NOM\AppData\Local\Programs\Python\Python310\Scripts`
4. OK → Redémarrer PowerShell

---

### 2️⃣ "pip install" échoue ou erreur

**Cause** : pip pas à jour ou permissions

**Solution A - Mettre à jour pip** :
```powershell
python -m pip install --upgrade pip
```

**Solution B - Installer avec --user** :
```powershell
pip install --user web3 colorama
```

**Solution C - PowerShell en Administrateur** :
1. Clic droit sur PowerShell → "Exécuter en tant qu'administrateur"
2. Relancer : `pip install web3 colorama fastapi`

**Solution D - Utiliser py** :
```powershell
py -m pip install web3 colorama fastapi uvicorn python-dotenv
```

---

### 3️⃣ "Module 'web3' not found" ou erreur import

**Cause** : Module non installé

**Solution - Installer TOUS les modules** :
```powershell
pip install web3 colorama fastapi uvicorn sqlalchemy aiohttp requests python-dotenv pyyaml cryptography eth-account

# OU un par un
pip install web3
pip install colorama
pip install fastapi
pip install uvicorn
pip install python-dotenv
```

**Vérifier installation** :
```powershell
pip list | findstr web3
python -c "import web3; print('OK')"
```

---

### 4️⃣ ".env.production" non trouvé

**Cause** : Fichier pas créé

**Solution** :
```powershell
# Vérifier si .env.example existe
dir .env.example

# Copier
copy .env.example .env.production

# Éditer
notepad .env.production

# Remplir au minimum:
# MAIN_WALLET_PRIVATE_KEY=0x...
# MAIN_WALLET_ADDRESS=0x...
# ETH_RPC_URL=https://mainnet.infura.io/v3/...
```

---

### 5️⃣ Erreur "Connection refused" ou blockchain

**Cause** : RPC URL invalide ou non configuré

**Solution** :
1. Obtenir clé Infura GRATUITE :
   - https://infura.io
   - Create account
   - Create Project
   - Copier Project ID

2. Dans .env.production :
```bash
ETH_RPC_URL=https://mainnet.infura.io/v3/VOTRE_PROJECT_ID_ICI
```

3. Tester :
```powershell
cd backend
python
```
```python
from web3 import Web3
web3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/VOTRE_ID'))
print(web3.is_connected())  # Doit afficher True
```

---

### 6️⃣ "No module named 'dotenv'"

**Cause** : python-dotenv pas installé

**Solution** :
```powershell
pip install python-dotenv
```

**Note** : Le module s'appelle `python-dotenv` mais s'importe avec `import dotenv`

---

### 7️⃣ Scripts .bat ne se lancent pas

**Cause** : Permissions ou antivirus

**Solution A - Lancer en admin** :
1. Clic droit sur fichier.bat
2. "Exécuter en tant qu'administrateur"

**Solution B - Désactiver temporairement antivirus** :
1. Windows Security
2. Virus & threat protection
3. Manage settings
4. Désactiver temporairement

**Solution C - Lancer manuellement** :
```powershell
cd backend
python production_trader.py
```

---

### 8️⃣ npm audit fix ne fonctionne pas

**Solution A - Force** :
```powershell
npm audit fix --force
```

**Solution B - Ignorer (pas critique)** :
```powershell
# Les vulnérabilités npm n'affectent pas le backend Python
# Vous pouvez continuer
```

**Solution C - Réinstaller** :
```powershell
rmdir /s node_modules
del package-lock.json
npm install
npm audit fix
```

---

### 9️⃣ Firewall bloque les connexions

**Solution** :
1. Windows Defender Firewall
2. Autoriser une application
3. Ajouter : Python, Node.js
4. Cocher "Privé" et "Public"

---

### 🔟 "Insufficient funds" ou erreur wallet

**Cause** : Wallet pas approvisionné

**Solution** :
1. Vérifier balance :
```powershell
# Dans backend\test_installation.py
python test_installation.py
```

2. Approvisionner wallet :
   - Acheter ETH sur exchange (Binance, Coinbase)
   - Envoyer 0.1-0.5 ETH vers votre wallet THESORIA
   - Attendre 5-10 min (confirmations)

3. Vérifier :
   - https://etherscan.io/address/VOTRE_ADRESSE

---

## 🆘 ERREURS SPÉCIFIQUES

### "ModuleNotFoundError: No module named 'xyz'"

```powershell
pip install xyz
```

### "SyntaxError" dans le code

- Vérifier version Python : `python --version` (doit être 3.8+)
- Si < 3.8 : Réinstaller Python 3.10+

### "Permission denied"

```powershell
# PowerShell en Admin
# OU
pip install --user nom_du_module
```

### "SSL certificate error"

```powershell
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org web3
```

### Script démarre puis se ferme immédiatement

```powershell
# Lancer dans PowerShell pour voir l'erreur
cd backend
python production_trader.py
# Lire l'erreur affichée
```

---

## 📋 CHECKLIST DE VÉRIFICATION

Avant de demander de l'aide, vérifier :

- [ ] Python installé : `python --version`
- [ ] pip fonctionne : `pip --version`
- [ ] Modules installés : `pip list`
- [ ] .env.production existe : `dir .env.production`
- [ ] .env.production rempli (wallet + RPC)
- [ ] Dossiers créés : `dir logs`
- [ ] Aucune erreur dans diagnostic : `.\diagnose.bat`

---

## 🔬 TESTS DE DIAGNOSTIC

### Test Python de base
```powershell
python -c "print('Python OK')"
```

### Test modules
```powershell
python -c "import web3; print('web3 OK')"
python -c "import colorama; print('colorama OK')"
python -c "from dotenv import load_dotenv; print('dotenv OK')"
```

### Test connexion blockchain
```powershell
cd backend
python
```
```python
from web3 import Web3
from dotenv import load_dotenv
import os

load_dotenv('../.env.production')
rpc = os.getenv('ETH_RPC_URL')
web3 = Web3(Web3.HTTPProvider(rpc))
print('Connecté:', web3.is_connected())
print('Block:', web3.eth.block_number)
```

### Test complet
```powershell
cd backend
python test_installation.py
```

---

## 💡 COMMANDES UTILES

### Voir processus Python
```powershell
tasklist | findstr python
```

### Arrêter tous processus Python
```powershell
taskkill /F /IM python.exe
```

### Voir ports utilisés
```powershell
netstat -ano | findstr :8000
```

### Nettoyer logs
```powershell
del logs\*.log
```

### Réinstaller module
```powershell
pip uninstall web3
pip install web3
```

---

## 📞 BESOIN D'AIDE SUPPLÉMENTAIRE ?

### 1. Lancer diagnostic
```powershell
.\diagnose.bat
```

### 2. Lire le rapport
```powershell
type diagnostic\diagnostic_report_*.txt
```

### 3. Fournir ces informations :

```powershell
echo "=== INFORMATIONS SYSTEME ==="
python --version
pip --version
node --version
npm --version

echo "=== MODULES PYTHON ==="
pip list

echo "=== ERREUR EXACTE ==="
REM Copier-coller l'erreur complète
```

---

## 🎯 SOLUTION RAPIDE SI TOUT ÉCHOUE

### Mode Minimal (Backend Python seul)

```powershell
# 1. Installer Python uniquement
python --version

# 2. Installer modules minimum
pip install web3 colorama python-dotenv

# 3. Créer config minimale
copy .env.example .env.production
notepad .env.production

# 4. Lancer UN système
cd backend
python production_trader.py
```

**Ignorer tout le reste (npm, Docker, etc.) pour l'instant.**

---

## ✅ TEST FINAL

Tout fonctionne si ces 3 commandes marchent :

```powershell
# 1. Python
python --version

# 2. Module
python -c "import web3; print('OK')"

# 3. Lancement
cd backend
python production_trader.py
```

Si ces 3 marchent → **Vous êtes prêt !**

---

## 📚 DOCUMENTATION SUPPLÉMENTAIRE

- **INSTALLATION_WINDOWS_GUIDE.md** - Guide complet
- **START_HERE.md** - Démarrage rapide
- **NEXT_STEPS.md** - Plan d'action

---

**🔧 Utilisez `diagnose.bat` pour un diagnostic automatique complet !**
