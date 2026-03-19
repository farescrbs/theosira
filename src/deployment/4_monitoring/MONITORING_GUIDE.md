# 📊 THESORIA - Guide de Monitoring Production

**Surveillance 24/7 pour garantir la rentabilité**

---

## 🎯 Architecture de Monitoring

```
┌─────────────────────────────────────────────────────┐
│                 STACK DE MONITORING                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🐍 Agent MEV Python                                │
│  └─ Expose métriques → :8000/metrics               │
│                                                     │
│  📊 Prometheus (Collecte)                           │
│  ├─ Scrape toutes les 5s                           │
│  ├─ Stocke 30 jours                                │
│  └─ Évalue règles d'alerte                         │
│                                                     │
│  📈 Grafana (Visualisation)                         │
│  ├─ Dashboards temps réel                          │
│  ├─ Alertes visuelles                              │
│  └─ Export PDF/images                              │
│                                                     │
│  🚨 Alerting System (Notifications)                 │
│  ├─ Discord webhooks                               │
│  ├─ Telegram bot                                   │
│  └─ Temps réel (< 1s)                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Installation Rapide (10 minutes)

### 1. Setup Prometheus & Grafana

```bash
cd /opt/thesoria/deployment/4_monitoring

# Copier configs
cp prometheus.yml /etc/prometheus/
cp alert_rules.yml /etc/prometheus/

# Redémarrer Prometheus
systemctl restart prometheus

# Vérifier
curl http://localhost:9090/-/healthy
```

**Avec Docker** (plus simple):
```bash
# Déjà inclus dans docker-compose.yml
docker-compose up -d prometheus grafana
```

### 2. Intégrer dans l'Agent MEV

```python
# Dans production/launcher_production.py

from deployment.monitoring.prometheus_metrics import init_metrics
from deployment.monitoring.alerting_system import AlertingSystem

# Au démarrage
metrics = init_metrics(port=8000)
alerting = AlertingSystem()

# Démarrage
await alerting.alert_agent_started(
    chains=['polygon', 'arbitrum'],
    version='1.0.0'
)

# Dans la boucle de trading
metrics.record_profit(
    chain='polygon',
    profit_usd=247.50,
    gas_cost_usd=62.30
)

await alerting.alert_trade_success(
    chain='polygon',
    profit_usd=247.50,
    gas_cost_usd=62.30,
    tx_hash=tx_hash
)
```

### 3. Configurer Discord/Telegram

**Discord**:
```bash
# 1. Créer un webhook Discord
# Server Settings → Integrations → Webhooks → New Webhook

# 2. Copier l'URL du webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/123.../abc...

# 3. Ajouter au .env
echo "DISCORD_WEBHOOK_URL=$DISCORD_WEBHOOK_URL" >> .env
```

**Telegram**:
```bash
# 1. Créer un bot avec @BotFather
# /newbot → Suivre instructions

# 2. Obtenir le token
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# 3. Obtenir votre chat ID
# Envoyer un message au bot puis:
curl https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates

# 4. Extraire chat.id de la réponse
TELEGRAM_CHAT_ID=123456789

# 5. Ajouter au .env
echo "TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN" >> .env
echo "TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID" >> .env
```

### 4. Importer Dashboard Grafana

```bash
# 1. Ouvrir Grafana
open http://localhost:3000

# 2. Login: admin / admin

# 3. Import dashboard
# + → Import → Upload JSON file
# Sélectionner: grafana_dashboard_mev.json

# 4. Configurer datasource
# Data source: Prometheus (http://prometheus:9090)
```

---

## 📊 Métriques Critiques

### 1. Profit Net Cumulé (LA PLUS IMPORTANTE!)

```promql
# Profit net total
sum(mev_profit_total_usd) - sum(mev_gas_paid_total_usd)

# Par chain
sum by (chain) (mev_profit_total_usd) - sum by (chain) (mev_gas_paid_total_usd)

