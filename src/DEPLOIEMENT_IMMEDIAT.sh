#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 🚀 DÉPLOIEMENT AUTOMATIQUE THESORIA - PRODUCTION
# ═══════════════════════════════════════════════════════════════

clear

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "           ⚡ THESORIA - DÉPLOIEMENT PRODUCTION ⚡"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════════
# ÉTAPE 1 : NETTOYAGE
# ═══════════════════════════════════════════════════════════════

echo "[ÉTAPE 1/5] 🧹 Nettoyage des anciens builds..."
echo ""

if [ -d "dist" ]; then
    rm -rf dist
    echo "✅ Dossier dist supprimé"
else
    echo "⚠️  Pas de dossier dist à supprimer"
fi

if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo "✅ Cache Vite nettoyé"
else
    echo "⚠️  Pas de cache Vite"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"

# ═══════════════════════════════════════════════════════════════
# ÉTAPE 2 : VÉRIFICATION DES DÉPENDANCES
# ═══════════════════════════════════════════════════════════════

echo "[ÉTAPE 2/5] 📦 Vérification des dépendances..."
echo ""

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules manquant, installation en cours..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ ERREUR : Installation des dépendances échouée"
        echo ""
        exit 1
    fi
    echo "✅ Dépendances installées"
else
    echo "✅ node_modules présent"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"

# ═══════════════════════════════════════════════════════════════
# ÉTAPE 3 : BUILD PRODUCTION
# ═══════════════════════════════════════════════════════════════

echo "[ÉTAPE 3/5] 🔨 Compilation du build production..."
echo ""
echo "⚙️  Configuration :"
echo "   - Framework   : Vite + React"
echo "   - Output      : dist/"
echo "   - Minify      : Terser (Optimisation maximale)"
echo "   - Sourcemaps  : Désactivés"
echo ""
echo "🕐 Temps estimé : 15-30 secondes"
echo ""

npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "❌ ERREUR : Le build a échoué"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "💡 Solutions :"
    echo "   1. Vérifier les erreurs ci-dessus"
    echo "   2. Nettoyer : rm -rf node_modules && npm install"
    echo "   3. Vérifier la mémoire : NODE_OPTIONS=--max-old-space-size=4096 npm run build"
    echo ""
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"

# ═══════════════════════════════════════════════════════════════
# ÉTAPE 4 : VÉRIFICATION DU BUILD
# ═══════════════════════════════════════════════════════════════

echo "[ÉTAPE 4/5] ✅ Vérification du build..."
echo ""

if [ ! -d "dist" ]; then
    echo "❌ ERREUR : Le dossier dist n'a pas été créé"
    echo ""
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ ERREUR : index.html manquant dans dist"
    echo ""
    exit 1
fi

