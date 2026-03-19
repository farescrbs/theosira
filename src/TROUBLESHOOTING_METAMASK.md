# 🔧 TROUBLESHOOTING - CONNEXION METAMASK

## 🚨 ERREURS COURANTES ET SOLUTIONS

---

## 1. ❌ "Failed to connect to MetaMask"

### **Causes possibles:**
1. MetaMask n'est pas installé
2. MetaMask est verrouillé
3. Demande de connexion déjà en attente
4. Extension MetaMask désactivée

### **Solutions:**

#### **A. Vérifier l'installation MetaMask**
```
1. Ouvrir un nouvel onglet
2. Aller sur: chrome://extensions/
3. Chercher "MetaMask"
4. Si absent → Installer depuis: https://metamask.io/download/
```

#### **B. Déverrouiller MetaMask**
```
1. Cliquer sur l'icône MetaMask (renard orange)
2. Entrer votre mot de passe
3. Cliquer "Déverrouiller"
4. Retourner sur THESORIA
5. Réessayer la connexion
```

#### **C. Demande en attente**
```
1. Ouvrir MetaMask
2. Vérifier s'il y a une notification
3. Accepter ou rejeter la demande existante
4. Fermer tous les popups MetaMask
5. Réessayer sur THESORIA
```

#### **D. Réinitialisation complète**
```
1. Fermer THESORIA
2. Ouvrir MetaMask
3. Settings → Advanced → Reset Account
4. Confirmer
5. Rouvrir THESORIA
6. Reconnecter
```

---

## 2. ❌ "User rejected the request" (Code 4001)

### **Message:**
```
Connexion refusée. Veuillez accepter la demande dans MetaMask.
```

### **Cause:**
Vous avez cliqué sur "Rejeter" dans le popup MetaMask.

### **Solution:**
```
1. Re-cliquer sur "Connecter MetaMask" dans THESORIA
2. Dans le popup MetaMask → Cliquer "Suivant"
3. Cliquer "Connecter"
4. ✅ Connexion établie
```

---

## 3. ❌ "Request already pending" (Code -32002)

### **Message:**
```
Une demande de connexion est déjà en attente. Veuillez vérifier MetaMask.
```

### **Cause:**
Une demande de connexion est déjà ouverte dans MetaMask.

### **Solution:**
```
1. Cliquer sur l'icône MetaMask (barre d'outils)
2. Vous devriez voir une demande en attente
3. Options:
   a. Accepter → Connexion réussie
   b. Rejeter → Réessayer sur THESORIA
4. Si rien n'apparaît:
   - Fermer MetaMask
   - Rafraîchir THESORIA (F5)
   - Reconnecter
```

---

## 4. ❌ "MetaMask is not installed"

### **Message:**
```
MetaMask n'est pas installé. Installez l'extension MetaMask depuis metamask.io
```

### **Solution:**

#### **Installation Chrome/Brave/Edge:**
```
1. Aller sur: https://metamask.io/download/
2. Cliquer "Install MetaMask for Chrome"
3. Cliquer "Ajouter à Chrome"
4. Confirmer
5. Suivre le setup MetaMask:
   - Créer nouveau wallet OU
   - Importer wallet existant (seed phrase)
6. Retourner sur THESORIA
7. Connecter
```

#### **Installation Firefox:**
```
1. Aller sur: https://metamask.io/download/
2. Cliquer "Install MetaMask for Firefox"
3. Cliquer "Ajouter à Firefox"
4. Confirmer
5. Setup comme ci-dessus
```

---

## 5. ❌ "Aucun compte trouvé dans MetaMask"

### **Message:**
```
Aucun compte trouvé dans MetaMask. Veuillez créer ou importer un compte.
```

### **Cause:**
Aucun compte Ethereum dans votre wallet MetaMask.

### **Solution:**

#### **Créer un nouveau compte:**
```
1. Ouvrir MetaMask
2. Cliquer sur l'icône ronde (en haut à droite)
3. "Create Account"
4. Entrer un nom (ex: "Main Account")
5. "Create"
6. ✅ Compte créé
7. Retourner sur THESORIA
```

#### **Importer un compte existant:**
```
1. Ouvrir MetaMask
2. Cliquer sur l'icône ronde (en haut à droite)
3. "Import Account"
4. Coller votre clé privée (Private Key)
5. "Import"
6. ✅ Compte importé
```

---

## 6. ❌ Connexion réussie mais balance à 0 ETH

### **Pas une erreur** mais voici comment obtenir des fonds:

#### **Mainnet (argent réel):**
```
1. Acheter ETH sur un exchange (Coinbase, Binance, Kraken)
2. Retirer vers votre adresse MetaMask
3. Attendre confirmation (~10-15 min)
```

#### **Testnet (argent fictif - GRATUIT):**
```
Sepolia Faucet:
1. Copier votre adresse MetaMask
2. Aller sur: https://sepoliafaucet.com/
3. Coller votre adresse
4. "Send Me ETH"
5. Attendre 1-2 min
6. ✅ 0.5 ETH gratuit reçu

Mumbai Faucet (Polygon testnet):
1. Copier votre adresse
2. Aller sur: https://faucet.polygon.technology/
3. Sélectionner "Mumbai"
4. Coller votre adresse
5. "Submit"
6. ✅ 0.1 MATIC gratuit
```

---

## 7. ❌ "Wrong network" / Mauvais réseau

### **Problème:**
Vous êtes sur Goerli mais THESORIA affiche "Chain 5".

### **Solution - Changer de réseau:**

#### **Méthode 1 - Via MetaMask:**
```
1. Ouvrir MetaMask
2. Cliquer sur le nom du réseau (en haut)
3. Sélectionner:
   - Ethereum Mainnet
   - Sepolia Testnet
   - Polygon
   - etc.
4. Attendre 2-3 secondes
5. THESORIA se met à jour automatiquement
```

