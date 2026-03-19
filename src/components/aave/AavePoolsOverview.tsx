import React, { useState, useEffect } from 'react';
import { Droplet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface AavePool {
  asset: string;
  totalLiquidity: number;
  availableLiquidity: number;
  utilization: number;
  supplyAPY: number;
  borrowAPY: number;
  logo: string;
}

export default function AavePoolsOverview() {
  const [pools, setPools] = useState<AavePool[]>([
    {
      asset: 'USDC',
      totalLiquidity: 1250000000,
      availableLiquidity: 980000000,
      utilization: 21.6,
      supplyAPY: 3.45,
      borrowAPY: 5.82,
      logo: '💵',
    },
    {
      asset: 'WETH',
      totalLiquidity: 450000000,
      availableLiquidity: 320000000,
      utilization: 28.9,
      supplyAPY: 2.15,
      borrowAPY: 4.32,
      logo: '⟠',
    },
    {
      asset: 'DAI',
      totalLiquidity: 890000000,
      availableLiquidity: 720000000,
      utilization: 19.1,
      supplyAPY: 3.82,
      borrowAPY: 6.15,
      logo: '◈',
    },
    {
      asset: 'WBTC',
      totalLiquidity: 320000000,
      availableLiquidity: 210000000,
      utilization: 34.4,
      supplyAPY: 1.95,
      borrowAPY: 3.87,
      logo: '₿',
    },
    {
      asset: 'USDT',
      totalLiquidity: 1100000000,
      availableLiquidity: 890000000,
      utilization: 19.1,
      supplyAPY: 3.65,
      borrowAPY: 5.95,
      logo: '₮',
    },
  ]);

  const [selectedPool, setSelectedPool] = useState<AavePool | null>(null);

  // Simulation de mise à jour des données
  useEffect(() => {
    const interval = setInterval(() => {
      setPools(prev => prev.map(pool => ({
        ...pool,
        supplyAPY: pool.supplyAPY + (Math.random() - 0.5) * 0.1,
        borrowAPY: pool.borrowAPY + (Math.random() - 0.5) * 0.1,
        utilization: Math.max(0, Math.min(100, pool.utilization + (Math.random() - 0.5) * 2)),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="backdrop-blur-xl bg-black/40 border border-yellow-500/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl text-white">Aave Liquidity Pools</h2>
            <p className="text-sm text-gray-400">Liquidité disponible pour Flash Loans</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-400">Total Liquidity</p>
          <p className="text-2xl text-white">
            {formatNumber(pools.reduce((acc, p) => acc + p.totalLiquidity, 0))}
          </p>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="space-y-3">
        {pools.map((pool) => (
          <div
            key={pool.asset}
            onClick={() => setSelectedPool(pool)}
            className="bg-black/30 border border-yellow-500/10 rounded-xl p-4 hover:border-yellow-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pool.logo}</span>
                <div>
                  <h3 className="text-lg text-white">{pool.asset}</h3>
                  <p className="text-xs text-gray-400">Aave V3</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-400">Available</p>
                <p className="text-lg text-green-400">{formatNumber(pool.availableLiquidity)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Utilization</span>
                <span>{pool.utilization.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    pool.utilization > 80
                      ? 'bg-red-500'
                      : pool.utilization > 50
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${pool.utilization}%` }}
                />
              </div>
            </div>

            {/* APY Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-500/10 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <p className="text-xs text-gray-400">Supply APY</p>
                </div>
                <p className="text-green-400">{pool.supplyAPY.toFixed(2)}%</p>
              </div>

              <div className="bg-red-500/10 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <p className="text-xs text-gray-400">Borrow APY</p>
                </div>
                <p className="text-red-400">{pool.borrowAPY.toFixed(2)}%</p>
              </div>
            </div>

            {/* Quick Action */}
            <button className="w-full mt-3 py-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:from-yellow-400/30 hover:to-yellow-600/30 transition-all text-sm flex items-center justify-center gap-2">
              Flash Loan {pool.asset}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Selected Pool Detail Modal */}
      {selectedPool && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPool(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl text-white">{selectedPool.asset} Pool</h3>
              <button
                onClick={() => setSelectedPool(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Total Liquidity</p>
                  <p className="text-white">{formatNumber(selectedPool.totalLiquidity)}</p>
                </div>
                <div className="bg-black/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Available</p>
                  <p className="text-green-400">{formatNumber(selectedPool.availableLiquidity)}</p>
                </div>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
                Execute Flash Loan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
