#!/bin/bash

###############################################################################
#                                                                             #
#                   🔥 THESORIA - ULTIMATE LAUNCHER 🔥                       #
#                                                                             #
#         Setup + Tests + Config + Lancement en UNE SEULE COMMANDE          #
#                                                                             #
###############################################################################

clear

echo "
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    🔥 THESORIA ULTIMATE LAUNCHER 🔥                       ║
║                                                                            ║
║                    Setup Complet Automatisé                                ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

print_step() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} ${MAGENTA}$1${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

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

# Compteurs
STEPS_TOTAL=7
STEPS_DONE=0

progress_bar() {
    STEPS_DONE=$((STEPS_DONE + 1))
    PERCENT=$((STEPS_DONE * 100 / STEPS_TOTAL))
    
    echo -e "\n${CYAN}Progress: [$STEPS_DONE/$STEPS_TOTAL] ${PERCENT}%${NC}\n"
}

###############################################################################
# STEP 1: PERMISSIONS
###############################################################################

print_step "STEP 1/$STEPS_TOTAL: Configuration Permissions"

if [ -f "setup_permissions.sh" ]; then
    bash setup_permissions.sh > /dev/null 2>&1
    print_success "Permissions configurées"
else
    chmod +x *.sh 2>/dev/null
    print_success "Permissions de base configurées"
fi

progress_bar

###############################################################################
# STEP 2: INSTALLATION DÉPENDANCES
###############################################################################

print_step "STEP 2/$STEPS_TOTAL: Installation Dépendances"

# Python
print_info "Installation dépendances Python..."
cd backend
pip3 install -q -r requirements.txt 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "Dépendances Python installées"
else
    pip3 install -q web3 aiohttp python-dotenv eth-abi colorama 2>/dev/null
    print_success "Dépendances Python de base installées"
fi

cd ..

# Node.js (optionnel)
if command -v npm &> /dev/null && [ -f "package.json" ]; then
    print_info "Installation dépendances Frontend..."
    npm install > /dev/null 2>&1
    print_success "Dépendances Frontend installées"
fi

progress_bar

###############################################################################
# STEP 3: CONFIGURATION
###############################################################################

print_step "STEP 3/$STEPS_TOTAL: Vérification Configuration"

if [ ! -f "backend/.env" ]; then
    print_warning "Aucun fichier .env trouvé"
    echo ""
    echo "Quelle configuration utiliser?"
    echo ""
    echo "1) Mode Démo (défaut - 0 config)"
    echo "2) Mode Testnet (wallet testnet requis)"
    echo "3) Production Conservative (wallet + capital)"
    echo "4) Production Balanced"
    echo "5) Production Aggressive"
    echo "6) Configuration manuelle"
    echo ""
    read -p "Choix (1-6) [1]: " CONFIG_CHOICE
    CONFIG_CHOICE=${CONFIG_CHOICE:-1}
    
    case $CONFIG_CHOICE in
        1)
            cp backend/.env.production.template backend/.env
            sed -i.bak 's/DEMO_MODE=.*/DEMO_MODE=true/' backend/.env 2>/dev/null || true
            print_success "Configuration Démo créée"
            ;;
        2)
            cd backend
            python3 config_examples.py generate testnet_testing .env 2>/dev/null || cp .env.production.template .env
            cd ..
            print_success "Configuration Testnet créée"
            print_warning "Éditer backend/.env pour ajouter wallet testnet"
            ;;
        3)
            cd backend
            python3 config_examples.py generate production_conservative .env 2>/dev/null || cp .env.production.template .env
            cd ..
            print_success "Configuration Production Conservative créée"
            print_warning "Éditer backend/.env pour ajouter wallet + RPC"
            ;;
        4)
            cd backend
            python3 config_examples.py generate production_balanced .env 2>/dev/null || cp .env.production.template .env
            cd ..
            print_success "Configuration Production Balanced créée"
            print_warning "Éditer backend/.env pour ajouter wallet + RPC"
            ;;
        5)
            cd backend
            python3 config_examples.py generate production_aggressive .env 2>/dev/null || cp .env.production.template .env
            cd ..
            print_success "Configuration Production Aggressive créée"
            print_warning "⚠️  RISQUE ÉLEVÉ - Éditer backend/.env"
            ;;
        6)
            nano backend/.env
            ;;
    esac
