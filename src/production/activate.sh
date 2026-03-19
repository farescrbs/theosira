#!/bin/bash

###############################################################################
# THESORIA - Script d'Activation Finale
# AI Master Agent - Déploiement Production RÉEL
###############################################################################

set -e  # Exit on error

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ████████╗██╗  ██╗███████╗███████╗ ██████╗ ██████╗ ██╗ █████╗ ║
║   ╚══██╔══╝██║  ██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██║██╔══██╗║
║      ██║   ███████║█████╗  ███████╗██║   ██║██████╔╝██║███████║║
║      ██║   ██╔══██║██╔══╝  ╚════██║██║   ██║██╔══██╗██║██╔══██║║
║      ██║   ██║  ██║███████╗███████║╚██████╔╝██║  ██║██║██║  ██║║
║      ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝║
║                                                               ║
║            AI MASTER AGENT - GRAAL ACTIVATION                ║
║                  Mode: AUTONOMIE TOTALE                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}🚀 Activation du Graal Ultime...${NC}\n"

# ============================================
# 1. PRÉ-VÉRIFICATIONS
# ============================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1️⃣  PRÉ-VÉRIFICATIONS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Vérifier .env
echo -e "${YELLOW}📋 Vérification fichier .env...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ Fichier .env non trouvé!${NC}"
    echo -e "${YELLOW}   Création template .env...${NC}"
    
    cat > .env << 'ENVEOF'
# ============================================
# THESORIA - Configuration Production
# ============================================

# BLOCKCHAIN (Choisir UNE option)
# Option 1: IPC (OPTIMAL - latence < 1ms)
#GETH_IPC_PATH=/root/.ethereum/geth.ipc

# Option 2: WebSocket (BON - latence < 20ms)
ETH_WS_URL=wss://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Option 3: HTTP (FALLBACK)
ETH_HTTP_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# ACCOUNT & SECURITY (CRITIQUE!)
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# CONTRACT
FLASHBOT_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS

# FLASHBOTS
FLASHBOTS_RELAY=https://relay.flashbots.net

# CHAIN & MODE
CHAIN=ethereum
MODE=production

# PARAMS (Optionnel)
INITIAL_GAS_PERCENTILE=75
INITIAL_PROFIT_THRESHOLD=100
MAX_CONSECUTIVE_FAILURES=5

# ALERTING
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# GRAFANA
GRAFANA_USER=admin
GRAFANA_PASSWORD=thesoria2024
ENVEOF
    
    echo -e "${RED}❌ Veuillez configurer .env avec vos clés!${NC}"
    echo -e "${YELLOW}   Puis relancez: ./activate.sh${NC}\n"
    exit 1
fi

echo -e "${GREEN}✅ Fichier .env trouvé${NC}\n"

# Charger .env
source .env

# Vérifier variables critiques
echo -e "${YELLOW}🔑 Vérification variables critiques...${NC}"

MISSING_VARS=0

if [ -z "$PRIVATE_KEY" ] || [ "$PRIVATE_KEY" = "0xYOUR_PRIVATE_KEY_HERE" ]; then
    echo -e "${RED}❌ PRIVATE_KEY non configuré${NC}"
    MISSING_VARS=1
fi

if [ -z "$ETH_WS_URL" ] || [[ "$ETH_WS_URL" == *"YOUR_"* ]]; then
    if [ -z "$GETH_IPC_PATH" ]; then
        echo -e "${RED}❌ ETH_WS_URL ou GETH_IPC_PATH requis${NC}"
        MISSING_VARS=1
    fi
fi

if [ -z "$FLASHBOT_CONTRACT_ADDRESS" ] || [ "$FLASHBOT_CONTRACT_ADDRESS" = "0xYOUR_CONTRACT_ADDRESS" ]; then
    echo -e "${YELLOW}⚠️  FLASHBOT_CONTRACT_ADDRESS non configuré${NC}"
    echo -e "${YELLOW}   Mode simulation activé${NC}"
fi

if [ $MISSING_VARS -eq 1 ]; then
    echo -e "\n${RED}❌ Variables manquantes! Configurez .env${NC}\n"
    exit 1
fi

echo -e "${GREEN}✅ Variables configurées${NC}\n"

# Vérifier Docker
echo -e "${YELLOW}🐳 Vérification Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker non installé!${NC}"
    echo -e "${YELLOW}   Installation: https://docs.docker.com/engine/install/${NC}\n"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose non installé!${NC}"
    echo -e "${YELLOW}   Installation: https://docs.docker.com/compose/install/${NC}\n"
    exit 1
fi

echo -e "${GREEN}✅ Docker disponible${NC}"
docker --version
docker-compose --version
echo ""

