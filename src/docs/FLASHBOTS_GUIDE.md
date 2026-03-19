# ⚡🛡️ Guide Complet Flashbots - Protection MEV Ultime

Guide complet pour utiliser Flashbots et protéger vos transactions contre le front-running et le MEV.

---

## 🎯 Qu'est-ce que Flashbots ?

### Le Problème: MEV (Maximal Extractable Value)

Sans Flashbots, voici ce qui se passe:

```
1. Tu détectes une opportunité d'arbitrage
   USDC/WETH: Spread 1.5% = $150 profit
   
2. Tu signes ta transaction
   
3. Tu l'envoies au réseau
   ↓
   📢 TRANSACTION DANS LE MEMPOOL PUBLIC
   ↓
   🤖 Bot MEV détecte ta TX
   ↓
   💰 Bot front-run: Il copie ta stratégie avec +10% de gas
   ↓
   ❌ Sa TX passe AVANT la tienne
   ↓
   😭 Ton arbitrage échoue ou profit volé
   ↓
   💸 Tu paies quand même le gas (perte!)
```

**Résultat**: $0 profit, -$50 gas = **PERTE**

### La Solution: Flashbots

Avec Flashbots:

```
1. Tu détectes la même opportunité
   
2. Tu crées un "BUNDLE" privé
   ↓
   🔒 Bundle envoyé DIRECTEMENT aux mineurs
   ↓
   ⛔ PAS DE MEMPOOL PUBLIC
   ↓
   🤖 Les bots MEV ne voient RIEN
   ↓
   ✅ Ton bundle est inclus dans le block
   ↓
   💰 Profit: $150
   ↓
   🎉 SI le bundle échoue → 0 frais de gas!
```

**Résultat**: +$150 profit, protection 100%

---

## 🔧 Installation

### Prérequis

```bash
# Python 3.9+
python --version

# Pip installé
pip --version
```

### Installation de Flashbots

```bash
pip install flashbots
```

### Vérification

```python
python -c "from flashbots import flashbot; print('✅ Flashbots installé!')"
```

---

## 🚀 Utilisation de Base

### 1. Setup Initial

```python
from web3 import Web3
from eth_account import Account
from flashbots import flashbot

# Connexion Web3
w3 = Web3(Web3.HTTPProvider("https://eth.llamarpc.com"))

# Compte de trading (avec fonds)
trading_account = Account.from_key("YOUR_PRIVATE_KEY")

# Compte Flashbots (sans fonds nécessaire!)
# C'est juste pour signer les bundles (réputation)
flashbots_signer = Account.create()

print(f"💼 Compte trading: {trading_account.address}")
print(f"🔐 Flashbots signer: {flashbots_signer.address}")
```

### 2. Initialiser Flashbots

```python
# Injecter Flashbots dans Web3
flashbot(
    w3=w3,
    signature_account=flashbots_signer,
    endpoint_uri="https://relay.flashbots.net"
)

print("✅ Flashbots initialisé!")
```

### 3. Créer une Transaction

```python
# Transaction classique
tx = {
    'from': trading_account.address,
    'to': "0xCONTRAT_FLASHBOT",
    'data': "0x...",  # Appel requestFlashLoan()
    'gas': 500_000,
    'maxFeePerGas': w3.eth.gas_price + Web3.to_wei(2, 'gwei'),
    'maxPriorityFeePerGas': Web3.to_wei(2, 'gwei'),
    'nonce': w3.eth.get_transaction_count(trading_account.address),
    'chainId': 1,  # Ethereum Mainnet
}

# Signer
signed_tx = trading_account.sign_transaction(tx)
```

### 4. Créer le Bundle

```python
# IMPORTANT: Le bundle est une LISTE de transactions signées
bundle = [
    {
        "signed_transaction": signed_tx.rawTransaction
    }
]

print("📦 Bundle créé avec 1 transaction")
```

### 5. Simuler le Bundle (IMPORTANT!)

```python
# TOUJOURS simuler avant d'envoyer!
try:
    simulation = w3.flashbots.simulate(
        bundle,
        block_tag='latest'  # Ou block number
    )
    
    # Vérifier s'il y a une erreur
    if hasattr(simulation, 'error') and simulation.error:
        print(f"❌ Simulation échouée: {simulation.error}")
        # NE PAS ENVOYER!
    else:
        print(f"✅ Simulation OK!")
        
        # Afficher les résultats
        for result in simulation.results:
            print(f"   Gas utilisé: {result.gasUsed:,}")
            print(f"   Paiement mineur: {result.coinbaseDiff / 10**18:.6f} ETH")

except Exception as e:
    print(f"❌ Erreur simulation: {e}")
```

### 6. Envoyer le Bundle

