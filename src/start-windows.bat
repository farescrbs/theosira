@echo off
REM ╔═══════════════════════════════════════════════════════════════════════════════╗
REM ║  🚀 THESORIA - DÉMARRAGE RAPIDE WINDOWS                                      ║
REM ╚═══════════════════════════════════════════════════════════════════════════════╝

cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║  💎 THESORIA - SYSTÈME DE PROFITS AUTONOME                   ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier si wallet configuré
if not exist "backend\.env" (
    echo ❌ Configuration manquante!
    echo.
    echo 📋 PREMIÈRE UTILISATION - CONFIGURATION NÉCESSAIRE:
    echo.
    echo 1. Générer wallet:
    echo    cd backend
    echo    python generate_wallet.py
    echo.
    echo 2. Envoyer $10 ETH au wallet généré
    echo.
    echo 3. Configurer RPC Alchemy dans backend\.env
    echo.
    echo 4. Relancer ce script
    echo.
    pause
    exit
)

echo ✅ Configuration trouvée
echo.

REM Vérifier balance
echo 💰 Vérification balance...
cd backend
python check_balance.py
if errorlevel 1 (
    echo.
    echo ⚠️  Problème détecté. Vérifier configuration.
    pause
    exit
)
cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo  LANCEMENT SYSTÈME
echo ═══════════════════════════════════════════════════════════════
echo.
echo Ouverture de 2 terminaux:
echo   • Terminal 1: Frontend (interface web)
echo   • Terminal 2: Bot Python (trading)
echo.
echo Puis ouvrir: http://localhost:3000
echo.
pause

REM Lancer frontend dans nouveau terminal
start "THESORIA Frontend" cmd /k "npm start"

REM Attendre 3 secondes
timeout /t 3 /nobreak >nul

REM Lancer bot dans nouveau terminal
start "THESORIA Bot" cmd /k "cd backend && python zero_capital_bot.py"

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ✅ SYSTÈME LANCÉ!                                            ║
echo ║                                                               ║
echo ║  📊 PROCHAINES ÉTAPES:                                        ║
echo ║  1. Ouvrir http://localhost:3000                             ║
echo ║  2. Connecter MetaMask                                        ║
echo ║  3. Voir profits arriver! 💰                                 ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Appuyer sur une touche pour fermer ce terminal...
pause >nul
