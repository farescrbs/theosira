# 🎓 FORMATION RAPIDE - TYPES DE FICHIERS

## 📊 **DIAGRAMME VISUEL**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                    THESORIA PROJECT                            │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📦 FICHIERS DE CONFIGURATION                                 │
│  ════════════════════════════════════════                     │
│                                                                │
│  📄 .env.example                                               │
│     ├─ VITE_APP_NAME=THESORIA                                 │
│     ├─ VITE_AAVE_API_URL=https://...                          │
│     └─ VITE_ENV=production                                    │
│                                                                │
│  📄 package.json                                               │
│     ├─ "name": "thesoria"                                     │
│     ├─ "version": "3.0.0"                                     │
│     └─ "dependencies": { ... }                                │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  💻 FICHIERS DE CODE                                          │
│  ════════════════════════════════════════                     │
│                                                                │
│  📁 contracts/                                                 │
│     └─ 📜 ThesoriaFlashLoan.sol                               │
│         ├─ pragma solidity ^0.8.10;                           │
│         └─ contract ThesoriaFlashLoan { ... }                 │
│                                                                │
│  📁 components/                                                │
│     └─ ⚛️  AavePage.tsx                                        │
│         ├─ import React from 'react';                         │
│         └─ export default function AavePage() { ... }         │
│                                                                │
│  📁 backend/                                                   │
│     └─ 🐍 bot.py                                               │
│         ├─ import sys                                         │
│         └─ def main(): ...                                    │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ⌨️  COMMANDES (TERMINAL)                                      │
│  ════════════════════════════════════════                     │
│                                                                │
│  $ npm run dev          ← Lancer le serveur                   │
│  $ npm install          ← Installer dépendances               │
│  $ npm run build        ← Builder le projet                   │
│  $ git add .            ← Git add                             │
│  $ git commit -m "..."  ← Git commit                          │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📚 DOCUMENTATION                                             │
│  ════════════════════════════════════════                     │
│                                                                │
│  📖 START_HERE.md                                              │
│  📖 GUIDE_RAPIDE.md                                            │
│  📖 README.md                                                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **RÈGLE SIMPLE**

### **1. `.env.example` = VARIABLES SEULEMENT**

```env
✅ CLE=valeur
✅ AUTRE_CLE=autre_valeur

❌ npm run dev
❌ pragma solidity
❌ import React
```

---

### **2. Commandes = TERMINAL SEULEMENT**

```bash
✅ npm run dev
✅ npm install
✅ git add .

❌ Ne pas mettre dans .env.example
❌ Ne pas mettre dans un fichier .sol
❌ Ne pas mettre dans un fichier .tsx
```

---

### **3. Code = FICHIERS .sol / .tsx / .js / .py**

```solidity
✅ Dans contracts/MyContract.sol :
   pragma solidity ^0.8.10;
   contract MyContract { ... }
```

```typescript
✅ Dans components/MyComponent.tsx :
   import React from 'react';
   export default function MyComponent() { ... }
```

```python
✅ Dans backend/bot.py :
   import sys
   def main(): ...
```

---

## 📋 **EXEMPLES CONCRETS**

### **Exemple 1 : Ajouter une variable d'environnement**

**Situation :** Je veux ajouter ma clé API Alchemy.

**Solution :**

Dans `.env.example` :
```env
VITE_ALCHEMY_API_KEY=your_api_key_here
```

**❌ Ne pas faire :**
```javascript
const ALCHEMY_API_KEY = "your_api_key_here";
```

---

### **Exemple 2 : Lancer le serveur**

**Situation :** Je veux voir mon site en local.

**Solution :**

Dans le **terminal** :
```bash
npm run dev
```

**❌ Ne pas faire :**

Dans `.env.example` :
```
npm run dev
```

---

### **Exemple 3 : Créer un smart contract**

**Situation :** Je veux créer un nouveau contrat Solidity.

**Solution :**

Créer `contracts/MonContrat.sol` :
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract MonContrat {
    function maFonction() public {
        // Logique ici
    }
}
```

**❌ Ne pas faire :**

Dans `.env.example` :
```
pragma solidity ^0.8.10;
contract MonContrat { ... }
```

---

### **Exemple 4 : Créer un composant React**

**Situation :** Je veux créer une nouvelle page.

**Solution :**

Créer `components/MaPage.tsx` :
```typescript
import React from 'react';