```python
# Block cible = prochain block
target_block = w3.eth.block_number + 1

print(f"🎯 Envoi bundle pour block {target_block}")

# Envoyer
result = w3.flashbots.send_bundle(
    bundle,
    target_block_number=target_block
)

print(f"📤 Bundle envoyé!")
print(f"   Bundle Hash: {result.bundle_hash.hex()}")
```

### 7. Attendre l'Inclusion

```python
# Attendre que le bundle soit inclus (ou échoue)
try:
    result.wait(timeout=15)  # 15 secondes max
    
    # Vérifier si inclus
    if result.receipts():
        receipts = result.receipts()
        tx_hash = receipts[0]['transactionHash'].hex()
        
        print(f"✅ BUNDLE INCLUS!")
        print(f"   TX Hash: {tx_hash}")
    else:
        print(f"⚠️  Bundle non inclus dans le block {target_block}")
        # Retry sur le prochain block

except Exception as e:
    print(f"⚠️  Timeout ou erreur: {e}")
```

---

## 💡 Exemple Complet - Flash Loan via Flashbots

```python
import os
from web3 import Web3
from eth_account import Account
from flashbots import flashbot
from eth_abi import encode

# Configuration
RPC_URL = "https://eth.llamarpc.com"
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = "0xYOUR_FLASHBOT_CONTRACT"

# Setup Web3
w3 = Web3(Web3.HTTPProvider(RPC_URL))
account = Account.from_key(PRIVATE_KEY)
flashbots_signer = Account.create()

# Initialiser Flashbots
flashbot(w3, flashbots_signer)

print(f"✅ Setup complet")
print(f"   Wallet: {account.address}")
print(f"   Block: {w3.eth.block_number}")

# Paramètres du Flash Loan
token_address = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"  # USDC
amount = 10_000 * 10**6  # 10,000 USDC (6 decimals)

# Encoder les paramètres
params = encode(
    ['address', 'address', 'address[]', 'address[]', 'uint256', 'uint8', 'uint8'],
    [
        token_address,  # tokenIn
        "0x...",  # tokenOut
        ["0x...", "0x..."],  # path1
        ["0x...", "0x..."],  # path2
        100 * 10**6,  # minProfit (100 USDC)
        0,  # dex1 (Uniswap)
        1,  # dex2 (Sushiswap)
    ]
)

# Construire la transaction
tx = {
    'from': account.address,
    'to': CONTRACT_ADDRESS,
    'data': "0x..." + params.hex(),  # requestFlashLoan(token, amount, params)
    'gas': 500_000,
    'maxFeePerGas': w3.eth.gas_price + Web3.to_wei(3, 'gwei'),
    'maxPriorityFeePerGas': Web3.to_wei(3, 'gwei'),
    'nonce': w3.eth.get_transaction_count(account.address),
    'chainId': 1,
}

# Signer
signed_tx = account.sign_transaction(tx)

# Bundle
bundle = [{"signed_transaction": signed_tx.rawTransaction}]

# SIMULATION
print("🧪 Simulation...")
simulation = w3.flashbots.simulate(bundle, block_tag='latest')

if simulation.error:
    print(f"❌ STOP! Erreur: {simulation.error}")
    exit(1)

print(f"✅ Simulation OK!")

# ENVOI
target_block = w3.eth.block_number + 1
print(f"📤 Envoi bundle pour block {target_block}...")

result = w3.flashbots.send_bundle(bundle, target_block_number=target_block)

# ATTENTE
print(f"⏳ Attente...")
result.wait(timeout=15)

if result.receipts():
    tx_hash = result.receipts()[0]['transactionHash'].hex()
    print(f"✅ SUCCÈS!")
    print(f"   TX: https://etherscan.io/tx/{tx_hash}")
else:
    print(f"⚠️  Bundle non inclus, retry...")
```

---

## 🎓 Concepts Avancés

### 1. Bundle Multi-Transactions

Envoyer plusieurs transactions atomiquement:

```python
# Transaction 1: Approve
tx1 = {...}
signed_tx1 = account.sign_transaction(tx1)

# Transaction 2: Flash Loan
tx2 = {...}
signed_tx2 = account.sign_transaction(tx2)

# Bundle avec 2 TX
bundle = [
    {"signed_transaction": signed_tx1.rawTransaction},
    {"signed_transaction": signed_tx2.rawTransaction},
]

# Les 2 TX seront exécutées dans le même block
# Si une échoue, les 2 sont annulées
```

### 2. Retry Automatique

Si le bundle n'est pas inclus, retry sur les prochains blocks:

