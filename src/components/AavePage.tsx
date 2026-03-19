import React, { useState } from 'react';
import { AaveFlashLoanPanel, AavePoolsOverview, AaveStakingPanel } from './aave';
import { Zap, Droplet, Lock, BarChart3 } from 'lucide-react';

type AaveTab = 'flashloans' | 'pools' | 'staking' | 'analytics';

export default function AavePage() {
  const [activeTab, setActiveTab] = useState<AaveTab>('flashloans');

  const tabs = [
    { id: 'flashloans' as AaveTab, label: 'Flash Loans', icon: Zap, color: 'yellow' },
    { id: 'pools' as AaveTab, label: 'Liquidity Pools', icon: Droplet, color: 'blue' },
    { id: 'staking' as AaveTab, label: 'Staking', icon: Lock, color: 'purple' },
    { id: 'analytics' as AaveTab, label: 'Analytics', icon: BarChart3, color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="backdrop-blur-xl bg-black/40 border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-white mb-2">Aave Protocol Integration</h1>
              <p className="text-gray-400">
                Flash Loans, Staking & Liquidité institutionnelle
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-400">Protocole</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400">Aave V3 Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="backdrop-blur-xl bg-black/40 border border-yellow-500/20 rounded-2xl p-2">
          <div className="grid grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2
                    ${isActive 
                      ? `bg-gradient-to-r from-${tab.color}-400 to-${tab.color}-600 text-white shadow-lg` 
                      : 'bg-black/30 text-gray-400 hover:bg-black/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'flashloans' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AaveFlashLoanPanel />
            <div className="space-y-6">
              <AavePoolsOverview />
            </div>
          </div>
        )}

        {activeTab === 'pools' && (
          <AavePoolsOverview />
        )}

        {activeTab === 'staking' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AaveStakingPanel />
            
            {/* Stats additionnelles */}
            <div className="backdrop-blur-xl bg-black/40 border border-yellow-500/20 rounded-2xl p-6">
              <h3 className="text-xl text-white mb-4">Staking Performance</h3>
              
              <div className="space-y-4">
                <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Total Value Locked</p>
                  <p className="text-2xl text-white">$425.8M</p>
                  <p className="text-xs text-green-400 mt-1">+12.5% ce mois</p>
                </div>

                <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Average APY</p>
                  <p className="text-2xl text-purple-400">7.2%</p>
                </div>

                <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Your Lifetime Earnings</p>
                  <p className="text-2xl text-green-400">$1,245.67</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="backdrop-blur-xl bg-black/40 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-2xl text-white mb-6">Protocol Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/30 border border-green-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Total Supply</p>
                <p className="text-2xl text-white">$8.2B</p>
                <p className="text-xs text-green-400 mt-1">+5.2%</p>
              </div>

              <div className="bg-black/30 border border-red-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Total Borrow</p>
                <p className="text-2xl text-white">$4.1B</p>
                <p className="text-xs text-red-400 mt-1">+3.8%</p>
              </div>

              <div className="bg-black/30 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Flash Loans 24h</p>
                <p className="text-2xl text-white">2,847</p>
                <p className="text-xs text-blue-400 mt-1">+15.3%</p>
              </div>

              <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Unique Users</p>
                <p className="text-2xl text-white">125.4K</p>
                <p className="text-xs text-purple-400 mt-1">+8.7%</p>
              </div>
            </div>

            <div className="bg-black/30 border border-yellow-500/10 rounded-xl p-6">
              <h4 className="text-lg text-white mb-4">Top Markets by TVL</h4>
              
              <div className="space-y-3">
                {[
                  { asset: 'USDC', tvl: 1250000000, share: 15.2 },
                  { asset: 'WETH', tvl: 890000000, share: 10.8 },
                  { asset: 'DAI', tvl: 780000000, share: 9.5 },
                  { asset: 'USDT', tvl: 650000000, share: 7.9 },
                  { asset: 'WBTC', tvl: 520000000, share: 6.3 },
                ].map((market) => (
                  <div key={market.asset} className="flex items-center gap-3">
                    <div className="w-32">
                      <p className="text-white">{market.asset}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-black/50 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center px-3"
                          style={{ width: `${market.share * 5}%` }}
                        >
                          <span className="text-xs text-black">
                            ${(market.tvl / 1e9).toFixed(2)}B
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <p className="text-sm text-gray-400">{market.share}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
