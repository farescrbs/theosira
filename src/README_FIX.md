# ⚡ FIX RAPIDE - 3 COMMANDES

## 🚨 Tu as l'erreur "HeroSection is not defined" ?

### ✅ **SOLUTION EN 3 ÉTAPES :**

#### **1️⃣ Arrêter le serveur**
```bash
Ctrl + C
```
*(Dans le terminal où `npm run dev` tourne)*

---

#### **2️⃣ Nettoyer le cache**

**Windows :**
```bash
# Double-cliquer sur :
clean-cache.bat
```

**Mac/Linux :**
```bash
./clean-cache.sh
```

**Ou manuellement :**
```bash
rm -rf node_modules/.vite dist .vite
```

---

#### **3️⃣ Redémarrer**
```bash
npm run dev
```

Puis dans le **navigateur** :
- Ouvrir : http://localhost:3000
- **Hard Refresh** : `Ctrl + Shift + R`

---

## ✅ C'EST TOUT !

**L'app devrait maintenant fonctionner sans erreur !**

---

## 📚 Plus de détails ?

- **Guide complet** : `SOLUTION_ERREUR_HEROSECTION.md`
- **Cache Vite** : `FIX_CACHE.md`
- **Démarrage** : `DEMARRAGE_RAPIDE.md`

---

## 🔥 TL;DR

```bash
# Arrêter
Ctrl + C

# Nettoyer
rm -rf node_modules/.vite dist

# Relancer
npm run dev

# Navigateur : Ctrl + Shift + R
```

**Done! 🚀**
