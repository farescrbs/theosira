import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Zap, Target } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import type { AIStats } from './types';

interface ProfitTrackerProps {
  stats: AIStats;
}

export function ProfitTracker({ stats }: ProfitTrackerProps) {
  const [chartData, setChartData] = useState<Array<{ id: string; time: string; profit: number }>>([]);

  useEffect(() => {
    // Simulation de données historiques
    const generateHistoricalData = () => {
      const data = [];
      let currentProfit = 0;
      for (let i = 30; i >= 0; i--) {
        currentProfit += Math.random() * 0.3;
        data.push({
          id: `hist-${i}-${Math.random().toString(36).substring(2, 9)}`,
          time: `${i}m`,
          profit: parseFloat(currentProfit.toFixed(4)),
        });
      }
      return data;
    };

    setChartData(generateHistoricalData());
  }, []);

  useEffect(() => {
    // Ajouter le dernier point de profit
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          id: `rt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          time: 'now',
          profit: stats.total_profit_eth,
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [stats.total_profit_eth]);

  const formatCurrency = (value: number) => {
    return `${value.toFixed(4)} ETH`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(34, 197, 94, 0.3)',
                '0 0 40px rgba(34, 197, 94, 0.6)',
                '0 0 20px rgba(34, 197, 94, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30"
          >
            <TrendingUp className="w-6 h-6 text-green-500" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Profit Tracker</h3>
            <p className="text-white/50 text-sm">Real-time performance metrics</p>
          </div>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-white/60 text-sm">Total Profit</span>
          </div>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={stats.total_profit_eth}
              initial={{ scale: 1.2, color: '#22c55e' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-white"
            >
              {stats.total_profit_eth.toFixed(4)}
            </motion.span>
            <span className="text-white/60">ETH</span>
          </div>
          <p className="text-green-500 text-sm mt-1">
            ≈ ${stats.total_profit_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="text-white/60 text-sm">Avg Profit/Trade</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {stats.avg_profit_per_trade.toFixed(4)}
            </span>
            <span className="text-white/60">ETH</span>
          </div>
          <p className="text-blue-500 text-sm mt-1">
            Across {stats.trades_count} trades
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="bg-black/20 border border-white/10 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs key="defs">
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop key="stop1" offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop key="stop2" offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                key="xaxis"
                dataKey="id"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => {
                  const item = chartData.find(d => d.id === value);
                  return item ? item.time : '';
                }}
              />
              <YAxis
                key="yaxis"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip
                key="tooltip"
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => [`${value.toFixed(4)} ETH`, 'Profit']}
              />
              <Area
                key="area"
                type="monotone"
                dataKey="profit"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#profitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/60 text-sm">Win Rate</span>
            <motion.span
              key={stats.win_rate}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-yellow-500 font-bold"
            >
              {stats.win_rate.toFixed(1)}%
            </motion.span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
              initial={{ width: 0 }}
              animate={{ width: `${stats.win_rate}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Success</span>
            <span className="text-purple-500 font-bold">
              {stats.success_count}/{stats.trades_count}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-white/40 mt-1">
            <span>Failed: {stats.failed_count}</span>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
        <span className="text-green-400 text-sm">
          System Status: {stats.health_status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