# Profit brut vs net
sum(mev_profit_total_usd)  # Brut
sum(mev_gas_paid_total_usd)  # Gas
```

**Instrumenter dans le code**:
```python
# À chaque trade réussi
metrics.record_profit(
    chain='polygon',
    profit_usd=247.50,    # Profit brut
    gas_cost_usd=62.30    # Coût gas
)

# Calcul automatique du net profit
```

**Dashboard**: Graphique ligne avec 3 séries (brut, gas, net)

### 2. Bundles Flashbots

```promql
# Taux de succès
sum(rate(mev_bundles_success_total[5m])) 
/ 
sum(rate(mev_bundles_sent_total[5m])) 
* 100

# Bundles envoyés/min
rate(mev_bundles_sent_total[1m]) * 60

# Bundles échoués
rate(mev_bundles_failed_total[5m])
```

**Instrumenter**:
```python
# Envoi bundle
metrics.record_bundle_sent('polygon')

# Si succès
metrics.record_bundle_success('polygon')

# Si échec
metrics.record_bundle_failed('polygon')
```

**Alerte**: Si taux < 50% pendant 10 min

### 3. Balance Wallet

```promql
# Balance ETH
mev_wallet_balance_eth

# Balance USD
mev_wallet_balance_usd

# Par chain
mev_wallet_balance_eth{chain="polygon"}
```

**Instrumenter**:
```python
# Toutes les 30 secondes
balance = w3.eth.get_balance(account.address) / 10**18
eth_price = 2000.0  # Fetch depuis oracle

metrics.record_wallet_balance(
    chain='polygon',
    address=account.address,
    balance_eth=balance,
    eth_price_usd=eth_price
)
```

**Alertes**:
- Warning: < 0.5 ETH
- Critical: < 0.1 ETH

### 4. Performance

```promql
# Latence scan (P95)
histogram_quantile(0.95, rate(mev_scan_latency_seconds_bucket[5m]))

# Latence RPC (P95)
histogram_quantile(0.95, rate(mev_rpc_latency_seconds_bucket[5m]))

# Scans par seconde
rate(mev_scan_latency_seconds_count[1m])
```

**Instrumenter**:
```python
import time

# Scan
start = time.time()
opportunities = await scanner.scan_all_dex()
latency = time.time() - start

metrics.record_scan_latency('polygon', latency)
```

### 5. Sécurité

```promql
# Taux d'approbation
sum(rate(mev_security_approved_total[10m])) 
/ 
sum(rate(mev_security_evaluated_total[10m]))

# Rejets par raison
sum by (reason) (mev_security_rejected_total)
```

**Instrumenter**:
```python
# Évaluation sécurité
approved, reason, metrics_data = await security.evaluate_trade(params)

