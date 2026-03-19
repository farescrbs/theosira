# 🔧 CORRECTION DES ERREURS ALCHEMY 401

## Problème Identifié

Toutes les erreurs que vous rencontrez sont des **erreurs d'authentification 401** :
```
Error: Alchemy auth error (401) on eth-mainnet: key unauthorized or expired
```

Cela signifie que votre clé API Alchemy est soit **invalide**, soit **expirée**, soit **mal configurée**.

---

## ✅ Solution en 5 Étapes

### **Étape 1 : Diagnostiquer la Clé Actuelle**

1. Allez sur `/god-mode` (PIN: `THESORIA2026`)
2. Cliquez sur l'onglet **"API Keys"** (nouvel onglet ajouté)
3. Cliquez sur **"Run Test"**
4. Observez les résultats :
   - ❌ **"Environment Variable: No"** → La clé n'est pas dans Supabase
   - ⚠️ **"Sanitized Key: Too short"** → La clé a été corrompue
   - ❌ **"Live RPC Test: HTTP 401"** → La clé est invalide

---

### **Étape 2 : Obtenir une Nouvelle Clé Alchemy**

1. Allez sur [https://dashboard.alchemy.com](https://dashboard.alchemy.com)
2. Connectez-vous à votre compte
3. Naviguez vers **"Apps"** dans le menu de gauche
4. Si vous n'avez pas d'app :
   - Cliquez sur **"+ Create New App"**
   - Nom: `THESORIA Production`
   - Chain: **Ethereum**
   - Network: **Mainnet** (+ activez **Sepolia** pour les tests)
5. Cliquez sur votre app → **"API Keys"** → **"View Key"**
6. **COPIEZ LA CLÉ ENTIÈRE** (32 caractères, format : `AbC123dEf456GhI789JkL012MnO345Pq`)

⚠️ **IMPORTANT** : 
- Ne copiez que la clé, **sans quotes, sans espaces, sans retours à la ligne**
- La clé doit faire **exactement 32 caractères**
- Vérifiez qu'il n'y a pas d'espace invisible au début ou à la fin

---

### **Étape 3 : Configurer le Secret Supabase**

#### **Option A : Via l'UI Supabase (Recommandé)**

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet THESORIA
3. Naviguez vers : **Settings** → **Edge Functions** → **Secrets**
4. Cherchez `ALCHEMY_API_KEY` dans la liste
   - Si elle existe : cliquez sur **"Edit"** → collez la nouvelle clé → **Save**
   - Si elle n'existe pas : cliquez sur **"Add secret"** → nom: `ALCHEMY_API_KEY` → valeur: votre clé → **Add**
5. **IMPORTANT** : Après avoir ajouté/modifié le secret, vous devez **redéployer** l'Edge Function

#### **Option B : Via la CLI Supabase**

```bash
# Définir le secret
supabase secrets set ALCHEMY_API_KEY=VotreCléDe32Caractères

# Vérifier
supabase secrets list

# Redéployer
supabase functions deploy make-server-cc38a303
```

---

### **Étape 4 : Redéployer l'Edge Function**

Après avoir modifié le secret, vous DEVEZ redéployer :

#### **Via l'UI Supabase :**
1. **Settings** → **Edge Functions**
2. Trouvez `make-server-cc38a303`
3. Cliquez sur **"Deploy"** ou **"Redeploy"**
4. Attendez la confirmation ✅

#### **Via la CLI :**
```bash
supabase functions deploy make-server-cc38a303
```

---

### **Étape 5 : Vérifier que Ça Fonctionne**

1. Retournez sur `/god-mode` → onglet **"API Keys"**
2. Cliquez sur **"Run Test"**
3. Vous devriez maintenant voir :
   ```
   ✅ Environment Variable
   • Raw length: 32 chars
   • Has quotes: No ✓
   • Has whitespace: No ✓
   
   ✅ Sanitized Key
   • Length: 32 chars ✓
   • Format: Valid ✓
   
   ✅ Live RPC Test (eth-mainnet)
   • HTTP Status: 200 ✓
   • Block Number: #21,234,567 ✓
   
   ✅ All Systems Operational
   ```

4. Ensuite, allez dans l'onglet **"Diagnostics"**
5. Cliquez sur **"Run Full Diagnostics"**
6. Tous les tests Alchemy devraient maintenant **PASSER** ✅

---

## 🔍 Erreurs Fréquentes et Solutions

### **Erreur : "Key too short (X chars, expected 32)"**

**Cause** : La clé a été tronquée ou contient des caractères invisibles

**Solution** :
1. Recopiez la clé depuis Alchemy (clic droit → Copier)
2. Collez-la dans un éditeur de texte (Notepad, VSCode)
3. Vérifiez visuellement qu'elle fait 32 caractères
4. Supprimez tout espace/retour à la ligne
5. Recopiez depuis l'éditeur et collez dans Supabase

---

### **Erreur : "HTTP 401" même avec une nouvelle clé**

**Causes possibles** :
1. Le secret n'a pas été sauvegardé dans Supabase
2. L'Edge Function n'a pas été redéployée
3. Le cache serveur contient encore l'ancienne clé

**Solution** :
```bash
# Forcer un redéploiement complet
supabase functions deploy make-server-cc38a303 --no-verify-jwt

# Ou via l'UI : Delete + Re-deploy
```

---

### **Erreur : "HTTP 404" sur certains réseaux**

**Cause** : Votre plan Alchemy ne supporte que Ethereum Mainnet + Sepolia

**Solution** :
- **Free Plan** : Supporte eth-mainnet + eth-sepolia uniquement
- Les autres réseaux (Polygon, Arbitrum, Optimism, Base) nécessitent le **Growth Plan**
- C'est **NORMAL** que ces tests échouent avec le Free Plan
- Les diagnostics afficheront `⚠️ WARN` au lieu de `❌ FAIL`

---

## 📊 Résultats Attendus avec Free Plan

| Test | Résultat | Plan Requis |
|------|----------|-------------|
| Ethereum Mainnet | ✅ PASS | Free |
| Sepolia Testnet | ✅ PASS | Free |
| Polygon | ⚠️ WARN | Growth+ |
| Arbitrum | ⚠️ WARN | Growth+ |
| Optimism | ⚠️ WARN | Growth+ |
| Base | ⚠️ WARN | Growth+ |
| Multi-Network Test | ⚠️ WARN (2/6 online) | Free |
| Address Inspector | ✅ PASS | Free |
| Transaction Lookup | ✅ PASS | Free |
| Block Details | ✅ PASS | Free |
| Contract Verify | ✅ PASS | Free |

---

## 🎯 Checklist Finale

- [ ] Nouvelle clé Alchemy obtenue (32 chars)
- [ ] Secret `ALCHEMY_API_KEY` configuré dans Supabase
- [ ] Edge Function `make-server-cc38a303` redéployée
- [ ] Test de clé dans God Mode → API Keys → ✅ PASS
- [ ] Full Diagnostics → Alchemy On-Chain (2.1 - 2.9) → ✅ PASS
- [ ] Les erreurs 401 ont disparu des logs

---

## 🆘 Besoin d'Aide ?

Si après avoir suivi toutes ces étapes vous avez toujours des erreurs :

1. **Vérifiez les logs Supabase** :
   - Dashboard → Functions → `make-server-cc38a303` → Logs
   - Cherchez : `[sanitizeApiKey]` et `[getAlchemyKey]`
   - Vérifiez la longueur de la clé affichée

2. **Testez manuellement la clé** :
   ```bash
   curl -X POST https://eth-mainnet.g.alchemy.com/v2/VOTRE_CLÉ \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
   
   # Si OK : {"jsonrpc":"2.0","id":1,"result":"0x..."}
   # Si KO : {"error":"..."}
   ```

3. **Partagez les résultats du test de clé** :
   - God Mode → API Keys → Run Test
   - Copiez tous les détails affichés

---

## ✅ Une Fois Corrigé

Après avoir résolu le problème de clé API, tous les endpoints Alchemy fonctionneront :

- ✅ Network Status (mainnet + sepolia)
- ✅ Multi-Chain Gas Tracker
- ✅ Block Details
- ✅ Address Inspector
- ✅ Transfers API
- ✅ Contract Verification
- ✅ Transaction Lookup
- ✅ RPC Proxy
- ✅ Multi-Network Test
- ✅ Event Scanner
- ✅ Contract Tracking avec live refresh

Votre plateforme THESORIA sera alors **100% opérationnelle** pour la production ! 🚀
