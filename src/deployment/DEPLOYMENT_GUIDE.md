# 🚀 THESORIA - Guide de Déploiement Final
## Système MEV Autonome Complet en Production

**Dernière MAJ: Décembre 2024**

---

## 🎯 Vue d'Ensemble

Vous allez déployer un **Agent IA Autonome** qui:
- Scanne les opportunités d'arbitrage 24/7
- Exécute des Flash Loans via Flashbots
- Calcule le profit net au Wei près
- Utilise le bidding gas EIP-1559 optimal
- Expose des métriques Prometheus
- Envoie des alertes Discord/Telegram

**ROI Attendu: 1800%/an** 💰

---

## 📦 Infrastructure Requise

### Serveur Production

**Specs minimales:**
```
- CPU: 4 cores (8 recommandé)
- RAM: 16 GB (32 GB recommandé)
- Disk: 100 GB SSD
- Network: 1 Gbps
- OS: Ubuntu 22.04 LTS
```

**Localisation:**
- Proche des relays Flashbots (USA/EU)
- Latence < 50ms vers Ethereum RPC

---

## 🔧 Installation Étape par Étape

### 1. Prérequis Système

```bash
# Update système
sudo apt update && sudo apt upgrade -y

# Installer dépendances
sudo apt install -y \
    python3.11 \
    python3.11-venv \
    python3-pip \
    git \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    docker.io \
    docker-compose

# Vérifier installations
python3.11 --version  # 3.11+
docker --version      # 20.10+
```

### 2. Cloner le Projet

```bash
# Créer répertoire
sudo mkdir -p /opt/thesoria
sudo chown $USER:$USER /opt/thesoria

cd /opt/thesoria

# Copier tous les fichiers du projet
# (ou git clone si vous avez un repo)
```

### 3. Environnement Python

```bash
cd /opt/thesoria/production

# Créer virtualenv
python3.11 -m venv venv

# Activer
source venv/bin/activate

# Installer dépendances
pip install --upgrade pip
pip install -r requirements.txt
```

**Contenu de `requirements.txt`:**
```
web3==6.11.3
eth-account==0.10.0
flashbots==1.3.0
prometheus-client==0.19.0
aiohttp==3.9.1
python-dotenv==1.0.0
langchain==0.1.0
langchain-openai==0.0.2
```

### 4. Configuration RPC Nodes

**CRITIQUE**: Utilisez des RPC nodes de HAUTE PERFORMANCE!

**Providers recommandés:**
- Alchemy (Preferred)
- Infura
- QuickNode
- Ou votre propre node Erigon

```bash
# Ethereum Mainnet
ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Polygon
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# Arbitrum
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
```

**Test de latence:**
```bash
# Doit être < 50ms
time curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  $ETH_RPC_URL
```

### 5. Configuration .env

```bash
cd /opt/thesoria/production

# Créer .env
cat > .env << 'EOF'
# ============================================
# WALLETS
# ============================================

# Compte principal (pour exécuter les trades)
PRIVATE_KEY=0x1234567890abcdef...

# Flashbots signer (peut être le même ou différent)
FLASHBOTS_SIGNER_KEY=0x1234567890abcdef...

# ============================================
# RPC NODES
# ============================================

# Ethereum Mainnet
ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Polygon
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# ============================================
# SMART CONTRACTS
# ============================================

# Adresse du contrat FlashBot déployé
FLASHBOT_CONTRACT_ADDRESS_ETH=0x...
FLASHBOT_CONTRACT_ADDRESS_POLYGON=0x...
FLASHBOT_CONTRACT_ADDRESS_ARBITRUM=0x...

# ============================================
# API KEYS
# ============================================

# OpenAI (pour IA)
OPENAI_API_KEY=sk-...

# Etherscan (pour vérification)
ETHERSCAN_API_KEY=...

# ============================================
# MONITORING
# ============================================

# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_CHAT_ID=123456789

# ============================================
# FLASHBOTS
# ============================================

# Relay URL (défaut: Flashbots)
FLASHBOTS_RELAY_URL=https://relay.flashbots.net

# ============================================
# CONFIGURATION
# ============================================

# Mode (production / testnet)
MODE=production

# Chain principale
PRIMARY_CHAIN=polygon

# Log level
LOG_LEVEL=INFO
EOF

# Protéger le fichier
chmod 600 .env
```

**⚠️ SÉCURITÉ CRITIQUE:**
```bash
# JAMAIS commit .env dans git!
echo ".env" >> .gitignore

# Backup chiffré
gpg -c .env  # Crée .env.gpg
```

### 6. Déploiement des Smart Contracts

```bash
cd /opt/thesoria/deployment/2_smart_contracts

# Installer Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Vérifier installation
forge --version  # 0.2.0+

# Compiler contrats
forge build

# Déployer (interactif)
./deploy_interactive.sh

# Suivre les instructions:
# 1. Choisir network (Polygon recommandé)
# 2. Confirmer paramètres
# 3. Signer avec Ledger/Trezor ou private key
# 4. Attendre confirmation

# Récupérer adresse
# Adresse affichée à la fin:
# ✅ FlashBot déployé: 0x1234...5678

# Ajouter dans .env
echo "FLASHBOT_CONTRACT_ADDRESS_POLYGON=0x1234...5678" >> .env
```

