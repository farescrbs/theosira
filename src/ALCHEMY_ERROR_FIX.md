# 🔧 Fix Erreurs Alchemy API (401 Unauthorized)

## ❌ Problème

Vous voyez ces erreurs dans la console :

```
❌ ALCHEMY AUTH ERROR (401): Key is unauthorized or expired
Alchemy auth error (401) on eth-mainnet: key unauthorized or expired
ALCHEMY_KEY_INVALID: Authentication failed (401)
```

## 🔍 Cause

Votre clé API Alchemy est soit :
1. **Expirée** (si vous utilisez un plan gratuit avec limitation)
2. **Invalide** (caractères incorrects, espaces, guillemets)
3. **Non autorisée** pour les réseaux demandés (Ethereum, Sepolia, etc.)
4. **Révoquée** ou supprimée depuis le dashboard Alchemy

## ✅ Solution Étape par Étape

### **1. Vérifier votre clé Alchemy**

#### Option A : Créer une nouvelle clé (Recommandé)

1. Allez sur **[Alchemy Dashboard](https://dashboard.alchemy.com/)**
2. Connectez-vous à votre compte
3. Cliquez sur **"Apps"** → **"Create new app"**
4. Configurez :
   - **Name:** `THESORIA Production`
   - **Chain:** `Ethereum`
   - **Network:** `Mainnet` ET `Sepolia` (cochez les deux)
5. Une fois créée, cliquez sur **"VIEW KEY"**
6. Copiez la **"API KEY"** (format: `abcd1234efgh5678...`)

#### Option B : Récupérer une clé existante

1. Allez sur **[Alchemy Dashboard](https://dashboard.alchemy.com/apps)**
2. Sélectionnez votre app existante
3. Cliquez sur **"VIEW KEY"**
4. Copiez la **"API KEY"**

### **2. Mettre à jour la clé dans Supabase**

#### Via l'interface Supabase :

1. Allez sur **[Supabase Dashboard](https://supabase.com/dashboard)**
2. Sélectionnez votre projet **THESORIA**
3. Dans le menu gauche : **Settings** → **Edge Functions** → **Secrets**
4. Cherchez le secret `ALCHEMY_API_KEY`
5. Cliquez sur **"Edit"** ou **"Add new secret"**
6. Collez votre nouvelle clé API (SANS guillemets, SANS espaces)
7. Cliquez sur **"Save"**

#### Exemple de clé valide :
```
✅ CORRECT:  abcd1234efgh5678ijkl9012mnop3456
❌ INCORRECT: "abcd1234efgh5678ijkl9012mnop3456"
❌ INCORRECT: abcd1234efgh5678ijkl9012mnop3456 
❌ INCORRECT: 'abcd1234efgh5678ijkl9012mnop3456'
```

### **3. Redémarrer les Edge Functions**

Après avoir mis à jour la clé :

1. Dans Supabase Dashboard → **Edge Functions**
2. Trouvez la fonction `make-server-cc38a303`
3. Cliquez sur **"Redeploy"** ou attendez quelques minutes

### **4. Vérifier que ça fonctionne**

#### Dans le God Mode :

1. Ouvrez `/god-mode`
2. Entrez le PIN : `THESORIA2026`
3. Allez sur l'onglet **"API Keys"**
4. Cliquez sur **"TEST ALCHEMY KEY"**
5. Vérifiez que tous les tests passent au vert ✅

#### Dans l'onglet On-Chain :

1. Cliquez sur l'onglet **"On-Chain"**
2. Vous devriez voir **"ALCHEMY LIVE"** en vert
3. Les données de bloc et gas s'affichent correctement

## 🎯 Corrections Appliquées dans le Code

### **Backend (Server)**

✅ **Meilleurs messages d'erreur**
```typescript
// Avant
throw new Error(`Alchemy auth error (401): key unauthorized or expired`);

// Après
console.error(`❌ ALCHEMY AUTH ERROR (401): Key is unauthorized or expired`);
throw new Error(`ALCHEMY_KEY_INVALID: Authentication failed (401). Please update your ALCHEMY_API_KEY.`);
```

✅ **Invalidation du cache**
- Quand une erreur 401/403 se produit, la clé en cache est invalidée
- La prochaine requête re-vérifie la clé depuis les variables d'environnement

### **Frontend (God Mode)**

✅ **Détection des erreurs d'auth**
```typescript
if (err.message?.includes('ALCHEMY_KEY_INVALID') || 
    err.message?.includes('401') || 
    err.message?.includes('unauthorized')) {
  setAlchemyError("⚠️ Clé Alchemy invalide ou expirée. Veuillez mettre à jour ALCHEMY_API_KEY.");
}
```

✅ **Bannière d'erreur améliorée**
- Affichage clair du problème
- Bouton "RETRY" pour retenter la connexion
- Instructions pour accéder aux Diagnostics

✅ **Réduction du spam console**
- Les erreurs 401 connues ne sont plus loggées en boucle
- Seules les vraies erreurs inattendues sont affichées

## 🔒 Sécurité

### ✅ Bonnes Pratiques Implémentées :

1. **Clé côté serveur uniquement**
   - La clé n'est JAMAIS exposée au frontend
   - Seul le backend Supabase Edge Functions y a accès

2. **Sanitization automatique**
   - Suppression des guillemets, espaces, caractères spéciaux
   - Validation du format avant utilisation

3. **Cache intelligent**
   - La clé est mise en cache pour performance
   - Le cache est invalidé en cas d'erreur d'auth

4. **Gestion d'erreurs gracieuse**
   - L'application continue de fonctionner même si Alchemy est down
   - Messages d'erreur clairs pour le debugging

## 🧪 Tester la Clé Manuellement

### Via curl (Terminal)

```bash
curl -X POST https://eth-mainnet.g.alchemy.com/v2/VOTRE_CLE_ICI \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_blockNumber",
    "params": []
  }'
```

**Résultat attendu :**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1234567"
}
```

**Si erreur 401 :**
```json
{
  "error": {
    "code": 401,
    "message": "Unauthorized"
  }
}
```
→ La clé est invalide, créez-en une nouvelle.

## 📞 Support

### Si le problème persiste :

1. **Vérifiez les quotas Alchemy**
   - Allez sur Alchemy Dashboard → Usage
   - Vérifiez que vous n'avez pas atteint la limite

2. **Vérifiez les réseaux activés**
   - Dans Alchemy Dashboard → App Settings
   - Assurez-vous que Ethereum Mainnet ET Sepolia sont activés

3. **Créez une nouvelle app Alchemy**
   - Parfois l'app est corrompue ou restreinte
   - Créez une toute nouvelle app et utilisez sa clé

4. **Vérifiez les logs Supabase**
   - Supabase Dashboard → Edge Functions → Logs
   - Cherchez les erreurs liées à `ALCHEMY_API_KEY`

## 🚀 Quick Fix (TL;DR)

```bash
# 1. Nouvelle clé Alchemy
https://dashboard.alchemy.com/ → Create App → Copy API Key

# 2. Mettre à jour dans Supabase
https://supabase.com/dashboard → Settings → Secrets → Edit ALCHEMY_API_KEY

# 3. Vérifier dans God Mode
/god-mode → API Keys → TEST ALCHEMY KEY

# ✅ Done!
```

---

**Dernière mise à jour** : 9 mars 2026  
**Statut** : ✅ Erreurs gérées gracieusement  
**Impact** : L'application continue de fonctionner même si Alchemy est down
