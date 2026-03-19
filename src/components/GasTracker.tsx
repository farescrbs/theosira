// ═══════════════════════════════════════════════════════════════════════════
// ⛽ GAS TRACKER ULTRA-LUXUEUX - THESORIA
// Suivi en temps réel des frais de gas avec prédictions
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Zap, TrendingDown, TrendingUp, Activity, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useWeb3 } from "../hooks/useWeb3";
import { toast } from "sonner@2.0.3";

interface GasPrice {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
}

interface GasStats {
  current: GasPrice;
  trend: 'up' | 'down' | 'stable';
  baseFee: number;
  priorityFee: number;
  blockNumber: number;
  networkCongestion: 'low' | 'medium' | 'high';
}

export default function GasTracker() {
  const { isConnected, currentChain } = useWeb3();
  
  const [gasStats, setGasStats] = useState<GasStats>({
    current: {
      slow: 0,
      standard: 0,
      fast: 0,
      instant: 0,
    },
    trend: 'stable',
    baseFee: 0,
    priorityFee: 0,
    blockNumber: 0,
    networkCongestion: 'low',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (isConnected) {
      loadGasStats();
      
      // Auto-refresh every 15 seconds
      const interval = setInterval(loadGasStats, 15000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const loadGasStats = async () => {
    setIsLoading(true);
    try {
      // Simuler les données de gas (en production, utiliser une API comme Etherscan)
      const baseFee = Math.random() * 50 + 20; // 20-70 Gwei
      const priorityFee = Math.random() * 3 + 1; // 1-4 Gwei
      
      const newStats: GasStats = {
        current: {
          slow: Math.floor(baseFee * 0.9),
          standard: Math.floor(baseFee),
          fast: Math.floor(baseFee * 1.2 + priorityFee),
          instant: Math.floor(baseFee * 1.5 + priorityFee * 2),
        },
        trend: Math.random() > 0.5 ? 'down' : Math.random() > 0.5 ? 'up' : 'stable',
        baseFee: Math.floor(baseFee),
        priorityFee: Math.floor(priorityFee),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        networkCongestion: baseFee < 40 ? 'low' : baseFee < 80 ? 'medium' : 'high',
      };
      
      setGasStats(newStats);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Erreur lors du chargement des gas stats:', error);
      toast.error('Erreur', {
        description: 'Impossible de charger les données de gas',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  const getCongestionColor = () => {
    switch (gasStats.networkCongestion) {
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
    }
  };

  const getTrendIcon = () => {
    switch (gasStats.trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent backdrop-blur-xl p-6"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#f0e68c] flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-white text-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              Gas Tracker
            </h3>
            <p className="text-white/60 text-xs flex items-center gap-2">
              {currentChain?.name}
              <span>•</span>
              {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getCongestionColor()}>
            {gasStats.networkCongestion === 'low' && '🟢 Faible'}
            {gasStats.networkCongestion === 'medium' && '🟡 Moyen'}
            {gasStats.networkCongestion === 'high' && '🔴 Élevé'}
          </Badge>
          
          <Button
            onClick={loadGasStats}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="hover:bg-white/[0.05]"
          >
            <RefreshCw className={`w-4 h-4 text-[#d4af37] ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Gas Prices Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Lent', value: gasStats.current.slow, time: '~5 min', color: 'text-green-400' },
          { label: 'Standard', value: gasStats.current.standard, time: '~3 min', color: 'text-blue-400' },
          { label: 'Rapide', value: gasStats.current.fast, time: '~1 min', color: 'text-orange-400' },
          { label: 'Instant', value: gasStats.current.instant, time: '~15 sec', color: 'text-red-400' },
        ].map((option) => (
          <motion.div
            key={option.label}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4 text-center cursor-pointer hover:border-[#d4af37]/30 transition-all"
          >
            <p className="text-white/60 text-xs mb-1">{option.label}</p>
            <p className={`text-2xl mb-1 ${option.color}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {option.value}
            </p>
            <p className="text-white/40 text-xs">Gwei • {option.time}</p>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-white/[0.02] border border-[#d4af37]/10 p-3">
          <div className="flex items-center gap-2 mb-1">
            {getTrendIcon()}
            <p className="text-white/60 text-xs">Tendance</p>
          </div>
          <p className="text-white text-sm font-semibold capitalize">
            {gasStats.trend === 'up' ? 'Hausse' : gasStats.trend === 'down' ? 'Baisse' : 'Stable'}
          </p>
        </div>

        <div className="rounded-lg bg-white/[0.02] border border-[#d4af37]/10 p-3">
          <p className="text-white/60 text-xs mb-1">Base Fee</p>
          <p className="text-white text-sm font-semibold">{gasStats.baseFee} Gwei</p>
        </div>

        <div className="rounded-lg bg-white/[0.02] border border-[#d4af37]/10 p-3">
          <p className="text-white/60 text-xs mb-1">Priority Fee</p>
          <p className="text-white text-sm font-semibold">{gasStats.priorityFee} Gwei</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
        <p className="text-blue-400 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          💡 <strong>Astuce:</strong> Utilisez les transactions "Lent" pendant les périodes de faible congestion pour économiser jusqu'à 70% sur les frais de gas.
        </p>
      </div>
    </motion.div>
  );
}
