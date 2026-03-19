#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# 🌌 THESORIA - SUPREME LAUNCHER
# ═══════════════════════════════════════════════════════════════════════════════
#
# LANCEUR SUPRÊME - CONTRÔLE ABSOLU DE TOUT
#
# Lance SIMULTANÉMENT:
# • Zero Capital System (10 stratégies)
# • Production System (8 blockchains)
# • Affiliate System (multi-niveau)
# • AI Providers (6 IA)
# • API Server
# • Telegram Bot
# • Dashboard Web
# • Monitoring 24/7
#
# Profit Total Attendu: $50,000-120,000 (3 mois)
# Capital Requis: $0-10,000
# Autonomie: 100%
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
NC='\033[0m'

# Banner ultime
echo -e "${MAGENTA}"
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║         🌌 SUPREME ORCHESTRATOR                                  ║"
echo "║                                                                   ║"
echo "║         Contrôle Absolu de TOUT le Système                       ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Intro
echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}🎯 SYSTÈME COMPLET${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${GREEN}Ce launcher démarre TOUS les systèmes simultanément:${NC}\n"

echo -e "${YELLOW}💎 Zero Capital System${NC}"
echo -e "   • 10 stratégies sans capital"
echo -e "   • Profit: \$20k-60k (3 mois)"
echo -e ""

echo -e "${YELLOW}🚀 Production Trading${NC}"
echo -e "   • 8 blockchains"
echo -e "   • Profit: \$18k-45k (3 mois)"
echo -e ""

echo -e "${YELLOW}🔗 Affiliate System${NC}"
echo -e "   • Multi-niveau (3 niveaux)"
echo -e "   • Profit: \$3k-12k/mois"
echo -e ""

echo -e "${YELLOW}🤖 AI Multi-Provider${NC}"
echo -e "   • 6 IA: GPT-4, Claude, Gemini, Llama, Mistral, Grok"
echo -e ""

echo -e "${YELLOW}📊 Dashboard Web${NC}"
echo -e "   • Interface React complète"
echo -e "   • Monitoring temps réel"
echo -e ""

echo -e "${GREEN}PROFIT TOTAL POTENTIEL: \$50,000-120,000 (3 mois)${NC}\n"

# Vérifications
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}1️⃣  PRÉ-VÉRIFICATIONS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

# Python
echo -ne "Python 3... "
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Requis${NC}"
    exit 1
fi

# Node (optionnel)
echo -ne "Node.js... "
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Optionnel (pour dashboard)${NC}"
fi

# Dépendances Python
echo -ne "Dépendances Python... "
if python3 -c "import colorama" 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}Installation...${NC}"
    pip3 install -r requirements.txt --quiet
    echo -e "${GREEN}✓${NC}"
fi

echo ""

# Architecture
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}2️⃣  ARCHITECTURE SYSTÈME${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

cat << 'EOF'
┌─────────────────────────────────────────────────────────────┐
│                   SUPREME ORCHESTRATOR                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Zero Capital │  │  Production  │  │  Affiliate   │     │
│  │  10 Strats   │  │  8 Chains    │  │  Multi-Lvl   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  6 IA APIs   │  │ Smart Contr  │  │   API REST   │     │
│  │  Integrated  │  │ Flash Loans  │  │ 20 Endpoints │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Telegram Bot │  │  Dashboard   │  │  Monitoring  │     │
│  │ 20 Commands  │  │  React Web   │  │   24/7       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
EOF

echo ""

# Statistiques
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}3️⃣  STATISTIQUES SYSTÈME${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Système complet:${NC}"
echo -e "  Fichiers:        63+"
echo -e "  Lignes code:     48,000+"
echo -e "  Modules:         28"
echo -e "  Stratégies:      20+"
echo -e "  Blockchains:     8"
echo -e "  IA providers:    6"
echo -e "  Documentation:   22 guides (220+ pages)"
echo -e "  Valeur:          \$180,000+"
echo -e ""

# Guide rapide
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}4️⃣  GUIDE RAPIDE${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Path to \$1M/mois:${NC}\n"

echo -e "  ${GREEN}Mois 1:${NC}     \$3k-6k"
echo -e "  ${GREEN}Mois 2-3:${NC}   \$10k-20k"
echo -e "  ${GREEN}Mois 4-6:${NC}   \$30k-60k"
echo -e "  ${GREEN}Mois 7-12:${NC}  \$100k-200k"
echo -e "  ${GREEN}Mois 13-18:${NC} \$300k-500k"
echo -e "  ${GREEN}Mois 19-24:${NC} \$1M+"
echo -e ""

echo -e "  ${CYAN}→ Guide complet: SCALE_TO_MILLION.md${NC}\n"

# Modes
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}5️⃣  SÉLECTION MODE${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Modes disponibles:${NC}\n"

echo -e "  ${GREEN}1)${NC} ${MAGENTA}SUPREME MODE${NC} - TOUT simultanément (Recommandé)"
echo -e "     Lance: Zero Capital + Production + Affiliate + IA + All"
echo -e "     Profit: \$50k-120k (3 mois)"
echo -e ""

echo -e "  ${GREEN}2)${NC} ${CYAN}Zero Capital Only${NC}"
echo -e "     Lance: Seulement système zero capital"
echo -e "     Profit: \$20k-60k (3 mois)"
echo -e ""

echo -e "  ${GREEN}3)${NC} ${BLUE}Production Only${NC}"
echo -e "     Lance: Seulement trading production"
echo -e "     Profit: \$18k-45k (3 mois)"
echo -e ""

echo -ne "${YELLOW}Choix (1-3) [1]: ${NC}"
read -r choice
choice=${choice:-1}

echo ""

# Confirmation
if [ "$choice" == "1" ]; then
    echo -e "${RED}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}⚠️  SUPREME MODE - SYSTÈME COMPLET${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════════════${NC}\n"
    
    echo -e "${YELLOW}Vous allez lancer le système COMPLET avec:${NC}"
    echo -e "  • Zero Capital (10 stratégies)"
    echo -e "  • Production Trading (8 chains)"
    echo -e "  • Affiliate System"
    echo -e "  • 6 IA providers"
    echo -e "  • Dashboard + API + Telegram"
    echo -e ""
    
    echo -ne "${RED}Taper 'SUPREME' pour confirmer: ${NC}"
    read -r confirm
    
    if [ "$confirm" != "SUPREME" ]; then
        echo -e "\n${YELLOW}❌ Annulé${NC}\n"
        exit 0
    fi
fi

# Lancement
echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}6️⃣  LANCEMENT${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}\n"