```python
max_retries = 3
current_block = w3.eth.block_number

for i in range(max_retries):
    target_block = current_block + i + 1
    
    print(f"📦 Tentative {i+1}/{max_retries} (block {target_block})")
    
    result = w3.flashbots.send_bundle(bundle, target_block_number=target_block)
    result.wait(timeout=15)
    
    if result.receipts():
        print(f"✅ Inclus au block {target_block}!")
        break
    else:
        print(f"⚠️  Non inclus, retry...")
        time.sleep(12)  # Attendre le prochain block
```

### 3. Priority Fee Dynamique

Ajuster la priority fee selon l'urgence:

```python
def calculate_priority_fee(profit, urgency='normal'):
    """
    Calcule la priority fee optimale
    
    Args:
        profit: Profit estimé en USD
        urgency: 'low', 'normal', 'high', 'critical'
    """
    base_fee = Web3.to_wei(2, 'gwei')
    
    if urgency == 'low':
        return base_fee
    elif urgency == 'high':
        return base_fee * 2
    elif urgency == 'critical':
        # Payer jusqu'à 10% du profit
        max_fee_usd = profit * 0.1
        eth_price = 2000  # USD
        max_fee_eth = max_fee_usd / eth_price
        return Web3.to_wei(max_fee_eth, 'ether')
    else:  # normal
        return base_fee

# Usage
profit = 250  # $250
priority_fee = calculate_priority_fee(profit, urgency='high')

tx['maxPriorityFeePerGas'] = priority_fee
```

### 4. Statistiques et Monitoring

```python
class FlashbotsStats:
    def __init__(self):
        self.bundles_sent = 0
        self.bundles_included = 0
        self.total_profit = 0.0
    
    def record_bundle(self, included: bool, profit: float = 0):
        self.bundles_sent += 1
        if included:
            self.bundles_included += 1
            self.total_profit += profit
    
    def get_success_rate(self):
        if self.bundles_sent == 0:
            return 0.0
        return (self.bundles_included / self.bundles_sent) * 100
    
    def print_stats(self):
        print(f"\n📊 STATISTIQUES FLASHBOTS")
        print(f"   Bundles envoyés: {self.bundles_sent}")
        print(f"   Bundles inclus: {self.bundles_included}")
        print(f"   Taux succès: {self.get_success_rate():.1f}%")
        print(f"   Profit total: ${self.total_profit:.2f}\n")

# Usage
stats = FlashbotsStats()

# Après chaque bundle
stats.record_bundle(included=True, profit=247.50)

# Afficher
stats.print_stats()
```

---

## 🌍 Réseau et Relayers

### Ethereum Mainnet

```python
# Relayer officiel Flashbots
flashbot(
    w3,
    signature_account=signer,
    endpoint_uri="https://relay.flashbots.net"
)
```

### Ethereum Goerli (Testnet)

```python
flashbot(
    w3,
    signature_account=signer,
    endpoint_uri="https://relay-goerli.flashbots.net"
)
```

### Ethereum Sepolia (Testnet)

```python
flashbot(
    w3,
    signature_account=signer,
    endpoint_uri="https://relay-sepolia.flashbots.net"
)
```

### Polygon

⚠️ Flashbots n'est PAS disponible sur Polygon!

Alternatives:
- **RPC Privé**: Connexion directe aux validateurs
- **Eden Network**: Service similaire à Flashbots
- **Bloxroute BDN**: Réseau de distribution blockchain

---

## 💰 Frais et Économie

### Frais Flashbots

| Composant | Coût |
|-----------|------|
| Relayer | GRATUIT ✅ |
| Bundle échoué | GRATUIT ✅ |
| Bundle inclus | Gas standard |
| Priority fee | Variable |

**Avantage**: Si ton bundle échoue, tu ne paies RIEN!

### Calcul ROI

```python
def calculate_flashbots_roi(
    profit_estimated: float,
    gas_used: int,
    gas_price_gwei: float,
    eth_price_usd: float
):
    """
    Calcule le ROI d'un bundle Flashbots
    
    Returns:
        dict avec profit net et ROI
    """
    # Coût gas
    gas_cost_eth = (gas_used * gas_price_gwei * 10**9) / 10**18
    gas_cost_usd = gas_cost_eth * eth_price_usd
    
    # Profit net
    profit_net = profit_estimated - gas_cost_usd
    
    # ROI
    roi = (profit_net / gas_cost_usd) * 100 if gas_cost_usd > 0 else 0
    
    return {
        'profit_gross': profit_estimated,
        'gas_cost': gas_cost_usd,
        'profit_net': profit_net,
        'roi': roi,
        'worthwhile': profit_net > 0,
    }

# Exemple
result = calculate_flashbots_roi(
    profit_estimated=250,  # $250
    gas_used=400_000,
    gas_price_gwei=30,
    eth_price_usd=2000
)

print(f"Profit brut: ${result['profit_gross']}")
print(f"Coût gas: ${result['gas_cost']:.2f}")
print(f"Profit net: ${result['profit_net']:.2f}")
print(f"ROI: {result['roi']:.1f}%")
print(f"Profitable? {'✅ OUI' if result['worthwhile'] else '❌ NON'}")
```

