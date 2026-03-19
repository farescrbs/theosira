# 🚀 COMMENT LANCER THESORIA

## 📍 **VOUS ÊTES ICI**

Vous avez tous les fichiers prêts. Maintenant il faut **lancer le serveur de développement**.

---

## ⌨️ **ÉTAPES SIMPLES**

### **1. Ouvrir le Terminal**

**Sur Windows :**
- Appuyez sur `Windows + R`
- Tapez `cmd` et appuyez sur Entrée
- OU ouvrez VS Code et faites `Ctrl + ù` (Terminal intégré)

**Sur Mac/Linux :**
- Appuyez sur `Cmd + Espace`
- Tapez `Terminal` et appuyez sur Entrée
- OU ouvrez VS Code et faites `Ctrl + ù`

---

### **2. Aller dans le dossier du projet**

Dans le terminal, tapez :

```bash
cd chemin/vers/THESORIA
```

**Exemple :**
```bash
cd ~/Documents/THESORIA
# ou
cd C:\Users\VotreNom\Desktop\THESORIA
```

**💡 Astuce :** Vous pouvez glisser-déposer le dossier dans le terminal pour obtenir le chemin automatiquement.

---

### **3. Lancer le serveur de développement**

Dans le terminal, tapez :

```bash
npm run dev
```

**⏳ Attendez quelques secondes...**

Vous verrez :

```
  VITE v5.x.x  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### **4. Ouvrir dans le navigateur**

**Option A : Cliquer sur le lien**
- Dans le terminal, faites `Ctrl + Clic` sur `http://localhost:5173/`

**Option B : Copier-coller**
- Ouvrez votre navigateur (Chrome, Firefox, Edge)
- Collez dans la barre d'adresse : `http://localhost:5173/`

---

## ✅ **VOUS DEVRIEZ VOIR**

```
┌─────────────────────────────────────────────┐
│                                             │
│   💎 THESORIA                               │
│   Ultra-Premium Blockchain Platform         │
│                                             │
│   [Écran de chargement animé]               │
│                                             │
└─────────────────────────────────────────────┘
```

Puis après le chargement :

- ✨ Particules 3D en arrière-plan
- 🌟 Hero Sections avec glassmorphism
- 📊 CryptoMarket Section
- ⚡ Flash Loan Sections
- 💎 AAVE Page (nouveau !)
- Et toutes les autres sections...

---

## 🎯 **TESTER AAVE PAGE**

Une fois la page chargée :

1. **Scroller vers le bas** (ou appuyer plusieurs fois sur `Page Down`)
2. Chercher la section **"AAVE PROTOCOL"** avec fond glassmorphism
3. Vous verrez **4 onglets** :
   - Flash Loans
   - Liquidity Pools
   - Staking
   - Analytics

4. **Tester les onglets** :
   - Cliquer sur chaque onglet
   - Voir les données simulées
   - Cliquer sur "Execute Flash Loan"
   - Voir les modals s'ouvrir

---

## 🛑 **ARRÊTER LE SERVEUR**

Pour arrêter le serveur de développement :

Dans le terminal, appuyez sur :

```
Ctrl + C
```

Confirmez avec `Y` si demandé.

---

## 🔧 **EN CAS DE PROBLÈME**

### **Erreur : "npm: command not found"**

Vous devez installer Node.js :

1. Aller sur https://nodejs.org/
2. Télécharger la version LTS (recommandée)
3. Installer
4. Redémarrer le terminal
5. Réessayer `npm run dev`

---

### **Erreur : "Cannot find module"**

Installer les dépendances :

```bash
npm install
```

Puis relancer :

```bash
npm run dev
```

---

### **Erreur : "Port 5173 is already in use"**

Un autre serveur utilise déjà ce port.

**Solution 1 : Arrêter l'autre serveur**
```bash
# Trouver le processus
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Puis tuer le processus
kill -9 PID
```

**Solution 2 : Utiliser un autre port**
```bash
npm run dev -- --port 3000
```

Puis ouvrir `http://localhost:3000/`

---

### **La page est blanche ou erreur dans la console**

1. Ouvrir les DevTools (`F12` ou `Ctrl+Shift+I`)
2. Aller dans l'onglet **Console**
3. Lire l'erreur
4. Copier-coller l'erreur pour demander de l'aide

---

## 📝 **RAPPEL : OÙ METTRE QUOI**

### **❌ NE PAS METTRE DANS .env.example :**
```
npm run dev                    ❌
pragma solidity ^0.8.10;       ❌
import React from 'react';     ❌
console.log("test");           ❌
```

### **✅ À METTRE DANS .env.example :**
```env
VITE_APP_NAME=THESORIA                           ✅
VITE_AAVE_API_URL=https://aave-api-v2.aave.com  ✅
VITE_WALLET_CONNECT_PROJECT_ID=abc123           ✅
```

---

## 🗂️ **STRUCTURE DES FICHIERS**

```
THESORIA/
│
├── 📄 .env.example              ← Variables d'environnement
│                                   (CONFIG SEULEMENT)
│
├── 📁 contracts/                ← Smart Contracts Solidity
│   ├── ThesoriaFlashLoan.sol       (CODE BLOCKCHAIN)
│   └── interfaces/
│
├── 📁 components/               ← Composants React
│   ├── AavePage.tsx                (CODE FRONTEND)
│   └── aave/
│
├── 📄 App.tsx                   ← Application principale
│
├── 📄 package.json              ← Dépendances npm
│
└── 📁 public/                   ← Assets publics
```

