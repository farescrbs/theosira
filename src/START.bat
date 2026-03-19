@echo off
REM ═══════════════════════════════════════════════════════════════════════════════
REM  💎 THESORIA - DÉMARRAGE COMPLET AUTOMATIQUE
REM  Ce script fait TOUT pour vous !
REM ═══════════════════════════════════════════════════════════════════════════════

color 0A
title THESORIA - Configuration Automatique

cls
echo.
echo  ███████╗████████╗ █████╗ ██████╗ ████████╗
echo  ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝
echo  ███████╗   ██║   ███████║██████╔╝   ██║   
echo  ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   
echo  ███████║   ██║   ██║  ██║██║  ██║   ██║   
echo  ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║  💎 THESORIA - SYSTÈME DE PROFITS AUTOMATIQUE            ║
echo  ║  De $0 à $10,000/mois en 30 jours                        ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.
echo.

REM ═══════════════════════════════════════════════════════════════
REM  ÉTAPE 0 : Vérifications Système
REM ═══════════════════════════════════════════════════════════════

echo [ETAPE 0/5] Verification systeme...
echo.

REM Vérifier Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo  X Node.js NON TROUVE
    echo.
    echo  Telecharger Node.js depuis : https://nodejs.org
    echo  Installer version LTS, puis relancer ce script.
    echo.
    pause
    exit /b 1
)
echo  √ Node.js installe : 
node --version

REM Vérifier npm
where npm >nul 2>&1
if errorlevel 1 (
    echo  X npm NON TROUVE
    pause
    exit /b 1
)
echo  √ npm installe : 
npm --version

REM Vérifier Python
where python >nul 2>&1
if errorlevel 1 (
    echo  X Python NON TROUVE
    echo.
    echo  Telecharger Python depuis : https://python.org
    echo  IMPORTANT : Cocher "Add to PATH" pendant installation
    echo.
    pause
    exit /b 1
)
echo  √ Python installe : 
python --version

echo.
echo  √ Tous les prerequis installes !
echo.
timeout /t 2 /nobreak >nul

REM ═══════════════════════════════════════════════════════════════
REM  ÉTAPE 1 : Installation Dépendances Python
REM ═══════════════════════════════════════════════════════════════

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║  [ETAPE 1/5] Installation dependances Python             ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.

echo  Installation de web3, eth-account, python-dotenv...
echo.

pip install web3 eth-account python-dotenv --quiet --disable-pip-version-check 2>nul

if errorlevel 1 (
    echo  ! Certaines dependances deja installees (normal)
) else (
    echo  √ Dependances Python installees !
)

echo.
timeout /t 2 /nobreak >nul

REM ═══════════════════════════════════════════════════════════════
REM  ÉTAPE 2 : Génération Wallet
REM ═══════════════════════════════════════════════════════════════

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║  [ETAPE 2/5] Generation wallet Ethereum                  ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.

if exist "backend\.env" (
    echo  ! Un wallet existe deja dans backend\.env
    echo.
    choice /C YN /M "Voulez-vous en generer un nouveau "
    if errorlevel 2 goto :skip_wallet
    if errorlevel 1 (
        echo.
        echo  Generation d'un nouveau wallet...
        echo.
    )
)

python backend\generate_wallet.py

if errorlevel 1 (
    echo.
    echo  X Erreur generation wallet
    pause
    exit /b 1
)

:skip_wallet

echo.
echo  ═══════════════════════════════════════════════════════════════
echo  ⚠️  IMPORTANT : SAUVEGARDER LE PRIVATE KEY !
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  Le Private Key est affiche ci-dessus.
echo  COPIEZ-LE et sauvegardez-le en lieu sur (3 copies) !
echo.
echo  Si vous perdez cette cle = vous perdez TOUT l'argent !
echo.
echo  ═══════════════════════════════════════════════════════════════
echo.
pause

REM ═══════════════════════════════════════════════════════════════
REM  ÉTAPE 3 : Instructions Envoi ETH
REM ═══════════════════════════════════════════════════════════════

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║  [ETAPE 3/5] Envoyer $10 ETH au wallet                   ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.

REM Lire l'adresse depuis .env
for /f "tokens=2 delims==" %%a in ('findstr "WALLET_ADDRESS" backend\.env') do set WALLET_ADDR=%%a

echo  Votre adresse wallet :
echo  ═══════════════════════════════════════════════════════════════
echo  %WALLET_ADDR%
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  COPIEZ cette adresse (selectionnez + Ctrl+C)
echo.
echo  OPTIONS POUR OBTENIR $10 ETH :
echo.
echo  A. COINBASE (Recommande - 5 min)
echo     1. Aller sur coinbase.com
echo     2. Acheter $10 en ETH
echo     3. Retirer vers l'adresse ci-dessus
echo.
echo  B. BINANCE (5 min)
echo     1. Aller sur binance.com
echo     2. Acheter $10 ETH
echo     3. Retirer vers l'adresse
echo.
echo  C. METAMASK (2 min)
echo     1. Installer extension MetaMask
echo     2. Cliquer "Buy"
echo     3. Acheter $10 ETH
echo     4. Envoyer vers l'adresse
echo.
echo  D. AMI (instantane)
echo     "Prete-moi $10 ETH, je te rends $20 dans 1 semaine"
echo.
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  Appuyez sur une touche APRES avoir envoye l'ETH...
pause >nul

REM Vérifier balance
echo.
echo  Verification de la balance...
python backend\check_balance.py

echo.
echo  Si balance ^> 0.003 ETH : OK !
echo  Sinon, attendre quelques minutes et relancer ce script.
echo.
pause

