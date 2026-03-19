# 🔍 GUIDE DÉBOGAGE CONNEXION METAMASK

## 🎯 ERREUR: "Failed to connect to MetaMask"

Cette erreur se produit lors de la tentative de connexion à MetaMask. Voici comment la résoudre étape par étape.

---

## ✅ ÉTAPE 1: VÉRIFICATION BASIQUE

### **Ouvrir la Console (F12)**
```
1. Sur THESORIA, appuyer F12
2. Cliquer sur l'onglet "Console"
3. Observer les messages
```

### **Vérifier MetaMask installé**
Dans la console, taper:
```javascript
console.log(window.ethereum)
```

**Résultat attendu:**
```
{isMetaMask: true, request: ƒ, on: ƒ, ...}
```

**Si `undefined`:**
```
❌ MetaMask n'est pas installé
→ Solution: https://metamask.io/download/
```

---

## ✅ ÉTAPE 2: VÉRIFICATION ÉTAT METAMASK

### **Tester manuellement la connexion**
Dans la console, taper:
```javascript
window.ethereum.request({ method: 'eth_requestAccounts' })
  .then(accounts => console.log('✅ Comptes:', accounts))
  .catch(error => console.error('❌ Erreur:', error))
```

### **Résultats possibles:**

#### **1. Succès ✅**
```
✅ Comptes: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb6']
```
→ MetaMask fonctionne ! Le problème est ailleurs.

#### **2. Erreur Code 4001**
```
❌ Erreur: {code: 4001, message: "User rejected the request"}
```
→ Vous avez cliqué "Rejeter"
→ Solution: Réessayer et cliquer "Suivant" puis "Connecter"

#### **3. Erreur Code -32002**
```
❌ Erreur: {code: -32002, message: "Already processing eth_requestAccounts"}
```
→ Une demande est déjà ouverte
→ Solution: Ouvrir MetaMask et accepter/rejeter la demande

#### **4. Erreur Code -32603**
```
❌ Erreur: {code: -32603, message: "Internal error"}
```
→ MetaMask est verrouillé ou en erreur
→ Solution: Déverrouiller MetaMask

---

## ✅ ÉTAPE 3: DIAGNOSTIC AVANCÉ

### **Vérifier version MetaMask**
Dans la console:
```javascript
console.log('Version:', window.ethereum.isMetaMask ? 'MetaMask détecté' : 'Non détecté')
console.log('Network:', window.ethereum.networkVersion)
```

### **Vérifier comptes existants**
```javascript
window.ethereum.request({ method: 'eth_accounts' })
  .then(accounts => console.log('Comptes autorisés:', accounts))
```

**Si tableau vide `[]`:**
```
→ Aucun compte pré-autorisé
→ Normal pour première connexion
→ Utiliser eth_requestAccounts
```

### **Vérifier listeners**
```javascript
console.log('Events:', window.ethereum._events)
```

---

## 🔧 SOLUTIONS PAR TYPE D'ERREUR

### **Type 1: MetaMask non détecté**

**Symptôme:**
```
window.ethereum === undefined
```

**Solutions:**
1. Installer MetaMask: https://metamask.io/download/
2. Redémarrer le navigateur
3. Vérifier que l'extension est activée (chrome://extensions/)

---

### **Type 2: Demande rejetée (4001)**

**Symptôme:**
```
User rejected the request
```

**Solutions:**
1. Cliquer à nouveau "Connecter MetaMask"
2. Dans le popup MetaMask:
   - Cliquer "Suivant"
   - Cliquer "Connecter"
3. ✅ Connexion établie

---

### **Type 3: Demande en attente (-32002)**

**Symptôme:**
```
Already processing eth_requestAccounts
```

**Solutions:**
1. Cliquer sur l'icône MetaMask (barre outils)
2. Vous devriez voir: "Connect with THESORIA"
3. Cliquer "Suivant" puis "Connecter"
4. Si rien ne s'affiche:
   ```
   a. Fermer tous les popups MetaMask
   b. Rafraîchir THESORIA (F5)
   c. Réessayer
   ```

---

### **Type 4: Erreur interne (-32603)**

**Symptôme:**
```
Internal error
```

**Solutions:**
1. **Déverrouiller MetaMask:**
   - Cliquer icône MetaMask
   - Entrer mot de passe
   - Cliquer "Déverrouiller"

2. **Reset account (si persist):**
   ```
   MetaMask → Settings → Advanced → Reset Account
   ```

3. **Redémarrer navigateur:**
   - Fermer complètement le navigateur
   - Rouvrir
   - Réessayer

---

## 🔍 LOGS DÉTAILLÉS THESORIA

Quand vous cliquez "Connecter MetaMask", vous devriez voir dans la console:

### **Flux normal ✅**
```
🔍 Tentative de connexion MetaMask...
📋 Vérification comptes existants...
✅ Comptes existants trouvés: 1
🚀 Initialisation provider avec ethers.js...
📍 Adresse récupérée: 0x742d...
🌐 Réseau détecté: 1
💰 Balance: 2.5000 ETH
✅ God Mode - Wallet connecté: 0x742d...
✅ God Mode - Réseau: Ethereum Mainnet
🔥 MODE PRODUCTION RÉEL ACTIVÉ 🔥
```

