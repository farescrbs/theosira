#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 🚀 SCRIPT DE BUILD THESORIA POUR VERCEL (Linux/Mac)
# ═══════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🏗️  BUILD THESORIA POUR PRODUCTION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Étape 1 : Nettoyer l'ancien build
echo "🧹 Étape 1/4 : Nettoyage..."
rm -rf dist
rm -rf node_modules/.vite

# Étape 2 : Vérifier les dépendances
echo ""
echo "📦 Étape 2/4 : Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules manquant, installation..."
    npm install
fi

# Étape 3 : Build
echo ""
echo "🔨 Étape 3/4 : Compilation..."
npm run build

# Étape 4 : Vérifier le résultat
echo ""
echo "✅ Étape 4/4 : Vérification..."
if [ -d "dist" ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "✅ BUILD RÉUSSI !"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "📂 Dossier de sortie : dist/"
    echo ""
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html : Trouvé"
    else
        echo "⚠️  Avertissement : index.html non trouvé"
    fi
    echo ""
    echo "🚀 Prêt pour déploiement Vercel !"
    echo ""
    echo "Pour déployer :"
    echo "  1. Installer Vercel CLI : npm install -g vercel"
    echo "  2. Se connecter        : vercel login"
    echo "  3. Déployer            : vercel --prod"
    echo ""
    echo "Ou via Git :"
    echo "  1. Push vers GitHub    : git push"
    echo "  2. Vercel auto-deploy"
    echo ""
else
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "❌ ERREUR : Le dossier dist n'a pas été créé"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "💡 Solutions :"
    echo "  1. Vérifier les erreurs ci-dessus"
    echo "  2. Relancer : npm run build"
    echo "  3. Vérifier vite.config.js"
    echo ""
fi

echo ""
