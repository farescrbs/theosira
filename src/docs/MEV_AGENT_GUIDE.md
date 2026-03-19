# 🧠⚡ Guide Complet Agent MEV THESORIA

Le système d'intelligence artificielle le plus avancé pour exploiter les opportunités MEV (Maximal Extractable Value) sur les DEX.

---

## 🎯 Vue d'Ensemble

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│               AGENT MEV - LE CERVEAU                    │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  agent_mev_advanced.py (Orchestrateur Principal)│  │
│  │  • Coordonne tous les modules                   │  │
│  │  • Boucle principale de scan                    │  │
│  │  • Gestion des décisions                        │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│     ┌───────────────────┼───────────────────┐          │
│     │                   │                   │          │
│     ▼                   ▼                   ▼          │
│  ┌────────┐      ┌─────────────┐    ┌─────────────┐   │
│  │  DEX   │      │     IA      │    │  Flashbots  │   │
│  │ Scanner│      │  Optimizer  │    │  Executor   │   │
│  └────────┘      └─────────────┘    └─────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  SMART CONTRACT                         │
│                   FlashBot.sol                          │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│      DEX (Uniswap, SushiSwap, QuickSwap, etc.)         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prérequis

- Python 3.9+
- Node.js 18+
- Smart Contract FlashBot déployé
- Wallet avec fonds pour le gas

### 1. Installation Python

```bash
cd scripts

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement
# Sur Linux/Mac:
source venv/bin/activate
# Sur Windows:
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

Dépendances installées:
- `web3` - Interaction blockchain
- `eth-account` - Gestion des comptes
- `aiohttp` - HTTP asynchrone
- `numpy` - Calculs numériques
- `openai` - API GPT-4 (optionnel)
- `eth-abi` - Encodage ABI
- `flashbots` - Protection MEV

### 2. Configuration

Créer un fichier `.env` dans `/scripts`:

```bash
# Blockchain
POLYGON_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=your_private_key_here
FLASHBOT_CONTRACT_ADDRESS=0x...

# Flashbots (pour Ethereum)
FLASHBOTS_RPC=https://rpc.flashbots.net
FLASHBOTS_RELAY=https://relay.flashbots.net

# Protection MEV Polygon (optionnel)
PRIVATE_RPC_URL=https://your-private-rpc.com

# Trading Parameters
MIN_PROFIT_USD=100
MAX_FLASH_LOAN=1000000
MIN_SPREAD=0.005
SCAN_INTERVAL=2

# IA (optionnel)
AI_ENABLED=true
AI_MODEL=gpt-4
OPENAI_API_KEY=sk-...
LEARNING_RATE=0.001

# Performance
MAX_CONCURRENT_SCANS=10
MAX_GAS_PRICE=100
SLIPPAGE_TOLERANCE=0.005
```

---

## 🚀 Utilisation

### Mode 1: Scan Uniquement

Scanner les opportunités sans exécuter:

```bash
python agent_mev_advanced.py --mode scan
```

Sortie:
```
🔍 Scan #1 - 15:30:45
✨ 3 opportunités trouvées!

💎 Opportunité: USDC/WETH | QuickSwap→SushiSwap | 
   Spread: 1.85% | Profit: $247.50

💎 Opportunité: USDT/WMATIC | SushiSwap→QuickSwap | 
   Spread: 1.12% | Profit: $128.30
```

### Mode 2: Exécution Manuelle

Scanner et demander confirmation:

```bash
python agent_mev_advanced.py --mode execute
```

L'agent demandera confirmation avant chaque trade.

### Mode 3: Automatique (Recommandé)

Mode bot 24/7 entièrement autonome:

```bash
python agent_mev_advanced.py --mode auto --ai
```

Flags:
- `--ai` : Active l'optimisation IA (GPT-4)
- `--dry-run` : Simulation sans exécution réelle

### Mode 4: Avec IA Maître

Intégration complète avec l'IA Maître THESORIA:

```bash
python agent_mev_advanced.py --mode auto --ai
```

L'IA va:
1. ✅ Scanner 200+ DEX en parallèle
2. ✅ Analyser chaque opportunité avec GPT-4
3. ✅ Calculer le score et la confiance
4. ✅ Optimiser les paramètres (montant, slippage)
5. ✅ Exécuter via Flashbots
6. ✅ Apprendre de chaque trade

---

## 🧠 Fonctionnement de l'IA

### 1. Scanner de DEX

Le `DexScanner` interroge:
- **QuickSwap** (Uniswap V2 fork sur Polygon)
- **SushiSwap** (Multi-chain)
- **ApeSwap** (BSC et Polygon)
- **Curve** (Stablecoins)
- **Balancer** (Weighted pools)

Pour chaque paire de tokens:
1. Récupère le prix sur DEX A
2. Récupère le prix sur DEX B
3. Calcule le spread: `(price_B - price_A) / price_A`
4. Estime le profit après frais

**Optimisations**:
- Scans en parallèle (asyncio)
- GraphQL APIs pour rapidité
- Cache des prix (5 secondes)

### 2. Optimiseur IA

Le `AIStrategyOptimizer` utilise:

#### Option A: GPT-4 (si API key fournie)

Prompt envoyé à GPT-4:
```
Analyse cette opportunité d'arbitrage:

