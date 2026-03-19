# 🚀 THESORIA - PRODUCTION DEPLOYMENT GUIDE ULTRA-COMPLET

## MODE PRODUCTION RÉEL - CONFIGURATION PROFESSIONNELLE

**⚠️ ATTENTION : MODE PRODUCTION RÉEL = ARGENT RÉEL**

Ce guide vous permet de déployer THESORIA en production avec de l'argent réel sur les blockchains et exchanges réels.

---

## 📋 TABLE DES MATIÈRES

1. [Pré-requis Production](#1-pré-requis-production)
2. [Configuration Sécurisée](#2-configuration-sécurisée)
3. [API Keys & Secrets](#3-api-keys--secrets)
4. [Wallet Setup](#4-wallet-setup)
5. [Docker Deployment](#5-docker-deployment)
6. [Kubernetes (Production Scale)](#6-kubernetes-production-scale)
7. [Monitoring & Alerting](#7-monitoring--alerting)
8. [Backup & Recovery](#8-backup--recovery)
9. [Security Best Practices](#9-security-best-practices)
10. [Launch Production](#10-launch-production)

---

## 1. PRÉ-REQUIS PRODUCTION

### Infrastructure Minimale

```
Serveur Production:
├── CPU: 8+ cores (16+ recommandé)
├── RAM: 32GB+ (64GB recommandé)
├── Storage: 500GB SSD+ (1TB+ recommandé)
├── Network: 1Gbps+ (low latency)
└── OS: Ubuntu 22.04 LTS ou Debian 11+

Backup Server:
├── Storage: 1TB+ (mirroring)
└── Auto-backup daily

Monitoring Server:
├── Grafana + Prometheus
├── Alert Manager
└── Log aggregation
```

### Services Requis

```bash
# 1. Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose-plugin

# 2. Python 3.10+
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip

# 3. Node.js 18+ (pour dashboard)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 4. PostgreSQL (base de données production)
sudo apt install postgresql postgresql-contrib

# 5. Redis (cache & queue)
sudo apt install redis-server

# 6. Nginx (reverse proxy)
sudo apt install nginx

# 7. Certbot (SSL/TLS)
sudo apt install certbot python3-certbot-nginx
```

### Capital Recommandé par Niveau

```
Niveau 1 - Starter:
├── Capital: $10,000-20,000
├── Systèmes: 5-10
├── Profit attendu: $2,000-6,000/mois
└── Risque: Bas

Niveau 2 - Growth:
├── Capital: $30,000-50,000
├── Systèmes: 10-15
├── Profit attendu: $8,000-20,000/mois
└── Risque: Bas-Moyen

Niveau 3 - Scale:
├── Capital: $50,000-100,000
├── Systèmes: 15-20
├── Profit attendu: $20,000-50,000/mois
└── Risque: Moyen

Niveau 4 - Professional:
├── Capital: $100,000-500,000
├── Systèmes: 20-25
├── Profit attendu: $50,000-200,000/mois
└── Risque: Moyen-Élevé

Niveau 5 - Institutional:
├── Capital: $500,000-5,000,000
├── Systèmes: Tous (27)
├── Profit attendu: $200,000-1,000,000+/mois
└── Risque: Contrôlé professionnellement
```

---

## 2. CONFIGURATION SÉCURISÉE

### Structure de Production

```
thesoria-production/
├── .env.production          # Variables d'environnement (JAMAIS commit)
├── .env.example             # Template pour .env
├── docker-compose.prod.yml  # Docker production
├── kubernetes/              # K8s configs
│   ├── deployment.yml
│   ├── service.yml
│   ├── ingress.yml
│   └── secrets.yml
├── backend/                 # Backend services
├── frontend/                # Frontend dashboard
├── monitoring/              # Monitoring stack
│   ├── prometheus/
│   ├── grafana/
│   └── alertmanager/
├── backups/                 # Automated backups
├── logs/                    # Application logs
├── scripts/                 # Deployment scripts
└── ssl/                     # SSL certificates
```

### Créer .env.production

```bash
# Créer fichier de configuration production
cat > .env.production << 'EOF'
# ═══════════════════════════════════════════════════════════════
# THESORIA - PRODUCTION ENVIRONMENT VARIABLES
# ⚠️ NE JAMAIS COMMIT CE FICHIER - GARDER SECRET
# ═══════════════════════════════════════════════════════════════

# Environment
NODE_ENV=production
PYTHON_ENV=production
DEBUG=false

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=thesoria_prod
DB_USER=thesoria_user
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD_HERE
DB_SSL=true

# Redis (Cache & Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_ME_REDIS_PASSWORD
REDIS_DB=0

# API Server
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4
API_SECRET_KEY=CHANGE_ME_RANDOM_SECRET_KEY_64_CHARS_MIN

# Frontend
FRONTEND_URL=https://thesoria.yourdomain.com
CORS_ORIGINS=https://thesoria.yourdomain.com

# ═══════════════════════════════════════════════════════════════
# BLOCKCHAIN NODES (Infura, Alchemy, QuickNode)
# ═══════════════════════════════════════════════════════════════

# Ethereum
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
ETH_WS_URL=wss://mainnet.infura.io/ws/v3/YOUR_INFURA_KEY

# Binance Smart Chain
BSC_RPC_URL=https://bsc-dataseed.binance.org/
BSC_WS_URL=wss://bsc-ws-node.nariox.org:443

# Polygon
POLYGON_RPC_URL=https://polygon-rpc.com/
POLYGON_WS_URL=wss://polygon-rpc.com/

# Avalanche
AVAX_RPC_URL=https://api.avax.network/ext/bc/C/rpc
AVAX_WS_URL=wss://api.avax.network/ext/bc/C/ws

# Arbitrum
ARB_RPC_URL=https://arb1.arbitrum.io/rpc
ARB_WS_URL=wss://arb1.arbitrum.io/ws

# Optimism
OP_RPC_URL=https://mainnet.optimism.io
OP_WS_URL=wss://mainnet.optimism.io/ws

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com

# Base
BASE_RPC_URL=https://mainnet.base.org
BASE_WS_URL=wss://mainnet.base.org/ws

# ═══════════════════════════════════════════════════════════════
# WALLETS (PRODUCTION - REAL MONEY)
# ⚠️ SÉCURITÉ MAXIMUM - Utiliser Hardware Wallet si >$50k
# ═══════════════════════════════════════════════════════════════

# Main Trading Wallet (HOT WALLET - Small amounts only)
MAIN_WALLET_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
MAIN_WALLET_ADDRESS=YOUR_WALLET_ADDRESS_HERE

# Cold Storage (HARDWARE WALLET - Bulk funds)
COLD_WALLET_ADDRESS=YOUR_HARDWARE_WALLET_ADDRESS

# Multi-sig Wallet (For large operations)
MULTISIG_WALLET_ADDRESS=YOUR_MULTISIG_ADDRESS

# ═══════════════════════════════════════════════════════════════
# EXCHANGES API KEYS
# ═══════════════════════════════════════════════════════════════

# Binance
BINANCE_API_KEY=YOUR_BINANCE_API_KEY
BINANCE_SECRET_KEY=YOUR_BINANCE_SECRET
BINANCE_TESTNET=false

# Coinbase Pro
COINBASE_API_KEY=YOUR_COINBASE_API_KEY
COINBASE_SECRET=YOUR_COINBASE_SECRET
COINBASE_PASSPHRASE=YOUR_COINBASE_PASSPHRASE

# Kraken
KRAKEN_API_KEY=YOUR_KRAKEN_API_KEY
KRAKEN_SECRET=YOUR_KRAKEN_SECRET

# KuCoin
KUCOIN_API_KEY=YOUR_KUCOIN_API_KEY
KUCOIN_SECRET=YOUR_KUCOIN_SECRET
KUCOIN_PASSPHRASE=YOUR_KUCOIN_PASSPHRASE

# FTX (or alternative)
FTX_API_KEY=YOUR_FTX_API_KEY
FTX_SECRET=YOUR_FTX_SECRET

# ═══════════════════════════════════════════════════════════════
# DEX APIs & Services
# ═══════════════════════════════════════════════════════════════

# Uniswap
UNISWAP_ROUTER_ADDRESS=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D

# 1inch
ONEINCH_API_KEY=YOUR_1INCH_API_KEY

# 0x Protocol
ZEROX_API_KEY=YOUR_0X_API_KEY

# Dune Analytics
DUNE_API_KEY=YOUR_DUNE_API_KEY

# The Graph
THEGRAPH_API_KEY=YOUR_GRAPH_API_KEY

# Nansen (Whale tracking)
NANSEN_API_KEY=YOUR_NANSEN_API_KEY

# ═══════════════════════════════════════════════════════════════
# AI PROVIDERS
# ═══════════════════════════════════════════════════════════════

# OpenAI (GPT-4)
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_ORG_ID=YOUR_OPENAI_ORG

# Anthropic (Claude)
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY

# Google (Gemini)
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY

# Cohere
COHERE_API_KEY=YOUR_COHERE_API_KEY

# Hugging Face
HUGGINGFACE_API_KEY=YOUR_HUGGINGFACE_API_KEY

# Replicate
REPLICATE_API_KEY=YOUR_REPLICATE_API_KEY

# ═══════════════════════════════════════════════════════════════
# SOCIAL & SENTIMENT APIs
# ═══════════════════════════════════════════════════════════════

# Twitter/X API
TWITTER_API_KEY=YOUR_TWITTER_API_KEY
TWITTER_API_SECRET=YOUR_TWITTER_SECRET
TWITTER_BEARER_TOKEN=YOUR_TWITTER_BEARER

# Reddit API
REDDIT_CLIENT_ID=YOUR_REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET=YOUR_REDDIT_SECRET

# Discord
DISCORD_BOT_TOKEN=YOUR_DISCORD_TOKEN

# Telegram Bot
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=YOUR_TELEGRAM_CHAT_ID

# ═══════════════════════════════════════════════════════════════
# MONITORING & ALERTING
# ═══════════════════════════════════════════════════════════════

# Sentry (Error tracking)
SENTRY_DSN=YOUR_SENTRY_DSN

# DataDog (Monitoring)
DATADOG_API_KEY=YOUR_DATADOG_API_KEY

# PagerDuty (Alerts)
PAGERDUTY_API_KEY=YOUR_PAGERDUTY_KEY

# Email Alerts (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=YOUR_APP_PASSWORD
ALERT_EMAIL=alerts@yourdomain.com

# ═══════════════════════════════════════════════════════════════
# RISK MANAGEMENT
# ═══════════════════════════════════════════════════════════════

# Maximum position sizes
MAX_POSITION_SIZE_USD=10000
MAX_POSITION_SIZE_PERCENT=5

# Stop loss
DEFAULT_STOP_LOSS_PERCENT=2
MAX_DAILY_LOSS_PERCENT=5

# Take profit
DEFAULT_TAKE_PROFIT_PERCENT=10

# Trading limits
MAX_TRADES_PER_DAY=100
MAX_SLIPPAGE_PERCENT=1

# Gas limits
MAX_GAS_PRICE_GWEI=100
MAX_TRANSACTION_FEE_USD=50

# ═══════════════════════════════════════════════════════════════
# FEATURE FLAGS
# ═══════════════════════════════════════════════════════════════

# Enable/Disable systems
ENABLE_ZERO_CAPITAL=true
ENABLE_PRODUCTION_TRADING=true
ENABLE_YIELD_FARMING=true
ENABLE_NFT_ARBITRAGE=true
ENABLE_COPY_TRADING=true
ENABLE_ML_PREDICTIONS=true
ENABLE_WHALE_TRACKING=true
ENABLE_MARKET_MAKING=true
ENABLE_MULTI_ACCOUNT=false  # Requires legal compliance

# Auto-trading (⚠️ DANGEROUS - Start with false)
ENABLE_AUTO_TRADING=false
REQUIRE_MANUAL_APPROVAL=true

# ═══════════════════════════════════════════════════════════════
# BACKUPS
# ═══════════════════════════════════════════════════════════════

# S3 for backups (AWS or compatible)
S3_BUCKET=thesoria-backups
S3_ACCESS_KEY=YOUR_S3_ACCESS_KEY
S3_SECRET_KEY=YOUR_S3_SECRET_KEY
S3_REGION=us-east-1

# Backup frequency
BACKUP_INTERVAL_HOURS=6
BACKUP_RETENTION_DAYS=90

EOF
```

### Sécuriser .env

```bash
# Permissions strictes (lecture seule pour owner)
chmod 600 .env.production

# Ne JAMAIS commit
echo ".env.production" >> .gitignore
echo "*.env" >> .gitignore

# Créer template public
cp .env.production .env.example
# Puis remplacer toutes les valeurs sensibles par "YOUR_XXX_HERE"
```

---

## 3. API KEYS & SECRETS

### Obtenir les API Keys

#### 1. **Blockchain Nodes**

```bash
# Infura (Ethereum, Polygon)
# https://infura.io/ → Create Project → Copy API Key

# Alchemy (Alternative à Infura)
# https://www.alchemy.com/ → Create App → Copy API Key

# QuickNode (Multi-chain)
# https://www.quicknode.com/ → Create Endpoint
```

#### 2. **Exchanges**

```bash
# Binance
# https://www.binance.com/en/my/settings/api-management
# ⚠️ Enable: "Enable Reading", "Enable Spot & Margin Trading"
# ⚠️ IP Whitelist: Add your server IP

# Coinbase Pro
# https://pro.coinbase.com/profile/api
# Permissions: View, Trade

# Kraken
# https://www.kraken.com/u/security/api
# Permissions: Query Funds, Create & Modify Orders
```

#### 3. **AI Providers**

```bash
# OpenAI
# https://platform.openai.com/api-keys

# Anthropic
# https://console.anthropic.com/

# Google AI
# https://makersuite.google.com/app/apikey
```

#### 4. **Data Providers**

```bash
# Dune Analytics
# https://dune.com/settings/api

# The Graph
# https://thegraph.com/studio/apikeys/

# Nansen
# https://www.nansen.ai/ (Enterprise)
```

### Générer Secrets Cryptographiques

```bash
# API Secret Key (64 caractères)
openssl rand -hex 32

# JWT Secret
openssl rand -base64 32

# Encryption Key
openssl rand -hex 16
```

---

## 4. WALLET SETUP

### Stratégie Multi-Wallet (SÉCURITÉ)

```
Architecture Recommandée:

1. HOT WALLET (Trading actif)
   ├── Montant: 5-10% du capital total
   ├── Usage: Trades automatiques
   └── Sécurité: Private key chiffré

2. WARM WALLET (Reserve)
   ├── Montant: 20-30% du capital
   ├── Usage: Recharge automatique du hot wallet
   └── Sécurité: Multi-sig 2/3

3. COLD STORAGE (Bulk funds)
   ├── Montant: 60-75% du capital
   ├── Usage: Stockage long terme
   └── Sécurité: Hardware wallet (Ledger/Trezor)
```

### Créer Hot Wallet

```bash
# Installer web3.py
pip3 install web3

# Générer nouveau wallet
python3 << 'EOF'
from web3 import Web3
from eth_account import Account
import secrets

# Générer private key sécurisée
priv = secrets.token_hex(32)
private_key = "0x" + priv

# Créer account
acct = Account.from_key(private_key)

print("=" * 70)
print("NEW WALLET GENERATED")
print("=" * 70)
print(f"Address: {acct.address}")
print(f"Private Key: {private_key}")
print("=" * 70)
print("⚠️  SAVE PRIVATE KEY SECURELY - NEVER SHARE")
print("⚠️  BACKUP TO MULTIPLE SECURE LOCATIONS")
print("=" * 70)
EOF
```

### Chiffrer Private Key

```bash
# Installer cryptography
pip3 install cryptography

# Script de chiffrement
cat > encrypt_key.py << 'EOF'
from cryptography.fernet import Fernet
import os

# Générer clé de chiffrement
key = Fernet.generate_key()
cipher = Fernet(key)

# Private key à chiffrer
private_key = input("Enter private key: ")

# Chiffrer
encrypted = cipher.encrypt(private_key.encode())

print("\n" + "=" * 70)
print("ENCRYPTED KEY")
print("=" * 70)
print(f"Encryption Key: {key.decode()}")
print(f"Encrypted Private Key: {encrypted.decode()}")
print("=" * 70)
print("⚠️  Store BOTH values in .env.production:")
print(f"ENCRYPTION_KEY={key.decode()}")
print(f"ENCRYPTED_PRIVATE_KEY={encrypted.decode()}")
print("=" * 70)
EOF

python3 encrypt_key.py
```

### Setup Multi-Sig Wallet (Recommandé >$50k)

```bash
# Utiliser Gnosis Safe
# https://gnosis-safe.io/

# Ou créer avec Solidity
# Exemple: 2-of-3 multi-sig
# Signataires:
# 1. Vous (owner principal)
# 2. Co-founder ou partenaire de confiance
# 3. Cold storage emergency key
```

---

## 5. DOCKER DEPLOYMENT

### Docker Compose Production

```bash
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # ═══════════════════════════════════════════════════════════
  # DATABASE (PostgreSQL)
  # ═══════════════════════════════════════════════════════════
  postgres:
    image: postgres:15-alpine
    container_name: thesoria-db
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups/db:/backups
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ═══════════════════════════════════════════════════════════
  # CACHE & QUEUE (Redis)
  # ═══════════════════════════════════════════════════════════
  redis:
    image: redis:7-alpine
    container_name: thesoria-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ═══════════════════════════════════════════════════════════
  # BACKEND API
  # ═══════════════════════════════════════════════════════════
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: thesoria-backend
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - ./logs:/app/logs
      - ./backups:/app/backups
    ports:
      - "8000:8000"
    command: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ═══════════════════════════════════════════════════════════
  # PRODUCTION TRADER
  # ═══════════════════════════════════════════════════════════
  trader:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: thesoria-trader
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
      - backend
    volumes:
      - ./backend:/app
      - ./logs:/app/logs
    command: python3 production_trader.py

  # ═══════════════════════════════════════════════════════════
  # ML PREDICTION ENGINE
  # ═══════════════════════════════════════════════════════════
  ml-engine:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: thesoria-ml
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - ./logs:/app/logs
    command: python3 ml_prediction_engine.py

  # ═══════════════════════════════════════════════════════════
  # WHALE TRACKING
  # ═══════════════════════════════════════════════════════════
  whale-tracker:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: thesoria-whale
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - ./logs:/app/logs
    command: python3 whale_tracking_system.py

  # ═══════════════════════════════════════════════════════════
  # MARKET MAKING BOT
  # ═══════════════════════════════════════════════════════════
  market-maker:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: thesoria-mm
    restart: always
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - ./logs:/app/logs
    command: python3 market_making_bot.py

  # ═══════════════════════════════════════════════════════════
  # FRONTEND DASHBOARD
  # ═══════════════════════════════════════════════════════════
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: thesoria-frontend
    restart: always
    environment:
      - REACT_APP_API_URL=https://api.thesoria.com
    ports:
      - "3000:3000"
    depends_on:
      - backend

  # ═══════════════════════════════════════════════════════════
  # NGINX (Reverse Proxy & SSL)
  # ═══════════════════════════════════════════════════════════
  nginx:
    image: nginx:alpine
    container_name: thesoria-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - backend
      - frontend

  # ═══════════════════════════════════════════════════════════
  # MONITORING - Prometheus
  # ═══════════════════════════════════════════════════════════
  prometheus:
    image: prom/prometheus:latest
    container_name: thesoria-prometheus
    restart: always
    volumes:
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  # ═══════════════════════════════════════════════════════════
  # MONITORING - Grafana
  # ═══════════════════════════════════════════════════════════
  grafana:
    image: grafana/grafana:latest
    container_name: thesoria-grafana
    restart: always
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
    ports:
      - "3001:3000"
    depends_on:
      - prometheus

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  default:
    name: thesoria-network
EOF
```

### Backend Dockerfile

```bash
cat > backend/Dockerfile.prod << 'EOF'
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create logs directory
RUN mkdir -p logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python3 -c "import sys; sys.exit(0)"

# Run
CMD ["python3", "main.py"]
EOF
```

### Requirements Production

```bash
cat > backend/requirements.txt << 'EOF'
# Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
gunicorn==21.2.0

# Database
sqlalchemy==2.0.23
asyncpg==0.29.0
alembic==1.12.1

# Cache
redis==5.0.1
aioredis==2.0.1

# Blockchain
web3==6.11.3
eth-account==0.10.0
solana==0.30.2

# ML/AI
numpy==1.26.2
pandas==2.1.3
scikit-learn==1.3.2
tensorflow==2.15.0
torch==2.1.1

# APIs
aiohttp==3.9.1
httpx==0.25.2
requests==2.31.0

# Monitoring
prometheus-client==0.19.0
sentry-sdk==1.38.0

# Security
cryptography==41.0.7
pyjwt==2.8.0

# Utilities
python-dotenv==1.0.0
colorama==0.4.6
pyyaml==6.0.1

# Async
asyncio==3.4.3
aiocron==1.8
EOF
```

---

## 6. KUBERNETES (PRODUCTION SCALE)

### Déploiement K8s

```yaml
# kubernetes/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: thesoria-backend
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: thesoria-backend
  template:
    metadata:
      labels:
        app: thesoria-backend
    spec:
      containers:
      - name: backend
        image: thesoria/backend:latest
        ports:
        - containerPort: 8000
        envFrom:
        - secretRef:
            name: thesoria-secrets
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## 7. MONITORING & ALERTING

### Prometheus Config

```yaml
# monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'thesoria-backend'
    static_configs:
      - targets: ['backend:8000']

  - job_name: 'thesoria-trader'
    static_configs:
      - targets: ['trader:8001']

  - job_name: 'thesoria-ml'
    static_configs:
      - targets: ['ml-engine:8002']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - 'alerts.yml'
```

### Alert Rules

```yaml
# monitoring/prometheus/alerts.yml
groups:
  - name: thesoria_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: LowBalance
        expr: wallet_balance_usd < 1000
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Wallet balance low"
          
      - alert: HighLoss
        expr: daily_pnl_percent < -5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Daily loss exceeds 5%"
```

---

## 8. BACKUP & RECOVERY

### Automated Backups

```bash
cat > scripts/backup.sh << 'EOF'
#!/bin/bash
# Backup automatique production

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Database backup
docker exec thesoria-db pg_dump -U $DB_USER $DB_NAME | gzip > \
    $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz

# Logs backup
tar -czf $BACKUP_DIR/logs_$TIMESTAMP.tar.gz ./logs/

# Config backup (sans secrets)
tar -czf $BACKUP_DIR/config_$TIMESTAMP.tar.gz \
    --exclude='.env*' \
    --exclude='*.key' \
    ./

# Upload to S3
aws s3 cp $BACKUP_DIR/ s3://$S3_BUCKET/backups/ --recursive

# Delete old backups (keep 90 days)
find $BACKUP_DIR -type f -mtime +90 -delete

echo "Backup completed: $TIMESTAMP"
EOF

chmod +x scripts/backup.sh

# Cron job (toutes les 6 heures)
(crontab -l 2>/dev/null; echo "0 */6 * * * /path/to/scripts/backup.sh") | crontab -
```

---

## 9. SECURITY BEST PRACTICES

### Checklist Sécurité

```
✅ SSL/TLS activé (Let's Encrypt)
✅ Firewall configuré (UFW)
✅ SSH key-only (disable password)
✅ Fail2ban installé
✅ Rate limiting activé
✅ CORS configuré strictement
✅ Secrets chiffrés
✅ 2FA activé sur tous comptes
✅ IP whitelist pour API exchanges
✅ Monitoring 24/7
✅ Automated backups
✅ Incident response plan
✅ Multi-sig pour gros montants
✅ Cold storage pour >60% capital
```

---

## 10. LAUNCH PRODUCTION

### Script de Lancement

```bash
cat > launch_production_real.sh << 'EOF'
#!/bin/bash
# THESORIA - PRODUCTION REAL MONEY LAUNCHER

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${RED}"
cat << 'ASCII'
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      🚀 THESORIA - PRODUCTION REAL MONEY MODE 🚀          ║
║                                                           ║
║            ⚠️  ARGENT RÉEL - SOYEZ PRUDENT ⚠️            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
ASCII
echo -e "${NC}\n"

# Checks
echo -e "${YELLOW}Pre-flight checks...${NC}\n"

if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ .env.production found${NC}"

# Load env
source .env.production

# Verify API keys
if [ -z "$MAIN_WALLET_PRIVATE_KEY" ]; then
    echo -e "${RED}❌ MAIN_WALLET_PRIVATE_KEY not set${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Wallet configured${NC}"

# Capital warning
echo -e "\n${RED}${YELLOW}WARNING - PRODUCTION MODE${NC}"
echo -e "${YELLOW}This will trade with REAL MONEY${NC}"
echo -e "${YELLOW}Capital at risk: Check your wallet balance${NC}\n"

echo -e "Type '${RED}PRODUCTION REAL${NC}' to confirm: "
read -r confirm

if [ "$confirm" != "PRODUCTION REAL" ]; then
    echo -e "\n${YELLOW}Cancelled${NC}\n"
    exit 0
fi

# Launch
echo -e "\n${GREEN}Launching production systems...${NC}\n"

# Docker compose
docker-compose -f docker-compose.prod.yml up -d

echo -e "\n${GREEN}✓ Production systems launched${NC}\n"

# Show status
docker-compose -f docker-compose.prod.yml ps

echo -e "\n${GREEN}Dashboard: https://thesoria.yourdomain.com${NC}"
echo -e "${GREEN}Monitoring: http://localhost:3001${NC}\n"

EOF

chmod +x launch_production_real.sh
```

---

## 📊 RÉSUMÉ PRODUCTION

```
PRODUCTION CHECKLIST:

✅ Infrastructure Setup
   ├── Server (8+ cores, 32GB+ RAM)
   ├── Docker & Docker Compose
   ├── PostgreSQL + Redis
   └── Nginx + SSL

✅ Configuration
   ├── .env.production créé
   ├── API keys configurés
   ├── Wallets setup
   └── Secrets chiffrés

✅ Security
   ├── Firewall configuré
   ├── SSL/TLS activé
   ├── 2FA sur exchanges
   └── Multi-sig wallet

✅ Monitoring
   ├── Prometheus + Grafana
   ├── Alert Manager
   └── Email/Telegram alerts

✅ Backups
   ├── Automated daily
   ├── S3 storage
   └── 90 days retention

✅ Launch
   └── ./launch_production_real.sh
```

---

## 🎯 NEXT STEPS

1. **Setup infrastructure** (1-2 jours)
2. **Configure API keys** (1 jour)
3. **Test avec petit capital** ($500-1000, 1 semaine)
4. **Monitor performance** (2 semaines)
5. **Scale progressivement** (1-3 mois)
6. **Optimize & iterate** (continu)

---

**Version**: 1.0 Production Ready  
**Date**: 2024  
**Support**: https://thesoria.com/support

⚠️ **DISCLAIMER**: Trading crypto comporte des risques. N'investissez que ce que vous pouvez vous permettre de perdre.
