import { useWeb3 } from "../contexts/Web3Context";
import { NETWORKS } from "../utils/web3";

/**
 * Composant de debug Web3 - À utiliser en développement seulement
 * Affiche l'état actuel de la connexion Web3
 */
export default function Web3Debug() {
  const { isConnected, address, balance, chainId, isLoading } = useWeb3();

  // Ne pas afficher en production
  if (import.meta.env.PROD) return null;

  const networkInfo = chainId 
    ? Object.entries(NETWORKS).find(
        ([_, network]) => parseInt(network.chainId, 16) === chainId
      )
    : null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 border border-[#d4af37]/50 rounded-lg p-4 text-xs font-mono z-50 max-w-xs backdrop-blur-xl">
      <div className="text-[#d4af37] font-bold mb-2 text-sm">🔍 Web3 Debug</div>
      
      <div className="space-y-1 text-white/70">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>

        {isLoading && (
          <div className="text-yellow-500">⏳ Loading...</div>
        )}

        {isConnected && (
          <>
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="text-white/50 text-[10px] uppercase mb-1">Address</div>
              <div className="text-[#d4af37] break-all">{address}</div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="text-white/50 text-[10px] uppercase mb-1">Balance</div>
              <div className="text-white">{balance} ETH</div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="text-white/50 text-[10px] uppercase mb-1">Network</div>
              <div className="text-white">
                {networkInfo?.[1]?.chainName || 'Unknown'} ({chainId})
              </div>
            </div>
          </>
        )}

        {!isConnected && (
          <div className="mt-2 pt-2 border-t border-white/10 text-gray-400">
            Click "Connecter Wallet" to connect
          </div>
        )}
      </div>
    </div>
  );
}
