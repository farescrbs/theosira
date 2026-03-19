#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# THESORIA - Nettoyage FORCÉ et Redémarrage Automatique
# ═══════════════════════════════════════════════════════════════════════════

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║  🔥 NETTOYAGE FORCÉ + REDÉMARRAGE AUTO                        ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 1. Tuer TOUS les processus Node/Vite
echo "🛑 Arrêt FORCÉ de tous les processus Node/Vite..."
pkill -9 -f "vite" 2>/dev/null || true
pkill -9 -f "node" 2>/dev/null || true
sleep 2

# 2. Supprimer TOUS les caches
echo "🗑️  Suppression COMPLÈTE des caches..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist
rm -rf .tsbuildinfo
rm -rf .turbo
rm -rf node_modules/.cache

# 3. Vider cache navigateur (instructions)
echo ""
echo "✅ Cache serveur nettoyé !"
echo ""
echo "📋 ÉTAPE SUIVANTE (OBLIGATOIRE) :"
echo ""
echo "   Vider cache navigateur :"
echo "   1. Ouvrir http://localhost:3000"
echo "   2. F12 (DevTools)"
echo "   3. Clic droit sur le bouton refresh 🔄"
echo "   4. Sélectionner 'Vider le cache et actualiser'"
echo "   5. Ou : Ctrl + Shift + R (plusieurs fois)"
echo ""

# 4. Redémarrer serveur automatiquement
echo "🚀 Redémarrage du serveur dans 3 secondes..."
sleep 3

npm run dev
