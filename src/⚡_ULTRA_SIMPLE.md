# ⚡ ULTRA SIMPLE

## 📝 VOUS VOULEZ NOTER QUELQUE CHOSE ?

### ✅ OUVRIR `NOTES.md`

```
Exemple :
"mode reel"
"god mode"
"production"
"TODO: faire X"
```

---

## 🔧 VOUS VOULEZ CONFIGURER ?

### ✅ OUVRIR `.env.example`

**FORMAT OBLIGATOIRE :**

```env
CLE=valeur
```

**EXEMPLES :**

```env
VITE_MODE=real_production
VITE_GOD_MODE=true
VITE_API_KEY=abc123
```

---

## 🚫 NE JAMAIS FAIRE

### ❌ `.env.example`

```
mode reel          ← NON
production reel    ← NON
god mode           ← NON
TODO: ...          ← NON
https://...        ← NON
```

### ✅ `NOTES.md`

```markdown
## Mode Réel

- Production réelle
- God mode activé
- TODO: tester
```

---

## 🎯 RÈGLE FINALE

```
╔═══════════════════════════════════════╗
║                                       ║
║  Texte libre → NOTES.md               ║
║  Variables   → .env.example           ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## ✅ TOUT EST DÉJÀ CONFIGURÉ

**Mode réel est ACTIVÉ dans `.env.example` :**

```env
VITE_MODE=real_production
VITE_GOD_MODE=true
```

**Plus besoin de modifier !**

---

## 🚀 LANCER THESORIA

```bash
npm run dev
```

---

💎 **C'EST TOUT !** 💎
