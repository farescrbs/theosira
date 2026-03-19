const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║  🚀 DÉPLOIEMENT SMART CONTRACT FLASHBOT - THESORIA       ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  const network = hre.network.name;
  console.log(`📡 Réseau: ${network}\n`);

  // ============================================
  // CONFIGURATION RÉSEAU
  // ============================================
  let addressProvider, uniswapRouter, sushiswapRouter, networkConfig;

  if (network === "polygon") {
    // POLYGON MAINNET (PRODUCTION)
    networkConfig = {
      name: "Polygon",
      addressProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb", // Aave V3
      uniswapRouter: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", // QuickSwap (Uniswap fork)
      sushiswapRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506", // SushiSwap
      explorer: "https://polygonscan.com",
    };
  } else if (network === "gnosis") {
    // GNOSIS CHAIN (PRODUCTION - GAS BAS)
    networkConfig = {
      name: "Gnosis",
      addressProvider: "0x36616cf17557639614c1cdDb356b1B83fc0B2132", // Aave V3
      uniswapRouter: "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77", // Honeyswap
      sushiswapRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506", // SushiSwap
      explorer: "https://gnosisscan.io",
    };
  } else if (network === "mumbai") {
    // POLYGON MUMBAI (TESTNET - GRATUIT)
    networkConfig = {
      name: "Polygon Mumbai",
      addressProvider: "0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6", // Aave V3 Testnet
      uniswapRouter: "0x8954AfA98594b838bda56FE4C12a09D7739D179b", // QuickSwap Mumbai
      sushiswapRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
      explorer: "https://mumbai.polygonscan.com",
    };
  } else if (network === "sepolia") {
    // ETHEREUM SEPOLIA (TESTNET)
    networkConfig = {
      name: "Ethereum Sepolia",
      addressProvider: "0x0496275d34753A48320CA58103d5220d394FF77F", // Aave V3 Testnet
      uniswapRouter: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008", // Uniswap V2 Sepolia
      sushiswapRouter: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      explorer: "https://sepolia.etherscan.io",
    };
  } else {
    throw new Error(`❌ Réseau ${network} non supporté. Réseaux disponibles: polygon, gnosis, mumbai, sepolia`);
  }

  console.log("📋 Configuration:");
  console.log(`   Réseau:              ${networkConfig.name}`);
  console.log(`   Aave Pool Provider:  ${networkConfig.addressProvider}`);
  console.log(`   Uniswap Router:      ${networkConfig.uniswapRouter}`);
  console.log(`   SushiSwap Router:    ${networkConfig.sushiswapRouter}\n`);

  // ============================================
  // VÉRIFICATION DU DÉPLOYEUR
  // ============================================
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Déployeur: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceFormatted = hre.ethers.formatEther(balance);
  console.log(`💰 Balance:   ${balanceFormatted} ${network === 'polygon' || network === 'mumbai' ? 'MATIC' : 'ETH'}\n`);

  if (balance === 0n) {
    throw new Error("❌ Balance insuffisante pour déployer!");
  }

  // Estimation du coût de gas
  console.log("⚡ Estimation du coût de déploiement...");
  const gasPrice = await hre.ethers.provider.getFeeData();
  console.log(`   Gas Price: ${hre.ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei")} Gwei`);
  console.log(`   Coût estimé: ~0.05-0.15 ${network === 'polygon' || network === 'mumbai' ? 'MATIC' : 'ETH'}\n`);

  // ============================================
  // DÉPLOIEMENT DU CONTRAT
  // ============================================
  console.log("⏳ Compilation du Smart Contract FlashBot...");
  const FlashBot = await hre.ethers.getContractFactory("FlashBot");
  
  console.log("⏳ Déploiement en cours...");
  const contract = await FlashBot.deploy(
    networkConfig.addressProvider,
    networkConfig.uniswapRouter,
    networkConfig.sushiswapRouter
  );

  console.log("⏳ Attente de la confirmation...");
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║  ✅ DÉPLOIEMENT RÉUSSI!                                  ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`👤 Owner:            ${deployer.address}`);
  console.log(`📡 Réseau:           ${networkConfig.name}`);
  console.log(`🔗 Explorer:         ${networkConfig.explorer}/address/${contractAddress}\n`);

  // ============================================
  // SAUVEGARDE DES INFOS
  // ============================================
  const deploymentInfo = {
    network: network,
    networkName: networkConfig.name,
    contractAddress: contractAddress,
    owner: deployer.address,
    timestamp: new Date().toISOString(),
    addressProvider: networkConfig.addressProvider,
    uniswapRouter: networkConfig.uniswapRouter,
    sushiswapRouter: networkConfig.sushiswapRouter,
    explorerUrl: `${networkConfig.explorer}/address/${contractAddress}`,
    gasPrice: hre.ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei") + " Gwei",
  };

  // Créer le dossier deployments s'il n'existe pas
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Sauvegarder dans contracts/deployments/
  const deploymentPath = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`💾 Infos sauvegardées: ${deploymentPath}`);

  // Sauvegarder AUSSI dans /public/contracts/deployment.json pour le frontend
  const publicDeploymentPath = path.join(__dirname, "..", "..", "public", "contracts", "deployment.json");
  const publicDeploymentsDir = path.dirname(publicDeploymentPath);
  
  if (!fs.existsSync(publicDeploymentsDir)) {
    fs.mkdirSync(publicDeploymentsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    publicDeploymentPath,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`💾 Frontend mis à jour: ${publicDeploymentPath}\n`);

  // ============================================
  // PROCHAINES ÉTAPES
  // ============================================
  console.log("📝 PROCHAINES ÉTAPES:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  console.log("1️⃣  Vérifier le contrat sur l'explorateur:");
  console.log(`   npx hardhat verify --network ${network} ${contractAddress} ${networkConfig.addressProvider} ${networkConfig.uniswapRouter} ${networkConfig.sushiswapRouter}\n`);
  
  console.log("2️⃣  Mettre à jour le fichier .env backend:");
  console.log(`   ARBITRAGE_CONTRACT_ADDRESS=${contractAddress}\n`);
  
  console.log("3️⃣  Connecter MetaMask au contrat:");
  console.log(`   - Ouvrez http://localhost:3000`);
  console.log(`   - Cliquez sur "Connecter MetaMask"`);
  console.log(`   - Le contrat sera chargé automatiquement\n`);
  
  console.log("4️⃣  Tester un Flash Loan (TESTNET SEULEMENT):");
  console.log(`   - Utilisez le dashboard FlashBot`);
  console.log(`   - Sélectionnez un token (USDC recommandé)`);
  console.log(`   - Lancez un Flash Loan de test\n`);
  
  console.log("⚠️  IMPORTANT:");
  console.log("   - Sur MAINNET, commencez avec de PETITS montants");
  console.log("   - Testez d'abord sur Mumbai/Sepolia");
  console.log("   - Surveillez les frais de gas");
  console.log("   - Profit minimum recommandé: 100+ USDC\n");
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // ============================================
  // CONFIGURATION AUTOMATIQUE
  // ============================================
  console.log("🔧 Configuration automatique en cours...\n");

  // Vérifier si le contrat est bien déployé
  try {
    const code = await hre.ethers.provider.getCode(contractAddress);
    if (code === "0x") {
      console.warn("⚠️  ATTENTION: Le contrat ne semble pas déployé correctement!");
    } else {
      console.log("✅ Contrat vérifié on-chain");
      
      // Vérifier l'owner
      const owner = await contract.owner();
      console.log(`✅ Owner configuré: ${owner}`);
      
      if (owner.toLowerCase() === deployer.address.toLowerCase()) {
        console.log("✅ Vous êtes le propriétaire du contrat\n");
      } else {
        console.warn("⚠️  ATTENTION: Vous n'êtes PAS le propriétaire!\n");
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error.message);
  }

  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  🎉 THESORIA FLASHBOT PRÊT POUR LA PRODUCTION!           ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ ERREUR LORS DU DÉPLOIEMENT:\n");
    console.error(error);
    process.exit(1);
  });
