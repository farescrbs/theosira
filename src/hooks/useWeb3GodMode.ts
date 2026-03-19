/**
 * Hook Web3 spécifique pour le God Mode
 * Intégration blockchain réelle avec capacités avancées
 */

import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther, JsonRpcProvider } from 'ethers';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;

// ABI ERC-20 minimal
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// ABI ERC-3643 minimal
const ERC3643_ABI = [
  ...ERC20_ABI,
  "function isVerified(address) view returns (bool)",
  "function identityRegistry() view returns (address)",
  "function compliance() view returns (address)",
  "function pause() external",
  "function unpause() external",
  "function paused() view returns (bool)"
];

export interface Web3GodModeState {
  // Connexion
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  networkName: string;
  
  // Balances
  ethBalance: string;
  tokenBalances: Record<string, string>;
  
  // Provider & Signer
  provider: BrowserProvider | null;
  signer: any;
  
  // Status
  isLoading: boolean;
  error: string | null;
}

export interface ContractInfo {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  paused?: boolean;
  type: 'ERC20' | 'ERC3643' | 'Unknown';
}

export interface TransactionResult {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  status: 'pending' | 'success' | 'failed';
}

export function useWeb3GodMode() {
  const [state, setState] = useState<Web3GodModeState>({
    isConnected: false,
    address: null,
    chainId: null,
    networkName: 'Unknown',
    ethBalance: '0',
    tokenBalances: {},
    provider: null,
    signer: null,
    isLoading: false,
    error: null,
  });

  const [recentTransactions, setRecentTransactions] = useState<TransactionResult[]>([]);

  // ═══════════════════════════════════════════
  // CONNEXION WALLET
  // ═══════════════════════════════════════════

  const connectWallet = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Vérifier l'environnement
      if (typeof window === 'undefined') {
        throw new Error('Window non disponible');
      }

      console.log('🔍 Tentative de connexion MetaMask...');

      // Attendre que MetaMask soit prêt
      const getProvider = async () => {
        if ((window as any).ethereum) {
          return (window as any).ethereum;
        }

        // Attendre l'événement ethereum#initialized si MetaMask est en cours de chargement
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('MetaMask n\'est pas installé ou prend trop de temps à se charger. Veuillez installer MetaMask depuis metamask.io'));
          }, 3000);

          window.addEventListener('ethereum#initialized', () => {
            clearTimeout(timeout);
            resolve((window as any).ethereum);
          }, { once: true });

          // Si après 100ms toujours rien, considérer comme non installé
          setTimeout(() => {
            if ((window as any).ethereum) {
              clearTimeout(timeout);
              resolve((window as any).ethereum);
            }
          }, 100);
        });
      };

      const ethereum = await getProvider();
      
      if (!ethereum) {
        throw new Error('MetaMask n\'est pas installé. Veuillez installer MetaMask pour continuer.');
      }

      // Vérifier que c'est bien MetaMask
      if (!ethereum.isMetaMask) {
        console.warn('⚠️ Un wallet non-MetaMask est détecté');
      }

      console.log('✅ MetaMask détecté, initialisation...');

      // Méthode 1: Essayer d'abord avec les comptes existants
      let accounts: string[] = [];
      
      try {
        console.log('📋 Vérification comptes existants...');
        const existingAccounts = await ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (existingAccounts && Array.isArray(existingAccounts) && existingAccounts.length > 0) {
          accounts = existingAccounts;
          console.log('✅ Comptes existants trouvés:', accounts.length);
        }
      } catch (error) {
        console.log('ℹ️ Aucun compte pré-autorisé');
      }

      // Méthode 2: Si pas de compte, demander autorisation
      if (accounts.length === 0) {
        try {
          console.log('🔐 Demande d\'autorisation MetaMask...');
          
          const requestedAccounts = await ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (requestedAccounts && Array.isArray(requestedAccounts)) {
            accounts = requestedAccounts;
            console.log('✅ Autorisation accordée, comptes:', accounts.length);
          }
        } catch (error: any) {
          console.error('❌ Erreur demande autorisation:', error);
          
          // Gestion erreurs spécifiques MetaMask
          if (error.code === 4001) {
            throw new Error('Connexion refusée. Veuillez accepter la demande de connexion dans MetaMask.');
          } else if (error.code === -32002) {
            throw new Error('Une demande de connexion est déjà en attente. Veuillez vérifier MetaMask.');
          } else if (error.code === -32603) {
            throw new Error('Erreur interne MetaMask. Essayez de déverrouiller votre wallet.');
          }
          
          throw new Error('Impossible de se connecter à MetaMask: ' + (error.message || 'Erreur inconnue'));
        }
      }

      // Vérifier qu'on a bien des comptes
      if (!accounts || accounts.length === 0) {
        throw new Error('Aucun compte trouvé dans MetaMask. Veuillez créer ou importer un compte.');
      }

      console.log('🚀 Initialisation provider avec ethers.js...');

      // Créer le provider avec window.ethereum
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      console.log('📍 Adresse récupérée:', address);

      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      console.log('🌐 Réseau détecté:', chainId);

      // Récupérer le solde ETH
      const balance = await provider.getBalance(address);
      const ethBalance = formatEther(balance);

      console.log('💰 Balance:', ethBalance, 'ETH');

      // Nom du réseau
      const networkNames: Record<number, string> = {
        1: 'Ethereum Mainnet',
        137: 'Polygon',
        100: 'Gnosis Chain',
        11155111: 'Sepolia Testnet',
        5: 'Goerli',
        80001: 'Mumbai',
      };

      setState({
        isConnected: true,
        address,
        chainId,
        networkName: networkNames[chainId] || `Chain ${chainId}`,
        ethBalance,
        tokenBalances: {},
        provider,
        signer,
        isLoading: false,
        error: null,
      });

      console.log('✅ God Mode - Wallet connecté:', address);
      console.log('✅ God Mode - Réseau:', networkNames[chainId] || chainId);
      console.log('%c🔥 MODE PRODUCTION RÉEL ACTIVÉ 🔥', 'background: #ef4444; color: white; font-size: 16px; font-weight: bold; padding: 10px;');
      console.log('%c⚠️ ATTENTION : Toutes les transactions sont RÉELLES et IRRÉVERSIBLES', 'background: #f59e0b; color: black; font-size: 14px; padding: 5px;');
      console.log(`%cRéseau: ${networkNames[chainId] || chainId} | Balance: ${ethBalance} ETH`, 'color: #d4af37; font-size: 12px;');
      
      return true;
    } catch (error: any) {
      console.error('❌ Erreur connexion wallet:', error);
      
      let errorMessage = error.message || 'Erreur de connexion inconnue';
      
      // Messages d'erreur personnalisés supplémentaires
      if (errorMessage.includes('MetaMask n\'est pas installé')) {
        errorMessage = 'MetaMask n\'est pas installé. Installez l\'extension MetaMask depuis metamask.io';
      } else if (errorMessage.includes('User rejected')) {
        errorMessage = 'Connexion refusée. Veuillez accepter la demande dans MetaMask.';
      } else if (errorMessage.includes('Already processing')) {
        errorMessage = 'Demande en cours. Veuillez patienter ou vérifier MetaMask.';
      } else if (error.code === 4001) {
        errorMessage = 'Connexion refusée. Veuillez accepter la demande dans MetaMask.';
      } else if (error.code === -32002) {
        errorMessage = 'Demande en attente. Vérifiez MetaMask - une demande de connexion est déjà ouverte.';
      } else if (error.code === -32603) {
        errorMessage = 'Erreur MetaMask. Déverrouillez votre wallet et réessayez.';
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      throw new Error(errorMessage);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      networkName: 'Unknown',
      ethBalance: '0',
      tokenBalances: {},
      provider: null,
      signer: null,
      isLoading: false,
      error: null,
    });
    console.log('🔌 God Mode - Wallet déconnecté');
  }, []);

  // ═══════════════════════════════════════════
  // LECTURE CONTRAT
  // ═══════════════════════════════════════════

  const getContractInfo = useCallback(async (contractAddress: string): Promise<ContractInfo> => {
    if (!state.provider) {
      throw new Error('Provider non initialisé');
    }

    try {
      // Vérifier si le contrat existe
      const code = await state.provider.getCode(contractAddress);
      if (code === '0x' || code === '0x0') {
        throw new Error('Aucun contrat à cette adresse');
      }

      // Essayer ERC-3643 d'abord
      let contract = new Contract(contractAddress, ERC3643_ABI, state.provider);
      let type: 'ERC20' | 'ERC3643' | 'Unknown' = 'Unknown';

      try {
        const [name, symbol, decimals, totalSupply] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
          contract.totalSupply(),
        ]);

        // Tester si c'est un ERC-3643
        try {
          const paused = await contract.paused();
          type = 'ERC3643';

          return {
            address: contractAddress,
            name,
            symbol,
            decimals: Number(decimals),
            totalSupply: formatEther(totalSupply),
            paused,
            type,
          };
        } catch {
          // C'est juste un ERC-20
          type = 'ERC20';
          return {
            address: contractAddress,
            name,
            symbol,
            decimals: Number(decimals),
            totalSupply: formatEther(totalSupply),
            type,
          };
        }
      } catch (error) {
        throw new Error('Impossible de lire les informations du contrat');
      }
    } catch (error: any) {
      console.error('❌ Erreur lecture contrat:', error);
      throw error;
    }
  }, [state.provider]);

  const getTokenBalance = useCallback(async (tokenAddress: string, walletAddress?: string): Promise<string> => {
    if (!state.provider) {
      throw new Error('Provider non initialisé');
    }

    const address = walletAddress || state.address;
    if (!address) {
      throw new Error('Adresse wallet non disponible');
    }

    try {
      const contract = new Contract(tokenAddress, ERC20_ABI, state.provider);
      const [balance, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals(),
      ]);

      const formatted = formatEther(balance);
      return formatted;
    } catch (error: any) {
      console.error('❌ Erreur lecture balance token:', error);
      throw error;
    }
  }, [state.provider, state.address]);

  // ═══════════════════════════════════════════
  // TRANSACTIONS
  // ═══════════════════════════════════════════

  const sendETH = useCallback(async (to: string, amount: string): Promise<TransactionResult> => {
    if (!state.signer) {
      throw new Error('Signer non initialisé');
    }

    try {
      console.log('🔥 [REAL TX] Envoi ETH en cours...', { to, amount });
      
      // Validation de l'adresse
      if (!to || to.length !== 42 || !to.startsWith('0x')) {
        throw new Error('Adresse destinataire invalide');
      }

      // Validation du montant
      const amountFloat = parseFloat(amount);
      if (isNaN(amountFloat) || amountFloat <= 0) {
        throw new Error('Montant invalide');
      }

      // Vérifier le solde disponible
      const balance = await state.provider!.getBalance(state.address!);
      const amountWei = parseEther(amount);
      
      if (balance < amountWei) {
        throw new Error('Solde insuffisant pour cette transaction');
      }

      // Estimer le gas
      const gasEstimate = await state.provider!.estimateGas({
        to,
        value: amountWei,
      });

      console.log('⛽ Gas estimé:', gasEstimate.toString());

      // Envoyer la transaction RÉELLE
      const tx = await state.signer.sendTransaction({
        to,
        value: amountWei,
        gasLimit: gasEstimate * 12n / 10n, // +20% de marge
      });

      console.log('✅ [REAL TX] Transaction envoyée:', tx.hash);
      console.log('🔗 Etherscan:', `https://${state.chainId === 1 ? '' : state.networkName.toLowerCase().replace(' ', '') + '.'}etherscan.io/tx/${tx.hash}`);

      const txResult: TransactionResult = {
        hash: tx.hash,
        from: state.address!,
        to,
        value: amount,
        status: 'pending',
      };

      setRecentTransactions(prev => [txResult, ...prev.slice(0, 9)]);

      // Attendre confirmation (RÉELLE)
      console.log('⏳ Attente de confirmation...');
      const receipt = await tx.wait();
      console.log('✅ [REAL TX] Confirmée! Block:', receipt.blockNumber);

      const confirmedTx: TransactionResult = {
        ...txResult,
        status: receipt.status === 1 ? 'success' : 'failed',
        gasUsed: receipt.gasUsed.toString(),
      };

      setRecentTransactions(prev =>
        prev.map(t => t.hash === tx.hash ? confirmedTx : t)
      );

      // Rafraîchir le solde
      const newBalance = await state.provider!.getBalance(state.address!);
      setState(prev => ({
        ...prev,
        ethBalance: formatEther(newBalance),
      }));

      return confirmedTx;
    } catch (error: any) {
      console.error('❌ [REAL TX] Erreur envoi ETH:', error);
      
      // Messages d'erreur clairs
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction rejetée par l\'utilisateur');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Fonds insuffisants (incluant le gas)');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Erreur réseau - vérifiez votre connexion');
      }
      
      throw error;
    }
  }, [state.signer, state.address, state.provider, state.chainId, state.networkName]);

  const transferToken = useCallback(async (
    tokenAddress: string,
    to: string,
    amount: string
  ): Promise<TransactionResult> => {
    if (!state.signer) {
      throw new Error('Signer non initialisé');
    }

    try {
      const contract = new Contract(tokenAddress, ERC20_ABI, state.signer);
      const decimals = await contract.decimals();
      const amountBN = parseEther(amount); // Simplification

      const tx = await contract.transfer(to, amountBN);

      const txResult: TransactionResult = {
        hash: tx.hash,
        from: state.address!,
        to,
        value: amount,
        status: 'pending',
      };

      setRecentTransactions(prev => [txResult, ...prev.slice(0, 9)]);

      const receipt = await tx.wait();

      const confirmedTx: TransactionResult = {
        ...txResult,
        status: receipt.status === 1 ? 'success' : 'failed',
        gasUsed: receipt.gasUsed.toString(),
      };

      setRecentTransactions(prev =>
        prev.map(t => t.hash === tx.hash ? confirmedTx : t)
      );

      return confirmedTx;
    } catch (error: any) {
      console.error('❌ Erreur transfert token:', error);
      throw error;
    }
  }, [state.signer, state.address]);

  // ═══════════════════════════════════════════
  // ALCHEMY INTEGRATION
  // ═══════════════════════════════════════════

  const getAlchemyData = useCallback(async (endpoint: string, params: any = {}) => {
    try {
      const response = await fetch(`${SERVER_URL}/alchemy/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          network: state.networkName.toLowerCase().replace(' ', '-'),
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur Alchemy: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('❌ Erreur Alchemy:', error);
      throw error;
    }
  }, [state.networkName]);

  // ═══════════════════════════════════════════
  // LISTENERS
  // ═══════════════════════════════════════════

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== state.address) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      // Recharger la page pour éviter les états incohérents
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [state.address, connectWallet, disconnectWallet]);

  // Refresh balance périodique
  useEffect(() => {
    if (!state.isConnected || !state.provider || !state.address) return;

    const refreshBalance = async () => {
      try {
        const balance = await state.provider!.getBalance(state.address!);
        const ethBalance = formatEther(balance);
        setState(prev => ({ ...prev, ethBalance }));
      } catch (error) {
        console.error('Erreur refresh balance:', error);
      }
    };

    refreshBalance();
    const interval = setInterval(refreshBalance, 15000); // Toutes les 15 secondes

    return () => clearInterval(interval);
  }, [state.isConnected, state.provider, state.address]);

  return {
    // State
    ...state,
    recentTransactions,

    // Actions
    connectWallet,
    disconnectWallet,
    getContractInfo,
    getTokenBalance,
    sendETH,
    transferToken,
    getAlchemyData,
  };
}