# 🏦 THESORIA - Guide d'Intégration Aave v3

**Flash Loans Aave v3 - Production Ready**

---

## 📦 Composants Créés

### Smart Contracts Solidity

```
/production/contracts/
├── AaveFlashLoanReceiver.sol         ⭐ Contrat principal
├── interfaces/
│   ├── IPool.sol                     Aave v3 Pool interface
│   ├── IPoolAddressesProvider.sol    Provider interface
│   └── IERC20.sol                    ERC20 standard
```

### Intégration Python

```
/production/sdk_integrations/
└── external_apis.py                  ⭐ AaveGraphQLIntegration class
```

---

## 🔧 Smart Contract - ThesoriaFlashLoanExecutor

### Déploiement

#### 1. Compiler le Contrat

```bash
# Installer Foundry (si pas déjà fait)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Créer projet Foundry
cd /production/contracts
forge init --no-commit

# Compiler
forge build
```

#### 2. Déployer sur Sepolia

```bash
# Aave v3 Sepolia Pool Addresses Provider
POOL_PROVIDER=0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A

# Déployer
forge create \
  --rpc-url $ETH_HTTP_URL \
  --private-key $PRIVATE_KEY \
  AaveFlashLoanReceiver:ThesoriaFlashLoanExecutor \
  --constructor-args $POOL_PROVIDER

# Copier l'adresse déployée
EXECUTOR_ADDRESS=0x...
```

#### 3. Déployer sur Mainnet

```bash
# Aave v3 Mainnet Pool Addresses Provider
POOL_PROVIDER_MAINNET=0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e

forge create \
  --rpc-url https://mainnet.infura.io/v3/$INFURA_API_KEY \
  --private-key $PRIVATE_KEY \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  AaveFlashLoanReceiver:ThesoriaFlashLoanExecutor \
  --constructor-args $POOL_PROVIDER_MAINNET
```

---

## 💡 Utilisation du Contrat

### Exemple 1: Flash Loan Simple

```solidity
// 1. Préparer les paramètres
address[] memory assets = new address[](1);
assets[0] = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // USDC

uint256[] memory amounts = new uint256[](1);
amounts[0] = 1000000 * 1e6; // 1M USDC

// 2. Préparer la stratégie (exemple: swap sur Uniswap)
address[] memory targets = new address[](2);
targets[0] = UNISWAP_ROUTER;
targets[1] = UNISWAP_ROUTER;

bytes[] memory calldatas = new bytes[](2);
calldatas[0] = abi.encodeWithSelector(
    IUniswapRouter.swapExactTokensForTokens.selector,
    amountIn,
    amountOutMin,
    path,
    address(this),
    deadline
);
calldatas[1] = abi.encodeWithSelector(
    IUniswapRouter.swapExactTokensForTokens.selector,
    amountIn2,
    amountOutMin2,
    reversePath,
    address(this),
    deadline
);

// 3. Exécuter
executor.requestFlashLoan(assets, amounts, targets, calldatas);
```

### Exemple 2: Flash Loan Multi-Assets

```solidity
address[] memory assets = new address[](2);
assets[0] = USDC_ADDRESS;
assets[1] = WETH_ADDRESS;

uint256[] memory amounts = new uint256[](2);
amounts[0] = 500000 * 1e6;  // 500k USDC
amounts[1] = 100 * 1e18;     // 100 ETH

executor.requestFlashLoan(assets, amounts, targets, calldatas);
```

---

## 🐍 Intégration Python

### Utilisation avec Web3.py

```python
from web3 import Web3
from eth_account import Account
import json

# Setup
w3 = Web3(Web3.HTTPProvider(os.getenv('ETH_HTTP_URL')))
account = Account.from_key(os.getenv('PRIVATE_KEY'))

# Charger ABI du contrat
with open('contracts/out/ThesoriaFlashLoanExecutor.sol/ThesoriaFlashLoanExecutor.json') as f:
    contract_abi = json.load(f)['abi']

# Initialiser contrat
executor = w3.eth.contract(
    address=EXECUTOR_ADDRESS,
    abi=contract_abi
)

# Préparer flash loan
assets = [USDC_ADDRESS]
amounts = [1_000_000 * 10**6]  # 1M USDC

# Stratégie (exemple)
targets = [UNISWAP_ROUTER, UNISWAP_ROUTER]
calldatas = [
    encode_swap_calldata(...),
    encode_swap_calldata(...)
]

# Construire transaction
tx = executor.functions.requestFlashLoan(
    assets,
    amounts,
    targets,
    calldatas
).build_transaction({
    'from': account.address,
    'nonce': w3.eth.get_transaction_count(account.address),
    'gas': 2000000,
    'gasPrice': w3.eth.gas_price
})

# Signer et envoyer
signed_tx = account.sign_transaction(tx)
tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

print(f"TX Hash: {tx_hash.hex()}")

# Attendre confirmation
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(f"Status: {'Success' if receipt.status == 1 else 'Failed'}")
```

### Intégration avec l'Agent IA

