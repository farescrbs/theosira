#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════════╗
# ║                                                                               ║
# ║  THESORIA - SCRIPT VÉRIFICATION PRÉ-PRODUCTION                               ║
# ║  Vérifie que TOUT est prêt avant le déploiement production                  ║
# ║                                                                               ║
# ╚═══════════════════════════════════════════════════════════════════════════════╝

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🔍 VÉRIFICATION PRÉ-PRODUCTION THESORIA                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1. ENVIRONNEMENT SYSTÈME
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "📦 Vérification Environnement Système..."
echo ""

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installé: $NODE_VERSION"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} Node.js NON installé"
    FAILED=$((FAILED + 1))
fi

# Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Python installé: $PYTHON_VERSION"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} Python NON installé"
    FAILED=$((FAILED + 1))
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm installé: v$NPM_VERSION"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} npm NON installé"
    FAILED=$((FAILED + 1))
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 2. FICHIERS DE CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "📄 Vérification Fichiers de Configuration..."
echo ""

# Frontend .env
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local existe"
    PASSED=$((PASSED + 1))
    
    # Vérifier les variables critiques
    if grep -q "NEXT_PUBLIC_ETH_RPC_URL" .env.local && ! grep -q "YOUR_API_KEY" .env.local; then
        echo -e "${GREEN}  → RPC URL configuré${NC}"
    else
        echo -e "${YELLOW}  ⚠ RPC URL pas configuré ou utilise placeholder${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} .env.local MANQUANT (copier .env.example)"
    FAILED=$((FAILED + 1))
fi

# Backend .env
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} backend/.env existe"
    PASSED=$((PASSED + 1))
    
    # Vérifier PRIVATE_KEY (sans afficher la valeur)
    if grep -q "WALLET_PRIVATE_KEY=0x" backend/.env && ! grep -q "YOUR_PRIVATE_KEY" backend/.env; then
        echo -e "${GREEN}  → Wallet private key configuré${NC}"
    else
        echo -e "${RED}  ✗ WALLET_PRIVATE_KEY manquant ou placeholder${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${RED}✗${NC} backend/.env MANQUANT (copier backend.env.example)"
    FAILED=$((FAILED + 1))
fi

# package.json
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json existe"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} package.json MANQUANT"
    FAILED=$((FAILED + 1))
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3. DÉPENDANCES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "📚 Vérification Dépendances..."
echo ""

# node_modules
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules installés"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠${NC} node_modules manquants (exécuter: npm install)"
    WARNINGS=$((WARNINGS + 1))
fi

# Backend requirements
if [ -f "backend/requirements.txt" ]; then
    echo -e "${GREEN}✓${NC} backend/requirements.txt existe"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} backend/requirements.txt MANQUANT"
    FAILED=$((FAILED + 1))
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 4. BUILD FRONTEND
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "🏗️  Test Build Production..."
echo ""

if npm run build &> /tmp/build.log; then
    echo -e "${GREEN}✓${NC} Build production réussi"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} Build production ÉCHOUÉ"
    echo ""
    echo "Erreurs:"
    cat /tmp/build.log | tail -20
    FAILED=$((FAILED + 1))
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 5. SÉCURITÉ
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "🔐 Vérification Sécurité..."
echo ""

# .gitignore
if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore && grep -q "*.key" .gitignore; then
        echo -e "${GREEN}✓${NC} .gitignore protège les secrets"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}⚠${NC} .gitignore incomplet (ajouter .env et *.key)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} .gitignore MANQUANT"
    FAILED=$((FAILED + 1))
fi

# Vérifier qu'aucun secret n'est committé
if git ls-files | grep -q "\.env$\|\.key$"; then
    echo -e "${RED}✗${NC} SECRETS DANS GIT! Retirer immédiatement"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓${NC} Aucun secret dans git"
    PASSED=$((PASSED + 1))
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 6. STRUCTURE PROJET
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "📁 Vérification Structure Projet..."
echo ""

REQUIRED_FILES=(
    "app/page.tsx"
    "components/FlashLoanGodMode.tsx"
    "components/ui/button.tsx"
    "components/ui/badge.tsx"
    "tailwind.config.ts"
    "tsconfig.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $file MANQUANT"
        FAILED=$((FAILED + 1))
    fi
done

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 7. COMPOSANTS IA
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "🤖 Vérification Composants IA..."
echo ""

AI_COMPONENTS=(
    "components/AISupremeMaster.tsx"
    "components/AutonomousProfitEngine.tsx"
    "components/DeepLearningOracle.tsx"
    "components/MultiAgentSwarm.tsx"
    "components/QuantumStrategyOptimizer.tsx"
    "components/WhaleMovementTracker.tsx"
    "components/GasOptimizationEngine.tsx"
    "components/SentimentAnalysisEngine.tsx"
    "components/RiskHedgingAutomaton.tsx"
    "components/CosmicMasterOrchestrator.tsx"
)

AI_FOUND=0
for component in "${AI_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        AI_FOUND=$((AI_FOUND + 1))
    fi
done

echo -e "${GREEN}✓${NC} $AI_FOUND/18 composants IA trouvés"
if [ $AI_FOUND -eq 18 ]; then
    PASSED=$((PASSED + 1))
else
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 8. DOCUMENTATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "📖 Vérification Documentation..."
echo ""

DOCS=(
    "PRODUCTION_DEPLOYMENT_GUIDE.md"
    "README.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}⚠${NC} $doc manquant"
        WARNINGS=$((WARNINGS + 1))
    fi
done

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RÉSULTATS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  📊 RÉSULTATS                                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ Réussis:${NC}       $PASSED"
echo -e "${YELLOW}⚠ Avertissements:${NC} $WARNINGS"
echo -e "${RED}✗ Échecs:${NC}        $FAILED"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RECOMMANDATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║  🎉 SYSTÈME PRÊT POUR PRODUCTION!                        ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ Tous les tests passés!"
    echo ""
    echo "PROCHAINES ÉTAPES:"
    echo "1. Tester sur TESTNET d'abord (1-2 semaines)"
    echo "2. Déployer avec PETITS montants (0.1 ETH)"
    echo "3. Monitoring 24/7"
    echo "4. Scaling progressif"
    echo ""
    exit 0
elif [ $FAILED -eq 0 ]; then
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║  ⚠️  SYSTÈME PRESQUE PRÊT (Avertissements)               ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "Corrigez les avertissements avant production"
    echo ""
    exit 1
else
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║  ❌ SYSTÈME NON PRÊT                                      ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "Corrigez les erreurs ci-dessus avant de continuer"
    echo ""
    echo "AIDE:"
    echo "• Installer dépendances: npm install"
    echo "• Copier configs: cp .env.example .env.local"
    echo "• Lire guide: cat PRODUCTION_DEPLOYMENT_GUIDE.md"
    echo ""
    exit 2
fi
