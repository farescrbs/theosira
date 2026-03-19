#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🚀 DÉPLOIEMENT DÉMO IMMÉDIAT - THESORIA
# ═══════════════════════════════════════════════════════════════════════════
# Ce script déploie le frontend comme démo sur Vercel
# Durée: ~2 minutes
# Coût: Gratuit
# ═══════════════════════════════════════════════════════════════════════════

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║        🚀 DÉPLOIEMENT DÉMO THESORIA - MODE RAPIDE             ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Ce script va:${NC}"
echo "  1. Installer les dépendances (si nécessaire)"
echo "  2. Construire le projet"
echo "  3. Déployer sur Vercel"
echo ""
echo -e "${YELLOW}⏱️  Temps estimé: 2-5 minutes${NC}"
echo -e "${GREEN}💰 Coût: GRATUIT${NC}"
echo ""

read -p "Continuer? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Annulé."
    exit 0
fi

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 1: INSTALLATION DÉPENDANCES
# ═══════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${BLUE}━━━ ÉTAPE 1/4: Vérification des dépendances ━━━${NC}"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
    echo -e "${GREEN}✅ Dépendances installées${NC}"
else
    echo -e "${GREEN}✅ Dépendances déjà installées${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 2: BUILD
# ═══════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${BLUE}━━━ ÉTAPE 2/4: Build de production ━━━${NC}"
echo ""

echo "Construction du projet..."
npm run build

if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    echo -e "${GREEN}✅ Build réussi (taille: $DIST_SIZE)${NC}"
else
    echo -e "${RED}❌ Build échoué${NC}"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 3: VÉRIFICATION VERCEL CLI
# ═══════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${BLUE}━━━ ÉTAPE 3/4: Vérification Vercel CLI ━━━${NC}"
echo ""

if ! command -v vercel >/dev/null 2>&1; then
    echo "Vercel CLI non installé. Installation..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installé${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI déjà installé${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 4: DÉPLOIEMENT
# ═══════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${BLUE}━━━ ÉTAPE 4/4: Déploiement sur Vercel ━━━${NC}"
echo ""

echo "Lancement du déploiement..."
echo ""
echo -e "${YELLOW}⚠️  Si c'est votre première fois:${NC}"
echo "  - Vous serez invité à vous connecter à Vercel"
echo "  - Suivez les instructions à l'écran"
echo ""

vercel --prod

echo ""
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║                    🎉 DÉPLOIEMENT RÉUSSI !                    ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${GREEN}✅ Votre site THESORIA est maintenant LIVE !${NC}"
echo ""
echo -e "${BLUE}📊 Ce qui fonctionne:${NC}"
echo "  ✅ Interface ultra-premium complète"
echo "  ✅ Toutes les sections et animations"
echo "  ✅ Wallet Creation (génération réelle)"
echo "  ✅ Design responsive mobile/desktop"
echo ""
echo -e "${YELLOW}⚠️  Limitations (démo):${NC}"
echo "  ⚠️  Pas de transactions blockchain"
echo "  ⚠️  Données simulées"
echo "  ⚠️  Backend non connecté"
echo ""
echo -e "${BLUE}🎯 Utilisation recommandée:${NC}"
echo "  → Présentation aux investisseurs"
echo "  → Démo du design et UX"
echo "  → Portfolio professionnel"
echo "  → Prototype haute-fidélité"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Partagez votre lien Vercel avec le monde ! ✨${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exit 0
