# 🔬 MetaMask - Documentation Technique Avancée

## 📋 Architecture de Connexion

### Vue d'Ensemble
```
┌──────────────────────────────────────────────────────────┐
│                    THESORIA Platform                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         FlashLoanGodMode Component             │    │
│  ├────────────────────────────────────────────────┤    │
│  │                                                │    │
│  │  connectWallet()                              │    │
│  │       ↓                                        │    │
│  │  window.ethereum.request()                    │    │
│  │       ↓                                        │    │
│  │  ┌──────────────────────────────┐            │    │
│  │  │      MetaMask Extension      │            │    │
│  │  └──────────────────────────────┘            │    │
│  │       ↓                                        │    │
│  │  Event Listeners:                             │    │
│  │  - accountsChanged                            │    │
│  │  - chainChanged                               │    │
│  │                                                │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🔌 Fonctions Principales

### 1. connectWallet()

**Signature** :
```typescript
const connectWallet = async () => Promise<void>
```

**Flux d'Exécution** :
```
1. Vérification MetaMask installé
   └─ if (!window.ethereum) → Error toast

2. Demande accès compte
   └─ eth_requestAccounts → accounts[]

3. Récupération réseau
   └─ eth_chainId → networkId

4. Validation réseau
   └─ SUPPORTED_NETWORKS[networkId]

5. Récupération balance
   └─ eth_getBalance → balance (wei → eth)

6. Enregistrement event listeners
   └─ accountsChanged, chainChanged

7. Success toast
   └─ "Wallet connecté ! 0x1234...5678"
```

**Code Complet** :
```typescript
const connectWallet = async () => {
  // 1. Détection MetaMask
  if (typeof window.ethereum === 'undefined') {
    toast.error('MetaMask non détecté', {
      description: 'Installez MetaMask pour continuer'
    });
    return;
  }
  
  try {
    // 2. Demande accès compte
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    const address = accounts[0];
    setWalletAddress(address);
    setWalletConnected(true);
    
    // 3. Récupération réseau
    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });
    const networkIdNum = parseInt(chainId, 16);
    setNetworkId(networkIdNum);
    
    // 4. Validation réseau
    const network = SUPPORTED_NETWORKS[networkIdNum];
    if (network) {
      setNetworkName(network.name);
      setIsCorrectNetwork(networkIdNum === 1); // Mainnet
      
      toast.success('Wallet connecté !', {
        description: `${address.slice(0, 6)}...${address.slice(-4)} sur ${network.name}`
      });
    } else {
      setNetworkName('Réseau non supporté');
      setIsCorrectNetwork(false);
      
      toast.warning('Réseau non supporté', {
        description: 'Veuillez changer de réseau'
      });
    }
    
    // 5. Récupération balance
    const balanceWei = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    const balanceEth = parseInt(balanceWei, 16) / 1e18;
    setBalance(balanceEth);
    
    // 6. Event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    
  } catch (error: any) {
    console.error('Erreur connexion wallet:', error);
    toast.error('Erreur connexion wallet', {
      description: error.message
    });
  }
};
```

---

### 2. handleAccountsChanged()

**Signature** :
```typescript
const handleAccountsChanged = async (accounts: string[]) => Promise<void>
```

**Scénarios** :
```
Cas 1 : Déconnexion (accounts.length === 0)
   └─ Appel disconnectWallet()
   └─ Nettoyage complet

Cas 2 : Changement compte (accounts[0] !== walletAddress)
   └─ Update walletAddress
   └─ Récupération nouvelle balance
   └─ Toast "Compte changé"

Cas 3 : Même compte
   └─ Aucune action
