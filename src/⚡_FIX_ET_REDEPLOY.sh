#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║              ⚡ FIX ET REDÉPLOIEMENT VERCEL ⚡                      ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

echo "[1/4] Vérification du fix dans vercel.json..."
echo ""

if grep -q "vite build" vercel.json; then
    echo "✅ vercel.json corrigé !"
else
    echo "❌ vercel.json pas corrigé !"
    echo ""
    echo "Corrigez manuellement buildCommand dans vercel.json :"
    echo '  "buildCommand": "vite build"'
    exit 1
fi

echo ""
echo "[2/4] Commit du fix..."
echo ""

git add vercel.json
git commit -m "🔧 Fix Vercel output directory to dist/"

echo ""
echo "[3/4] Push vers GitHub..."
echo ""

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push réussi !"
    echo ""
    echo "⏳ Vercel va maintenant rebuild automatiquement..."
    echo ""
    echo "Vérifiez le déploiement sur :"
    echo "  https://vercel.com/dashboard"
    echo ""
else
    echo ""
    echo "❌ Erreur lors du push"
    echo ""
    echo "Vérifiez que vous avez configuré Git :"
    echo '  git config user.name "Votre Nom"'
    echo '  git config user.email "votre@email.com"'
    echo "  git remote add origin https://github.com/VOTRE_USERNAME/thesoria.git"
    echo ""
fi

echo ""
echo "[4/4] Options alternatives..."
echo ""
echo "Si le push Git ne fonctionne pas, vous pouvez :"
echo ""
echo "  Option A : Redéployer manuellement sur Vercel"
echo "    1. Aller sur https://vercel.com/dashboard"
echo "    2. Sélectionner votre projet"
echo "    3. Deployments → Redeploy"
echo ""
echo "  Option B : Utiliser Vercel CLI"
echo "    vercel --prod"
echo ""
