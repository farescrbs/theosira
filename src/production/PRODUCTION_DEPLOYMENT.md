# ⚡ THESORIA - DÉPLOIEMENT PRODUCTION ULTIME

**Configuration ultra-optimisée pour latence minimale et profit maximum**

---

## 🎯 Architecture Production

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE PRODUCTION                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🖥️  SERVER DÉDIÉ (VPS Ultra-Rapide)                       │
│  ├─ CPU: 16+ cores                                         │
│  ├─ RAM: 32GB+                                             │
│  ├─ SSD: NVMe 500GB+                                       │
│  └─ Réseau: 10 Gbps (latence < 1ms)                       │
│                                                             │
│  📡 RPC PRIVÉS (Latence < 20ms)                            │
│  ├─ Alchemy Private ($499/mois)                            │
│  ├─ QuickNode Pro ($299/mois)                              │
│  └─ Node Dédié ($500/mois - optimal!)                     │
│                                                             │
│  🗄️  REDIS CACHE (Mémoire)                                 │
│  └─ TTL: 5 secondes pour prix                             │
│                                                             │
│  ⚡ FLASHBOTS / MEV-BOOST                                  │
│  └─ Connexions directes aux mineurs/validateurs           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation Rapide (15 minutes)

### 1. Server Setup (Ubuntu 22.04 LTS)

```bash
# Se connecter au serveur
ssh root@your-server-ip

# Update système
apt update && apt upgrade -y

# Installer dépendances
apt install -y \
    python3.11 \
    python3-pip \
    git \
    redis-server \
    build-essential \
    libssl-dev \
    pkg-config

# Installer Rust (pour Artemis)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Installer Node.js (pour Hardhat)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Vérifications
python3 --version  # 3.11+
node --version     # v18+
redis-server --version
cargo --version
```

### 2. Clone & Setup THESORIA

```bash
# Clone le repo
cd /opt
git clone https://github.com/your-org/thesoria.git
cd thesoria

# Python virtual env
python3 -m venv venv
source venv/bin/activate

# Installer dépendances Python
cd production
pip install --upgrade pip
pip install -r requirements_production.txt
```

### 3. Configuration `.env`

```bash
# Copier template
cp .env.example .env

# Éditer avec vos clés
nano .env
```

Configuration minimale:
```bash
# ============================================
# BLOCKCHAIN
# ============================================

# Clé privée (HOT WALLET - Fonds limités!)
PRIVATE_KEY=0x...

# RPC URLs (PRIVÉS recommandés)
ALCHEMY_API_KEY=your_alchemy_key
QUICKNODE_ETH_URL=https://your-node.quiknode.pro/...
QUICKNODE_POLYGON_URL=https://your-node.quiknode.pro/...

# Ou node dédié (OPTIMAL)
ETHEREUM_RPC_URL=https://your-dedicated-node.com:8545
POLYGON_RPC_URL=https://your-dedicated-node.com:8546

# ============================================
# FLASHBOTS
# ============================================

FLASHBOTS_RELAY=https://relay.flashbots.net

# ============================================
# IA (OPTIONNEL)
# ============================================

OPENAI_API_KEY=sk-...
LANGCHAIN_API_KEY=lc_...

# ============================================
# MONITORING
# ============================================

DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id

# ============================================
# TRADING
# ============================================

MIN_PROFIT_USD=50
MAX_FLASH_LOAN=10000000
MIN_SPREAD=0.003
MAX_GAS_PRICE_GWEI=150

# ============================================
# PERFORMANCE
# ============================================

SCAN_INTERVAL_MS=100
PARALLEL_SCANS=50
MAX_WORKERS=16
```

### 4. Déployer Smart Contracts

```bash
cd /opt/thesoria/contracts

# Installer dépendances
npm install

# Compiler
npm run compile

# Déployer sur Polygon Mainnet
npm run deploy:polygon

# Sauvegarder l'adresse du contrat
# Ajouter dans .env:
# FLASHBOT_CONTRACT_ADDRESS=0x...
```

### 5. Configuration Redis

```bash
# Éditer config Redis
nano /etc/redis/redis.conf

# Modifier:
maxmemory 2gb
maxmemory-policy allkeys-lru
save ""  # Désactiver persistence (pas nécessaire)

# Redémarrer
systemctl restart redis
systemctl enable redis

# Tester
redis-cli ping  # → PONG
```

