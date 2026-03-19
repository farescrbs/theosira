// ═══════════════════════════════════════════════════════════════════════════
// 💼 PORTFOLIO EN TEMPS RÉEL - ULTRA LUXUEUX
// Affichage temps réel des actifs crypto, NFTs, et performances
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, TrendingDown, Wallet, Coins, Image as ImageIcon, 
  Activity, DollarSign, BarChart3, RefreshCw, Eye, EyeOff,
  Zap, Shield, Award, Send
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { web3Service, formatBalance, type TokenBalance } from "../services/web3Service";
import { toast } from "sonner@2.0.3";
import SendTransactionDialog from "./SendTransactionDialog";

interface PortfolioStats {
  totalValueUSD: number;
  totalValueChange24h: number;
  percentChange24h: number;
  nativeBalance: string;
  tokenCount: number;
  nftCount: number;
}

export default function RealTimePortfolio() {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<PortfolioStats>({
    totalValueUSD: 0,
    totalValueChange24h: 0,
    percentChange24h: 0,
    nativeBalance: '0',
    tokenCount: 0,
    nftCount: 0,
  });
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showSendDialog, setShowSendDialog] = useState(false);

  useEffect(() => {
    checkConnection();
    
    web3Service.on('connected', handleConnected);
    web3Service.on('disconnected', handleDisconnected);
    web3Service.on('accountChanged', handleAccountChanged);
    web3Service.on('chainChanged', handleChainChanged);
    
    return () => {
      web3Service.off('connected', handleConnected);
      web3Service.off('disconnected', handleDisconnected);
      web3Service.off('accountChanged', handleAccountChanged);
      web3Service.off('chainChanged', handleChainChanged);
    };
  }, []);

  const checkConnection = async () => {
    if (web3Service.isConnected()) {
      setIsConnected(true);
      await loadPortfolioData();
    }
  };

  const handleConnected = async () => {
    setIsConnected(true);
    await loadPortfolioData();
  };

  const handleDisconnected = () => {
    setIsConnected(false);
    resetPortfolio();
  };

  const handleAccountChanged = async () => {
    await loadPortfolioData();
  };

  const handleChainChanged = async () => {
    await loadPortfolioData();
  };

  const loadPortfolioData = async () => {
    setIsLoading(true);
    try {
      // Récupérer le solde natif
      const balance = await web3Service.getBalance();
      
      // Récupérer les tokens
      const tokenBalances = await web3Service.getAllTokenBalances();
      
      // Simuler des prix (en production, utilisez une API comme CoinGecko)
      const ethPriceUSD = 2000; // Prix fictif
      const totalNativeValueUSD = parseFloat(balance) * ethPriceUSD;
      
      // Calculer la valeur totale
      let totalTokenValueUSD = 0;
      const tokensWithValue = tokenBalances.map(token => {
        // Prix fictifs pour démo
        const priceUSD = token.symbol === 'USDT' || token.symbol === 'USDC' || token.symbol === 'DAI' || token.symbol === 'BUSD' 
          ? 1 
          : Math.random() * 100;
        const valueUSD = parseFloat(token.balance) * priceUSD;
        totalTokenValueUSD += valueUSD;
        return {
          ...token,
          valueUSD,
        };
      });
      
      const totalValueUSD = totalNativeValueUSD + totalTokenValueUSD;
      
      // Simuler le changement 24h
      const change24h = (Math.random() - 0.4) * totalValueUSD * 0.05; // -5% à +5%
      const percentChange = (change24h / totalValueUSD) * 100;
      
      setStats({
        totalValueUSD,
        totalValueChange24h: change24h,
        percentChange24h: percentChange,
        nativeBalance: balance,
        tokenCount: tokenBalances.length,
        nftCount: Math.floor(Math.random() * 15), // Simulé
      });
      
      setTokens(tokensWithValue);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Erreur lors du chargement du portfolio:', error);
      toast.error('Erreur', {
        description: 'Impossible de charger les données du portfolio',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPortfolio = () => {
    setStats({
      totalValueUSD: 0,
      totalValueChange24h: 0,
      percentChange24h: 0,
      nativeBalance: '0',
      tokenCount: 0,
      nftCount: 0,
    });
    setTokens([]);
  };

  const handleRefresh = async () => {
    await loadPortfolioData();
    toast.success('Données actualisées ! ✨');
  };

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8 text-center"
      >
        <Wallet className="w-16 h-16 text-[#d4af37]/40 mx-auto mb-4" />
        <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
          Portfolio Non Disponible
        </h3>
        <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Connectez votre wallet pour voir votre portfolio en temps réel
        </p>
      </motion.div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec Stats Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#f0e68c]/5 backdrop-blur-xl p-8 relative overflow-hidden"
      >
        {/* Effet de brillance animé */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0e68c] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Portfolio
                </h2>
                <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Mis à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsHidden(!isHidden)}
                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                {isHidden ? <Eye className="w-5 h-5 text-[#d4af37]" /> : <EyeOff className="w-5 h-5 text-[#d4af37]" />}
              </motion.button>
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="border-[#d4af37]/30 text-white hover:bg-white/[0.05]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>

          {/* Valeur Totale */}
          <div className="mb-6">
            <p className="text-white/70 text-sm mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Valeur Totale
            </p>
            <div className="flex items-baseline gap-4">
              <h1 
                className="text-[#d4af37] text-5xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {isHidden ? '****' : formatCurrency(stats.totalValueUSD)}
              </h1>
              <div className={`flex items-center gap-1 ${stats.percentChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.percentChange24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-xl" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                  {isHidden ? '**%' : `${stats.percentChange24h >= 0 ? '+' : ''}${stats.percentChange24h.toFixed(2)}%`}
                </span>
              </div>
            </div>
            <p className={`text-sm mt-1 ${stats.totalValueChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {isHidden ? '****' : `${stats.totalValueChange24h >= 0 ? '+' : ''}${formatCurrency(stats.totalValueChange24h)}`} (24h)
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-[#d4af37]" />
                <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Solde Natif
                </p>
              </div>
              <p className="text-white text-lg font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {isHidden ? '****' : formatBalance(stats.nativeBalance, 6)}
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-[#d4af37]" />
                <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Tokens
                </p>
              </div>
              <p className="text-white text-lg font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {stats.tokenCount}
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  NFTs
                </p>
              </div>
              <p className="text-white text-lg font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {stats.nftCount}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Liste des Tokens */}
      {tokens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              <Zap className="w-5 h-5 text-[#d4af37]" />
              Actifs
            </h3>
            <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
              {tokens.length} Tokens
            </Badge>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {tokens.map((token, index) => (
                <motion.div
                  key={token.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4 hover:border-[#d4af37]/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#f0e68c]/20 flex items-center justify-center group-hover:from-[#d4af37]/30 group-hover:to-[#f0e68c]/30 transition-all">
                        <span className="text-sm font-bold text-[#d4af37]">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {token.symbol}
                        </p>
                        <p className="text-white/50 text-xs">{token.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {isHidden ? '****' : formatBalance(token.balance, 4)}
                      </p>
                      {token.valueUSD !== undefined && (
                        <p className="text-white/60 text-sm">
                          {isHidden ? '****' : formatCurrency(token.valueUSD)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Badges de Sécurité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 p-4 text-center">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-400 text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
            Sécurisé
          </p>
        </div>
        
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-4 text-center">
          <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-blue-400 text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
            En Direct
          </p>
        </div>
        
        <div className="rounded-xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 p-4 text-center">
          <Award className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
          <p className="text-[#d4af37] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
            Premium
          </p>
        </div>
      </motion.div>
    </div>
  );
}