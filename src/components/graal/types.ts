// Types pour le système Graal

export interface RealTimeOpportunity {
  id: string;
  protocol: string;
  chain: string;
  profit_eth: number;
  profit_usd: number;
  confidence: number;
  complexity: number;
  gas_cost: number;
  timestamp: number;
  route: string[];
  status: 'scanning' | 'simulating' | 'executing' | 'completed' | 'failed';
}

export interface AIStats {
  total_profit_eth: number;
  total_profit_usd: number;
  trades_count: number;
  success_count: number;
  failed_count: number;
  win_rate: number;
  health_status: 'optimal' | 'good' | 'warning' | 'critical';
  uptime: number;
  avg_profit_per_trade: number;
}

export interface MasterAgentState {
  current_thought: string;
  quantum_vault_unlocked: boolean;
  autonomous_power: number; // 0-100
  target_wallet: string;
  scanning_protocols: string[];
  active_chains: string[];
  consciousness_level: number; // 0-100
}

export interface ExecutionEvent {
  id: string;
  type: 'success' | 'failure' | 'simulation' | 'analysis';
  message: string;
  value?: number;
  timestamp: number;
  details?: string;
  txHash?: string;
}

export interface VaultStatus {
  locked: boolean;
  balance_eth: number;
  balance_usd: number;
  security_level: number; // 0-100
  last_access: number;
  encryption_type: string;
}
