# 🚀 CONFIGURATION GITHUB ACTIONS + VERCEL

## 📋 Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `.gitignore` | Exclut node_modules, dist, .env, etc. |
| `.github/workflows/vercel-deploy.yml` | Déploiement auto sur Vercel |
| `.github/workflows/ci-cd.yml` | Pipeline complet (lint + build + deploy) |

---

## ⚙️ Configuration Requise

### 1. Secrets GitHub

Allez dans votre repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Créez ces 3 secrets :

```
VERCEL_TOKEN          = Votre token Vercel
VERCEL_ORG_ID         = ID de votre organisation Vercel
VERCEL_PROJECT_ID     = ID de votre projet Vercel
```

---

## 🔑 Obtenir les Valeurs

### A. VERCEL_TOKEN

1. Aller sur https://vercel.com/account/tokens
2. Cliquer **Create Token**
3. Nom : `GitHub Actions THESORIA`
4. Scope : Full Account
5. Copier le token généré

---

### B. VERCEL_ORG_ID et VERCEL_PROJECT_ID

**Méthode 1 : Via Vercel CLI**

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Les IDs seront dans .vercel/project.json
cat .vercel/project.json
```

**Résultat :**
```json
{
  "orgId": "team_abc123...",
  "projectId": "prj_xyz789..."
}
```

**Méthode 2 : Depuis le Dashboard Vercel**

1. Aller sur https://vercel.com
2. Sélectionner votre projet
3. **Settings** → **General**
4. Copier :
   - **Project ID** (dans l'URL ou en bas de la page)
   - **Team ID** = VERCEL_ORG_ID (Settings → Team)

---

## 📝 Ajouter les Secrets dans GitHub

1. Aller sur votre repo GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquer **New repository secret**
4. Ajouter chaque secret :

```
Name:  VERCEL_TOKEN
Value: [votre token Vercel]

Name:  VERCEL_ORG_ID
Value: team_abc123...

Name:  VERCEL_PROJECT_ID
Value: prj_xyz789...
```

---

## 🚀 Comment Ça Fonctionne

### Workflow 1 : `vercel-deploy.yml`

**Déclenché par :**
- Push sur `main` ou `master`
- Déclenchement manuel (workflow_dispatch)

**Actions :**
1. ✅ Checkout du code
2. ✅ Setup Node.js 18
3. ✅ Install dépendances
4. ✅ Build (`npm run build`)
5. ✅ Install Vercel CLI
6. ✅ Deploy sur Vercel (production)
7. ✅ Notification de statut

---

### Workflow 2 : `ci-cd.yml`

**Déclenché par :**
- Push sur `main` ou `master`
- Pull Request

**Actions :**

**Job 1 : Lint**
- Lint ESLint (si configuré)
- TypeScript type check

**Job 2 : Build**
- Build l'application
- Upload artifacts

**Job 3 : Deploy** (seulement sur main/master)
- Download artifacts
- Deploy sur Vercel
- Notification

---

## 🎯 Utilisation

### Déploiement Automatique

```bash
# Push vers main/master
git add .
git commit -m "🚀 Deploy THESORIA"
git push origin main
```

→ GitHub Actions lance automatiquement le workflow
→ Build + Deploy sur Vercel
→ URL de production fournie

---

### Déploiement Manuel

1. Aller sur GitHub → **Actions**
2. Sélectionner **Vercel Production Deployment**
3. Cliquer **Run workflow**
4. Choisir la branche
5. Cliquer **Run workflow**

---

## 📊 Statut du Déploiement

### Voir les Logs

1. GitHub → **Actions**
2. Cliquer sur le workflow en cours
3. Voir les étapes détaillées

### URL de Déploiement

À la fin du workflow, l'URL est affichée :
```
✅ Deployment complete!
🌐 https://thesoria-xyz.vercel.app
```

---

## 🛠️ Personnalisation

### Changer la Branche de Déploiement

Éditer `.github/workflows/vercel-deploy.yml` :

```yaml
on:
  push:
    branches:
      - main        # ← Changer ici
      - production  # ← Ajouter d'autres branches
```

---

### Ajouter des Variables d'Environnement

Dans le workflow, section `env` :

```yaml
- name: Build application
  run: npm run build
  env:
    VITE_APP_NAME: THESORIA
    VITE_APP_VERSION: 3.0.0
    VITE_CUSTOM_VAR: votre_valeur  # ← Ajouter ici
```

---

### Notifications Slack/Discord

Ajouter à la fin du workflow :

```yaml
- name: Notify Slack
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: '🚀 THESORIA déployé !'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## ⚠️ Dépannage

### Erreur : "VERCEL_TOKEN not found"

**Solution :**
1. Vérifier que le secret existe dans GitHub Settings
2. Nom exact : `VERCEL_TOKEN` (pas de typo)
3. Relancer le workflow

---

### Erreur : "Project not linked"

**Solution :**
```bash
vercel link
cat .vercel/project.json
# Copier les IDs dans GitHub Secrets
```

---

### Build échoue

**Solution :**
1. Tester en local : `npm run build`
2. Vérifier les logs GitHub Actions
3. Vérifier les variables d'environnement

---

## 📚 Fichiers Référence

### .gitignore

```gitignore
# Dependencies
node_modules

# Production
dist
.vercel

# Environment
.env
.env.local

# Cache
.vite
```

---

### vercel.json

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## ✅ Checklist Finale

Avant de pusher :

- [ ] Secrets GitHub configurés (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [ ] `.gitignore` créé
- [ ] Workflows créés (`.github/workflows/*.yml`)
- [ ] `vercel.json` présent
- [ ] Build local réussit (`npm run build`)
- [ ] Git initialisé (`git init`)
- [ ] Remote configuré (`git remote add origin ...`)

---

## 🚀 Déploiement Initial

```bash
# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Commit
git commit -m "🚀 Initial commit - THESORIA Production"

# 4. Ajouter remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/thesoria.git

# 5. Push
git push -u origin main
```

→ GitHub Actions se déclenche automatiquement
→ Build + Deploy sur Vercel
→ Site en ligne ! 🎉

---

## 🎊 Résultat

```
✅ Code pushé sur GitHub
✅ GitHub Actions déclenché automatiquement
✅ Build réussi
✅ Déployé sur Vercel
✅ URL : https://thesoria-xyz.vercel.app

🎉 THESORIA EN PRODUCTION ! 🎉
```

---

## 💡 Workflows Disponibles

| Workflow | Fichier | Usage |
|----------|---------|-------|
| **Vercel Deploy** | `vercel-deploy.yml` | Déploiement direct sur Vercel |
| **CI/CD Pipeline** | `ci-cd.yml` | Lint + Build + Deploy complet |

**Recommandation :** Utilisez `ci-cd.yml` pour un pipeline complet avec validation.

---

## 📞 Support

Si problème :
1. Vérifier les logs GitHub Actions
2. Vérifier les secrets GitHub
3. Tester le build local : `npm run build`
4. Consulter la doc Vercel : https://vercel.com/docs

---

**🚀 Bon déploiement automatique ! 💎**
