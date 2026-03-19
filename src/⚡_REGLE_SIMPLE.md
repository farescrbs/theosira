# ⚡ RÈGLE SIMPLE

## 🎯 **UNE SEULE RÈGLE À RETENIR**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  .env.example = VARIABLES UNIQUEMENT            │
│                                                 │
│  Format : CLE=valeur                            │
│                                                 │
│  Exemple : VITE_APP_NAME=THESORIA               │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ❌ **NE JAMAIS METTRE DANS `.env.example`**

- Liens ou URLs
- Commandes (npm, git, etc.)
- Code (Solidity, JavaScript, Python, etc.)
- Notes ou TODO

---

## ✅ **À LA PLACE**

| Quoi | Où |
|------|-----|
| Liens/URLs | **`REFERENCES.md`** |
| Commandes | **Terminal** |
| Code | **Fichiers `.sol` / `.tsx` / `.py`** |
| Notes | **`NOTES.md`** |

---

## 📖 **EXEMPLES**

### **Vous trouvez un lien GitHub utile**

```
https://github.com/aave/aave-v3-core
```

**✅ Mettre dans :** `REFERENCES.md`  
**❌ Ne PAS mettre dans :** `.env.example`

---

### **Vous voulez ajouter une API key**

```
VITE_ALCHEMY_API_KEY=abc123
```

**✅ Mettre dans :** `.env.example`  
**❌ Ne PAS mettre dans :** `REFERENCES.md`

---

### **Vous voulez lancer le serveur**

```
npm run dev
```

**✅ Taper dans :** Terminal  
**❌ Ne PAS mettre dans :** `.env.example`

---

## 🚀 **POUR LANCER THESORIA**

**Ouvrir le terminal et taper :**

```bash
npm run dev
```

**Puis ouvrir :** `http://localhost:5173/`

---

💎 **THESORIA - Simple et clair !** 💎
