import { motion } from 'motion/react';
import { Activity, Clock, Target, TrendingUp } from 'lucide-react';
import type { AIStats } from './types';

interface AIStatsPanelProps {
  stats: AIStats;
}

export function AIStatsPanel({ stats }: AIStatsPanelProps) {
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getHealthColor = (status: AIStats['health_status']) => {
    switch (status) {
      case 'optimal':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'good':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'critical':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.3)',
                '0 0 40px rgba(168, 85, 247, 0.6)',
                '0 0 20px rgba(168, 85, 247, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30"
          >
            <Activity className="w-6 h-6 text-purple-500" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Performance</h3>
            <p className="text-white/50 text-sm">System health metrics</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-lg border ${getHealthColor(stats.health_status)}`}>
          <span className="text-sm font-medium uppercase">{stats.health_status}</span>
        </div>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-white/60 text-sm">Total Trades</span>
          </div>
          <motion.div
            key={stats.trades_count}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-white"
          >
            {stats.trades_count}
          </motion.div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-500 text-sm">✓ {stats.success_count}</span>
            <span className="text-white/30">|</span>
            <span className="text-red-500 text-sm">✗ {stats.failed_count}</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            <span className="text-white/60 text-sm">Win Rate</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {stats.win_rate.toFixed(1)}%
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
              initial={{ width: 0 }}
              animate={{ width: `${stats.win_rate}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Uptime */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            <span className="text-white/60 text-sm">Uptime</span>
          </div>
          <motion.div
            key={stats.uptime}
            className="font-mono text-2xl font-bold text-green-500"
          >
            {formatUptime(stats.uptime)}
          </motion.div>
        </div>
      </div>

      {/* Additional metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-lg">
          <span className="text-white/60 text-sm">Total Profit (ETH)</span>
          <span className="text-white font-bold font-mono">
            {stats.total_profit_eth.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-lg">
          <span className="text-white/60 text-sm">Total Profit (USD)</span>
          <span className="text-green-500 font-bold">
            ${stats.total_profit_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-lg">
          <span className="text-white/60 text-sm">Avg Profit/Trade</span>
          <span className="text-yellow-500 font-bold font-mono">
            {stats.avg_profit_per_trade.toFixed(4)} ETH
          </span>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">System Status</span>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span className="text-green-500">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