export default function MaPage() {
  return (
    <div>
      <h1>Ma nouvelle page</h1>
    </div>
  );
}
```

**❌ Ne pas faire :**

Dans `.env.example` :
```
import React from 'react';
export default function MaPage() { ... }
```

---

## 🗂️ **STRUCTURE VISUELLE**

```
THESORIA/
│
├─ ⚙️  .env.example              ← Variables : CLE=valeur
├─ ⚙️  package.json              ← Config npm
├─ ⚙️  vercel.json               ← Config Vercel
│
├─ ⚛️  App.tsx                   ← Code React
├─ ⚛️  main.tsx                  ← Code React
│
├─ 📁 contracts/
│  ├─ 📜 ThesoriaFlashLoan.sol  ← Code Solidity
│  ├─ 📜 FlashLoanReceiverBase.sol
│  └─ 📁 interfaces/
│     ├─ 📜 IFlashLoanReceiver.sol
│     ├─ 📜 IPool.sol
│     └─ 📜 IPoolAddressesProvider.sol
│
├─ 📁 components/
│  ├─ ⚛️  AavePage.tsx           ← Code React
│  ├─ ⚛️  FlashLoanSection.tsx
│  └─ 📁 aave/
│     ├─ ⚛️  AaveFlashLoanPanel.tsx
│     ├─ ⚛️  AavePoolsOverview.tsx
│     └─ ⚛️  AaveStakingPanel.tsx
│
├─ 📁 backend/
│  ├─ 🐍 bot.py                  ← Code Python
│  ├─ 🐍 god_mode_bot.py
│  └─ 🐍 zero_capital_bot.py
│
├─ 📁 scripts/
│  └─ 📜 deploy.js               ← Script JavaScript
│
└─ 📚 README.md                   ← Documentation
```

---

## ⚠️ **ERREURS À ÉVITER**

### **❌ Erreur 1**

Mettre des commandes dans `.env.example` :

```
npm run dev
npm install
```

**✅ Solution :** Les taper dans le **terminal**

---

### **❌ Erreur 2**

Mettre du code dans `.env.example` :

```
pragma solidity ^0.8.10;
import React from 'react';
const myVar = 123;
```

**✅ Solution :** Créer des fichiers `.sol`, `.tsx`, `.js`

---

### **❌ Erreur 3**

Mettre des variables dans le code :

```javascript
const API_URL = "https://api.example.com";
```

**✅ Solution :** Les mettre dans `.env.example` :

```env
VITE_API_URL=https://api.example.com
```

---

## 🎓 **QUIZ RAPIDE**

### **Question 1 :**
Où mettre `VITE_APP_NAME=THESORIA` ?

**A)** Terminal  
**B)** `.env.example`  
**C)** `App.tsx`  

**Réponse :** B) `.env.example` ✅

---

### **Question 2 :**
Où taper `npm run dev` ?

**A)** `.env.example`  
**B)** `package.json`  
**C)** Terminal  

**Réponse :** C) Terminal ✅

---

### **Question 3 :**
Où mettre du code Solidity ?

**A)** `.env.example`  
**B)** `contracts/MonContrat.sol`  
**C)** Terminal  

**Réponse :** B) `contracts/MonContrat.sol` ✅

---

## 🚀 **LANCER THESORIA**

**Maintenant que vous comprenez, lancez THESORIA :**

**1. Ouvrir le Terminal**

```
Windows : Windows + R → cmd → Entrée
Mac     : Cmd + Espace → Terminal → Entrée
VS Code : Ctrl + ù
```

**2. Taper**

```bash
npm run dev
```

**3. Ouvrir**

```
http://localhost:5173/
```

---

## ✅ **RÉSUMÉ FINAL**

```
┌─────────────────────────────────────────┐
│                                         │
│  .env.example    →  CLE=valeur          │
│  Terminal        →  npm run dev         │
│  contracts/*.sol →  pragma solidity     │
│  components/*.tsx →  import React       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎉 **FÉLICITATIONS !**

Vous avez appris :

✅ Où mettre les variables (`.env.example`)  
✅ Où taper les commandes (Terminal)  
✅ Où mettre le code (fichiers `.sol`, `.tsx`, `.js`, `.py`)  

**Maintenant, lancez THESORIA !**

```bash
npm run dev
```

💎 **THESORIA** 💎