# Vérifier contrat déployé (si configuré)
if [ ! -z "$FLASHBOT_CONTRACT_ADDRESS" ] && [ "$FLASHBOT_CONTRACT_ADDRESS" != "0xYOUR_CONTRACT_ADDRESS" ]; then
    echo -e "${YELLOW}📜 Vérification contrat déployé...${NC}"
    
    # TODO: Ajouter vérification avec cast
    # cast call --rpc-url $ETH_HTTP_URL $FLASHBOT_CONTRACT_ADDRESS "owner()(address)"
    
    echo -e "${GREEN}✅ Contrat configuré: ${FLASHBOT_CONTRACT_ADDRESS}${NC}\n"
fi

# ============================================
# 2. BUILD & DÉMARRAGE
# ============================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2️⃣  BUILD & DÉMARRAGE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Créer répertoires
echo -e "${YELLOW}📁 Création répertoires...${NC}"
mkdir -p logs data monitoring/grafana/{dashboards,datasources}

# Build image
echo -e "${YELLOW}🔨 Build image Docker...${NC}"
docker-compose build

echo -e "${GREEN}✅ Image construite${NC}\n"

# Démarrer stack
echo -e "${YELLOW}🚀 Démarrage stack complète...${NC}"
docker-compose up -d

echo -e "${GREEN}✅ Stack démarrée${NC}\n"

# Attendre démarrage
echo -e "${YELLOW}⏳ Attente démarrage services (10s)...${NC}"
sleep 10

# ============================================
# 3. VÉRIFICATION STATUS
# ============================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3️⃣  VÉRIFICATION STATUS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Status containers
echo -e "${YELLOW}📊 Status containers:${NC}\n"
docker-compose ps

echo ""

# Vérifier health
echo -e "${YELLOW}🏥 Vérification health...${NC}"
sleep 5

AGENT_HEALTHY=$(docker inspect --format='{{.State.Health.Status}}' thesoria-master-agent 2>/dev/null || echo "unknown")

if [ "$AGENT_HEALTHY" = "healthy" ]; then
    echo -e "${GREEN}✅ Agent IA Maître: HEALTHY${NC}"
elif [ "$AGENT_HEALTHY" = "starting" ]; then
    echo -e "${YELLOW}⏳ Agent IA Maître: STARTING...${NC}"
else
    echo -e "${YELLOW}⚠️  Agent IA Maître: $AGENT_HEALTHY${NC}"
fi

echo ""

# Vérifier metrics
echo -e "${YELLOW}📈 Vérification metrics Prometheus...${NC}"
if curl -s http://localhost:9000/metrics > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Metrics disponibles: http://localhost:9000/metrics${NC}"
else
    echo -e "${YELLOW}⏳ Metrics pas encore disponibles (attendre 30s)${NC}"
fi

echo ""

# ============================================
# 4. ACTIVATION CONFIRMÉE
# ============================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}4️⃣  ACTIVATION CONFIRMÉE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║       🤖 AI MASTER AGENT ACTIVÉ - MODE AUTONOME 24/7      ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${CYAN}📊 Services disponibles:${NC}"
echo -e "   ${YELLOW}•${NC} AI Master Agent:  http://localhost:9000/metrics"
echo -e "   ${YELLOW}•${NC} Prometheus:       http://localhost:9090"
echo -e "   ${YELLOW}•${NC} Grafana:          http://localhost:3000 (admin / thesoria2024)"
echo -e "   ${YELLOW}•${NC} Alertmanager:     http://localhost:9093"
echo ""

echo -e "${CYAN}📋 Commandes utiles:${NC}"
echo -e "   ${YELLOW}•${NC} Logs temps réel:  ${GREEN}docker-compose logs -f mev-agent${NC}"
echo -e "   ${YELLOW}•${NC} Status:           ${GREEN}docker-compose ps${NC}"
echo -e "   ${YELLOW}•${NC} Arrêt:            ${GREEN}docker-compose down${NC}"
echo -e "   ${YELLOW}•${NC} Restart:          ${GREEN}docker-compose restart mev-agent${NC}"
echo ""

echo -e "${CYAN}🔍 Monitoring:${NC}"
echo -e "   ${YELLOW}•${NC} Logs agent:       ${GREEN}tail -f logs/master.log${NC}"
echo -e "   ${YELLOW}•${NC} Metrics:          ${GREEN}curl http://localhost:9000/metrics${NC}"
echo ""

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}               LE GRAAL EST ACTIVÉ ! 💎⚡🤖              ${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Afficher logs en temps réel
echo -e "${YELLOW}📜 Logs en temps réel (Ctrl+C pour quitter):${NC}\n"
sleep 2
docker-compose logs -f mev-agent
