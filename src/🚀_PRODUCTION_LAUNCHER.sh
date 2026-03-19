#!/bin/bash

###############################################################################
#                                                                             #
#                   🔥 THESORIA - PRODUCTION LAUNCHER                         #
#                     Lancement Système Complet                               #
#                                                                             #
###############################################################################

clear

echo "
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    🔥 THESORIA PRODUCTION LAUNCHER 🔥                      ║
║                                                                            ║
║                     Système de Trading Blockchain                          ║
║                        Mode PRODUCTION RÉEL                                ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function pour afficher avec style
print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

###############################################################################
# VÉRIFICATIONS PRÉ-LANCEMENT
###############################################################################

print_step "Vérifications pré-lancement..."
echo ""

# Vérifier Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    print_success "Python installé: v$PYTHON_VERSION"
else
    print_error "Python 3 non trouvé!"
    exit 1
fi

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installé: $NODE_VERSION"
else
    print_warning "Node.js non trouvé (requis pour smart contracts)"
fi

# Vérifier npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "NPM installé: v$NPM_VERSION"
else
    print_warning "NPM non trouvé"
fi

echo ""

###############################################################################
# INSTALLATION DÉPENDANCES
###############################################################################

print_step "Installation des dépendances..."
echo ""

# Backend Python
print_info "Installation dépendances Python..."
cd backend
if [ -f "requirements.txt" ]; then
    pip3 install -q -r requirements.txt
    print_success "Dépendances Python installées"
else
    pip3 install -q web3 aiohttp python-dotenv eth-abi requests websockets
    print_success "Dépendances Python de base installées"
fi
cd ..

# Frontend
print_info "Installation dépendances Frontend..."
if [ -f "package.json" ]; then
    npm install --silent 2>/dev/null
    print_success "Dépendances Frontend installées"
fi

# Smart Contracts (si présent)
if [ -d "contracts" ]; then
    print_info "Installation dépendances Smart Contracts..."
    cd contracts
    if [ -f "package.json" ]; then
        npm install --silent 2>/dev/null
        print_success "Dépendances Smart Contracts installées"
    fi
    cd ..
fi

echo ""

###############################################################################
# VÉRIFICATION CONFIGURATION
###############################################################################

print_step "Vérification configuration..."
echo ""

ENV_COMPLETE=true

# Vérifier .env backend
if [ -f "backend/.env" ]; then
    print_success "Fichier backend/.env trouvé"
    
    # Vérifier variables critiques
    if grep -q "WALLET_PRIVATE_KEY=your_private_key" backend/.env 2>/dev/null; then
        print_warning "WALLET_PRIVATE_KEY non configurée"
        ENV_COMPLETE=false
    fi
    
    if grep -q "ETH_RPC_URL=" backend/.env 2>/dev/null; then
        print_success "RPC URL configurée"
    else
        print_warning "ETH_RPC_URL manquante"
        ENV_COMPLETE=false
    fi
else
    print_error "Fichier backend/.env manquant!"
    ENV_COMPLETE=false
fi

echo ""

###############################################################################
# CHOIX MODE
###############################################################################

print_step "Sélection du mode de lancement"
echo ""

echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    MODES DISPONIBLES                           ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}1)${NC} 🎓 MODE DÉMO/ÉDUCATIF"
echo "   • Simulation complète (pas de vraies transactions)"
echo "   • Pas de risque financier"
echo "   • Interface complète fonctionnelle"
echo "   • Idéal pour apprendre"
echo ""
echo -e "${CYAN}2)${NC} 🧪 MODE TESTNET"
echo "   • Transactions réelles sur testnet (gratuit)"
echo "   • Utilise faucets testnet"
echo "   • Tests sans risque"
echo "   • Nécessite wallet testnet configuré"
echo ""
echo -e "${CYAN}3)${NC} 🔥 MODE PRODUCTION (MAINNET)"
echo "   • ⚠️  TRANSACTIONS RÉELLES AVEC ARGENT RÉEL"
echo "   • Nécessite capital ($1,000+ recommandé)"
echo "   • Smart contract déployé requis"
echo "   • Risque de perte totale"
echo ""
echo -e "${CYAN}4)${NC} 📊 MODE SURVEILLANCE UNIQUEMENT"
echo "   • Détection opportunités réelles"
echo "   • Aucune exécution automatique"
echo "   • Monitoring et alertes"
echo "   • Sécurisé (read-only)"
echo ""
echo -e "${CYAN}5)${NC} 🛠️  INSTALLATION/DÉPLOIEMENT SMART CONTRACTS"
echo "   • Compiler contrats Solidity"
echo "   • Déployer sur testnet/mainnet"
echo "   • Configuration complète"
echo ""

