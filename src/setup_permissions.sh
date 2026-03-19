#!/bin/bash

###############################################################################
#                   🔧 CONFIGURATION PERMISSIONS                             #
###############################################################################

echo "🔧 Configuration permissions des scripts..."
echo ""

# Rendre tous les scripts shell exécutables
chmod +x install.sh
chmod +x run_tests.sh
chmod +x test_quick.sh
chmod +x 🚀_PRODUCTION_LAUNCHER.sh
chmod +x setup_permissions.sh

# Rendre test Python exécutable
chmod +x test_system.py

echo "✅ Permissions configurées!"
echo ""
echo "Scripts prêts:"
echo "  • ./install.sh"
echo "  • ./run_tests.sh"
echo "  • ./test_quick.sh"
echo "  • ./🚀_PRODUCTION_LAUNCHER.sh"
echo ""
echo "Commencer par:"
echo "  ./test_quick.sh"
echo ""
