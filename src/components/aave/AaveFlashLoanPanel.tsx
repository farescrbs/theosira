import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface FlashLoanOpportunity {
  id: string;
  protocol: string;
  asset: string;
  amount: number;
  estimatedProfit: number;
  gasEstimate: number;
  confidence: number;
  route: string[];
}

export default function AaveFlashLoanPanel() {
  const [opportunities, setOpportunities] = useState<FlashLoanOpportunity[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState('USDC');
  const [loanAmount, setLoanAmount] = useState('10000');

  // Simulation de scanning d'opportunités
  useEffect(() => {
    const interval = setInterval(() => {
      const mockOpportunity: FlashLoanOpportunity = {
        id: Date.now().toString(),
        protocol: ['Uniswap V3', 'Curve', 'Balancer', 'SushiSwap'][Math.floor(Math.random() * 4)],
        asset: selectedAsset,
        amount: parseFloat(loanAmount) || 10000,
        estimatedProfit: Math.random() * 500 + 50,
        gasEstimate: Math.random() * 30 + 10,
        confidence: Math.random() * 20 + 75,
        route: ['Aave → Uniswap → Curve → Repay'],
      };

      setOpportunities(prev => [mockOpportunity, ...prev].slice(0, 8));
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedAsset, loanAmount]);

  const executeFlashLoan = (opportunity: FlashLoanOpportunity) => {
    console.log('Executing Flash Loan:', opportunity);
    // Ici, intégration avec votre smart contract
  };

  return (
    <div className="backdrop-blur-xl bg-black/40 border border-yellow-500/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl text-white">Aave Flash Loans</h2>
            <p className="text-sm text-gray-400">Arbitrage automatique sans capital</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-400">
            {isScanning ? 'Scanning...' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Asset</label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500/50"
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="DAI">DAI</option>
            <option value="WETH">WETH</option>
            <option value="WBTC">WBTC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Loan Amount</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500/50"
            placeholder="10000"
          />
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-400 mb-3">Opportunités détectées ({opportunities.length})</h3>
        
        {opportunities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Scanning pour des opportunités...</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-black/30 border border-yellow-500/10 rounded-xl p-4 hover:border-yellow-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-white">{opp.protocol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      opp.confidence > 90 
                        ? 'bg-green-500/20 text-green-400'
                        : opp.confidence > 80
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {opp.confidence.toFixed(1)}% confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Profit estimé</p>
                    <p className="text-green-400">+${opp.estimatedProfit.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Gas</p>
                    <p className="text-yellow-400">${opp.gasEstimate.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Net</p>
                    <p className="text-green-400">
                      +${(opp.estimatedProfit - opp.gasEstimate).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {opp.route.join(' → ')}
                  </p>
                  <button
                    onClick={() => executeFlashLoan(opp)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all text-sm"
                  >
                    Execute
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-yellow-500/10">
        <div className="text-center">
          <p className="text-2xl text-white">24</p>
          <p className="text-xs text-gray-400">Executed Today</p>
        </div>
        <div className="text-center">
          <p className="text-2xl text-green-400">$12,450</p>
          <p className="text-xs text-gray-400">Total Profit</p>
        </div>
        <div className="text-center">
          <p className="text-2xl text-white">96.8%</p>
          <p className="text-xs text-gray-400">Success Rate</p>
        </div>
      </div>
    </div>
  );
}
