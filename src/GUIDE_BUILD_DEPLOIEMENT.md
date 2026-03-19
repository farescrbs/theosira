# 🚀 GUIDE DE BUILD ET DÉPLOIEMENT THESORIA

## 📋 TABLE DES MATIÈRES
1. [Build Local](#build-local)
2. [Déploiement Vercel](#déploiement-vercel)
3. [Résolution des Problèmes](#résolution-des-problèmes)

---

## 🏗️ BUILD LOCAL

### Option 1 : Utiliser le Script Automatique (Recommandé)

#### Windows
```batch
# Double-cliquer sur :
build-vercel.bat

# Ou en ligne de commande :
.\build-vercel.bat
```

#### Linux/Mac
```bash
chmod +x build-vercel.sh
./build-vercel.sh
```

### Option 2 : Commandes Manuelles

```batch
# 1. Nettoyer
rmdir /s /q dist
rmdir /s /q node_modules\.vite

# 2. Installer (si besoin)
npm install

# 3. Build
npm run build

# 4. Vérifier
dir dist
```

### Résultat Attendu

Après le build, vous devriez voir :

```
✅ BUILD RÉUSSI !

📂 Structure du dossier dist/ :
   dist/
   ├── index.html          ✅ Page principale
   ├── assets/
   │   ├── index-abc123.js ✅ JavaScript
   │   └── index-def456.css ✅ Styles
   └── public/
       └── contracts/
           └── deployment.json

📊 Taille totale : ~2-5 MB
```

---

## 🌐 DÉPLOIEMENT VERCEL

### Méthode 1 : Via Vercel CLI (Recommandé)

```batch
# 1. Installer Vercel CLI (une seule fois)
npm install -g vercel

# 2. Se connecter
vercel login
# Suivre les instructions (email + code)

# 3. Build + Déployer
npm run build
vercel --prod

# Résultat :
# ✅ Deployed to production: https://thesoria-xyz.vercel.app
```

### Méthode 2 : Via GitHub (Auto-Deploy)

#### Étape 1 : Créer un Repo GitHub

```batch
# 1. Créer un repo sur github.com
#    Nom suggéré : thesoria-web3-platform

# 2. Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "🚀 Initial commit - THESORIA Platform"

# 3. Lier au repo
git remote add origin https://github.com/VOTRE_USERNAME/thesoria-web3-platform.git
git branch -M main
git push -u origin main
```

#### Étape 2 : Connecter Vercel

1. Aller sur https://vercel.com
2. Cliquer "Import Project"
3. Sélectionner votre repo GitHub
4. Configuration automatique détectée ✅
5. Cliquer "Deploy"

#### Étape 3 : Configuration Environnement

Dans Vercel Dashboard → Settings → Environment Variables :

```env
VITE_APP_NAME=THESORIA
VITE_APP_VERSION=3.0.0
VITE_ALCHEMY_API_KEY=XUbdW3HgRyDHALSbpyjPr
VITE_ETHERSCAN_API_KEY=F9F4JPNB5UC6E5M79IY6DIBP58J4I7BRQ3
```

**⚠️ NE JAMAIS METTRE :**
- PRIVATE_KEY (côté serveur uniquement)
- Seed phrases
- Clés secrètes sensibles

---

## ⚙️ CONFIGURATION AVANCÉE

### vite.config.js (Déjà Configuré ✅)

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',                    // ✅ Dossier de sortie
    chunkSizeWarningLimit: 2000,      // ✅ Limite warnings
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['motion/react'],
          'ui-vendor': ['lucide-react', 'recharts'],
          'ethers-vendor': ['ethers'],
        },
      },
    },
  },
});
```

### vercel.json (Déjà Configuré ✅)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",          // ✅ Correspond à vite.config.js
  "installCommand": "npm install"
}
```

---

## 🐛 RÉSOLUTION DES PROBLÈMES

### ❌ Erreur : "No output directory named 'dist' found"

**Cause :** Le build n'a pas été exécuté ou a échoué.

**Solution :**
```batch
# 1. Nettoyer
rmdir /s /q dist

# 2. Réinstaller
npm ci

# 3. Build
npm run build

# 4. Vérifier
dir dist
```

### ⚠️ Warning : "Chunk size warning limit"

**Cause :** Un fichier JavaScript dépasse 500 KB (limite par défaut).

**Solution :** Déjà corrigé dans `vite.config.js` avec `chunkSizeWarningLimit: 2000`.

Si le warning persiste, augmenter encore :
```javascript
build: {
  chunkSizeWarningLimit: 3000, // 3 MB
}
```

### ❌ Erreur : "Failed to resolve module"

**Cause :** Dépendance manquante.

**Solution :**
```batch
# 1. Nettoyer
rmdir /s /q node_modules
del package-lock.json

# 2. Réinstaller
npm install

# 3. Build
npm run build
```

### ❌ Erreur : "Out of memory"

**Cause :** Node.js manque de mémoire pour build.

