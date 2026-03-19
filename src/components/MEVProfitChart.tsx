import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Activity, BarChart3 } from "lucide-react";
import { Badge } from "./ui/badge";

interface ProfitDataPoint {
  timestamp: string;
  profit: number;
  trades: number;
  cumulative: number;
}

interface MEVProfitChartProps {
  totalProfit: number;
  totalTrades: number;
  winRate: number;
  recentTrades?: any[];
}

export function MEVProfitChart({ totalProfit, totalTrades, winRate, recentTrades = [] }: MEVProfitChartProps) {
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [profitData, setProfitData] = useState<ProfitDataPoint[]>([]);

  useEffect(() => {
    // Générer données de profit basées sur les trades récents
    generateProfitData();
  }, [recentTrades, totalProfit]);

  const generateProfitData = () => {
    const data: ProfitDataPoint[] = [];
    let cumulativeProfit = 0;
    
    // Si pas de trades réels, générer des données de démonstration
    if (recentTrades.length === 0) {
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 3600000).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const profit = Math.random() * 200 - 50;
        cumulativeProfit += profit;
        
        data.push({
          timestamp,
          profit: parseFloat(profit.toFixed(2)),
          trades: Math.floor(Math.random() * 5),
          cumulative: parseFloat(cumulativeProfit.toFixed(2))
        });
      }
    } else {
      // Utiliser les vrais trades
      recentTrades.slice(0, 24).reverse().forEach((trade, index) => {
        const profit = trade.profit || 0;
        cumulativeProfit += profit;
        
        data.push({
          timestamp: new Date(trade.timestamp || Date.now()).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          profit: parseFloat(profit.toFixed(2)),
          trades: 1,
          cumulative: parseFloat(cumulativeProfit.toFixed(2))
        });
      });
    }
    
    setProfitData(data);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded-xl bg-black/95 border border-[#d4af37]/30 backdrop-blur-xl">
          <p className="text-white/80 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {label}
          </p>
          <p className={`text-base ${payload[0].value >= 0 ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Profit: ${payload[0].value.toFixed(2)}
          </p>
          {payload[1] && (
            <p className="text-[#d4af37] text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Cumulé: ${payload[1].value.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20">
            <TrendingUp className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Performance MEV
            </h3>
            <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Historique 24H
            </p>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`p-3 rounded-xl transition-all ${
              chartType === 'area'
                ? 'bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <Activity className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-3 rounded-xl transition-all ${
              chartType === 'line'
                ? 'bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-3 rounded-xl transition-all ${
              chartType === 'bar'
                ? 'bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400/80 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Profit Total
            </span>
          </div>
          <p className="text-3xl text-green-400" style={{ fontFamily: 'Playfair Display, serif' }}>
            ${totalProfit.toFixed(2)}
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400/80 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Trades
            </span>
          </div>
          <p className="text-3xl text-blue-400" style={{ fontFamily: 'Playfair Display, serif' }}>
            {totalTrades}
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs text-[#d4af37]/80 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Win Rate
            </span>
          </div>
          <p className="text-3xl text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {winRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80" style={{ minHeight: 320 }}>
        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'area' ? (
            <AreaChart data={profitData}>
              <defs key="defs">
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop key="stop1" offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop key="stop2" offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop key="stop3" offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop key="stop4" offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                key="xaxis"
                dataKey="timestamp" 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px', fontFamily: 'Montserrat, sans-serif' }}
              />
              <YAxis 
                key="yaxis"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px', fontFamily: 'Montserrat, sans-serif' }}
              />
              <Tooltip key="tooltip" content={<CustomTooltip />} />
              <Area 
                key="area1"
                type="monotone" 
                dataKey="profit" 
                stroke="#d4af37" 
                strokeWidth={2}
                fill="url(#profitGradient)" 
              />
              <Area 
                key="area2"
                type="monotone" 
                dataKey="cumulative" 
                stroke="#22c55e" 
                strokeWidth={2}
                fill="url(#cumulativeGradient)" 
              />
            </AreaChart>
          ) : chartType === 'line' ? (
            <LineChart data={profitData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                key="xaxis"
                dataKey="timestamp" 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px', fontFamily: 'Montserrat, sans-serif' }}
              />
              <YAxis 
                key="yaxis"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px', fontFamily: 'Montserrat, sans-serif' }}
              />
              <Tooltip key="tooltip" content={<CustomTooltip />} />
              <Line 
                key="line1"
                type="monotone" 
                dataKey="profit" 
                stroke="#d4af37" 
                strokeWidth={3}
                dot={{ fill: '#d4af37', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                key="line2"
                type="monotone" 
                dataKey="cumulative" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={profitData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                key="xaxis"
                dataKey="timestamp" 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px', fontFamily: 'Montserrat, sans-serif' }}
              />
              <YAxis 
                key="yaxis"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px', fontFamily: 'Montserrat, sans-serif' }}
              />
              <Tooltip key="tooltip" content={<CustomTooltip />} />
              <Bar 
                key="bar1"
                dataKey="profit" 
                fill="#d4af37"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#d4af37]"></div>
          <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Profit par période
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Profit cumulé
          </span>
        </div>
      </div>
    </div>
  );
}