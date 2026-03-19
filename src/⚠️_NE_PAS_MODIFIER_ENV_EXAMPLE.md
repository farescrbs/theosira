# ⚠️ NE PAS MODIFIER `.env.example`

## 🛑 **IMPORTANT**

Le fichier `.env.example` est un **fichier de configuration**.

Il contient **UNIQUEMENT** des variables d'environnement.

---

## ❌ **NE PAS METTRE DANS `.env.example`**

```
❌ npm run dev
❌ npm install
❌ npm run build
❌ node scripts/deploy.js
❌ python backend/bot.py

❌ pragma solidity ^0.8.10;
❌ contract ThesoriaFlashLoan { ... }
❌ function executeFlashLoan() { ... }

❌ import React from 'react';
❌ export default function App() { ... }
❌ const myVar = 123;

❌ import sys
❌ def main(): ...
❌ print("Hello")

❌ Texte libre ou instructions
```

---

## ✅ **METTRE UNIQUEMENT DANS `.env.example`**

```env
✅ VITE_APP_NAME=THESORIA
✅ VITE_AAVE_API_URL=https://aave-api-v2.aave.com
✅ VITE_WALLET_CONNECT_PROJECT_ID=abc123
✅ VITE_ENV=production
✅ VITE_MIN_PROFIT_THRESHOLD=0.01
```

**Format : `NOM_VARIABLE=valeur`**

---

## 📋 **RÈGLES SIMPLES**

### **1. `.env.example` = Configuration**

C'est comme un fichier de paramètres pour votre application.

**Exemple :**
```env
VITE_APP_NAME=THESORIA
VITE_API_URL=https://api.example.com
VITE_DEBUG=false
```

### **2. Commandes = Terminal**

Les commandes `npm run dev`, `npm install`, etc. se tapent dans le **terminal**.

**Exemple :**
```bash
# Dans le terminal :
npm run dev
npm install
npm run build
```

### **3. Code = Fichiers de code**

Le code Solidity, JavaScript, Python, etc. va dans des fichiers `.sol`, `.tsx`, `.py`.

**Exemple :**
```solidity
// Dans contracts/ThesoriaFlashLoan.sol :
pragma solidity ^0.8.10;
contract ThesoriaFlashLoan { ... }
```

```typescript
// Dans components/AavePage.tsx :
import React from 'react';
export default function AavePage() { ... }
```

---

## 🗂️ **OÙ METTRE QUOI ?**

| Type de contenu | Fichier / Emplacement |
|-----------------|----------------------|
| Variables d'environnement (API keys, URLs) | `.env.example` |
| Smart Contracts Solidity | `contracts/*.sol` |
| Composants React | `components/*.tsx` |
| Scripts JavaScript | `scripts/*.js` |
| Scripts Python | `backend/*.py` ou `scripts/*.py` |
| Documentation | `*.md` (Markdown) |
| **Commandes npm/bash** | **TERMINAL** |

---

## 💡 **EXEMPLES CONCRETS**

### **Exemple 1 : Ajouter une API key**

**✅ CORRECT :**

Dans `.env.example` :
```env
VITE_ALCHEMY_API_KEY=your_api_key_here
```

**❌ INCORRECT :**

Dans `.env.example` :
```
import { alchemyApiKey } from './config';
```

---

### **Exemple 2 : Lancer le serveur**

**✅ CORRECT :**

Dans le **terminal** :
```bash
npm run dev
```

**❌ INCORRECT :**

Dans `.env.example` :
```
npm run dev
```

---

### **Exemple 3 : Créer un smart contract**

**✅ CORRECT :**

Créer le fichier `contracts/MyContract.sol` :
```solidity
pragma solidity ^0.8.10;
contract MyContract { ... }
```

**❌ INCORRECT :**

Dans `.env.example` :
```
pragma solidity ^0.8.10;
contract MyContract { ... }
```

---

## 🎯 **EN RÉSUMÉ**

### **`.env.example` :**
```env
CLE1=valeur1
CLE2=valeur2
CLE3=valeur3
```

### **Terminal :**
```bash
npm run dev
npm install
npm run build
```

### **Fichiers de code :**
```
contracts/*.sol
components/*.tsx
scripts/*.js
backend/*.py
```

---

## 🚀 **POUR LANCER THESORIA**

**NE PAS modifier `.env.example`**

**À LA PLACE :**

1. **Ouvrir le terminal**
2. **Taper :** `npm run dev`
3. **Ouvrir :** `http://localhost:5173/`

---

## 📚 **GUIDES DISPONIBLES**

Si vous voulez lancer THESORIA, consultez :

- **`START_HERE.md`** - Guide ultra-rapide (3 étapes)
- **`GUIDE_RAPIDE.md`** - Guide en 4 étapes
- **`🚀_COMMENT_LANCER_THESORIA.md`** - Guide complet

---

## ⚠️ **SI VOUS AVEZ MODIFIÉ `.env.example`**

**Pas de panique !**

L'assistant va le recréer automatiquement avec le bon contenu.

**Mais à l'avenir :**
- ❌ Ne pas mettre de commandes dedans
- ❌ Ne pas mettre de code dedans
- ✅ Mettre UNIQUEMENT des variables : `CLE=valeur`

---

## 🎓 **COMPRENDRE LES TYPES DE FICHIERS**

### **Fichiers de configuration (.env, .json, .yml)**
```
.env.example
package.json
vercel.json
```
→ Contiennent des **paramètres**

### **Fichiers de code (.sol, .tsx, .js, .py)**
```
contracts/ThesoriaFlashLoan.sol
components/AavePage.tsx
scripts/deploy.js
backend/bot.py
```
→ Contiennent du **code** (logique, fonctions)

### **Fichiers de documentation (.md, .txt)**
```
README.md
GUIDE_RAPIDE.md
START_HERE.md
```
→ Contiennent des **instructions** pour les humains

---

## ✅ **CHECKLIST**

Avant de modifier un fichier, demandez-vous :

- [ ] Est-ce un fichier de **configuration** ?
  - → Mettre des variables : `CLE=valeur`

- [ ] Est-ce un fichier de **code** ?
  - → Mettre du code (Solidity, JavaScript, Python, etc.)

- [ ] Est-ce une **commande** ?
  - → La taper dans le **terminal**

---

## 🎉 **C'EST CLAIR MAINTENANT ?**

**Pour lancer THESORIA :**

1. **NE PAS** toucher à `.env.example`
2. **Ouvrir le terminal**
3. **Taper :** `npm run dev`
4. **Ouvrir :** `http://localhost:5173/`

---

💎 **THESORIA - Ne modifiez pas .env.example !** 💎
