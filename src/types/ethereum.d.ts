/**
 * TypeScript definitions for Ethereum Provider (MetaMask)
 */

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isTrust?: boolean;
    isRainbow?: boolean;
    isBraveWallet?: boolean;
    phantom?: any;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    removeAllListeners: (event: string) => void;
    selectedAddress: string | null;
    chainId: string;
    networkVersion: string;
  };
}
