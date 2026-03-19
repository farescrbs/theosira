import { useState } from "react";
import { Target, Zap, TrendingUp, ArrowLeftRight, Flame, Crown, Shield, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";

interface Strategy {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  minProfit: number;
  avgProfit: number;
  successRate: number;
  executionSpeed: 'INSTANT' | 'FAST' | 'NORMAL';
  color: string;
}

export function MEVStrategyManager() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: 'arbitrage',
      name: 'Arbitrage Multi-DEX',
      description: 'Exploite les différences de prix entre DEX (Uniswap, Sushiswap, Balancer)',
      icon: ArrowLeftRight,
      enabled: true,
      riskLevel: 'LOW',
      minProfit: 50,
      avgProfit: 150,
      successRate: 85,
      executionSpeed: 'FAST',
      color: 'green'
    },
    {
      id: 'sandwich',
      name: 'Sandwich Attack',
      description: 'Front-running et back-running des transactions volumineuses',
      icon: Target,
      enabled: true,
      riskLevel: 'HIGH',
      minProfit: 100,
      avgProfit: 300,
      successRate: 65,
      executionSpeed: 'INSTANT',
      color: 'red'
    },
    {
      id: 'liquidation',
      name: 'Liquidation Hunter',
      description: 'Liquidation de positions sous-collatéralisées sur Aave/Compound',
      icon: Flame,
      enabled: true,
      riskLevel: 'MEDIUM',
      minProfit: 200,
      avgProfit: 500,
      successRate: 75,
      executionSpeed: 'FAST',
      color: 'orange'
    },
    {
      id: 'jit',
      name: 'JIT Liquidity',
      description: 'Fourniture de liquidité juste-à-temps sur Uniswap V3',
      icon: Zap,
      enabled: false,
      riskLevel: 'MEDIUM',
      minProfit: 80,
      avgProfit: 180,
      successRate: 70,
      executionSpeed: 'INSTANT',
      color: 'yellow'
    },
    {
      id: 'backrun',
      name: 'Backrun Optimizer',
      description: 'Backrunning intelligent après transactions majeures',
      icon: TrendingUp,
      enabled: true,
      riskLevel: 'LOW',
      minProfit: 60,
      avgProfit: 120,
      successRate: 80,
      executionSpeed: 'FAST',
      color: 'blue'
    },
    {
      id: 'nft_snipe',
      name: 'NFT Floor Sniper',
      description: 'Détection et achat instantané de NFTs sous-évalués',
      icon: Crown,
      enabled: false,
      riskLevel: 'HIGH',
      minProfit: 500,
      avgProfit: 1200,
      successRate: 45,
      executionSpeed: 'INSTANT',
      color: 'purple'
    },
    {
      id: 'mev_share',
      name: 'MEV-Share Protection',
      description: 'Partage de MEV pour protection contre front-running',
      icon: Shield,
      enabled: true,
      riskLevel: 'LOW',
      minProfit: 40,
      avgProfit: 90,
      successRate: 90,
      executionSpeed: 'NORMAL',
      color: 'cyan'
    },
    {
      id: 'cross_chain',
      name: 'Cross-Chain Arbitrage',
      description: 'Arbitrage entre Ethereum, BSC, Polygon, Arbitrum',
      icon: Sparkles,
      enabled: false,
      riskLevel: 'MEDIUM',
      minProfit: 150,
      avgProfit: 350,
      successRate: 60,
      executionSpeed: 'NORMAL',
      color: 'indigo'
    }
  ]);

  const [minProfitFilter, setMinProfitFilter] = useState(50);

  const toggleStrategy = (id: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === id ? { ...strategy, enabled: !strategy.enabled } : strategy
    ));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'MEDIUM': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'HIGH': return 'border-red-500/30 bg-red-500/10 text-red-400';
      default: return 'border-white/30 bg-white/10 text-white';
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'INSTANT': return 'text-purple-400';
      case 'FAST': return 'text-blue-400';
      case 'NORMAL': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  const enabledCount = strategies.filter(s => s.enabled).length;

  return (
    <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20">
            <Target className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Gestionnaire de Stratégies
            </h3>
            <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {enabledCount}/{strategies.length} stratégies actives
            </p>
          </div>
        </div>

        <Badge className="px-6 py-2 text-base border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
          {enabledCount} Actives
        </Badge>
      </div>

      {/* Profit Filter */}
      <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Profit Minimum
          </span>
          <span className="text-[#d4af37] text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>
            ${minProfitFilter}
          </span>
        </div>
        <Slider
          value={[minProfitFilter]}
          onValueChange={(value) => setMinProfitFilter(value[0])}
          min={10}
          max={500}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-white/40" style={{ fontFamily: 'Montserrat, sans-serif' }}>$10</span>
          <span className="text-xs text-white/40" style={{ fontFamily: 'Montserrat, sans-serif' }}>$500</span>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 gap-4">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          
          return (
            <div
              key={strategy.id}
              className={`p-6 rounded-xl border transition-all ${
                strategy.enabled
                  ? 'border-[#d4af37]/30 bg-[#d4af37]/5'
                  : 'border-white/10 bg-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    strategy.enabled
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/30'
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${strategy.enabled ? 'text-[#d4af37]' : 'text-white/40'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {strategy.name}
                      </h4>
                      <Badge className={`text-xs ${getRiskColor(strategy.riskLevel)}`}>
                        {strategy.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {strategy.description}
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-white/40 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Min. Profit
                        </p>
                        <p className="text-base text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          ${strategy.minProfit}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/40 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Avg. Profit
                        </p>
                        <p className="text-base text-[#d4af37]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          ${strategy.avgProfit}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/40 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Success Rate
                        </p>
                        <p className="text-base text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {strategy.successRate}%
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/40 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Vitesse
                        </p>
                        <p className={`text-base ${getSpeedColor(strategy.executionSpeed)}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {strategy.executionSpeed}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Toggle Switch */}
                <Switch
                  checked={strategy.enabled}
                  onCheckedChange={() => toggleStrategy(strategy.id)}
                  className="ml-4"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl text-[#d4af37] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {enabledCount}
            </p>
            <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Stratégies Actives
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl text-green-400 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              ${strategies.filter(s => s.enabled).reduce((acc, s) => acc + s.avgProfit, 0)}
            </p>
            <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Profit Potentiel Total
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl text-blue-400 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {(strategies.filter(s => s.enabled).reduce((acc, s) => acc + s.successRate, 0) / enabledCount || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Success Rate Moyen
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl text-purple-400 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {strategies.filter(s => s.enabled && s.executionSpeed === 'INSTANT').length}
            </p>
            <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Stratégies Instantanées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
