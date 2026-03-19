# 🚀 PRODUCTION QUICKSTART - 15 MINUTES

Guide ultra-rapide pour déployer THESORIA en production réelle.

---

## ⚡ ÉTAPES RAPIDES (Production Ready en 15 min)

### 1️⃣ CONFIGURATION FRONTEND (2 min)

```bash
# Copier le template .env
cp .env.example .env.local

# Éditer avec vos vraies valeurs
nano .env.local
```

Remplir au minimum :
```env
NEXT_PUBLIC_ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/VOTRE_CLE
NEXT_PUBLIC_WS_URL=ws://localhost:8765
```

### 2️⃣ CONFIGURATION BACKEND (2 min)

```bash
# Copier le template
cp backend.env.example backend/.env

# Éditer avec vos secrets
nano backend/.env
```

**CRITIQUE** - Remplir obligatoirement :
```env
WALLET_PRIVATE_KEY=0xVOTRE_CLE_PRIVEE
ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/VOTRE_CLE

# SÉCURITÉ - Commencer PETIT
MAX_TRADE_SIZE=0.1
MAX_DAILY_LOSS=200
SIMULATION_MODE=false  # false pour vraies transactions
```

### 3️⃣ INSTALLER DÉPENDANCES (3 min)

```bash
# Frontend
npm install

# Backend
cd backend
pip3 install -r requirements.txt
cd ..
```

### 4️⃣ VÉRIFICATION PRÉ-PRODUCTION (2 min)

```bash
# Rendre le script exécutable
chmod +x check-production-ready.sh

# Lancer les vérifications
./check-production-ready.sh
```

Si tout est ✅ vert, continuer !

### 5️⃣ BUILD PRODUCTION (3 min)

```bash
# Build frontend
npm run build

# Vérifier que ça fonctionne
npm start
```

Frontend accessible sur `http://localhost:3000`

### 6️⃣ DÉMARRER LE BACKEND (1 min)

```bash
# Dans un nouveau terminal
cd backend
python3 main.py
```

Backend WebSocket actif sur `ws://localhost:8765`

### 7️⃣ TEST FINAL (2 min)

1. Ouvrir `http://localhost:3000`
2. Scroller jusqu'à la section "MEV GOD"
3. Cliquer "Connecter MetaMask"
4. Approuver la connexion
5. ✅ Vérifier :
   - Wallet connecté ✓
   - Backend Python Online ✓
   - Bot MEV Actif ✓

---

## ✅ CHECKLIST SÉCURITÉ AVANT LANCEMENT

```
□ Wallet DÉDIÉ uniquement pour le bot (pas votre wallet principal)
□ MAX_TRADE_SIZE = 0.1 ETH (COMMENCER PETIT!)
□ MAX_DAILY_LOSS configuré (ex: $200)
□ Backup de la clé privée fait (3 copies sécurisées)
□ Testé sur testnet d'abord (RECOMMANDÉ)
□ Monitoring configuré (Telegram/Discord)
□ Plan d'urgence préparé (comment arrêter rapidement)
```

---

## 🎯 DÉPLOIEMENT VPS (Production 24/7)

### Option A : DigitalOcean Droplet

```bash
# 1. Créer Droplet Ubuntu 22.04 ($20/mois)
# 2. SSH dans le VPS
ssh root@your-vps-ip

# 3. Installer dépendances
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs python3.10 python3-pip git

# 4. Clone repo
git clone https://github.com/your-repo/thesoria.git
cd thesoria

# 5. Configure .env files
nano .env.local
nano backend/.env

# 6. Install PM2
npm install -g pm2

# 7. Install deps
npm install
cd backend && pip3 install -r requirements.txt && cd ..

# 8. Build
npm run build

# 9. Start with PM2
pm2 start npm --name "thesoria-frontend" -- start
pm2 start backend/main.py --name "thesoria-backend" --interpreter python3

# 10. Auto-restart on reboot
pm2 startup
pm2 save

# 11. Monitor
pm2 monit
```

### Option B : Docker (Avancé)

```bash
# Build & Run
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📊 MONITORING EN TEMPS RÉEL

### Dashboard PM2

```bash
pm2 monit
```

### Logs Live

```bash
# Frontend
pm2 logs thesoria-frontend

# Backend
pm2 logs thesoria-backend

# All
pm2 logs
```

### Métriques

```bash
pm2 status
```

---

## 🆘 COMMANDES D'URGENCE

### Arrêt Immédiat

```bash
# Arrêter TOUT
pm2 stop all