---

## 🛡️ Sécurité

### Best Practices

#### ✅ À FAIRE

1. **TOUJOURS simuler avant d'envoyer**
   ```python
   simulation = w3.flashbots.simulate(bundle, block_tag='latest')
   if simulation.error:
       return  # NE PAS ENVOYER!
   ```

2. **Vérifier le profit net**
   ```python
   if profit_net < MIN_PROFIT_THRESHOLD:
       return  # Pas rentable
   ```

3. **Utiliser des seuils de gas**
   ```python
   max_gas_price = Web3.to_wei(100, 'gwei')
   if w3.eth.gas_price > max_gas_price:
       return  # Gas trop élevé
   ```

4. **Logger toutes les transactions**
   ```python
   logging.info(f"Bundle {bundle_hash} envoyé pour block {target_block}")
   ```

5. **Monitorer le taux de succès**
   ```python
   if success_rate < 50:
       alert("Taux de succès faible!")
   ```

#### ❌ À NE PAS FAIRE

1. **Ne JAMAIS partager votre PRIVATE_KEY**
2. **Ne PAS ignorer les erreurs de simulation**
3. **Ne PAS envoyer sans vérifier le profit**
4. **Ne PAS oublier le timeout sur wait()**
5. **Ne PAS utiliser la même clé pour trading et signature Flashbots** (mais c'est OK en fait)

---

## 📊 Monitoring Avancé

### Dashboard en Temps Réel

```python
import time
from datetime import datetime

class FlashbotsDashboard:
    def __init__(self):
        self.start_time = datetime.now()
        self.stats = FlashbotsStats()
    
    def print_dashboard(self):
        os.system('clear' if os.name == 'posix' else 'cls')
        
        uptime = (datetime.now() - self.start_time).total_seconds() / 3600
        
        print("="*60)
        print("⚡ FLASHBOTS DASHBOARD - THESORIA")
        print("="*60)
        print(f"Uptime: {uptime:.1f}h")
        print(f"Block actuel: {w3.eth.block_number}")
        print(f"Gas price: {w3.eth.gas_price / 10**9:.1f} Gwei")
        print()
        self.stats.print_stats()
        print("="*60)
    
    def run(self, interval=5):
        while True:
            self.print_dashboard()
            time.sleep(interval)

# Usage
dashboard = FlashbotsDashboard()
# dashboard.run()  # Lance le dashboard en boucle
```

---

## 🎯 Cas d'Usage

### 1. Arbitrage DEX

```python
# Détecter opportunité
spread = get_spread('USDC/WETH', 'Uniswap', 'Sushiswap')

if spread > 0.5:  # >0.5%
    # Créer bundle Flash Loan
    bundle = create_arbitrage_bundle(spread)
    
    # Simuler
    if simulate(bundle):
        # Envoyer via Flashbots
        send_flashbots_bundle(bundle)
```

### 2. Liquidation

```python
# Surveiller positions
positions = scan_underwater_positions()

for position in positions:
    if position.health_factor < 1.0:
        # Liquidation profitable
        bundle = create_liquidation_bundle(position)
        send_flashbots_bundle(bundle)
```

### 3. NFT Mint

```python
# Mint NFT compétitif
if nft_drop_starts():
    bundle = create_mint_bundle()
    
    # Priority fee élevée pour être inclus
    bundle['maxPriorityFeePerGas'] = Web3.to_wei(50, 'gwei')
    
    send_flashbots_bundle(bundle)
```

---

## 🚀 Intégration THESORIA

### Dans l'Agent MEV

Le fichier `/scripts/flashbots_integration.py` est déjà prêt!

```python
from flashbots_integration import FlashbotsExecutor

# Utilisation
flashbots = FlashbotsExecutor(w3, account)

# Exécuter Flash Loan
success, tx_hash = await flashbots.execute_flash_loan(
    contract=flashbot_contract,
    params=flash_loan_params,
    max_priority_fee=3.0,  # 3 Gwei
    max_retries=3
)

if success:
    print(f"✅ Profit réalisé!")
    flashbots.print_stats()
```

---

## 📞 Support

- 📚 Documentation officielle: https://docs.flashbots.net/
- 💬 Discord Flashbots: https://discord.gg/flashbots
- 🐛 GitHub: https://github.com/flashbots/web3-flashbots
- 📧 Support THESORIA: contact@thesoria.io

---

**THESORIA Flashbots** - Protection MEV Ultime ⚡🛡️

*Dernière mise à jour: Décembre 2024*
