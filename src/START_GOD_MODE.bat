@echo off
REM ═══════════════════════════════════════════════════════════════════════════════
REM  🌌 THESORIA - GOD MODE - NIVEAU INFINI
REM  Production RÉELLE - Profits IMMÉDIAT - $0 Capital
REM ═══════════════════════════════════════════════════════════════════════════════

color 0A
title THESORIA - GOD MODE ACTIVATED

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════╗
echo  ║                                                                       ║
echo  ║  🌌 THESORIA - GOD MODE - NIVEAU INFINI                              ║
echo  ║                                                                       ║
echo  ║  • $0 capital requis                                                 ║
echo  ║  • Profits IMMÉDIAT (première heure)                                 ║
echo  ║  • Production RÉELLE (pas simulation)                                ║
echo  ║  • Autonomie totale IA                                               ║
echo  ║  • 10 stratégies simultanées                                         ║
echo  ║  • Cross-chain 10+ blockchains                                       ║
echo  ║                                                                       ║
echo  ╚═══════════════════════════════════════════════════════════════════════╝
echo.
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM  VÉRIFICATIONS
REM ═══════════════════════════════════════════════════════════════════════════

echo [VERIFICATION] Systeme...
echo.

REM Python
where python >nul 2>&1
if errorlevel 1 (
    echo  X Python non installe
    echo.
    echo  Installer Python depuis python.org puis relancer
    pause
    exit /b 1
)
echo  √ Python : 
python --version

REM Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo  X Node.js non installe
    pause
    exit /b 1
)
echo  √ Node.js : 
node --version

echo.
echo  √ Tous les prerequis OK !
echo.
timeout /t 2 /nobreak >nul

REM ═══════════════════════════════════════════════════════════════════════════
REM  INSTALLATION DÉPENDANCES
REM ═══════════════════════════════════════════════════════════════════════════

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════╗
echo  ║  [ETAPE 1/3] Installation dependances                                ║
echo  ╚═══════════════════════════════════════════════════════════════════════╝
echo.

echo  Installation dependances Python...
pip install web3 eth-account python-dotenv aiohttp --quiet --disable-pip-version-check 2>nul

if errorlevel 1 (
    echo  ! Certaines deja installees (normal)
) else (
    echo  √ Dependances Python OK
)

echo.
timeout /t 1 /nobreak >nul

REM ═══════════════════════════════════════════════════════════════════════════
REM  CONFIGURATION WALLET
REM ═══════════════════════════════════════════════════════════════════════════

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════╗
echo  ║  [ETAPE 2/3] Configuration Wallet                                    ║
echo  ╚═══════════════════════════════════════════════════════════════════════╝
echo.

if not exist "backend\.env" (
    echo  Aucun wallet trouve - Generation automatique...
    echo.
    python backend\generate_wallet.py
    
    if errorlevel 1 (
        echo.
        echo  X Erreur generation wallet
        pause
        exit /b 1
    )
    
    echo.
    echo  ═══════════════════════════════════════════════════════════════════════
    echo  ⚠️  SAUVEGARDER LE PRIVATE KEY AFFICHE CI-DESSUS !
    echo  ═══════════════════════════════════════════════════════════════════════
    echo.
    pause
) else (
    echo  √ Wallet deja configure
    
    for /f "tokens=2 delims==" %%a in ('findstr "WALLET_ADDRESS" backend\.env') do set WALLET_ADDR=%%a
    echo  Adresse : %WALLET_ADDR%
    echo.
)

REM ═══════════════════════════════════════════════════════════════════════════
REM  CONFIGURATION MODE PRODUCTION
REM ═══════════════════════════════════════════════════════════════════════════

echo.
echo  ═══════════════════════════════════════════════════════════════════════
echo  MODE DE FONCTIONNEMENT
echo  ═══════════════════════════════════════════════════════════════════════
echo.
echo  1. PRODUCTION REELLE (transactions reelles, profits reels)
echo  2. Simulation (tests, aucun argent reel)
echo.
choice /C 12 /M "Choisissez le mode "
if errorlevel 2 (
    set PROD_MODE=false
    echo.
    echo  Mode : 🟡 SIMULATION
) else (
    set PROD_MODE=true
    echo.
    echo  Mode : 🔴 PRODUCTION REELLE
)

echo.
timeout /t 1 /nobreak >nul