metrics.record_security_evaluation(
    chain='polygon',
    approved=approved,
    rejection_reason=reason if not approved else None
)
```

---

## 🚨 Alertes Configurées

### Critiques (P0) - Notification immédiate

| Alerte | Condition | Action |
|--------|-----------|--------|
| **Balance Critique** | < 0.1 ETH | 🚨 Recharger IMMÉDIATEMENT |
| **Agent Down** | up == 0 | 🛑 Redémarrer |
| **Erreur élevée** | > 10 erreurs/min | 🔍 Vérifier logs |
| **Perte nette** | Profit < -$1000 | 🛑 Arrêt trading |

### Importantes (P1) - Notification sous 5 min

| Alerte | Condition | Action |
|--------|-----------|--------|
| **Balance Basse** | < 0.5 ETH | ⚠️ Préparer recharge |
| **Succès faible** | < 50% bundles | 🔧 Ajuster paramètres |
| **Gas élevé** | > 200 Gwei | ⏸️ Pause temporaire |
| **Latence haute** | P95 > 500ms | 📡 Changer RPC |

### Informatives (P2) - Résumé journalier

| Alerte | Condition | Action |
|--------|-----------|--------|
| **Gros profit** | > $1000/trade | 🎉 Célébrer! |
| **Uptime 24h** | Atteint | 📊 Stats |
| **Résumé jour** | 00:00 UTC | 📧 Email rapport |

---

## 🎨 Dashboards Grafana

### Dashboard Principal: "THESORIA MEV Overview"

**Panels**:

1. **Profit Net Cumulé** (Graphique ligne)
   - Série 1: Profit brut (vert)
   - Série 2: Gas payé (rouge)
   - Série 3: Profit net (bleu épais)

2. **Stats Temps Réel** (Stat)
   - Profit net total
   - Avec sparkline (mini graphique)
   - Couleur selon seuils:
     - Rouge: < 0
     - Jaune: 0-1000
     - Vert: > 1000

3. **Taux Succès Bundles** (Graphique + Alerte)
   - Cible: > 70%
   - Alerte si < 50% pendant 10 min

4. **Balance Wallet** (Gauge)
   - Min: 0, Max: 20 ETH
   - Zones:
     - Rouge: 0-0.5 (Critique)
     - Jaune: 0.5-2 (Attention)
     - Vert: > 2 (OK)

5. **Gas Price** (Stat)
   - Valeur actuelle
   - Couleur selon seuils

6. **Trades Success vs Failed** (Pie chart)
   - Donut chart
   - Avec pourcentages

7. **Algorithme Sécurité** (Bar gauge)
   - Approuvés vs Rejetés
   - LCD display mode

8. **Latence Scan P95** (Graphique)
   - Par chain
   - Ligne horizontale à 100ms (objectif)

9. **Opportunités Détectées** (Graphique)
   - Rate par seconde
   - Par chain

10. **Distribution Profit** (Heatmap)
    - Buckets: $10, $50, $100, $500, $1000+

11. **Erreurs par Type** (Table)
    - Groupé par error_type
    - Total par type

12. **Uptime** (Stat)
    - En secondes → format humain
    - Couleur selon durée

**Variables**:
- `$chain`: Filtre multi-select par chain
- `$interval`: Intervalle de temps (5m, 1h, 1d)

---

## 💻 Exemple d'Intégration Complète

```python
# production/launcher_production.py

from deployment.monitoring.prometheus_metrics import init_metrics, get_metrics
from deployment.monitoring.alerting_system import AlertingSystem
import asyncio
import time

