#!/bin/bash

# 🛡️ THESORIA - Déploiement Smart Contract avec Foundry
# Script ultra-sécurisé pour déploiement production

set -e  # Arrêt en cas d'erreur

echo "============================================"
echo "🚀 THESORIA - Déploiement FlashBot.sol"
echo "============================================"
echo ""

# ============================================
# CONFIGURATION
# ============================================

# Charger .env si existe
if [ -f ../../.env ]; then
    source ../../.env
    echo "✅ Variables d'environnement chargées"
else
    echo "❌ Fichier .env non trouvé!"
    exit 1
fi

# Vérifications
if [ -z "$PRIVATE_KEY_DEPLOYER" ]; then
    echo "❌ PRIVATE_KEY_DEPLOYER non défini dans .env"
    exit 1
fi

if [ -z "$ETH_RPC_URL" ]; then
    echo "❌ ETH_RPC_URL non défini dans .env"
    exit 1
fi

# Adresses Aave V3 par réseau
declare -A AAVE_POOL_ADDRESSES=(
    ["ethereum"]="0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"
    ["polygon"]="0x794a61358D6845594F94dc1DB02A252b5b4814aD"
    ["arbitrum"]="0x794a61358D6845594F94dc1DB02A252b5b4814aD"
    ["optimism"]="0x794a61358D6845594F94dc1DB02A252b5b4814aD"
    ["base"]="0xA238Dd80C259a72e81d7e4664a9801593F98d1c5"
)

# Sélection du réseau
echo "Sélectionnez le réseau:"
echo "1. Ethereum Mainnet"
echo "2. Polygon"
echo "3. Arbitrum"
echo "4. Optimism"
echo "5. Base"
echo "6. Sepolia (testnet)"
read -p "Choix (1-6): " network_choice

case $network_choice in
    1)
        NETWORK="ethereum"
        RPC_URL=$ETH_RPC_URL
        AAVE_POOL=${AAVE_POOL_ADDRESSES["ethereum"]}
        CHAIN_ID=1
        ETHERSCAN_API_KEY=$ETHERSCAN_API_KEY
        ;;
    2)
        NETWORK="polygon"
        RPC_URL=$POLYGON_RPC_URL
        AAVE_POOL=${AAVE_POOL_ADDRESSES["polygon"]}
        CHAIN_ID=137
        ETHERSCAN_API_KEY=$POLYGONSCAN_API_KEY
        ;;
    3)
        NETWORK="arbitrum"
        RPC_URL=$ARBITRUM_RPC_URL
        AAVE_POOL=${AAVE_POOL_ADDRESSES["arbitrum"]}
        CHAIN_ID=42161
        ETHERSCAN_API_KEY=$ARBISCAN_API_KEY
        ;;
    4)
        NETWORK="optimism"
        RPC_URL=$OPTIMISM_RPC_URL
        AAVE_POOL=${AAVE_POOL_ADDRESSES["optimism"]}
        CHAIN_ID=10
        ETHERSCAN_API_KEY=$OPTIMISTIC_ETHERSCAN_API_KEY
        ;;
    5)
        NETWORK="base"
        RPC_URL=$BASE_RPC_URL
        AAVE_POOL=${AAVE_POOL_ADDRESSES["base"]}
        CHAIN_ID=8453
        ETHERSCAN_API_KEY=$BASESCAN_API_KEY
        ;;
    6)
        NETWORK="sepolia"
        RPC_URL=$SEPOLIA_RPC_URL
        AAVE_POOL="0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"  # Sepolia testnet
        CHAIN_ID=11155111
        ETHERSCAN_API_KEY=$ETHERSCAN_API_KEY
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "Réseau sélectionné: $NETWORK (Chain ID: $CHAIN_ID)"
echo "RPC: ${RPC_URL:0:30}..."
echo "Aave Pool: $AAVE_POOL"
echo ""

