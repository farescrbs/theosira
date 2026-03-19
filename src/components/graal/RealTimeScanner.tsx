import { motion, AnimatePresence } from 'motion/react';
import { Radar, TrendingUp, Zap, Clock, Link2 } from 'lucide-react';
import type { RealTimeOpportunity } from './types';

interface RealTimeScannerProps {
  opportunities: RealTimeOpportunity[];
}

export function RealTimeScanner({ opportunities }: RealTimeScannerProps) {
  const getStatusColor = (status: RealTimeOpportunity['status']) => {
    switch (status) {
      case 'scanning':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'simulating':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'executing':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30"
          >
            <Radar className="w-6 h-6 text-blue-500" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Real-Time MEV Scanner</h3>
            <p className="text-white/50 text-sm">{opportunities.length} opportunities detected</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span className="text-green-500 text-sm">Live</span>
        </div>
      </div>

      {/* Opportunities list */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {opportunities.map((opp) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-yellow-500/30 transition-all">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{opp.protocol}</span>
                      <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-white/70 text-xs">
                        {opp.chain}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span className="text-white/40">
                        {new Date(opp.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-lg border text-xs font-medium ${getStatusColor(opp.status)}`}>
                    {opp.status.toUpperCase()}
                  </div>
                </div>

                {/* Profit display */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-2xl font-bold text-green-500">
                        +{opp.profit_eth.toFixed(4)} ETH
                      </span>
                    </div>
                    <p className="text-white/40 text-sm ml-6">
                      ≈ ${opp.profit_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-bold ${getConfidenceColor(opp.confidence)}`}>
                      {opp.confidence.toFixed(1)}%
                    </div>
                    <p className="text-white/40 text-xs">Confidence</p>
                  </div>
                </div>

                {/* Route */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="w-3 h-3 text-white/40" />
                    <span className="text-white/60 text-xs">Route</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {opp.route.map((protocol, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500/90 text-xs">
                          {protocol}
                        </span>
                        {idx < opp.route.length - 1 && (
                          <span className="text-white/30 text-xs">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 border border-white/10 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">Complexity</span>
                      <span className="text-white font-mono text-sm">{opp.complexity}</span>
                    </div>
                  </div>
                  <div className="bg-black/20 border border-white/10 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">Gas Cost</span>
                      <span className="text-white font-mono text-sm">{opp.gas_cost.toFixed(4)} ETH</span>
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  initial={false}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {opportunities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-white/40">
            <Radar className="w-12 h-12 mb-3 opacity-30" />
            <p>Scanning for opportunities...</p>
          </div>
        )}
      </div>
    </div>
  );
}
