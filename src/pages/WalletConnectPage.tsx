import { useState } from "react";
import { motion } from "motion/react";
import {
  Wallet, Shield, Zap, ChevronRight, Sparkles, Lock, Globe,
  Smartphone, Fingerprint, Laptop, Chrome, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router";

// Wallets supportés
const WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Le wallet Web3 le plus populaire",
    icon: "🦊",
    type: "browser",
    color: "#f6851b",
    recommended: true,
    available: typeof window !== 'undefined' && window.ethereum?.isMetaMask
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Wallet sécurisé de Coinbase",
    icon: "⚡",
    type: "mobile",
    color: "#0052ff",
    available: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Connectez n'importe quel wallet mobile",
    icon: "🔗",
    type: "qr",
    color: "#3b99fc",
    available: true
  },
  {
    id: "trust",
    name: "Trust Wallet",
    description: "Wallet mobile de Binance",
    icon: "🛡️",
    type: "mobile",
    color: "#3375bb",
    available: typeof window !== 'undefined' && window.ethereum?.isTrust
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "Hardware wallet sécurisé",
    icon: "🔐",
    type: "hardware",
    color: "#000000",
    available: true
  },
  {
    id: "trezor",
    name: "Trezor",
    description: "Hardware wallet premium",
    icon: "🔒",
    type: "hardware",
    color: "#01b757",
    available: true
  },
  {
    id: "rainbow",
    name: "Rainbow",
    description: "Wallet moderne et coloré",
    icon: "🌈",
    type: "mobile",
    color: "#ff54bb",
    available: typeof window !== 'undefined' && window.ethereum?.isRainbow
  },
  {
    id: "argent",
    name: "Argent",
    description: "Smart contract wallet",
    icon: "💎",
    type: "mobile",
    color: "#ff875b",
    available: true
  },
  {
    id: "phantom",
    name: "Phantom",
    description: "Wallet multi-chain",
    icon: "👻",
    type: "browser",
    color: "#ab9ff2",
    available: typeof window !== 'undefined' && window.phantom
  },
  {
    id: "brave",
    name: "Brave Wallet",
    description: "Wallet intégré Brave",
    icon: "🦁",
    type: "browser",
    color: "#fb542b",
    available: typeof window !== 'undefined' && window.ethereum?.isBraveWallet
  },
  {
    id: "safe",
    name: "Safe (Gnosis)",
    description: "Multi-signature wallet",
    icon: "🏦",
    type: "multisig",
    color: "#12ff80",
    available: true
  },
  {
    id: "frame",
    name: "Frame",
    description: "Desktop wallet sécurisé",
    icon: "🖼️",
    type: "desktop",
    color: "#1a1a1a",
    available: true
  }
];

const FEATURES = [
  { icon: Shield, text: "Sécurité militaire", color: "#d4af37" },
  { icon: Zap, text: "Connexion instantanée", color: "#22d3ee" },
  { icon: Lock, text: "Chiffrement end-to-end", color: "#a78bfa" },
  { icon: Globe, text: "Multi-chain support", color: "#4ade80" }
];

