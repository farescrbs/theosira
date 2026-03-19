#!/bin/bash

###############################################################################
#                                                                             #
#                   🔄 THESORIA - SYSTÈME DE MISE À JOUR                     #
#                                                                             #
###############################################################################

clear

echo "
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    🔄 SYSTÈME DE MISE À JOUR THESORIA                     ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
# VÉRIFICATIONS
###############################################################################

echo "🔍 Vérification système..."
echo ""

# Vérifier si backend existe
if [ ! -d "backend" ]; then
    print_error "Dossier backend/ non trouvé!"
    exit 1
fi

# Backup configuration
if [ -f "backend/.env" ]; then
    print_info "Backup configuration actuelle..."
    cp backend/.env backend/.env.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup créé"
fi

echo ""

###############################################################################
# MISE À JOUR DÉPENDANCES
###############################################################################

echo "📦 Mise à jour dépendances..."
echo ""

# Python
print_info "Mise à jour dépendances Python..."
cd backend
pip3 install --upgrade -r requirements.txt > /dev/null 2>&1

if [ $? -eq 0 ]; then
    print_success "Dépendances Python mises à jour"
else
    print_warning "Erreur mise à jour Python (peut être ignoré)"
fi

cd ..

# Node.js (Frontend)
if [ -f "package.json" ]; then
    print_info "Mise à jour dépendances Frontend..."
    npm update > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        print_success "Dépendances Frontend mises à jour"
    else
        print_warning "Erreur mise à jour Frontend"
    fi
fi

# Smart Contracts
if [ -d "contracts" ] && [ -f "contracts/package.json" ]; then
    print_info "Mise à jour dépendances Smart Contracts..."
    cd contracts
    npm update > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        print_success "Dépendances Smart Contracts mises à jour"
    else
        print_warning "Erreur mise à jour Smart Contracts"
    fi
    
    cd ..
fi

echo ""

###############################################################################
# NETTOYAGE
###############################################################################

echo "🧹 Nettoyage..."
echo ""

# Supprimer anciens logs (plus de 30 jours)
if [ -d "logs" ]; then
    print_info "Nettoyage anciens logs..."
    find logs -name "*.log" -mtime +30 -delete 2>/dev/null
    print_success "Logs nettoyés"
fi

# Supprimer cache Python
print_info "Nettoyage cache Python..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null
print_success "Cache Python nettoyé"

echo ""

###############################################################################
# VÉRIFICATION INTÉGRITÉ
###############################################################################

echo "🔍 Vérification intégrité..."
echo ""

# Vérifier fichiers critiques
CRITICAL_FILES=(
    "backend/.env"
    "backend/god_mode_bot.py"
    "backend/real_arbitrage_detector.py"
    "backend/websocket_server.py"
    "🚀_PRODUCTION_LAUNCHER.sh"
)

ALL_OK=true

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file présent"
    else
        print_error "$file manquant!"
        ALL_OK=false
    fi
done

echo ""

if [ "$ALL_OK" = true ]; then
    print_success "Tous les fichiers critiques présents"
else
    print_warning "Certains fichiers manquent - système peut être incomplet"
fi

echo ""

###############################################################################
# TEST RAPIDE
###############################################################################

echo "🧪 Test rapide système..."
echo ""

# Test Python
print_info "Test Python..."
cd backend
python3 << 'EOF' > /dev/null 2>&1
try:
    import web3
    import aiohttp
    import dotenv
    print("OK")
except ImportError:
    exit(1)
EOF

if [ $? -eq 0 ]; then
    print_success "Modules Python OK"
else
    print_error "Modules Python manquants - relancer install.sh"
fi

cd ..

# Test connexion RPC (si configuré)
if grep -q "ETH_RPC_URL=http" backend/.env 2>/dev/null; then
    print_info "Test connexion RPC..."
    
    cd backend
    python3 << 'EOF' > /dev/null 2>&1
from web3 import Web3
import os
from dotenv import load_dotenv
load_dotenv()
try:
    w3 = Web3(Web3.HTTPProvider(os.getenv("ETH_RPC_URL")))
    if w3.is_connected():
        print("OK")
    else:
        exit(1)
except:
    exit(1)
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Connexion RPC OK"
    else
        print_warning "Connexion RPC échouée (vérifier .env)"
    fi
    
    cd ..
fi

echo ""

###############################################################################
# PERMISSIONS
###############################################################################

echo "🔐 Vérification permissions..."
echo ""

# Rendre scripts exécutables
chmod +x *.sh 2>/dev/null
chmod +x backend/*.py 2>/dev/null

print_success "Permissions mises à jour"

echo ""

###############################################################################
# RÉSUMÉ
###############################################################################

echo "
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    ✅ MISE À JOUR TERMINÉE !                              ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"

echo -e "${GREEN}Mises à jour effectuées:${NC}"
echo "  • Dépendances Python"
echo "  • Dépendances Node.js (si applicable)"
echo "  • Nettoyage cache"
echo "  • Vérification intégrité"
echo "  • Tests système"
echo ""

if [ -f "backend/.env.backup."* ]; then
    echo -e "${BLUE}Backup configuration:${NC}"
    echo "  • Sauvegardé dans backend/.env.backup.*"
    echo ""
fi

echo -e "${YELLOW}Recommandations post-mise à jour:${NC}"
echo "  1. Vérifier backend/.env (comparer avec backup)"
echo "  2. Lancer tests: ./run_tests.sh"
echo "  3. Tester système: ./test_quick.sh"
echo ""

echo -e "${GREEN}Système prêt à relancer:${NC}"
echo "  ${YELLOW}./🚀_PRODUCTION_LAUNCHER.sh${NC}"
echo ""

# Demander si lancer tests
read -p "Lancer tests maintenant? [y/N]: " RUN_TESTS

if [[ $RUN_TESTS =~ ^[Yy]$ ]]; then
    echo ""
    if [ -f "run_tests.sh" ]; then
        ./run_tests.sh
    else
        ./test_quick.sh
    fi
fi