echo "✅ Structure du build :"
echo ""
[ -f "dist/index.html" ] && echo "   ✅ dist/index.html"
[ -d "dist/assets" ] && echo "   ✅ dist/assets/"
ls dist/assets/*.js >/dev/null 2>&1 && echo "   ✅ dist/assets/*.js"
ls dist/assets/*.css >/dev/null 2>&1 && echo "   ✅ dist/assets/*.css"

echo ""
echo "📊 Taille du build :"
SIZE=$(du -sh dist | awk '{print $1}')
echo "   📦 $SIZE"
echo ""

echo "════════════════════════════════════════════════════════════════"

# ═══════════════════════════════════════════════════════════════
# ÉTAPE 5 : CHOIX DU DÉPLOIEMENT
# ═══════════════════════════════════════════════════════════════

echo "[ÉTAPE 5/5] 🚀 Déploiement..."
echo ""
echo "Choisissez votre méthode de déploiement :"
echo ""
echo "  [1] Déployer sur Vercel (via CLI) - Recommandé"
echo "  [2] Tester en local (Preview)"
echo "  [3] Instructions GitHub + Vercel"
echo "  [4] Quitter"
echo ""

read -p "Votre choix (1-4) : " choice

case $choice in
    1)
        # ═══════════════════════════════════════════════════════════════
        # OPTION 1 : DÉPLOIEMENT VERCEL CLI
        # ═══════════════════════════════════════════════════════════════
        
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "🚀 DÉPLOIEMENT SUR VERCEL"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        
        # Vérifier si Vercel CLI est installé
        if ! command -v vercel &> /dev/null; then
            echo "⚠️  Vercel CLI non trouvé. Installation..."
            echo ""
            npm install -g vercel
            if [ $? -ne 0 ]; then
                echo ""
                echo "❌ Impossible d'installer Vercel CLI"
                echo ""
                echo "💡 Solution alternative :"
                echo "   npm install vercel --save-dev"
                echo "   npx vercel --prod"
                echo ""
                exit 1
            fi
        fi
        
        echo "✅ Vercel CLI installé"
        echo ""
        echo "📝 Vous allez être redirigé vers la connexion Vercel..."
        echo ""
        
        # Déployer en production
        vercel --prod
        
        if [ $? -ne 0 ]; then
            echo ""
            echo "❌ Le déploiement a échoué"
            echo ""
            echo "💡 Solutions :"
            echo "   1. Se connecter : vercel login"
            echo "   2. Vérifier le compte Vercel"
            echo "   3. Essayer : npx vercel --prod"
            echo ""
            exit 1
        fi
        
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "✅ DÉPLOIEMENT RÉUSSI !"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "🎉 Votre application THESORIA est maintenant en ligne !"
        echo ""
        echo "📊 Prochaines étapes :"
        echo "   1. Ouvrir l'URL fournie ci-dessus"
        echo "   2. Tester la connexion MetaMask"
        echo "   3. Vérifier les fonctionnalités DeFi"
        echo "   4. Configurer le smart contract FlashBot"
        echo ""
        ;;
        
    2)
        # ═══════════════════════════════════════════════════════════════
        # OPTION 2 : PREVIEW LOCAL
        # ═══════════════════════════════════════════════════════════════
        
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "🔍 TEST LOCAL DU BUILD"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "Lancement du serveur de preview..."
        echo ""
        echo "📍 URL : http://localhost:4173"
        echo ""
        echo "⚠️  Appuyez sur CTRL+C pour arrêter le serveur"
        echo ""
        
        npm run preview
        ;;
        
    3)
        # ═══════════════════════════════════════════════════════════════
        # OPTION 3 : INSTRUCTIONS GITHUB
        # ═══════════════════════════════════════════════════════════════
        
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo "📚 DÉPLOIEMENT VIA GITHUB + VERCEL"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "ÉTAPE 1 : Initialiser Git (si pas déjà fait)"
        echo "──────────────────────────────────────────────────────────────"
        echo ""
        echo "  git init"
        echo "  git add ."
        echo "  git commit -m \"🚀 THESORIA Production Ready\""
        echo ""
        echo "ÉTAPE 2 : Créer un repo sur GitHub"
        echo "──────────────────────────────────────────────────────────────"
        echo ""
        echo "  1. Aller sur https://github.com/new"
        echo "  2. Nom du repo : thesoria-web3-platform"
        echo "  3. Visibilité : Public ou Private"
        echo "  4. Créer le repo"
        echo ""
        echo "ÉTAPE 3 : Push vers GitHub"
        echo "──────────────────────────────────────────────────────────────"
        echo ""
        echo "  git remote add origin https://github.com/VOTRE_USERNAME/thesoria-web3-platform.git"
        echo "  git branch -M main"
        echo "  git push -u origin main"
        echo ""
        echo "ÉTAPE 4 : Connecter à Vercel"
        echo "──────────────────────────────────────────────────────────────"
        echo ""
        echo "  1. Aller sur https://vercel.com"
        echo "  2. Cliquer \"New Project\""
        echo "  3. Importer votre repo GitHub"
        echo "  4. Configuration détectée automatiquement ✅"
        echo "  5. Cliquer \"Deploy\""
        echo ""
        echo "ÉTAPE 5 : Variables d'environnement (Optionnel)"
        echo "──────────────────────────────────────────────────────────────"
        echo ""
        echo "  Dans Vercel Dashboard > Settings > Environment Variables :"
        echo ""
        echo "  VITE_APP_NAME=THESORIA"
        echo "  VITE_APP_VERSION=3.0.0"
        echo "  VITE_ALCHEMY_API_KEY=XUbdW3HgRyDHALSbpyjPr"
        echo "  VITE_ETHERSCAN_API_KEY=F9F4JPNB5UC6E5M79IY6DIBP58J4I7BRQ3"
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        ;;
        
    4)
        echo ""
        echo "👋 Au revoir !"
        echo ""
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ Choix invalide. Veuillez relancer le script."
        echo ""
        exit 1
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "  ✨ MERCI D'AVOIR UTILISÉ LE SCRIPT DE DÉPLOIEMENT THESORIA ✨"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