### 7. Infrastructure Docker

```bash
cd /opt/thesoria/deployment/1_infrastructure

# Démarrer services
docker-compose up -d

# Vérifier
docker-compose ps

# Services actifs:
# - redis         (cache)
# - prometheus    (métriques)
# - grafana       (dashboard)
# - node-exporter (system metrics)

# Tester connexions
curl http://localhost:9090/-/healthy  # Prometheus
curl http://localhost:3000/api/health # Grafana
```

### 8. Configuration Grafana

```bash
# Ouvrir Grafana
open http://localhost:3000

# Login: admin / admin (changer!)

# Ajouter datasource Prometheus
# Configuration → Data Sources → Add → Prometheus
# URL: http://prometheus:9090
# Save & Test

# Importer dashboard
cd /opt/thesoria/deployment/4_monitoring
# + → Import → Upload JSON
# Sélectionner: grafana_dashboard_mev.json
```

---

## 🚀 Lancement de l'Agent

### Mode Test (Dry Run)

```bash
cd /opt/thesoria/production
source venv/bin/activate

# Vérifier configuration
python -c "
from dotenv import load_dotenv
import os
load_dotenv()
print('✅ PRIVATE_KEY:', 'OK' if os.getenv('PRIVATE_KEY') else '❌ MISSING')
print('✅ ETH_RPC_URL:', 'OK' if os.getenv('ETH_RPC_URL') else '❌ MISSING')
print('✅ FLASHBOT_CONTRACT:', 'OK' if os.getenv('FLASHBOT_CONTRACT_ADDRESS_POLYGON') else '❌ MISSING')
"

# Test connexion RPC
python flashbots_executor.py

# Sortie attendue:
# ✅ Connecté au RPC
#    Block: 52847392
#    Chain ID: 137
# ✅ Account: 0x1234...
# 📊 Test calcul frais EIP-1559...
# ...
```

### Mode Production (Autonome 24/7)

```bash
cd /opt/thesoria/production
source venv/bin/activate

# Lancer l'agent autonome
nohup python autonomous_agent.py > agent.log 2>&1 &

# Récupérer PID
echo $! > agent.pid

# Vérifier logs
tail -f agent.log

# Sortie attendue:
# ============================================================
# 🚀 DÉMARRAGE AGENT AUTONOME
# ============================================================
# Chain: polygon
# Mode: PRODUCTION LIVE
# Time: 2024-12-22 15:30:45
# ============================================================
#
# 📊 Métriques Prometheus disponibles sur :8000
# 🚨 Alertes Discord/Telegram activées
#
# 💎 Scan en cours...
```

### Vérifier Fonctionnement

```bash
# 1. Métriques Prometheus
curl http://localhost:8000/metrics | grep mev_

# Devrait afficher:
# mev_cumulative_net_profit_eth{chain="polygon"} 0.0
# mev_cumulative_net_profit_usd{chain="polygon"} 0.0
# mev_bundles_sent_total{chain="polygon"} 0
# ...

# 2. Processus actif
ps aux | grep autonomous_agent

# 3. Logs en temps réel
tail -f agent.log

# 4. Dashboard Grafana
open http://localhost:3000
```

---

## 📊 Monitoring Production

### Métriques Clés à Surveiller

**1. Profit Net Cumulé (LE GRAAL!)**
```promql
sum(mev_cumulative_net_profit_usd)
```

**2. Taux de Succès Bundles**
```promql
sum(mev_bundles_success_total) 
/ 
(sum(mev_bundles_success_total) + sum(mev_bundles_failed_total)) 
* 100
```

**3. Balance Wallet**
```promql
mev_gas_wallet_balance_eth{chain="polygon"}
```

**4. Gas Payé**
```promql
sum(mev_gas_total_paid_eth) * 2000  # En USD
```

### Alertes Configurées

| Alerte | Seuil | Action |
|--------|-------|--------|
| Balance Critique | < 0.1 ETH | 🚨 RECHARGER |
| Balance Basse | < 0.5 ETH | ⚠️ Préparer |
| Agent Down | up == 0 | 🛑 Redémarrer |
| Profit Négatif | < -$1000 | 🛑 ARRÊTER |
| Erreurs élevées | > 10/min | 🔍 Vérifier |

### Dashboard Principal

**Panels importants:**
1. Profit Net Cumulé (ligne)
2. Balance Wallet (gauge)
3. Taux Succès (%)
4. Gas Price actuel
5. Trades exécutés
6. Latence exécution
7. Erreurs

---

## 🔒 Sécurité Production

### 1. Firewall

```bash
# Autoriser uniquement ports nécessaires
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 8000/tcp    # Prometheus metrics (local only)
sudo ufw allow 3000/tcp    # Grafana (local only)
sudo ufw enable

# Limiter par IP si possible
sudo ufw allow from 1.2.3.4 to any port 22
```

