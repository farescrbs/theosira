# 📋 OÙ METTRE QUOI ?

## 🎯 **GUIDE VISUEL ULTRA-SIMPLE**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  TYPE DE CONTENU              →  FICHIER / EMPLACEMENT     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Variables (API keys)         →  .env.example              │
│  Liens et URLs                →  REFERENCES.md             │
│  Commandes (npm run dev)      →  TERMINAL                  │
│  Smart Contracts              →  contracts/*.sol           │
│  Composants React             →  components/*.tsx          │
│  Scripts Python               →  backend/*.py              │
│  Notes et TODO                →  NOTES.md ou TODO.md       │
│  Documentation                →  *.md (Markdown)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📖 **EXEMPLES CONCRETS**

### **1. Je veux garder un lien GitHub**

**❓ Contenu :**
```
https://github.com/aave/aave-v3-core/tree/master/contracts/flashloan
```

**✅ Où le mettre ?**
→ **`REFERENCES.md`**

**❌ Ne PAS mettre dans :**
- `.env.example`
- `contracts/ThesoriaFlashLoan.sol`
- Terminal

---

### **2. Je veux configurer une API key**

**❓ Contenu :**
```
VITE_ALCHEMY_API_KEY=abc123xyz
```

**✅ Où le mettre ?**
→ **`.env.example`**

**❌ Ne PAS mettre dans :**
- `REFERENCES.md`
- Terminal
- `App.tsx`

---

### **3. Je veux lancer le serveur**

**❓ Contenu :**
```
npm run dev
```

**✅ Où le mettre ?**
→ **TERMINAL** (à taper)

**❌ Ne PAS mettre dans :**
- `.env.example`
- `REFERENCES.md`
- Aucun fichier !

---

### **4. Je veux créer un smart contract**

**❓ Contenu :**
```solidity
pragma solidity ^0.8.10;
contract MonContrat { ... }
```

**✅ Où le mettre ?**
→ **`contracts/MonContrat.sol`** (nouveau fichier)

**❌ Ne PAS mettre dans :**
- `.env.example`
- `REFERENCES.md`
- Terminal

---

### **5. Je veux noter des idées ou TODO**

**❓ Contenu :**
```
TODO:
- Ajouter la fonctionnalité X
- Tester le déploiement
- Corriger le bug Y
```

**✅ Où le mettre ?**
→ **`NOTES.md`** ou **`TODO.md`** (créer le fichier)

**❌ Ne PAS mettre dans :**
- `.env.example`
- `contracts/*.sol`
- Terminal

---

### **6. Je veux garder plusieurs liens utiles**

**❓ Contenu :**
```
https://docs.aave.com/
https://docs.uniswap.org/
https://docs.flashbots.net/
```

**✅ Où le mettre ?**
→ **`REFERENCES.md`** (déjà créé !)

**❌ Ne PAS mettre dans :**
- `.env.example`
- Terminal
- `App.tsx`

---

### **7. Je veux créer un composant React**

**❓ Contenu :**
```typescript
import React from 'react';
export default function MaPage() { ... }
```

**✅ Où le mettre ?**
→ **`components/MaPage.tsx`** (nouveau fichier)

**❌ Ne PAS mettre dans :**
- `.env.example`
- `REFERENCES.md`
- Terminal

---

### **8. Je veux écrire de la documentation**

**❓ Contenu :**
```
# Guide d'utilisation
Voici comment utiliser...
```

**✅ Où le mettre ?**
→ **`MON_GUIDE.md`** (nouveau fichier Markdown)

**❌ Ne PAS mettre dans :**
- `.env.example`
- `contracts/*.sol`
- Terminal

---

## 🗂️ **TABLEAU RÉCAPITULATIF**

| Type de contenu | Exemple | Fichier |
|-----------------|---------|---------|
| **Variables** | `VITE_APP_NAME=THESORIA` | `.env.example` |
| **Liens/URLs** | `https://github.com/...` | `REFERENCES.md` |
| **Commandes** | `npm run dev` | **TERMINAL** |
| **Smart Contracts** | `pragma solidity` | `contracts/*.sol` |
| **React** | `import React` | `components/*.tsx` |
| **Python** | `import sys` | `backend/*.py` |
| **Notes** | `TODO: faire X` | `NOTES.md` |
| **Documentation** | `# Guide...` | `*.md` |

---

## ⚠️ **CE QU'ON NE MET JAMAIS DANS `.env.example`**

```
❌ https://github.com/aave/aave-v3-core
❌ npm run dev
❌ npm install
❌ pragma solidity ^0.8.10;
❌ import React from 'react';
❌ import sys
❌ TODO: ajouter la fonctionnalité X
❌ Notes personnelles
❌ Code de quelque nature que ce soit
❌ Documentation
```

---

## ✅ **CE QU'ON MET DANS `.env.example`**

```env
✅ VITE_APP_NAME=THESORIA
✅ VITE_API_URL=https://api.example.com
✅ VITE_DEBUG=false
✅ VITE_PORT=3000
✅ VITE_ENABLE_FEATURE=true
```

**Format uniquement :** `CLE=valeur`

---

## 📚 **FICHIERS SPÉCIALISÉS**

### **`.env.example`**
**Usage :** Variables d'environnement
**Format :** `CLE=valeur`
**Exemple :** `VITE_APP_NAME=THESORIA`

---

### **`REFERENCES.md`**
**Usage :** Liens, URLs, références
**Format :** Markdown avec liens
**Exemple :**
```markdown
### Aave V3
https://github.com/aave/aave-v3-core
```

---

### **`NOTES.md`** ou **`TODO.md`**
**Usage :** Notes personnelles, TODO
**Format :** Markdown libre
**Exemple :**
```markdown
## TODO
- [ ] Tester le déploiement
- [ ] Corriger le bug X
```

---

### **`contracts/*.sol`**
**Usage :** Smart Contracts Solidity
**Format :** Code Solidity
**Exemple :**
```solidity
pragma solidity ^0.8.10;
contract MyContract { ... }
```

---

### **`components/*.tsx`**
**Usage :** Composants React
**Format :** Code TypeScript/React
**Exemple :**
```typescript
import React from 'react';
export default function MyComponent() { ... }
```

---

### **Terminal**
**Usage :** Exécuter des commandes
**Format :** Commandes bash/shell
**Exemple :**
```bash
npm run dev
npm install
git add .
```

---

## 🎯 **WORKFLOW RECOMMANDÉ**

### **Étape 1 : Identifier le type de contenu**

Demandez-vous :
- Est-ce une **variable** ? → `.env.example`
- Est-ce un **lien** ? → `REFERENCES.md`
- Est-ce une **commande** ? → Terminal
- Est-ce du **code** ? → Fichier approprié (`.sol`, `.tsx`, `.py`)
- Est-ce une **note** ? → `NOTES.md`

---

### **Étape 2 : Choisir le bon fichier**

Consultez le tableau ci-dessus.

---

### **Étape 3 : Ajouter le contenu au bon endroit**

Ne mélangez jamais les types !

---

## ✅ **EXEMPLES DE BONNE PRATIQUE**

### **Scénario : Vous trouvez un lien GitHub utile**

**✅ CORRECT :**

1. Ouvrir `REFERENCES.md`
2. Ajouter :
```markdown
### Mon Nouveau Projet
https://github.com/projet/repo

Description : Ce projet fait...
```

**❌ INCORRECT :**

Ajouter dans `.env.example` :
```
https://github.com/projet/repo
```

---

### **Scénario : Vous voulez configurer une nouvelle API**

**✅ CORRECT :**

1. Ouvrir `.env.example`
2. Ajouter :
```env
VITE_NEW_API_KEY=your_key_here
VITE_NEW_API_URL=https://api.newservice.com
```

**❌ INCORRECT :**

Créer un fichier `api-config.txt` :
```
NEW_API_KEY=your_key_here
```

---

### **Scénario : Vous voulez installer un package**

**✅ CORRECT :**

Dans le **terminal** :
```bash
npm install package-name
```

**❌ INCORRECT :**

Ajouter dans `.env.example` :
```
npm install package-name
```

---

## 🎓 **QUIZ RAPIDE**

### **Q1 : Où mettre `https://docs.aave.com/` ?**

**A)** `.env.example`  
**B)** `REFERENCES.md`  
**C)** Terminal  

**Réponse :** B) `REFERENCES.md` ✅

---

### **Q2 : Où mettre `VITE_DEBUG=true` ?**

**A)** `.env.example`  
**B)** `REFERENCES.md`  
**C)** `App.tsx`  

**Réponse :** A) `.env.example` ✅

---

### **Q3 : Où taper `npm run dev` ?**

**A)** `.env.example`  
**B)** `REFERENCES.md`  
**C)** Terminal  

**Réponse :** C) Terminal ✅

---

### **Q4 : Où mettre `TODO: tester le déploiement` ?**

**A)** `.env.example`  
**B)** `TODO.md`  
**C)** Terminal  

**Réponse :** B) `TODO.md` ✅

---

## 🚀 **EN RÉSUMÉ**

```
Variables          →  .env.example
Liens/URLs         →  REFERENCES.md
Commandes          →  TERMINAL
Code Solidity      →  contracts/*.sol
Code React         →  components/*.tsx
Code Python        →  backend/*.py
Notes/TODO         →  NOTES.md / TODO.md
Documentation      →  *.md
```

---

## 💡 **AIDE-MÉMOIRE**

**Avant d'ajouter quelque chose quelque part, demandez-vous :**

1. **Est-ce une configuration ?** → `.env.example`
2. **Est-ce une référence ?** → `REFERENCES.md`
3. **Est-ce une action ?** → Terminal
4. **Est-ce du code ?** → Fichier de code approprié
5. **Est-ce une note ?** → `NOTES.md`

---

💎 **THESORIA - Maintenant vous savez exactement où mettre quoi !** 💎
