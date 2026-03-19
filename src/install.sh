#!/bin/bash

###############################################################################
#                                                                             #
#                   🔥 THESORIA - INSTALLATION AUTOMATIQUE                   #
#                                                                             #
###############################################################################

clear

echo "
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    🔥 INSTALLATION THESORIA 🔥                            ║
║                                                                            ║
║              Plateforme de Trading Blockchain Automatisée                  ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

###############################################################################
# VÉRIFICATIONS SYSTÈME
###############################################################################

echo "🔍 Vérification du système..."
echo ""

# Vérifier OS
OS=$(uname -s)
print_info "OS détecté: $OS"

# Vérifier Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    print_success "Python3 détecté: v$PYTHON_VERSION"
else
    print_error "Python3 non trouvé!"
    echo ""
    echo "Installation requise:"
    echo "  • Ubuntu/Debian: sudo apt install python3 python3-pip"
    echo "  • macOS: brew install python3"
    echo "  • Windows: https://www.python.org/downloads/"
    exit 1
fi

# Vérifier pip
if command -v pip3 &> /dev/null; then
    print_success "pip3 détecté"
else
    print_warning "pip3 non trouvé - tentative installation..."
    python3 -m ensurepip --default-pip
fi

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js détecté: $NODE_VERSION"
else
    print_warning "Node.js non trouvé (requis pour frontend et smart contracts)"
    echo ""
    echo "Installation recommandée:"
    echo "  • Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs"
    echo "  • macOS: brew install node"
    echo "  • Windows: https://nodejs.org/"
    echo ""
    read -p "Continuer sans Node.js? (backend uniquement) [y/N]: " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""

###############################################################################
# INSTALLATION DÉPENDANCES
###############################################################################

echo "📦 Installation des dépendances..."
echo ""

# Backend Python
print_info "Installation dépendances Python..."
cd backend

# Créer requirements.txt si inexistant
if [ ! -f "requirements.txt" ]; then
    cat > requirements.txt << EOF
web3>=6.0.0
aiohttp>=3.8.0
python-dotenv>=1.0.0
eth-abi>=4.0.0
requests>=2.31.0
websockets>=11.0
colorama>=0.4.6
EOF
    print_info "requirements.txt créé"
fi

pip3 install -r requirements.txt > /dev/null 2>&1

if [ $? -eq 0 ]; then
    print_success "Dépendances Python installées"
else
    print_error "Erreur installation Python"
    exit 1
fi

cd ..

# Frontend
if command -v npm &> /dev/null; then
    print_info "Installation dépendances Frontend..."
    
    if [ -f "package.json" ]; then
        npm install > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            print_success "Dépendances Frontend installées"
        else
            print_warning "Erreur installation Frontend"
        fi
    else
        print_warning "package.json non trouvé - skip frontend"
    fi
fi

# Smart Contracts
if [ -d "contracts" ] && command -v npm &> /dev/null; then
    print_info "Installation dépendances Smart Contracts..."
    
    cd contracts
    
    if [ -f "package.json" ]; then
        npm install > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            print_success "Dépendances Smart Contracts installées"
        else
            print_warning "Erreur installation Smart Contracts"
        fi
    fi
    
    cd ..
fi

echo ""

###############################################################################
# CONFIGURATION
###############################################################################

echo "⚙️  Configuration initiale..."
echo ""

# Créer dossiers nécessaires
mkdir -p logs
mkdir -p backend/data
mkdir -p contracts/deployments

print_success "Dossiers créés"

# Configuration .env
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.production.template" ]; then
        cp backend/.env.production.template backend/.env
        print_success "Fichier .env créé depuis template"
        print_warning "⚠️  IMPORTANT: Éditer backend/.env avec vos vraies valeurs!"
    else
        # Créer .env minimal
        cat > backend/.env << EOF
# Configuration minimale
WALLET_ADDRESS=0x
WALLET_PRIVATE_KEY=your_private_key
ETH_RPC_URL=https://eth.llamarpc.com

# Mode
TESTNET_MODE=false
DEMO_MODE=true
AUTO_EXECUTE=false

# Limites
MIN_ARBITRAGE_PROFIT=50
MAX_TRADE_SIZE=5000

# Monitoring
LOG_LEVEL=INFO
WEBSOCKET_PORT=8765
EOF
        print_success "Fichier .env créé (configuration basique)"
        print_warning "⚠️  Configurer backend/.env avant production!"
    fi
else
    print_info "Fichier .env existe déjà"
fi

# Rendre launcher exécutable
if [ -f "🚀_PRODUCTION_LAUNCHER.sh" ]; then
    chmod +x 🚀_PRODUCTION_LAUNCHER.sh
    print_success "Launcher rendu exécutable"