read -p "Sélectionner mode (1-5): " MODE_CHOICE

echo ""

###############################################################################
# LANCEMENT SELON MODE
###############################################################################

case $MODE_CHOICE in

    1)
        ###################################################################
        # MODE DÉMO/ÉDUCATIF
        ###################################################################
        
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║              🎓 LANCEMENT MODE DÉMO/ÉDUCATIF                   ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        
        # Configurer mode démo
        cd backend
        if [ -f ".env" ]; then
            sed -i.bak 's/TESTNET_MODE=.*/TESTNET_MODE=false/' .env 2>/dev/null || true
            sed -i.bak 's/AUTO_EXECUTE=.*/AUTO_EXECUTE=false/' .env 2>/dev/null || true
            sed -i.bak 's/DEMO_MODE=.*/DEMO_MODE=true/' .env 2>/dev/null || true
        fi
        cd ..
        
        print_success "Configuration mode démo activée"
        echo ""
        
        print_step "Lancement des services..."
        echo ""
        
        # Lancer Frontend
        print_info "Démarrage Frontend (port 5173)..."
        npm run dev > /dev/null 2>&1 &
        FRONTEND_PID=$!
        sleep 3
        print_success "Frontend démarré (PID: $FRONTEND_PID)"
        
        # Lancer Bot (simulation)
        print_info "Démarrage Bot Trading (simulation)..."
        cd backend
        python3 god_mode_bot.py > ../logs/bot_demo.log 2>&1 &
        BOT_PID=$!
        cd ..
        print_success "Bot démarré (PID: $BOT_PID)"
        
        # Lancer WebSocket
        print_info "Démarrage WebSocket Server..."
        cd backend
        python3 websocket_server.py > ../logs/websocket.log 2>&1 &
        WS_PID=$!
        cd ..
        print_success "WebSocket démarré (PID: $WS_PID)"
        
        # Lancer Monitor
        print_info "Démarrage Quantum Monitor..."
        cd backend
        python3 quantum_monitor.py > ../logs/monitor.log 2>&1 &
        MONITOR_PID=$!
        cd ..
        print_success "Monitor démarré (PID: $MONITOR_PID)"
        
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                    ✅ SYSTÈME DÉMARRÉ !                        ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${CYAN}🌐 Interface Web:${NC}     http://localhost:5173"
        echo -e "${CYAN}📊 Dashboard Live:${NC}    http://localhost:5173/live"
        echo -e "${CYAN}🔌 WebSocket:${NC}         ws://localhost:8765"
        echo ""
        echo -e "${YELLOW}Mode:${NC} DÉMO/ÉDUCATIF (Simulation - Pas de vraies transactions)"
        echo ""
        echo -e "${CYAN}PIDs:${NC}"
        echo "  • Frontend: $FRONTEND_PID"
        echo "  • Bot:      $BOT_PID"
        echo "  • WebSocket: $WS_PID"
        echo "  • Monitor:   $MONITOR_PID"
        echo ""
        echo -e "${PURPLE}📝 Logs disponibles dans: ./logs/${NC}"
        echo ""
        echo "Appuyez sur CTRL+C pour arrêter tous les services..."
        
        # Attendre
        trap "kill $FRONTEND_PID $BOT_PID $WS_PID $MONITOR_PID 2>/dev/null; echo ''; echo 'Services arrêtés.'; exit" INT
        wait
        ;;

    2)
        ###################################################################
        # MODE TESTNET
        ###################################################################
        
        echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║                 🧪 LANCEMENT MODE TESTNET                      ║${NC}"
        echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        
        # Vérifier config
        if [ "$ENV_COMPLETE" = false ]; then
            print_error "Configuration incomplète!"
            echo ""
            echo "Veuillez configurer backend/.env avec:"
            echo "  • WALLET_PRIVATE_KEY (wallet testnet)"
            echo "  • ETH_RPC_URL (RPC testnet)"
            echo ""
            echo "Faucets testnet gratuits:"
            echo "  • Sepolia: https://sepoliafaucet.com"
            echo "  • Mumbai: https://faucet.polygon.technology"
            echo ""
            exit 1
        fi
        
        # Configurer mode testnet
        cd backend
        sed -i.bak 's/TESTNET_MODE=.*/TESTNET_MODE=true/' .env 2>/dev/null || true
        sed -i.bak 's/AUTO_EXECUTE=.*/AUTO_EXECUTE=false/' .env 2>/dev/null || true
        cd ..
        
        print_success "Configuration mode testnet activée"
        echo ""
        
        print_warning "Mode testnet - Utilisez des faucets pour obtenir tokens gratuits"
        echo ""
        
        # Lancer services
        print_step "Lancement des services testnet..."
        echo ""
        
        npm run dev > /dev/null 2>&1 &
        FRONTEND_PID=$!
        print_success "Frontend démarré"
        
        cd backend
        python3 real_arbitrage_detector.py &
        DETECTOR_PID=$!
        cd ..
        print_success "Détecteur démarré (testnet)"
        
        echo ""
        print_success "Système testnet opérationnel!"
        echo ""
        echo "🌐 Interface: http://localhost:5173"
        echo ""
        
        trap "kill $FRONTEND_PID $DETECTOR_PID 2>/dev/null; exit" INT
        wait
        ;;

    3)
        ###################################################################
        # MODE PRODUCTION (MAINNET)
        ###################################################################
        
        echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║             ⚠️  MODE PRODUCTION - MAINNET ⚠️                   ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        
        print_warning "ATTENTION: Mode production utilise de l'argent RÉEL!"
        echo ""
        echo "Vérifications requises:"
        echo "  • Smart contract déployé sur mainnet"
        echo "  • Capital disponible ($1,000+ recommandé)"
        echo "  • Tests testnet complétés (1-3 mois)"
        echo "  • Audit sécurité effectué"
        echo "  • Comprendre risques (perte possible)"
        echo ""
        
        read -p "Confirmez-vous avoir tout vérifié ? (oui/non): " CONFIRM
        
        if [ "$CONFIRM" != "oui" ]; then
            print_info "Lancement annulé. Recommandation: commencer par mode testnet"
            exit 0
        fi
        
        echo ""
        
        # Vérifier variables critiques
        if [ ! -f "backend/.env" ]; then
            print_error "Fichier backend/.env manquant!"
            exit 1
        fi
        
        if ! grep -q "ARBITRAGE_CONTRACT_ADDRESS=0x" backend/.env 2>/dev/null; then
            print_error "Smart contract non déployé!"
            echo ""
            echo "Veuillez d'abord:"
            echo "  1. Compiler: cd contracts && npx hardhat compile"
            echo "  2. Déployer: npx hardhat run scripts/deploy.js --network mainnet"
            echo "  3. Ajouter l'adresse dans backend/.env"
            exit 1
        fi
        
        # Configurer production
        cd backend
        sed -i.bak 's/TESTNET_MODE=.*/TESTNET_MODE=false/' .env 2>/dev/null || true
        sed -i.bak 's/DEMO_MODE=.*/DEMO_MODE=false/' .env 2>/dev/null || true
        cd ..
        
        print_success "Configuration production activée"
        echo ""
        
        # Demander mode exécution
        echo "Mode d'exécution:"
        echo "  1) Surveillance uniquement (recommandé au début)"
        echo "  2) Auto-exécution (risqué)"
        echo ""
        read -p "Choix (1-2): " EXEC_MODE
        
        if [ "$EXEC_MODE" = "2" ]; then
            cd backend
            sed -i.bak 's/AUTO_EXECUTE=.*/AUTO_EXECUTE=true/' .env 2>/dev/null || true
            cd ..
            print_warning "Auto-exécution ACTIVÉE - Transactions réelles!"
        else
            cd backend
            sed -i.bak 's/AUTO_EXECUTE=.*/AUTO_EXECUTE=false/' .env 2>/dev/null || true
            cd ..
            print_success "Mode surveillance - Pas d'exécution automatique"
        fi
        
        echo ""
        print_step "Lancement système production..."
        echo ""
        
        # Créer dossier logs
        mkdir -p logs
        
        # Frontend
        npm run dev > logs/frontend.log 2>&1 &
        FRONTEND_PID=$!
        print_success "Frontend démarré"
        
        # Real Arbitrage Detector
        cd backend
        python3 real_arbitrage_detector.py > ../logs/arbitrage_prod.log 2>&1 &
        ARB_PID=$!
        cd ..
        print_success "Détecteur d'arbitrage démarré"
        
        # WebSocket
        cd backend
        python3 websocket_server.py > ../logs/websocket_prod.log 2>&1 &
        WS_PID=$!
        cd ..
        print_success "WebSocket démarré"
        
        # Monitor
        cd backend
        python3 quantum_monitor.py > ../logs/monitor_prod.log 2>&1 &
        MON_PID=$!
        cd ..
        print_success "Monitor démarré"
        
        # Auto-backup (si activé)
        if [ -f "backend/auto_backup.py" ]; then
            cd backend
            python3 auto_backup.py > ../logs/backup_prod.log 2>&1 &
            BACKUP_PID=$!
            cd ..
            print_success "Auto-backup démarré"
        fi
        
        echo ""
        echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║              🔥 PRODUCTION MAINNET ACTIVE 🔥                   ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${CYAN}🌐 Interface:${NC}  http://localhost:5173"
        echo -e "${CYAN}📊 Dashboard:${NC}  http://localhost:5173/live"
        echo -e "${CYAN}📝 Logs:${NC}       ./logs/"
        echo ""
        echo -e "${RED}⚠️  MODE: PRODUCTION MAINNET (Argent réel)${NC}"
        if [ "$EXEC_MODE" = "2" ]; then
            echo -e "${RED}⚠️  AUTO-EXÉCUTION: ACTIVÉE${NC}"
        else
            echo -e "${YELLOW}ℹ️  AUTO-EXÉCUTION: Désactivée (surveillance)${NC}"
        fi
        echo ""
        echo "CTRL+C pour arrêter..."
        
        trap "kill $FRONTEND_PID $ARB_PID $WS_PID $MON_PID $BACKUP_PID 2>/dev/null; echo ''; echo 'Production arrêtée.'; exit" INT
        wait
        ;;

    4)
        ###################################################################
        # MODE SURVEILLANCE
        ###################################################################
        
        echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${CYAN}║              📊 MODE SURVEILLANCE UNIQUEMENT                   ║${NC}"
        echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        
        cd backend
        sed -i.bak 's/AUTO_EXECUTE=.*/AUTO_EXECUTE=false/' .env 2>/dev/null || true
        cd ..
        
        print_success "Mode surveillance activé (read-only)"
        echo ""
        
        # Lancer monitoring
        npm run dev > /dev/null 2>&1 &
        FRONTEND_PID=$!
        
        cd backend
        python3 real_arbitrage_detector.py &
        DETECTOR_PID=$!
        
        python3 quantum_monitor.py &
        MONITOR_PID=$!
        cd ..
        
        echo ""
        print_success "Surveillance active - Aucune transaction exécutée"
        echo ""
        echo "🌐 Dashboard: http://localhost:5173"
        echo ""
        
        trap "kill $FRONTEND_PID $DETECTOR_PID $MONITOR_PID 2>/dev/null; exit" INT
        wait
        ;;

    5)
        ###################################################################
        # INSTALLATION/DÉPLOIEMENT SMART CONTRACTS
        ###################################################################
        
        echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${PURPLE}║         🛠️  INSTALLATION SMART CONTRACTS                       ║${NC}"
        echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        
        if [ ! -d "contracts" ]; then
            print_error "Dossier contracts/ non trouvé!"
            exit 1
        fi
        
        cd contracts
        
        print_step "Installation dépendances..."
        npm install
        print_success "Dépendances installées"
        echo ""
        
        print_step "Compilation smart contracts..."
        npx hardhat compile
        
        if [ $? -eq 0 ]; then
            print_success "Compilation réussie!"
        else
            print_error "Erreur de compilation"
            exit 1
        fi
        
        echo ""
        echo "Déploiement:"
        echo "  1) Testnet (gratuit - recommandé)"
        echo "  2) Mainnet (coûte $50-200 en gas)"
        echo ""
        read -p "Choix (1-2): " DEPLOY_CHOICE
        
        if [ "$DEPLOY_CHOICE" = "1" ]; then
            print_info "Déploiement sur testnet Sepolia..."
            npx hardhat run scripts/deploy.js --network sepolia
        else
            print_warning "Déploiement sur MAINNET - Confirmez (oui/non):"
            read CONFIRM_DEPLOY
            
            if [ "$CONFIRM_DEPLOY" = "oui" ]; then
                npx hardhat run scripts/deploy.js --network mainnet
            else
                print_info "Déploiement annulé"
            fi
        fi
        
        cd ..
        ;;

    *)
        print_error "Choix invalide"
        exit 1
        ;;
esac