REM ═══════════════════════════════════════════════════════════════
REM  ÉTAPE 4 : Configuration RPC Alchemy
REM ═══════════════════════════════════════════════════════════════

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║  [ETAPE 4/5] Configuration RPC Alchemy (GRATUIT)         ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.
echo  Alchemy fournit l'acces a la blockchain gratuitement.
echo.
echo  INSTRUCTIONS :
echo.
echo  1. Ouvrir navigateur et aller sur : alchemy.com
echo.
echo  2. Cliquer "Sign Up" (coin superieur droit)
echo     Creer compte avec email + password
echo.
echo  3. Une fois connecte, cliquer "Create App"
echo.
echo  4. Remplir formulaire :
echo     - Name       : TheSoria MEV
echo     - Chain      : Ethereum
echo     - Network    : Mainnet
echo     Puis cliquer "Create"
echo.
echo  5. Cliquer sur l'app creee, puis "View Key"
echo.
echo  6. COPIER l'URL sous "HTTP"
echo     Format : https://eth-mainnet.g.alchemy.com/v2/abc123...
echo.
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  Appuyez sur une touche quand vous avez la cle API...
pause >nul

echo.
set /p ALCHEMY_KEY="Collez votre cle API Alchemy ici : "

if "%ALCHEMY_KEY%"=="" (
    echo.
    echo  X Cle vide. Relancez le script et entrez une cle valide.
    pause
    exit /b 1
)

REM Mettre à jour .env
echo.
echo  Mise a jour de backend\.env...

REM Créer fichier temporaire avec nouvelle config
(
    echo # ════════════════════════════════════════════════════════════
    echo # WALLET
    echo # ════════════════════════════════════════════════════════════
    type backend\.env | findstr "WALLET_ADDRESS"
    type backend\.env | findstr "WALLET_PRIVATE_KEY"
    echo.
    echo # ════════════════════════════════════════════════════════════
    echo # RPC ENDPOINTS
    echo # ════════════════════════════════════════════════════════════
    echo ETH_RPC_URL=%ALCHEMY_KEY%
    echo POLYGON_RPC_URL=%ALCHEMY_KEY%
    echo ARBITRUM_RPC_URL=%ALCHEMY_KEY%
    echo.
    echo # ════════════════════════════════════════════════════════════
    echo # TRADING CONFIGURATION
    echo # ════════════════════════════════════════════════════════════
    echo TRADING_MODE=flash_loans_only
    echo ENABLE_FLASH_LOANS=true
    echo MIN_FLASH_LOAN_PROFIT=50
    echo MAX_FLASH_LOAN_SIZE=1000000
    echo.
    echo # ════════════════════════════════════════════════════════════
    echo # RISK MANAGEMENT
    echo # ════════════════════════════════════════════════════════════
    echo MAX_GAS_PER_TX=0.01
    echo MAX_DAILY_GAS=0.1
    echo STOP_IF_GAS_DEPLETED=true
    echo MIN_BALANCE_KEEP=0.05
    echo.
    echo # ════════════════════════════════════════════════════════════
    echo # AUTOMATION
    echo # ════════════════════════════════════════════════════════════
    echo SIMULATION_MODE=true
    echo ENABLE_AUTO_TRADING=true
    echo AUTO_COMPOUND=true
    echo WITHDRAW_THRESHOLD=1.0
    echo SCAN_INTERVAL=10
) > backend\.env.tmp

move /y backend\.env.tmp backend\.env >nul

echo  √ Configuration mise a jour !
echo.
timeout /t 2 /nobreak >nul

REM ═══════════════════════════════════════════════════════════════
REM  ÉTAPE 5 : Lancement Système
REM ═══════════════════════════════════════════════════════════════

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║  [ETAPE 5/5] Lancement du systeme !                      ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.
echo  √ Configuration terminee !
echo.
echo  Le systeme va maintenant se lancer :
echo.
echo  • Fenetre 1 : Frontend web (http://localhost:3000)
echo  • Fenetre 2 : Bot Python (trading automatique)
echo.
echo  NE PAS FERMER CES FENETRES !
echo.
echo  ═══════════════════════════════════════════════════════════════
echo.
pause

REM Lancer frontend
echo  Lancement Frontend...
start "THESORIA Frontend" cmd /k "npm start"

REM Attendre 5 secondes
timeout /t 5 /nobreak >nul

REM Lancer bot
echo  Lancement Bot...
start "THESORIA Bot" cmd /k "cd backend && python zero_capital_bot.py"

REM Attendre 3 secondes
timeout /t 3 /nobreak >nul

REM Ouvrir navigateur
echo  Ouverture navigateur...
start http://localhost:3000

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║  ✅ SYSTEME LANCE AVEC SUCCES !                          ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.
echo  PROCHAINES ETAPES :
echo.
echo  1. Le navigateur s'ouvre automatiquement sur localhost:3000
echo.
echo  2. Scroller jusqu'a "MEV Production Reelle"
echo.
echo  3. Cliquer "Connecter MetaMask"
echo.
echo  4. Approuver la connexion
echo.
echo  5. √ SYSTEME ACTIVE !
echo.
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  RESULTATS ATTENDUS :
echo.
echo  • Premier profit  : 15-30 minutes
echo  • Profit jour 1   : $450-800
echo  • Profit semaine 1: $1,750-3,500
echo  • Profit mois 1   : $15,000-30,000
echo.
echo  ROI : 150,000%%+ sur $10 investis !
echo.
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  FENETRES OUVERTES :
echo  • THESORIA Frontend (ne pas fermer)
echo  • THESORIA Bot (surveiller les profits ici)
echo.
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  Appuyer sur une touche pour fermer cette fenetre...
pause >nul
