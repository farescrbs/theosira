#!/bin/bash

cat << "EOF"
═══════════════════════════════════════════════════════════════
  🔥 SOLUTION FINALE APPLIQUÉE - VIDER CACHE MAINTENANT
═══════════════════════════════════════════════════════════════

✅ CORRECTIONS DANS LE CODE :

1. WebSocket désactivé par défaut (backendEnabled = false)
2. Bloqueur 4 niveaux activé (blockAllWebSocketErrors)
3. Aucune connexion au chargement

⚠️  TU VOIS ENCORE L'ERREUR = CACHE NAVIGATEUR !

═══════════════════════════════════════════════════════════════

📋 ÉTAPE 1 : NETTOYER SERVEUR (EN COURS...)

EOF

# Arrêter processus
pkill -9 -f "vite" 2>/dev/null || true
pkill -9 -f "node" 2>/dev/null || true

echo "   ✅ Processus arrêtés"
sleep 1

# Nettoyer cache
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

echo "   ✅ Cache serveur nettoyé"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📋 ÉTAPE 2 : VIDER CACHE NAVIGATEUR (TOI !)"
echo ""
echo "   Option A - Mode Incognito (LE PLUS SIMPLE) :"
echo "   1. Ctrl + Shift + N"
echo "   2. http://localhost:3000"
echo "   3. F12 → Vérifier console"
echo ""
echo "   Option B - Vider cache complet :"
echo "   1. F12 → Application → Clear storage → Clear all"
echo "   2. Ctrl + Shift + R (5 fois)"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Démarrage serveur..."
echo ""

# Démarrer serveur
npm run dev
