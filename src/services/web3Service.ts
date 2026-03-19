// ═══════════════════════════════════════════════════════════════════════════
// 🌐 THESORIA - SERVICE WEB3 RÉEL EN PRODUCTION
// Connexion wallet réelle avec MetaMask, WalletConnect, Coinbase, etc.
// ═══════════════════════════════════════════════════════════════════════════

import { ethers } from 'ethers';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface WalletConnection {
  address: string;
  chainId: number;
  chainName: string;
  balance: string;
  provider: 'metamask' | 'walletconnect' | 'coinbase' | 'trust' | 'phantom' | 'unknown';
  isConnected: boolean;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  address: string;
  logo?: string;
  valueUSD?: number;
}

export interface NFTAsset {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  contractAddress: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  type: 'send' | 'receive' | 'contract';
}

export interface ChainConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  logo: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATIONS DES RÉSEAUX BLOCKCHAIN
// ═══════════════════════════════════════════════════════════════════════════

export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  1: {
    chainId: 1,
    chainIdHex: '0x1',
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    logo: '⟠',
  },
  56: {
    chainId: 56,
    chainIdHex: '0x38',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    explorerUrl: 'https://bscscan.com',
    logo: '⬡',
  },
  137: {
    chainId: 137,
    chainIdHex: '0x89',
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    logo: '⬢',
  },
  42161: {
    chainId: 42161,
    chainIdHex: '0xa4b1',
    name: 'Arbitrum One',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    logo: '🔷',
  },
  10: {
    chainId: 10,
    chainIdHex: '0xa',
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    logo: '🔴',
  },
  43114: {
    chainId: 43114,
    chainIdHex: '0xa86a',
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    logo: '🔺',
  },
  250: {
    chainId: 250,
    chainIdHex: '0xfa',
    name: 'Fantom Opera',
    symbol: 'FTM',
    rpcUrl: 'https://rpc.ftm.tools',
    explorerUrl: 'https://ftmscan.com',
    logo: '👻',
  },
  8453: {
    chainId: 8453,
    chainIdHex: '0x2105',
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    logo: '🔵',
  },
};

