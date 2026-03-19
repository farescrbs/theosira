/**
 * Portfolio Tracker - Suivi assets multi-chaînes
 */

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { PieChart, TrendingUp, TrendingDown, DollarSign, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Contract, formatUnits } from "ethers";
import { useCryptoPrices } from "../hooks/useCryptoPrices";

interface PortfolioTrackerProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  balanceUSD: number;
  price: number;
  change24h: number;
  logo?: string;
}

const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Common tokens with addresses and logos
const COMMON_TOKENS = [
  { 
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', 
    symbol: 'USDT', 
    name: 'Tether USD',
    decimals: 6,
    price: 1,
    change24h: 0.01,
  },
  { 
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 
    symbol: 'USDC', 
    name: 'USD Coin',
    decimals: 6,
    price: 1,
    change24h: -0.02,
  },
  { 
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', 
    symbol: 'DAI', 
    name: 'Dai Stablecoin',
    decimals: 18,
    price: 1,
    change24h: 0.00,
  },
  { 
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 
    symbol: 'WETH', 
    name: 'Wrapped Ether',
    decimals: 18,
    price: 2500,
    change24h: 3.45,
  },
];

export default function PortfolioTracker({ web3, fmtAddr, GCard, STitle }: PortfolioTrackerProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalValueUSD, setTotalValueUSD] = useState(0);
  const { prices } = useCryptoPrices();

  const loadPortfolio = async () => {
    if (!web3.address || !web3.provider) {
      toast.error("Connectez votre wallet");
      return;
    }

    setLoading(true);
    const portfolio: Asset[] = [];

    try {
      toast.loading("Chargement du portfolio...", { id: 'portfolio' });

      // Add ETH balance
      const ethBalance = parseFloat(web3.ethBalance);
      const ethPrice = prices?.ETH?.usd || 2500; // Live price or fallback
      const ethChange = prices?.ETH?.usd_24h_change || 0;
      
      if (ethBalance > 0.0001) {
        portfolio.push({
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance.toFixed(4),
          balanceUSD: ethBalance * ethPrice,
          price: ethPrice,
          change24h: ethChange,
        });
      }

      // Load token balances
      for (const token of COMMON_TOKENS) {
        try {
          const contract = new Contract(token.address, ERC20_ABI, web3.provider);
          const balance = await contract.balanceOf(web3.address);
          const balanceFormatted = parseFloat(formatUnits(balance, token.decimals));

          // Use live price if available, else fallback to token.price
          const tokenPrice = prices?.[token.symbol]?.usd || token.price;
          const tokenChange = prices?.[token.symbol]?.usd_24h_change || token.change24h;

          if (balanceFormatted > 0.01) {
            portfolio.push({
              symbol: token.symbol,
              name: token.name,
              balance: balanceFormatted.toFixed(2),
              balanceUSD: balanceFormatted * tokenPrice,
              price: tokenPrice,
              change24h: tokenChange,
            });
          }
        } catch (error) {
          console.log(`No balance for ${token.symbol}`);
        }
      }

      // Sort by USD value
      portfolio.sort((a, b) => b.balanceUSD - a.balanceUSD);

      setAssets(portfolio);
      
      const total = portfolio.reduce((sum, asset) => sum + asset.balanceUSD, 0);
      setTotalValueUSD(total);

      toast.success(`Portfolio chargé: ${portfolio.length} asset(s)`, { id: 'portfolio' });
    } catch (error: any) {
      console.error('❌ Erreur chargement portfolio:', error);
      toast.error("Erreur lors du chargement", { id: 'portfolio' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (web3.isConnected) {
      loadPortfolio();
    }
  }, [web3.isConnected, web3.address]);

  const getPercentage = (value: number) => {
    return totalValueUSD > 0 ? (value / totalValueUSD * 100).toFixed(1) : '0';
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <div className="flex items-center justify-between mb-4">
        <STitle icon={PieChart} title="PORTFOLIO TRACKER" />
        <button
          onClick={loadPortfolio}
          disabled={loading}
          className="px-3 py-1.5 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-[10px] inline-flex items-center gap-1 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {/* Total Value */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#d4af37]/20 to-purple-500/20 border border-[#d4af37]/30">
          <div className="text-[10px] text-white/40 mb-2 tracking-wider">
            VALEUR TOTALE PORTFOLIO
          </div>
          <div className="flex items-baseline gap-2">
            <DollarSign className="w-6 h-6 text-[#d4af37]" />
            <span className="text-3xl font-bold text-white">
              {totalValueUSD.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-sm text-white/50">USD</span>
          </div>
          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +2.34% (24h)
          </div>
        </div>

        {/* Assets List */}
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 mx-auto mb-3 text-white/30 animate-spin" />
            <p className="text-sm text-white/50">Chargement des assets...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-8">
            <PieChart className="w-12 h-12 mx-auto mb-3 text-white/20" />
            <p className="text-sm text-white/50">Aucun asset trouvé</p>
          </div>
        ) : (
          <div className="space-y-2">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Asset Info */}
                  <div className="flex items-center gap-3 flex-1">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-purple-500/20 border border-[#d4af37]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#d4af37]">
                        {asset.symbol.substring(0, 2)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">
                          {asset.symbol}
                        </span>
                        <span className="text-xs text-white/40">
                          {asset.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-white/60">
                          {asset.balance} {asset.symbol}
                        </span>
                        <span className="text-white/40">
                          @ ${asset.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Value & Change */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-white mb-1">
                      ${asset.balanceUSD.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      {asset.change24h >= 0 ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">
                            +{asset.change24h.toFixed(2)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-red-400" />
                          <span className="text-xs text-red-400">
                            {asset.change24h.toFixed(2)}%
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-[10px] text-white/30 mt-0.5">
                      {getPercentage(asset.balanceUSD)}% du portfolio
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 h-1 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(asset.balanceUSD)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {assets.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-black/20 border border-white/5 text-center">
              <div className="text-[10px] text-white/40 mb-1">ASSETS</div>
              <div className="text-lg font-bold text-white">{assets.length}</div>
            </div>
            <div className="p-3 rounded-lg bg-black/20 border border-white/5 text-center">
              <div className="text-[10px] text-white/40 mb-1">PLUS GROS</div>
              <div className="text-lg font-bold text-[#d4af37]">{assets[0]?.symbol}</div>
            </div>
            <div className="p-3 rounded-lg bg-black/20 border border-white/5 text-center">
              <div className="text-[10px] text-white/40 mb-1">RÉSEAU</div>
              <div className="text-lg font-bold text-white">{web3.networkName.split(' ')[0]}</div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
          <p className="text-[9px] text-blue-300 leading-relaxed">
            <strong>💡 Info:</strong> Les prix sont simulés. En production, intégrez une API
            comme CoinGecko ou CoinMarketCap pour les prix en temps réel.
          </p>
        </div>
      </div>
    </GCard>
  );
}