class ProductionLauncher:
    def __init__(self, chains):
        self.chains = chains
        
        # Initialiser monitoring
        self.metrics = init_metrics(port=8000)
        self.alerting = AlertingSystem()
        
        logger.info("📊 Monitoring initialisé")
    
    async def start(self):
        # Alerte démarrage
        await self.alerting.alert_agent_started(
            chains=self.chains,
            version='1.0.0'
        )
        
        # Démarrer boucle monitoring
        asyncio.create_task(self._monitoring_loop())
        
        # Trading loop...
        while self.running:
            await self._scan_and_trade()
    
    async def _scan_and_trade(self):
        # Scan avec timing
        start = time.time()
        opportunities = await self.scanner.scan_all_dex()
        scan_latency = time.time() - start
        
        # Métriques scan
        self.metrics.record_scan_latency('polygon', scan_latency)
        
        for opp in opportunities:
            # Métriques opportunité
            self.metrics.record_opportunity('polygon', f"{opp['dex_buy']}-{opp['dex_sell']}")
            
            # Évaluation sécurité
            approved, reason, sec_metrics = await self.security.evaluate_trade(opp)
            
            self.metrics.record_security_evaluation(
                chain='polygon',
                approved=approved,
                rejection_reason=reason if not approved else None
            )
            
            if not approved:
                continue
            
            # Exécution
            exec_start = time.time()
            
            self.metrics.record_bundle_sent('polygon')
            
            success, tx_hash, exec_metrics = await self.flashbots.execute_bundle(opp)
            
            exec_latency = time.time() - exec_start
            self.metrics.record_execution_latency('polygon', exec_latency)
            
            if success:
                # Succès!
                self.metrics.record_bundle_success('polygon')
                self.metrics.record_trade('polygon', True)
                
                # Profit
                profit = exec_metrics['profit_gross']
                gas_cost = exec_metrics['gas_cost_usd']
                
                self.metrics.record_profit('polygon', profit, gas_cost)
                self.metrics.record_gas_used('polygon', exec_metrics['gas_used'])
                
                # Alerte si profit élevé
                if profit > 1000:
                    await self.alerting.alert_high_profit('polygon', profit, tx_hash)
                else:
                    await self.alerting.alert_trade_success('polygon', profit, gas_cost, tx_hash)
            else:
                # Échec
                self.metrics.record_bundle_failed('polygon')
                self.metrics.record_trade('polygon', False)
    
    async def _monitoring_loop(self):
        """Boucle de monitoring périodique"""
        while self.running:
            await asyncio.sleep(30)
            
            # Balance wallet
            balance = self.w3.eth.get_balance(self.account.address) / 10**18
            self.metrics.record_wallet_balance(
                chain='polygon',
                address=self.account.address,
                balance_eth=balance,
                eth_price_usd=2000.0
            )
            
            # Alertes balance
            if balance < 0.1:
                await self.alerting.alert_balance_critical('polygon', self.account.address, balance)
            elif balance < 0.5:
                await self.alerting.alert_balance_low('polygon', self.account.address, balance)
            
            # Gas price
            gas_price = self.w3.eth.gas_price / 10**9
            self.metrics.record_gas_price('polygon', gas_price)
            
            if gas_price > 200:
                await self.alerting.alert_high_gas_price('polygon', gas_price)
            
            # Uptime
            self.metrics.update_uptime()
```

---

## 📱 Exemples d'Alertes

### Discord

![Discord Alert](https://i.imgur.com/example.png)

```
✅ Trade Réussi sur POLYGON

Un trade profitable a été exécuté avec succès!

• Chain: polygon
• Profit Brut: $247.50
• Coût Gas: $62.30
• Profit Net: $185.20
• TX Hash: 0x1234...abcd

THESORIA MEV Agent - 14:32:15
```

### Telegram

```
✅ *Trade Réussi sur POLYGON*

Un trade profitable a été exécuté avec succès!

• *Chain*: `polygon`
• *Profit Brut*: `$247.50`
• *Coût Gas*: `$62.30`
• *Profit Net*: `$185.20`
• *TX Hash*: `0x1234...abcd`

_THESORIA MEV Agent - 14:32:15_
```

---

## 🎯 Checklist Monitoring

- [ ] Prometheus installé et configuré
- [ ] Grafana installé avec datasource Prometheus
- [ ] Dashboard importé et fonctionnel
- [ ] Alertes configurées dans alert_rules.yml
- [ ] Discord webhook configuré
- [ ] Telegram bot configuré
- [ ] Agent instrumente toutes les métriques
- [ ] Test des alertes réussi
- [ ] Vérification metrics endpoint (:8000/metrics)

---

## 🔍 Debugging

### Vérifier endpoint metrics

```bash
curl http://localhost:8000/metrics | grep mev_

# Devrait afficher:
# mev_profit_total_usd{chain="polygon"} 12345.67
# mev_bundles_sent_total{chain="polygon"} 42
# mev_wallet_balance_eth{chain="polygon",address="0x..."} 5.234
# ...
```

### Vérifier Prometheus scrape

```bash
# Targets
curl http://localhost:9090/api/v1/targets

# Query
curl 'http://localhost:9090/api/v1/query?query=up{job="mev_agent"}'
```

### Tester alertes

```python
# Test manuel
python deployment/4_monitoring/alerting_system.py
```

---

**THESORIA Monitoring** - Surveillance 24/7 pour profit maximum ! 📊⚡💰

*Guide complet - Dernière MAJ: Décembre 2024*