// Contrats ERC20 populaires (exemples)
export const POPULAR_TOKENS: Record<number, TokenBalance[]> = {
  1: [ // Ethereum
    { symbol: 'USDT', name: 'Tether USD', balance: '0', decimals: 6, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    { symbol: 'USDC', name: 'USD Coin', balance: '0', decimals: 6, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
    { symbol: 'DAI', name: 'Dai Stablecoin', balance: '0', decimals: 18, address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
    { symbol: 'LINK', name: 'Chainlink', balance: '0', decimals: 18, address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
    { symbol: 'UNI', name: 'Uniswap', balance: '0', decimals: 18, address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
  ],
  56: [ // BSC
    { symbol: 'BUSD', name: 'Binance USD', balance: '0', decimals: 18, address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' },
    { symbol: 'USDT', name: 'Tether USD', balance: '0', decimals: 18, address: '0x55d398326f99059fF775485246999027B3197955' },
    { symbol: 'CAKE', name: 'PancakeSwap', balance: '0', decimals: 18, address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82' },
  ],
  137: [ // Polygon
    { symbol: 'USDC', name: 'USD Coin', balance: '0', decimals: 6, address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' },
    { symbol: 'USDT', name: 'Tether USD', balance: '0', decimals: 6, address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE WEB3 PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private currentAccount: string | null = null;
  private currentChainId: number | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  // ═══════════════════════════════════════════════════════════════════════════
  // DÉTECTION DES WALLETS DISPONIBLES
  // ═══════════════════════════════════════════════════════════════════════════

  detectAvailableWallets(): string[] {
    const wallets: string[] = [];
    
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.ethereum?.isMetaMask) wallets.push('metamask');
      // @ts-ignore
      if (window.ethereum?.isCoinbaseWallet) wallets.push('coinbase');
      // @ts-ignore
      if (window.ethereum?.isTrust) wallets.push('trust');
      // @ts-ignore
      if (window.phantom?.ethereum) wallets.push('phantom');
      // @ts-ignore
      if (window.ethereum && !window.ethereum.isMetaMask) wallets.push('unknown');
    }
    
    return wallets;
  }

  isWalletInstalled(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONNEXION AU WALLET
  // ═══════════════════════════════════════════════════════════════════════════

  async connect(): Promise<WalletConnection> {
    if (!this.isWalletInstalled()) {
      throw new Error('Aucun wallet détecté. Veuillez installer MetaMask ou un autre wallet compatible.');
    }

    try {
      // @ts-ignore
      const ethereum = window.ethereum;
      
      // Demander la connexion
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      this.currentAccount = accounts[0];
      
      // Créer le provider
      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = await this.provider.getSigner();
      
      // Obtenir le chainId
      const network = await this.provider.getNetwork();
      this.currentChainId = Number(network.chainId);
      
      // Obtenir le solde
      const balance = await this.provider.getBalance(this.currentAccount);
      const balanceFormatted = ethers.formatEther(balance);
      
      // Détecter le type de wallet
      let providerType: WalletConnection['provider'] = 'unknown';
      // @ts-ignore
      if (ethereum.isMetaMask) providerType = 'metamask';
      // @ts-ignore
      else if (ethereum.isCoinbaseWallet) providerType = 'coinbase';
      // @ts-ignore
      else if (ethereum.isTrust) providerType = 'trust';
      // @ts-ignore
      else if (window.phantom?.ethereum) providerType = 'phantom';
      
      // Configuration des listeners d'événements
      this.setupEventListeners();
      
      const connection: WalletConnection = {
        address: this.currentAccount,
        chainId: this.currentChainId,
        chainName: SUPPORTED_CHAINS[this.currentChainId]?.name || `Chain ${this.currentChainId}`,
        balance: balanceFormatted,
        provider: providerType,
        isConnected: true,
      };
      
      this.emit('connected', connection);
      return connection;
      
    } catch (error: any) {
      console.error('Erreur de connexion wallet:', error);
      throw new Error(error.message || 'Erreur lors de la connexion au wallet');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DÉCONNEXION
  // ═══════════════════════════════════════════════════════════════════════════

  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.currentAccount = null;
    this.currentChainId = null;
    this.emit('disconnected');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHANGEMENT DE RÉSEAU
  // ═══════════════════════════════════════════════════════════════════════════

  async switchChain(chainId: number): Promise<void> {
    if (!this.isWalletInstalled()) {
      throw new Error('Wallet non connecté');
    }

    const chain = SUPPORTED_CHAINS[chainId];
    if (!chain) {
      throw new Error('Réseau non supporté');
    }

    try {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.chainIdHex }],
      });
    } catch (error: any) {
      // Si le réseau n'existe pas, l'ajouter
      if (error.code === 4902) {
        await this.addChain(chainId);
      } else {
        throw error;
      }
    }
  }

  async addChain(chainId: number): Promise<void> {
    const chain = SUPPORTED_CHAINS[chainId];
    if (!chain) {
      throw new Error('Configuration du réseau non disponible');
    }

    // @ts-ignore
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: chain.chainIdHex,
        chainName: chain.name,
        nativeCurrency: {
          name: chain.symbol,
          symbol: chain.symbol,
          decimals: 18,
        },
        rpcUrls: [chain.rpcUrl],
        blockExplorerUrls: [chain.explorerUrl],
      }],
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RÉCUPÉRATION DU SOLDE
  // ═══════════════════════════════════════════════════════════════════════════

  async getBalance(address?: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider non initialisé');
    }

    const targetAddress = address || this.currentAccount;
    if (!targetAddress) {
      throw new Error('Adresse non disponible');
    }

    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RÉCUPÉRATION DES SOLDES DE TOKENS ERC20
  // ═══════════════════════════════════════════════════════════════════════════

  async getTokenBalance(tokenAddress: string, decimals: number = 18): Promise<string> {
    if (!this.provider || !this.currentAccount) {
      throw new Error('Wallet non connecté');
    }

    const erc20Abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function name() view returns (string)',
    ];

    const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);
    const balance = await contract.balanceOf(this.currentAccount);
    
    return ethers.formatUnits(balance, decimals);
  }

  async getAllTokenBalances(): Promise<TokenBalance[]> {
    if (!this.currentChainId) {
      return [];
    }

    const tokens = POPULAR_TOKENS[this.currentChainId] || [];
    const balances: TokenBalance[] = [];

    for (const token of tokens) {
      try {
        const balance = await this.getTokenBalance(token.address, token.decimals);
        if (parseFloat(balance) > 0) {
          balances.push({
            ...token,
            balance,
          });
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération du solde de ${token.symbol}:`, error);
      }
    }

    return balances;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ENVOI DE TRANSACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer non initialisé');
    }

    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    });

    await tx.wait();
    return tx.hash;
  }

  async sendToken(tokenAddress: string, to: string, amount: string, decimals: number = 18): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer non initialisé');
    }

    const erc20Abi = [
      'function transfer(address to, uint256 amount) returns (bool)',
    ];

    const contract = new ethers.Contract(tokenAddress, erc20Abi, this.signer);
    const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
    
    await tx.wait();
    return tx.hash;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNATURE DE MESSAGES
  // ═══════════════════════════════════════════════════════════════════════════

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer non initialisé');
    }

    return await this.signer.signMessage(message);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RÉCUPÉRATION DES TRANSACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async getTransactionHistory(limit: number = 10): Promise<Transaction[]> {
    // Note: Pour un historique complet, il faudrait utiliser une API externe comme Etherscan
    // Ici, c'est une implémentation simplifiée
    return [];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GESTION DES ÉVÉNEMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  private setupEventListeners(): void {
    if (typeof window === 'undefined' || !window.ethereum) return;

    // @ts-ignore
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.currentAccount = accounts[0];
        this.emit('accountChanged', accounts[0]);
      }
    });

    // @ts-ignore
    window.ethereum.on('chainChanged', (chainId: string) => {
      this.currentChainId = parseInt(chainId, 16);
      this.emit('chainChanged', this.currentChainId);
      // Recharger la page pour éviter les problèmes
      window.location.reload();
    });

    // @ts-ignore
    window.ethereum.on('disconnect', () => {
      this.disconnect();
    });
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════════════════════════

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }

  getCurrentAccount(): string | null {
    return this.currentAccount;
  }

  getCurrentChainId(): number | null {
    return this.currentChainId;
  }

  getCurrentChain(): ChainConfig | null {
    if (!this.currentChainId) return null;
    return SUPPORTED_CHAINS[this.currentChainId] || null;
  }

  isConnected(): boolean {
    return this.provider !== null && this.currentAccount !== null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DU SERVICE (SINGLETON)
// ═══════════════════════════════════════════════════════════════════════════

export const web3Service = new Web3Service();

// Export des fonctions utilitaires
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: string, decimals: number = 4): string => {
  const num = parseFloat(balance);
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  return num.toFixed(decimals);
};

export const getExplorerUrl = (chainId: number, address: string, type: 'address' | 'tx' = 'address'): string => {
  const chain = SUPPORTED_CHAINS[chainId];
  if (!chain) return '';
  return `${chain.explorerUrl}/${type}/${address}`;
};