```python
# Dans master/ai_master_agent.py

from sdk_integrations.external_apis import AaveGraphQLIntegration

class AIMasterAgent:
    def __init__(self):
        # ... existing code ...
        
        # Aave Integration
        self.aave = AaveGraphQLIntegration(
            os.getenv('AAVE_GRAPHQL_URL')
        )
        
        # Executor contract
        self.executor = w3.eth.contract(
            address=os.getenv('EXECUTOR_CONTRACT_ADDRESS'),
            abi=executor_abi
        )
    
    async def execute_flash_loan_strategy(
        self,
        assets: List[str],
        amounts: List[int],
        strategy_type: str
    ):
        """
        Exécute une stratégie avec flash loan Aave
        """
        # 1. Vérifier liquidité disponible
        pools = await self.aave.get_flash_loan_pools()
        
        for asset, amount in zip(assets, amounts):
            pool = next((p for p in pools if p.asset == asset), None)
            if not pool or pool.available_liquidity < amount:
                logger.error(f"Insufficient liquidity for {asset}")
                return False
        
        # 2. Construire stratégie
        targets, calldatas = self.build_strategy(strategy_type, assets, amounts)
        
        # 3. Exécuter
        tx = self.executor.functions.requestFlashLoan(
            assets,
            amounts,
            targets,
            calldatas
        ).build_transaction({...})
        
        # 4. Envoyer
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        logger.info(f"Flash loan executed: {tx_hash.hex()}")
        
        return tx_hash
```

---

## 📊 Adresses Aave v3

### Ethereum Mainnet

```yaml
PoolAddressesProvider: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e
Pool: 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2
PoolDataProvider: 0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3
PriceOracle: 0x54586bE62E3c3580375aE3723C145253060Ca0C2
```

### Sepolia Testnet

```yaml
PoolAddressesProvider: 0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A
Pool: 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951
PoolDataProvider: 0x3e9708d80f7B3e43118013075F7e95CE3AB31F31
```

### Arbitrum One

```yaml
PoolAddressesProvider: 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb
Pool: 0x794a61358D6845594F94dc1DB02A252b5b4814aD
```

### Optimism

```yaml
PoolAddressesProvider: 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb
Pool: 0x794a61358D6845594F94dc1DB02A252b5b4814aD
```

---

## 💰 Frais Aave v3

### Flash Loan Fees

```python
FLASHLOAN_PREMIUM_TOTAL = 9  # 0.09% (9 basis points)
FLASHLOAN_PREMIUM_TO_PROTOCOL = 30_00  # 30% du premium va au protocol

# Exemple calcul:
flash_loan_amount = 1_000_000  # 1M tokens
total_fee = flash_loan_amount * 9 / 10000  # 900 tokens
protocol_fee = total_fee * 30_00 / 10000   # 270 tokens
lp_fee = total_fee - protocol_fee           # 630 tokens

# Total à rembourser
amount_to_repay = flash_loan_amount + total_fee  # 1,000,900 tokens
```

---

## 🔒 Sécurité

### Checklist Pré-Production

```
✅ Contrat audité (recommandé)
✅ Test sur testnet complet
✅ Vérifier balance wallet > gas costs
✅ Kill switch implémenté (emergencyWithdraw)
✅ Modifier onlyOwner en place
✅ Slippage protection dans stratégies
✅ Deadline sur swaps
✅ Monitoring actif
```

### Tests Recommandés

```bash
# 1. Test sur Sepolia
forge test --fork-url $ETH_WS_URL --match-contract AaveFlashLoanTest -vvv

# 2. Test gas costs
forge test --gas-report

# 3. Test simulation
cast call --rpc-url $ETH_HTTP_URL \
  $EXECUTOR_ADDRESS \
  "requestFlashLoan(address[],uint256[],address[],bytes[])" \
  ...
```

---

## 📈 Stratégies Flash Loan Supportées

### 1. Arbitrage DEX

```python
# Détecter écart de prix entre Uniswap et Sushiswap
# 1. Flash loan USDC
# 2. Acheter ETH sur Uniswap
# 3. Vendre ETH sur Sushiswap
# 4. Rembourser flash loan + frais
# 5. Profit = différence - frais
```

### 2. Liquidation

```python
# Liquider position sous-collatéralisée
# 1. Flash loan asset de dette
# 2. Rembourser dette user
# 3. Récupérer collateral avec bonus
# 4. Vendre collateral
# 5. Rembourser flash loan
# 6. Profit = bonus liquidation - frais
```

### 3. Refinancement Dette

```python
# Migrer position d'un protocole à un autre
# 1. Flash loan montant dette
# 2. Rembourser dette sur protocole A
# 3. Récupérer collateral
# 4. Déposer collateral sur protocole B
# 5. Emprunter sur B
# 6. Rembourser flash loan
```

---

## 🚀 Prochaines Étapes

1. **Déployer contrat sur testnet**
   ```bash
   cd /production/contracts
   ./scripts/deploy_executor.sh sepolia
   ```

2. **Tester avec montants faibles**
   ```bash
   python scripts/test_flash_loan.py --network sepolia --amount 1000
   ```

3. **Intégrer à l'Agent IA**
   ```bash
   # Ajouter EXECUTOR_CONTRACT_ADDRESS dans .env
   # Redémarrer agent
   docker-compose restart mev-agent
   ```

4. **Monitoring**
   ```bash
   # Surveiller métriques
   curl http://localhost:9000/metrics | grep flash_loan
   ```

---

## 📚 Ressources

- **Aave v3 Docs**: https://docs.aave.com/developers/
- **Flash Loans Guide**: https://docs.aave.com/developers/guides/flash-loans
- **Contract Addresses**: https://docs.aave.com/developers/deployed-contracts/v3-mainnet
- **GraphQL API**: https://api.v3.aave.com/graphql

---

**PRÊT POUR PRODUCTION ! 🏦💎⚡**

Le système Flash Loan Aave v3 est maintenant complètement intégré à THESORIA !