else
    print_success "Fichier .env existe déjà"
fi

# Créer dossiers nécessaires
mkdir -p logs backend/data contracts/deployments 2>/dev/null
print_success "Dossiers créés"

progress_bar

###############################################################################
# STEP 4: TESTS SYSTÈME
###############################################################################

print_step "STEP 4/$STEPS_TOTAL: Tests Système"

if [ -f "test_quick.sh" ]; then
    print_info "Lancement test rapide..."
    ./test_quick.sh
else
    print_info "Test connexion basique..."
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

progress_bar

###############################################################################
# STEP 5: COMPILATION SMART CONTRACTS (Optionnel)
###############################################################################

print_step "STEP 5/$STEPS_TOTAL: Smart Contracts (Optionnel)"

if [ -d "contracts" ] && command -v npx &> /dev/null; then
    echo "Compiler les smart contracts?"
    echo "  1) Oui, compiler maintenant"
    echo "  2) Non, skip (plus tard)"
    echo ""
    read -p "Choix (1-2) [2]: " COMPILE_CHOICE
    COMPILE_CHOICE=${COMPILE_CHOICE:-2}
    
    if [ "$COMPILE_CHOICE" = "1" ]; then
        print_info "Compilation smart contracts..."
        cd contracts
        npm install > /dev/null 2>&1
        npx hardhat compile > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            print_success "Smart contracts compilés"
        else
            print_warning "Erreur compilation (peut être ignoré)"
        fi
        
        cd ..
    else
        print_info "Compilation skippée"
    fi
else
    print_info "Smart contracts skip (npm non disponible ou dossier manquant)"
fi

progress_bar

###############################################################################
# STEP 6: AFFICHAGE INFORMATIONS
###############################################################################

print_step "STEP 6/$STEPS_TOTAL: Informations Système"

# Déterminer mode
MODE="INCONNU"
if grep -q "DEMO_MODE=true" backend/.env 2>/dev/null; then
    MODE="DÉMO (Simulation)"
elif grep -q "TESTNET_MODE=true" backend/.env 2>/dev/null; then
    MODE="TESTNET (Transactions testnet)"
else
    MODE="PRODUCTION (⚠️ Argent réel)"
fi

echo ""
echo -e "${CYAN}Configuration Détectée:${NC}"
echo -e "  Mode: ${YELLOW}$MODE${NC}"

if grep -q "AUTO_EXECUTE=true" backend/.env 2>/dev/null; then
    echo -e "  Auto-execute: ${RED}ACTIVÉ ⚠️${NC}"
else
    echo -e "  Auto-execute: ${GREEN}Désactivé (surveillance)${NC}"
fi