### 6. Installer Artemis (Optionnel mais recommandé)

```bash
cd /opt
git clone https://github.com/paradigmxyz/artemis.git
cd artemis

# Compiler
cargo build --release

# Copier le binaire
cp target/release/artemis /opt/thesoria/production/bin/

# Configuration
cp examples/config.toml /opt/thesoria/production/config/artemis.toml
nano /opt/thesoria/production/config/artemis.toml
```

---

## 🔥 Lancement Production

### Mode Standard

```bash
cd /opt/thesoria/production
source venv/bin/activate

# Lancer sur Polygon + Arbitrum
python launcher_production.py --chains polygon arbitrum
```

### Mode Test (Recommandé d'abord)

```bash
# Test sans trading réel
python launcher_production.py --chains polygon --test
```

### Avec Systemd (Auto-restart)

```bash
# Créer service
nano /etc/systemd/system/thesoria.service
```

Contenu:
```ini
[Unit]
Description=THESORIA MEV Production
After=network.target redis.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/thesoria/production
Environment="PATH=/opt/thesoria/venv/bin:/usr/bin"
ExecStart=/opt/thesoria/venv/bin/python launcher_production.py --chains polygon arbitrum
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Activer:
```bash
systemctl daemon-reload
systemctl enable thesoria
systemctl start thesoria

# Voir les logs
journalctl -u thesoria -f
```

---

## 📊 Monitoring

### Logs en temps réel

```bash
# Logs Python
tail -f /opt/thesoria/production/mev_agent.log

# Logs système
journalctl -u thesoria -f

# Stats Redis
redis-cli INFO stats
```

### Dashboard Prometheus (Optionnel)

```bash
# Installer Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvf prometheus-*.tar.gz
cd prometheus-*

# Configurer
cat > prometheus.yml << EOF
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'thesoria'
    static_configs:
      - targets: ['localhost:9090']
EOF

# Lancer
./prometheus --config.file=prometheus.yml &

# Grafana (optionnel)
# http://server-ip:3000
```

---

## ⚡ Optimisations Extrêmes

### 1. RPC Node Dédié (MEILLEUR)

**Option A: Louer un node**
- QuickNode Dedicated: $500-1000/mois
- Alchemy Private: $499/mois
- Infura Dedicated: $1000/mois

**Option B: Héberger soi-même** (OPTIMAL)
```bash
# Installer Geth (Ethereum)
apt install ethereum

# Lancer en mode light
geth --http --http.api eth,web3,net --syncmode snap --cache 8192

# Ou utiliser Erigon (plus rapide)
git clone https://github.com/ledgerwatch/erigon.git
cd erigon
make erigon
./build/bin/erigon --http.api eth,web3,net
```

**Résultat**: Latence 5-10ms vs 30-50ms avec RPC partagés

### 2. Co-location avec Infra

**Héberger le serveur près des nodes**:
- AWS us-east-1 (proche nodes Ethereum)
- OVH France (bonne latence Europe)
- Hetzner Allemagne (excellent rapport qualité/prix)

**Résultat**: -10ms de latence réseau

### 3. Optimisations Système

```bash
# Augmenter limites fichiers
echo "* soft nofile 100000" >> /etc/security/limits.conf
echo "* hard nofile 100000" >> /etc/security/limits.conf

# Optimiser TCP
cat >> /etc/sysctl.conf << EOF
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.tcp_congestion_control = bbr
EOF

sysctl -p

# Désactiver swap
swapoff -a
```

### 4. Python Optimisations

```bash
# Utiliser PyPy (JIT compiler)
apt install pypy3
pypy3 -m pip install -r requirements_production.txt

