// Simulation WebSocket pour le Dashboard Graal

import type { RealTimeOpportunity, AIStats, ExecutionEvent, MasterAgentState } from './types';

export class MockGraalWebSocket {
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private opportunityInterval: NodeJS.Timeout | null = null;
  private thoughtInterval: NodeJS.Timeout | null = null;

  private protocols = ['Uniswap V3', 'Curve', 'Balancer', 'SushiSwap', 'Aave', 'Compound', '1inch', 'dYdX'];
  private chains = ['ETH', 'BASE', 'ARB', 'OP', 'POLYGON', 'BSC'];
  private thoughts = [
    'Scanning Curve liquidity pools...',
    'Detecting arbitrage opportunity on Uniswap V3...',
    'Simulating flash loan execution...',
    'Analyzing gas optimization vectors...',
    'Monitoring mempool for MEV opportunities...',
    'Calculating optimal route through 7 protocols...',
    'Quantum vault synchronization in progress...',
    'Deep learning model updating predictions...',
    'Flashbots bundle simulation running...',
    'Cross-chain arbitrage window detected...',
    'Evaluating sandwich attack profitability...',
    'Smart order routing analysis active...',
  ];

  private stats: AIStats = {
    total_profit_eth: 0,
    total_profit_usd: 0,
    trades_count: 0,
    success_count: 0,
    failed_count: 0,
    win_rate: 0,
    health_status: 'optimal',
    uptime: 0,
    avg_profit_per_trade: 0,
  };

  constructor() {
    this.startSimulation();
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  private startSimulation() {
    // Nouvelles opportunités toutes les 2-5 secondes
    this.opportunityInterval = setInterval(() => {
      const opportunity = this.generateOpportunity();
      this.emit('opportunity', opportunity);

      // Simuler l'exécution après 3-8 secondes
      setTimeout(() => {
        if (Math.random() > 0.15) { // 85% de succès
          this.executeOpportunity(opportunity);
        } else {
          this.failOpportunity(opportunity);
        }
      }, 3000 + Math.random() * 5000);
    }, 2000 + Math.random() * 3000);

    // Nouvelles pensées de l'IA toutes les 4-7 secondes
    this.thoughtInterval = setInterval(() => {
      const thought = this.thoughts[Math.floor(Math.random() * this.thoughts.length)];
      this.emit('thought', { thought });
    }, 4000 + Math.random() * 3000);

    // Mise à jour des stats toutes les secondes
    this.intervalId = setInterval(() => {
      this.stats.uptime += 1;
      this.emit('stats', this.stats);
    }, 1000);
  }

  private generateOpportunity(): RealTimeOpportunity {
    const protocol = this.protocols[Math.floor(Math.random() * this.protocols.length)];
    const chain = this.chains[Math.floor(Math.random() * this.chains.length)];
    const profit_eth = 0.1 + Math.random() * 2.5;
    const confidence = 75 + Math.random() * 24;
    
    return {
      id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      protocol,
      chain,
      profit_eth,
      profit_usd: profit_eth * 3500, // ETH price mock
      confidence,
      complexity: Math.floor(20 + Math.random() * 60),
      gas_cost: 0.01 + Math.random() * 0.15,
      timestamp: Date.now(),
      route: this.generateRoute(),
      status: 'scanning',
    };
  }

  private generateRoute(): string[] {
    const numSteps = 2 + Math.floor(Math.random() * 4);
    const route: string[] = [];
    for (let i = 0; i < numSteps; i++) {
      route.push(this.protocols[Math.floor(Math.random() * this.protocols.length)]);
    }
    return route;
  }

  private executeOpportunity(opp: RealTimeOpportunity) {
    this.stats.trades_count += 1;
    this.stats.success_count += 1;
    this.stats.total_profit_eth += opp.profit_eth - opp.gas_cost;
    this.stats.total_profit_usd += (opp.profit_eth - opp.gas_cost) * 3500;
    this.stats.win_rate = (this.stats.success_count / this.stats.trades_count) * 100;
    this.stats.avg_profit_per_trade = this.stats.total_profit_eth / this.stats.trades_count;

    const event: ExecutionEvent = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: 'success',
      message: `Flash Loan executed on ${opp.protocol}`,
      value: opp.profit_eth - opp.gas_cost,
      timestamp: Date.now(),
      details: `Profit: ${(opp.profit_eth - opp.gas_cost).toFixed(4)} ETH via ${opp.route.join(' → ')}`,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };

    this.emit('execution', event);
  }

  private failOpportunity(opp: RealTimeOpportunity) {
    this.stats.trades_count += 1;
    this.stats.failed_count += 1;
    this.stats.win_rate = (this.stats.success_count / this.stats.trades_count) * 100;

    const event: ExecutionEvent = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: 'failure',
      message: `Execution failed: Gas spike detected`,
      timestamp: Date.now(),
      details: `Opportunity on ${opp.protocol} aborted due to unfavorable conditions`,
    };

    this.emit('execution', event);
  }

  disconnect() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.opportunityInterval) clearInterval(this.opportunityInterval);
    if (this.thoughtInterval) clearInterval(this.thoughtInterval);
    this.listeners.clear();
  }
}