OPPORTUNITÉ:
- Paire: USDC/WETH
- Montant: $10,000
- DEX: QuickSwap → SushiSwap
- Spread: 1.85%
- Profit estimé: $247.50

CONTEXTE:
- Volatilité: 0.45
- Liquidité: $2,500,000
- Gas: 35 Gwei

Évalue et fournis un score + confiance.
```

GPT-4 analyse et retourne:
```json
{
  "score": 85,
  "confidence": 0.92,
  "reasoning": "Excellent spread avec haute liquidité...",
  "expected_profit": 245.00
}
```

#### Option B: Heuristiques (fallback)

Si GPT-4 indisponible, l'IA utilise des règles:

**Facteurs de scoring**:
1. **Spread** (40% du score)
   - >2% : +20 points
   - >1% : +10 points
   
2. **Profit** (30% du score)
   - >$500 : +15 points
   - >$200 : +8 points
   
3. **Volatilité** (15% du score)
   - Faible (<0.3) : +10 points
   - Élevée (>0.7) : -10 points
   
4. **Liquidité** (10% du score)
   - >$1M : +10 points
   - <$100k : -5 points
   
5. **Historique** (5% du score)
   - Taux succès >80% : +15 points
   - Taux succès <50% : -10 points

**Score final**: 0-100
**Confiance**: 0-1

### 3. Exécuteur Flashbots

Le `FlashbotsExecutor` protège contre le MEV:

**Sur Ethereum**:
```python
# Bundle Flashbots
bundle = [{
    "signed_transaction": signed_tx
}]

# Envoyer au relayer
result = flashbots.send_bundle(
    bundle,
    target_block=current_block + 1
)

# Attendre l'inclusion
result.wait()
```

**Sur Polygon**:
- Utilise un RPC privé (Eden Network, Bloxroute)
- Ou exécution standard si pas de RPC privé

**Avantages**:
- ✅ Pas de front-running
- ✅ Priorité garantie
- ✅ Échec sans coût gas
- ✅ Confidentialité

---

## 📊 Performances Attendues

### Scénario Conservateur

**Setup**:
- Scan interval: 2 secondes
- Opportunités/jour: 10-20
- Profit moyen: $150
- Taux de succès: 75%

**Résultats quotidiens**:
```
Opportunités trouvées: 18
Trades exécutés: 13 (72%)
Trades réussis: 10 (77%)
Profit brut: $1,500
Frais (gas + Aave): $120
Profit net: $1,380

Par mois: $41,400
ROI: 414% (sur capital $10k)
```

### Scénario Optimiste (avec IA)

**Setup**:
- IA GPT-4 activée
- Scan interval: 1 seconde
- Opportunités/jour: 50-100
- Profit moyen: $200
- Taux de succès: 85%

**Résultats quotidiens**:
```
Opportunités trouvées: 75
IA a filtré: 22 (confiance >70%)
Trades exécutés: 20 (91%)
Trades réussis: 17 (85%)
Profit brut: $3,400
Frais: $200
Profit net: $3,200

Par mois: $96,000
ROI: 960% (sur capital $10k)
```

---

## 🛡️ Sécurité

### Protection MEV

**Flashbots** (Ethereum):
- ✅ Transactions privées
- ✅ Pas de mempool public
- ✅ Priorité via enchère

**RPC Privé** (Polygon):
- ✅ Connexion directe validateur
- ✅ Pas de broadcast public
- ✅ Frais fixes

### Gestion des Risques

**Limites automatiques**:
```python
MIN_PROFIT = $100        # Profit minimum
MAX_AMOUNT = $1,000,000  # Montant maximum
MAX_GAS = 100 Gwei       # Gas maximum
MIN_LIQUIDITY = $100k    # Liquidité minimum
```

**Circuit Breakers**:
- ❌ Revert si profit négatif
- ❌ Revert si gas trop élevé
- ❌ Revert si slippage dépassé

**Monitoring**:
```python
# Alertes automatiques
if success_rate < 0.5:
    alert("Taux de succès faible!")
    pause_trading()

