@echo off
REM ═══════════════════════════════════════════════════════════════
REM 🚀 DÉPLOIEMENT AUTOMATIQUE THESORIA - PRODUCTION
REM ═══════════════════════════════════════════════════════════════

color 0A
title THESORIA - Déploiement Production

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo           ⚡ THESORIA - DÉPLOIEMENT PRODUCTION ⚡
echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 1 : NETTOYAGE
REM ═══════════════════════════════════════════════════════════════

echo [ÉTAPE 1/5] 🧹 Nettoyage des anciens builds...
echo.

if exist dist (
    rmdir /s /q dist
    echo ✅ Dossier dist supprimé
) else (
    echo ⚠️  Pas de dossier dist à supprimer
)

if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo ✅ Cache Vite nettoyé
) else (
    echo ⚠️  Pas de cache Vite
)

echo.
echo ════════════════════════════════════════════════════════════════

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 2 : VÉRIFICATION DES DÉPENDANCES
REM ═══════════════════════════════════════════════════════════════

echo [ÉTAPE 2/5] 📦 Vérification des dépendances...
echo.

if not exist node_modules (
    echo ⚠️  node_modules manquant, installation en cours...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo ❌ ERREUR : Installation des dépendances échouée
        echo.
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées
) else (
    echo ✅ node_modules présent
)

echo.
echo ════════════════════════════════════════════════════════════════

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 3 : BUILD PRODUCTION
REM ═══════════════════════════════════════════════════════════════

echo [ÉTAPE 3/5] 🔨 Compilation du build production...
echo.
echo ⚙️  Configuration :
echo    - Framework   : Vite + React
echo    - Output      : dist/
echo    - Minify      : Terser (Optimisation maximale)
echo    - Sourcemaps  : Désactivés
echo.
echo 🕐 Temps estimé : 15-30 secondes
echo.

npm run build

if errorlevel 1 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo ❌ ERREUR : Le build a échoué
    echo ════════════════════════════════════════════════════════════
    echo.
    echo 💡 Solutions :
    echo    1. Vérifier les erreurs ci-dessus
    echo    2. Nettoyer : rmdir /s /q node_modules ^& npm install
    echo    3. Vérifier la mémoire : set NODE_OPTIONS=--max-old-space-size=4096
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════════

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 4 : VÉRIFICATION DU BUILD
REM ═══════════════════════════════════════════════════════════════

echo [ÉTAPE 4/5] ✅ Vérification du build...
echo.

if not exist dist (
    echo ❌ ERREUR : Le dossier dist n'a pas été créé
    echo.
    pause
    exit /b 1
)

if not exist dist\index.html (
    echo ❌ ERREUR : index.html manquant dans dist
    echo.
    pause
    exit /b 1
)

echo ✅ Structure du build :
echo.
dir dist /s /b | findstr /i "index.html" >nul 2>&1
if not errorlevel 1 (
    echo    ✅ dist\index.html
)
dir dist\assets /s /b | findstr /i ".js" >nul 2>&1
if not errorlevel 1 (
    echo    ✅ dist\assets\*.js
)
dir dist\assets /s /b | findstr /i ".css" >nul 2>&1
if not errorlevel 1 (
    echo    ✅ dist\assets\*.css
)

echo.
echo 📊 Taille du build :
for /f "tokens=3" %%a in ('dir dist /s /-c ^| findstr "fichier"') do set size=%%a
echo    📦 %size% octets
echo.

echo ════════════════════════════════════════════════════════════════

REM ═══════════════════════════════════════════════════════════════
REM ÉTAPE 5 : CHOIX DU DÉPLOIEMENT
REM ═══════════════════════════════════════════════════════════════

echo [ÉTAPE 5/5] 🚀 Déploiement...
echo.
echo Choisissez votre méthode de déploiement :
echo.
echo   [1] Déployer sur Vercel (via CLI) - Recommandé
echo   [2] Tester en local (Preview)
echo   [3] Instructions GitHub + Vercel
echo   [4] Quitter
echo.

set /p choice="Votre choix (1-4) : "

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto preview_local
if "%choice%"=="3" goto github_instructions
if "%choice%"=="4" goto end

REM Choix invalide
echo.
echo ❌ Choix invalide. Veuillez relancer le script.
pause
exit /b 1

REM ═══════════════════════════════════════════════════════════════
REM OPTION 1 : DÉPLOIEMENT VERCEL CLI
REM ═══════════════════════════════════════════════════════════════