```

**Code** :
```typescript
const handleAccountsChanged = async (accounts: string[]) => {
  if (accounts.length === 0) {
    // Utilisateur a déconnecté
    disconnectWallet();
  } else if (accounts[0] !== walletAddress) {
    // Nouveau compte
    setWalletAddress(accounts[0]);
    
    // Update balance
    const balanceWei = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest']
    });
    const balanceEth = parseInt(balanceWei, 16) / 1e18;
    setBalance(balanceEth);
    
    toast.info('Compte changé', {
      description: `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
    });
  }
};
```

---

### 3. handleChainChanged()

**Signature** :
```typescript
const handleChainChanged = (chainId: string) => void
```

**Comportement** :
```
1. Conversion chainId (hex → decimal)
   └─ parseInt(chainId, 16)

2. Validation réseau
   └─ SUPPORTED_NETWORKS[networkId]

3. Update état
   └─ networkName, isCorrectNetwork

4. Reload page
   └─ window.location.reload()
   └─ Raison : Reset complet état application
```

**Code** :
```typescript
const handleChainChanged = (chainId: string) => {
  const networkIdNum = parseInt(chainId, 16);
  setNetworkId(networkIdNum);
  
  const network = SUPPORTED_NETWORKS[networkIdNum];
  if (network) {
    setNetworkName(network.name);
    setIsCorrectNetwork(networkIdNum === 1);
    
    toast.info('Réseau changé', {
      description: network.name
    });
  } else {
    setNetworkName('Réseau non supporté');
    setIsCorrectNetwork(false);
    
    toast.warning('Réseau non supporté');
  }
  
  // Reload pour rafraîchir données
  window.location.reload();
};
```

---

### 4. switchToMainnet()

**Signature** :
```typescript
const switchToMainnet = async () => Promise<void>
```

**Protocole** :
```
1. Vérification window.ethereum
2. Requête wallet_switchEthereumChain
3. Paramètre : chainId = '0x1' (Mainnet)
4. Success toast ou Error toast
```

**Code** :
```typescript
const switchToMainnet = async () => {
  if (!window.ethereum) return;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // Ethereum Mainnet
    });
    
    toast.success('Réseau changé vers Ethereum Mainnet');
  } catch (error: any) {
    console.error('Erreur changement réseau:', error);
    toast.error('Erreur changement réseau', {
      description: error.message
    });
  }
};
```

---

### 5. refreshBalance()

**Signature** :
```typescript
const refreshBalance = async () => Promise<void>
```

**Workflow** :
```
1. Validation : walletAddress && window.ethereum
2. eth_getBalance request
3. Conversion wei → eth
4. Update state
5. Success toast
```

**Code** :
```typescript
const refreshBalance = async () => {
  if (!walletAddress || !window.ethereum) return;
  
  try {
    const balanceWei = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest']
    });
    
    const balanceEth = parseInt(balanceWei, 16) / 1e18;
    setBalance(balanceEth);
    
    toast.success('Balance mise à jour', {
      description: `${balanceEth.toFixed(4)} ETH`
    });
  } catch (error) {
    toast.error('Erreur rafraîchissement balance');
  }
};
```

---

### 6. disconnectWallet()

**Signature** :
```typescript
const disconnectWallet = () => void
```

**Nettoyage Complet** :
```
1. Retrait event listeners
   └─ accountsChanged
   └─ chainChanged

2. Reset états
   └─ walletConnected = false
   └─ walletAddress = null
   └─ balance = 0
   └─ networkId = null
   └─ networkName = ''
   └─ isCorrectNetwork = false

3. Toast info "Wallet déconnecté"
```

**Code** :
```typescript
const disconnectWallet = () => {
  // 1. Cleanup listeners
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  }
  
  // 2. Reset state
  setWalletConnected(false);
  setWalletAddress(null);
  setBalance(0);
  setNetworkId(null);
  setNetworkName('');
  setIsCorrectNetwork(false);
  
  // 3. Notification
  toast.info('Wallet déconnecté');
};
```

---

## 🌐 Configuration Réseaux

### SUPPORTED_NETWORKS Object

```typescript
const SUPPORTED_NETWORKS = {
  // Mainnet Production
  1: { 
    name: 'Ethereum Mainnet', 
    symbol: 'ETH', 
    rpc: 'https://eth.llamarpc.com' 
  },
  
  // L2 Mainnets
  137: { 
    name: 'Polygon Mainnet', 
    symbol: 'MATIC', 
    rpc: 'https://polygon-rpc.com' 
  },
  42161: { 
    name: 'Arbitrum One', 
    symbol: 'ETH', 
    rpc: 'https://arb1.arbitrum.io/rpc' 
  },
  10: { 
    name: 'Optimism', 
    symbol: 'ETH', 
    rpc: 'https://mainnet.optimism.io' 
  },
  
  // Testnets
  5: { 
    name: 'Goerli Testnet', 
    symbol: 'ETH', 
    rpc: 'https://goerli.infura.io/v3/' 
  },
  11155111: { 
    name: 'Sepolia Testnet', 
    symbol: 'ETH', 
    rpc: 'https://sepolia.infura.io/v3/' 
  },
};
```

### Ajouter un Nouveau Réseau

```typescript
// 1. Ajouter dans SUPPORTED_NETWORKS
8453: { 
  name: 'Base Mainnet', 
  symbol: 'ETH', 
  rpc: 'https://mainnet.base.org' 
}

// 2. Adapter logique isCorrectNetwork si nécessaire
setIsCorrectNetwork([1, 8453].includes(networkIdNum));
```

---

## 📡 Méthodes RPC MetaMask

### Lecture (Read)

#### eth_chainId
```typescript
const chainId = await window.ethereum.request({ 
  method: 'eth_chainId' 
});
// Retour: '0x1' (Mainnet) ou '0x89' (Polygon)
```

#### eth_getBalance
```typescript
const balanceWei = await window.ethereum.request({
  method: 'eth_getBalance',
  params: [address, 'latest']
});
// Retour: '0x...' (hex wei)
```

#### eth_accounts
```typescript
const accounts = await window.ethereum.request({ 
  method: 'eth_accounts' 
});
// Retour: ['0x...'] ou [] si pas connecté
```

---

### Écriture (Write)

#### eth_requestAccounts
```typescript
const accounts = await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
});
// Déclenche popup MetaMask
// Retour: ['0x...'] après approbation
```

#### wallet_switchEthereumChain
```typescript
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x1' }]
});
// Switch vers réseau spécifié
```

#### wallet_addEthereumChain
```typescript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com']
  }]
});
// Ajoute réseau custom
```

---

## 🎯 Event Listeners

### accountsChanged

**Déclenchement** :
- Utilisateur change de compte dans MetaMask
- Utilisateur déconnecte wallet
- Compte verrouillé

**Payload** :
```typescript
(accounts: string[]) => {
  // accounts = [] si déconnecté
  // accounts = ['0x...'] sinon
}
```

**Usage** :
```typescript
window.ethereum.on('accountsChanged', (accounts) => {
  console.log('Comptes changés:', accounts);
});
```

---

### chainChanged

**Déclenchement** :
- Utilisateur change de réseau dans MetaMask
- Switch programmatique de réseau

**Payload** :
```typescript
(chainId: string) => {
  // chainId = '0x1' (hex)
}
```

**Usage** :
```typescript
window.ethereum.on('chainChanged', (chainId) => {
  console.log('Réseau changé:', chainId);
  window.location.reload(); // Recommandé
});
```

---

### disconnect

**Déclenchement** :
- Perte connexion MetaMask
- Erreur provider

**Usage** :
```typescript
window.ethereum.on('disconnect', (error) => {
  console.error('Déconnecté:', error);
});
```

---

### connect

**Déclenchement** :
- Connexion établie avec MetaMask

**Payload** :
```typescript
{ chainId: string }
```

**Usage** :
```typescript
window.ethereum.on('connect', (connectInfo) => {
  console.log('Connecté au réseau:', connectInfo.chainId);
});
```

---

## 🔐 Gestion d'Erreurs

### Codes d'Erreur Communs

```typescript
interface MetaMaskError {
  code: number;
  message: string;
  data?: any;
}
```

| Code | Signification | Action |
|------|---------------|--------|
| **4001** | User Rejected Request | Utilisateur a refusé |
| **4100** | Unauthorized | Wallet non connecté |
| **4200** | Unsupported Method | Méthode non supportée |
| **4900** | Disconnected | Provider déconnecté |
| **4901** | Chain Disconnected | Réseau déconnecté |
| **-32002** | Request Pending | Requête en attente |
| **-32603** | Internal Error | Erreur interne |

### Gestion Exemple

```typescript
try {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
} catch (error: any) {
  switch (error.code) {
    case 4001:
      toast.error('Connexion refusée', {
        description: 'Veuillez approuver dans MetaMask'
      });
      break;
    
    case -32002:
      toast.warning('Requête en attente', {
        description: 'Vérifiez MetaMask'
      });
      break;
    
    default:
      toast.error('Erreur MetaMask', {
        description: error.message
      });
  }
}
```

---

## 💾 État Global

### Type Definitions

```typescript
interface WalletState {
  walletConnected: boolean;
  walletAddress: string | null;
  balance: number;
  networkId: number | null;
  networkName: string;
  isCorrectNetwork: boolean;
}
```

### État Initial

```typescript
const initialState: WalletState = {
  walletConnected: false,
  walletAddress: null,
  balance: 0,
  networkId: null,
  networkName: '',
  isCorrectNetwork: false
};
```

### Transitions d'État

```
DISCONNECTED → connectWallet() → CONNECTED
              ← disconnectWallet() ←

CONNECTED → handleAccountsChanged([]) → DISCONNECTED
         → handleChainChanged(chainId) → CONNECTED (reload)
```

---

## 🧪 Tests

### Test de Détection

```typescript
// Vérifier si MetaMask est installé
if (typeof window.ethereum !== 'undefined') {
  console.log('✓ MetaMask détecté');
} else {
  console.log('✗ MetaMask non détecté');
}
```

### Test de Connexion

```typescript
// Vérifier si déjà connecté
const accounts = await window.ethereum.request({ 
  method: 'eth_accounts' 
});

if (accounts.length > 0) {
  console.log('✓ Déjà connecté:', accounts[0]);
} else {
  console.log('✗ Pas connecté');
}
```

### Test de Réseau

```typescript
const chainId = await window.ethereum.request({ 
  method: 'eth_chainId' 
});

const networkId = parseInt(chainId, 16);
console.log('Réseau actuel:', networkId);

// Vérifications
console.log('Mainnet?', networkId === 1);
console.log('Polygon?', networkId === 137);
console.log('Tesnet?', [5, 11155111].includes(networkId));
```

---

## 🚀 Optimisations

### 1. Memoization

```typescript
import { useMemo } from 'react';

const networkInfo = useMemo(() => {
  if (!networkId) return null;
  return SUPPORTED_NETWORKS[networkId as keyof typeof SUPPORTED_NETWORKS];
}, [networkId]);
```

### 2. Debouncing Balance Updates

```typescript
import { debounce } from 'lodash';

const debouncedRefreshBalance = useMemo(
  () => debounce(refreshBalance, 1000),
  []
);
```

### 3. Auto-Reconnect

```typescript
useEffect(() => {
  // Tenter reconnexion au chargement
  const tryReconnect = async () => {
    if (!window.ethereum) return;
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    
    if (accounts.length > 0) {
      // Déjà connecté, restaurer état
      connectWallet();
    }
  };
  
  tryReconnect();
}, []);
```

---

## 📊 Monitoring

### Logs de Debug

```typescript
const debugWalletState = () => {
  console.group('🔍 Wallet State');
  console.log('Connected:', walletConnected);
  console.log('Address:', walletAddress);
  console.log('Balance:', balance);
  console.log('Network ID:', networkId);
  console.log('Network Name:', networkName);
  console.log('Correct Network:', isCorrectNetwork);
  console.groupEnd();
};
```

### Tracking Events

```typescript
// Logger tous les events MetaMask
['accountsChanged', 'chainChanged', 'connect', 'disconnect'].forEach(event => {
  window.ethereum?.on(event, (...args) => {
    console.log(`📡 MetaMask Event: ${event}`, args);
  });
});
```

---

## 🎓 Best Practices

### ✅ À Faire

```typescript
// 1. Toujours vérifier window.ethereum
if (typeof window.ethereum !== 'undefined') { ... }

// 2. Gérer les erreurs
try { ... } catch (error) { ... }

// 3. Nettoyer les event listeners
useEffect(() => {
  return () => {
    window.ethereum?.removeListener(...);
  };
}, []);

// 4. Valider les réseaux
const network = SUPPORTED_NETWORKS[networkId];
if (network) { ... }

// 5. Convertir correctement wei → eth
const balanceEth = parseInt(balanceWei, 16) / 1e18;
```

### ❌ À Éviter

```typescript
// 1. Ne pas stocker la seed phrase
// ❌ const seedPhrase = '...';

// 2. Ne pas hard-coder les private keys
// ❌ const privateKey = '0x...';

// 3. Ne pas oublier de cleanup
// ❌ window.ethereum.on(...); // Sans removeListener

// 4. Ne pas ignorer les erreurs
// ❌ await request(...); // Sans try/catch

// 5. Ne pas assumer MetaMask installé
// ❌ window.ethereum.request(...); // Sans vérification
```

---

## 🔗 Ressources

### Documentation Officielle
- [MetaMask Docs](https://docs.metamask.io)
- [Ethereum JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)

### Tools
- [ChainList](https://chainlist.org) - Liste réseaux
- [Etherscan](https://etherscan.io) - Explorer Mainnet
- [Polygonscan](https://polygonscan.com) - Explorer Polygon

---

**Version** : 1.0.0  
**Dernière mise à jour** : 24 Décembre 2024  
**Auteur** : THESORIA Platform
