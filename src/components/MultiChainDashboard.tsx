// ═══════════════════════════════════════════════════════════════════════════
// 🌐 DASHBOARD MULTI-CHAIN ULTRA-LUXUEUX
// Vue d'ensemble de tous les réseaux blockchain supportés
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Globe, Zap, TrendingUp, Users, Lock, Gauge } from "lucide-react";
import { SUPPORTED_CHAINS, web3Service } from "../services/web3Service";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";

interface ChainMetrics {
  chainId: number;
  isActive: boolean;
  gasPrice?: string;
  blockNumber?: number;
  tps?: number;
  tvl?: string;
}

export default function MultiChainDashboard() {
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<ChainMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const chainId = web3Service.getCurrentChainId();
    setCurrentChainId(chainId);
    generateMockMetrics();

    web3Service.on('chainChanged', handleChainChanged);
    
    return () => {
      web3Service.off('chainChanged', handleChainChanged);
    };
  }, []);

  const handleChainChanged = (chainId: number) => {
    setCurrentChainId(chainId);
  };

  const generateMockMetrics = () => {
    const mockMetrics: ChainMetrics[] = Object.values(SUPPORTED_CHAINS).map(chain => ({
      chainId: chain.chainId,
      isActive: Math.random() > 0.1,
      gasPrice: `${(Math.random() * 100).toFixed(2)} Gwei`,
      blockNumber: Math.floor(Math.random() * 10000000) + 15000000,
      tps: Math.floor(Math.random() * 5000) + 100,
      tvl: `$${(Math.random() * 100 + 10).toFixed(2)}B`,
    }));
    setMetrics(mockMetrics);
  };

  const handleSwitchChain = async (chainId: number) => {
    setIsLoading(true);
    try {
      await web3Service.switchChain(chainId);
      toast.success('Réseau changé !', {
        description: `Connecté à ${SUPPORTED_CHAINS[chainId].name}`,
      });
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message || 'Impossible de changer de réseau',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent backdrop-blur-xl p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0e68c] flex items-center justify-center">
            <Globe className="w-7 h-7 text-black" />
          </div>
          <div>
            <h2 className="text-white text-3xl mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Écosystème Multi-Chain
            </h2>
            <p className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Connectez-vous à 8 blockchains de niveau institutionnel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4 text-center">
            <Zap className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
            <p className="text-white/60 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Réseaux Actifs
            </p>
            <p className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              8
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-white/60 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              TVL Total
            </p>
            <p className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              $847B
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-white/60 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Utilisateurs
            </p>
            <p className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              124M
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4 text-center">
            <Lock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white/60 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Sécurité
            </p>
            <p className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              AAA+
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grille des Blockchains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {Object.values(SUPPORTED_CHAINS).map((chain, index) => {
          const chainMetrics = metrics.find(m => m.chainId === chain.chainId);
          const isCurrentChain = currentChainId === chain.chainId;

          return (
            <motion.div
              key={chain.chainId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border backdrop-blur-xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                isCurrentChain
                  ? 'border-[#d4af37] bg-gradient-to-br from-[#d4af37]/20 via-[#d4af37]/10 to-transparent shadow-lg shadow-[#d4af37]/20'
                  : 'border-[#d4af37]/20 bg-white/[0.02] hover:border-[#d4af37]/40 hover:bg-white/[0.05]'
              }`}
              onClick={() => !isCurrentChain && handleSwitchChain(chain.chainId)}
            >
              {/* Effet de brillance au survol */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 70%)',
                }}
              />

              <div className="relative z-10">
                {/* En-tête */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl ${
                      isCurrentChain 
                        ? 'bg-gradient-to-br from-[#d4af37] to-[#f0e68c]' 
                        : 'bg-white/[0.05]'
                    }`}>
                      {chain.logo}
                    </div>
                    <div>
                      <h3 className="text-white text-lg mb-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                        {chain.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`text-xs ${
                            isCurrentChain
                              ? 'bg-[#d4af37]/30 text-[#d4af37] border-[#d4af37]/50'
                              : 'bg-white/[0.05] text-white/70 border-white/10'
                          }`}
                        >
                          {chain.symbol}
                        </Badge>
                        {isCurrentChain && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Connecté
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {chainMetrics?.isActive && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Actif
                      </span>
                    </div>
                  )}
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-white/[0.03] border border-[#d4af37]/10 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge className="w-3 h-3 text-[#d4af37]" />
                      <p className="text-white/50 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Gas Price
                      </p>
                    </div>
                    <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {chainMetrics?.gasPrice || 'N/A'}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/[0.03] border border-[#d4af37]/10 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-[#d4af37]" />
                      <p className="text-white/50 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        TPS
                      </p>
                    </div>
                    <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {chainMetrics?.tps?.toLocaleString() || 'N/A'}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/[0.03] border border-[#d4af37]/10 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-[#d4af37]" />
                      <p className="text-white/50 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        TVL
                      </p>
                    </div>
                    <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {chainMetrics?.tvl || 'N/A'}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/[0.03] border border-[#d4af37]/10 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-3 h-3 text-[#d4af37]" />
                      <p className="text-white/50 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Block
                      </p>
                    </div>
                    <p className="text-white text-sm font-semibold font-mono">
                      #{chainMetrics?.blockNumber?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Action */}
                {!isCurrentChain && web3Service.isConnected() && (
                  <Button
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#d4af37]/20 to-[#f0e68c]/20 border border-[#d4af37]/30 text-white hover:from-[#d4af37]/30 hover:to-[#f0e68c]/30"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {isLoading ? 'Changement...' : 'Se Connecter'}
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Note de sécurité */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3"
      >
        <Lock className="w-5 h-5 text-blue-400 mt-0.5" />
        <div>
          <p className="text-blue-400 text-sm mb-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
            Infrastructure Sécurisée de Niveau Bancaire
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Toutes les transactions sont cryptées end-to-end. Vos clés privées ne quittent jamais votre appareil. 
            Architecture conforme aux standards institutionnels et audits de sécurité réguliers.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
