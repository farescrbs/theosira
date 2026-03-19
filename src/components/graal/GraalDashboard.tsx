import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Cpu } from 'lucide-react';
import { MasterAgentThinking } from './MasterAgentThinking';
import { QuantumVaultStatus } from './QuantumVaultStatus';
import { RealTimeScanner } from './RealTimeScanner';
import { ProfitTracker } from './ProfitTracker';
import { ExecutionLog } from './ExecutionLog';
import { AIStatsPanel } from './AIStatsPanel';
import { EmergencyControls } from './EmergencyControls';
import { MockGraalWebSocket } from './MockWebSocket';
import type {
  RealTimeOpportunity,
  AIStats,
  ExecutionEvent,
  VaultStatus,
} from './types';

export function GraalDashboard() {
  const [opportunities, setOpportunities] = useState<RealTimeOpportunity[]>([]);
  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [currentThought, setCurrentThought] = useState('Initializing quantum intelligence matrix...');
  const [isPaused, setIsPaused] = useState(false);
  
  const [stats, setStats] = useState<AIStats>({
    total_profit_eth: 0,
    total_profit_usd: 0,
    trades_count: 0,
    success_count: 0,
    failed_count: 0,
    win_rate: 0,
    health_status: 'optimal',
    uptime: 0,
    avg_profit_per_trade: 0,
  });

  const [vaultStatus, setVaultStatus] = useState<VaultStatus>({
    locked: false,
    balance_eth: 12.4567,
    balance_usd: 43599.45,
    security_level: 98,
    last_access: Date.now() - 3600000,
    encryption_type: 'AES-256 + LUKS',
  });

  useEffect(() => {
    const ws = new MockGraalWebSocket();

    // Listen for opportunities
    ws.on('opportunity', (opp: RealTimeOpportunity) => {
      setOpportunities((prev) => [opp, ...prev].slice(0, 15));
    });

    // Listen for executions
    ws.on('execution', (event: ExecutionEvent) => {
      setEvents((prev) => [event, ...prev].slice(0, 20));
      
      // Show toast notification
      if (event.type === 'success') {
        // You can add a toast library here
        console.log('✅ Success:', event.message);
      }
    });

    // Listen for AI thoughts
    ws.on('thought', (data: { thought: string }) => {
      setCurrentThought(data.thought);
    });

    // Listen for stats updates
    ws.on('stats', (newStats: AIStats) => {
      setStats(newStats);
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  const handlePause = () => {
    setIsPaused(true);
    const event: ExecutionEvent = {
      id: `event_${Date.now()}`,
      type: 'analysis',
      message: 'System paused by user',
      timestamp: Date.now(),
      details: 'All autonomous trading operations halted',
    };
    setEvents((prev) => [event, ...prev]);
  };

  const handleResume = () => {
    setIsPaused(false);
    const event: ExecutionEvent = {
      id: `event_${Date.now()}`,
      type: 'analysis',
      message: 'System resumed',
      timestamp: Date.now(),
      details: 'Autonomous trading operations restarted',
    };
    setEvents((prev) => [event, ...prev]);
  };

  const handleEmergencyWithdraw = () => {
    const event: ExecutionEvent = {
      id: `event_${Date.now()}`,
      type: 'success',
      message: 'Emergency withdrawal executed',
      value: vaultStatus.balance_eth,
      timestamp: Date.now(),
      details: `All funds (${vaultStatus.balance_eth.toFixed(4)} ETH) transferred to owner wallet`,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };
    setEvents((prev) => [event, ...prev]);
    setVaultStatus((prev) => ({ ...prev, balance_eth: 0, balance_usd: 0 }));
  };

  const handleRestart = () => {
    const event: ExecutionEvent = {
      id: `event_${Date.now()}`,
      type: 'analysis',
      message: 'System restart initiated',
      timestamp: Date.now(),
      details: 'Reloading AI models and reconnecting to blockchain nodes',
    };
    setEvents((prev) => [event, ...prev]);
    
    setTimeout(() => {
      const event2: ExecutionEvent = {
        id: `event_${Date.now()}`,
        type: 'success',
        message: 'System restart complete',
        timestamp: Date.now(),
        details: 'All systems operational',
      };
      setEvents((prev) => [event2, ...prev]);
    }, 2000);
  };

  const handleToggleVault = () => {
    setVaultStatus((prev) => ({
      ...prev,
      locked: !prev.locked,
      last_access: Date.now(),
    }));
    
    const event: ExecutionEvent = {
      id: `event_${Date.now()}`,
      type: 'analysis',
      message: `Quantum vault ${vaultStatus.locked ? 'unlocked' : 'locked'}`,
      timestamp: Date.now(),
      details: vaultStatus.locked
        ? 'AI granted full access to vault resources'
        : 'Vault secured - AI access restricted',
    };
    setEvents((prev) => [event, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-500/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(234, 179, 8, 0.3)',
                    '0 0 40px rgba(234, 179, 8, 0.6)',
                    '0 0 20px rgba(234, 179, 8, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30"
              >
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                  GRAAL AI SYSTEM
                </h1>
                <p className="text-white/50 text-sm">Autonomous MEV & Flash Loan Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <span className="text-green-500 text-sm">System Active</span>
              </div>
              
              {isPaused && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-yellow-500 text-sm">Trading Paused</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Master Agent */}
            <MasterAgentThinking
              thought={currentThought}
              consciousnessLevel={92}
              autonomousPower={isPaused ? 0 : 87}
            />

            {/* Scanner */}
            <RealTimeScanner opportunities={opportunities} />

            {/* Execution Log */}
            <ExecutionLog events={events} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Vault Status */}
            <QuantumVaultStatus status={vaultStatus} onToggleLock={handleToggleVault} />

            {/* Profit Tracker */}
            <ProfitTracker stats={stats} />

            {/* AI Stats */}
            <AIStatsPanel stats={stats} />

            {/* Emergency Controls */}
            <EmergencyControls
              onPause={handlePause}
              onResume={handleResume}
              onEmergencyWithdraw={handleEmergencyWithdraw}
              onRestart={handleRestart}
              isPaused={isPaused}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
