/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚙️ CONFIGURATION HARDHAT - THESORIA FLASHBOT
 * ═══════════════════════════════════════════════════════════════════════════
 */

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  
  networks: {
    // ═══════════════════════════════════════════════════════════════════════
    // ETHEREUM MAINNET (ALCHEMY PREMIUM)
    // ═══════════════════════════════════════════════════════════════════════
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/XUbdW3HgRyDHALSbpyjPr",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
      gasPrice: 20000000000, // 20 gwei
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // POLYGON MAINNET (ALCHEMY PREMIUM - RECOMMANDÉ)
    // ═══════════════════════════════════════════════════════════════════════
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/XUbdW3HgRyDHALSbpyjPr",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
      gasPrice: 50000000000, // 50 gwei
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // GNOSIS CHAIN
    // ═══════════════════════════════════════════════════════════════════════
    gnosis: {
      url: process.env.GNOSIS_RPC_URL || "https://rpc.gnosischain.com/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 100,
      gasPrice: 2000000000, // 2 gwei (très bas sur Gnosis)
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // ARBITRUM (ALCHEMY PREMIUM)
    // ═══════════════════════════════════════════════════════════════════════
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "https://arb-mainnet.g.alchemy.com/v2/XUbdW3HgRyDHALSbpyjPr",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 42161,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // OPTIMISM (ALCHEMY PREMIUM)
    // ═══════════════════════════════════════════════════════════════════════
    optimism: {
      url: process.env.OPTIMISM_RPC_URL || "https://opt-mainnet.g.alchemy.com/v2/XUbdW3HgRyDHALSbpyjPr",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 10,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // AVALANCHE
    // ═══════════════════════════════════════════════════════════════════════
    avalanche: {
      url: process.env.AVALANCHE_RPC_URL || "https://api.avax.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 43114,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // LOCALHOST (POUR TESTS)
    // ═══════════════════════════════════════════════════════════════════════
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // HARDHAT NETWORK (POUR TESTS)
    // ═══════════════════════════════════════════════════════════════════════
    hardhat: {
      chainId: 31337,
      forking: {
        // Fork Polygon pour tester localement
        url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com/",
        enabled: process.env.FORKING === "true",
      },
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // ETHERSCAN API KEYS (pour vérification des contrats)
  // ═══════════════════════════════════════════════════════════════════════
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      gnosis: process.env.GNOSISSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
    },
    customChains: [
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io"
        }
      }
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // PATHS
  // ═══════════════════════════════════════════════════════════════════════
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // MOCHA (POUR TESTS)
  // ═══════════════════════════════════════════════════════════════════════
  mocha: {
    timeout: 40000
  }
};