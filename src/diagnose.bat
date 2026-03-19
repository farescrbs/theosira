@echo off
REM ═══════════════════════════════════════════════════════════════════
REM THESORIA - DIAGNOSTIC AUTOMATIQUE
REM ═══════════════════════════════════════════════════════════════════

COLOR 0E
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║         🔧 THESORIA - DIAGNOSTIC AUTOMATIQUE 🔧                   ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

echo Diagnostic en cours...
echo.

REM Créer dossier pour rapport
if not exist "diagnostic" mkdir diagnostic

REM Fichier rapport
set REPORT=diagnostic\diagnostic_report_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%.txt
set REPORT=%REPORT: =0%

echo ═══════════════════════════════════════════════════════════════════ > %REPORT%
echo THESORIA - RAPPORT DE DIAGNOSTIC >> %REPORT%
echo Date: %date% %time% >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%
echo. >> %REPORT%

echo [1/10] Vérification de l'environnement Windows...
echo. >> %REPORT%
echo [1] ENVIRONNEMENT WINDOWS >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%
ver >> %REPORT%
echo. >> %REPORT%

echo [2/10] Vérification de Python...
echo [2] PYTHON >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python detecte >> %REPORT%
    python --version >> %REPORT%
    echo.
    echo ✅ Python OK
) else (
    echo ❌ Python NON DETECTE >> %REPORT%
    echo.
    echo ❌ PROBLEME: Python n'est pas installe ou pas dans PATH
    echo.
    echo SOLUTION:
    echo   1. Telecharger: https://www.python.org/downloads/
    echo   2. Installer en cochant "Add Python to PATH"
    echo   3. Redemarrer ce script
    goto :error
)
echo. >> %REPORT%

echo [3/10] Vérification de pip...
echo [3] PIP >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

pip --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ pip detecte >> %REPORT%
    pip --version >> %REPORT%
    echo ✅ pip OK
) else (
    echo ❌ pip NON DETECTE >> %REPORT%
    echo ❌ PROBLEME: pip non trouve
    echo.
    echo SOLUTION:
    echo   python -m pip install --upgrade pip
    goto :error
)
echo. >> %REPORT%

echo [4/10] Vérification de Node.js...
echo [4] NODE.JS >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js detecte >> %REPORT%
    node --version >> %REPORT%
    echo ✅ Node.js OK
) else (
    echo ⚠️ Node.js NON DETECTE >> %REPORT%
    echo ⚠️ WARNING: Node.js non trouve (optionnel pour backend)
)
echo. >> %REPORT%

echo [5/10] Vérification de npm...
echo [5] NPM >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm detecte >> %REPORT%
    npm --version >> %REPORT%
    echo ✅ npm OK
) else (
    echo ⚠️ npm NON DETECTE >> %REPORT%
    echo ⚠️ WARNING: npm non trouve (optionnel pour backend)
)
echo. >> %REPORT%

echo [6/10] Vérification des modules Python...
echo [6] MODULES PYTHON >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

echo Modules installes: >> %REPORT%
pip list >> %REPORT% 2>&1
echo. >> %REPORT%

echo Verification modules requis: >> %REPORT%

python -c "import web3" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ web3 OK >> %REPORT%
    echo   ✅ web3
) else (
    echo ❌ web3 MANQUANT >> %REPORT%
    echo   ❌ web3 manquant
    set MISSING=1
)

python -c "import colorama" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ colorama OK >> %REPORT%
    echo   ✅ colorama
) else (
    echo ❌ colorama MANQUANT >> %REPORT%
    echo   ❌ colorama manquant
    set MISSING=1
)

python -c "import fastapi" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ fastapi OK >> %REPORT%
    echo   ✅ fastapi
) else (
    echo ❌ fastapi MANQUANT >> %REPORT%
    echo   ❌ fastapi manquant
    set MISSING=1
)

python -c "import dotenv" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ python-dotenv OK >> %REPORT%
    echo   ✅ python-dotenv
) else (
    echo ❌ python-dotenv MANQUANT >> %REPORT%
    echo   ❌ python-dotenv manquant
    set MISSING=1
)

if defined MISSING (
    echo. >> %REPORT%
    echo ❌ Certains modules Python sont manquants >> %REPORT%
    echo.
    echo ❌ PROBLEME: Modules Python manquants
    echo.
    echo SOLUTION - Executer cette commande:
    echo   pip install web3 colorama fastapi uvicorn python-dotenv aiohttp requests pyyaml cryptography
    echo.
    goto :error
)
echo. >> %REPORT%