---

## 🎯 **COMMANDES UTILES**

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer le serveur de développement |
| `npm run build` | Builder pour production |
| `npm run preview` | Prévisualiser le build |
| `npm install` | Installer les dépendances |
| `npm install package-name` | Installer un package |

---

## 📚 **TYPES DE FICHIERS**

| Extension | Type | Où l'éditer | Exemple |
|-----------|------|-------------|---------|
| `.env` | Config | Éditeur texte | `VITE_API_URL=...` |
| `.sol` | Smart Contract | VS Code | `pragma solidity` |
| `.tsx` | React | VS Code | `export default` |
| `.css` | Styles | VS Code | `.class { ... }` |
| `.md` | Documentation | VS Code | `# Title` |
| `.json` | Config/Data | VS Code | `{ "key": "value" }` |

---

## ⚡ **RACCOURCIS CLAVIER (dans le navigateur)**

| Raccourci | Action |
|-----------|--------|
| `F12` | Ouvrir DevTools |
| `Ctrl + R` | Recharger la page |
| `Ctrl + Shift + R` | Recharger sans cache |
| `Ctrl + Shift + I` | Ouvrir l'inspecteur |
| `Ctrl + Shift + C` | Mode sélection élément |

---

## 🎨 **SECTIONS DISPONIBLES DANS THESORIA**

En scrollant, vous verrez dans l'ordre :

1. ✨ **Hero Sections** (6x) - Présentation
2. 🔗 **Blockchain Visualization** - Animation blockchain
3. 📊 **Realtime Stats** - Stats en temps réel
4. 💱 **Crypto Market** - Marchés crypto
5. 🌐 **Domain Section** - Création de domaines
6. 💎 **Tokenization** - Tokenisation d'actifs
7. 🎰 **Lottery** - Loterie
8. 💰 **Lending** - Prêts
9. 🔒 **Staking** - Staking
10. 🖼️ **NFT** - NFTs
11. 🌉 **Bridge** - Bridge cross-chain
12. 🏦 **Vault** - Coffre-fort
13. 👛 **Wallet** - Portefeuille
14. 💳 **Card Creation** - Création de cartes
15. 📧 **Secure Messaging** - Messagerie sécurisée
16. 🤖 **AI Agent** - Agent IA
17. ⛏️ **Mining** - Mining
18. 👑 **God Mode Panel** - Panel God Mode
19. 📈 **Live Trading Dashboard** - Dashboard trading
20. ⚡ **Flash Loan God Mode** - Flash Loan God Mode
21. 🤖 **Flash Loan Bot** - Bot Flash Loan
22. 🐮 **Cow Flash Loan** - Cow Flash Loan
23. 🎯 **AI Command Center** - Centre de commande IA
24. ⚡ **Flash Bot Dashboard** - Dashboard Flash Bot
25. 🎨 **Collection** - Collection
26. 💎 **Premium** - Premium
27. ✨ **Experience** - Expérience
28. 💬 **Testimonials** - Témoignages
29. 📰 **News** - Actualités
30. 📄 **Footer** - Pied de page
31. 🌐 **Web3 Section** - Web3
32. **✨ AAVE PAGE ✨** - **NOUVEAU !**
33. 📊 **System Health Dashboard** - Dashboard santé système

---

## 🚀 **PROCHAINES ÉTAPES**

Une fois que `npm run dev` fonctionne :

### **Option A : Développer localement**
- Modifier les fichiers
- Le navigateur se recharge automatiquement
- Voir les changements en temps réel

### **Option B : Déployer sur Vercel**
```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel

# 4. Suivre les instructions
```

### **Option C : Déployer les Smart Contracts**
```bash
# 1. Installer Hardhat
npm install --save-dev hardhat

# 2. Compiler
npx hardhat compile

# 3. Déployer
npx hardhat run contracts/deploy.js --network goerli
```

---

## ✅ **CHECKLIST DE LANCEMENT**

Avant de lancer `npm run dev` :

- [ ] Node.js installé (`node --version`)
- [ ] npm installé (`npm --version`)
- [ ] Terminal ouvert
- [ ] Dans le bon dossier (`cd THESORIA`)
- [ ] Dépendances installées (`npm install`)

Après avoir lancé `npm run dev` :

- [ ] Serveur démarre sans erreur
- [ ] URL affichée dans le terminal
- [ ] Navigateur ouvert sur `http://localhost:5173/`
- [ ] Page THESORIA s'affiche
- [ ] Aucune erreur dans la console (`F12`)

---

## 💡 **AIDE RAPIDE**

| Problème | Solution |
|----------|----------|
| npm introuvable | Installer Node.js |
| Module manquant | `npm install` |
| Port occupé | `npm run dev -- --port 3000` |
| Page blanche | Vérifier la console (`F12`) |
| Erreur de build | `npm install` puis `npm run dev` |

---

## 🎉 **PRÊT À LANCER !**

**Tapez maintenant dans le terminal :**

```bash
npm run dev
```

Puis ouvrez votre navigateur à l'adresse affichée ! 🚀

---

💎 **THESORIA - Ultra-Premium Blockchain Platform** 💎
