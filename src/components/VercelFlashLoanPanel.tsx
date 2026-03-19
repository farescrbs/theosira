import React, { useState } from 'react';

interface VercelFlashLoanPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VercelFlashLoanPanel({ isOpen, onClose }: VercelFlashLoanPanelProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'deploy' | 'monitor' | 'api'>('ai');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);

  const handleAiQuery = async () => {
    // Simulation appel AI Gateway
    const mockResponse = `Based on your flash loan parameters:
- Amount: 20 WXDAI
- Tokens: WXDAI → GNO
- Strategy: CollateralSwap

AI Recommendations:
✓ Current gas price optimal (15 Gwei)
✓ Liquidity depth sufficient for execution
✓ Estimated profit after fees: +0.12 WXDAI (+0.6%)
⚠ High MEV competition detected on this route
→ Consider increasing slippage to 75 bps

Optimal execution window: Next 2 minutes`;

    setAiResponse(mockResponse);
  };

  const handleDeploy = async () => {
    const logs = [
      '[Vercel] Deploying Flash Loan MEV Bot...',
      '[Build] Installing dependencies from package.json',
      '[Build] Building TypeScript contracts',
      '[Build] Compiling Solidity adapters',
      '[Deploy] Uploading to Vercel Edge Network',
      '[Deploy] Setting environment variables',
      '[Deploy] AI_GATEWAY_API_KEY configured',
      '[Deploy] AAVE_POOL_ADDRESS configured',
      '[Deploy] COW_PROTOCOL_API configured',
      '[Success] Deployment complete!',
      '[Success] URL: https://flashloan-mev-thesoria.vercel.app',
    ];

    for (const log of logs) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeploymentLogs(prev => [...prev, log]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-[#d4af37]/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-2xl mb-1">
              <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-transparent bg-clip-text">
                Vercel Integration
              </span>
            </h3>
            <p className="text-sm text-slate-400">AI Gateway • Serverless Deploy • Monitoring</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#d4af37] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {[
            { id: 'ai', label: 'AI Assistant', icon: '🤖' },
            { id: 'deploy', label: 'Deploy', icon: '🚀' },
            { id: 'monitor', label: 'Monitor', icon: '📊' },
            { id: 'api', label: 'API Endpoints', icon: '⚡' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* AI Assistant Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6">
                <h4 className="text-lg text-slate-100 mb-4">AI Gateway - GPT-4 Optimization</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">Ask AI for Strategy Optimization</label>
                    <textarea
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="e.g., 'Analyze my flash loan parameters and suggest optimal execution'"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded px-4 py-3 text-slate-200 text-sm focus:border-[#d4af37]/50 focus:outline-none min-h-[100px]"
                    />
                  </div>
                  <button
                    onClick={handleAiQuery}
                    className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-6 py-2 rounded hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all"
                  >
                    Analyze with GPT-4
                  </button>
                  {aiResponse && (
                    <div className="bg-emerald-500/5 border border-emerald-500/30 rounded p-4">
                      <div className="text-xs text-emerald-400 mb-2">AI Response:</div>
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">{aiResponse}</pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-3">AI GATEWAY CONFIG</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Model</span>
                      <span className="text-emerald-400">openai/gpt-4.1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Stream</span>
                      <span className="text-emerald-400">✓ Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Token Usage</span>
                      <span className="text-slate-200">1,247 tokens</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-3">MEV PREDICTIONS</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Profit Probability</span>
                      <span className="text-emerald-400">87.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Competition Level</span>
                      <span className="text-amber-400">High</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Best Block</span>
                      <span className="text-[#d4af37]">Next 3 blocks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deploy Tab */}
          {activeTab === 'deploy' && (
            <div className="space-y-6">
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6">
                <h4 className="text-lg text-slate-100 mb-4">Deploy to Vercel</h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">Project Name</label>
                      <input
                        type="text"
                        defaultValue="flashloan-mev-thesoria"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded px-4 py-2 text-slate-200 text-sm focus:border-[#d4af37]/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">Team ID</label>
                      <input
                        type="text"
                        defaultValue="team_thesoria"
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded px-4 py-2 text-slate-200 text-sm focus:border-[#d4af37]/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-2">Environment Variables</label>
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded p-3 text-xs font-mono space-y-1">
                      <div className="text-slate-400">AI_GATEWAY_API_KEY=your_api_key_here</div>
                      <div className="text-slate-400">VERCEL_TOKEN=vck_0w6LUBNtYXIb4ptuFoyTmKka...</div>
                      <div className="text-slate-400">AAVE_POOL_ADDRESS=0xb50201558B00496A145fE76f74...</div>
                      <div className="text-slate-400">COW_PROTOCOL_API=https://api.cow.fi/xdai</div>
                      <div className="text-slate-400">SENTRY_DSN=https://sentry.io/...</div>
                    </div>
                  </div>

                  <button
                    onClick={handleDeploy}
                    className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black px-6 py-3 rounded hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all w-full"
                  >
                    🚀 Deploy to Vercel Edge Network
                  </button>

                  {deploymentLogs.length > 0 && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded p-4">
                      <div className="text-xs text-slate-500 mb-2">Deployment Logs:</div>
                      <div className="space-y-1 font-mono text-xs">
                        {deploymentLogs.map((log, idx) => (
                          <div key={idx} className={
                            log.includes('[Success]') ? 'text-emerald-400' :
                            log.includes('[Deploy]') ? 'text-[#d4af37]' :
                            'text-slate-400'
                          }>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <a
                href="https://vercel.com/new/clone?repository-url=https://github.com/thesoria/flashloan-mev"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-black border border-slate-700 rounded-lg p-4 hover:border-[#d4af37]/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">▲</div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-200">Deploy with Vercel</div>
                    <div className="text-xs text-slate-500">One-click deployment</div>
                  </div>
                  <div className="text-slate-400">→</div>
                </div>
              </a>
            </div>
          )}

          {/* Monitor Tab */}
          {activeTab === 'monitor' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-2">DEPLOYMENTS</div>
                  <div className="text-2xl text-emerald-400 mb-1">24</div>
                  <div className="text-xs text-slate-400">Last 7 days</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-2">EXECUTIONS</div>
                  <div className="text-2xl text-[#d4af37] mb-1">1,247</div>
                  <div className="text-xs text-slate-400">Total transactions</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-2">SUCCESS RATE</div>
                  <div className="text-2xl text-emerald-400 mb-1">98.7%</div>
                  <div className="text-xs text-slate-400">Non-reverted</div>
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6">
                <h4 className="text-lg text-slate-100 mb-4">Recent Deployments</h4>
                <div className="space-y-3">
                  {[
                    { id: 'dpl_abc123', status: 'Ready', url: 'https://flashloan-mev-thesoria.vercel.app', time: '2min ago' },
                    { id: 'dpl_def456', status: 'Ready', url: 'https://flashloan-mev-thesoria-git-main.vercel.app', time: '1h ago' },
                    { id: 'dpl_ghi789', status: 'Ready', url: 'https://flashloan-mev-thesoria-preview.vercel.app', time: '3h ago' },
                  ].map(deployment => (
                    <div key={deployment.id} className="bg-slate-900/50 border border-slate-800 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-sm text-slate-200">{deployment.id}</span>
                        </div>
                        <span className="text-xs text-slate-500">{deployment.time}</span>
                      </div>
                      <a
                        href={deployment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#d4af37] hover:underline"
                      >
                        {deployment.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6">
                <h4 className="text-lg text-slate-100 mb-4">Performance Metrics</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Avg Response Time', value: '47ms', status: 'good' },
                    { label: 'Edge Network Hits', value: '99.2%', status: 'good' },
                    { label: 'Gas Optimization', value: '-23.4%', status: 'good' },
                    { label: 'MEV Capture Rate', value: '76.8%', status: 'medium' },
                  ].map(metric => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{metric.label}</span>
                      <span className={`text-sm ${metric.status === 'good' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6">
                <h4 className="text-lg text-slate-100 mb-4">Serverless API Endpoints</h4>
                <div className="space-y-4">
                  {[
                    {
                      method: 'GET',
                      path: '/api/examples/info',
                      desc: 'Get GitHub/GitLab repo info for flash loan templates',
                    },
                    {
                      method: 'GET',
                      path: '/api/frameworks',
                      desc: 'List supported frameworks and integrations',
                    },
                    {
                      method: 'POST',
                      path: '/api/flashloan/execute',
                      desc: 'Execute flash loan with CoW Protocol',
                    },
                    {
                      method: 'GET',
                      path: '/api/flashloan/quote',
                      desc: 'Get optimized quote from AI Gateway',
                    },
                    {
                      method: 'POST',
                      path: '/api/flashloan/deploy',
                      desc: 'Deploy flash loan strategy to Vercel',
                    },
                  ].map(endpoint => (
                    <div key={endpoint.path} className="bg-slate-900/50 border border-slate-800 rounded p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm text-[#d4af37]">{endpoint.path}</code>
                      </div>
                      <p className="text-xs text-slate-400">{endpoint.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6">
                <h4 className="text-lg text-slate-100 mb-4">API Usage Example</h4>
                <pre className="bg-slate-900/80 border border-slate-800 rounded p-4 text-xs text-slate-300 overflow-x-auto">
{`import { streamText } from 'ai';
import 'dotenv/config';

async function optimizeFlashLoan() {
  const result = streamText({
    model: 'openai/gpt-4.1',
    prompt: 'Analyze flash loan opportunity: 20 WXDAI → GNO',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
}

// Vercel API Handler
export default withApiHandler(async function (req, res) {
  const quote = await fetch('https://api.cow.fi/xdai/api/v1/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sellToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      buyToken: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
      amount: '20000000000000000000',
      kind: 'sell',
    }),
  });
  
  return res.status(200).json(await quote.json());
});`}
                </pre>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4">
                <div className="text-sm text-amber-400 mb-1">⚠️ API Rate Limits</div>
                <div className="text-xs text-slate-400">
                  Pro Plan: 1,000 requests/min • Enterprise: Unlimited
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
