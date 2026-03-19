@echo off
REM ═══════════════════════════════════════════════════════════════
REM 🚀 SCRIPT DE BUILD THESORIA POUR VERCEL
REM ═══════════════════════════════════════════════════════════════

echo.
echo ═══════════════════════════════════════════════════════════════
echo 🏗️  BUILD THESORIA POUR PRODUCTION
echo ═══════════════════════════════════════════════════════════════
echo.

REM Étape 1 : Nettoyer l'ancien build
echo 🧹 Étape 1/4 : Nettoyage...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite

REM Étape 2 : Vérifier les dépendances
echo.
echo 📦 Étape 2/4 : Vérification des dépendances...
if not exist node_modules (
    echo ⚠️  node_modules manquant, installation...
    npm install
)

REM Étape 3 : Build
echo.
echo 🔨 Étape 3/4 : Compilation...
npm run build

REM Étape 4 : Vérifier le résultat
echo.
echo ✅ Étape 4/4 : Vérification...
if exist dist (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo ✅ BUILD RÉUSSI !
    echo ════════════════════════════════════════════════════════════
    echo.
    echo 📂 Dossier de sortie : dist\
    echo.
    dir /s dist\index.html >nul 2>&1
    if errorlevel 1 (
        echo ⚠️  Avertissement : index.html non trouvé
    ) else (
        echo ✅ index.html : Trouvé
    )
    echo.
    echo 🚀 Prêt pour déploiement Vercel !
    echo.
    echo Pour déployer :
    echo   1. Installer Vercel CLI : npm install -g vercel
    echo   2. Se connecter        : vercel login
    echo   3. Déployer            : vercel --prod
    echo.
    echo Ou via Git :
    echo   1. Push vers GitHub    : git push
    echo   2. Vercel auto-deploy
    echo.
) else (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo ❌ ERREUR : Le dossier dist n'a pas été créé
    echo ════════════════════════════════════════════════════════════
    echo.
    echo 💡 Solutions :
    echo   1. Vérifier les erreurs ci-dessus
    echo   2. Relancer : npm run build
    echo   3. Vérifier vite.config.js
    echo.
)

echo.
pause
