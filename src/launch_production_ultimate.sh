#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 THESORIA - PRODUCTION REAL MONEY LAUNCHER
# ═══════════════════════════════════════════════════════════════════════════════
#
# ⚠️⚠️⚠️ MODE PRODUCTION RÉEL - ARGENT RÉEL ⚠️⚠️⚠️
#
# Ce script lance THESORIA en mode production avec de l'argent réel
# sur les blockchains et exchanges réels.
#
# AVANT DE LANCER:
# 1. Lire PRODUCTION_DEPLOYMENT_GUIDE.md
# 2. Configurer .env.production avec toutes les API keys
# 3. Setup wallets et sécurité
# 4. Tester avec PETIT capital d'abord
# 5. Activer monitoring 24/7
#
# CAPITAL RECOMMANDÉ:
# - Starter: $10,000-20,000
# - Growth: $30,000-50,000
# - Scale: $50,000-100,000
# - Professional: $100,000-500,000
# - Institutional: $500,000+
#
# RISK WARNING:
# - Trading crypto = HIGH RISK
# - Pertes possibles
# - N'investissez que ce que vous pouvez perdre
# - Pas de garantie de profit
#
# ═══════════════════════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${RED}${BOLD}"
cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║         🚀 THESORIA - PRODUCTION REAL MONEY MODE 🚀               ║
║                                                                   ║
║               ⚠️⚠️⚠️  ARGENT RÉEL  ⚠️⚠️⚠️                      ║
║                                                                   ║
║                 27 SYSTÈMES | 11 REVENUE STREAMS                  ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "\n${RED}${WHITE}${BOLD}⚠️  WARNING - PRODUCTION MODE ⚠️${NC}\n"
echo -e "${YELLOW}This launcher will start trading with REAL MONEY${NC}"
echo -e "${YELLOW}on REAL blockchains and exchanges.${NC}\n"

echo -e "${RED}RISKS:${NC}"
echo -e "  • Capital loss possible"
echo -e "  • Market volatility"
echo -e "  • Smart contract risks"
echo -e "  • No profit guarantee"
echo -e "  • Technical failures possible\n"

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}PRE-FLIGHT CHECKS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

# Check .env.production
echo -ne "Checking .env.production... "
if [ ! -f ".env.production" ]; then
    echo -e "${RED}✗ NOT FOUND${NC}"
    echo -e "\n${YELLOW}Please create .env.production first:${NC}"
    echo -e "1. cp .env.example .env.production"
    echo -e "2. Edit and fill all API keys"
    echo -e "3. Read PRODUCTION_DEPLOYMENT_GUIDE.md\n"
    exit 1
fi
echo -e "${GREEN}✓${NC}"

# Load environment
source .env.production

# Check critical variables
echo -ne "Checking wallet configuration... "
if [ -z "$MAIN_WALLET_PRIVATE_KEY" ] || [ "$MAIN_WALLET_PRIVATE_KEY" = "YOUR_PRIVATE_KEY_HERE" ]; then
    echo -e "${RED}✗ NOT CONFIGURED${NC}"
    echo -e "\n${YELLOW}Please configure MAIN_WALLET_PRIVATE_KEY in .env.production${NC}\n"
    exit 1
fi
echo -e "${GREEN}✓${NC}"

echo -ne "Checking RPC endpoints... "
if [ -z "$ETH_RPC_URL" ] || [ "$ETH_RPC_URL" = "https://mainnet.infura.io/v3/YOUR_INFURA_KEY" ]; then
    echo -e "${RED}✗ NOT CONFIGURED${NC}"
    echo -e "\n${YELLOW}Please configure blockchain RPC URLs in .env.production${NC}\n"
    exit 1
fi
echo -e "${GREEN}✓${NC}"

echo -ne "Checking Python... "
python3 --version > /dev/null 2>&1 && echo -e "${GREEN}✓${NC}" || (echo -e "${RED}✗${NC}" && exit 1)

echo -ne "Checking Docker... "
docker --version > /dev/null 2>&1 && echo -e "${GREEN}✓${NC}" || (echo -e "${RED}✗${NC}" && exit 1)

echo -ne "Checking dependencies... "
python3 -c "import web3, colorama, fastapi" 2>/dev/null && echo -e "${GREEN}✓${NC}" || (echo -e "${YELLOW}Installing...${NC}" && pip3 install -q web3 colorama fastapi && echo -e "${GREEN}✓${NC}")

echo ""

