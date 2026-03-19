# 🌐 Intégration Web3 God Mode - THESORIA

## 📋 Vue d'ensemble

Le **God Mode** dispose désormais d'une **intégration Web3 réelle** permettant des interactions blockchain authentiques directement depuis l'interface d'administration.

## ✨ Fonctionnalités

### 🔐 Connexion Wallet
- **MetaMask** integration complète
- Détection automatique du réseau
- Gestion des changements de compte/réseau
- Affichage du solde ETH en temps réel

### 🔍 Contract Inspector
- **Inspection de contrats ERC-20**
- **Inspection de contrats ERC-3643** (THESORIA)
- Récupération automatique des métadonnées :
  - Nom du token
  - Symbole
  - Decimals
  - Total Supply
  - Status (paused/active pour ERC-3643)

### 💸 Transactions
- **Envoi d'ETH** direct
- **Transfert de tokens ERC-20**
- Suivi des transactions en temps réel
- Historique des transactions

### 🔗 Réseaux supportés
- Ethereum Mainnet (Chain ID: 1)
- Polygon (Chain ID: 137)
- Gnosis Chain (Chain ID: 100)
- Sepolia Testnet (Chain ID: 11155111)
- Goerli (Chain ID: 5)
- Mumbai (Chain ID: 80001)

## 🛠️ Architecture Technique

### Hook: `useWeb3GodMode`

```typescript
import { useWeb3GodMode } from '../hooks/useWeb3GodMode';

const web3 = useWeb3GodMode();

// État
web3.isConnected // boolean
web3.address // string | null
web3.chainId // number | null
web3.networkName // string
web3.ethBalance // string
web3.provider // BrowserProvider | null
web3.signer // Signer | null

// Actions
web3.connectWallet() // Promise<void>
web3.disconnectWallet() // void
web3.getContractInfo(address) // Promise<ContractInfo>
web3.getTokenBalance(tokenAddress, walletAddress?) // Promise<string>
web3.sendETH(to, amount) // Promise<TransactionResult>
web3.transferToken(tokenAddress, to, amount) // Promise<TransactionResult>
```

### Composant: `GodModeWeb3Tab`

Onglet Web3 dédié dans le God Mode avec :
- Interface de connexion wallet
- Inspector de contrats interactif
- Formulaire d'envoi de transactions
- Historique des transactions récentes

## 📝 Utilisation

### 1. Accéder au God Mode
```
URL: /god-mode
PIN: THESORIA2026
```

### 2. Naviguer vers l'onglet Web3
Cliquez sur l'onglet **"Web3 🟢"** (indicateur vert si connecté)

### 3. Connecter MetaMask
Cliquez sur **"Connecter MetaMask"**

### 4. Inspecter un contrat

#### ERC-3643 THESORIA (exemple)
```
Adresse: 0x... (à déployer)
Type: ERC-3643
```

#### USDC Polygon (exemple)
```
Adresse: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
Type: ERC-20
```

### 5. Envoyer une transaction
1. Entrer l'adresse destinataire
2. Entrer le montant en ETH
3. Cliquer sur "Envoyer Transaction"
4. Confirmer dans MetaMask

## 🔒 Sécurité

### Bonnes pratiques implémentées :
- ✅ Aucune clé privée stockée côté client
- ✅ Utilisation de MetaMask pour la signature
- ✅ Vérification du solde avant envoi
- ✅ Validation des adresses
- ✅ Gestion des erreurs complète
- ✅ Timeout et retry automatiques
- ✅ Logs console détaillés pour debugging

### Warnings :
- ⚠️ **God Mode** = Accès administrateur complet
- ⚠️ Ne jamais partager le PIN `THESORIA2026`
- ⚠️ Vérifier le réseau avant toute transaction
- ⚠️ Double-vérifier les adresses de destination

## 🧪 Tests

### Test de connexion wallet
1. Ouvrir `/god-mode`
2. Entrer PIN `THESORIA2026`
3. Aller sur l'onglet "Web3"
4. Cliquer sur "Connecter MetaMask"
5. Vérifier que l'adresse s'affiche

### Test d'inspection de contrat
1. Se connecter (étape ci-dessus)
2. Entrer une adresse de contrat ERC-20 (ex: USDC)
3. Cliquer sur "Inspecter"
4. Vérifier que les métadonnées s'affichent

### Test d'envoi de transaction
1. Se connecter (étape ci-dessus)
2. S'assurer d'avoir du testnet ETH (Sepolia, Mumbai...)
3. Entrer une adresse de destination
4. Entrer un montant (ex: 0.001 ETH)
5. Cliquer sur "Envoyer Transaction"
6. Confirmer dans MetaMask
7. Vérifier que la transaction apparaît dans l'historique

## 🔗 Intégration Alchemy

Le hook Web3 God Mode s'intègre avec l'API Alchemy via :

```typescript
const data = await web3.getAlchemyData('endpoint', { params });
```

Cette fonction appelle automatiquement le backend Supabase qui gère l'API key de manière sécurisée.

## 📊 Monitoring

Tous les événements Web3 du God Mode sont loggés :

```javascript
console.log('✅ God Mode - Wallet connecté:', address);
console.log('✅ God Mode - Réseau:', networkName);
console.log('✅ Contract Info:', contractInfo);
```

## 🚀 Prochaines Étapes

### À implémenter :
- [ ] Multi-signature wallet support
- [ ] Batch transactions
- [ ] Gas estimation avancée
- [ ] Transaction replay protection
- [ ] ENS resolution
- [ ] Token allowances management
- [ ] NFT support (ERC-721, ERC-1155)
- [ ] DeFi integration (Uniswap, Aave...)

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs console (F12)
2. Vérifier que MetaMask est installé
3. Vérifier le réseau sélectionné dans MetaMask
4. Consulter la documentation Ethers.js v6

---

**Version:** 1.0.0  
**Date:** 2026-03-09  
**Statut:** ✅ Production Ready
