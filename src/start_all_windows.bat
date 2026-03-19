@echo off
REM ═══════════════════════════════════════════════════════════════════
REM THESORIA - WINDOWS LAUNCHER
REM ═══════════════════════════════════════════════════════════════════

COLOR 0A
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║         🚀 THESORIA - PRODUCTION LAUNCHER (WINDOWS) 🚀            ║
echo ║                                                                   ║
echo ║               ⚠️  ARGENT RÉEL - SOYEZ PRUDENT ⚠️                 ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

REM Vérifier Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python n'est pas installé ou pas dans PATH
    echo.
    echo Installer Python depuis: https://www.python.org/downloads/
    echo ⚠️  Cocher "Add Python to PATH" pendant l'installation
    pause
    exit /b 1
)

echo ✅ Python détecté
python --version

REM Vérifier dossiers
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups
if not exist "reports" mkdir reports
if not exist "dashboards" mkdir dashboards

echo ✅ Dossiers créés

REM Vérifier .env.production
if not exist ".env.production" (
    echo.
    echo ⚠️  .env.production n'existe pas
    echo.
    echo Créer d'abord votre fichier de configuration:
    echo   1. copy .env.example .env.production
    echo   2. notepad .env.production
    echo   3. Remplir toutes les API keys
    echo.
    pause
    exit /b 1
)

echo ✅ .env.production trouvé

REM Menu de sélection
echo.
echo ═══════════════════════════════════════════════════════════════════
echo SÉLECTION DU MODE DE LANCEMENT
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   1. Mode Conservateur (Recommandé pour débuter)
echo   2. Mode Équilibré (Trading modéré)
echo   3. Mode Complet (Tous systèmes - Experts)
echo   4. Mode Test (Simulation sans argent réel)
echo   5. Lancer un système spécifique
echo   0. Quitter
echo.
set /p choice="Choisir (0-5): "

if "%choice%"=="0" goto :end
if "%choice%"=="1" goto :conservative
if "%choice%"=="2" goto :balanced
if "%choice%"=="3" goto :full
if "%choice%"=="4" goto :test
if "%choice%"=="5" goto :specific

echo Choix invalide
pause
exit /b 1

:conservative
echo.
echo 🟢 MODE CONSERVATEUR
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Lancement des systèmes de base avec risque minimal...
echo.

cd backend

echo [%time%] Lancement Production Trader...
start "THESORIA - Production Trader" cmd /k "python production_trader.py"
timeout /t 2 >nul

echo [%time%] Lancement ML Prediction Engine...
start "THESORIA - ML Predictions" cmd /k "python ml_prediction_engine.py"
timeout /t 2 >nul

echo.
echo ✅ Systèmes conservateurs lancés
goto :monitor

:balanced
echo.
echo 🟡 MODE ÉQUILIBRÉ
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Lancement des systèmes avancés...
echo.

cd backend

echo [%time%] Lancement Production Trader...
start "THESORIA - Production Trader" cmd /k "python production_trader.py"
timeout /t 2 >nul

echo [%time%] Lancement ML Prediction Engine...
start "THESORIA - ML Predictions" cmd /k "python ml_prediction_engine.py"
timeout /t 2 >nul

echo [%time%] Lancement Whale Tracking System...
start "THESORIA - Whale Tracker" cmd /k "python whale_tracking_system.py"
timeout /t 2 >nul

echo [%time%] Lancement AI Portfolio Manager...
start "THESORIA - AI Portfolio" cmd /k "python ai_portfolio_manager.py"
timeout /t 2 >nul

echo.
echo ✅ Systèmes équilibrés lancés
goto :monitor

:full
echo.
echo 🔴 MODE COMPLET
echo ═══════════════════════════════════════════════════════════════════
echo.
echo ⚠️  WARNING: Ce mode lance TOUS les systèmes
echo ⚠️  Assurez-vous d'avoir suffisamment de capital
echo.
set /p confirm="Taper 'OUI' pour confirmer: "

if not "%confirm%"=="OUI" (
    echo Annulé
    goto :end
)

cd backend

