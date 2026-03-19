# ⚡ GUIDE RAPIDE - 3 ÉTAPES

## 1️⃣ OUVRIR LE TERMINAL

**Windows :** 
```
Appuyez sur : Windows + R
Tapez : cmd
Appuyez sur : Entrée
```

**Mac :** 
```
Appuyez sur : Cmd + Espace
Tapez : Terminal
Appuyez sur : Entrée
```

**VS Code :**
```
Appuyez sur : Ctrl + ù
(ou menu : Terminal > New Terminal)
```

---

## 2️⃣ ALLER DANS LE DOSSIER

Dans le terminal, tapez :

```bash
cd chemin/vers/THESORIA
```

**Exemple :**
```bash
cd ~/Documents/THESORIA
```

**💡 Astuce :** Glissez-déposez le dossier dans le terminal pour obtenir le chemin.

---

## 3️⃣ LANCER LE SERVEUR

Dans le terminal, tapez :

```bash
npm run dev
```

**⏳ Attendez 2-3 secondes...**

Vous verrez :

```
➜  Local:   http://localhost:5173/
```

---

## 4️⃣ OUVRIR DANS LE NAVIGATEUR

**Faites `Ctrl + Clic`** sur le lien `http://localhost:5173/`

**OU** ouvrez Chrome/Firefox et collez : `http://localhost:5173/`

---

## ✅ SUCCÈS !

Vous devriez voir :

```
╔══════════════════════════════════════╗
║                                      ║
║   💎 THESORIA                        ║
║   Ultra-Premium Blockchain Platform  ║
║                                      ║
╚══════════════════════════════════════╝
```

---

## 🛑 ARRÊTER LE SERVEUR

Dans le terminal :

```
Appuyez sur : Ctrl + C
```

---

## ❌ EN CAS D'ERREUR

### "npm: command not found"

Installez Node.js :
1. Aller sur https://nodejs.org/
2. Télécharger LTS
3. Installer
4. Redémarrer le terminal
5. Réessayer

### "Cannot find module"

Dans le terminal :

```bash
npm install
```

Puis :

```bash
npm run dev
```

---

## 📚 RAPPEL IMPORTANT

### ❌ NE PAS METTRE DANS `.env.example`

```
npm run dev                    ❌
pragma solidity ^0.8.10;       ❌
import React from 'react';     ❌
```

### ✅ METTRE DANS `.env.example`

```env
VITE_APP_NAME=THESORIA                           ✅
VITE_AAVE_API_URL=https://aave-api-v2.aave.com  ✅
```

---

## 🎯 **`.env.example` = FICHIER DE CONFIGURATION**

C'est comme un fichier de paramètres :

```env
VITE_APP_NAME=THESORIA
VITE_ENV=production
VITE_AAVE_API_URL=https://aave-api-v2.aave.com
```

**PAS** de code dedans !

---

## ⌨️ **`npm run dev` = COMMANDE TERMINAL**

C'est une commande que vous **tapez** dans le terminal.

**PAS** dans un fichier !

---

## 🗂️ OÙ METTRE QUOI ?

| Type de contenu | Où le mettre |
|-----------------|--------------|
| Variables (API keys, URLs) | `.env.example` |
| Smart Contracts (Solidity) | `contracts/*.sol` |
| Composants React (Frontend) | `components/*.tsx` |
| Commandes (npm run dev) | **Terminal** |

---

## 🎉 C'EST TOUT !

Maintenant vous savez :

✅ Où mettre les variables (`.env.example`)  
✅ Où mettre les smart contracts (`contracts/`)  
✅ Où taper les commandes (**Terminal**)  
✅ Comment lancer THESORIA (`npm run dev`)

---

💎 **THESORIA - Prêt à lancer !** 💎