### **Flux avec autorisation requise ✅**
```
🔍 Tentative de connexion MetaMask...
📋 Vérification comptes existants...
ℹ️ Aucun compte pré-autorisé
🔐 Demande d'autorisation MetaMask...
[Popup MetaMask s'ouvre]
[Utilisateur clique "Connecter"]
✅ Autorisation accordée, comptes: 1
🚀 Initialisation provider avec ethers.js...
[...suite normale...]
```

### **Flux avec erreur ❌**
```
🔍 Tentative de connexion MetaMask...
📋 Vérification comptes existants...
ℹ️ Aucun compte pré-autorisé
🔐 Demande d'autorisation MetaMask...
❌ Erreur demande autorisation: {code: 4001, ...}
❌ Erreur connexion wallet: Error: Connexion refusée...
```

---

## 🛠️ TEST MANUEL COMPLET

Copiez-collez ce code dans la console pour tester:

```javascript
async function testMetaMask() {
  console.log('🔍 === TEST METAMASK ===');
  
  // Test 1: Détection
  console.log('1. MetaMask détecté:', !!window.ethereum);
  if (!window.ethereum) {
    console.error('❌ MetaMask non installé');
    return;
  }
  
  // Test 2: Vérification type
  console.log('2. Est MetaMask:', window.ethereum.isMetaMask);
  
  // Test 3: Comptes existants
  try {
    const existingAccounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    console.log('3. Comptes existants:', existingAccounts);
  } catch (e) {
    console.error('3. Erreur comptes existants:', e);
  }
  
  // Test 4: Demande connexion
  try {
    console.log('4. Demande connexion...');
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    console.log('✅ Connexion réussie! Comptes:', accounts);
    
    // Test 5: Réseau
    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });
    console.log('5. Chain ID:', chainId, '(', parseInt(chainId, 16), ')');
    
    // Test 6: Balance
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest']
    });
    console.log('6. Balance:', parseInt(balance, 16) / 1e18, 'ETH');
    
    console.log('✅ === TOUS LES TESTS PASSÉS ===');
  } catch (e) {
    console.error('❌ Erreur connexion:', e);
    console.error('   Code:', e.code);
    console.error('   Message:', e.message);
  }
}

testMetaMask();
```

---

## 📊 INTERPRÉTATION RÉSULTATS

### **Tous verts ✅**
```
✅ MetaMask fonctionne parfaitement
→ Le problème est dans le code THESORIA
→ Vérifier les logs avec préfixe [God Mode]
```

### **Erreur au Test 1 ❌**
```
❌ MetaMask non installé
→ Installer: https://metamask.io/download/
```

### **Erreur au Test 4 (Code 4001) ❌**
```
❌ Connexion refusée
→ Réessayer et accepter dans MetaMask
```

### **Erreur au Test 4 (Code -32002) ❌**
```
❌ Demande déjà en attente
→ Ouvrir MetaMask et gérer la demande
```

### **Erreur au Test 4 (Code -32603) ❌**
```
❌ Erreur interne MetaMask
→ Déverrouiller wallet
→ Ou Reset Account
```

---

## 🔄 RESET COMPLET (Solution ultime)

Si rien ne fonctionne après tous les tests:

### **1. Sauvegarder Seed Phrase**
```
MetaMask → Settings → Security & Privacy
→ "Reveal Secret Recovery Phrase"
⚠️ COPIER ET SAUVEGARDER PRÉCIEUSEMENT
```

### **2. Désinstaller MetaMask**
```
chrome://extensions/
→ Trouver MetaMask
→ Cliquer "Supprimer"
```

### **3. Nettoyer cache navigateur**
```
chrome://settings/clearBrowserData
→ Cocher "Cookies" et "Cached images"
→ "Effacer les données"
```

### **4. Réinstaller MetaMask**
```
https://metamask.io/download/
→ Installer extension
→ Restaurer avec seed phrase
```

### **5. Tester connexion**
```
Retourner sur THESORIA
→ /god-mode
→ PIN: THESORIA2026
→ Web3 🟢
→ "Connecter MetaMask"
```

---

## 📞 SUPPORT

### **Ressources officielles:**
- MetaMask Support: https://support.metamask.io/
- MetaMask Docs: https://docs.metamask.io/
- Discord MetaMask: https://discord.gg/metamask

### **Questions fréquentes:**
- "Request already pending" → Vérifier popup MetaMask
- "User rejected" → Accepter la demande
- "Internal error" → Déverrouiller wallet

---

## ✅ CHECKLIST FINALE

Avant de demander de l'aide, vérifier:

```
☑ MetaMask installé (window.ethereum existe)
☑ MetaMask déverrouillé (icône colorée)
☑ Au moins 1 compte créé
☑ Pas de demande en attente
☑ Pop-ups autorisés pour THESORIA
☑ Console ouverte (F12) pour voir les logs
☑ Test manuel réussi (code ci-dessus)
```

---

**Si tous les tests passent mais THESORIA ne se connecte toujours pas, partager:**
- Screenshot de la console
- Logs avec préfixe `[God Mode]`
- Version MetaMask (Settings → About)
- Navigateur utilisé

---

*Guide de débogage - Version 1.0*  
*Mis à jour: 2026-03-14*
