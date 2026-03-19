# 🦊 Guide de Connexion MetaMask - Production MEV

## 📋 Table des Matières
1. [Prérequis](#prérequis)
2. [Installation MetaMask](#installation-metamask)
3. [Configuration Initiale](#configuration-initiale)
4. [Connexion à THESORIA](#connexion-à-thesoria)
5. [Réseaux Supportés](#réseaux-supportés)
6. [Fonctionnalités Wallet](#fonctionnalités-wallet)
7. [Sécurité](#sécurité)
8. [Dépannage](#dépannage)

---

## 🎯 Prérequis

### Navigateurs Supportés
- ✅ **Chrome** (recommandé)
- ✅ **Firefox**
- ✅ **Brave**
- ✅ **Edge**

### Configuration Minimale
- Connexion Internet stable
- Au moins **0.1 ETH** pour les frais de gas MEV
- MetaMask extension installée

---

## 🦊 Installation MetaMask

### Étape 1 : Télécharger MetaMask
1. Visitez [metamask.io](https://metamask.io)
2. Cliquez sur **"Download"**
3. Sélectionnez votre navigateur
4. Installez l'extension

### Étape 2 : Créer un Wallet
1. Cliquez sur l'icône MetaMask dans votre navigateur
2. Choisissez **"Créer un nouveau portefeuille"**
3. Créez un mot de passe **fort** (min. 8 caractères)
4. **CRUCIAL** : Notez votre **phrase de récupération** (12 mots)
   - ⚠️ **NE JAMAIS** partager cette phrase
   - 📝 Écrivez-la sur papier
   - 🔒 Conservez-la dans un endroit sûr

### Étape 3 : Sécuriser le Wallet
```
✓ Phrase de récupération notée et sécurisée
✓ Mot de passe fort créé
✓ Extension épinglée dans la barre du navigateur
```

---

## ⚙️ Configuration Initiale

### Ajouter des Fonds
1. **Mainnet Ethereum** (pour production réelle)
   - Achetez ETH sur un exchange (Coinbase, Binance, Kraken)
   - Retirez vers votre adresse MetaMask
   - ⚠️ **Minimum recommandé : 0.5 ETH** pour MEV

2. **Testnet** (pour tests)
   - Obtenez des ETH gratuits sur [faucet](https://faucet.sepolia.dev)
   - Utilisez Sepolia ou Goerli testnet

### Vérifier le Réseau
1. Ouvrez MetaMask
2. En haut, vérifiez le réseau actuel
3. Pour MEV production → **Ethereum Mainnet**
4. Pour tests → **Sepolia Testnet**

---

## 🚀 Connexion à THESORIA

### Processus de Connexion

#### 1. Accéder à la Plateforme
```bash
# Terminal - À la racine du projet
npm run dev
```

Ouvrez votre navigateur : **http://localhost:3000**

#### 2. Naviguer vers MEV God Mode
- Cliquez sur **"MEV GOD"** dans la navigation
- Ou scrollez jusqu'à la section "Flash Loan God Mode"

#### 3. Connecter MetaMask

**Bouton "Connecter MetaMask"**
```
┌─────────────────────────────────┐
│ 🔐 Connecter MetaMask           │
└─────────────────────────────────┘
```

#### 4. Autoriser la Connexion
MetaMask va afficher une popup :
```
┌──────────────────────────────────┐
│ THESORIA veut se connecter      │
│                                  │
│ Adresse : 0x1234...5678          │
│                                  │
│ [Annuler]     [Connecter]       │
└──────────────────────────────────┘
```

**Cliquez sur "Connecter"**

#### 5. Confirmation de Connexion
Toast de succès apparaît :
```
✓ Wallet connecté !
  0x1234...5678 sur Ethereum Mainnet
```

### Interface Post-Connexion

#### Status Bar
```
┌──────────────┬──────────────┬──────────────┐
│ 🟢 Wallet    │ 🔵 Backend   │ ⚡ MEV Bot    │
│ Connecté     │ Offline      │ Inactif      │
│              │              │              │
│ 0x1234...78  │ Lancer       │ Prêt à       │
│ 1.2500 ETH   │ main.py      │ démarrer     │
│ 🌐 Mainnet   │              │              │
└──────────────┴──────────────┴──────────────┘
```

#### Informations Affichées
- ✅ **Adresse** : 0x1234...5678 (truncated)
- ✅ **Balance** : 1.2500 ETH (rafraîchissable)
- ✅ **Réseau** : Ethereum Mainnet
- ✅ **Bouton Switch** : si mauvais réseau

---

## 🌐 Réseaux Supportés

### Production
| Réseau | Chain ID | Symbole | Usage MEV |
|--------|----------|---------|-----------|
| **Ethereum Mainnet** | 1 | ETH | ✅ Production réelle |
| Polygon Mainnet | 137 | MATIC | ✅ Flash loans |
| Arbitrum One | 42161 | ETH | ✅ L2 MEV |
| Optimism | 10 | ETH | ✅ L2 MEV |

### Test
| Réseau | Chain ID | Symbole | Usage |
|--------|----------|---------|-------|
| Sepolia Testnet | 11155111 | ETH | ✅ Tests |
| Goerli Testnet | 5 | ETH | ⚠️ Deprecated |

### Switch de Réseau

#### Automatique
Si vous êtes sur un mauvais réseau :
```
🌐 Polygon Mainnet [Switch]
```

Cliquez sur **"Switch"** → Passage automatique vers Ethereum Mainnet

#### Manuel
1. Ouvrez MetaMask
2. Cliquez sur le réseau en haut
3. Sélectionnez **"Ethereum Mainnet"**

---

## 🎛️ Fonctionnalités Wallet

### 1. Rafraîchir la Balance
**Icône** : 🔄 (à droite du solde)

**Action** : Clic → Mise à jour immédiate

```
✓ Balance mise à jour
  1.2500 ETH
```

### 2. Changement Automatique de Compte
MetaMask détecte automatiquement :
- ✅ Changement de compte dans MetaMask
- ✅ Déconnexion du wallet
- ✅ Changement de réseau

**Toast de notification** :
```
ℹ️ Compte changé
   0x9876...5432
```

### 3. Déconnexion
**Bouton** : "Déconnecter Wallet"

```
ℹ️ Wallet déconnecté
```

**Nettoyage automatique** :
- ❌ Adresse effacée
- ❌ Balance réinitialisée
- ❌ Réseau oublié
- ❌ Event listeners retirés

---

## 🔒 Sécurité

### ⚠️ Règles d'Or

#### 1. Phrase de Récupération
```
❌ NE JAMAIS partager votre seed phrase
❌ NE JAMAIS la saisir sur un site web
❌ NE JAMAIS la stocker numériquement
✅ TOUJOURS la garder hors ligne
```

#### 2. Vérifications Avant Signature
Avant chaque transaction MetaMask :
```
1. Vérifier l'adresse de destination
2. Vérifier le montant
3. Vérifier les frais de gas
4. Confirmer le réseau
```

#### 3. Wallet de Production vs Test

**Recommandation** : Utilisez 2 wallets séparés

| Type | Usage | Fonds |
|------|-------|-------|
| 🔴 **Production** | MEV réel | > 0.5 ETH |
| 🟢 **Test** | Développement | Testnet ETH gratuit |

#### 4. Protection Anti-Phishing
```
✓ Vérifiez toujours l'URL : localhost:3000
✓ MetaMask affiche toujours l'origine de la demande
✓ Ne signez jamais de messages suspects
```

### 🛡️ Fonctionnalités de Sécurité Intégrées

#### Event Listeners Sécurisés
```typescript
// Nettoyage automatique à la déconnexion
window.ethereum.removeListener('accountsChanged')
window.ethereum.removeListener('chainChanged')
```

#### Validation Réseau
```typescript
// Détection réseau non supporté
if (!SUPPORTED_NETWORKS[networkId]) {
  toast.warning('Réseau non supporté');
}
```

---

## 🔧 Dépannage

### ❌ MetaMask Non Détecté

**Symptôme** :
```
❌ MetaMask non détecté
   Installez MetaMask pour continuer
```

**Solutions** :
1. ✅ Vérifier que l'extension est installée
2. ✅ Rafraîchir la page (F5)
3. ✅ Redémarrer le navigateur
4. ✅ Réinstaller MetaMask si nécessaire

---

### ⚠️ Réseau Non Supporté

**Symptôme** :
```
⚠️ Réseau non supporté
   Veuillez changer de réseau
```

**Solutions** :
1. Cliquer sur le bouton **"Switch"**
2. Ou manuellement dans MetaMask :
   - Ouvrir MetaMask
   - Cliquer sur le réseau
   - Sélectionner "Ethereum Mainnet"

---

### 🔴 Erreur "Insufficient Funds"

**Symptôme** :
```
❌ Insufficient funds for transaction
```

**Solutions** :
1. ✅ Vérifier balance : doit être > frais gas
2. ✅ Ajouter des fonds ETH
3. ✅ Réduire le montant de la transaction

---

### 🔄 Balance Non Actualisée

**Solutions** :
1. Cliquer sur l'icône 🔄 à côté du solde
2. Ou déconnecter/reconnecter le wallet
3. Vérifier dans MetaMask directement

---

### 🌐 Page Se Recharge Continuellement

**Cause** : Changement de réseau détecté

**Comportement normal** :
```javascript
// Auto-reload après switch réseau
window.location.reload();
```

**Solution** : Attendez la fin du rechargement (1-2 secondes)

---

### 🚫 Bot Ne Démarre Pas

**Symptôme** :
```
❌ Connectez votre wallet d'abord !
```

**Vérifications** :
```
□ Wallet connecté ?
□ Backend Python lancé ? (ws://localhost:8765)
□ Réseau correct ?
```

**Checklist** :
1. ✅ Connecter MetaMask
2. ✅ Activer Backend Python
3. ✅ Vérifier connexion WebSocket
4. ✅ Démarrer le bot MEV

---

## 📊 Flux de Travail Complet

### Production Réelle

```
1. [Installation]
   └─ Installer MetaMask
   └─ Créer/Importer wallet
   └─ Ajouter 0.5+ ETH

2. [Connexion]
   └─ Lancer npm run dev
   └─ Aller sur MEV GOD
   └─ Connecter MetaMask
   └─ Autoriser la connexion

3. [Vérification]
   └─ Adresse affichée ✓
   └─ Balance correcte ✓
   └─ Réseau = Mainnet ✓

4. [Activation Backend]
   └─ Lancer main.py (Terminal 2)
   └─ Cliquer "Activer Backend Python"
   └─ Attendre "Backend connecté" ✓

5. [Démarrage Trading]
   └─ Cliquer "Démarrer Bot MEV"
   └─ 4 composants premium apparaissent
   └─ Alertes en temps réel
   └─ Profits automatiques

6. [Monitoring]
   └─ Charts interactifs
   └─ Analyse de risque
   └─ 8 stratégies actives
   └─ Système d'alertes
```

---

## 🎯 Checklist Pré-Production

### Avant de Commencer
```
☐ MetaMask installé et configuré
☐ Seed phrase notée et sécurisée
☐ Wallet chargé avec 0.5+ ETH
☐ Réseau = Ethereum Mainnet
☐ Backend Python prêt (main.py)
☐ npm run dev lancé
☐ Navigateur sur localhost:3000
```

### Pendant le Trading
```
☐ Balance surveillée
☐ Gas price raisonnable (< 100 gwei)
☐ Alertes activées
☐ Stratégies configurées
☐ Risques analysés en temps réel
```

### Après le Trading
```
☐ Profits enregistrés
☐ Stats sauvegardées
☐ Wallet déconnecté (optionnel)
☐ Backend arrêté (Ctrl+C)
```

---

## 💡 Conseils Pro

### Optimisation Gas
```typescript
// Le système détecte automatiquement :
- Gas price trop élevé → Alerte orange
- Compétition haute → Risque signalé
- Liquidité faible → Trade non recommandé
```

### Multi-Stratégies
```
✓ Activer plusieurs stratégies simultanément
✓ Diversifier les risques
✓ Maximiser les opportunités
```

### Monitoring 24/7
```
✓ Laisser le bot tourner
✓ Alertes système activées
✓ Surveillance automatique
✓ Profits accumulés en continu
```

---

## 🆘 Support

### Erreurs Courantes

| Code | Message | Solution |
|------|---------|----------|
| 4001 | User rejected | Approuver dans MetaMask |
| 4100 | Unauthorized | Reconnecter wallet |
| 4900 | Disconnected | Vérifier connexion Internet |
| -32002 | Request pending | Attendre ou annuler dans MetaMask |

### Ressources
- 📘 [Documentation MetaMask](https://docs.metamask.io)
- 🦊 [Support MetaMask](https://metamask.zendesk.com)
- 💬 [Discord THESORIA](#)

---

## ✅ Validation Finale

### Test de Connexion Réussie
```
✓ Wallet Status = 🟢 Connecté
✓ Adresse affichée = 0x1234...5678
✓ Balance affichée = X.XXXX ETH
✓ Réseau affiché = Ethereum Mainnet
✓ Bouton rafraîchir fonctionne = 🔄
✓ 4 composants premium visibles
```

### Prêt pour Production !
```
🎉 CONFIGURATION COMPLÈTE

Votre plateforme MEV est maintenant connectée
et prête à générer des profits réels !

Prochaine étape : Démarrer le Bot MEV ⚡
```

---

**Date de création** : 24 Décembre 2024  
**Version** : 1.0.0 - Production Ready  
**Auteur** : THESORIA Platform