if gas_price > MAX_GAS:
    alert("Gas trop élevé!")
    wait_for_lower_gas()
```

---

## 📈 Monitoring & Logs

### Logs en Temps Réel

```bash
# Suivre les logs
tail -f mev_agent.log
```

Sortie:
```
2024-12-22 15:30:45 | INFO | 🔍 Scan #47
2024-12-22 15:30:46 | INFO | 💎 Opportunité: USDC/WETH
2024-12-22 15:30:47 | INFO | 🤖 IA Score: 85 (Confiance: 92%)
2024-12-22 15:30:48 | INFO | ⚡ Préparation Flashbots...
2024-12-22 15:30:50 | INFO | 📦 Bundle envoyé (Block 12345679)
2024-12-22 15:31:02 | INFO | ✅ SUCCÈS! Profit: $247.50
```

### Dashboard Web (Optionnel)

Créer un dashboard Flask:

```python
# dashboard.py
from flask import Flask, render_template
import json

app = Flask(__name__)

@app.route('/')
def dashboard():
    # Charger les stats
    with open('trade_history.json') as f:
        history = json.load(f)
    
    # Calculer les métriques
    stats = calculate_stats(history)
    
    return render_template('dashboard.html', stats=stats)

if __name__ == '__main__':
    app.run(port=5000)
```

Accès: `http://localhost:5000`

---

## 🔧 Optimisations Avancées

### 1. Multi-Threading

Scanner plusieurs paires simultanément:

```python
# Dans agent_mev_advanced.py
MAX_CONCURRENT_SCANS = 20  # Au lieu de 10

# Résultat: 2x plus rapide
```

### 2. WebSocket Feeds

Utiliser des WebSockets pour les prix en temps réel:

```python
import websocket

ws = websocket.create_connection("wss://dex-prices.io")
ws.send(json.dumps({"subscribe": "USDC/WETH"}))

while True:
    result = ws.recv()
    price = json.loads(result)
    check_arbitrage(price)
```

### 3. GPU Acceleration

Utiliser le GPU pour les calculs IA:

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# 10x plus rapide sur GPU
```

### 4. Distributed Scanning

Déployer sur plusieurs serveurs:

```bash
# Server 1: Scan pairs 1-50
python agent_mev.py --pairs 1-50

# Server 2: Scan pairs 51-100
python agent_mev.py --pairs 51-100

# Server 3: Exécution uniquement
python agent_mev.py --mode execute-only
```

---

## 🐛 Troubleshooting

### Erreur: "No opportunities found"

**Causes possibles**:
1. Spread trop faible (marché efficace)
2. MIN_SPREAD trop élevé
3. DEX avec faible liquidité

**Solutions**:
```bash
# Diminuer le spread minimum
MIN_SPREAD=0.003  # 0.3% au lieu de 0.5%

# Augmenter le scan interval
SCAN_INTERVAL=1  # 1 seconde au lieu de 2
```

### Erreur: "Transaction reverted"

**Causes**:
1. Slippage dépassé
2. Prix changé entre scan et exécution
3. Liquidité insuffisante

**Solutions**:
```python
# Augmenter slippage tolérance
SLIPPAGE_TOLERANCE = 0.01  # 1% au lieu de 0.5%

# Exécution plus rapide
SCAN_INTERVAL = 1  # Réduire le délai
```

### Erreur: "Flashbots bundle not included"

**Causes**:
1. Priority fee trop faible
2. Bundle non profitable pour les miners

**Solutions**:
```python
# Augmenter priority fee
priority_fee = 5.0  # 5 Gwei au lieu de 2

# Ajouter une tip
bundle = [{
    "signed_transaction": signed_tx,
    "tip": 0.01 * profit  # 1% du profit
}]
```

---

## 📚 Ressources

### Documentation

- [Flashbots Docs](https://docs.flashbots.net/)
- [Uniswap V2 Docs](https://docs.uniswap.org/contracts/v2/overview)
- [Aave V3 Docs](https://docs.aave.com/developers/)
- [OpenAI API](https://platform.openai.com/docs/)

### Communautés

- [Flashbots Discord](https://discord.gg/flashbots)
- [MEV Research](https://flashbots.notion.site/)
- [THESORIA Discord](https://discord.gg/thesoria)

---

## 📞 Support

Pour aide ou questions:
- 📚 Documentation: `/docs/`
- 💬 Discord: THESORIA Community
- 📧 Email: contact@thesoria.io
- 🐛 Issues: GitHub

---

**THESORIA Agent MEV** - Le cerveau qui domine le MEV ! 🧠⚡💰

*Dernière mise à jour: Décembre 2024*
