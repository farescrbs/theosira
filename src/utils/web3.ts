import { ethers } from "ethers";

// Network configurations
export const NETWORKS = {
  ethereum: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://eth-mainnet.g.alchemy.com/v2/demo"],
    blockExplorerUrls: ["https://etherscan.io"]
  },
  sepolia: {
    chainId: "0xaa36a7",
    chainName: "Sepolia Testnet",
    nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/demo"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"]
  },
  polygon: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"]
  },
  arbitrum: {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"]
  }
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === "undefined") return false;
  return Boolean((window as any).ethereum?.isMetaMask);
};

// Connect to MetaMask
export const connectWallet = async (): Promise<{
  address: string;
  balance: string;
  chainId: number;
}> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé. Veuillez installer MetaMask pour continuer.");
  }

  try {
    const ethereum = (window as any).ethereum;
    
    // Request account access
    const accounts = await ethereum.request({ 
      method: "eth_requestAccounts" 
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("Aucun compte trouvé. Veuillez déverrouiller MetaMask.");
    }

    const address = accounts[0];
    
    // Get chain ID
    const chainId = await ethereum.request({ method: "eth_chainId" });
    
    // Get balance
    const provider = new ethers.BrowserProvider(ethereum);
    const balanceWei = await provider.getBalance(address);
    const balance = ethers.formatEther(balanceWei);

    return {
      address,
      balance,
      chainId: parseInt(chainId, 16)
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("Connexion refusée par l'utilisateur.");
    }
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = () => {
  // MetaMask doesn't have a disconnect method, we just clear local state
  console.log("Wallet disconnected (cleared from app state)");
};

// Switch network
export const switchNetwork = async (networkKey: keyof typeof NETWORKS) => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const network = NETWORKS[networkKey];

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.chainId }],
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [network],
        });
      } catch (addError) {
        throw new Error("Erreur lors de l'ajout du réseau.");
      }
    } else {
      throw error;
    }
  }
};

// Get current account
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null;

  try {
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({ method: "eth_accounts" });
    return accounts[0] || null;
  } catch (error: any) {
    // Code 4100 signifie que l'utilisateur n'a pas encore autorisé l'accès
    // C'est normal, ne pas logger comme erreur
    if (error.code === 4100) {
      return null;
    }
    console.error("Error getting current account:", error);
    return null;
  }
};

// Sign message for authentication
export const signMessage = async (message: string): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  
  const signature = await signer.signMessage(message);
  return signature;
};

// Verify signature (backend should do this)
export const verifySignature = (
  message: string,
  signature: string,
  expectedAddress: string
): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

// Get ETH balance
export const getBalance = async (address: string): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const balanceWei = await provider.getBalance(address);
  return ethers.formatEther(balanceWei);
};

// Get ERC-20 token balance
export const getTokenBalance = async (
  tokenAddress: string,
  userAddress: string
): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);

  // ERC-20 ABI (only balanceOf and decimals)
  const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];

  const contract = new ethers.Contract(tokenAddress, abi, provider);
  const balance = await contract.balanceOf(userAddress);
  const decimals = await contract.decimals();

  return ethers.formatUnits(balance, decimals);
};

// Send ETH transaction
export const sendTransaction = async (
  to: string,
  amountEth: string
): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  const tx = await signer.sendTransaction({
    to,
    value: ethers.parseEther(amountEth)
  });

  const receipt = await tx.wait();
  return receipt?.hash || tx.hash;
};

// Listen to account changes
export const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  if (!isMetaMaskInstalled()) return;
  
  const ethereum = (window as any).ethereum;
  ethereum.on("accountsChanged", callback);
  
  return () => ethereum.removeListener("accountsChanged", callback);
};

// Listen to chain changes
export const onChainChanged = (callback: (chainId: string) => void) => {
  if (!isMetaMaskInstalled()) return;
  
  const ethereum = (window as any).ethereum;
  ethereum.on("chainChanged", callback);
  
  return () => ethereum.removeListener("chainChanged", callback);
};

// Format address (0x1234...5678)
export const formatAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// Format number with commas
export const formatNumber = (num: number | string, decimals = 2): string => {
  const n = typeof num === "string" ? parseFloat(num) : num;
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Get gas price
export const getGasPrice = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const feeData = await provider.getFeeData();
  
  if (!feeData.gasPrice) return "0";
  
  // Convert to Gwei
  return ethers.formatUnits(feeData.gasPrice, "gwei");
};

// Estimate gas for transaction
export const estimateGas = async (
  to: string,
  data: string = "0x"
): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  const gasEstimate = await provider.estimateGas({
    from: await signer.getAddress(),
    to,
    data
  });

  return gasEstimate.toString();
};

// Get transaction receipt
export const getTransactionReceipt = async (txHash: string) => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  
  const receipt = await provider.getTransactionReceipt(txHash);
  return receipt;
};

// Wait for transaction confirmation
export const waitForTransaction = async (
  txHash: string,
  confirmations = 1
): Promise<any> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask n'est pas installé.");
  }

  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  
  const receipt = await provider.waitForTransaction(txHash, confirmations);
  return receipt;
};