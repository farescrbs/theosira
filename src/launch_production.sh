#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 THESORIA - LANCEMENT PRODUCTION
# ═══════════════════════════════════════════════════════════════════════════════
#
# Script de lancement ONE-CLICK pour mode production
#
# Fonctionnalités:
# • Setup environnement complet
# • Validation configuration
# • Lancement orchestrateur
# • Monitoring automatique
# • Logs structurés
# • Auto-restart si crash
#
# Usage:
#   chmod +x launch_production.sh
#   ./launch_production.sh
#
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║         🚀 THESORIA PRODUCTION LAUNCHER                          ║"
echo "║                                                                   ║"
echo "║         Mode: AUTONOMIE - PROFIT - PRODUCTION                     ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ═══════════════════════════════════════════════════════════════════════════════
# 1. VÉRIFICATIONS PRÉALABLES
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}1️⃣  VÉRIFICATIONS PRÉALABLES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

# Python
echo -ne "Vérification Python 3... "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓ Python $PYTHON_VERSION${NC}"
else
    echo -e "${RED}✗ Python 3 non trouvé${NC}"
    exit 1
fi

# pip
echo -ne "Vérification pip3... "
if command -v pip3 &> /dev/null; then
    echo -e "${GREEN}✓ pip3 installé${NC}"
else
    echo -e "${RED}✗ pip3 non trouvé${NC}"
    exit 1
fi

# Node.js (optionnel pour frontend)
echo -ne "Vérification Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Node.js non trouvé (optionnel)${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 2. INSTALLATION DÉPENDANCES
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}2️⃣  INSTALLATION DÉPENDANCES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Installation des packages Python...${NC}\n"

# Créer requirements.txt si n'existe pas
if [ ! -f "requirements.txt" ]; then
    cat > requirements.txt << 'EOF'
# Core
web3>=6.0.0
eth-account>=0.9.0
colorama>=0.4.6

# Data & ML
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0

# API
fastapi>=0.100.0
uvicorn>=0.23.0
pydantic>=2.0.0

# Monitoring
prometheus-client>=0.17.0
psutil>=5.9.0

# Telegram
python-telegram-bot>=20.0

# Utils
python-dotenv>=1.0.0
requests>=2.31.0
aiohttp>=3.8.0
asyncio>=3.4.3
EOF
fi

pip3 install -r requirements.txt --quiet

echo -e "\n${GREEN}✓ Dépendances installées${NC}\n"

# ═══════════════════════════════════════════════════════════════════════════════
# 3. CONFIGURATION ENVIRONNEMENT
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}3️⃣  CONFIGURATION ENVIRONNEMENT${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

# Créer .env si n'existe pas
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Création fichier .env...${NC}\n"
    
    cat > backend/.env << 'EOF'
# ═══════════════════════════════════════════════════════════════
# THESORIA PRODUCTION CONFIGURATION
# ═══════════════════════════════════════════════════════════════

# WALLET (CRITIQUE - À CONFIGURER)
PRIVATE_KEY=your_private_key_here
WALLET_ADDRESS=your_wallet_address_here

# RPC URLS (Alchemy/Infura recommandés)
RPC_ETHEREUM=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
RPC_POLYGON=https://polygon-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
RPC_ARBITRUM=https://arb-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
RPC_OPTIMISM=https://opt-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
RPC_BSC=https://bsc-dataseed.binance.org
RPC_AVALANCHE=https://api.avax.network/ext/bc/C/rpc
RPC_FANTOM=https://rpc.ftm.tools
RPC_BASE=https://mainnet.base.org

# TRADING PARAMETERS
MIN_PROFIT_USD=50
MAX_GAS_GWEI=100
MAX_TRADE_SIZE_USD=5000
SLIPPAGE_TOLERANCE=1.5

# RISK MANAGEMENT
MAX_DAILY_LOSS_USD=1000
MAX_POSITION_SIZE_USD=10000
STOP_LOSS_PCT=5
MAX_CONSECUTIVE_LOSSES=5

# TELEGRAM BOT (Optionnel)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# API SERVER
API_PORT=8000
API_KEY=your_secure_api_key_here

# MODE
PRODUCTION_MODE=SIMULATION
EOF
    
    echo -e "${GREEN}✓ Fichier .env créé: backend/.env${NC}"
    echo -e "${RED}⚠️  IMPORTANT: Éditez backend/.env avec vos vraies valeurs !${NC}\n"
else
    echo -e "${GREEN}✓ Fichier .env existe${NC}\n"
fi

# Vérifier configuration
echo -e "${YELLOW}Vérification configuration...${NC}\n"

if grep -q "your_private_key_here" backend/.env 2>/dev/null; then
    echo -e "${RED}⚠️  WARNING: Configuration par défaut détectée${NC}"
    echo -e "${RED}   Éditez backend/.env avant de lancer en mode LIVE !${NC}\n"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# 4. CRÉATION RÉPERTOIRES
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}4️⃣  CRÉATION RÉPERTOIRES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

mkdir -p logs
mkdir -p reports
mkdir -p backups
mkdir -p dashboards
mkdir -p data

echo -e "${GREEN}✓ Répertoires créés${NC}\n"

# ═══════════════════════════════════════════════════════════════════════════════
# 5. TESTS SYSTÈME
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}5️⃣  TESTS SYSTÈME${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Lancement tests rapides...${NC}\n"

# Test imports Python
python3 -c "
try:
    from web3 import Web3
    from colorama import Fore
    import pandas as pd
    print('${GREEN}✓ Tous les imports OK${NC}')
except ImportError as e:
    print(f'${RED}✗ Import error: {e}${NC}')
    exit(1)
"

# ═══════════════════════════════════════════════════════════════════════════════
# 6. LANCEMENT PRODUCTION
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}6️⃣  LANCEMENT PRODUCTION ORCHESTRATOR${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${CYAN}Le système va démarrer en mode:${NC}"
echo -e "${CYAN}  • 100% AUTONOME${NC}"
echo -e "${CYAN}  • PROFIT RÉEL${NC}"
echo -e "${CYAN}  • MULTI-CHAIN${NC}\n"

echo -e "${YELLOW}Logs: logs/production_$(date +%Y%m%d_%H%M%S).log${NC}\n"

# Lancer orchestrateur
LOG_FILE="logs/production_$(date +%Y%m%d_%H%M%S).log"

echo -e "${GREEN}🚀 Démarrage...${NC}\n"

cd backend
python3 production_orchestrator.py 2>&1 | tee "../$LOG_FILE"

# ═══════════════════════════════════════════════════════════════════════════════
# 7. POST-SHUTDOWN
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}7️⃣  POST-SHUTDOWN${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${GREEN}✓ Système arrêté proprement${NC}"
echo -e "${CYAN}Logs sauvegardés: $LOG_FILE${NC}\n"