fi

echo ""

###############################################################################
# COMPILATION SMART CONTRACTS (optionnel)
###############################################################################

if [ -d "contracts" ] && command -v npx &> /dev/null; then
    echo "🔨 Compilation smart contracts..."
    echo ""
    
    read -p "Compiler les smart contracts maintenant? [y/N]: " COMPILE
    
    if [[ $COMPILE =~ ^[Yy]$ ]]; then
        cd contracts
        
        print_info "Compilation en cours..."
        npx hardhat compile > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            print_success "Smart contracts compilés avec succès"
        else
            print_error "Erreur de compilation"
            print_info "Vérifier contracts/FlashLoanArbitrage.sol"
        fi
        
        cd ..
        echo ""
    fi
fi

###############################################################################
# TEST RAPIDE
###############################################################################

echo "🧪 Test de fonctionnement..."
echo ""

# Test connexion Python
print_info "Test modules Python..."
python3 << EOF > /dev/null 2>&1
import web3
import aiohttp
import dotenv
print("OK")
EOF

if [ $? -eq 0 ]; then
    print_success "Modules Python fonctionnels"
else
    print_error "Problème modules Python"
fi

# Test RPC connection (si configuré)
if grep -q "ETH_RPC_URL=http" backend/.env 2>/dev/null; then
    print_info "Test connexion RPC..."
    
    cd backend
    python3 << EOF > /dev/null 2>&1
from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv()
w3 = Web3(Web3.HTTPProvider(os.getenv("ETH_RPC_URL")))
if w3.is_connected():
    print("OK")
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Connexion RPC fonctionnelle"
    else
        print_warning "Connexion RPC échouée (vérifier .env)"
    fi
    
    cd ..
fi

echo ""

###############################################################################
# RÉSUMÉ INSTALLATION
###############################################################################

echo "
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    ✅ INSTALLATION TERMINÉE !                             ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"

echo -e "${GREEN}Composants installés:${NC}"
echo ""
echo "  ✓ Dépendances Python"
[ -f "package.json" ] && echo "  ✓ Dépendances Frontend"
[ -d "contracts" ] && echo "  ✓ Smart Contracts"
echo "  ✓ Configuration de base"
echo "  ✓ Dossiers créés"
echo ""

echo -e "${BLUE}Prochaines étapes:${NC}"
echo ""
echo "1️⃣  MODE DÉMO (Recommandé pour commencer)"
echo "   ${YELLOW}./🚀_PRODUCTION_LAUNCHER.sh${NC}"
echo "   → Choisir option 1"
echo "   → Aucune configuration requise"
echo "   → Simulation complète"
echo ""
echo "2️⃣  CONFIGURATION PRODUCTION"
echo "   ${YELLOW}nano backend/.env${NC}"
echo "   → Remplir WALLET_PRIVATE_KEY"
echo "   → Remplir ETH_RPC_URL"
echo "   → Configurer limites trading"
echo ""
echo "3️⃣  DÉPLOIEMENT SMART CONTRACTS"
echo "   ${YELLOW}cd contracts${NC}"
echo "   ${YELLOW}npx hardhat run scripts/deploy.js --network sepolia${NC}"
echo "   → Testnet d'abord (gratuit)"
echo "   → Mainnet ensuite (coûte gas)"
echo ""
echo "4️⃣  LANCEMENT PRODUCTION"
echo "   ${YELLOW}./🚀_PRODUCTION_LAUNCHER.sh${NC}"
echo "   → Option 2 (Testnet) ou 3 (Mainnet)"
echo ""

echo -e "${YELLOW}📚 Documentation:${NC}"
echo "   • 🎯_QUICK_START_PRODUCTION.md    - Guide rapide"
echo "   • 🔥_DEPLOYMENT_GUIDE_PRODUCTION.md - Guide complet"
echo "   • ⚠️_VÉRITÉ_IMPORTANTE.txt        - Risques & réalité"
echo ""

echo -e "${RED}⚠️  RAPPELS IMPORTANTS:${NC}"
echo "   • Tester sur TESTNET avant mainnet"
echo "   • NE JAMAIS partager WALLET_PRIVATE_KEY"
echo "   • Commencer avec petit capital"
echo "   • Comprendre risques (perte possible)"
echo ""

echo -e "${GREEN}🚀 Démarrer maintenant:${NC}"
echo "   ${YELLOW}./🚀_PRODUCTION_LAUNCHER.sh${NC}"
echo ""

# Demander si lancer maintenant
read -p "Lancer le système maintenant? [y/N]: " LAUNCH

if [[ $LAUNCH =~ ^[Yy]$ ]]; then
    echo ""
    ./🚀_PRODUCTION_LAUNCHER.sh
fi
