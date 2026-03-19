@echo off
REM ═══════════════════════════════════════════════════════════════════════════
REM THESORIA - Script de Nettoyage Cache Windows
REM Résout les problèmes "ReferenceError" et cache Vite
REM ═══════════════════════════════════════════════════════════════════════════

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║  🧹 NETTOYAGE COMPLET CACHE                                             ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

REM Arrêter processus Node existants
echo 🛑 Arrêt des processus Node/Vite existants...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

REM Supprimer cache Vite
echo 🗑️  Suppression cache Vite...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist

REM Supprimer cache TypeScript
echo 🗑️  Suppression cache TypeScript...
if exist .tsbuildinfo del /f /q .tsbuildinfo

echo.
echo ✅ Cache serveur nettoyé avec succès !
echo.
echo 📋 Prochaines étapes OBLIGATOIRES :
echo.
echo    1. Lancer serveur : npm run dev
echo    2. Ouvrir navigateur : http://localhost:3000
echo    3. ⚠️  HARD REFRESH : Ctrl + Shift + R (CRUCIAL!)
echo.
echo Si erreur WebSocket persiste :
echo    → F12 → Application → Clear storage → Clear all
echo    → Puis Ctrl + Shift + R
echo.
echo 🔥 L'erreur WebSocket sera supprimée !
echo.
pause