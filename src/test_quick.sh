#!/bin/bash

###############################################################################
#                   🚀 TEST ULTRA-RAPIDE (10 SECONDES)                       #
###############################################################################

clear

echo "🧪 Test Ultra-Rapide THESORIA"
echo "════════════════════════════════════════════════════════════"
echo ""

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 requis!"
    exit 1
fi

# Test configuration
echo "🔍 Test configuration..."
if [ -f "backend/.env" ]; then
    echo "✅ Fichier .env trouvé"
else
    echo "❌ backend/.env manquant!"
    exit 1
fi

# Test connexion RPC
echo ""
echo "🌐 Test connexion blockchain..."

cd backend
python3 << 'EOF'
import os
import sys
from dotenv import load_dotenv

try:
    from web3 import Web3
    load_dotenv()
    
    rpc_url = os.getenv("ETH_RPC_URL")
    if not rpc_url:
        print("❌ ETH_RPC_URL non configurée!")
        sys.exit(1)
    
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if w3.is_connected():
        block = w3.eth.block_number
        gas_gwei = w3.from_wei(w3.eth.gas_price, 'gwei')
        print(f"✅ Connecté - Bloc #{block:,} - Gas {gas_gwei:.1f} gwei")
        
        # Test wallet si configuré
        wallet = os.getenv("WALLET_ADDRESS")
        if wallet and wallet != "0x" and len(wallet) == 42:
            try:
                balance = w3.eth.get_balance(wallet)
                balance_eth = w3.from_wei(balance, 'ether')
                print(f"💰 Balance: {balance_eth:.4f} ETH")
            except:
                pass
        
        sys.exit(0)
    else:
        print("❌ Connexion RPC échouée!")
        sys.exit(1)
        
except ImportError as e:
    print(f"❌ Module manquant: {e}")
    print("Installation: pip3 install web3 python-dotenv")
    sys.exit(1)
except Exception as e:
    print(f"❌ Erreur: {e}")
    sys.exit(1)
EOF

EXIT_CODE=$?
cd ..

echo ""
echo "════════════════════════════════════════════════════════════"

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ SYSTÈME OPÉRATIONNEL!"
    echo ""
    echo "Lancer maintenant:"
    echo "  ./🚀_PRODUCTION_LAUNCHER.sh"
    echo ""
else
    echo "❌ Configuration requise"
    echo ""
    echo "Vérifier backend/.env:"
    echo "  - ETH_RPC_URL configurée?"
    echo "  - Connexion internet OK?"
    echo ""
fi

exit $EXIT_CODE