# Ou via l'interface web
# Cliquer "Arrêter Bot MEV"
```

### Restart

```bash
pm2 restart all
```

### Vérifier Balance Wallet

```bash
# Via interface web ou MetaMask
# Ou via script Python
python3 -c "from web3 import Web3; w3 = Web3(Web3.HTTPProvider('YOUR_RPC')); print(w3.eth.get_balance('YOUR_ADDRESS'))"
```

### Retirer Fonds d'Urgence

1. Arrêter le bot
2. Se connecter à MetaMask
3. Envoyer ETH vers wallet sécurisé
4. Analyse post-mortem

---

## 📈 SCALING PROGRESSIF

### Semaine 1-2 : Phase Test

```env
MAX_TRADE_SIZE=0.1
```

**Observer** :
- Win rate > 70% ?
- Profits constants ?
- Pas d'erreurs majeures ?

### Semaine 3-4 : Scale Up

Si tout va bien :

```env
MAX_TRADE_SIZE=0.3
```

### Mois 2 : Scale Further

Si profits consistants :

```env
MAX_TRADE_SIZE=0.5
```

### Mois 3+ : Production Complète

Si système stable :

```env
MAX_TRADE_SIZE=1.0
```

**RÈGLE D'OR** : N'augmenter que si :
- ✅ 30 jours de profits
- ✅ Win rate > 70%
- ✅ Pas de bugs
- ✅ Drawdown < 10%

---

## 💰 GESTION PROFITS

### Stratégie Recommandée

```
Profits < $1,000 :
  → Réinvestir 100%

Profits $1,000 - $5,000 :
  → Retirer 30%
  → Réinvestir 70%

Profits > $5,000 :
  → Retirer 50%
  → Réinvestir 50%
```

### Sécuriser les Gains

1. Wallet Trading (bot) → Wallet Secondaire (hot) → Hardware Wallet (cold)
2. Retraits réguliers (hebdomadaires)
3. Ne JAMAIS tout laisser dans le wallet trading

---

## 🔐 SÉCURITÉ PRODUCTION

### Firewall VPS

```bash
sudo ufw allow ssh
sudo ufw allow 3000/tcp
sudo ufw allow 8765/tcp
sudo ufw enable
```

### SSL/HTTPS (si domaine)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Backup Automatique

```bash
# Cron job pour backup quotidien
crontab -e

# Ajouter:
0 2 * * * /usr/bin/tar -czf /backups/thesoria-$(date +\%Y\%m\%d).tar.gz /root/thesoria
```

---

## 📞 ALERTES TELEGRAM (RECOMMANDÉ)

### Setup en 5 min

1. **Créer Bot Telegram** :
   - Parler à @BotFather
   - `/newbot`
   - Nom: ThesoriaBotAlerts
   - Copier TOKEN

2. **Obtenir Chat ID** :
   - Parler à @userinfobot
   - `/start`
   - Copier ID

3. **Configurer** :
   ```env
   # backend/.env
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
   TELEGRAM_CHAT_ID=123456789
   ```

4. **Tester** :
   ```bash
   curl -X POST \
     "https://api.telegram.org/bot<TOKEN>/sendMessage" \
     -d "chat_id=<CHAT_ID>&text=Test"
   ```

Vous recevrez maintenant des alertes pour :
- ✅ Trades exécutés
- ⚠️ Erreurs importantes
- 🚨 Stop-loss déclenchés
- 💰 Profits quotidiens

---

## 📚 RESSOURCES

### Documentation Complète

```bash
cat PRODUCTION_DEPLOYMENT_GUIDE.md
```

### Logs Production

```bash
tail -f logs/production_$(date +%Y%m%d).log
```

### Support

- GitHub Issues: `your-repo/issues`
- Discord: `your-discord-server`
- Email: `support@your-domain.com`

---

## ✅ CHECKLIST FINALE

```
□ .env.local configuré
□ backend/.env configuré avec PRIVATE_KEY
□ Dépendances installées
□ Build réussi
□ Backend démarré
□ Frontend accessible
□ MetaMask connecté
□ Bot actif
□ Premier trade test OK
□ Monitoring configuré
□ Alertes Telegram fonctionnelles
□ Backup fait
□ Plan d'urgence préparé
```

---

## 🎉 LANCEMENT !

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  🚀 SYSTÈME EN PRODUCTION                                ║
║                                                           ║
║  18 COMPOSANTS IA ACTIFS                                 ║
║  AUTONOMIE TOTALE                                        ║
║  PROFITS 24/7                                            ║
║                                                           ║
║  Surveillez les premières 24h attentivement              ║
║  Ajustez selon les résultats                             ║
║  Scalez progressivement                                   ║
║                                                           ║
║  BON TRADING ! 💰                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

**Date** : 24 Décembre 2024  
**Version** : QUICKSTART 1.0  
**Temps Total** : ~15 minutes  
**Niveau** : Production Ready

🎯 **OBJECTIF** : De l'installation au premier trade en moins de 15 minutes !
