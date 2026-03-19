# 📡 Documentation API THESORIA

## Vue d'ensemble

L'API THESORIA fournit des endpoints RESTful pour interagir avec le Flash Loan Bot et CoW Protocol en production.

**Base URL Production:** `https://thesoria.vercel.app/api`  
**Base URL Staging:** `https://thesoria-staging.vercel.app/api`

## 🔐 Authentification

Toutes les requêtes API nécessitent une clé API dans le header:

```bash
curl -H "X-API-Key: your_api_key_here" https://thesoria.vercel.app/api/...
```

## 📚 Endpoints

### Flash Loan Endpoints

#### 1. Exécuter un Flash Loan

**POST** `/api/flashloan/execute`

Exécute un flash loan via CoW Protocol et Aave V3.

**Request Body:**
```json
{
  "fromToken": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "toToken": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "amount": "1000000000000000000",
  "chainId": 1,
  "strategy": "dex",
  "slippageBps": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "0x...",
    "status": "pending",
    "estimatedProfit": "15000000000000000",
    "flashLoanFee": "5000000000000000",
    "gasEstimate": "300000"
  },
  "timestamp": "2024-12-22T10:30:00.000Z"
}
```

**Paramètres:**

| Paramètre | Type | Required | Description |
|-----------|------|----------|-------------|
| `fromToken` | string | ✅ | Adresse du token à vendre |
| `toToken` | string | ✅ | Adresse du token à acheter |
| `amount` | string | ✅ | Montant en wei |
| `chainId` | number | ✅ | ID de la blockchain (1, 100, etc.) |
| `strategy` | string | ✅ | Type de stratégie: 'dex', 'liquidation', 'triangular', 'mev' |
| `slippageBps` | number | ❌ | Slippage toléré en basis points (défaut: 50) |

**Exemples:**

```typescript
// JavaScript/TypeScript
const response = await fetch('https://thesoria.vercel.app/api/flashloan/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key_here',
  },
  body: JSON.stringify({
    fromToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    toToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    amount: '1000000000000000000',
    chainId: 1,
    strategy: 'dex',
    slippageBps: 50,
  }),
});

const data = await response.json();
console.log(data);
```

```bash
# cURL
curl -X POST https://thesoria.vercel.app/api/flashloan/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "fromToken": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "toToken": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "amount": "1000000000000000000",
    "chainId": 1,
    "strategy": "dex",
    "slippageBps": 50
  }'
```

---

#### 2. Récupérer les Opportunités

**GET** `/api/flashloan/opportunities`

Obtient les opportunités d'arbitrage disponibles.

**Query Parameters:**

| Paramètre | Type | Required | Description |
|-----------|------|----------|-------------|
| `chainId` | number | ❌ | Filtrer par blockchain |
| `minProfitBps` | number | ❌ | Profit minimum en basis points (défaut: 50) |
| `strategies` | string | ❌ | Stratégies séparées par virgule: 'dex,liquidation' |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "opp-1234567890-0",
      "type": "dex",
      "fromToken": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "toToken": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "fromDex": "Uniswap V3",
      "toDex": "SushiSwap",
      "profitPercentage": 2.5,
      "estimatedProfit": 3250,
      "flashLoanRequired": true,
      "chainId": 1,
      "timestamp": 1703246400000
    }
  ],
  "timestamp": "2024-12-22T10:30:00.000Z"
}
```

**Exemples:**

```typescript
// Toutes les opportunités
const response = await fetch('https://thesoria.vercel.app/api/flashloan/opportunities', {
  headers: {
    'X-API-Key': 'your_api_key_here',
  },
});

// Filtrer par profit minimum
const response = await fetch(
  'https://thesoria.vercel.app/api/flashloan/opportunities?minProfitBps=100&strategies=dex,liquidation',
  {
    headers: {
      'X-API-Key': 'your_api_key_here',
    },
  }
);
```

---

#### 3. Vérifier le Statut d'un Ordre

**GET** `/api/flashloan/status?orderId={orderId}`

Vérifie le statut d'un ordre flash loan.

**Query Parameters:**

| Paramètre | Type | Required | Description |
|-----------|------|----------|-------------|
| `orderId` | string | ✅ | ID de l'ordre retourné par `/execute` |

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "0x1234...",
    "status": "confirmed",
    "txHash": "0xabcd...",
    "estimatedProfit": "1500000000000000000",
    "flashLoanFee": "50000000000000000",
    "gasEstimate": "300000"
  },
  "timestamp": "2024-12-22T10:30:00.000Z"
}
```

**Status possibles:**
- `pending`: Ordre en cours de traitement
- `confirmed`: Ordre confirmé sur la blockchain
- `failed`: Ordre échoué

---

### Metrics Endpoints

#### 4. Statistiques du Bot

**GET** `/api/metrics/bot`

