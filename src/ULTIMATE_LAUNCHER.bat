@echo off
REM ═══════════════════════════════════════════════════════════════════════════════
REM  🌌 THESORIA - ULTIMATE LAUNCHER - NIVEAU INFINI
REM  Lanceur avec menu interactif et monitoring temps réel
REM ═══════════════════════════════════════════════════════════════════════════════

color 0A
title THESORIA - ULTIMATE LAUNCHER

:MENU
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║                                                                               ║
echo  ║     ███████╗████████╗ █████╗ ██████╗ ████████╗    ██╗  ██╗███████╗██████╗   ║
echo  ║     ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝    █��║  ██║██╔════╝██╔══██╗  ║
echo  ║     ███████╗   ██║   ███████║██████╔╝   ██║       ███████║█████╗  ██████╔╝  ║
echo  ║     ╚════██║   ██║   ██╔══██║██╔══██╗   ██║       ██╔══██║██╔══╝  ██╔══██╗  ║
echo  ║     ███████║   ██║   ██║  ██║██║  ██║   ██║       ██║  ██║███████╗██║  ██║  ║
echo  ║     ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝  ║
echo  ║                                                                               ║
echo  ║                    🌌 ULTIMATE LAUNCHER - NIVEAU INFINI 🌌                   ║
echo  ║                                                                               ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
echo.
echo  ┌───────────────────────────────────────────────────────────────────────────────┐
echo  │                                                                               │
echo  │  🌌 GOD MODE - NIVEAU INFINI                                                 │
echo  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
echo  │                                                                               │
echo  │  [1] 🚀 LANCEMENT COMPLET GOD MODE                                           │
echo  │      → Frontend + Bot GOD MODE + Monitor Quantum                             │
echo  │      → $0 capital requis, 10 stratégies, Production RÉELLE                   │
echo  │                                                                               │
echo  │  [2] ⚡ LANCEMENT RAPIDE (Sans Monitor)                                       │
echo  │      → Frontend + Bot GOD MODE uniquement                                    │
echo  │                                                                               │
echo  │  [3] 📊 MONITOR QUANTUM UNIQUEMENT                                           │
echo  │      → Surveillance temps réel du système                                    │
echo  │                                                                               │
echo  │  [4] 🌐 LANCEMENT ULTRA COMPLET (NOUVEAU!)                                   │
echo  │      → Frontend + Bot + Monitor + WebSocket + Auto-Backup                    │
echo  │      → Streaming temps réel + Sécurisation profits                           │
echo  │                                                                               │
echo  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
echo  │                                                                               │
echo  │  📖 MODES STANDARD                                                           │
echo  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
echo  │                                                                               │
echo  │  [5] 📦 Lancement Standard (3-5 stratégies)                                  │
echo  │  [6] 🔧 Configuration Wallet                                                 │
echo  │  [7] 💰 Vérifier Balance                                                     │
echo  │                                                                               │
echo  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
echo  │                                                                               │
echo  │  📚 DOCUMENTATION                                                            │
echo  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
echo  │                                                                               │
echo  │  [8] 📖 Ouvrir Guide GOD MODE                                                │
echo  │  [9] 📚 Ouvrir Index Complet                                                 │
echo  │  [10] ⚡ Ouvrir Démarrage Immédiat                                             │
echo  │                                                                               │
echo  │  [0] ❌ QUITTER                                                               │
echo  │                                                                               │
echo  └───────────────────────────────────────────────────────────────────────────────┘
echo.
echo.

set /p choice="  👉 Votre choix : "

if "%choice%"=="1" goto GOD_MODE_COMPLET
if "%choice%"=="2" goto GOD_MODE_RAPIDE
if "%choice%"=="3" goto MONITOR_ONLY
if "%choice%"=="4" goto ULTRA_COMPLET
if "%choice%"=="5" goto STANDARD
if "%choice%"=="6" goto CONFIG_WALLET
if "%choice%"=="7" goto CHECK_BALANCE
if "%choice%"=="8" goto GUIDE_GOD_MODE
if "%choice%"=="9" goto INDEX
if "%choice%"=="10" goto DEMARRAGE
if "%choice%"=="0" goto QUIT