**Solution :**
```batch
# Windows
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

# Linux/Mac
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### ❌ Erreur : "ENOSPC: System limit for number of file watchers reached"

**Cause :** Linux uniquement, trop de fichiers surveillés.

**Solution :**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 📊 OPTIMISATION DU BUILD

### Réduire la Taille du Bundle

#### 1. Code Splitting Automatique (Déjà Activé ✅)

```javascript
rollupOptions: {
  output: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom'],     // ~150 KB
      'motion-vendor': ['motion/react'],          // ~100 KB
      'ui-vendor': ['lucide-react', 'recharts'],  // ~200 KB
      'ethers-vendor': ['ethers'],                // ~500 KB
    },
  },
}
```

#### 2. Minification (Déjà Activée ✅)

```javascript
build: {
  minify: 'terser', // Compression maximale
}
```

#### 3. Tree Shaking (Automatique ✅)

Vite élimine automatiquement le code non utilisé.

#### 4. Lazy Loading (Optionnel)

Pour charger les composants à la demande :

```typescript
// Au lieu de :
import { HeroSection } from './components/HeroSection'

// Utiliser :
const HeroSection = React.lazy(() => import('./components/HeroSection'))
```

### Analyser le Bundle

```batch
# Installer l'analyseur
npm install -D rollup-plugin-visualizer

# Ajouter à vite.config.js :
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  react(),
  visualizer({ open: true }) // Ouvre automatiquement le rapport
]

# Build
npm run build
# → Ouvre stats.html avec visualisation
```

---

## 🎯 CHECKLIST AVANT DÉPLOIEMENT

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║        📋 CHECKLIST PRÉ-DÉPLOIEMENT 📋                          ║
║                                                                  ║
║  Build Local                                                     ║
║  ├─ ⬜ npm install réussi                                      ║
║  ├─ ⬜ npm run build réussi                                    ║
║  ├─ ⬜ dist/ créé                                              ║
║  ├─ ⬜ dist/index.html existe                                  ║
║  └─ ⬜ Taille < 10 MB                                          ║
║                                                                  ║
║  Configuration                                                   ║
║  ├─ ⬜ vite.config.js : outDir = 'dist'                        ║
║  ├─ ⬜ vercel.json : outputDirectory = 'dist'                  ║
║  ├─ ⬜ public/contracts/deployment.json existe                 ║
║  └─ ⬜ Variables d'environnement configurées                   ║
║                                                                  ║
║  Smart Contract                                                  ║
║  ├─ ⬜ Contrat déployé sur Polygon                             ║
║  ├─ ⬜ Adresse copiée dans deployment.json                     ║
║  └─ ⬜ Contrat vérifié sur PolygonScan                         ║
║                                                                  ║
║  Vercel                                                          ║
║  ├─ ⬜ Compte Vercel créé                                      ║
║  ├─ ⬜ Repo GitHub lié (ou Vercel CLI installé)                ║
║  └─ ⬜ Variables d'env configurées                             ║
║                                                                  ║
║  Tests                                                           ║
║  ├─ ⬜ npm run preview fonctionne                              ║
║  ├─ ⬜ Connexion MetaMask OK                                   ║
║  └─ ⬜ Aucune erreur console                                   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🚀 COMMANDES RAPIDES

### Build Complet
```batch
npm run build
```

### Preview Local (Tester le Build)
```batch
npm run preview
# Ouvrir http://localhost:4173
```

### Déployer sur Vercel
```batch
vercel --prod
```

### Nettoyer et Rebuild
```batch
rmdir /s /q dist node_modules
npm install
npm run build
```

---

## 📈 APRÈS DÉPLOIEMENT

### Vérifier le Déploiement

1. ✅ **URL accessible** : https://votre-projet.vercel.app
2. ✅ **Connexion MetaMask** fonctionne
3. ✅ **Smart contract** détecté
4. ✅ **Aucune erreur** dans la console
5. ✅ **Performance** : Lighthouse > 90

### Monitoring

- **Vercel Analytics** : Dashboard → Analytics
- **Real User Monitoring** : Temps de chargement réel
- **Error Tracking** : Vercel Dashboard → Logs

### Mises à Jour

```batch
# 1. Faire des modifications localement
# 2. Build + Test
npm run build
npm run preview

# 3. Commit + Push (si GitHub)
git add .
git commit -m "✨ Update features"
git push

# Vercel déploie automatiquement ✅

# OU via CLI
vercel --prod
```

---

## 🎉 RÉSUMÉ - COMMANDES ESSENTIELLES

```batch
# ═══════════════════════════════════════════════════════════════
# 🚀 WORKFLOW COMPLET
# ═══════════════════════════════════════════════════════════════

# 1. DÉVELOPPEMENT LOCAL
npm run dev                # Dev server : http://localhost:5173

# 2. BUILD PRODUCTION
npm run build              # Compile vers dist/

# 3. PRÉVISUALISER
npm run preview            # Test build : http://localhost:4173

# 4. DÉPLOYER
vercel --prod              # Deploy sur Vercel

# ═══════════════════════════════════════════════════════════════
```

---

**✅ Tout est configuré ! Lancez simplement `npm run build` ! 🚀**