Récupère les statistiques globales du bot.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProfit": 13275.50,
    "successRate": 75.3,
    "totalTrades": 847,
    "activeTrades": 2,
    "uptime": 99.8,
    "lastExecution": "2024-12-22T10:30:00.000Z"
  },
  "timestamp": "2024-12-22T10:30:00.000Z"
}
```

---

#### 5. Analytics Détaillées

**GET** `/api/metrics/analytics`

Récupère les analytics détaillées sur une période donnée.

**Query Parameters:**

| Paramètre | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeframe` | string | ❌ | '1h', '24h', '7d', '30d' (défaut: '24h') |
| `chainId` | number | ❌ | Filtrer par blockchain |

**Response:**
```json
{
  "success": true,
  "data": {
    "timeframe": "24h",
    "totalVolume": "5420000000000000000000",
    "totalProfit": "13275500000000000000",
    "totalTrades": 847,
    "successRate": 75.3,
    "averageGasUsed": "285000",
    "topStrategies": [
      {
        "name": "Arbitrage DEX Multi-Chaînes",
        "trades": 412,
        "profit": "7850000000000000000"
      }
    ]
  },
  "timestamp": "2024-12-22T10:30:00.000Z"
}
```

---

### CoW Protocol Endpoints

#### 6. Obtenir un Quote

**POST** `/api/cowprotocol/quote`

Obtient un quote pour un swap via CoW Protocol.

**Request Body:**
```json
{
  "sellToken": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "buyToken": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "kind": "sell",
  "amount": "1000000000000000000",
  "validFor": 1800,
  "slippageBps": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sellAmount": "1000000000000000000",
    "buyAmount": "3250000000",
    "fee": "10000000000000000",
    "validTo": 1703248200,
    "quoteId": 123456
  },
  "timestamp": "2024-12-22T10:30:00.000Z"
}
```

---

## 🚨 Codes d'Erreur

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Succès |
| 400 | Requête invalide |
| 401 | Non autorisé (API key invalide) |
| 404 | Ressource non trouvée |
| 405 | Méthode non autorisée |
| 429 | Trop de requêtes (rate limit dépassé) |
| 500 | Erreur serveur |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "Missing required fields: fromToken, toToken"
  },
  "timestamp": "2024-12-22T10:30:00.000Z"
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `method_not_allowed` | Méthode HTTP non supportée |
| `unauthorized` | API key invalide ou manquante |
| `invalid_request` | Paramètres de requête invalides |
| `rate_limit_exceeded` | Limite de requêtes dépassée |
| `execution_failed` | Échec de l'exécution du flash loan |
| `fetch_failed` | Échec de récupération des données |
| `quote_failed` | Échec d'obtention du quote |
| `internal_error` | Erreur interne du serveur |

---

## 🔒 Rate Limiting

**Limites par défaut:**
- 100 requêtes par minute par IP
- 10 requêtes par minute pour `/flashloan/execute`

**Headers de réponse:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703246460
```

---

## 🌐 Support Multi-Chain

Chaînes supportées:

| Chain | Chain ID | API Base |
|-------|----------|----------|
| Ethereum Mainnet | 1 | https://api.cow.fi/mainnet |
| Gnosis Chain | 100 | https://api.cow.fi/xdai |
| Arbitrum One | 42161 | https://api.cow.fi/arbitrum_one |
| Base | 8453 | https://api.cow.fi/base |
| Polygon | 137 | https://api.cow.fi/polygon |

---

## 📦 Client SDK

Utilisez notre client TypeScript pour faciliter l'intégration:

```typescript
import { ThesoriaAPI } from '@thesoria/api-client';

const api = new ThesoriaAPI({
  apiKey: 'your_api_key_here',
  baseUrl: 'https://thesoria.vercel.app/api',
});

// Exécuter un flash loan
const result = await api.flashloan.execute({
  fromToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  toToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  amount: '1000000000000000000',
  chainId: 1,
  strategy: 'dex',
});

// Récupérer les opportunités
const opportunities = await api.flashloan.opportunities({
  minProfitBps: 100,
});

// Vérifier le statut
const status = await api.flashloan.status(result.data.orderId);
```

---

## 🧪 Testing

### Postman Collection

Importez notre collection Postman pour tester l'API:

[Télécharger THESORIA API Postman Collection](https://thesoria.vercel.app/postman-collection.json)

### Test Endpoint

**GET** `/api/health`

Vérifie que l'API fonctionne correctement.

```bash
curl https://thesoria.vercel.app/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-22T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

## 📞 Support

Pour toute question ou problème:

- **Documentation**: https://docs.thesoria.io
- **Email**: api@thesoria.io
- **Discord**: https://discord.gg/thesoria

---

**Développé avec ❤️ pour THESORIA - La Plateforme Blockchain Ultra-Luxueuse**
