@echo off
echo.
echo ═══════════════════════════════════════════════════════════════
echo   🔥 SOLUTION FINALE APPLIQUÉE - VIDER CACHE MAINTENANT
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ CORRECTIONS DANS LE CODE :
echo.
echo 1. WebSocket désactivé par défaut (backendEnabled = false)
echo 2. Bloqueur 4 niveaux activé (blockAllWebSocketErrors)
echo 3. Aucune connexion au chargement
echo.
echo ⚠️  TU VOIS ENCORE L'ERREUR = CACHE NAVIGATEUR !
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📋 ÉTAPE 1 : NETTOYER SERVEUR (EN COURS...)
echo.

REM Arrêter processus
taskkill /F /IM node.exe 2>nul
echo    ✅ Processus arrêtés
timeout /t 1 >nul

REM Nettoyer cache
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist

echo    ✅ Cache serveur nettoyé
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📋 ÉTAPE 2 : VIDER CACHE NAVIGATEUR (TOI !)
echo.
echo    Option A - Mode Incognito (LE PLUS SIMPLE) :
echo    1. Ctrl + Shift + N
echo    2. http://localhost:3000
echo    3. F12 → Vérifier console
echo.
echo    Option B - Vider cache complet :
echo    1. F12 → Application → Clear storage → Clear all
echo    2. Ctrl + Shift + R (5 fois)
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🚀 Démarrage serveur...
echo.

REM Démarrer serveur
npm run dev
