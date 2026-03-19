import { motion } from 'motion/react';
import { Lock, Unlock, Shield, Database, AlertTriangle } from 'lucide-react';
import type { VaultStatus } from './types';

interface QuantumVaultStatusProps {
  status: VaultStatus;
  onToggleLock?: () => void;
}

export function QuantumVaultStatus({ status, onToggleLock }: QuantumVaultStatusProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-6">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: status.locked
              ? [
                  'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                ]
              : [
                  'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
                ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              boxShadow: status.locked
                ? [
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                    '0 0 40px rgba(239, 68, 68, 0.6)',
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                  ]
                : [
                    '0 0 20px rgba(34, 197, 94, 0.3)',
                    '0 0 40px rgba(34, 197, 94, 0.6)',
                    '0 0 20px rgba(34, 197, 94, 0.3)',
                  ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`p-3 rounded-xl border ${
              status.locked
                ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30'
                : 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30'
            }`}
          >
            {status.locked ? (
              <Lock className="w-6 h-6 text-red-500" />
            ) : (
              <Unlock className="w-6 h-6 text-green-500" />
            )}
          </motion.div>

          <div>
            <h3 className="text-lg font-bold text-white">Quantum Vault</h3>
            <p className="text-white/50 text-sm">{status.encryption_type}</p>
          </div>
        </div>

        <button
          onClick={onToggleLock}
          className={`px-4 py-2 rounded-lg border transition-all ${
            status.locked
              ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20'
              : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
          }`}
        >
          {status.locked ? 'Unlock' : 'Lock'}
        </button>
      </div>

      {/* Status indicator */}
      <div className="relative z-10 mb-6">
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
            status.locked
              ? 'bg-red-500/5 border-red-500/20'
              : 'bg-green-500/5 border-green-500/20'
          }`}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${
              status.locked ? 'bg-red-500' : 'bg-green-500'
            }`}
          />
          <span className={status.locked ? 'text-red-400' : 'text-green-400'}>
            {status.locked ? 'Vault Secured - Access Restricted' : 'Vault Active - AI Authorized'}
          </span>
        </div>
      </div>

      {/* Balance */}
      <div className="relative z-10 mb-6">
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-yellow-500" />
            <span className="text-white/60 text-sm">Secured Balance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-yellow-500">
              {status.balance_eth.toFixed(4)}
            </span>
            <span className="text-white/60">ETH</span>
          </div>
          <p className="text-white/40 text-sm mt-1">
            ≈ ${status.balance_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Security metrics */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm">Security Level</span>
          </div>
          <span className="text-white font-mono">{status.security_level}%</span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
            initial={{ width: 0 }}
            animate={{ width: `${status.security_level}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Last Access</span>
          <span className="text-white/80">{formatDate(status.last_access)}</span>
        </div>

        {!status.locked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
          >
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500/90 text-sm">
              AI has full access to vault resources
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
