#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# THESORIA - Script de Nettoyage Cache
# Résout les problèmes "ReferenceError" et cache Vite
# ═══════════════════════════════════════════════════════════════════════════

echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                          ║"
echo "║  🧹 NETTOYAGE COMPLET CACHE                                             ║"
echo "║                                                                          ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Arrêter processus Node/Vite existants
echo "🛑 Arrêt des processus Vite/Node existants..."
pkill -f "vite" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true
sleep 2

# Supprimer cache Vite
echo "🗑️  Suppression cache Vite..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

# Supprimer cache TypeScript
echo "🗑️  Suppression cache TypeScript..."
rm -rf .tsbuildinfo

# Supprimer cache navigateur (info)
echo ""
echo "✅ Cache serveur nettoyé avec succès !"
echo ""
echo "📋 Prochaines étapes OBLIGATOIRES :"
echo ""
echo "   1. Lancer serveur : npm run dev"
echo "   2. Ouvrir navigateur : http://localhost:3000"
echo "   3. ⚠️  HARD REFRESH : Ctrl + Shift + R (CRUCIAL!)"
echo ""
echo "Si erreur WebSocket persiste :"
echo "   → F12 → Application → Clear storage → Clear all"
echo "   → Puis Ctrl + Shift + R"
echo ""
echo "🔥 L'erreur WebSocket sera supprimée !"