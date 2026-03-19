#!/bin/bash

###############################################################################
#                                                                             #
#                   🧪 THESORIA - LANCEMENT TESTS                            #
#                                                                             #
###############################################################################

clear

echo "
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    🧪 TESTS FONCTIONNELS THESORIA                         ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Préparation des tests...${NC}"
echo ""

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 non trouvé!${NC}"
    exit 1
fi

# Installer dépendances si nécessaire
echo "📦 Vérification dépendances..."
cd backend
pip3 install -q -r requirements.txt 2>/dev/null || pip3 install -q web3 aiohttp python-dotenv eth-abi colorama
cd ..

echo -e "${GREEN}✓ Dépendances OK${NC}"
echo ""

# Lancer tests
echo -e "${YELLOW}🚀 Lancement tests système...${NC}"
echo ""

python3 test_system.py

EXIT_CODE=$?

echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              ✅ TESTS TERMINÉS AVEC SUCCÈS                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Prochaine étape: Lancer le système${NC}"
    echo -e "  ${GREEN}./🚀_PRODUCTION_LAUNCHER.sh${NC}"
    echo ""
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              ⚠️  TESTS TERMINÉS AVEC ERREURS                  ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Vérifier les erreurs ci-dessus et corriger${NC}"
    echo ""
fi

exit $EXIT_CODE
