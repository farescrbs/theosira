# 💎 THESORIA - Smart Contracts

## 📦 **Structure**

```
contracts/
├── ThesoriaFlashLoan.sol              # Main Flash Loan contract
├── FlashLoanReceiverBase.sol          # Base Aave receiver
├── interfaces/
│   ├── IFlashLoanReceiver.sol         # Flash Loan interface
│   ├── IPoolAddressesProvider.sol     # Pool addresses provider
│   └── IPool.sol                      # Aave Pool interface
└── README.md                          # Ce fichier
```

---

## 🚀 **ThesoriaFlashLoan.sol**

### **Description**

Contrat principal pour exécuter des Flash Loans Aave V3 avec logique d'arbitrage automatisée.

### **Fonctionnalités**

✅ **Flash Loans multi-assets**
- Support pour plusieurs tokens simultanément
- Pas de collatéral requis
- Remboursement automatique

✅ **Arbitrage automatisé**
- Logique d'arbitrage personnalisable
- Multi-DEX support
- Calcul de profit automatique

✅ **Sécurité**
- Owner-only controls
- Emergency pause
- Reentrancy protection
- Safe withdrawals

✅ **Stats tracking**
- Total executions
- Total profit
- Success rate

---

## 🛠️ **Installation**

### **1. Prérequis**

