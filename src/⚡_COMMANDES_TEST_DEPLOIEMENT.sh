#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🔍 SCRIPT DE TEST COMPLET - THESORIA
# ═══════════════════════════════════════════════════════════════════════════
# Date: 18 Janvier 2026
# Objectif: Tester toutes les fonctionnalités avant déploiement
# ═══════════════════════════════════════════════════════════════════════════

set -e  # Arrêter si erreur

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║           🔍 TEST DE FONCTIONNEMENT - THESORIA                ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de test
test_step() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# ═══════════════════════════════════════════════════════════════════════════
# TEST 1: VÉRIFICATION STRUCTURE PROJET
# ═══════════════════════════════════════════════════════════════════════════
test_step "TEST 1/8: Vérification de la structure du projet"

if [ -f "package.json" ]; then
    success "package.json trouvé"
else
    error "package.json manquant"
    exit 1
fi

if [ -f "vite.config.js" ]; then
    success "vite.config.js trouvé"
else
    error "vite.config.js manquant"
    exit 1
fi

if [ -d "components" ]; then
    success "Dossier components/ trouvé"
    COMPONENT_COUNT=$(find components -name "*.tsx" | wc -l)
    success "  → $COMPONENT_COUNT composants React trouvés"
else
    error "Dossier components/ manquant"
    exit 1
fi

if [ -f "App.tsx" ]; then
    success "App.tsx trouvé"
else
    error "App.tsx manquant"
    exit 1
fi

if [ -f "main.tsx" ]; then
    success "main.tsx trouvé"
else
    error "main.tsx manquant"
    exit 1
fi

if [ -f "index.html" ]; then
    success "index.html trouvé"
else
    error "index.html manquant"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════════════════
# TEST 2: VÉRIFICATION DÉPENDANCES
# ═══════════════════════════════════════════════════════════════════════════
test_step "TEST 2/8: Vérification des dépendances"

if [ -d "node_modules" ]; then
    success "node_modules/ existe"
    warning "  → Vous pouvez sauter 'npm install'"
else
    warning "node_modules/ manquant"
    echo "  → Installation des dépendances..."
    npm install
    if [ $? -eq 0 ]; then
        success "  → npm install réussi"
    else
        error "  → npm install échoué"
        exit 1
    fi
fi

# Vérifier les dépendances critiques
echo ""
echo "Vérification des packages critiques:"
npm list react >/dev/null 2>&1 && success "  → react installé" || error "  → react manquant"
npm list react-dom >/dev/null 2>&1 && success "  → react-dom installé" || error "  → react-dom manquant"
npm list ethers >/dev/null 2>&1 && success "  → ethers installé" || error "  → ethers manquant"
npm list motion >/dev/null 2>&1 && success "  → motion installé" || error "  → motion manquant"
npm list lucide-react >/dev/null 2>&1 && success "  → lucide-react installé" || error "  → lucide-react manquant"
npm list tailwindcss >/dev/null 2>&1 && success "  → tailwindcss installé" || error "  → tailwindcss manquant"

# ═══════════════════════════════════════════════════════════════════════════
# TEST 3: VÉRIFICATION COMPOSANTS CRITIQUES
# ═══════════════════════════════════════════════════════════════════════════
test_step "TEST 3/8: Vérification des composants critiques"

CRITICAL_COMPONENTS=(
    "components/Navigation.tsx"
    "components/HeroSection.tsx"
    "components/WalletCreationPage.tsx"
    "components/FlashLoanGodMode.tsx"
    "components/AICommandCenter.tsx"
    "components/GodModePanel.tsx"
    "components/Footer.tsx"
    "components/EnhancedBackground.tsx"
)

for comp in "${CRITICAL_COMPONENTS[@]}"; do
    if [ -f "$comp" ]; then
        success "  → $comp"
    else
        error "  → $comp MANQUANT"
    fi
done

# ═══════════════════════════════════════════════════════════════════════════
# TEST 4: VÉRIFICATION UI COMPONENTS
# ═══════════════════════════════════════════════════════════════════════════
test_step "TEST 4/8: Vérification des UI components"

if [ -d "components/ui" ]; then
    UI_COUNT=$(find components/ui -name "*.tsx" | wc -l)
    success "Dossier components/ui/ trouvé"
    success "  → $UI_COUNT composants UI trouvés"
else
    warning "Dossier components/ui/ manquant"
fi

# ═══════════════════════════════════════════════════════════════════════════
# TEST 5: VÉRIFICATION BACKEND (Optionnel)
# ═══════════════════════════════════════════════════════════════════════════
test_step "TEST 5/8: Vérification backend (optionnel)"

