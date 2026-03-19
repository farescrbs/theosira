@echo off
REM ═══════════════════════════════════════════════════════════════════════════
REM THESORIA - Nettoyage FORCÉ et Redémarrage Automatique (Windows)
REM ═══════════════════════════════════════════════════════════════════════════

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║  🔥 NETTOYAGE FORCÉ + REDÉMARRAGE AUTO                        ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM 1. Tuer TOUS les processus Node
echo 🛑 Arrêt FORCÉ de tous les processus Node...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

REM 2. Supprimer TOUS les caches
echo 🗑️  Suppression COMPLÈTE des caches...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist
if exist .tsbuildinfo del /f /q .tsbuildinfo
if exist .turbo rmdir /s /q .turbo
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo ✅ Cache serveur nettoyé !
echo.
echo 📋 ÉTAPE SUIVANTE (OBLIGATOIRE) :
echo.
echo    Vider cache navigateur :
echo    1. Ouvrir http://localhost:3000
echo    2. F12 (DevTools)
echo    3. Clic droit sur le bouton refresh 🔄
echo    4. Sélectionner 'Vider le cache et actualiser'
echo    5. Ou : Ctrl + Shift + R (plusieurs fois)
echo.

REM 3. Redémarrage auto
echo 🚀 Redémarrage du serveur dans 3 secondes...
timeout /t 3 >nul

npm run dev