echo [7/10] Vérification de .env.production...
echo [7] FICHIER .ENV.PRODUCTION >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

if exist ".env.production" (
    echo ✅ .env.production trouve >> %REPORT%
    echo ✅ .env.production existe
    echo. >> %REPORT%
    echo Contenu (securise): >> %REPORT%
    type .env.production | findstr /V "KEY SECRET PASSWORD" >> %REPORT%
) else (
    echo ❌ .env.production NON TROUVE >> %REPORT%
    echo ❌ PROBLEME: .env.production n'existe pas
    echo.
    echo SOLUTION:
    echo   1. copy .env.example .env.production
    echo   2. notepad .env.production
    echo   3. Remplir les variables
    goto :error
)
echo. >> %REPORT%

echo [8/10] Vérification de la structure des dossiers...
echo [8] STRUCTURE DOSSIERS >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

set MISSING_DIRS=0

if exist "backend" (
    echo ✅ backend/ >> %REPORT%
    echo   ✅ backend/
) else (
    echo ❌ backend/ MANQUANT >> %REPORT%
    echo   ❌ backend/ manquant
    set MISSING_DIRS=1
)

if exist "logs" (
    echo ✅ logs/ >> %REPORT%
) else (
    echo ⚠️ logs/ absent (sera cree) >> %REPORT%
    mkdir logs
)

if exist "backups" (
    echo ✅ backups/ >> %REPORT%
) else (
    echo ⚠️ backups/ absent (sera cree) >> %REPORT%
    mkdir backups
)

if exist "reports" (
    echo ✅ reports/ >> %REPORT%
) else (
    echo ⚠️ reports/ absent (sera cree) >> %REPORT%
    mkdir reports
)

if %MISSING_DIRS%==1 (
    echo.
    echo ❌ PROBLEME: Dossiers essentiels manquants
    echo SOLUTION: Verifier que vous etes dans le bon repertoire
    goto :error
)
echo. >> %REPORT%

echo [9/10] Vérification des fichiers backend...
echo [9] FICHIERS BACKEND >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

set MISSING_FILES=0

if exist "backend\production_trader.py" (
    echo ✅ production_trader.py >> %REPORT%
    echo   ✅ production_trader.py
) else (
    echo ❌ production_trader.py MANQUANT >> %REPORT%
    echo   ❌ production_trader.py manquant
    set MISSING_FILES=1
)

if exist "backend\test_installation.py" (
    echo ✅ test_installation.py >> %REPORT%
) else (
    echo ⚠️ test_installation.py absent >> %REPORT%
)

if %MISSING_FILES%==1 (
    echo.
    echo ❌ PROBLEME: Fichiers backend manquants
    goto :error
)
echo. >> %REPORT%

echo [10/10] Test de connexion Python...
echo [10] TEST PYTHON >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

python -c "print('Test Python OK')" >> %REPORT% 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python fonctionne correctement >> %REPORT%
    echo ✅ Python fonctionne
) else (
    echo ❌ Erreur execution Python >> %REPORT%
    echo ❌ PROBLEME: Python ne peut pas executer de code
    goto :error
)
echo. >> %REPORT%

REM Test avancé si test_installation.py existe
if exist "backend\test_installation.py" (
    echo [BONUS] Test d'installation complet... >> %REPORT%
    echo. >> %REPORT%
    cd backend
    python test_installation.py >> ..\%REPORT% 2>&1
    cd ..
)

echo. >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%
echo FIN DU DIAGNOSTIC >> %REPORT%
echo ═══════════════════════════════════════════════════════════════════ >> %REPORT%

echo.
echo ═══════════════════════════════════════════════════════════════════
echo ✅ DIAGNOSTIC TERMINE AVEC SUCCES
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Votre systeme est pret pour le lancement!
echo.
echo Rapport sauvegarde: %REPORT%
echo.
echo PROCHAINES ETAPES:
echo   1. Verifier .env.production (toutes les variables)
echo   2. Lancer: start_all_windows.bat
echo.
pause
goto :end

:error
echo.
echo ═══════════════════════════════════════════════════════════════════
echo ❌ DIAGNOSTIC: PROBLEMES DETECTES
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Rapport complet sauvegarde: %REPORT%
echo.
echo Consultez le rapport pour voir tous les details.
echo Suivez les SOLUTIONS indiquees ci-dessus.
echo.
echo Besoin d'aide? Lisez: INSTALLATION_WINDOWS_GUIDE.md
echo.
pause
goto :end

:end
exit /b 0
