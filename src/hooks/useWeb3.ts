// ═══════════════════════════════════════════════════════════════════════════
// 🎣 HOOK REACT PERSONNALISÉ POUR WEB3
// Simplifie l'utilisation du service Web3 dans les composants React
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { 
  web3Service, 
  SUPPORTED_CHAINS,
  type WalletConnection,
  type TokenBalance,
} from '../services/web3Service';

export interface UseWeb3Return {
  // État de connexion
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  chainId: number | null;
  chainName: string | null;
  balance: string | null;
  
  // Fonctions de connexion
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Gestion des réseaux
  switchChain: (chainId: number) => Promise<void>;
  currentChain: typeof SUPPORTED_CHAINS[number] | null;
  
  // Données du wallet
  tokens: TokenBalance[];
  refreshBalance: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  
  // Transactions
  sendTransaction: (to: string, amount: string) => Promise<string>;
  sendToken: (tokenAddress: string, to: string, amount: string, decimals?: number) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  
  // Erreurs
  error: Error | null;
}

export function useWeb3(): UseWeb3Return {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [chainName, setChainName] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Initialisation et listeners
  useEffect(() => {
    // Vérifier si déjà connecté
    checkConnection();

    // Écouter les événements
    web3Service.on('connected', handleConnected);
    web3Service.on('disconnected', handleDisconnected);
    web3Service.on('accountChanged', handleAccountChanged);
    web3Service.on('chainChanged', handleChainChanged);

    return () => {
      web3Service.off('connected', handleConnected);
      web3Service.off('disconnected', handleDisconnected);
      web3Service.off('accountChanged', handleAccountChanged);
      web3Service.off('chainChanged', handleChainChanged);
    };
  }, []);

  const checkConnection = async () => {
    if (web3Service.isConnected()) {
      const account = web3Service.getCurrentAccount();
      const chain = web3Service.getCurrentChainId();
      
      if (account && chain) {
        setIsConnected(true);
        setAddress(account);
        setChainId(chain);
        setChainName(SUPPORTED_CHAINS[chain]?.name || `Chain ${chain}`);
        
        try {
          const bal = await web3Service.getBalance();
          setBalance(bal);
          await loadTokens();
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }
    }
  };

  const handleConnected = (connection: WalletConnection) => {
    setIsConnected(true);
    setAddress(connection.address);
    setChainId(connection.chainId);
    setChainName(connection.chainName);
    setBalance(connection.balance);
    loadTokens();
  };

  const handleDisconnected = () => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
    setChainName(null);
    setBalance(null);
    setTokens([]);
    setError(null);
  };

  const handleAccountChanged = async (newAddress: string) => {
    setAddress(newAddress);
    await refreshBalance();
    await loadTokens();
  };

  const handleChainChanged = async (newChainId: number) => {
    setChainId(newChainId);
    setChainName(SUPPORTED_CHAINS[newChainId]?.name || `Chain ${newChainId}`);
    await refreshBalance();
    await loadTokens();
  };

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const connection = await web3Service.connect();
      setIsConnected(true);
      setAddress(connection.address);
      setChainId(connection.chainId);
      setChainName(connection.chainName);
      setBalance(connection.balance);
      await loadTokens();
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await web3Service.disconnect();
      handleDisconnected();
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }, []);

  const switchChain = useCallback(async (newChainId: number) => {
    setError(null);
    try {
      await web3Service.switchChain(newChainId);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      const bal = await web3Service.getBalance();
      setBalance(bal);
    } catch (err: any) {
      console.error('Error refreshing balance:', err);
      setError(err);
    }
  }, [isConnected]);

  const loadTokens = async () => {
    if (!web3Service.isConnected()) return;
    
    try {
      const tokenBalances = await web3Service.getAllTokenBalances();
      setTokens(tokenBalances);
    } catch (err: any) {
      console.error('Error loading tokens:', err);
    }
  };

  const refreshTokens = useCallback(async () => {
    await loadTokens();
  }, []);

  const sendTransaction = useCallback(async (to: string, amount: string) => {
    setError(null);
    try {
      return await web3Service.sendTransaction(to, amount);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }, []);

  const sendToken = useCallback(async (
    tokenAddress: string,
    to: string,
    amount: string,
    decimals: number = 18
  ) => {
    setError(null);
    try {
      return await web3Service.sendToken(tokenAddress, to, amount, decimals);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }, []);

  const signMessage = useCallback(async (message: string) => {
    setError(null);
    try {
      return await web3Service.signMessage(message);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  }, []);

  const currentChain = chainId ? SUPPORTED_CHAINS[chainId] : null;

  return {
    isConnected,
    isConnecting,
    address,
    chainId,
    chainName,
    balance,
    connect,
    disconnect,
    switchChain,
    currentChain,
    tokens,
    refreshBalance,
    refreshTokens,
    sendTransaction,
    sendToken,
    signMessage,
    error,
  };
}

// Hook simplifié pour vérifier uniquement si connecté
export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(web3Service.isConnected());
      setAddress(web3Service.getCurrentAccount());
    };

    checkConnection();

    web3Service.on('connected', () => {
      setIsConnected(true);
      setAddress(web3Service.getCurrentAccount());
    });

    web3Service.on('disconnected', () => {
      setIsConnected(false);
      setAddress(null);
    });

    web3Service.on('accountChanged', (newAddress: string) => {
      setAddress(newAddress);
    });

    return () => {
      web3Service.off('connected', checkConnection);
      web3Service.off('disconnected', checkConnection);
      web3Service.off('accountChanged', checkConnection);
    };
  }, []);

  return { isConnected, address };
}