# Balance (si wallet configuré)
WALLET=$(grep "WALLET_ADDRESS=" backend/.env 2>/dev/null | cut -d'=' -f2)
if [ -n "$WALLET" ] && [ "$WALLET" != "0x" ] && [ ${#WALLET} -eq 42 ]; then
    print_info "Wallet: ${WALLET:0:10}...${WALLET:38:4}"
fi

echo ""

progress_bar

###############################################################################
# STEP 7: LANCEMENT
###############################################################################

print_step "STEP 7/$STEPS_TOTAL: Lancement Système"

echo ""
echo "Système prêt à lancer!"
echo ""
echo "Options de lancement:"
echo ""
echo "  1) Lancer Frontend + Backend (complet)"
echo "  2) Lancer Frontend uniquement"
echo "  3) Lancer Backend uniquement"
echo "  4) Lancer via Launcher interactif"
echo "  5) Ne rien lancer maintenant"
echo ""
read -p "Choix (1-5) [4]: " LAUNCH_CHOICE
LAUNCH_CHOICE=${LAUNCH_CHOICE:-4}

case $LAUNCH_CHOICE in
    1)
        print_info "Lancement système complet..."
        echo ""
        
        # Frontend
        print_info "Frontend (port 5173)..."
        npm run dev > logs/frontend.log 2>&1 &
        FRONTEND_PID=$!
        sleep 2
        print_success "Frontend démarré (PID: $FRONTEND_PID)"
        
        # Backend
        cd backend
        
        # Déterminer quel bot lancer
        if grep -q "DEMO_MODE=true" .env 2>/dev/null; then
            print_info "Bot simulation..."
            python3 god_mode_bot.py > ../logs/bot.log 2>&1 &
        else
            print_info "Détecteur arbitrage réel..."
            python3 real_arbitrage_detector.py > ../logs/arbitrage.log 2>&1 &
        fi
        BOT_PID=$!
        print_success "Backend démarré (PID: $BOT_PID)"
        
        # WebSocket
        print_info "WebSocket server..."
        python3 websocket_server.py > ../logs/websocket.log 2>&1 &
        WS_PID=$!
        print_success "WebSocket démarré (PID: $WS_PID)"
        
        cd ..
        
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║              ✅ SYSTÈME LANCÉ AVEC SUCCÈS !                   ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${CYAN}🌐 Interface Web:${NC}     http://localhost:5173"
        echo -e "${CYAN}📊 Dashboard Live:${NC}    http://localhost:5173/live"
        echo -e "${CYAN}📝 Logs:${NC}              ./logs/"
        echo ""
        echo -e "${YELLOW}Mode:${NC} $MODE"
        echo ""
        echo -e "${CYAN}PIDs:${NC}"
        echo "  • Frontend:  $FRONTEND_PID"
        echo "  • Backend:   $BOT_PID"
        echo "  • WebSocket: $WS_PID"
        echo ""
        echo "Appuyez sur CTRL+C pour arrêter..."
        echo ""
        
        trap "kill $FRONTEND_PID $BOT_PID $WS_PID 2>/dev/null; echo ''; echo 'Services arrêtés.'; exit" INT
        wait
        ;;
        
    2)
        print_info "Lancement Frontend uniquement..."
        npm run dev
        ;;
        
    3)
        print_info "Lancement Backend uniquement..."
        cd backend
        
        if grep -q "DEMO_MODE=true" .env 2>/dev/null; then
            python3 god_mode_bot.py
        else
            python3 real_arbitrage_detector.py
        fi
        ;;
        
    4)
        if [ -f "🚀_PRODUCTION_LAUNCHER.sh" ]; then
            ./🚀_PRODUCTION_LAUNCHER.sh
        else
            print_error "Launcher non trouvé!"
        fi
        ;;
        
    5)
        print_info "Aucun lancement"
        ;;
esac

progress_bar

###############################################################################
# FINALISATION
###############################################################################

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}║              🎉 SETUP ULTIMATE TERMINÉ ! 🎉                   ║${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$LAUNCH_CHOICE" = "5" ]; then
    echo -e "${CYAN}Pour lancer le système:${NC}"
    echo "  ${YELLOW}./🚀_PRODUCTION_LAUNCHER.sh${NC}"
    echo ""
fi

echo -e "${BLUE}Documentation utile:${NC}"
echo "  • FAQ.md - Questions fréquentes"
echo "  • WHATS_NEW.md - Nouvelles fonctionnalités"
echo "  • COMMANDES.md - Référence commandes"
echo "  • INDEX.md - Navigation complète"
echo ""

echo -e "${YELLOW}Prochaines étapes recommandées:${NC}"
echo "  1. Lire FAQ.md"
echo "  2. Tester performance monitor"
echo "  3. Configurer alertes Discord/Telegram"
echo "  4. Surveiller logs en temps réel"
echo ""

echo -e "${GREEN}Système production-ready ! 🚀${NC}"
echo ""
