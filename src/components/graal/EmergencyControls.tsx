import { useState } from 'react';
import { motion } from 'motion/react';
import { Power, Pause, Play, AlertTriangle, Download, RotateCcw } from 'lucide-react';

interface EmergencyControlsProps {
  onPause?: () => void;
  onResume?: () => void;
  onEmergencyWithdraw?: () => void;
  onRestart?: () => void;
  isPaused?: boolean;
}

export function EmergencyControls({
  onPause,
  onResume,
  onEmergencyWithdraw,
  onRestart,
  isPaused = false,
}: EmergencyControlsProps) {
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const handleEmergencyWithdraw = () => {
    if (!showWithdrawConfirm) {
      setShowWithdrawConfirm(true);
      setTimeout(() => setShowWithdrawConfirm(false), 5000);
      return;
    }
    onEmergencyWithdraw?.();
    setShowWithdrawConfirm(false);
  };

  const handleRestart = () => {
    if (!showRestartConfirm) {
      setShowRestartConfirm(true);
      setTimeout(() => setShowRestartConfirm(false), 5000);
      return;
    }
    onRestart?.();
    setShowRestartConfirm(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-6">
      {/* Warning background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-yellow-500/20"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(239, 68, 68, 0.3)',
              '0 0 40px rgba(239, 68, 68, 0.6)',
              '0 0 20px rgba(239, 68, 68, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30"
        >
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-white">Emergency Controls</h3>
          <p className="text-white/50 text-sm">Critical system operations</p>
        </div>
      </div>

      {/* Control buttons */}
      <div className="relative z-10 space-y-3">
        {/* Pause/Resume */}
        <button
          onClick={isPaused ? onResume : onPause}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
            isPaused
              ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
              : 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
          }`}
        >
          <div className="flex items-center gap-3">
            {isPaused ? (
              <Play className="w-5 h-5 text-green-500" />
            ) : (
              <Pause className="w-5 h-5 text-yellow-500" />
            )}
            <div className="text-left">
              <p className={`font-semibold ${isPaused ? 'text-green-500' : 'text-yellow-500'}`}>
                {isPaused ? 'Resume Trading' : 'Pause Trading'}
              </p>
              <p className="text-white/60 text-sm">
                {isPaused ? 'Restart autonomous operations' : 'Stop all new trades'}
              </p>
            </div>
          </div>
          {isPaused && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
          )}
        </button>

        {/* Emergency Withdraw */}
        <button
          onClick={handleEmergencyWithdraw}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
            showWithdrawConfirm
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-red-500" />
            <div className="text-left">
              <p className="font-semibold text-red-500">
                {showWithdrawConfirm ? 'Click again to confirm!' : 'Emergency Withdraw'}
              </p>
              <p className="text-white/60 text-sm">
                {showWithdrawConfirm
                  ? 'This will withdraw all funds immediately'
                  : 'Extract all funds from smart contract'}
              </p>
            </div>
          </div>
          {showWithdrawConfirm && (
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
          )}
        </button>

        {/* Restart System */}
        <button
          onClick={handleRestart}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
            showRestartConfirm
              ? 'bg-orange-500/20 border-orange-500/50'
              : 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-orange-500" />
            <div className="text-left">
              <p className="font-semibold text-orange-500">
                {showRestartConfirm ? 'Click again to confirm!' : 'Restart System'}
              </p>
              <p className="text-white/60 text-sm">
                {showRestartConfirm
                  ? 'This will restart all AI processes'
                  : 'Reboot AI engine and reconnect'}
              </p>
            </div>
          </div>
          {showRestartConfirm && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RotateCcw className="w-4 h-4 text-orange-500" />
            </motion.div>
          )}
        </button>
      </div>

      {/* Warning notice */}
      <div className="relative z-10 mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-semibold mb-1">CRITICAL WARNING</p>
            <p className="text-white/60 text-sm">
              These controls should only be used in emergency situations. Improper use may result in
              loss of profit opportunities or contract security issues.
            </p>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="relative z-10 mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-white/40 mb-1">Auto Trade</p>
            <div className="flex items-center justify-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className={isPaused ? 'text-red-500' : 'text-green-500'}>
                {isPaused ? 'OFF' : 'ON'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-white/40 mb-1">Safety</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-500">ACTIVE</span>
            </div>
          </div>
          <div>
            <p className="text-white/40 mb-1">Connection</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-500">STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
