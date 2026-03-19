# ⚡ QUICK REFERENCE - GOD MODE THESORIA

## 🚀 ACCÈS RAPIDE

```
URL: /god-mode
PIN: THESORIA2026
Onglet: Web3 🟢
```

---

## 📋 COMPOSANTS (13)

| Composant | Fichier | Fonction |
|-----------|---------|----------|
| **Warning Banner** | `RealTransactionWarning.tsx` | Alerte rouge transactions réelles |
| **Token Transfer** | `TokenTransferPanel.tsx` | Batch 5 tokens ERC-20 |
| **Gas Selector** | `GasPriceSelector.tsx` | 4 vitesses (Lent→Instant) |
| **Message Sign** | `MessageSignature.tsx` | Signature ECDSA, Proof of Ownership |
| **TX History** | `TransactionHistory.tsx` | Filtres + Export JSON/CSV |
| **NFT Transfer** | `NFTTransferPanel.tsx` | ERC-721 & ERC-1155 |
| **Swap DEX** | `SwapPanel.tsx` | Uniswap V3, 6 tokens |
| **Address Book** | `AddressBook.tsx` | Carnet contacts, 4 catégories |
| **TX Manager** | `TransactionManager.tsx` | Speedup/Cancel pending TX |
| **Contract Deploy** | `ContractDeployer.tsx` | Deploy smart contracts |
| **QR Scanner** | `QRScanner.tsx` | Scan adresses Ethereum |
| **Web3 Tab** | `GodModeWeb3Tab.tsx` | Composant principal |
| **Web3 Hook** | `useWeb3GodMode.ts` | Logic blockchain |

---

## 🎯 FONCTIONNALITÉS (16)

### Transactions
```typescript
✅ sendETH(to, amount)              // Envoi ETH réel
✅ transferToken(token, to, amount) // Transfer ERC-20
✅ transferNFT(contract, tokenId)   // Transfer NFT
✅ swapTokens(tokenIn, tokenOut)    // Swap Uniswap V3
✅ batchTransfer([...])             // Batch 5 tokens
```

### Inspection
```typescript
✅ getContractInfo(address)         // ERC-20/3643 inspector
✅ getNFTInfo(contract, tokenId)    // NFT metadata
✅ getTokenBalance(token, wallet)   // Balance token
```

### Management
```typescript
✅ speedupTransaction(hash)         // +20% gas
✅ cancelTransaction(hash)          // +50% gas, annule TX
✅ deployContract(bytecode, abi)    // Deploy contrat
```

### Utilities
```typescript
✅ signMessage(message)             // ECDSA signature
✅ scanQRCode()                     // Scanner QR
✅ saveContact(name, address)       // Carnet adresses
✅ exportHistory(format)            // Export JSON/CSV
✅ selectGasPrice(speed)            // Gas optimizer
✅ connectWallet()                  // MetaMask
```

---

## 🌐 RÉSEAUX (6)

```typescript
const NETWORKS = {
  mainnet: 1,           // Ethereum Mainnet
  sepolia: 11155111,    // Sepolia Testnet
  polygon: 137,         // Polygon
  gnosis: 100,          // Gnosis Chain
  goerli: 5,            // Goerli (deprecated)
  mumbai: 80001,        // Mumbai Testnet
};
```

---

## 🔑 STANDARDS SUPPORTÉS

```
✅ ERC-20    → Tokens fongibles
✅ ERC-721   → NFTs uniques
✅ ERC-1155  → Multi-tokens
✅ ERC-3643  → Security tokens
✅ Uniswap V3 → DEX swaps
```

---

## 💻 CODE EXAMPLES

### Envoi ETH
```typescript
const tx = await web3.sendETH(
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb6",
  "0.1"
);
// ✅ TX hash: 0xabc...
```

### Batch Tokens
```typescript
const transfers = [
  { token: "0xdac17...", to: "0x1234...", amount: "100" },
  { token: "0xa0b86...", to: "0x5678...", amount: "50" },
];
await batchTransfer(transfers);
// ✅ 2/2 transactions confirmées
```

### NFT Transfer
```typescript
const nft = await inspectNFT(
  "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", // BAYC
  "1234"
);
// { name: "BoredApeYachtClub", owner: "0x...", isOwner: true }

await transferNFT(
  "0xbc4ca...",
  "1234",
  "0x742d35Cc..." // recipient
);
// ✅ NFT transféré
```

### Swap Uniswap
```typescript
await swap({
  tokenIn: "WETH",
  tokenOut: "USDC",
  amountIn: "1",
  slippage: "0.5"
});
// ✅ 1 WETH → 2,500 USDC
```

### Contract Deploy
```typescript
const contract = await deployContract({
  bytecode: "0x608060...",
  abi: ["function get() view returns (uint256)"],
  args: []
});
// ✅ Deployed at: 0xabc...
```

### Message Signature
```typescript
const sig = await signMessage(
  "Je certifie être le propriétaire de cette adresse"
);
// {
//   message: "...",
//   signature: "0x3a5b7f9d2...",
//   signer: "0x742d35Cc..."
// }
```

