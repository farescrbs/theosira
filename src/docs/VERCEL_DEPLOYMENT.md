# 🚀 Guide de Déploiement Vercel - THESORIA API

## Vue d'ensemble

Ce guide explique comment déployer l'API THESORIA en production sur Vercel.

## 📋 Prérequis

- Compte Vercel ([créer un compte](https://vercel.com/signup))
- Vercel CLI installé : `npm i -g vercel`
- Node.js >= 18.0.0
- Git

## 🔧 Configuration Initiale

### 1. Installation de Vercel CLI

```bash
npm install -g vercel
```

### 2. Connexion à Vercel

```bash
vercel login
```

### 3. Lier le Projet

Dans le répertoire racine du projet:

```bash
vercel link
```

Suivez les instructions:
- **Set up and deploy** : Choisissez votre scope (personnel ou team)
- **Link to existing project?** : No
- **Project name** : thesoria (ou votre nom personnalisé)
- **Directory** : `./` (répertoire racine)

## 🔐 Configuration des Variables d'Environnement

### Via Vercel CLI

```bash
# Variables de production
vercel env add API_KEY production
vercel env add COW_API_BASE production
vercel env add GITHUB_ACCESS_TOKEN production

# Variables de développement
vercel env add API_KEY development
vercel env add COW_API_BASE development
```

### Via Dashboard Vercel

1. Allez sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **thesoria**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes:

**Production:**
```
API_KEY=your_production_api_key_here
NODE_ENV=production
COW_API_BASE=https://api.cow.fi/mainnet
COW_API_ETHEREUM=https://api.cow.fi/mainnet
COW_API_GNOSIS=https://api.cow.fi/xdai
COW_API_ARBITRUM=https://api.cow.fi/arbitrum_one
VERCEL_TOKEN=vck_0w6LUBNtYXIb4ptuFoyTmKkaeCqV06GEZoSfhrOUgVH7Zv4AMr1B2Vse
RPC_ETHEREUM=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
FLASH_LOAN_FEE_BPS=5
ENABLE_FLASH_LOANS=true
```

**Development/Preview:**
```
API_KEY=dev_api_key_for_testing
NODE_ENV=development
COW_API_BASE=https://barn.api.cow.fi/mainnet
MOCK_API_RESPONSES=true
DEBUG=true
```

## 📦 Déploiement

### Déploiement en Staging (Preview)

```bash
vercel
```

Cette commande:
- Crée un déploiement de preview
- Génère une URL temporaire: `https://thesoria-xxxx.vercel.app`
- Utilise les variables d'environnement `preview`

### Déploiement en Production

```bash
vercel --prod
```

Cette commande:
- Crée un déploiement de production
- Utilise le domaine principal: `https://thesoria.vercel.app`
- Utilise les variables d'environnement `production`

### Déploiement avec Configuration Personnalisée

```bash
# Déployer avec un nom spécifique
vercel --name thesoria-api --prod

# Déployer dans une région spécifique
vercel --regions iad1 --prod

# Déployer avec confirmation manuelle
vercel --prod --confirm
```

## 🌍 Configuration des Domaines

### Domaine Vercel par Défaut

Après le déploiement, votre API est disponible sur:
```
https://thesoria.vercel.app
```

### Domaine Personnalisé

1. Allez dans **Settings** → **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine: `api.thesoria.io`
4. Suivez les instructions DNS de Vercel

**Configuration DNS:**
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

## 🔍 Vérification du Déploiement

### 1. Vérifier la Santé de l'API

```bash
curl https://thesoria.vercel.app/api/health
```

**Réponse attendue:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-22T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. Tester un Endpoint

```bash
curl -H "X-API-Key: your_api_key" \
  https://thesoria.vercel.app/api/metrics/bot
```

### 3. Vérifier les Logs

```bash
vercel logs --prod
```

Ou dans le Dashboard Vercel:
- **Deployments** → Cliquez sur le dernier déploiement
- **Functions** → Sélectionnez une fonction
- **Logs** → Consultez les logs en temps réel

## 📊 Monitoring

### Vercel Analytics

Activez Vercel Analytics pour suivre les métriques:

1. Dashboard Vercel → **Analytics**
2. Cliquez sur **Enable Analytics**
3. Choisissez le plan (gratuit ou payant)

**Métriques disponibles:**
- Nombre de requêtes
- Temps de réponse
- Taux d'erreur
- Utilisation des ressources

### Logs en Temps Réel

```bash
# Tous les logs
vercel logs --follow

# Logs de production uniquement
vercel logs --prod --follow

# Logs d'une fonction spécifique
vercel logs api/flashloan/execute --prod
```

## 🔄 CI/CD avec GitHub

### 1. Connecter GitHub

1. Dashboard Vercel → **Settings** → **Git**
2. Connectez votre compte GitHub
3. Sélectionnez le repository **thesoria**

### 2. Configuration Auto-Deploy

**Branches:**
- `main` → Production automatique
- `develop` → Preview automatique
- Autres branches → Preview automatique

**vercel.json** (déjà configuré):
```json
{
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": false,
    "autoJobCancelation": true
  }
}
```

### 3. Workflow GitHub Actions (Optionnel)

Créez `.github/workflows/vercel.yml`:

```yaml
name: Vercel Production Deployment

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## ⚙️ Configuration Avancée

### Régions et Edge Network

```json
{
  "regions": ["iad1", "cdg1", "sfo1"],
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Régions disponibles:**
- `iad1` : Washington DC (US East)
- `sfo1` : San Francisco (US West)
- `cdg1` : Paris (Europe)
- `hkg1` : Hong Kong (Asia)

### Headers de Sécurité

Déjà configuré dans `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Cache Configuration

```json
{
  "headers": [
    {
      "source": "/api/metrics/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

## 🐛 Débogage

### Logs Détaillés

```bash
# Activer le mode debug
vercel env add DEBUG true development

# Voir tous les logs d'une fonction
vercel logs api/flashloan/execute --since 1h
```

### Tester Localement

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement Vercel
vercel dev

# L'API est accessible sur http://localhost:3000
```

### Erreurs Communes

**1. "Function Invocation Failed"**
- Vérifiez les variables d'environnement
- Consultez les logs: `vercel logs --prod`
- Vérifiez la configuration dans `vercel.json`

**2. "Deployment Failed to Build"**
- Vérifiez `package.json` et les dépendances
- Testez en local: `npm run build`
- Consultez les logs de build dans le Dashboard

**3. "API Key Invalid"**
- Vérifiez que `API_KEY` est configurée dans Vercel
- Testez avec: `curl -H "X-API-Key: $API_KEY"`

## 📈 Scaling

### Limites Gratuites (Hobby)

- 100 GB-hours / mois
- 100,000 requêtes / jour
- 10s max duration
- 1024 MB mémoire

### Plan Pro

- Illimité GB-hours
- Illimité requêtes
- 60s max duration
- 3008 MB mémoire
- Support prioritaire

### Optimisations

**1. Réduire la Durée d'Exécution:**
```typescript
// Utiliser des timeouts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

fetch(url, { signal: controller.signal });
```

**2. Edge Functions:**
```json
{
  "functions": {
    "api/metrics/bot.ts": {
      "runtime": "edge"
    }
  }
}
```

**3. Mise en Cache:**
```typescript
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
```

## 🔒 Sécurité

### Rate Limiting

Déjà implémenté dans `/api/_lib/util/with-api-handler.ts`:

```typescript
// 100 requêtes par minute par IP
checkRateLimit(clientIp, 100, 60000)
```

### CORS

Configuré dans `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Secrets Management

```bash
# Ajouter un secret
vercel secrets add api-key "your_secret_key"

# Utiliser dans vercel.json
{
  "env": {
    "API_KEY": "@api-key"
  }
}
```

## 📝 Checklist de Déploiement

Avant le déploiement en production:

- [ ] Variables d'environnement configurées
- [ ] Tests API passés localement
- [ ] Documentation à jour
- [ ] Logs de monitoring activés
- [ ] Rate limiting configuré
- [ ] CORS configuré correctement
- [ ] Headers de sécurité activés
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Alertes configurées (optionnel)
- [ ] Backup des données (si applicable)

## 🆘 Support

### Ressources Vercel

- [Documentation Vercel](https://vercel.com/docs)
- [Support Vercel](https://vercel.com/support)
- [Status Page](https://www.vercel-status.com/)

### Commandes Utiles

```bash
# Lister tous les déploiements
vercel ls

# Inspecter un déploiement
vercel inspect <deployment-url>

# Supprimer un déploiement
vercel rm <deployment-url>

# Lister les domaines
vercel domains ls

# Lister les variables d'environnement
vercel env ls
```

---

**🎉 Félicitations ! Votre API THESORIA est maintenant déployée en production sur Vercel !**

**URL de l'API:** https://thesoria.vercel.app/api

**Documentation:** https://thesoria.vercel.app/docs/api
