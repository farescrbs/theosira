/**
 * Composant pour aider l'utilisateur à changer de réseau dans MetaMask
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, CheckCircle2, AlertTriangle, X, Zap } from 'lucide-react';

interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

const NETWORKS: Record<string, NetworkConfig> = {
  gnosis: {
    chainId: '0x64', // 100 in hex
    chainName: 'Gnosis Chain',
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'XDAI',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.gnosischain.com'],
    blockExplorerUrls: ['https://gnosisscan.io'],
  },
  polygon: {
    chainId: '0x89', // 137 in hex
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};

export function NetworkSwitcher({ currentChainId }: { currentChainId?: number }) {
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const switchNetwork = async (networkKey: string) => {
    if (!window.ethereum) {
      setError('MetaMask n\'est pas installé');
      return;
    }

    setSwitching(true);
    setError(null);
    setSuccess(false);

    const network = NETWORKS[networkKey];

    try {
      // Essayer de changer de réseau
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (switchError: any) {
      // Si le réseau n'existe pas, l'ajouter
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });

          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } catch (addError: any) {
          setError(addError.message || 'Erreur lors de l\'ajout du réseau');
        }
      } else {
        setError(switchError.message || 'Erreur lors du changement de réseau');
      }
    } finally {
      setSwitching(false);
    }
  };

  // Vérifier le réseau actuel
  const isOnSupportedNetwork = currentChainId && [100, 137, 11155111].includes(currentChainId);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/30 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[#d4af37]/20">
          <Network className="w-5 h-5 text-[#d4af37]" />
        </div>
        <div>
          <h3 className="text-lg font-['Playfair_Display'] text-white">
            Sélection du Réseau
          </h3>
          {currentChainId && (
            <p className="text-xs text-gray-400">
              Actuellement connecté à: Chain ID {currentChainId}
            </p>
          )}
        </div>
      </div>

      {!isOnSupportedNetwork && currentChainId && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-200">
              <p className="font-bold mb-1">⚠️ Réseau non supporté</p>
              <p className="text-xs text-yellow-300/80">
                Veuillez basculer vers un réseau supporté ci-dessous
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(NETWORKS).map(([key, network]) => {
          const isActive = currentChainId === parseInt(network.chainId, 16);

          return (
            <button
              key={key}
              onClick={() => switchNetwork(key)}
              disabled={switching || isActive}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'bg-green-500/20 border-green-500/50'
                  : 'bg-white/5 border-white/10 hover:border-[#d4af37]/50 hover:bg-white/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-white">
                  {network.chainName}
                </div>
                {isActive && (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                )}
              </div>

              <div className="text-xs text-gray-400 text-left">
                {network.nativeCurrency.symbol}
              </div>

              {switching && (
                <div className="mt-2">
                  <Zap className="w-4 h-4 text-[#d4af37] animate-pulse mx-auto" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-200">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <p className="text-sm text-green-200">
                ✅ Réseau changé avec succès !
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/5">
        <p className="text-xs text-gray-400 mb-2">
          💡 <strong>Note:</strong> Le contrat FlashBot doit être déployé sur le réseau sélectionné.
        </p>
        <p className="text-xs text-gray-500">
          Consultez <code className="text-[#d4af37]">/contracts/DEPLOYMENT_GUIDE.md</code> pour les instructions de déploiement.
        </p>
      </div>
    </div>
  );
}