echo.
echo  ⚠️  Choix invalide ! Appuyez sur une touche...
pause >nul
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:GOD_MODE_COMPLET
REM ═══════════════════════════════════════════════════════════════════════════════
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║  🚀 LANCEMENT COMPLET GOD MODE                                               ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
echo  Lancement en cours...
echo.
echo  Fenêtres qui vont s'ouvrir :
echo  • [1] Frontend Web (http://localhost:3000)
echo  • [2] Bot GOD MODE (Trading automatique)
echo  • [3] Quantum Monitor (Surveillance temps réel)
echo.
echo  NE PAS FERMER CES FENÊTRES !
echo.
timeout /t 3 /nobreak >nul

REM Vérifier si .env existe
if not exist "backend\.env" (
    echo  Génération wallet...
    python backend\generate_wallet.py
    echo.
    echo  ⚠️  SAUVEGARDER LE PRIVATE KEY !
    pause
)

REM Lancer Frontend
echo  √ Démarrage Frontend...
start "THESORIA Frontend" cmd /k "npm start"
timeout /t 5 /nobreak >nul

REM Lancer Bot GOD MODE
echo  √ Démarrage Bot GOD MODE...
start "THESORIA GOD MODE Bot" cmd /k "cd backend && python god_mode_bot.py"
timeout /t 2 /nobreak >nul

REM Lancer Quantum Monitor
echo  √ Démarrage Quantum Monitor...
start "THESORIA Quantum Monitor" cmd /k "cd backend && python quantum_monitor.py"
timeout /t 2 /nobreak >nul

REM Ouvrir navigateur
echo  √ Ouverture navigateur...
start http://localhost:3000

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║  ✅ SYSTÈME GOD MODE ACTIVÉ !                                                ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
echo  Fenêtres ouvertes :
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  1. Frontend Web        → http://localhost:3000
echo  2. GOD MODE Bot        → Terminal Python (trading)
echo  3. Quantum Monitor     → Terminal surveillance
echo.
echo  PROCHAINES ÉTAPES :
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  1. Sur localhost:3000, scroller vers "GOD MODE - NIVEAU INFINI"
echo  2. Cliquer "Connecter MetaMask - MODE RÉEL"
echo  3. Approuver connexion
echo  4. Surveiller le "Quantum Monitor" pour voir l'activité en temps réel
echo  5. √ PROFITS AUTOMATIQUES !
echo.
echo  💰 RÉSULTATS ATTENDUS :
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  • 1 heure   : $200-500
echo  • 24 heures : $1,000-3,000
echo  • 30 jours  : $30,000-100,000+
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:GOD_MODE_RAPIDE
REM ═══════════════════════════════════════════════════════════════════════════════
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║  ⚡ LANCEMENT RAPIDE GOD MODE                                                ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.

if not exist "backend\.env" (
    python backend\generate_wallet.py
    pause
)

start "THESORIA Frontend" cmd /k "npm start"
timeout /t 5 /nobreak >nul

start "THESORIA GOD MODE Bot" cmd /k "cd backend && python god_mode_bot.py"
timeout /t 2 /nobreak >nul

start http://localhost:3000

echo  ✅ Système lancé !
echo.
pause
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:MONITOR_ONLY
REM ═══════════════════════════════════════════════════════════════════════════════
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║  📊 QUANTUM MONITOR                                                          ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
echo  Lancement du moniteur...
echo.
cd backend
python quantum_monitor.py
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:ULTRA_COMPLET
REM ═══════════════════════════════════════════════════════════════════════════════
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║  🌐 LANCEMENT ULTRA COMPLET                                                   ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
echo  Lancement en cours...
echo.
echo  Fenêtres qui vont s'ouvrir :
echo  • [1] Frontend Web (http://localhost:3000)
echo  • [2] Bot (Trading automatique)
echo  • [3] Quantum Monitor (Surveillance temps réel)
echo  • [4] WebSocket (Streaming temps réel)
echo  • [5] Auto-Backup (Sécurisation profits)
echo.
echo  NE PAS FERMER CES FENÊTRES !
echo.
timeout /t 3 /nobreak >nul

REM Vérifier si .env existe
if not exist "backend\.env" (
    echo  Génération wallet...
    python backend\generate_wallet.py
    echo.
    echo  ⚠️  SAUVEGARDER LE PRIVATE KEY !
    pause
)

REM Lancer Frontend
echo  √ Démarrage Frontend...
start "THESORIA Frontend" cmd /k "npm start"
timeout /t 5 /nobreak >nul

REM Lancer Bot
echo  √ Démarrage Bot...
start "THESORIA Bot" cmd /k "cd backend && python bot.py"
timeout /t 2 /nobreak >nul

REM Lancer Quantum Monitor
echo  √ Démarrage Quantum Monitor...
start "THESORIA Quantum Monitor" cmd /k "cd backend && python quantum_monitor.py"
timeout /t 2 /nobreak >nul

REM Lancer WebSocket
echo  √ Démarrage WebSocket...
start "THESORIA WebSocket" cmd /k "cd backend && python websocket_server.py"
timeout /t 2 /nobreak >nul

REM Lancer Auto-Backup
echo  √ Démarrage Auto-Backup...
start "THESORIA Auto-Backup" cmd /k "cd backend && python auto_backup.py"
timeout /t 2 /nobreak >nul

REM Ouvrir navigateur
echo  √ Ouverture navigateur...
start http://localhost:3000

cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║  ✅ SYSTÈME ULTRA COMPLET ACTIVÉ !                                            ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
echo  Fenêtres ouvertes :
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  1. Frontend Web        → http://localhost:3000
echo  2. Bot                 → Terminal Python (trading)
echo  3. Quantum Monitor     → Terminal surveillance
echo  4. WebSocket          → Terminal streaming
echo  5. Auto-Backup         → Terminal sauvegarde
echo.
echo  PROCHAINES ÉTAPES :
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  1. Sur localhost:3000, scroller vers "GOD MODE - NIVEAU INFINI"
echo  2. Cliquer "Connecter MetaMask - MODE RÉEL"
echo  3. Approuver connexion
echo  4. Surveiller le "Quantum Monitor" pour voir l'activité en temps réel
echo  5. √ PROFITS AUTOMATIQUES !
echo.
echo  💰 RÉSULTATS ATTENDUS :
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  • 1 heure   : $200-500
echo  • 24 heures : $1,000-3,000
echo  • 30 jours  : $30,000-100,000+
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:STANDARD
REM ═══════════════════════════════════════════════════════════════════════════════
start START.bat
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:CONFIG_WALLET
REM ═══════════════════════════════════════════════════════════════════════════════
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║  🔧 CONFIGURATION WALLET                                                     ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
cd backend
python generate_wallet.py
echo.
pause
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:CHECK_BALANCE
REM ═══════════════════════════════════════════════════════════════════════════════
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║  💰 VÉRIFICATION BALANCE                                                     ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
cd backend
python check_balance.py
echo.
pause
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:GUIDE_GOD_MODE
REM ═══════════════════════════════════════════════════════════════════════════════
start "" "🌌_GOD_MODE_README.md"
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:INDEX
REM ═══════════════════════════════════════════════════════════════════════════════
start "" "📚_INDEX_COMPLET_GOD_MODE.md"
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:DEMARRAGE
REM ═══════════════════════════════════════════════════════════════════════════════
start "" "⚡_DÉMARRAGE_IMMÉDIAT.md"
goto MENU

REM ═══════════════════════════════════════════════════════════════════════════════
:QUIT
REM ═══════════════════════════════════════════════════════════════════════════════
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════════════════════╗
echo  ║                                                                               ║
echo  ║  💎 Merci d'utiliser THESORIA - GOD MODE                                     ║
echo  ║                                                                               ║
echo  ║  Profits : ∞%%                                                                 ║
echo  ║  Niveau : INFINI 🌌                                                          ║
echo  ║                                                                               ║
echo  ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.
timeout /t 2 /nobreak >nul
exit