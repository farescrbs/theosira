// ═══════════════════════════════════════════════════════════════════════════
// 🔄 INTERFACE DE SWAP DEX ULTRA-LUXUEUSE
// Échange de tokens avec design de niveau bancaire suisse
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowDownUp, Settings, Info, AlertCircle, Loader2, 
  Check, TrendingUp, Zap, Shield, ChevronDown 
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";
import { useWeb3 } from "../hooks/useWeb3";
import { dexService, type SwapQuote, type TokenInfo } from "../services/dexService";
import { toast } from "sonner@2.0.3";
import { formatBalance, getExplorerUrl } from "../services/web3Service";

// Tokens populaires par réseau
const POPULAR_TOKENS: Record<number, TokenInfo[]> = {
  1: [
    { address: 'native', symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether', decimals: 6 },
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', name: 'Dai', decimals: 18 },
  ],
  56: [
    { address: 'native', symbol: 'BNB', name: 'BNB', decimals: 18 },
    { address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', symbol: 'BUSD', name: 'Binance USD', decimals: 18 },
    { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', name: 'Tether', decimals: 18 },
  ],
  137: [
    { address: 'native', symbol: 'MATIC', name: 'Polygon', decimals: 18 },
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', name: 'Tether', decimals: 6 },
  ],
};

export default function DEXSwapInterface() {
  const { isConnected, chainId, currentChain } = useWeb3();
  
  const [tokenIn, setTokenIn] = useState<TokenInfo | null>(null);
  const [tokenOut, setTokenOut] = useState<TokenInfo | null>(null);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [slippage, setSlippage] = useState(0.5);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState<'in' | 'out' | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Initialiser les tokens par défaut
  useEffect(() => {
    if (chainId && POPULAR_TOKENS[chainId]) {
      const tokens = POPULAR_TOKENS[chainId];
      if (!tokenIn) setTokenIn(tokens[0]);
      if (!tokenOut) setTokenOut(tokens[1]);
    }
  }, [chainId]);

  // Charger un quote quand les paramètres changent
  useEffect(() => {
    if (tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0) {
      loadQuote();
    } else {
      setAmountOut('');
      setQuote(null);
    }
  }, [tokenIn, tokenOut, amountIn, slippage]);

  const loadQuote = async () => {
    if (!tokenIn || !tokenOut) return;
    
    setIsLoadingQuote(true);
    try {
      const quoteData = await dexService.getSwapQuote(
        tokenIn.address,
        tokenOut.address,
        amountIn,
        slippage
      );
      setQuote(quoteData);
      setAmountOut(quoteData.amountOut);
    } catch (error: any) {
      console.error('Erreur lors du chargement du quote:', error);
      toast.error('Erreur', {
        description: 'Impossible de calculer le prix',
      });
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleSwap = async () => {
    if (!isConnected) {
      toast.error('Wallet non connecté');
      return;
    }

    if (!tokenIn || !tokenOut || !quote) {
      toast.error('Paramètres invalides');
      return;
    }

    setIsSwapping(true);
    try {
      const result = await dexService.executeSwap(
        tokenIn.address,
        tokenOut.address,
        amountIn,
        quote.amountOutMin,
        slippage
      );

      setTxHash(result.hash);
      
      toast.success('Swap réussi ! 🎉', {
        description: `${amountIn} ${tokenIn.symbol} → ${amountOut} ${tokenOut.symbol}`,
        action: {
          label: 'Voir Transaction',
          onClick: () => window.open(getExplorerUrl(chainId!, result.hash, 'tx'), '_blank'),
        },
      });

      // Reset après succès
      setTimeout(() => {
        setAmountIn('');
        setAmountOut('');
        setQuote(null);
        setTxHash(null);
      }, 3000);

    } catch (error: any) {
      console.error('Erreur lors du swap:', error);
      toast.error('Erreur de Swap', {
        description: error.message || 'Transaction échouée',
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const handleFlipTokens = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
    setAmountIn(amountOut);
    setAmountOut(amountIn);
  };

  const handleSelectToken = (token: TokenInfo, type: 'in' | 'out') => {
    if (type === 'in') {
      setTokenIn(token);
    } else {
      setTokenOut(token);
    }
    setShowTokenSelector(null);
  };

  const dexConfig = dexService.getCurrentDEXConfig();

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-12 text-center"
      >
        <ArrowDownUp className="w-16 h-16 text-[#d4af37]/40 mx-auto mb-4" />
        <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
          Swap Non Disponible
        </h3>
        <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Connectez votre wallet pour échanger des tokens
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent backdrop-blur-xl p-8 relative overflow-hidden"
      >
        {/* Effet de brillance */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0e68c] flex items-center justify-center">
                <ArrowDownUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Swap Décentralisé
                </h2>
                <p className="text-white/60 text-sm flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {dexConfig && (
                    <>
                      <span className="text-lg">{dexConfig.logo}</span>
                      {dexConfig.name}
                    </>
                  )}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              size="sm"
              className="border-[#d4af37]/30 text-white hover:bg-white/[0.05]"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Token In */}
          <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white/60 text-sm">Vous vendez</Label>
              {tokenIn && (
                <span className="text-white/40 text-xs">
                  Solde: {tokenIn.balance ? formatBalance(tokenIn.balance, 6) : '0'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                step="0.000001"
                placeholder="0.0"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                className="flex-1 bg-transparent border-none text-white text-2xl p-0 h-auto focus-visible:ring-0"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              />
              <Button
                onClick={() => setShowTokenSelector('in')}
                variant="outline"
                className="border-[#d4af37]/30 bg-white/[0.03] hover:bg-white/[0.05] px-4"
              >
                {tokenIn ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tokenIn.symbol === 'ETH' ? '⟠' : tokenIn.symbol === 'BNB' ? '⬡' : '🪙'}</span>
                    <span className="text-white font-semibold">{tokenIn.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  </div>
                ) : (
                  <span className="text-white">Sélectionner</span>
                )}
              </Button>
            </div>
          </div>

          {/* Flip Button */}
          <div className="flex justify-center -my-3 relative z-10">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFlipTokens}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#f0e68c] border-4 border-black flex items-center justify-center shadow-lg"
            >
              <ArrowDownUp className="w-5 h-5 text-black" />
            </motion.button>
          </div>

          {/* Token Out */}
          <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white/60 text-sm">Vous recevez</Label>
              {tokenOut && (
                <span className="text-white/40 text-xs">
                  Solde: {tokenOut.balance ? formatBalance(tokenOut.balance, 6) : '0'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-white text-2xl" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                {isLoadingQuote ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  amountOut || '0.0'
                )}
              </div>
              <Button
                onClick={() => setShowTokenSelector('out')}
                variant="outline"
                className="border-[#d4af37]/30 bg-white/[0.03] hover:bg-white/[0.05] px-4"
              >
                {tokenOut ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tokenOut.symbol === 'ETH' ? '⟠' : tokenOut.symbol === 'BNB' ? '⬡' : '🪙'}</span>
                    <span className="text-white font-semibold">{tokenOut.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  </div>
                ) : (
                  <span className="text-white">Sélectionner</span>
                )}
              </Button>
            </div>
          </div>

          {/* Quote Details */}
          {quote && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[#d4af37]/10 bg-white/[0.02] p-4 mb-4 space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Prix</span>
                <span className="text-white">
                  1 {tokenIn?.symbol} ≈ {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)} {tokenOut?.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Slippage</span>
                <span className="text-white">{slippage}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Frais DEX</span>
                <span className="text-white">{quote.fee}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Price Impact</span>
                <span className={quote.priceImpact > 5 ? 'text-red-400' : 'text-green-400'}>
                  {quote.priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Gas estimé</span>
                <span className="text-white">{quote.gasEstimate} {currentChain?.symbol}</span>
              </div>
            </motion.div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={isSwapping || isLoadingQuote || !amountIn || !amountOut || parseFloat(amountIn) <= 0}
            className="w-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 disabled:opacity-50 h-14 text-lg"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
          >
            {isSwapping ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Swap en cours...
              </>
            ) : !tokenIn || !tokenOut ? (
              'Sélectionnez les tokens'
            ) : !amountIn || parseFloat(amountIn) <= 0 ? (
              'Entrez un montant'
            ) : (
              <>
                <ArrowDownUp className="mr-2 w-5 h-5" />
                Swap {tokenIn.symbol} → {tokenOut.symbol}
              </>
            )}
          </Button>

          {/* Security Badges */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-2 text-center">
              <Shield className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-green-400 text-xs">Sécurisé</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-2 text-center">
              <Zap className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-blue-400 text-xs">Rapide</p>
            </div>
            <div className="rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 p-2 text-center">
              <TrendingUp className="w-4 h-4 text-[#d4af37] mx-auto mb-1" />
              <p className="text-[#d4af37] text-xs">Meilleur Prix</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Token Selector Dialog */}
      <Dialog open={showTokenSelector !== null} onOpenChange={() => setShowTokenSelector(null)}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-md backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#d4af37]">
              Sélectionner un Token
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {chainId && POPULAR_TOKENS[chainId]?.map((token) => (
              <motion.button
                key={token.address}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectToken(token, showTokenSelector!)}
                className="w-full rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4 hover:border-[#d4af37]/40 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{token.symbol === 'ETH' ? '⟠' : token.symbol === 'BNB' ? '⬡' : '🪙'}</span>
                    <div>
                      <p className="text-white font-semibold">{token.symbol}</p>
                      <p className="text-white/50 text-sm">{token.name}</p>
                    </div>
                  </div>
                  {token.balance && (
                    <span className="text-white/70 text-sm">{formatBalance(token.balance, 4)}</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-md backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#d4af37]">
              Paramètres de Swap
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-white mb-2">Slippage Tolérance (%)</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[0.1, 0.5, 1, 3].map((value) => (
                  <Button
                    key={value}
                    onClick={() => setSlippage(value)}
                    variant="outline"
                    className={`${
                      slippage === value
                        ? 'bg-[#d4af37] text-black border-[#d4af37]'
                        : 'border-[#d4af37]/30 text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {value}%
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
