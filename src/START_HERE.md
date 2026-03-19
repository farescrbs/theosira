# 🚀 DÉMARREZ ICI

## ⚡ POUR LANCER THESORIA :

### 1. Ouvrir le Terminal

```
Windows : Touche Windows + R → tapez "cmd" → Entrée
Mac     : Cmd + Espace → tapez "Terminal" → Entrée
VS Code : Ctrl + ù
```

### 2. Taper cette commande

```bash
npm run dev
```

### 3. Ouvrir votre navigateur

```
http://localhost:5173/
```

---

## ✅ C'EST TOUT !

---

## 📚 DOCUMENTATION COMPLÈTE

| Fichier | Description |
|---------|-------------|
| `GUIDE_RAPIDE.md` | Guide en 4 étapes |
| `🚀_COMMENT_LANCER_THESORIA.md` | Guide détaillé avec troubleshooting |
| `🔥_SMART_CONTRACTS_READY.md` | Smart contracts Solidity |
| `✅_INTEGRATION_TERMINEE.md` | Récap complet Aave |

---

## ⚠️ IMPORTANT

### `.env.example` = FICHIER DE CONFIGURATION

**Contient UNIQUEMENT des variables :**

```env
VITE_APP_NAME=THESORIA
VITE_AAVE_API_URL=https://aave-api-v2.aave.com
```

**NE PAS mettre dedans :**
- ❌ `npm run dev`
- ❌ `pragma solidity`
- ❌ `import React`
- ❌ Code JavaScript/Solidity

---

## 📁 STRUCTURE DU PROJET

```
THESORIA/
├── .env.example           ← Variables de config (API keys, URLs)
├── contracts/             ← Smart Contracts Solidity (.sol)
├── components/            ← Composants React (.tsx)
├── App.tsx                ← Application principale
└── package.json           ← Dépendances
```

---

## 🎯 OÙ METTRE QUOI

| Type | Destination |
|------|-------------|
| Variables d'environnement | `.env.example` |
| Smart Contracts Solidity | `contracts/*.sol` |
| Composants React | `components/*.tsx` |
| **Commandes** | **Terminal** (pas dans un fichier !) |

---

## 💡 AIDE

**Erreur "npm: command not found" ?**
→ Installez Node.js : https://nodejs.org/

**Erreur "Cannot find module" ?**
→ Tapez : `npm install` puis `npm run dev`

**Port déjà utilisé ?**
→ Tapez : `npm run dev -- --port 3000`

---

## 🎉 PRÊT !

**Tapez dans le terminal :**

```bash
npm run dev
```

**Puis ouvrez :** `http://localhost:5173/`

💎 **THESORIA** 💎