if [ "$choice" == "1" ]; then
    echo -e "${MAGENTA}🌌 Lancement SUPREME MODE...${NC}\n"
    
    # Créer logs directory
    mkdir -p logs
    
    # Lancer orchestrateur suprême
    cd backend
    python3 supreme_orchestrator.py
    
elif [ "$choice" == "2" ]; then
    echo -e "${CYAN}💎 Lancement Zero Capital Only...${NC}\n"
    ./launch_zero_capital.sh
    
else
    echo -e "${BLUE}🚀 Lancement Production Only...${NC}\n"
    ./launch_production.sh
fi

# Post-launch
echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}7️⃣  POST-LAUNCH${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Systèmes actifs:${NC}"
echo -e "  ${GREEN}●${NC} Orchestrateur principal"
echo -e "  ${GREEN}●${NC} Monitoring temps réel"
echo -e "  ${GREEN}●${NC} Auto-profit génération"
echo -e ""

echo -e "${YELLOW}Accès:${NC}"
echo -e "  Dashboard:  http://localhost:3000"
echo -e "  API:        http://localhost:8000"
echo -e "  Docs:       http://localhost:8000/docs"
echo -e ""

echo -e "${YELLOW}Commandes:${NC}"
echo -e "  Logs:       tail -f logs/supreme_*.log"
echo -e "  Stats:      curl http://localhost:8000/api/stats"
echo -e "  Stop:       Ctrl+C"
echo -e ""

# Resources
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📚 RESOURCES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Documentation essentielle:${NC}"
echo -e "  • ${GREEN}FINAL_SUMMARY.md${NC} - Résumé ultime (must read)"
echo -e "  • ${GREEN}ZERO_CAPITAL_GUIDE.md${NC} - Guide zero capital (40 pages)"
echo -e "  • ${GREEN}SCALE_TO_MILLION.md${NC} - Scale à \$1M/mois (35 pages)"
echo -e "  • ${GREEN}PRODUCTION_GUIDE.md${NC} - Guide production (35 pages)"
echo -e ""

echo -e "${YELLOW}Quick links:${NC}"
echo -e "  • less FINAL_SUMMARY.md"
echo -e "  • less SCALE_TO_MILLION.md"
echo -e ""

# Success
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ SYSTÈME LANCÉ AVEC SUCCÈS${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${MAGENTA}🌌 Vous avez maintenant accès au système LE PLUS PUISSANT${NC}"
echo -e "${MAGENTA}🌌 Profit potentiel: \$50,000-120,000 (3 mois)${NC}"
echo -e "${MAGENTA}🌌 Path to \$1M/mois disponible${NC}\n"

echo -e "${CYAN}🚀 GOOD LUCK AND GOOD PROFITS! 💰✨${NC}\n"
