/**
 * Types communs pour l'API THESORIA
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface FlashLoanRequest {
  fromToken: string;
  toToken: string;
  amount: string;
  chainId: number;
  strategy: 'dex' | 'liquidation' | 'triangular' | 'mev';
  slippageBps: number;
}

export interface FlashLoanResponse {
  orderId: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  estimatedProfit: string;
  flashLoanFee: string;
  gasEstimate: string;
}

export interface OpportunityRequest {
  chainId?: number;
  minProfitBps?: number;
  strategies?: string[];
}

export interface Opportunity {
  id: string;
  type: 'dex' | 'liquidation' | 'triangular' | 'mev';
  fromToken: string;
  toToken: string;
  fromDex: string;
  toDex: string;
  profitPercentage: number;
  estimatedProfit: number;
  flashLoanRequired: boolean;
  chainId: number;
  timestamp: number;
}

export interface BotStats {
  totalProfit: number;
  successRate: number;
  totalTrades: number;
  activeTrades: number;
  uptime: number;
  lastExecution: string;
}

export interface MetricsRequest {
  timeframe?: '1h' | '24h' | '7d' | '30d';
  chainId?: number;
}

export interface MetricsResponse {
  timeframe: string;
  totalVolume: string;
  totalProfit: string;
  totalTrades: number;
  successRate: number;
  averageGasUsed: string;
  topStrategies: {
    name: string;
    trades: number;
    profit: string;
  }[];
}