:deploy_vercel
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 DÉPLOIEMENT SUR VERCEL
echo ════════════════════════════════════════════════════════════════
echo.

REM Vérifier si Vercel CLI est installé
where vercel >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI non trouvé. Installation...
    echo.
    npm install -g vercel
    if errorlevel 1 (
        echo.
        echo ❌ Impossible d'installer Vercel CLI
        echo.
        echo 💡 Solution alternative :
        echo    npm install vercel --save-dev
        echo    npx vercel --prod
        echo.
        pause
        exit /b 1
    )
)

echo ✅ Vercel CLI installé
echo.
echo 📝 Vous allez être redirigé vers la connexion Vercel...
echo.
pause

REM Déployer en production
vercel --prod

if errorlevel 1 (
    echo.
    echo ❌ Le déploiement a échoué
    echo.
    echo 💡 Solutions :
    echo    1. Se connecter : vercel login
    echo    2. Vérifier le compte Vercel
    echo    3. Essayer : npx vercel --prod
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════════
echo ✅ DÉPLOIEMENT RÉUSSI !
echo ════════════════════════════════════════════════════════════════
echo.
echo 🎉 Votre application THESORIA est maintenant en ligne !
echo.
echo 📊 Prochaines étapes :
echo    1. Ouvrir l'URL fournie ci-dessus
echo    2. Tester la connexion MetaMask
echo    3. Vérifier les fonctionnalités DeFi
echo    4. Configurer le smart contract FlashBot
echo.
goto end

REM ═══════════════════════════════════════════════════════════════
REM OPTION 2 : PREVIEW LOCAL
REM ═══════════════════════════════════════════════════════════════

:preview_local
echo.
echo ════════════════════════════════════════════════════════════════
echo 🔍 TEST LOCAL DU BUILD
echo ════════════════════════════════════════════════════════════════
echo.
echo Lancement du serveur de preview...
echo.
echo 📍 URL : http://localhost:4173
echo.
echo ⚠️  Appuyez sur CTRL+C pour arrêter le serveur
echo.

npm run preview

goto end

REM ═══════════════════════════════════════════════════════════════
REM OPTION 3 : INSTRUCTIONS GITHUB
REM ═══════════════════════════════════════════════════════════════

:github_instructions
echo.
echo ════════════════════════════════════════════════════════════════
echo 📚 DÉPLOIEMENT VIA GITHUB + VERCEL
echo ════════════════════════════════════════════════════════════════
echo.
echo ÉTAPE 1 : Initialiser Git (si pas déjà fait)
echo ──────────────────────────────────────────────────────────────
echo.
echo   git init
echo   git add .
echo   git commit -m "🚀 THESORIA Production Ready"
echo.
echo ÉTAPE 2 : Créer un repo sur GitHub
echo ──────────────────────────────────────────────────────────────
echo.
echo   1. Aller sur https://github.com/new
echo   2. Nom du repo : thesoria-web3-platform
echo   3. Visibilité : Public ou Private
echo   4. Créer le repo
echo.
echo ÉTAPE 3 : Push vers GitHub
echo ──────────────────────────────────────────────────────────────
echo.
echo   git remote add origin https://github.com/VOTRE_USERNAME/thesoria-web3-platform.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo ÉTAPE 4 : Connecter à Vercel
echo ──────────────────────────────────────────────────────────────
echo.
echo   1. Aller sur https://vercel.com
echo   2. Cliquer "New Project"
echo   3. Importer votre repo GitHub
echo   4. Configuration détectée automatiquement ✅
echo   5. Cliquer "Deploy"
echo.
echo ÉTAPE 5 : Variables d'environnement (Optionnel)
echo ──────────────────────────────────────────────────────────────
echo.
echo   Dans Vercel Dashboard ^> Settings ^> Environment Variables :
echo.
echo   VITE_APP_NAME=THESORIA
echo   VITE_APP_VERSION=3.0.0
echo   VITE_ALCHEMY_API_KEY=XUbdW3HgRyDHALSbpyjPr
echo   VITE_ETHERSCAN_API_KEY=F9F4JPNB5UC6E5M79IY6DIBP58J4I7BRQ3
echo.
echo ════════════════════════════════════════════════════════════════
echo.
goto end

REM ═══════════════════════════════════════════════════════════════
REM FIN DU SCRIPT
REM ═══════════════════════════════════════════════════════════════

:end
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo   ✨ MERCI D'AVOIR UTILISÉ LE SCRIPT DE DÉPLOIEMENT THESORIA ✨
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