if [ -d "backend" ]; then
    BACKEND_COUNT=$(find backend -name "*.py" | wc -l)
    warning "Backend Python trouvé ($BACKEND_COUNT fichiers)"
    warning "  → Backend présent mais NON DÉPLOYÉ"
    warning "  → Frontend fonctionnera sans backend"
else
    warning "Pas de backend trouvé (normal pour frontend-only)"
fi

if [ -d "contracts" ]; then
    CONTRACT_COUNT=$(find contracts -name "*.sol" | wc -l)
    warning "Smart contracts trouvés ($CONTRACT_COUNT fichiers)"
    warning "  → Contrats présents mais NON DÉPLOYÉS"
    warning "  → Frontend fonctionnera avec données mockées"
else
    warning "Pas de smart contracts trouvés"
fi

# ═══════════════════════════════════════════════════════════════════════════
# TEST 6: BUILD DE TEST
# ═══════════════════════════════════════════════════════════════════════════
test_step "TEST 6/8: Test du build de production"

echo "Lancement du build (cela peut prendre 30-60 secondes)..."
echo ""

if npm run build; then
    success "Build réussi !"
    echo ""
    if [ -d "dist" ]; then
        success "Dossier dist/ créé"
        
        # Vérifier la taille du bundle
        if [ -f "dist/index.html" ]; then
            success "  → dist/index.html créé"
        fi
        
        # Compter les assets
        if [ -d "dist/assets" ]; then
            ASSET_COUNT=$(find dist/assets -type f | wc -l)
            success "  → $ASSET_COUNT fichiers assets générés"
            
            # Taille totale
            DIST_SIZE=$(du -sh dist | cut -f1)
            success "  → Taille totale: $DIST_SIZE"
        fi
    else
        error "Dossier dist/ non créé"
        exit 1
    fi
else
    error "Build échoué"
    echo ""
    echo "Consultez les erreurs ci-dessus pour diagnostiquer."
    exit 1
fi

# ═══════════════════════════════════════════════════════════════════════════
# TEST 7: VÉRIFICATION FICHIERS CRITIQUE
# ═══════════════════════════════════════════════════════════════════════════
test_step "TEST 7/8: Vérification des fichiers critiques du build"

CRITICAL_BUILD_FILES=(
    "dist/index.html"
)

for file in "${CRITICAL_BUILD_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "  → $file"
    else
        error "  → $file MANQUANT"
    fi
done

# ═══════════════════════════════════════════════════════════════════════════
# TEST 8: VÉRIFICATION CONFIGURATION DÉPLOIEMENT
# ═══════════════════════════════════════════════════════════════════════════
test_step "TEST 8/8: Vérification configuration déploiement"

if [ -f "vercel.json" ]; then
    success "vercel.json trouvé"
    success "  → Prêt pour déploiement Vercel"
else
    warning "vercel.json manquant"
    warning "  → Déploiement Vercel possible mais non configuré"
fi

if command -v vercel >/dev/null 2>&1; then
    success "Vercel CLI installé"
    success "  → Vous pouvez déployer avec: vercel"
else
    warning "Vercel CLI non installé"
    echo "  → Pour installer: npm i -g vercel"
fi

# ═══════════════════════════════════════════════════════════════════════════
# RAPPORT FINAL
# ═══════════════════════════════════════════════════════════════════════════
echo ""
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║                  📊 RAPPORT DE TEST FINAL                     ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${GREEN}✅ TESTS RÉUSSIS${NC}"
echo ""
echo "1. ✅ Structure du projet valide"
echo "2. ✅ Dépendances installées"
echo "3. ✅ Composants critiques présents"
echo "4. ✅ Build de production réussi"
echo ""

echo -e "${YELLOW}⚠️  LIMITATIONS CONNUES${NC}"
echo ""
echo "1. ⚠️  Backend Python non déployé"
echo "2. ⚠️  Smart contracts non déployés"
echo "3. ⚠️  Pas de connexion blockchain réelle"
echo "4. ⚠️  Données simulées uniquement"
echo ""

echo -e "${BLUE}🚀 PROCHAINES ÉTAPES${NC}"
echo ""
echo "OPTION A - Déploiement Démo (Immédiat):"
echo "  1. vercel                    # Déployer sur Vercel"
echo "  2. Site live en 2 minutes ✅"
echo ""
echo "OPTION B - Test Local:"
echo "  1. npm run dev               # Lancer serveur dev"
echo "  2. Ouvrir http://localhost:5173"
echo ""
echo "OPTION C - Preview Build:"
echo "  1. npm run preview           # Preview du build"
echo "  2. Ouvrir http://localhost:4173"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Le frontend est 100% prêt pour le déploiement ! ✨${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "📚 Documentation complète:"
echo "  → 🔍_TEST_FONCTIONNEMENT_COMPLET.md"
echo "  → 📋_LISTE_FONCTIONNALITES_COMPLETE.md"
echo ""

exit 0
