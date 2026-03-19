#!/bin/bash

# ============================================
# THESORIA - Script de Déploiement Rapide
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo ""
echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║         🚀 THESORIA FLASHBOT DEPLOYMENT                  ║${NC}"
echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si dans le bon dossier
if [ ! -f "hardhat.config.js" ]; then
    echo -e "${RED}❌ Erreur: Exécutez ce script depuis /contracts/${NC}"
    echo -e "${YELLOW}   cd contracts && ./deploy-quick.sh${NC}"
    exit 1
fi

# Vérifier .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    echo ""
    echo -e "${CYAN}Création du fichier .env...${NC}"
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env créé depuis .env.example${NC}"
    else
        touch .env
        echo -e "${GREEN}✅ .env créé${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}📝 Veuillez éditer contracts/.env et ajouter:${NC}"
    echo -e "${CYAN}   WALLET_PRIVATE_KEY=votre_cle_privee${NC}"
    echo ""
    echo -e "${YELLOW}   Pour obtenir votre clé privée:${NC}"
    echo -e "${CYAN}   1. Ouvrez MetaMask${NC}"
    echo -e "${CYAN}   2. Cliquez sur les 3 points${NC}"
    echo -e "${CYAN}   3. Account Details → Export Private Key${NC}"
    echo -e "${CYAN}   4. Copiez la clé (sans le 0x)${NC}"
    echo ""
    
    read -p "Appuyez sur Entrée une fois la clé configurée..."
fi

# Vérifier si clé privée configurée
if ! grep -q "WALLET_PRIVATE_KEY=.\+" .env; then
    echo -e "${RED}❌ WALLET_PRIVATE_KEY non configurée dans .env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration .env trouvée${NC}"
echo ""

# Menu de sélection du réseau
echo -e "${CYAN}📡 Sélectionnez le réseau de déploiement:${NC}"
echo ""
echo -e "${GREEN}TESTNET (GRATUIT - Recommandé pour tester):${NC}"
echo "  1) Mumbai (Polygon Testnet)"
echo "  2) Sepolia (Ethereum Testnet)"
echo ""
echo -e "${YELLOW}MAINNET (PRODUCTION RÉELLE - Coûte de l'argent):${NC}"
echo "  3) Polygon (~$0.05-0.15)"
echo "  4) Gnosis Chain (~$1-3) ⭐ GAS BAS"
echo "  5) Ethereum (~$30-100)"
echo "  6) Arbitrum (~$0.10-0.30)"
echo ""
read -p "Votre choix [1-6]: " choice

case $choice in
    1)
        NETWORK="mumbai"
        NETWORK_NAME="Polygon Mumbai (Testnet)"
        FAUCET="https://faucet.polygon.technology/"
        ;;
    2)
        NETWORK="sepolia"
        NETWORK_NAME="Ethereum Sepolia (Testnet)"
        FAUCET="https://sepoliafaucet.com/"
        ;;
    3)
        NETWORK="polygon"
        NETWORK_NAME="Polygon Mainnet"
        FAUCET=""
        ;;
    4)
        NETWORK="gnosis"
        NETWORK_NAME="Gnosis Chain"
        FAUCET=""
        ;;
    5)
        NETWORK="mainnet"
        NETWORK_NAME="Ethereum Mainnet"
        FAUCET=""
        ;;
    6)
        NETWORK="arbitrum"
        NETWORK_NAME="Arbitrum One"
        FAUCET=""
        ;;
    *)
        echo -e "${RED}❌ Choix invalide${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}📡 Réseau sélectionné: ${NETWORK_NAME}${NC}"
echo ""

# Si testnet, rappeler le faucet
if [ ! -z "$FAUCET" ]; then
    echo -e "${YELLOW}💧 N'oubliez pas d'obtenir des tokens de test:${NC}"
    echo -e "${CYAN}   ${FAUCET}${NC}"
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
    echo ""
fi

# Si mainnet, confirmation
if [ "$choice" -ge 3 ]; then
    echo -e "${RED}⚠️  ATTENTION: Vous allez déployer sur MAINNET${NC}"
    echo -e "${YELLOW}   Cela coûtera de l'argent réel!${NC}"
    echo ""
    read -p "Êtes-vous sûr? (tapez OUI): " confirm
    
    if [ "$confirm" != "OUI" ]; then
        echo -e "${YELLOW}❌ Déploiement annulé${NC}"
        exit 0
    fi
    echo ""
fi

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo -e "${CYAN}📦 Installation des dépendances...${NC}"
    npm install
    echo -e "${GREEN}✅ Dépendances installées${NC}"
    echo ""
fi

# Compilation
echo -e "${CYAN}🔨 Compilation du Smart Contract...${NC}"
npx hardhat compile

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur de compilation${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Compilation réussie${NC}"
echo ""

# Déploiement
echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║  🚀 LANCEMENT DU DÉPLOIEMENT                             ║${NC}"
echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

npx hardhat run scripts/deploy-flashbot.js --network $NETWORK

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    echo ""
    echo -e "${YELLOW}Causes possibles:${NC}"
    echo -e "${CYAN}  • Balance insuffisante${NC}"
    echo -e "${CYAN}  • Clé privée invalide${NC}"
    echo -e "${CYAN}  • Problème de connexion RPC${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!                     ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}📋 Prochaines étapes:${NC}"
echo ""
echo -e "${YELLOW}1.${NC} Vérifiez le contrat sur l'explorateur (lien affiché ci-dessus)"
echo -e "${YELLOW}2.${NC} Ouvrez http://localhost:3000"
echo -e "${YELLOW}3.${NC} Cliquez sur 'Connecter MetaMask'"
echo -e "${YELLOW}4.${NC} Testez un Flash Loan!"
echo ""

echo -e "${PURPLE}🎉 Félicitations! THESORIA FlashBot est déployé!${NC}"
echo ""
