# 📡 THESORIA API

API de production pour la plateforme blockchain THESORIA, déployée sur Vercel.

## 🚀 Quick Start

```bash
# Tester l'API en production
curl https://thesoria.vercel.app/api/metrics/bot \
  -H "X-API-Key: your_api_key"
```

## 📚 Documentation

- **[Documentation Complète](/docs/API_DOCUMENTATION.md)** - Tous les endpoints, exemples, codes d'erreur
- **[Guide de Déploiement](/docs/VERCEL_DEPLOYMENT.md)** - Déployer sur Vercel
- **[Résumé](/API_VERCEL_SUMMARY.md)** - Vue d'ensemble rapide

## 🔗 Endpoints

### Flash Loan
- `POST /api/flashloan/execute` - Exécuter un flash loan
- `GET /api/flashloan/opportunities` - Opportunités d'arbitrage
- `GET /api/flashloan/status` - Statut d'un ordre

### Metrics
- `GET /api/metrics/bot` - Stats du bot
- `GET /api/metrics/analytics` - Analytics détaillées

### CoW Protocol
- `POST /api/cowprotocol/quote` - Obtenir un quote

## 🔐 Authentification

Ajoutez le header `X-API-Key` à toutes vos requêtes:

```typescript
headers: {
  'X-API-Key': process.env.API_KEY
}
```

## 📦 Installation

```bash
npm install
```

## 🛠️ Développement Local

```bash
# Démarrer le serveur de développement Vercel
vercel dev

# API accessible sur http://localhost:3000/api
```

## 🚀 Déploiement

```bash
# Déployer en production
vercel --prod

# Déployer en staging
vercel
```

## 📊 Structure

```
/api/
├── _lib/
│   ├── types.ts
│   └── util/
│       └── with-api-handler.ts
├── flashloan/
│   ├── execute.ts
│   ├── opportunities.ts
│   └── status.ts
├── metrics/
│   ├── bot.ts
│   └── analytics.ts
└── cowprotocol/
    └── quote.ts
```

## 🔒 Sécurité

- ✅ API Key authentication
- ✅ Rate limiting (100 req/min)
- ✅ CORS configuré
- ✅ TypeScript strict mode
- ✅ Error handling robuste

## 📞 Support

Documentation complète: [/docs/API_DOCUMENTATION.md](/docs/API_DOCUMENTATION.md)

---

**Développé pour THESORIA** 🎨