```bash
# Node.js 16+
node --version

# Hardhat ou Foundry
npm install --save-dev hardhat
# ou
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### **2. Installer les dépendances**

```bash
npm install @openzeppelin/contracts
```

---

## 📝 **Compilation**

### **Avec Hardhat :**

```bash
# hardhat.config.js
module.exports = {
  solidity: "0.8.10",
  networks: {
    mainnet: {
      url: process.env.ETH_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

# Compiler
npx hardhat compile
```

### **Avec Foundry :**

```bash
# foundry.toml
[profile.default]
src = "contracts"
out = "out"
solc_version = "0.8.10"

# Compiler
forge build
```

---

## 🚀 **Déploiement**

### **1. Obtenir les adresses Aave**

**Mainnet Ethereum:**
```
Pool Addresses Provider: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e
```

**Polygon:**
```
Pool Addresses Provider: 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb
```

**Arbitrum:**
```
Pool Addresses Provider: 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb
```

### **2. Script de déploiement (Hardhat)**

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const POOL_ADDRESSES_PROVIDER = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e"; // Mainnet
  
  const ThesoriaFlashLoan = await hre.ethers.getContractFactory("ThesoriaFlashLoan");
  const flashLoan = await ThesoriaFlashLoan.deploy(POOL_ADDRESSES_PROVIDER);
  
  await flashLoan.deployed();
  
  console.log("✅ ThesoriaFlashLoan deployed to:", flashLoan.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### **3. Script de déploiement (Foundry)**

```bash
forge create \
  --rpc-url $ETH_RPC_URL \
  --private-key $PRIVATE_KEY \
  contracts/ThesoriaFlashLoan.sol:ThesoriaFlashLoan \
  --constructor-args 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e
```

---

## 💡 **Utilisation**

### **1. Exécuter un Flash Loan**

```javascript
const flashLoanContract = await ethers.getContractAt(
  "ThesoriaFlashLoan",
  DEPLOYED_ADDRESS
);

// Assets à emprunter
const assets = [
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
];

// Montants (6 decimals pour USDC)
const amounts = [
  ethers.utils.parseUnits("10000", 6), // 10,000 USDC
];

// Params pour arbitrage (encodés)
const params = ethers.utils.defaultAbiCoder.encode(
  ["address[]", "address[]"],
  [
    ["0x...", "0x..."], // path tokens
    ["0x...", "0x..."]  // DEX addresses
  ]
);

// Exécuter
await flashLoanContract.executeFlashLoan(assets, amounts, params);
```

### **2. Voir les stats**

```javascript
const stats = await flashLoanContract.getStats();
console.log("Total Executions:", stats.executions.toString());
console.log("Total Profit:", ethers.utils.formatEther(stats.profit));
console.log("Success Rate:", (stats.successful / stats.executions * 100).toFixed(2) + "%");
```

### **3. Retirer les profits**

```javascript
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
await flashLoanContract.withdrawProfit(USDC);
```

---

## 🔧 **Personnalisation**

### **Implémenter votre logique d'arbitrage**

Dans `executeOperation()`, remplacez le commentaire `// 🔥 ARBITRAGE LOGIC ICI` :

```solidity
function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata params
) external override returns (bool) {
    // Decode params
    (address[] memory path, address[] memory dexes) = abi.decode(
        params, 
        (address[], address[])
    );
    
    // 1. Approve DEX A
    IERC20(assets[0]).approve(dexes[0], amounts[0]);
    
    // 2. Swap sur DEX A (Uniswap)
    IUniswapRouter(dexes[0]).swapExactTokensForTokens(
        amounts[0],
        0, // min amount out
        path,
        address(this),
        block.timestamp
    );
    
    // 3. Swap sur DEX B (SushiSwap)
    // ...
    
    // 4. Calculer profit
    uint256 balance = IERC20(assets[0]).balanceOf(address(this));
    uint256 amountOwing = amounts[0] + premiums[0];
    
    require(balance >= amountOwing, "Not enough to repay");
    
    // Approve repayment
    IERC20(assets[0]).approve(address(POOL), amountOwing);
    
    return true;
}
```

---

## ⚠️ **Sécurité**

### **Audits recommandés**

Avant de déployer en production :

1. ✅ Audit par Certik / Trail of Bits / OpenZeppelin
2. ✅ Test sur testnet (Goerli, Sepolia)
3. ✅ Test avec petits montants d'abord
4. ✅ Vérifier les approvals tokens
5. ✅ Implémenter circuit breaker

### **Risques**

- **Slippage** : Prix peuvent changer pendant l'exécution
- **Gas** : Coûts élevés peuvent annuler profits
- **MEV** : Bots peuvent frontrun vos transactions
- **Smart contract risk** : Bugs peuvent bloquer fonds

### **Protections**

```solidity
// Vérifier slippage minimum
require(amountOut >= minAmountOut, "Slippage too high");

// Gas limit
require(gasleft() > 100000, "Not enough gas");

// Deadline
require(block.timestamp <= deadline, "Transaction expired");
```

---

## 📊 **Gas Costs**

### **Estimations (Mainnet) :**

| Operation | Gas Cost | @ 30 gwei | @ 100 gwei |
|-----------|----------|-----------|------------|
| Deploy Contract | ~2,000,000 | ~$120 | ~$400 |
| Execute Flash Loan | ~300,000 | ~$18 | ~$60 |
| Withdraw Profit | ~50,000 | ~$3 | ~$10 |

**Note :** Plus votre logique d'arbitrage est complexe, plus le gas sera élevé.

---

## 🧪 **Tests**

### **Hardhat tests :**

```javascript
// test/ThesoriaFlashLoan.test.js
describe("ThesoriaFlashLoan", function () {
  it("Should execute flash loan", async function () {
    // Test logic
  });
  
  it("Should calculate profit correctly", async function () {
    // Test logic
  });
});
```

```bash
npx hardhat test
```

### **Foundry tests :**

```solidity
// test/ThesoriaFlashLoan.t.sol
contract ThesoriaFlashLoanTest is Test {
    function testExecuteFlashLoan() public {
        // Test logic
    }
}
```

```bash
forge test -vvv
```

---

## 📚 **Ressources**

- **Aave V3 Docs :** https://docs.aave.com/developers/
- **Flash Loans Guide :** https://docs.aave.com/developers/guides/flash-loans
- **Aave Contracts :** https://github.com/aave/aave-v3-core
- **OpenZeppelin :** https://docs.openzeppelin.com/

---

## 🆘 **Support**

**Questions ?**
- Discord THESORIA
- Telegram Support
- GitHub Issues

---

## ⚖️ **License**

MIT License - See LICENSE file

---

## ⚠️ **DISCLAIMER**

Ce code est fourni à des fins éducatives. L'utilisation de Flash Loans comporte des risques financiers. 

**UTILISEZ À VOS PROPRES RISQUES.**

- Testez d'abord sur testnet
- Commencez avec de petits montants
- Comprenez complètement le code
- Faites auditer avant production
- Les Flash Loans peuvent causer des pertes

**THESORIA n'est pas responsable des pertes financières.**

---

💎 **THESORIA - Flash Loan God Mode** 💎
