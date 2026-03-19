#!/bin/bash

# 🚀 THESORIA v3.0.0 - Quick Deploy Script
# Déploie la plateforme en production en une seule commande

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║              🚀 THESORIA PRODUCTION DEPLOY 🚀                    ║"
echo "║                                                                  ║"
echo "║                    Version 3.0.0                                 ║"
echo "║          The Ultimate Blockchain Luxury Platform                 ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
GOLD='\033[38;5;220m'

# Fonction pour afficher les messages
print_step() {
    echo -e "${GOLD}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Vérifier si Node.js est installé
print_step "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi
print_success "Node.js $(node -v) détecté"

# Vérifier si npm est installé
print_step "Vérification de npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé."
    exit 1
fi
print_success "npm $(npm -v) détecté"

# Vérifier si Vercel CLI est installé
print_step "Vérification de Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI n'est pas installé. Installation en cours..."
    npm install -g vercel
    if [ $? -eq 0 ]; then
        print_success "Vercel CLI installé avec succès"
    else
        print_error "Échec de l'installation de Vercel CLI"
        exit 1
    fi
else
    print_success "Vercel CLI détecté"
fi

# Installation des dépendances
print_step "Installation des dépendances..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dépendances installées"
else
    print_error "Échec de l'installation des dépendances"
    exit 1
fi

# Build local pour vérification
print_step "Build de vérification en local..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build réussi"
else
    print_error "Échec du build"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Demander confirmation
echo -e "${GOLD}🚀 Prêt à déployer THESORIA en PRODUCTION ?${NC}"
echo ""
echo "  Cela va :"
echo "  • Déployer sur Vercel"
echo "  • Rendre l'application accessible mondialement"
echo "  • Activer le monitoring en temps réel"
echo "  • Mettre en ligne tous les systèmes"
echo ""
read -p "Continuer ? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Déploiement annulé"
    exit 0
fi

# Déploiement Vercel
echo ""
print_step "Déploiement en production sur Vercel..."
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    print_success "DÉPLOIEMENT RÉUSSI !"
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                  ║"
    echo "║              🎉 THESORIA EST EN PRODUCTION ! 🎉                 ║"
    echo "║                                                                  ║"
    echo "║  Votre plateforme est maintenant accessible mondialement         ║"
    echo "║                                                                  ║"
    echo "║  Prochaines étapes :                                             ║"
    echo "║  1. ✅ Vérifier l'URL de production                             ║"
    echo "║  2. ✅ Tester le System Health Dashboard                        ║"
    echo "║  3. ✅ Configurer le monitoring                                 ║"
    echo "║  4. ✅ Lancer la campagne marketing                             ║"
    echo "║                                                                  ║"
    echo "║  🏆 GRAAL ABSOLU EN PRODUCTION 🏆                                ║"
    echo "║                                                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📊 Monitoring Dashboard : https://vercel.com/dashboard"
    echo "🏥 System Health        : Bouton 'System Health' (bottom-right)"
    echo "📚 Documentation        : /README_GRAAL_ABSOLU.md"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo ""
    print_error "Échec du déploiement"
    echo ""
    echo "Pour debugger :"
    echo "  vercel --debug"
    echo ""
    echo "Pour les logs :"
    echo "  vercel logs"
    echo ""
    exit 1
fi

# Nettoyage optionnel
echo ""
read -p "Nettoyer les fichiers de build locaux ? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Nettoyage..."
    rm -rf dist
    print_success "Nettoyage terminé"
fi

echo ""
print_success "Script terminé avec succès !"
echo ""