#### **Méthode 2 - Ajouter un réseau custom:**
```
1. MetaMask → Réseaux → "Ajouter un réseau"
2. Exemple Polygon:
   - Nom: Polygon Mainnet
   - RPC: https://polygon-rpc.com/
   - Chain ID: 137
   - Symbole: MATIC
   - Explorer: https://polygonscan.com/
3. "Enregistrer"
4. Sélectionner le nouveau réseau
```

---

## 8. ❌ Transaction échoue / Gas trop élevé

### **Message:**
```
Erreur: insufficient funds for gas * price + value
```

### **Cause:**
Vous n'avez pas assez d'ETH pour couvrir le gas.

### **Solution:**
```
1. Vérifier votre balance ETH
2. Le gas nécessaire = 21,000 * gas price
3. Exemple:
   - Gas price: 50 Gwei
   - Gas limit: 21,000
   - Coût: 0.00105 ETH (~$2.50)
4. Vous devez avoir: Montant envoyé + Gas
5. Si balance insuffisante:
   - Réduire le montant envoyé OU
   - Ajouter plus d'ETH au wallet
```

---

## 9. 🔄 RÉINITIALISATION COMPLÈTE

### **Si rien ne fonctionne:**

```
ÉTAPE 1: Sauvegarder seed phrase
1. MetaMask → Settings → Security & Privacy
2. "Reveal Secret Recovery Phrase"
3. ⚠️ COPIER ET SAUVEGARDER PRÉCIEUSEMENT
4. Ne JAMAIS partager cette phrase

ÉTAPE 2: Désinstaller MetaMask
1. chrome://extensions/
2. Trouver MetaMask
3. Cliquer "Supprimer"
4. Confirmer

ÉTAPE 3: Réinstaller
1. https://metamask.io/download/
2. "Install MetaMask for Chrome"
3. Suivre l'installation

ÉTAPE 4: Restaurer wallet
1. Ouvrir MetaMask
2. "Import using Secret Recovery Phrase"
3. Entrer votre seed phrase (12 ou 24 mots)
4. Créer nouveau mot de passe
5. "Restore"

ÉTAPE 5: Reconnecter THESORIA
1. Aller sur /god-mode
2. PIN: THESORIA2026
3. Onglet Web3 🟢
4. "Connecter MetaMask"
5. ✅ Connexion réussie
```

---

## 10. 📱 DEBUGGING CONSOLE

### **Voir les erreurs détaillées:**

```
1. Sur THESORIA, appuyer F12 (ouvrir DevTools)
2. Aller dans l'onglet "Console"
3. Essayer de connecter MetaMask
4. Observer les messages:
   - ❌ Rouge = Erreur
   - ⚠️ Jaune = Warning
   - ℹ️ Bleu = Info
5. Screenshot l'erreur si besoin d'aide
```

### **Logs THESORIA:**
```
✅ Mode production activé:
  - "🔥 MODE PRODUCTION RÉEL ACTIVÉ 🔥"
  - "✅ God Mode - Wallet connecté: 0x..."
  - "✅ God Mode - Réseau: Ethereum Mainnet"

❌ Erreurs courantes:
  - "❌ Erreur connexion wallet: ..."
  - Code: 4001 → Connexion refusée
  - Code: -32002 → Demande en attente
```

---

## 11. 🆘 SUPPORT

### **Si le problème persiste:**

1. **Vérifier la configuration:**
   ```
   - MetaMask installé: ✓
   - MetaMask déverrouillé: ✓
   - Au moins 1 compte: ✓
   - Réseau sélectionné: ✓
   ```

2. **Informations à fournir:**
   - Message d'erreur exact
   - Screenshot de la console (F12)
   - Version de MetaMask (Settings → About)
   - Navigateur utilisé (Chrome/Firefox/Brave)
   - Réseau blockchain (Mainnet/Sepolia/etc.)

3. **Ressources officielles:**
   - MetaMask Support: https://support.metamask.io/
   - Discord MetaMask: https://discord.gg/metamask
   - Twitter: @MetaMask

---

## ✅ CHECKLIST AVANT CONNEXION

```
☑ MetaMask installé et visible dans la barre d'outils
☑ MetaMask déverrouillé (icône colorée, pas grise)
☑ Au moins 1 compte Ethereum créé
☑ Réseau sélectionné (Mainnet ou Testnet)
☑ Aucune demande en attente dans MetaMask
☑ Pop-ups autorisés pour THESORIA
☑ Extensions tierces désactivées (si conflit)
☑ THESORIA ouvert sur /god-mode avec PIN correct
```

---

## 🎯 CONNEXION RÉUSSIE - VOUS DEVRIEZ VOIR:

```
God Mode → Web3 🟢
┌─────────────────────────────────────────┐
│ WEB3 CONNECTION                         │
├─────────────────────────────────────────┤
│ ADRESSE                                 │
│ 0x742d...bEb6 [📋]                      │
│                                         │
│ RÉSEAU                                  │
│ Ethereum Mainnet                        │
│ Chain ID: 1                             │
│                                         │
│ BALANCE                                 │
│ 2.5000 ETH                             │
│ $6,250.00 USD                          │
│                                         │
│ [Déconnecter] [Rafraîchir]             │
└─────────────────────────────────────────┘
```

---

## 🔥 TOUT FONCTIONNE !

Vous êtes maintenant connecté et prêt à utiliser les **21 fonctionnalités blockchain** de THESORIA !

**Profitez du God Mode Ultimate !** 🚀

---

*Dernière mise à jour: 2026-03-14*