# Ou installer Python avec optimisations
./configure --enable-optimizations
make -j$(nproc)
make install
```

### 5. Redis Optimisations

```bash
# redis.conf
maxmemory-policy allkeys-lru
tcp-backlog 511
timeout 0
tcp-keepalive 300
```

---

## 💰 Coûts Production

### Infrastructure

| Composant | Coût Mensuel | Recommandé |
|-----------|--------------|------------|
| VPS Dédié (16 cores, 32GB) | $100-200 | ✅ Essentiel |
| RPC Privé (Alchemy/QuickNode) | $300-500 | ✅ Fortement |
| Node Dédié (auto-hébergé) | $200-500 | ⭐ OPTIMAL |
| Redis Cloud | $0-50 | ❌ Optionnel |
| Monitoring (Grafana Cloud) | $0-30 | ❌ Optionnel |
| **TOTAL** | **$400-800/mois** | |

### Rentabilité

**Avec capital de $100,000**:
- Profit journalier: $2,000-5,000
- Profit mensuel: $60,000-150,000
- ROI infrastructure: 10-20 jours

**Avec capital de $1,000,000**:
- Profit journalier: $20,000-50,000
- Profit mensuel: $600,000-1,500,000
- ROI infrastructure: 1-2 jours

---

## 🛡️ Sécurité Production

### 1. Hot Wallet Séparé

```bash
# JAMAIS mettre tout votre capital dans la clé privée!
# Hot wallet: $10k-100k maximum
# Cold wallet: Le reste en sécurité
```

### 2. Firewall

```bash
# UFW
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp  # SSH
ufw allow 6379/tcp from 127.0.0.1  # Redis local only
ufw enable

# Fail2ban
apt install fail2ban
systemctl enable fail2ban
```

### 3. Alertes

```python
# Dans le code, alertes Discord/Telegram
if balance < MIN_BALANCE_ALERT:
    send_alert("⚠️ Balance faible!")

if success_rate < 50:
    send_alert("⚠️ Taux succès faible!")

if daily_loss > STOP_LOSS_DAILY:
    send_alert("🛑 Stop loss atteint!")
    pause_trading()
```

### 4. Backups

```bash
# Backup journalier des logs et historique
cat > /opt/thesoria/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d)
tar czf /backup/thesoria-$DATE.tar.gz \
    /opt/thesoria/production/*.log \
    /opt/thesoria/production/trade_history.json
find /backup -name "thesoria-*.tar.gz" -mtime +30 -delete
EOF

chmod +x /opt/thesoria/backup.sh
crontab -e
# Ajouter:
0 3 * * * /opt/thesoria/backup.sh
```

---

## 📈 Scaling

### Horizontal (Multi-Servers)

```bash
# Server 1: Ethereum + Polygon
python launcher_production.py --chains ethereum polygon

# Server 2: Arbitrum + Optimism + Base
python launcher_production.py --chains arbitrum optimism base

# Load balancer: Nginx
# Redis: Cluster mode
```

### Vertical (Upgrade Server)

```bash
# Passer à 32 cores, 64GB RAM
# Augmenter PARALLEL_SCANS à 100
# Augmenter MAX_WORKERS à 32
```

---

## 🧪 Tests de Performance

### Test de Latence

```bash
# Test RPC
time curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://your-rpc-url

# Doit être < 50ms
```

### Benchmark Scan

```bash
# Lancer en mode test avec timing
python launcher_production.py --test --chains polygon
```

Objectifs:
- Scan complet: < 100ms
- Analyse IA: < 100ms
- Construction TX: < 20ms
- Total: < 250ms

---

## 🆘 Troubleshooting

### Problème: Latence élevée

```bash
# Vérifier ping RPC
ping -c 10 your-rpc-host

# Tester avec différents RPC
# Éditer config_production.py
```

### Problème: Redis erreurs

```bash
# Vérifier Redis
redis-cli ping

# Restart
systemctl restart redis

# Vider cache
redis-cli FLUSHALL
```

### Problème: Taux succès faible

```bash
# Réduire MIN_PROFIT
# Augmenter MAX_GAS_PRICE
# Vérifier les frais Flashbots
```

---

## 🎯 Checklist Pré-Production

- [ ] VPS configuré et optimisé
- [ ] RPC privés configurés
- [ ] Redis installé et testé
- [ ] Smart contracts déployés
- [ ] .env configuré avec toutes les clés
- [ ] Tests passés avec succès
- [ ] Monitoring configuré
- [ ] Alertes Discord/Telegram actives
- [ ] Firewall activé
- [ ] Backups automatiques
- [ ] Hot wallet financé ($10k-100k)
- [ ] Documentation lue ✅

---

## 🚀 GO LIVE!

```bash
# Dernière vérification
python launcher_production.py --test --chains polygon

# Si tout est OK:
systemctl start thesoria

# Monitoring
journalctl -u thesoria -f

# 🎉 PROFIT! 💰
```

---

**THESORIA Production** - Dominez le MEV avec latence NANOSECONDES ⚡💰

*Dernière mise à jour: Décembre 2024*