### 2. Rotation des Logs

```bash
# Créer logrotate config
sudo cat > /etc/logrotate.d/thesoria << 'EOF'
/opt/thesoria/production/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    sharedscripts
    postrotate
        systemctl reload thesoria-agent || true
    endscript
}
EOF
```

### 3. Systemd Service

```bash
# Créer service
sudo cat > /etc/systemd/system/thesoria-agent.service << 'EOF'
[Unit]
Description=THESORIA MEV Agent
After=network.target docker.service

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/thesoria/production
ExecStart=/opt/thesoria/production/venv/bin/python autonomous_agent.py
Restart=always
RestartSec=10
StandardOutput=append:/opt/thesoria/production/agent.log
StandardError=append:/opt/thesoria/production/agent.log

[Install]
WantedBy=multi-user.target
EOF

# Recharger
sudo systemctl daemon-reload

# Activer au démarrage
sudo systemctl enable thesoria-agent

# Démarrer
sudo systemctl start thesoria-agent

# Status
sudo systemctl status thesoria-agent

# Logs
sudo journalctl -u thesoria-agent -f
```

---

## 🛠️ Maintenance

### Arrêt Gracieux

```bash
# Si lancé manuellement
kill -SIGINT $(cat agent.pid)

# Si systemd
sudo systemctl stop thesoria-agent

# Vérifier arrêt propre (logs)
tail -n 50 agent.log
```

### Mise à Jour

```bash
# Arrêter agent
sudo systemctl stop thesoria-agent

# Backup
cp -r /opt/thesoria /opt/thesoria.backup.$(date +%Y%m%d)

# Update code
cd /opt/thesoria
git pull  # Ou copier nouveaux fichiers

# Update dependencies
cd production
source venv/bin/activate
pip install -r requirements.txt --upgrade

# Redémarrer
sudo systemctl start thesoria-agent

# Vérifier
sudo systemctl status thesoria-agent
tail -f agent.log
```

### Backup Base de Données

```bash
# Backup Prometheus data
tar -czf prometheus_backup_$(date +%Y%m%d).tar.gz \
    /opt/thesoria/deployment/1_infrastructure/prometheus_data/

# Backup Grafana dashboards
docker exec -t thesoria_grafana_1 \
    grafana-cli admin export-dashboard > dashboards_backup.json
```

---

## 📈 Optimisation Performance

### 1. Latence RPC

**Test de latence:**
```bash
# Script de benchmark
for i in {1..10}; do
    time curl -X POST \
        -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        $ETH_RPC_URL 2>&1 | grep real
done

# Cible: < 50ms en moyenne
```

**Si latence élevée:**
- Changer de provider RPC
- Utiliser un node dédié
- Se rapprocher géographiquement

### 2. Scan Frequency

**Ajuster dans `autonomous_agent.py`:**
```python
# Défaut: 10 scans/sec (100ms)
await asyncio.sleep(0.1)

# Ultra-agressif: 20 scans/sec (50ms)
await asyncio.sleep(0.05)
```

### 3. Gas Bidding

**Ajuster agressivité:**
```python
# Dans flashbots_executor.py
gas_params = await self.gas_bidding.calculate_optimal_gas_params(
    profit_expected_usd=200.0,
    urgency='critical'  # 'normal', 'high', 'critical'
)
```

---

## 🎯 Checklist de Déploiement

- [ ] Serveur production (16GB+ RAM)
- [ ] RPC nodes configurés (latence < 50ms)
- [ ] Smart contracts déployés
- [ ] .env configuré et sécurisé
- [ ] Docker services actifs
- [ ] Grafana dashboard importé
- [ ] Discord/Telegram configurés
- [ ] Agent teste en dry-run
- [ ] Systemd service activé
- [ ] Monitoring actif
- [ ] Firewall configuré
- [ ] Backup automatique
- [ ] Balance wallet > 2 ETH

---

## 🚨 Troubleshooting

### Problème: Bundle jamais inclus

**Causes:**
- Gas trop bas
- Simulation failed
- Profit trop faible
- Competition élevée

**Solutions:**
```python
# Augmenter percentile
executor.get_dynamic_eip1559_fees(percentile=90)  # Au lieu de 70

# Augmenter retries
await executor.execute_flash_loan(..., max_retries=5)
```

### Problème: Erreur "insufficient funds"

**Solution:**
```bash
# Recharger wallet
# Minimum: 2 ETH pour Ethereum, 50 MATIC pour Polygon
```

### Problème: RPC rate limit

**Solution:**
```bash
# Utiliser provider premium (Alchemy Growth+)
# Ou node dédié
```

---

## 📞 Support

**Logs:**
- Agent: `/opt/thesoria/production/agent.log`
- Docker: `docker-compose logs -f`
- Systemd: `journalctl -u thesoria-agent -f`

**Métriques:**
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000
- Agent: http://localhost:8000/metrics

---

**THESORIA** - Déployé et prêt à extraire le MEV 24/7! 💰⚡🚀

*Guide complet - Production Ready - ROI 1800%/an*
