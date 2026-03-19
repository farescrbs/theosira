import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  connectWallet,
  disconnectWallet,
  getCurrentAccount,
  getBalance,
  onAccountsChanged,
  onChainChanged,
  isMetaMaskInstalled,
  switchNetwork,
  NETWORKS
} from "../utils/web3";
import { toast } from "sonner@2.0.3";

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToNetwork: (network: keyof typeof NETWORKS) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Listen to account changes
  useEffect(() => {
    const cleanup = onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        handleDisconnect();
        toast.error("Wallet déconnecté", {
          description: "Veuillez reconnecter votre wallet.",
          style: { background: "#3f0000", border: "1px solid #ff0000", color: "#ff8888" }
        });
      } else {
        setAddress(accounts[0]);
        refreshBalance(accounts[0]);
      }
    });

    return cleanup;
  }, []);

  // Listen to chain changes
  useEffect(() => {
    const cleanup = onChainChanged((newChainId) => {
      const chainIdNum = parseInt(newChainId, 16);
      setChainId(chainIdNum);
      
      const networkName = Object.entries(NETWORKS).find(
        ([_, network]) => parseInt(network.chainId, 16) === chainIdNum
      )?.[0] || "Unknown";
      
      toast.info(`Réseau changé vers ${networkName}`, {
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
      
      if (address) {
        refreshBalance(address);
      }
    });

    return cleanup;
  }, [address]);

  const checkConnection = async () => {
    try {
      const account = await getCurrentAccount();
      if (account) {
        const bal = await getBalance(account);
        setAddress(account);
        setBalance(bal);
        setIsConnected(true);
        
        // Get chain ID
        if (isMetaMaskInstalled()) {
          const ethereum = (window as any).ethereum;
          const chainIdHex = await ethereum.request({ method: "eth_chainId" });
          setChainId(parseInt(chainIdHex, 16));
        }
      }
    } catch (error: any) {
      // Silently fail - user just hasn't connected yet
      // Only log if it's not the expected "not authorized" error
      if (error?.code !== 4100) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const refreshBalance = async (addr: string) => {
    try {
      const bal = await getBalance(addr);
      setBalance(bal);
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  };

  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error("MetaMask non détecté", {
        description: "Veuillez installer MetaMask pour continuer.",
        style: { background: "#3f0000", border: "1px solid #ff0000", color: "#ff8888" }
      });
      
      // Open MetaMask download page
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsLoading(true);

    try {
      const { address: addr, balance: bal, chainId: chain } = await connectWallet();
      
      setAddress(addr);
      setBalance(bal);
      setChainId(chain);
      setIsConnected(true);

      const networkName = Object.entries(NETWORKS).find(
        ([_, network]) => parseInt(network.chainId, 16) === chain
      )?.[0] || "Unknown";

      toast.success("Wallet Connecté", {
        description: `${addr.slice(0, 6)}...${addr.slice(-4)} sur ${networkName}`,
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
    } catch (error: any) {
      console.error("Connection error:", error);
      toast.error("Erreur de connexion", {
        description: error.message || "Impossible de se connecter à MetaMask.",
        style: { background: "#3f0000", border: "1px solid #ff0000", color: "#ff8888" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setBalance(null);
    setChainId(null);
    setIsConnected(false);
    disconnectWallet();
  };

  const switchToNetwork = async (network: keyof typeof NETWORKS) => {
    setIsLoading(true);
    
    try {
      await switchNetwork(network);
      
      toast.success("Réseau changé", {
        description: `Connecté à ${NETWORKS[network].chainName}`,
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
    } catch (error: any) {
      console.error("Network switch error:", error);
      toast.error("Erreur de changement de réseau", {
        description: error.message || "Impossible de changer de réseau.",
        style: { background: "#3f0000", border: "1px solid #ff0000", color: "#ff8888" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: Web3ContextType = {
    isConnected,
    address,
    balance,
    chainId,
    isLoading,
    connect,
    disconnect: handleDisconnect,
    switchToNetwork
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};