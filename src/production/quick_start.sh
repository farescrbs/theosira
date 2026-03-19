#!/bin/bash

###############################################################################
# THESORIA - Quick Start Script
# Démarrage rapide en 3 commandes
###############################################################################

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              THESORIA - QUICK START                      ║
║                                                           ║
║              Démarrage en 3 étapes                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# ============================================
# ÉTAPE 1: Configuration
# ============================================

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}ÉTAPE 1/3: Configuration${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ ! -f .env ]; then
    echo -e "${YELLOW}📋 Création .env depuis template...${NC}"
    cp .env.example .env
    
    echo -e "${GREEN}✅ .env créé${NC}\n"
    
    echo -e "${YELLOW}⚠️  IMPORTANT: Configurez les variables suivantes:${NC}"
    echo -e "   1. PRIVATE_KEY (votre clé privée)"
    echo -e "   2. DISCORD_WEBHOOK_URL (pour alertes)"
    echo -e ""
    echo -e "${YELLOW}Ouvrir .env maintenant? (y/n)${NC}"
    read -p "> " open_env
    
    if [ "$open_env" = "y" ]; then
        ${EDITOR:-nano} .env
    else
        echo -e "${YELLOW}⚠️  N'oubliez pas de configurer .env avant de lancer!${NC}"
        echo -e "   Éditez avec: ${GREEN}nano .env${NC}\n"
    fi
else
    echo -e "${GREEN}✅ .env déjà configuré${NC}\n"
fi

# ============================================
# ÉTAPE 2: Test
# ============================================

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}ÉTAPE 2/3: Test APIs${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}Tester les APIs maintenant? (y/n)${NC}"
read -p "> " run_test

if [ "$run_test" = "y" ]; then
    echo -e "${YELLOW}🧪 Lancement tests...${NC}\n"
    
    # Check Python
    if command -v python3 &> /dev/null; then
        python3 test_apis.py
    else
        echo -e "${YELLOW}⚠️  Python3 non trouvé. Tests skippés.${NC}"
    fi
    
    echo -e "\n${GREEN}✅ Tests terminés${NC}\n"
else
    echo -e "${YELLOW}⚠️  Tests skippés${NC}"
    echo -e "   Lancez manuellement: ${GREEN}python3 test_apis.py${NC}\n"
fi

# ============================================
# ÉTAPE 3: Activation
# ============================================

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}ÉTAPE 3/3: Activation${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}Lancer AI Master Agent maintenant? (y/n)${NC}"
read -p "> " run_agent

if [ "$run_agent" = "y" ]; then
    echo -e "${YELLOW}🚀 Préparation activation...${NC}\n"
    
    # Rendre activate.sh exécutable
    chmod +x activate.sh
    
    echo -e "${GREEN}✅ Prêt pour activation${NC}\n"
    
    echo -e "${YELLOW}Mode choisi:${NC}"
    echo -e "   1. ${GREEN}Foreground${NC} (logs visibles, Ctrl+C pour arrêter)"
    echo -e "   2. ${GREEN}Background${NC} (daemon, logs via docker-compose logs)"
    read -p "> " mode_choice
    
    if [ "$mode_choice" = "1" ]; then
        echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${CYAN}🚀 ACTIVATION GRAAL (Foreground)${NC}"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        ./activate.sh
    else
        echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${CYAN}🚀 ACTIVATION GRAAL (Background)${NC}"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        echo -e "${YELLOW}📁 Build & démarrage...${NC}"
        docker-compose build
        docker-compose up -d
        
        sleep 5
        
        echo -e "\n${GREEN}✅ Agent démarré en arrière-plan${NC}\n"
        
        echo -e "${YELLOW}📊 Status:${NC}"
        docker-compose ps
        
        echo -e "\n${YELLOW}📜 Voir logs:${NC}"
        echo -e "   ${GREEN}docker-compose logs -f mev-agent${NC}"
        
        echo -e "\n${YELLOW}📈 Monitoring:${NC}"
        echo -e "   Metrics:    ${GREEN}http://localhost:9000/metrics${NC}"
        echo -e "   Prometheus: ${GREEN}http://localhost:9090${NC}"
        echo -e "   Grafana:    ${GREEN}http://localhost:3000${NC}"
        
        echo -e "\n${YELLOW}🛑 Arrêter:${NC}"
        echo -e "   ${GREEN}docker-compose down${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  Activation manuelle requise${NC}"
    echo -e "   Lancez: ${GREEN}./activate.sh${NC}\n"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ QUICK START TERMINÉ${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${CYAN}📚 Documentation complète: ${GREEN}README.md${NC}"
echo -e "${CYAN}🚀 Activation détaillée: ${GREEN}FINAL_ACTIVATION.md${NC}\n"