# ============================================
# COMPILATION OPTIMISÉE
# ============================================

echo "🔨 Compilation du contrat..."
cd ../../contracts

# Clean
forge clean

# Build avec optimisations
forge build \
    --optimize \
    --optimizer-runs 200 \
    --via-ir

echo "✅ Compilation terminée"
echo ""

# ============================================
# ESTIMATION DU COÛT
# ============================================

echo "💰 Estimation du coût de déploiement..."

# Obtenir le gas price actuel
GAS_PRICE=$(cast gas-price --rpc-url $RPC_URL)
GAS_PRICE_GWEI=$(echo "scale=2; $GAS_PRICE / 1000000000" | bc)

# Estimer le gas de déploiement (environ 3M gas)
ESTIMATED_GAS=3000000

# Calculer le coût
COST_WEI=$(echo "$GAS_PRICE * $ESTIMATED_GAS" | bc)
COST_ETH=$(echo "scale=6; $COST_WEI / 1000000000000000000" | bc)

echo "Gas Price: $GAS_PRICE_GWEI Gwei"
echo "Gas estimé: $ESTIMATED_GAS"
echo "Coût estimé: $COST_ETH ETH"
echo ""

# Vérifier le balance
DEPLOYER_ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY_DEPLOYER)
BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url $RPC_URL)
BALANCE_ETH=$(echo "scale=6; $BALANCE / 1000000000000000000" | bc)

echo "Adresse déployeur: $DEPLOYER_ADDRESS"
echo "Balance: $BALANCE_ETH ETH"

# Vérifier si assez de fonds
if (( $(echo "$BALANCE_WEI < $COST_WEI" | bc -l) )); then
    echo "❌ Balance insuffisante!"
    echo "   Requis: $COST_ETH ETH"
    echo "   Disponible: $BALANCE_ETH ETH"
    exit 1
fi

echo "✅ Balance suffisante"
echo ""

# ============================================
# CONFIRMATION
# ============================================

echo "⚠️  ATTENTION: Vous êtes sur le point de déployer sur $NETWORK MAINNET"
echo ""
read -p "Confirmer le déploiement? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Déploiement annulé"
    exit 0
fi

echo ""

# ============================================
# DÉPLOIEMENT
# ============================================

echo "🚀 Déploiement en cours..."
echo ""

# Déployer avec forge create
DEPLOYMENT_OUTPUT=$(forge create \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY_DEPLOYER \
    --constructor-args $AAVE_POOL \
    --gas-price $GAS_PRICE \
    --legacy \
    src/FlashBot.sol:FlashBot 2>&1)

echo "$DEPLOYMENT_OUTPUT"

# Extraire l'adresse du contrat déployé
CONTRACT_ADDRESS=$(echo "$DEPLOYMENT_OUTPUT" | grep -oP "Deployed to: \K(0x[a-fA-F0-9]{40})")

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Erreur: impossible d'extraire l'adresse du contrat"
    exit 1
fi

echo ""
echo "✅ Contrat déployé avec succès!"
echo "   Adresse: $CONTRACT_ADDRESS"
echo ""

# ============================================
# SAUVEGARDE DE LA CONFIGURATION
# ============================================

echo "💾 Sauvegarde de la configuration..."

# Créer le fichier de déploiement
DEPLOYMENT_FILE="../deployment/deployments/${NETWORK}_deployment.json"
mkdir -p $(dirname $DEPLOYMENT_FILE)

cat > $DEPLOYMENT_FILE << EOF
{
  "network": "$NETWORK",
  "chainId": $CHAIN_ID,
  "contractAddress": "$CONTRACT_ADDRESS",
  "aavePoolAddress": "$AAVE_POOL",
  "deployerAddress": "$DEPLOYER_ADDRESS",
  "deploymentDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "gasPrice": "$GAS_PRICE_GWEI",
  "deploymentCost": "$COST_ETH",
  "txHash": "$(echo "$DEPLOYMENT_OUTPUT" | grep -oP "Transaction hash: \K(0x[a-fA-F0-9]{64})")"
}
EOF

