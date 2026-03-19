import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wallet, LogOut, ChevronDown, ExternalLink, Copy, Check, Zap, Shield, User } from "lucide-react";
import { Link } from "react-router";
import { useWeb3 } from "../contexts/Web3Context";
import { formatAddress, formatNumber, NETWORKS } from "../utils/web3";
import { toast } from "sonner@2.0.3";

const NETWORK_INFO: Record<number, { name: string; logo: string; symbol: string }> = {
  1: { name: "Ethereum", logo: "⟠", symbol: "ETH" },
  11155111: { name: "Sepolia", logo: "⟠", symbol: "ETH" },
  137: { name: "Polygon", logo: "⬣", symbol: "MATIC" },
  42161: { name: "Arbitrum", logo: "◆", symbol: "ETH" }
};

export default function Web3ConnectionButton() {
  const { isConnected, address, balance, chainId, isLoading, connect, disconnect, switchToNetwork } = useWeb3();
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const networkInfo = chainId ? NETWORK_INFO[chainId] : null;

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Adresse copiée", {
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenExplorer = () => {
    if (address && chainId) {
      const explorers: Record<number, string> = {
        1: "https://etherscan.io",
        11155111: "https://sepolia.etherscan.io",
        137: "https://polygonscan.com",
        42161: "https://arbiscan.io"
      };
      const explorerUrl = explorers[chainId];
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${address}`, "_blank");
      }
    }
  };

  if (!isConnected) {
    return (
      <motion.button
        onClick={connect}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative px-6 py-2.5 rounded-xl overflow-hidden font-semibold text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #d4af37 0%, #f0e68c 50%, #d4af37 100%)",
          backgroundSize: "200% auto",
          color: "#020202",
          fontFamily: "'Montserrat', sans-serif"
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          {isLoading ? "Connexion..." : "Connecter Wallet"}
        </div>
      </motion.button>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Network Badge */}
        {networkInfo && (
          <motion.button
            onClick={() => setShowNetworkDialog(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-all backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{networkInfo.logo}</span>
              <span className="text-white text-xs font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {networkInfo.symbol}
              </span>
            </div>
          </motion.button>
        )}

        {/* Wallet Button */}
        <motion.button
          onClick={() => setShowWalletDialog(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-[#f0e68c]/20 border border-[#d4af37]/40 hover:border-[#d4af37]/60 transition-all backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-[#d4af37] font-mono text-sm font-medium">
                  {formatAddress(address || "")}
                </span>
                <Shield className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-white/70 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {balance ? formatNumber(balance, 4) : "0.00"} {networkInfo?.symbol || "ETH"}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#d4af37]" />
          </div>
        </motion.button>
      </div>

      {/* Wallet Dialog */}
      <AnimatePresence>
        {showWalletDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWalletDialog(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#050505] border border-[#d4af37]/30 rounded-2xl p-6 max-w-md w-full backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-[#d4af37] flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <Wallet className="w-6 h-6" />
                  Mon Wallet
                </h2>
                <button
                  onClick={() => setShowWalletDialog(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/60 text-sm">Adresse</span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyAddress}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#d4af37]" />
                        )}
                      </button>
                      <button
                        onClick={handleOpenExplorer}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-[#d4af37]" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white font-mono text-sm break-all">{address}</p>
                </div>

                {/* Balance */}
                <div className="rounded-xl border border-[#d4af37]/20 bg-gradient-to-br from-[#d4af37]/10 to-transparent p-6 text-center">
                  <p className="text-white/60 text-sm mb-2">Solde Principal</p>
                  <p className="text-4xl text-[#d4af37] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {balance ? formatNumber(balance, 6) : "0.00"}
                  </p>
                  <p className="text-white/80 text-lg">{networkInfo?.symbol || "ETH"}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#d4af37]/10">
                  <button
                    onClick={() => {
                      setShowWalletDialog(false);
                      setShowNetworkDialog(true);
                    }}
                    className="flex-1 px-4 py-3 border border-[#d4af37]/30 text-white hover:bg-white/5 rounded-xl transition-all text-sm font-semibold uppercase tracking-wider"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Changer Réseau
                  </button>
                  <button
                    onClick={() => {
                      disconnect();
                      setShowWalletDialog(false);
                    }}
                    className="flex-1 px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/5 rounded-xl transition-all text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnecter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Dialog */}
      <AnimatePresence>
        {showNetworkDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNetworkDialog(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#050505] border border-[#d4af37]/30 rounded-2xl p-6 max-w-2xl w-full backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Sélectionner un Réseau
                </h2>
                <button
                  onClick={() => setShowNetworkDialog(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(NETWORKS) as [keyof typeof NETWORKS, any][]).map(([key, network]) => {
                  const networkChainId = parseInt(network.chainId, 16);
                  const info = NETWORK_INFO[networkChainId];
                  const isActive = chainId === networkChainId;

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        switchToNetwork(key);
                        setShowNetworkDialog(false);
                      }}
                      disabled={isActive || isLoading}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        isActive
                          ? "border-[#d4af37] bg-[#d4af37]/10"
                          : "border-[#d4af37]/20 bg-white/[0.02] hover:border-[#d4af37]/40"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{info?.logo || "🔗"}</span>
                        <div>
                          <p className="text-white font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {network.chainName}
                          </p>
                          <p className="text-white/60 text-sm">{network.nativeCurrency.symbol}</p>
                        </div>
                      </div>
                      {isActive && (
                        <div className="inline-block px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] text-xs font-semibold">
                          Connecté
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}