export default function WalletConnectPage() {
  const navigate = useNavigate();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleWalletConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setConnecting(true);

    const wallet = WALLETS.find(w => w.id === walletId);

    try {
      if (walletId === "metamask") {
        if (typeof window.ethereum === "undefined") {
          window.open("https://metamask.io/download/", "_blank");
          setConnecting(false);
          return;
        }

        // Demander connexion MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });

        if (accounts.length > 0) {
          // Rediriger vers la HomePage
          setTimeout(() => {
            navigate("/");
          }, 800);
        }
      } else if (walletId === "coinbase") {
        if (typeof window.ethereum?.isCoinbaseWallet === "undefined") {
          window.open("https://www.coinbase.com/wallet", "_blank");
          setConnecting(false);
          return;
        }
        
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });

        if (accounts.length > 0) {
          setTimeout(() => navigate("/"), 800);
        }
      } else if (walletId === "walletconnect") {
        // Simuler WalletConnect (nécessite @walletconnect/web3-provider en production)
        setTimeout(() => {
          alert("WalletConnect: Scannez le QR code avec votre wallet mobile (fonctionnalité à implémenter)");
          setConnecting(false);
        }, 1000);
      } else {
        // Autres wallets
        setTimeout(() => {
          alert(`${wallet?.name}: Installation/connexion à implémenter`);
          setConnecting(false);
        }, 1000);
      }
    } catch (error: any) {
      console.error("Erreur connexion wallet:", error);
      alert(error.message || "Erreur de connexion");
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020002] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#d4af37]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 pt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 mb-8">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <span className="text-[#d4af37] tracking-[0.3em] uppercase text-sm font-['Montserrat']">
              Connexion Sécurisée
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl mb-6 text-white font-['Playfair_Display']">
            Bienvenue sur <span className="text-[#d4af37]">THESORIA</span>
          </h1>

          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed font-['Montserrat'] mb-8">
            Tokenisation immobilière ultra-luxueuse sur Ethereum.<br />
            Sélectionnez votre wallet pour accéder à la plateforme.
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <feature.icon className="w-4 h-4" style={{ color: feature.color }} />
                <span className="text-sm text-white/80 font-['Montserrat']">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Wallets Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WALLETS.map((wallet, index) => {
              const isSelected = selectedWallet === wallet.id;
              const isConnecting = connecting && isSelected;

              return (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <button
                    onClick={() => handleWalletConnect(wallet.id)}
                    disabled={connecting}
                    className={`w-full p-6 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? "border-[#d4af37] bg-[#d4af37]/10 scale-105"
                        : "border-white/10 bg-white/5 hover:border-[#d4af37]/50 hover:bg-white/10 hover:scale-105"
                    } backdrop-blur-xl relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {/* Recommended Badge */}
                    {wallet.recommended && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black text-[10px] font-bold tracking-wider font-['Montserrat']">
                          RECOMMANDÉ
                        </span>
                      </div>
                    )}

                    {/* Availability Indicator */}
                    <div className="absolute top-3 left-3">
                      <div className={`w-2 h-2 rounded-full ${wallet.available ? "bg-green-400" : "bg-white/30"}`} />
                    </div>

                    {/* Icon */}
                    <div className="flex items-center justify-center mb-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                        style={{
                          background: `linear-gradient(135deg, ${wallet.color}20, transparent)`,
                          border: `1px solid ${wallet.color}30`
                        }}
                      >
                        {isConnecting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Zap className="w-8 h-8 text-[#d4af37]" />
                          </motion.div>
                        ) : (
                          wallet.icon
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-white mb-2 font-['Playfair_Display']">
                      {wallet.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-white/60 mb-4 font-['Montserrat']">
                      {wallet.description}
                    </p>

                    {/* Type Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40 uppercase tracking-wider font-['Montserrat']">
                        {wallet.type}
                      </span>
                      <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? "translate-x-1" : ""}`} style={{ color: wallet.color }} />
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/0 to-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="p-8 rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#d4af37]/5 to-transparent backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <Fingerprint className="w-6 h-6 text-[#d4af37] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2 font-['Playfair_Display']">
                  Première fois sur THESORIA ?
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-['Montserrat'] mb-4">
                  Un wallet Web3 est nécessaire pour accéder à la plateforme de tokenisation immobilière.
                  Nous recommandons <strong className="text-[#d4af37]">MetaMask</strong> pour sa simplicité et sa sécurité.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold text-sm hover:scale-105 transition-transform font-['Montserrat']"
                  >
                    <Chrome className="w-4 h-4" />
                    Installer MetaMask
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://metamask.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-white/5 transition-colors font-['Montserrat']"
                  >
                    En savoir plus
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16 text-white/40 text-sm font-['Montserrat']">
          <p>Propulsé par Ethereum • ERC-3643 Compliance • Sécurité Militaire</p>
        </div>
      </div>
    </div>
  );
}