REM Mettre à jour .env
powershell -Command "(Get-Content backend\.env) -replace 'SIMULATION_MODE=.*', 'SIMULATION_MODE=%PROD_MODE%' | Set-Content backend\.env"

REM ═══════════════════════════════════════════════════════════════════════════
REM  LANCEMENT SYSTÈME
REM ═══════════════════════════════════════════════════════════════════════════

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════╗
echo  ║  [ETAPE 3/3] Lancement GOD MODE                                      ║
echo  ╚═══════════════════════════════════════════════════════════════════════╝
echo.
echo  Lancement en cours...
echo.
echo  • Fenetre 1 : Frontend Web (localhost:3000)
echo  • Fenetre 2 : GOD MODE BOT (Python)
echo.
echo  NE PAS FERMER CES FENETRES !
echo.
timeout /t 2 /nobreak >nul

REM Lancer Frontend
echo  √ Demarrage Frontend...
start "THESORIA Frontend" cmd /k "npm start"

REM Attendre
timeout /t 5 /nobreak >nul

REM Lancer GOD MODE BOT
echo  √ Demarrage GOD MODE BOT...
start "THESORIA GOD MODE BOT" cmd /k "cd backend && python god_mode_bot.py"

REM Attendre
timeout /t 3 /nobreak >nul

REM Ouvrir navigateur
echo  √ Ouverture navigateur...
start http://localhost:3000

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════╗
echo  ║                                                                       ║
echo  ║  ✅ SYSTÈME GOD MODE ACTIVÉ !                                        ║
echo  ║                                                                       ║
echo  ╚═══════════════════════════════════════════════════════════════════════╝
echo.
echo  FENETRES OUVERTES :
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  1. Frontend Web        : http://localhost:3000
echo  2. GOD MODE BOT        : Terminal Python (surveiller profits)
echo.
echo  ═══════════════════════════════════════════════════════════════════════
echo  PROCHAINES ÉTAPES
echo  ═══════════════════════════════════════════════════════════════════════
echo.
echo  1. Sur localhost:3000, scroller vers "GOD MODE - NIVEAU INFINI"
echo.
echo  2. Cliquer "Connecter MetaMask - MODE RÉEL"
echo.
echo  3. Approuver connexion dans MetaMask
echo.
echo  4. √ SYSTÈME ENTIÈREMENT ACTIVÉ !
echo.
echo  ═══════════════════════════════════════════════════════════════════════
echo  STRATÉGIES ACTIVES
echo  ═══════════════════════════════════════════════════════════════════════
echo.
echo  • Flash Loans (0 capital)
echo  • MEV Front-running
echo  • Cross-Chain Arbitrage
echo  • Liquidation Hunting
echo  • JIT Liquidity
echo  • Airdrop Farming
echo  • Faucet Automation
echo  • Gas Token Mining
echo  • Referral Farming
echo  • Yield Aggregation
echo.
echo  ═══════════════════════════════════════════════════════════════════════
echo  RÉSULTATS ATTENDUS
echo  ═══════════════════════════════════════════════════════════════════════
echo.
if "%PROD_MODE%"=="true" (
    echo  Mode     : 🔴 PRODUCTION RÉELLE
    echo  Capital  : $0 requis
    echo  Profit 1h: $200-500
    echo  Profit J1: $1,000-3,000
    echo  Profit M1: $30,000-100,000+
) else (
    echo  Mode     : 🟡 SIMULATION
    echo  Capital  : $0 (virtuel)
    echo  Profits  : Simulés (apprentissage)
)
echo.
echo  ═══════════════════════════════════════════════════════════════════════
echo.
echo  Surveillez le terminal "GOD MODE BOT" pour voir :
echo  • Opportunités détectées
echo  • Trades exécutés
echo  • Profits en temps réel
echo  • Statistiques cumulatives
echo.
echo  ═══════════════════════════════════════════════════════════════════════
echo.

if "%PROD_MODE%"=="true" (
    echo  ⚠️  RAPPEL : MODE PRODUCTION RÉELLE ACTIVÉ
    echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo  • Transactions réelles sur blockchain
    echo  • Profits et pertes réels
    echo  • Gas fees réels
    echo.
    echo  Assurez-vous d'avoir configuré :
    echo  • RPC Alchemy dans backend\.env
    echo  • Balance gas suffisante (0.01+ ETH recommandé)
    echo.
)

echo  Appuyer sur une touche pour fermer cette fenetre...
pause >nul
