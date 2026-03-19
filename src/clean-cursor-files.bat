@echo off
REM ═══════════════════════════════════════════════════════════════
REM 🗑️ SUPPRESSION DES FICHIERS DE CURSEUR INUTILISÉS
REM ═══════════════════════════════════════════════════════════════

echo.
echo ═══════════════════════════════════════════════════════════════
echo 🗑️  NETTOYAGE DES COMPOSANTS DE CURSEUR
echo ═══════════════════════════════════════════════════════════════
echo.

echo ⚠️  Ce script va SUPPRIMER DÉFINITIVEMENT les fichiers suivants :
echo.
echo   - components\LuxuryCursor.tsx
echo   - components\MagneticCursor.tsx
echo   - components\CursorTrailEffect.tsx
echo   - components\SimpleLuxuryCursor.tsx
echo   - components\EnhancedLuxuryCursor.tsx
echo.
echo Ces fichiers ne sont plus utilisés dans l'application.
echo.

set /p confirm="Voulez-vous continuer ? (o/N) : "

if /i not "%confirm%"=="o" (
    echo.
    echo ❌ Opération annulée.
    echo.
    pause
    exit /b 0
)

echo.
echo 🗑️  Suppression en cours...
echo.

if exist components\LuxuryCursor.tsx (
    del /f components\LuxuryCursor.tsx
    echo ✅ Supprimé : LuxuryCursor.tsx
) else (
    echo ⚠️  Non trouvé : LuxuryCursor.tsx
)

if exist components\MagneticCursor.tsx (
    del /f components\MagneticCursor.tsx
    echo ✅ Supprimé : MagneticCursor.tsx
) else (
    echo ⚠️  Non trouvé : MagneticCursor.tsx
)

if exist components\CursorTrailEffect.tsx (
    del /f components\CursorTrailEffect.tsx
    echo ✅ Supprimé : CursorTrailEffect.tsx
) else (
    echo ⚠️  Non trouvé : CursorTrailEffect.tsx
)

if exist components\SimpleLuxuryCursor.tsx (
    del /f components\SimpleLuxuryCursor.tsx
    echo ✅ Supprimé : SimpleLuxuryCursor.tsx
) else (
    echo ⚠️  Non trouvé : SimpleLuxuryCursor.tsx
)

if exist components\EnhancedLuxuryCursor.tsx (
    del /f components\EnhancedLuxuryCursor.tsx
    echo ✅ Supprimé : EnhancedLuxuryCursor.tsx
) else (
    echo ⚠️  Non trouvé : EnhancedLuxuryCursor.tsx
)

echo.
echo ════════════════════════════════════════════════════════════
echo ✅ NETTOYAGE TERMINÉ !
echo ════════════════════════════════════════════════════════════
echo.
echo 📊 Gain estimé :
echo    - Espace disque : ~50-100 KB
echo    - Bundle size   : ~200 KB (après build)
echo.
echo 🚀 Prochaines étapes :
echo    1. npm run build   - Rebuild sans les curseurs
echo    2. npm run preview - Tester
echo    3. vercel --prod   - Déployer
echo.

pause