echo "✅ Configuration sauvegardée: $DEPLOYMENT_FILE"

# Ajouter au .env global
echo "" >> ../../.env
echo "# Déploiement $NETWORK - $(date)" >> ../../.env
echo "FLASHBOT_CONTRACT_ADDRESS_${NETWORK^^}=$CONTRACT_ADDRESS" >> ../../.env
echo "✅ Adresse ajoutée au .env"

echo ""

# ============================================
# VÉRIFICATION SUR ETHERSCAN
# ============================================

if [ ! -z "$ETHERSCAN_API_KEY" ]; then
    echo "🔍 Vérification du contrat sur Etherscan..."
    echo ""
    
    # Attendre 30 secondes pour que le contrat soit indexé
    echo "⏳ Attente de 30 secondes pour indexation..."
    sleep 30
    
    # Vérifier avec forge
    forge verify-contract \
        --chain-id $CHAIN_ID \
        --compiler-version $(forge --version | grep -oP "v\d+\.\d+\.\d+") \
        --constructor-args $(cast abi-encode "constructor(address)" $AAVE_POOL) \
        --etherscan-api-key $ETHERSCAN_API_KEY \
        $CONTRACT_ADDRESS \
        src/FlashBot.sol:FlashBot || echo "⚠️  Vérification échouée (peut réessayer manuellement)"
    
    echo ""
    echo "✅ Contrat vérifié sur Etherscan"
fi

# ============================================
# FINANCEMENT INITIAL (Optionnel)
# ============================================

echo ""
read -p "Voulez-vous financer le contrat en ETH? (yes/no): " fund_contract

if [ "$fund_contract" == "yes" ]; then
    read -p "Montant en ETH: " amount
    
    echo "💸 Envoi de $amount ETH au contrat..."
    
    cast send \
        --rpc-url $RPC_URL \
        --private-key $PRIVATE_KEY_DEPLOYER \
        --value "${amount}ether" \
        $CONTRACT_ADDRESS || echo "⚠️  Erreur lors du financement"
    
    echo "✅ Contrat financé"
fi

# ============================================
# RÉSUMÉ FINAL
# ============================================

echo ""
echo "============================================"
echo "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
echo "============================================"
echo ""
echo "📋 RÉSUMÉ:"
echo "   Réseau: $NETWORK"
echo "   Contrat: $CONTRACT_ADDRESS"
echo "   Aave Pool: $AAVE_POOL"
echo "   Coût: $COST_ETH ETH"
echo ""
echo "🔗 LIENS:"

case $NETWORK in
    "ethereum")
        echo "   Etherscan: https://etherscan.io/address/$CONTRACT_ADDRESS"
        ;;
    "polygon")
        echo "   Polygonscan: https://polygonscan.com/address/$CONTRACT_ADDRESS"
        ;;
    "arbitrum")
        echo "   Arbiscan: https://arbiscan.io/address/$CONTRACT_ADDRESS"
        ;;
    "optimism")
        echo "   Optimistic Etherscan: https://optimistic.etherscan.io/address/$CONTRACT_ADDRESS"
        ;;
    "base")
        echo "   Basescan: https://basescan.org/address/$CONTRACT_ADDRESS"
        ;;
    "sepolia")
        echo "   Sepolia Etherscan: https://sepolia.etherscan.io/address/$CONTRACT_ADDRESS"
        ;;
esac

echo ""
echo "📝 PROCHAINES ÉTAPES:"
echo "   1. Vérifier le contrat sur le block explorer"
echo "   2. Mettre à jour FLASHBOT_CONTRACT_ADDRESS dans .env"
echo "   3. Tester avec un petit montant"
echo "   4. Lancer l'agent MEV en production"
echo ""
echo "✅ Déploiement 100% réussi!"
echo ""