# Display configuration
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}CONFIGURATION${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Mode:${NC} ${RED}PRODUCTION REAL${NC}"
echo -e "${YELLOW}Environment:${NC} $NODE_ENV"
echo -e "${YELLOW}Wallet:${NC} ${MAIN_WALLET_ADDRESS:-Not set}"
echo -e "${YELLOW}Auto-Trading:${NC} ${ENABLE_AUTO_TRADING:-false}"
echo -e "${YELLOW}Manual Approval:${NC} ${REQUIRE_MANUAL_APPROVAL:-true}"
echo ""

# Display systems
echo -e "${YELLOW}Systems Enabled (27):${NC}\n"

systems=(
    "💎 Zero Capital" "$ENABLE_ZERO_CAPITAL"
    "🚀 Production Trading" "$ENABLE_PRODUCTION_TRADING"
    "🌾 Yield Farming" "$ENABLE_YIELD_FARMING"
    "🎨 NFT Arbitrage" "$ENABLE_NFT_ARBITRAGE"
    "👥 Copy Trading" "$ENABLE_COPY_TRADING"
    "🧠 ML Predictions" "$ENABLE_ML_PREDICTIONS"
    "🐋 Whale Tracking" "$ENABLE_WHALE_TRACKING"
    "💹 Market Making" "$ENABLE_MARKET_MAKING"
    "🚀 Multi-Account" "$ENABLE_MULTI_ACCOUNT"
)

for ((i=0; i<${#systems[@]}; i+=2)); do
    name="${systems[$i]}"
    enabled="${systems[$i+1]}"
    
    if [ "$enabled" = "true" ]; then
        echo -e "  ${GREEN}✓${NC} $name"
    else
        echo -e "  ${RED}✗${NC} $name ${YELLOW}(disabled)${NC}"
    fi
done

echo ""

# Risk parameters
echo -e "${YELLOW}Risk Management:${NC}\n"
echo -e "  Max Position Size:     \$${MAX_POSITION_SIZE_USD:-10000}"
echo -e "  Max Position %:        ${MAX_POSITION_SIZE_PERCENT:-5}%"
echo -e "  Stop Loss:             ${DEFAULT_STOP_LOSS_PERCENT:-2}%"
echo -e "  Max Daily Loss:        ${MAX_DAILY_LOSS_PERCENT:-5}%"
echo -e "  Max Trades/Day:        ${MAX_TRADES_PER_DAY:-100}"
echo ""

# Capital warning
echo -e "${RED}${WHITE}${BOLD}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${RED}${WHITE}${BOLD}CAPITAL AT RISK WARNING${NC}"
echo -e "${RED}${WHITE}${BOLD}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Check your wallet balance before proceeding.${NC}"
echo -e "${YELLOW}Ensure you have:${NC}"
echo -e "  1. Funded your hot wallet (5-10% of total capital)"
echo -e "  2. Setup cold storage for bulk funds (60-75%)"
echo -e "  3. Configured multi-sig for warm wallet (20-30%)"
echo -e "  4. Enabled 2FA on all exchanges"
echo -e "  5. Setup monitoring & alerts"
echo -e "  6. Read and understood PRODUCTION_DEPLOYMENT_GUIDE.md"
echo ""

# Confirmation
echo -e "${RED}${WHITE}${BOLD}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${RED}${WHITE}${BOLD}FINAL CONFIRMATION${NC}"
echo -e "${RED}${WHITE}${BOLD}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${RED}I understand that:${NC}"
echo -e "  ✓ This is PRODUCTION mode with REAL MONEY"
echo -e "  ✓ Capital loss is possible"
echo -e "  ✓ No profit is guaranteed"
echo -e "  ✓ I am responsible for all trades"
echo -e "  ✓ I have read the documentation"
echo -e "  ✓ I have tested with small capital first"
echo -e "  ✓ I have proper risk management in place"
echo ""

echo -e "${WHITE}${BOLD}To proceed, type: ${RED}'I ACCEPT THE RISKS'${NC}"
echo -ne "${WHITE}${BOLD}Confirmation: ${NC}"
read -r confirm

if [ "$confirm" != "I ACCEPT THE RISKS" ]; then
    echo -e "\n${YELLOW}❌ Launch cancelled${NC}\n"
    echo -e "${CYAN}To learn more, read:${NC}"
    echo -e "  • PRODUCTION_DEPLOYMENT_GUIDE.md"
    echo -e "  • ULTRA_DIVINE_INFINITE_FINAL.md"
    echo ""
    exit 0
fi

# Launch mode selection
echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}LAUNCH MODE SELECTION${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Select launch mode:${NC}\n"
echo -e "  ${GREEN}1)${NC} Docker Compose (Recommended)"
echo -e "  ${GREEN}2)${NC} Standalone Python Scripts"
echo -e "  ${GREEN}3)${NC} Kubernetes (Advanced)"
echo -e "  ${GREEN}4)${NC} Test Mode (Simulated trading)"
echo ""
echo -ne "${WHITE}${BOLD}Select (1-4): ${NC}"
read -r mode

case $mode in
    1)
        LAUNCH_MODE="docker"
        ;;
    2)
        LAUNCH_MODE="standalone"
        ;;
    3)
        LAUNCH_MODE="kubernetes"
        ;;
    4)
        LAUNCH_MODE="test"
        echo -e "\n${YELLOW}Switching to TEST mode (no real money)${NC}"
        export ENABLE_AUTO_TRADING=false
        export TESTNET=true
        ;;
    *)
        echo -e "\n${RED}Invalid selection${NC}\n"
        exit 1
        ;;
esac

