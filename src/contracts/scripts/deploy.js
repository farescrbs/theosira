/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 SCRIPT DE DÉPLOIEMENT - THESORIA FLASHBOT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ce script déploie le smart contract FlashBot sur Polygon ou Gnosis Chain
 * 
 * USAGE:
 *   npx hardhat run scripts/deploy.js --network polygon
 *   npx hardhat run scripts/deploy.js --network gnosis
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

// Adresses des Aave V3 Pool Address Provider
const POOL_ADDRESS_PROVIDERS = {
  polygon: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
  gnosis: "0x36616cf17557639614c1cdDb356b1B83fc0B2132",
  mainnet: "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
  arbitrum: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
  optimism: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
  avalanche: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
};

// Chain IDs
const CHAIN_IDS = {
  polygon: 137,
  gnosis: 100,
  mainnet: 1,
  arbitrum: 42161,
  optimism: 10,
  avalanche: 43114,
};

async function main() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("🚀 DÉPLOIEMENT DU FLASHBOT THESORIA");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  // Obtenir le réseau
  const networkName = hre.network.name;
  console.log(`📡 Réseau: ${networkName}`);
  
  // Vérifier que le réseau est supporté
  if (!POOL_ADDRESS_PROVIDERS[networkName]) {
    console.error(`❌ Réseau non supporté: ${networkName}`);
    console.log(`Réseaux supportés: ${Object.keys(POOL_ADDRESS_PROVIDERS).join(', ')}`);
    process.exit(1);
  }
  
  const poolAddressProvider = POOL_ADDRESS_PROVIDERS[networkName];
  console.log(`🏦 Aave Pool Provider: ${poolAddressProvider}`);
  
  // Obtenir le déployeur
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log(`👤 Déployeur: ${deployerAddress}`);
  
  // Vérifier le solde
  const balance = await hre.ethers.provider.getBalance(deployerAddress);
  console.log(`💰 Solde: ${hre.ethers.formatEther(balance)} (token natif)`);
  
  if (balance === 0n) {
    console.error("❌ Solde insuffisant pour déployer");
    process.exit(1);
  }
  
  console.log("\n⏳ Déploiement du contrat FlashBot...\n");
  
  // Déployer le contrat
  const FlashBot = await hre.ethers.getContractFactory("FlashBot");
  const flashBot = await FlashBot.deploy(poolAddressProvider);
  
  await flashBot.waitForDeployment();
  
  const contractAddress = await flashBot.getAddress();
  
  console.log("✅ FlashBot déployé avec succès !");
  console.log(`📍 Adresse du contrat: ${contractAddress}`);
  
  // Sauvegarder les informations de déploiement
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: networkName,
    networkName: networkName.charAt(0).toUpperCase() + networkName.slice(1),
    chainId: CHAIN_IDS[networkName],
    deployedAt: new Date().toISOString(),
    deployedBy: deployerAddress,
    version: "1.0.0",
    isProduction: true,
    aavePoolProvider: poolAddressProvider,
    txHash: flashBot.deploymentTransaction().hash,
  };
  
  // Créer le dossier public/contracts s'il n'existe pas
  const publicDir = path.join(__dirname, '../../public/contracts');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Sauvegarder le fichier deployment.json
  const deploymentPath = path.join(publicDir, 'deployment.json');
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n💾 Informations sauvegardées dans: ${deploymentPath}`);
  
  // Afficher les prochaines étapes
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("✨ DÉPLOIEMENT TERMINÉ !");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  console.log("📋 PROCHAINES ÉTAPES:\n");
  console.log("1. Vérifier le contrat sur l'explorateur:");
  
  if (networkName === 'polygon') {
    console.log(`   https://polygonscan.com/address/${contractAddress}`);
  } else if (networkName === 'gnosis') {
    console.log(`   https://gnosisscan.io/address/${contractAddress}`);
  } else if (networkName === 'mainnet') {
    console.log(`   https://etherscan.io/address/${contractAddress}`);
  }
  
  console.log("\n2. Approvisionner le contrat en gas (optionnel)");
  console.log(`   Envoyer des fonds à: ${contractAddress}`);
  
  console.log("\n3. Lancer THESORIA:");
  console.log(`   npm run dev`);
  
  console.log("\n4. Connecter MetaMask et exécuter des Flash Loans !");
  
  console.log("\n═══════════════════════════════════════════════════════════\n");
  
  // Afficher les informations de vérification
  console.log("🔍 VÉRIFICATION DU CONTRAT (optionnel):\n");
  console.log("Pour vérifier le contrat sur l'explorateur:");
  console.log(`npx hardhat verify --network ${networkName} ${contractAddress} "${poolAddressProvider}"`);
  
  console.log("\n═══════════════════════════════════════════════════════════\n");
}

// Gérer les erreurs
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ ERREUR DE DÉPLOIEMENT:\n");
    console.error(error);
    process.exit(1);
  });
