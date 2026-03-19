@echo off
REM ╔═══════════════════════════════════════════════════════════════════════════════╗
REM ║  🚀 SETUP RAPIDE - GÉNÉRATION WALLET + CONFIGURATION                         ║
REM ╚═══════════════════════════════════════════════════════════════════════════════╝

cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  💎 THESORIA - SETUP RAPIDE                                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python non installé!
    echo.
    echo Télécharger Python depuis python.org
    pause
    exit
)

echo ✅ Python trouvé
echo.

REM Installer dépendances Python si nécessaire
echo 📦 Installation dépendances Python...
pip install web3 eth-account python-dotenv --quiet
if errorlevel 1 (
    echo ⚠️  Certaines dépendances déjà installées
)
echo.

REM Générer wallet
echo ═══════════════════════════════════════════════════════════════
echo  GÉNÉRATION WALLET
echo ═══════════════════════════════════════════════════════════════
echo.

python backend\generate_wallet.py

echo.
echo ═══════════════════════════════════════════════════════════════
echo  PROCHAINES ÉTAPES
echo ═══════════════════════════════════════════════════════════════
echo.
echo 1. ✅ Wallet généré dans backend\.env
echo.
echo 2. 💰 Envoyer $10 ETH à l'adresse affichée ci-dessus
echo    Options:
echo    - Coinbase / Binance
echo    - MetaMask
echo    - Ami
echo.
echo 3. 🔧 Configurer RPC Alchemy:
echo    - Aller sur alchemy.com
echo    - Créer compte GRATUIT
echo    - Créer app "Ethereum"
echo    - Copier API key
echo    - Ouvrir backend\.env
echo    - Remplacer VOTRE_CLE_ICI par vraie clé
echo.
echo 4. 🚀 Lancer système:
echo    Double-cliquer: start-windows.bat
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
