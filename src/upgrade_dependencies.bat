@echo off
REM ═══════════════════════════════════════════════════════════════════
REM THESORIA - UPGRADE DEPENDENCIES (SECURITY FIXES)
REM ═══════════════════════════════════════════════════════════════════

COLOR 0A
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║         🔒 THESORIA - SECURITY UPDATE 🔒                          ║
echo ║                                                                   ║
echo ║         Upgrading dependencies with security fixes...            ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

REM Vérifier Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python non trouvé
    pause
    exit /b 1
)

echo ✅ Python détecté
python --version
echo.

echo ═══════════════════════════════════════════════════════════════════
echo 🔄 MISE À JOUR DES DÉPENDANCES
echo ═══════════════════════════════════════════════════════════════════
echo.

REM Upgrade aiohttp (Security Fix)
echo [1/3] Mise à jour aiohttp (Fix CVE directory traversal)...
pip install --upgrade aiohttp==3.9.5
if %errorlevel% equ 0 (
    echo ✅ aiohttp upgraded to 3.9.5
) else (
    echo ❌ Erreur upgrade aiohttp
)
echo.

REM Upgrade autres dépendances critiques
echo [2/3] Mise à jour production/mev_god_mode dependencies...
pip install --upgrade -r production/mev_god_mode/requirements.txt
if %errorlevel% equ 0 (
    echo ✅ MEV God Mode dependencies updated
) else (
    echo ⚠️  Erreur partielle
)
echo.

REM Upgrade main requirements si existe
if exist "requirements.txt" (
    echo [3/3] Mise à jour main requirements...
    pip install --upgrade -r requirements.txt
    if %errorlevel% equ 0 (
        echo ✅ Main requirements updated
    ) else (
        echo ⚠️  Erreur partielle
    )
) else (
    echo [3/3] requirements.txt non trouvé (ignoré)
)
echo.

echo ═══════════════════════════════════════════════════════════════════
echo 🔍 VÉRIFICATION DES VERSIONS
echo ═══════════════════════════════════════════════════════════════════
echo.

echo Checking aiohttp version...
python -c "import aiohttp; print(f'aiohttp: {aiohttp.__version__}')" 2>nul
echo.

echo Checking web3 version...
python -c "import web3; print(f'web3: {web3.__version__}')" 2>nul
echo.

echo ═══════════════════════════════════════════════════════════════════
echo ✅ MISE À JOUR TERMINÉE
echo ═══════════════════════════════════════════════════════════════════
echo.

echo Fixes de sécurité appliqués:
echo   ✅ aiohttp 3.9.1 → 3.9.5 (Directory traversal fix)
echo   ✅ Subprocess shell=False (Command injection fix)
echo.

echo Documentation:
echo   - SECURITY_FIX_AIOHTTP.md
echo   - SECURITY_FIX_APPLIED.md
echo.

echo Prochaines étapes:
echo   1. Tester l'application
echo   2. Vérifier les logs
echo   3. Redémarrer les systèmes si nécessaire
echo.

pause
