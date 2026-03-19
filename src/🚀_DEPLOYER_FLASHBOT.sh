#!/bin/bash

# ============================================
# THESORIA - Lanceur Rapide FlashBot
# ============================================

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}║      ██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗      ║${NC}"
echo -e "${PURPLE}║      ██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝      ║${NC}"
echo -e "${PURPLE}║      ██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝       ║${NC}"
echo -e "${PURPLE}║      ██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝        ║${NC}"
echo -e "${PURPLE}║      ██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║         ║${NC}"
echo -e "${PURPLE}║      ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝         ║${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}║            🚀 THESORIA FLASHBOT DEPLOYMENT 🚀                  ║${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}📋 Ce script va:${NC}"
echo ""
echo -e "${GREEN}   1. Vérifier la configuration${NC}"
echo -e "${GREEN}   2. Compiler les Smart Contracts${NC}"
echo -e "${GREEN}   3. Déployer FlashBot sur le réseau de votre choix${NC}"
echo -e "${GREEN}   4. Mettre à jour automatiquement le frontend${NC}"
echo ""

# Vérifier si on est dans le bon dossier
if [ ! -d "contracts" ]; then
    echo -e "${RED}❌ Erreur: Dossier contracts/ non trouvé${NC}"
    echo -e "${YELLOW}   Exécutez ce script depuis la racine du projet THESORIA${NC}"
    exit 1
fi

echo -e "${YELLOW}📁 Dossier du projet détecté: $(pwd)${NC}"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo -e "${YELLOW}   Installez Node.js depuis: https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js: ${NODE_VERSION}${NC}"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm: v${NPM_VERSION}${NC}"
echo ""

# Demander confirmation
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}⚠️  Assurez-vous d'avoir:${NC}"
echo ""
echo -e "${CYAN}   • Un wallet MetaMask configuré${NC}"
echo -e "${CYAN}   • Votre clé privée exportée${NC}"
echo -e "${CYAN}   • Des tokens pour payer le gas (MATIC/ETH)${NC}"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

read -p "$(echo -e ${YELLOW}Voulez-vous continuer? [O/n]: ${NC})" confirm

if [[ "$confirm" == "n" || "$confirm" == "N" ]]; then
    echo -e "${YELLOW}❌ Déploiement annulé${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}🔧 Lancement du script de déploiement...${NC}"
echo ""

# Aller dans contracts et lancer le script
cd contracts

# Rendre le script exécutable
chmod +x deploy-quick.sh

# Lancer le script
./deploy-quick.sh

# Retour au dossier racine
cd ..

echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}║               ✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS! ✅            ║${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}📋 Prochaines étapes:${NC}"
echo ""
echo -e "${GREEN}1.${NC} Démarrez le serveur frontend:"
echo -e "${CYAN}   npm run dev${NC}"
echo ""
echo -e "${GREEN}2.${NC} Ouvrez votre navigateur:"
echo -e "${CYAN}   http://localhost:3000${NC}"
echo ""
echo -e "${GREEN}3.${NC} Connectez MetaMask et testez un Flash Loan!"
echo ""

echo -e "${YELLOW}📖 Documentation complète:${NC}"
echo -e "${CYAN}   • ./DEPLOIEMENT_FLASHBOT.md${NC}"
echo -e "${CYAN}   • ./contracts/DEPLOYMENT_GUIDE.md${NC}"
echo -e "${CYAN}   • ./contracts/README.md${NC}"
echo ""

echo -e "${PURPLE}🎉 Félicitations! THESORIA FlashBot est prêt! 🎉${NC}"
echo ""