echo [%time%] Lancement Production Trader...
start "THESORIA - Production Trader" cmd /k "python production_trader.py"
timeout /t 2 >nul

echo [%time%] Lancement ML Prediction Engine...
start "THESORIA - ML Predictions" cmd /k "python ml_prediction_engine.py"
timeout /t 2 >nul

echo [%time%] Lancement Whale Tracking System...
start "THESORIA - Whale Tracker" cmd /k "python whale_tracking_system.py"
timeout /t 2 >nul

echo [%time%] Lancement Market Making Bot...
start "THESORIA - Market Making" cmd /k "python market_making_bot.py"
timeout /t 2 >nul

echo [%time%] Lancement AI Portfolio Manager...
start "THESORIA - AI Portfolio" cmd /k "python ai_portfolio_manager.py"
timeout /t 2 >nul

echo [%time%] Lancement Multi-Account Fleet Manager...
start "THESORIA - Fleet Manager" cmd /k "python multi_account_fleet_manager.py"
timeout /t 2 >nul

echo.
echo ✅ Tous les systèmes lancés
goto :monitor

:test
echo.
echo 🧪 MODE TEST
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Lancement en mode simulation (pas d'argent réel)...
echo.

cd backend

echo [%time%] Lancement Production Trader (Test Mode)...
start "THESORIA - Test Mode" cmd /k "set TESTNET=true && python production_trader.py"

echo.
echo ✅ Mode test lancé
goto :monitor

:specific
echo.
echo 📋 SYSTÈMES DISPONIBLES
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   1. Production Trader
echo   2. ML Prediction Engine
echo   3. Whale Tracking System
echo   4. Market Making Bot
echo   5. AI Portfolio Manager
echo   6. Multi-Account Fleet Manager
echo   7. Backtesting Engine
echo   0. Retour
echo.
set /p sys="Choisir système (0-7): "

cd backend

if "%sys%"=="1" start "THESORIA - Production Trader" cmd /k "python production_trader.py"
if "%sys%"=="2" start "THESORIA - ML Predictions" cmd /k "python ml_prediction_engine.py"
if "%sys%"=="3" start "THESORIA - Whale Tracker" cmd /k "python whale_tracking_system.py"
if "%sys%"=="4" start "THESORIA - Market Making" cmd /k "python market_making_bot.py"
if "%sys%"=="5" start "THESORIA - AI Portfolio" cmd /k "python ai_portfolio_manager.py"
if "%sys%"=="6" start "THESORIA - Fleet Manager" cmd /k "python multi_account_fleet_manager.py"
if "%sys%"=="7" start "THESORIA - Backtesting" cmd /k "python advanced_backtesting_engine.py"
if "%sys%"=="0" goto :end

goto :monitor

:monitor
echo.
echo ═══════════════════════════════════════════════════════════════════
echo ✅ SYSTÈMES LANCÉS AVEC SUCCÈS
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 📊 Monitoring:
echo   - Les systèmes tournent dans des fenêtres séparées
echo   - Logs: logs\*.log
echo   - Pour voir logs: notepad logs\production_trader.log
echo.
echo 🌐 Accès:
echo   - Dashboard: http://localhost:3000 (si frontend lancé)
echo   - API: http://localhost:8000
echo.
echo ⚠️  Pour arrêter:
echo   - Fermer les fenêtres des systèmes
echo   - OU appuyer sur Ctrl+C dans chaque fenêtre
echo.
echo 💡 Prochaines étapes:
echo   1. Vérifier les logs
echo   2. Monitor wallet balance
echo   3. Vérifier P^&L quotidien
echo   4. Ajuster paramètres si nécessaire
echo.

REM Proposer de lancer le monitoring
echo.
set /p mon="Voulez-vous ouvrir les logs maintenant? (O/N): "

if /i "%mon%"=="O" (
    if exist "logs\production_trader.log" (
        start notepad logs\production_trader.log
    )
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo 🎉 THESORIA EST MAINTENANT ACTIF
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Bonne chance et bon trading! 🚀💰
echo.
pause

:end
exit /b 0