# Launch
echo -e "\n${GREEN}${WHITE}${BOLD}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${WHITE}${BOLD}🚀 LAUNCHING THESORIA PRODUCTION${NC}"
echo -e "${GREEN}${WHITE}${BOLD}═══════════════════════════════════════════════════════════════════${NC}\n"

mkdir -p logs backups reports dashboards

if [ "$LAUNCH_MODE" = "docker" ]; then
    echo -e "${CYAN}Starting Docker Compose...${NC}\n"
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        echo -e "${YELLOW}docker-compose.prod.yml not found${NC}"
        echo -e "${YELLOW}Using docker-compose.yml instead${NC}\n"
        docker-compose up -d
    else
        docker-compose -f docker-compose.prod.yml up -d
    fi
    
    echo -e "\n${GREEN}✓ Docker containers started${NC}\n"
    
    echo -e "${CYAN}Container status:${NC}\n"
    docker-compose ps
    
elif [ "$LAUNCH_MODE" = "standalone" ]; then
    echo -e "${CYAN}Starting standalone services...${NC}\n"
    
    # Start services in background
    services=(
        "production_trader.py"
        "ml_prediction_engine.py"
        "whale_tracking_system.py"
        "market_making_bot.py"
        "ai_portfolio_manager.py"
    )
    
    for service in "${services[@]}"; do
        if [ -f "backend/$service" ]; then
            echo -e "  ${YELLOW}Starting $service${NC}"
            cd backend
            nohup python3 "$service" > "../logs/${service%.py}.log" 2>&1 &
            echo $! > "../logs/${service%.py}.pid"
            cd ..
            echo -e "    ${GREEN}✓ Started (PID: $(cat logs/${service%.py}.pid))${NC}"
        fi
    done
    
    echo -e "\n${GREEN}✓ Services started${NC}\n"
    
elif [ "$LAUNCH_MODE" = "kubernetes" ]; then
    echo -e "${CYAN}Deploying to Kubernetes...${NC}\n"
    
    if [ ! -d "kubernetes" ]; then
        echo -e "${RED}kubernetes/ directory not found${NC}"
        exit 1
    fi
    
    kubectl apply -f kubernetes/
    
    echo -e "\n${GREEN}✓ Kubernetes deployment complete${NC}\n"
    kubectl get pods
    
fi

# Display info
echo -e "\n${GREEN}${WHITE}${BOLD}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${WHITE}${BOLD}✓ THESORIA PRODUCTION IS LIVE${NC}"
echo -e "${GREEN}${WHITE}${BOLD}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Access Points:${NC}\n"
echo -e "  Dashboard:    http://localhost:3000"
echo -e "  API:          http://localhost:8000"
echo -e "  Monitoring:   http://localhost:3001 (Grafana)"
echo -e "  Metrics:      http://localhost:9090 (Prometheus)"
echo ""

echo -e "${YELLOW}Logs:${NC}\n"
echo -e "  tail -f logs/production_trader.log"
echo -e "  tail -f logs/ml_prediction_engine.log"
echo -e "  tail -f logs/whale_tracking_system.log"
echo -e "  tail -f logs/market_making_bot.log"
echo ""

echo -e "${YELLOW}Monitoring:${NC}\n"
echo -e "  Watch wallet balance:"
echo -e "    watch -n 10 'curl -s http://localhost:8000/api/wallet/balance'"
echo ""
echo -e "  Watch P&L:"
echo -e "    watch -n 10 'curl -s http://localhost:8000/api/trading/pnl'"
echo ""

if [ "$LAUNCH_MODE" = "docker" ]; then
    echo -e "${YELLOW}Stop all:${NC}"
    echo -e "  docker-compose -f docker-compose.prod.yml down"
elif [ "$LAUNCH_MODE" = "standalone" ]; then
    echo -e "${YELLOW}Stop all:${NC}"
    echo -e "  kill \$(cat logs/*.pid)"
fi

echo ""

echo -e "${RED}${WHITE}${BOLD}⚠️  IMPORTANT REMINDERS ⚠️${NC}\n"
echo -e "${YELLOW}1. Monitor your systems 24/7${NC}"
echo -e "${YELLOW}2. Check wallet balances regularly${NC}"
echo -e "${YELLOW}3. Set up alerts (email/Telegram)${NC}"
echo -e "${YELLOW}4. Review trades daily${NC}"
echo -e "${YELLOW}5. Adjust risk parameters as needed${NC}"
echo -e "${YELLOW}6. Keep backups updated${NC}"
echo -e "${YELLOW}7. Stay informed about market conditions${NC}"
echo ""

echo -e "${GREEN}${WHITE}${BOLD}Good luck! May your trades be profitable! 🚀💰${NC}\n"

# Keep running
if [ "$LAUNCH_MODE" = "standalone" ]; then
    echo -e "${CYAN}Press Ctrl+C to stop all services${NC}\n"
    
    # Trap Ctrl+C
    trap 'echo -e "\n${YELLOW}Stopping services...${NC}"; kill $(cat logs/*.pid) 2>/dev/null; echo -e "${GREEN}✓ All stopped${NC}\n"; exit' INT
    
    # Wait
    while true; do
        sleep 1
    done
fi