### Transaction Manager
```typescript
// Speedup
await speedupTransaction("0xabc123...");
// ✅ Nouveau hash: 0xdef456... (+20% gas)

// Cancel
await cancelTransaction("0xabc123...");
// ✅ TX annulée (+50% gas)
```

---

## 🎨 UI COMPONENTS

### GCard (Card Premium)
```tsx
<GCard>
  <STitle icon={Wallet} title="TITRE" />
  {/* Contenu */}
</GCard>
```

### Real TX Warning
```tsx
<RealTransactionWarning network="Ethereum Mainnet" />
```

### QR Scanner
```tsx
<QRScanner 
  onScan={(address) => console.log(address)}
  GCard={GCard}
  STitle={STitle}
/>
```

---

## 🔐 VALIDATIONS

```typescript
// Format adresse
isValid = address.length === 42 && address.startsWith("0x")

// Solde suffisant
hasBalance = parseFloat(amount) <= parseFloat(balance)

// Gas estimation
gasEstimate = await provider.estimateGas({
  to,
  value: parseEther(amount)
})

// Double confirmation
const confirmed = window.confirm("⚠️ TRANSACTION RÉELLE...")
```

---

## 📊 STATE MANAGEMENT

### Web3 State
```typescript
interface Web3State {
  isConnected: boolean
  address: string | null
  chainId: number | null
  networkName: string
  ethBalance: string
  tokenBalances: Record<string, string>
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  isLoading: boolean
  error: string | null
  recentTransactions: TransactionResult[]
}
```

### Transaction Result
```typescript
interface TransactionResult {
  hash: string
  from: string
  to: string
  value: string
  status: 'pending' | 'success' | 'failed'
  gasUsed?: string
}
```

---

## 🚨 ERROR HANDLING

```typescript
try {
  await web3.sendETH(to, amount)
} catch (error: any) {
  if (error.code === 'ACTION_REJECTED') {
    toast.error("Transaction rejetée")
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    toast.error("Fonds insuffisants")
  } else if (error.code === 'NETWORK_ERROR') {
    toast.error("Erreur réseau")
  } else {
    toast.error(error.message)
  }
}
```

---

## 📝 LOGS

```typescript
console.log('🔥 [REAL TX] Envoi ETH en cours...')
console.log('⛽ Gas estimé:', gasEstimate)
console.log('✅ [REAL TX] Transaction envoyée:', tx.hash)
console.log('🔗 Etherscan:', `https://etherscan.io/tx/${tx.hash}`)
console.log('⏳ Attente de confirmation...')
console.log('✅ [REAL TX] Confirmée! Block:', receipt.blockNumber)
```

---

## 🎯 SHORTCUTS

| Action | Commande |
|--------|----------|
| Connecter wallet | `web3.connectWallet()` |
| Envoi rapide ETH | God Mode → Send Transaction |
| Batch tokens | God Mode → Token Transfer Panel |
| Swap rapide | God Mode → Swap Panel (Mainnet only) |
| Signer message | God Mode → Message Signature |
| Scanner QR | Cliquer "Scanner QR" dans Address Book |
| Speedup TX | God Mode → Transaction Manager |
| Deploy contract | God Mode → Contract Deployer |
| Export history | God Mode → Transaction History → CSV/JSON |

---

## 🔗 LIENS UTILES

```
Etherscan:        https://etherscan.io/
MetaMask:         https://metamask.io/
Uniswap:          https://app.uniswap.org/
OpenSea:          https://opensea.io/
Sepolia Faucet:   https://sepoliafaucet.com/
Mumbai Faucet:    https://faucet.polygon.technology/
Gas Tracker:      https://etherscan.io/gastracker
```

---

## 📦 DEPENDENCIES

```json
{
  "ethers": "^6.x",
  "motion": "latest",
  "sonner": "^2.0.3",
  "lucide-react": "latest"
}
```

---

## 🎨 DESIGN TOKENS

```css
--gold: #d4af37
--black: #020002
--glass-bg: rgba(255,255,255,0.02)
--glass-border: rgba(212,175,55,0.12)
--blur: blur(12px)

Fonts:
- Playfair Display (titres)
- Montserrat (body)
```

---

## 🚀 DEPLOYMENT

```bash
# Build
npm run build

# Test local
npm run dev

# Deploy
npm run deploy
```

---

## 📊 METRICS

```
Composants: 13
Fonctionnalités: 16
Lignes de code: ~4,500
Réseaux: 6
Standards: 5 (ERC-20/721/1155/3643, Uniswap V3)
```

---

## 🎉 DONE!

**THESORIA God Mode** est production-ready avec **toutes les fonctionnalités** blockchain avancées ! 🔥

- ✅ Transactions réelles
- ✅ Batch operations
- ✅ NFT transfer
- ✅ DEX swaps
- ✅ Contract deployment
- ✅ TX management
- ✅ Address book
- ✅ Et bien plus...

**Enjoy coding! 🚀**
