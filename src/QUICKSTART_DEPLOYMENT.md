# ⚡ DÉPLOIEMENT ULTRA-RAPIDE - THESORIA FLASHBOT

## 🚀 EN 3 COMMANDES

```bash
# 1. Configuration
cd contracts
cp .env.example .env
nano .env  # Ajoutez: WALLET_PRIVATE_KEY=votre_cle

# 2. Déploiement
./deploy-quick.sh

# 3. Démarrage
cd ..
npm run dev
```

**C'est tout!** Ouvrez http://localhost:3000 et cliquez "Connecter MetaMask" 🎉

---

## 📱 OU ENCORE PLUS SIMPLE

```bash
chmod +x 🚀_DEPLOYER_FLASHBOT.sh
./🚀_DEPLOYER_FLASHBOT.sh
```

Le script vous guidera à travers tout! ✨

---

## 🆓 TESTNET (Gratuit pour tester)

1. **Obtenez des MATIC gratuits:**
   - https://faucet.polygon.technology/
   - Connectez MetaMask
   - Recevez 0.5 MATIC

2. **Déployez:**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy-flashbot.js --network mumbai
   ```

3. **Testez:** Ouvrez http://localhost:3000

---

## 💰 MAINNET (Production réelle)

### Polygon (~$0.05)
```bash
cd contracts
npx hardhat run scripts/deploy-flashbot.js --network polygon
```

### Gnosis (~$1-3) ⭐ GAS BAS - RECOMMANDÉ
```bash
npx hardhat run scripts/deploy-flashbot.js --network gnosis
```

---

## ✅ Vérification

Après déploiement, vérifiez:

```bash
cat public/contracts/deployment.json
```

Vous devriez voir l'adresse du contrat! 🎯

---

## 🆘 Problème?

### "Balance insuffisante"
➡️ **Testnet:** https://faucet.polygon.technology/
➡️ **Mainnet:** Achetez 1 MATIC sur Binance

### "Private key not configured"
➡️ Éditez `contracts/.env` et ajoutez votre clé privée MetaMask

### Le contrat ne se charge pas
➡️ Rechargez avec `Ctrl+Shift+R`

---

## 📖 Documentation Complète

- **Guide Détaillé:** [DEPLOIEMENT_FLASHBOT.md](./DEPLOIEMENT_FLASHBOT.md)
- **Guide Complet:** [contracts/DEPLOYMENT_GUIDE.md](./contracts/DEPLOYMENT_GUIDE.md)
- **README Contrats:** [contracts/README.md](./contracts/README.md)

---

## 💎 Coûts

| Réseau | Coût | Recommandation |
|--------|------|----------------|
| Mumbai | Gratuit 🆓 | ⭐ Pour tester |
| Gnosis | ~$1-3 | ⭐⭐⭐ Production |
| Polygon | ~$0.05 | ⭐⭐ Production |
| Ethereum | ~$30-100 | ❌ Trop cher |

---

## 🎯 Prêt?

```bash
./🚀_DEPLOYER_FLASHBOT.sh
```

**Votre FlashBot sera en production en moins de 5 minutes!** 🚀💰
