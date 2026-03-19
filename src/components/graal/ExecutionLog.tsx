import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import type { ExecutionEvent } from './types';

interface ExecutionLogProps {
  events: ExecutionEvent[];
}

export function ExecutionLog({ events }: ExecutionLogProps) {
  const getEventIcon = (type: ExecutionEvent['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failure':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'simulation':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'analysis':
        return <FileText className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getEventColor = (type: ExecutionEvent['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      case 'failure':
        return 'border-red-500/20 bg-red-500/5';
      case 'simulation':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'analysis':
        return 'border-yellow-500/20 bg-yellow-500/5';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
            <FileText className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Execution Log</h3>
            <p className="text-white/50 text-sm">{events.length} events recorded</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-purple-500 rounded-full"
          />
          <span className="text-purple-500 text-sm">Recording</span>
        </div>
      </div>

      {/* Events list */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className={`border rounded-xl p-4 ${getEventColor(event.type)}`}
            >
              {/* Event header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{event.message}</p>
                    {event.details && (
                      <p className="text-white/60 text-sm">{event.details}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {event.value && (
                    <motion.span
                      initial={{ scale: 1.3, color: '#22c55e' }}
                      animate={{ scale: 1, color: event.type === 'success' ? '#22c55e' : '#ef4444' }}
                      transition={{ duration: 0.5 }}
                      className={`font-bold ${
                        event.type === 'success' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {event.type === 'success' ? '+' : '-'}
                      {event.value.toFixed(4)} ETH
                    </motion.span>
                  )}
                  <span className="text-white/40 text-xs">{formatTime(event.timestamp)}</span>
                </div>
              </div>

              {/* Transaction hash */}
              {event.txHash && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                  <span className="text-white/40 text-xs">TX:</span>
                  <code className="flex-1 text-white/60 text-xs font-mono">
                    {shortenHash(event.txHash)}
                  </code>
                  <button
                    onClick={() => window.open(`https://etherscan.io/tx/${event.txHash}`, '_blank')}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-white/60" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-white/40">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <p>No events yet...</p>
          </div>
        )}
      </div>

      {/* Summary footer */}
      {events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-white/40 text-xs mb-1">Total</p>
              <p className="text-white font-bold">{events.length}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Success</p>
              <p className="text-green-500 font-bold">
                {events.filter((e) => e.type === 'success').length}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Failed</p>
              <p className="text-red-500 font-bold">
                {events.filter((e) => e.type === 'failure').length}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Analysis</p>
              <p className="text-blue-500 font-bold">
                {events.filter((e) => e.type === 'analysis' || e.type === 'simulation').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
