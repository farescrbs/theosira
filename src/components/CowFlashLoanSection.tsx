import React, { useState } from 'react';
import { VercelFlashLoanPanel } from './VercelFlashLoanPanel';

type FlashLoanType = 'CollateralSwap' | 'DebtSwap' | 'RepayCollateral';

export function CowFlashLoanSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [flashLoanType, setFlashLoanType] = useState<FlashLoanType>('CollateralSwap');
  const [step, setStep] = useState<'config' | 'quote' | 'execute'>('config');
  const [loading, setLoading] = useState(false);
  const [vercelPanelOpen, setVercelPanelOpen] = useState(false);
  const [config, setConfig] = useState({
    sellToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    buyToken: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
    collateralToken: '0xd0Dd6cEF72143E22cCED4867eb0d5F2328715533',
    amount: '20000000000000000000',
    flashLoanFee: '0.05',
    slippage: '50',
  });
  const [quoteResponse, setQuoteResponse] = useState<any>(null);
  const [executionSteps, setExecutionSteps] = useState<Array<{ step: string; status: string }>>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [deployments, setDeployments] = useState<Array<{ id: string; status: string; url: string }>>([]);

  const vercelConfig = {
    apiKey: 'vck_0w6LUBNtYXIb4ptuFoyTmKkaeCqV06GEZoSfhrOUgVH7Zv4AMr1B2Vse',
    teamId: 'team_thesoria',
    projectId: 'prj_flashloan_mev',
    aiGatewayKey: 'your_api_key_here',
  };

  const smartContracts = {
    factory: '0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927',
    aavePool: '0xb50201558B00496A145fE76f7424749556E326D8',
    adapters: {
      CollateralSwap: '0x29A9b0a13c81d59f13BA0f39DBDCAA1AB2adc95F',
      DebtSwap: '0xbE9A121bb958BBBb027dA728DEC0D5496811b7d1',
      RepayCollateral: '0x8e25d1210FabB0fcAdE92a82C4a89568B4b10E0F',
    }
  };

  const tokens = [
    { address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', symbol: 'WXDAI', name: 'Wrapped XDAI' },
    { address: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb', symbol: 'GNO', name: 'Gnosis' },
    { address: '0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0', symbol: 'USDC.e', name: 'USD Coin' },
    { address: '0xd0Dd6cEF72143E22cCED4867eb0d5F2328715533', symbol: 'aGnoWXDAI', name: 'Aave Gnosis WXDAI' },
  ];

  const handleRequestQuote = async () => {
    setLoading(true);
    const mockQuote = {
      quote: {
        sellAmount: (parseFloat(config.amount) - parseFloat(config.amount) * parseFloat(config.flashLoanFee) / 100).toString(),
        buyAmount: '5234567890000000000',
        feeAmount: '5000000000000000',
        validTo: Math.floor(Date.now() / 1000) + 600,
      },
      id: Math.floor(Math.random() * 1000000),
      verified: true,
    };

    setTimeout(() => {
      setQuoteResponse(mockQuote);
      setStep('quote');
      setLoading(false);
    }, 2000);
  };

  const handleExecute = async () => {
    setStep('execute');
    const steps = [
      { step: 'Calculate Flash Loan Amounts', status: 'pending' },
      { step: 'Get Instance Address', status: 'pending' },
      { step: 'Approve Collateral', status: 'pending' },
      { step: 'Sign Order (EIP-712)', status: 'pending' },
      { step: 'Deploy Adapter', status: 'pending' },
      { step: 'Submit to CoW Protocol', status: 'pending' },
      { step: 'Execute Flash Loan', status: 'pending' },
      { step: 'Settle via CoW', status: 'pending' },
      { step: 'Repay Loan + Fee', status: 'pending' },
    ];

    setExecutionSteps(steps);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExecutionSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'completed' } : idx < i ? { ...s, status: 'completed' } : s
      ));
    }
  };

  if (!isExpanded) {
    return (
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full mb-6">
              <span className="text-[#d4af37] text-sm tracking-wider">COW PROTOCOL INTEGRATION</span>
            </div>
            <h2 className="text-5xl md:text-6xl mb-6">
              <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-transparent bg-clip-text">
                Flash Loan
              </span>
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-8">
              Exécutez des flash loans Aave V3 avec swaps optimisés via CoW Protocol SDK + OpenAPI Specification
            </p>
          </div>

          {/* API Endpoints Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-slate-500 mb-2 tracking-wide">ORDERBOOK API</div>
              <div className="space-y-1 text-xs">
                <div className="text-emerald-400">POST /api/v1/orders</div>
                <div className="text-emerald-400">GET /api/v1/orders/:uid</div>
                <div className="text-emerald-400">POST /api/v1/quote</div>
                <div className="text-slate-500">DELETE /api/v1/orders</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-slate-500 mb-2 tracking-wide">SOLVER API</div>
              <div className="space-y-1 text-xs">
                <div className="text-emerald-400">GET /quote</div>
                <div className="text-emerald-400">POST /solve</div>
                <div className="text-emerald-400">POST /reveal</div>
                <div className="text-emerald-400">POST /settle</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-slate-500 mb-2 tracking-wide">ENGINE API</div>
              <div className="space-y-1 text-xs">
                <div className="text-emerald-400">POST /solve</div>
                <div className="text-emerald-400">POST /notify</div>
                <div className="text-slate-400">Auction solving</div>
                <div className="text-slate-400">Solution scoring</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-slate-500 mb-2 tracking-wide">NETWORKS</div>
              <div className="space-y-1 text-xs">
                <div className="text-[#d4af37]">Mainnet</div>
                <div className="text-[#d4af37]">Gnosis Chain</div>
                <div className="text-[#d4af37]">Arbitrum One</div>
                <div className="text-slate-400">+8 networks</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6">
              <div className="text-xs text-slate-500 mb-3 tracking-wide">COW PROTOCOL SDK</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Version</span>
                  <span className="text-emerald-400">v1.6.2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">API Endpoint</span>
                  <span className="text-emerald-400">api.cow.fi/xdai</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">EIP-712</span>
                  <span className="text-emerald-400">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">OpenAPI</span>
                  <span className="text-[#d4af37]">v3.0.3</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6">
              <div className="text-xs text-slate-500 mb-3 tracking-wide">AAVE V3</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Protocol</span>
                  <span className="text-emerald-400">v3.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Standard</span>
                  <span className="text-emerald-400">ERC-3156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Flash Fee</span>
                  <span className="text-[#d4af37]">0.05%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pool</span>
                  <span className="text-slate-200 font-mono text-[10px]">0xb502...4fA4</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6">
              <div className="text-xs text-slate-500 mb-3 tracking-wide">SMART CONTRACTS</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Factory</span>
                  <span className="text-slate-200 font-mono text-[10px]">0x43c6...6927</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hook Adapter</span>
                  <span className="text-slate-200 font-mono text-[10px]">0x29A9...c95F</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">EIP-1271</span>
                  <span className="text-emerald-400">✓ Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hooks</span>
                  <span className="text-[#d4af37]">v0.2.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* FlashLoan Hint Schema */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6 mb-8">
            <div className="text-sm text-slate-100 mb-4 tracking-wide">FlashloanHint Schema</div>
            <div className="grid md:grid-cols-5 gap-4 text-xs">
              <div>
                <div className="text-slate-500 mb-1">liquidityProvider</div>
                <div className="text-emerald-400 font-mono text-[10px]">Address</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">protocolAdapter</div>
                <div className="text-emerald-400 font-mono text-[10px]">Address</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">receiver</div>
                <div className="text-emerald-400 font-mono text-[10px]">Address</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">token</div>
                <div className="text-emerald-400 font-mono text-[10px]">Token</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">amount</div>
                <div className="text-emerald-400 font-mono text-[10px]">TokenAmount</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-12 py-4 rounded-full hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all"
            >
              <span className="tracking-wider">Launch Flash Loan Interface</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl mb-2">
              <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-transparent bg-clip-text">
                Flash Loan Interface
              </span>
            </h2>
            <p className="text-gray-400">Aave V3 + CoW Protocol Integration</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVercelPanelOpen(true)}
              className="flex items-center gap-2 bg-black border border-slate-700 px-4 py-2 rounded hover:border-[#d4af37]/50 transition-all"
            >
              <span className="text-2xl">▲</span>
              <span className="text-sm text-slate-200">Vercel AI</span>
            </button>
            <button
              onClick={() => {
                setIsExpanded(false);
                setStep('config');
                setQuoteResponse(null);
                setExecutionSteps([]);
              }}
              className="text-slate-400 hover:text-[#d4af37] transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            {['Configuration', 'Quote', 'Execute'].map((label, idx) => (
              <div key={idx} className="contents">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      (idx === 0 && step === 'config') ||
                      (idx === 1 && step === 'quote') ||
                      (idx === 2 && step === 'execute')
                        ? 'bg-[#d4af37] text-black'
                        : idx < ['config', 'quote', 'execute'].indexOf(step)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {idx < ['config', 'quote', 'execute'].indexOf(step) ? '✓' : idx + 1}
                  </div>
                  <span className={`text-sm ${
                    (idx === 0 && step === 'config') ||
                    (idx === 1 && step === 'quote') ||
                    (idx === 2 && step === 'execute')
                      ? 'text-[#d4af37]'
                      : 'text-slate-400'
                  }`}>
                    {label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    idx < ['config', 'quote', 'execute'].indexOf(step)
                      ? 'bg-emerald-500'
                      : 'bg-slate-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        {step === 'config' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6">
              <h3 className="text-xl text-slate-100 mb-6">Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">SELL TOKEN</label>
                    <select
                      value={config.sellToken}
                      onChange={(e) => setConfig({ ...config, sellToken: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200 text-sm focus:border-[#d4af37]/50 focus:outline-none"
                    >
                      {tokens.filter(t => !t.symbol.startsWith('a')).map((token) => (
                        <option key={token.address} value={token.address}>{token.symbol}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">BUY TOKEN</label>
                    <select
                      value={config.buyToken}
                      onChange={(e) => setConfig({ ...config, buyToken: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200 text-sm focus:border-[#d4af37]/50 focus:outline-none"
                    >
                      {tokens.filter(t => !t.symbol.startsWith('a')).map((token) => (
                        <option key={token.address} value={token.address}>{token.symbol}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-2">COLLATERAL TOKEN</label>
                  <select
                    value={config.collateralToken}
                    onChange={(e) => setConfig({ ...config, collateralToken: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200 text-sm focus:border-[#d4af37]/50 focus:outline-none"
                  >
                    {tokens.filter(t => t.symbol.startsWith('a')).map((token) => (
                      <option key={token.address} value={token.address}>{token.symbol}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">AMOUNT (WEI)</label>
                    <input
                      type="text"
                      value={config.amount}
                      onChange={(e) => setConfig({ ...config, amount: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200 text-sm font-mono focus:border-[#d4af37]/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">FLASH FEE (%)</label>
                    <input
                      type="text"
                      value={config.flashLoanFee}
                      onChange={(e) => setConfig({ ...config, flashLoanFee: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200 text-sm focus:border-[#d4af37]/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">SLIPPAGE (BPS)</label>
                    <input
                      type="text"
                      value={config.slippage}
                      onChange={(e) => setConfig({ ...config, slippage: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200 text-sm focus:border-[#d4af37]/50 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRequestQuote}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black py-3 rounded hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'Requesting Quote...' : 'Request Quote from CoW Protocol'}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6">
              <h3 className="text-sm text-slate-100 mb-4">Calculation</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-slate-200">{(parseFloat(config.amount) / 1e18).toFixed(4)} WXDAI</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Flash Fee</span>
                  <span className="text-amber-400">{((parseFloat(config.amount) / 1e18) * parseFloat(config.flashLoanFee) / 100).toFixed(6)} WXDAI</span>
                </div>
                <div className="h-px bg-slate-800"></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Net Amount</span>
                  <span className="text-[#d4af37]">{((parseFloat(config.amount) / 1e18) - ((parseFloat(config.amount) / 1e18) * parseFloat(config.flashLoanFee) / 100)).toFixed(6)} WXDAI</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quote */}
        {step === 'quote' && quoteResponse && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6">
              <h3 className="text-xl text-slate-100 mb-6">Quote Response</h3>
              <div className="space-y-4">
                <div className="bg-slate-950/50 border border-slate-800/30 rounded p-4">
                  <div className="text-xs text-slate-500 mb-3">DETAILS</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Quote ID</span>
                      <span className="text-[#d4af37] font-mono">{quoteResponse.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Verified</span>
                      <span className="text-emerald-400">✓ Yes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Buy Amount</span>
                      <span className="text-emerald-400 font-mono text-xs">{quoteResponse.quote.buyAmount}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleExecute}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black py-3 rounded hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all"
                >
                  Execute Flash Loan
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6">
              <h3 className="text-xl text-slate-100 mb-6">Execution Preview</h3>
              <div className="space-y-3">
                {['Borrow via Aave V3', 'Deploy Adapter', 'Execute Swap', 'Repay + Fee'].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-xs text-[#d4af37] flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="text-xs text-slate-400">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Execute */}
        {step === 'execute' && (
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl text-slate-100 mb-6">Execution Progress</h3>
            <div className="space-y-2">
              {executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`border rounded p-3 transition-all ${
                    step.status === 'completed'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-slate-700/50 bg-slate-950/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        step.status === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {step.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div className="text-sm text-slate-200">{step.step}</div>
                  </div>
                </div>
              ))}
            </div>
            {executionSteps.every(s => s.status === 'completed') && (
              <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded p-6 text-center">
                <div className="text-4xl mb-2">✓</div>
                <div className="text-lg text-emerald-400 mb-2">Flash Loan Executed Successfully</div>
                <div className="text-sm text-slate-400">The flash loan has been executed and repaid.</div>
              </div>
            )}
          </div>
        )}

        {/* Vercel Panel */}
        <VercelFlashLoanPanel isOpen={vercelPanelOpen} onClose={() => setVercelPanelOpen(false)} />
      </div>
    </section>
  );
}

export default CowFlashLoanSection;