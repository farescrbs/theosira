#!/bin/bash

# 🔍 Script de Vérification Pré-Déploiement
# THESORIA v3.0.0

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║         🔍 VÉRIFICATION PRÉ-DÉPLOIEMENT THESORIA 🔍            ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Vérification 1: vite.config.ts existe
echo -n "✓ Vérification vite.config.ts... "
if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}OK ✅${NC}"
else
    echo -e "${RED}MANQUANT ❌${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Vérification 2: vercel.json existe et contient "dist"
echo -n "✓ Vérification vercel.json... "
if [ -f "vercel.json" ]; then
    if grep -q '"outputDirectory": "dist"' vercel.json; then
        echo -e "${GREEN}OK (outputDirectory: dist) ✅${NC}"
    else
        echo -e "${RED}ERREUR (outputDirectory n'est pas 'dist') ❌${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}MANQUANT ❌${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Vérification 3: .npmrc existe
echo -n "✓ Vérification .npmrc... "
if [ -f ".npmrc" ]; then
    echo -e "${GREEN}OK ✅${NC}"
else
    echo -e "${YELLOW}MANQUANT (optionnel) ⚠️${NC}"
fi

# Vérification 4: package.json existe
echo -n "✓ Vérification package.json... "
if [ -f "package.json" ]; then
    echo -e "${GREEN}OK ✅${NC}"
else
    echo -e "${RED}MANQUANT ❌${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Vérification 5: Node modules
echo -n "✓ Vérification node_modules... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}OK ✅${NC}"
else
    echo -e "${YELLOW}MANQUANT (exécutez 'npm install') ⚠️${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test du build local
echo "🔨 TEST DU BUILD LOCAL..."
echo ""

if npm run build; then
    echo ""
    echo -e "${GREEN}✅ BUILD RÉUSSI !${NC}"
    echo ""
    
    # Vérifier que dist/ existe
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ Dossier dist/ créé correctement !${NC}"
        echo ""
        echo "Contenu de dist/ :"
        ls -lh dist/ | head -10
    else
        echo -e "${RED}❌ ERREUR: Le dossier dist/ n'a pas été créé !${NC}"
        echo -e "${RED}   Vérifiez vite.config.ts${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo ""
    echo -e "${RED}❌ BUILD ÉCHOUÉ !${NC}"
    echo -e "${RED}   Corrigez les erreurs ci-dessus avant de déployer.${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Résultat final
if [ $ERRORS -eq 0 ]; then
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                  ║"
    echo "║         ✅ TOUTES LES VÉRIFICATIONS SONT OK ! ✅               ║"
    echo "║                                                                  ║"
    echo "║  Vous pouvez déployer en toute confiance :                       ║"
    echo "║                                                                  ║"
    echo "║  $ git add .                                                     ║"
    echo "║  $ git commit -m \"🚀 Ready for production\"                     ║"
    echo "║  $ git push origin main                                          ║"
    echo "║                                                                  ║"
    echo "║  Ou :                                                            ║"
    echo "║                                                                  ║"
    echo "║  $ vercel --prod                                                 ║"
    echo "║                                                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    exit 0
else
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                  ║"
    echo "║         ❌ ERREURS DÉTECTÉES ! ❌                               ║"
    echo "║                                                                  ║"
    echo "║  Nombre d'erreurs : $ERRORS                                          ║"
    echo "║                                                                  ║"
    echo "║  Corrigez les erreurs ci-dessus avant de déployer.               ║"
    echo "║                                                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    exit 1
fi
