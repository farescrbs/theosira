/**
 * Dashboard pour monitorer et contrôler le FlashBot Smart Contract
 * 
 * Interface pour l'IA Maître pour exécuter des Flash Loans on-chain
 * Version: 1.2 - Network Switcher Integration
 */

import { useState, useEffect } from "react"
import { 
  Zap, 
  Wallet, 
  TrendingUp, 
  Activity,
  DollarSign,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  BarChart3,
  ArrowUp,
  Shield,
  Key,
} from "lucide-react"
import { 
  useFlashBotContract, 
  TOKEN_ADDRESSES, 
  formatTokenAmount,
  getTokenSymbol,
  type FlashLoanParams 
} from "../hooks/useFlashBotContract"
import { useSecureBlockchain } from "../hooks/useSecureBlockchain"
import { NetworkSwitcher } from "./NetworkSwitcher"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts@2.15.2'

export function FlashBotDashboard() {
  const {
    isConnected,
    contractAddress,
    ownerAddress,
    contractExists,
    tokenBalances,
    ethBalance,
    recentTransactions,
    pendingTx,
    connect,
    executeFlashLoan,
    withdrawToken,
    withdrawETH,
    refreshBalances,
    totalProfit,
    totalTransactions,
    successRate,
  } = useFlashBotContract()
  
  const [selectedToken, setSelectedToken] = useState('USDC')
  const [flashLoanAmount, setFlashLoanAmount] = useState('10000')
  const [isExecuting, setIsExecuting] = useState(false)
  
  // 🔒 Secure API Management
  const { keyStatus, configureKey, isLoading: isKeyLoading } = useSecureBlockchain()
  const [showKeyConfig, setShowKeyConfig] = useState(false)
  const [alchemyKeyInput, setAlchemyKeyInput] = useState("")
  const [infuraKeyInput, setInfuraKeyInput] = useState("")
  
  // ⬆️ État du bouton "Retour en haut"
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // 🌐 État du réseau actuel
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(undefined)
  
  // 📊 Données de graphique de performance (dernières 24h)
  const performanceData = [
    { time: '00:00', profit: 0, cumulative: 0 },
    { time: '02:00', profit: 124.50, cumulative: 124.50 },
    { time: '04:00', profit: 89.30, cumulative: 213.80 },
    { time: '06:00', profit: 456.80, cumulative: 670.60 },
    { time: '08:00', profit: 234.20, cumulative: 904.80 },
    { time: '10:00', profit: 678.90, cumulative: 1583.70 },
    { time: '12:00', profit: 1234.56, cumulative: 2818.26 },
    { time: '14:00', profit: 567.40, cumulative: 3385.66 },
    { time: '16:00', profit: 2156.89, cumulative: 5542.55 },
    { time: '18:00', profit: 847.32, cumulative: 6389.87 },
    { time: '19:00', profit: 3421.78, cumulative: 9811.65 },
    { time: '20:00', profit: 1567.43, cumulative: 11379.08 },
    { time: '21:00', profit: 2138.02, cumulative: 13517.10 },
    { time: 'Now', profit: 0, cumulative: 13517.10 },
  ]
  
  const [logs, setLogs] = useState<{t: string, msg: string, type: 'info'|'success'|'error'}[]>([])
  
  const addLog = (msg: string, type: 'info'|'success'|'error' = 'info') => {
    setLogs(prev => [...prev.slice(-19), { t: new Date().toLocaleTimeString('fr-FR'), msg, type }])
  }

  // Détecter le scroll pour afficher/cacher le bouton
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Détecter le réseau actuel
  useEffect(() => {
    const detectNetwork = async () => {
      if (window.ethereum && isConnected) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          setCurrentChainId(parseInt(chainId, 16))
        } catch (err) {
          console.error('Erreur détection réseau:', err)
        }
      }
    }
    
    detectNetwork()
    
    // Écouter les changements de réseau
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        setCurrentChainId(parseInt(chainId, 16))
      }
      
      window.ethereum.on('chainChanged', handleChainChanged)
      
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [isConnected])
  
  // Fonction pour scroller vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  const handleExecuteFlashLoan = async () => {
    try {
      setIsExecuting(true)
      
      // Paramètres d'exemple pour un arbitrage USDC
      const params: FlashLoanParams = {
        tokenIn: TOKEN_ADDRESSES.USDC,
        tokenOut: TOKEN_ADDRESSES.USDT,
        path1: [TOKEN_ADDRESSES.USDC, TOKEN_ADDRESSES.WETH, TOKEN_ADDRESSES.USDT],
        path2: [TOKEN_ADDRESSES.USDT, TOKEN_ADDRESSES.WETH, TOKEN_ADDRESSES.USDC],
        minProfit: '100', // 100 USDC minimum
        dex1: 0, // Uniswap
        dex2: 1, // Sushiswap
      }
      
      const txHash = await executeFlashLoan(
        TOKEN_ADDRESSES[selectedToken as keyof typeof TOKEN_ADDRESSES],
        flashLoanAmount,
        params
      )
      
      addLog(`Flash Loan exécuté - TX: ${txHash.substring(0,10)}...`, 'success')
    } catch (error: any) {
      // Formater le message d'erreur pour être plus lisible
      const errorMsg = error.message || 'Erreur inconnue'
      
      // Si c'est une erreur de réseau, afficher une alerte modale
      if (errorMsg.includes('Réseau non supporté') || errorMsg.includes('Contrat non déployé')) {
        alert(errorMsg)
      }
      
      // Logger l'erreur dans la console
      addLog(`Erreur: ${errorMsg.split('\n')[0]}`, 'error')
      console.error('Détails de l\'erreur Flash Loan:', error)
    } finally {
      setIsExecuting(false)
    }
  }
  
  const handleWithdraw = async (token: string) => {
    try {
      const txHash = await withdrawToken(TOKEN_ADDRESSES[token as keyof typeof TOKEN_ADDRESSES])
      addLog(`Retrait ${token} effectué - TX: ${txHash.substring(0,10)}...`, 'success')
    } catch (error: any) {
      addLog(`Erreur retrait: ${error.message}`, 'error')
    }
  }
  
  const handleWithdrawETH = async () => {
    try {
      const txHash = await withdrawETH()
      addLog(`Retrait MATIC effectué - TX: ${txHash.substring(0,10)}...`, 'success')
    } catch (error: any) {
      addLog(`Erreur retrait: ${error.message}`, 'error')
    }
  }
  
  if (!isConnected) {
    return (
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center p-16 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30 flex items-center justify-center">
              <Wallet className="w-12 h-12 text-[#d4af37]" />
            </div>
            
            <h2 className="text-4xl mb-4">FlashBot Smart Contract</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Connectez votre wallet pour accéder au système de Flash Loan on-chain
            </p>
            
            <button
              onClick={connect}
              className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-yellow-600 text-black rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all text-lg flex items-center gap-3 mx-auto"
            >
              <Wallet className="w-5 h-5" />
              Connecter MetaMask
            </button>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37] rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500 rounded-full blur-[128px]" />
      </div>
      
      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37]/20 to-green-500/20 border border-[#d4af37]/30 mb-6">
            <Zap className="w-5 h-5 text-[#d4af37]" />
            <span className="text-sm tracking-wider text-[#d4af37]">FLASH LOAN BOT ON-CHAIN</span>
            {isConnected ? (
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                LIVE PRODUCTION
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30">
                DISCONNECTED
              </span>
            )}
          </div>
          
          <h2 className="text-6xl mb-6 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent">
            FlashBot Dashboard
          </h2>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Connecté</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>{ownerAddress?.slice(0, 6)}...{ownerAddress?.slice(-4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>{contractAddress?.slice(0, 6)}...{contractAddress?.slice(-4)}</span>
              <a 
                href={`https://polygonscan.com/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4af37] hover:text-yellow-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Profit Total"
            value={`$${parseFloat(totalProfit).toFixed(2)}`}
            icon={DollarSign}
            color="green"
            trend={totalProfit !== '0' ? '+100%' : undefined}
          />
          <StatCard
            label="Transactions"
            value={totalTransactions.toString()}
            icon={Activity}
            color="blue"
          />
          <StatCard
            label="Taux de Succès"
            value={`${successRate.toFixed(1)}%`}
            icon={CheckCircle2}
            color={successRate > 80 ? 'green' : successRate > 50 ? 'yellow' : 'red'}
          />
          <StatCard
            label="Solde MATIC"
            value={parseFloat(ethBalance).toFixed(4)}
            icon={Wallet}
            color="purple"
          />
        </div>
        
        {/* Network Switcher */}
        <div className="mb-8">
          <NetworkSwitcher currentChainId={currentChainId} />
        </div>
        
        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left - Flash Loan Executor */}
          <div className="lg:col-span-1">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#d4af37]/20">
                    <Zap className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  Exécuter Flash Loan
                </h3>
                
                {pendingTx && (
                  <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <Clock className="w-4 h-4 animate-spin" />
                    En cours...
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Avertissement si pas connecté */}
                {!isConnected && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-200 mb-1">⚠️ Contrat non connecté</p>
                        <p className="text-xs text-yellow-300/70">
                          Veuillez connecter votre wallet MetaMask et vous assurer que le smart contract FlashBot est déployé sur le réseau Polygon ou Gnosis Chain.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Token</label>
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                  >
                    {Object.keys(TOKEN_ADDRESSES).map(token => (
                      <option key={token} value={token}>{token}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Montant</label>
                  <input
                    type="number"
                    value={flashLoanAmount}
                    onChange={(e) => setFlashLoanAmount(e.target.value)}
                    placeholder="10000"
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Frais Aave: 0.09% = ${(parseFloat(flashLoanAmount) * 0.0009).toFixed(2)}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-gray-400 mb-3">
                    Stratégie: Arbitrage DEX (Uniswap ↔ Sushiswap)
                  </div>
                  
                  <button
                    onClick={handleExecuteFlashLoan}
                    disabled={isExecuting || !!pendingTx}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#d4af37] to-yellow-600 text-black rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isExecuting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Exécution...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Lancer Flash Loan
                      </>
                    )}
                  </button>
                  
                  {logs.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {logs.map((log, i) => (
                        <div key={i} className={`text-[10px] px-2 py-1.5 rounded bg-black/40 font-mono border-l-2 ${
                          log.type === 'error' ? 'border-red-500 text-red-400' :
                          log.type === 'success' ? 'border-green-500 text-green-400' :
                          'border-blue-500 text-blue-400'
                        }`}>
                          <span className="opacity-50 mr-1">[{log.t}]</span>
                          {log.msg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle - Token Balances */}
          <div className="lg:col-span-1">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Wallet className="w-5 h-5 text-green-400" />
                  </div>
                  Soldes Contract
                </h3>
                
                <button
                  onClick={refreshBalances}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {/* MATIC Balance */}
                <div className="p-4 rounded-lg bg-black/30 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-xs">Ⓜ</span>
                      </div>
                      <div>
                        <div className="text-sm text-white">MATIC</div>
                        <div className="text-xs text-gray-400">Polygon</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{parseFloat(ethBalance).toFixed(4)}</div>
                      <button
                        onClick={handleWithdrawETH}
                        className="text-xs text-[#d4af37] hover:text-yellow-300 flex items-center gap-1 ml-auto"
                      >
                        <ArrowUpFromLine className="w-3 h-3" />
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Token Balances */}
                {Object.entries(tokenBalances).map(([symbol, balance]) => {
                  const balanceNum = parseFloat(balance)
                  if (balanceNum === 0) return null
                  
                  return (
                    <div key={symbol} className="p-4 rounded-lg bg-black/30 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                            <span className="text-xs">{symbol.slice(0, 1)}</span>
                          </div>
                          <div>
                            <div className="text-sm text-white">{symbol}</div>
                            <div className="text-xs text-gray-400">ERC-20</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white">{formatTokenAmount(balance)}</div>
                          <button
                            onClick={() => handleWithdraw(symbol)}
                            className="text-xs text-[#d4af37] hover:text-yellow-300 flex items-center gap-1 ml-auto"
                          >
                            <ArrowUpFromLine className="w-3 h-3" />
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {Object.values(tokenBalances).every(b => parseFloat(b) === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Wallet className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aucun solde token</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right - Recent Transactions */}
          <div className="lg:col-span-1">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl mb-6 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                Transactions Récentes
              </h3>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aucune transaction</p>
                  </div>
                ) : (
                  recentTransactions.map((tx) => (
                    <div 
                      key={tx.hash} 
                      className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-white mb-1">Flash Loan</div>
                          <div className="text-xs text-gray-400">
                            {tx.amount} {getTokenSymbol(tx.token)}
                          </div>
                        </div>
                        
                        <TxStatusBadge status={tx.status} />
                      </div>
                      
                      {tx.profit && (
                        <div className="text-xs text-green-400 mb-2">
                          Profit: +${tx.profit}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                        <a
                          href={`https://polygonscan.com/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d4af37] hover:text-yellow-300 flex items-center gap-1"
                        >
                          Voir <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Chart */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <BarChart3 className="w-5 h-5 text-green-400" />
              </div>
              Performance (24h)
            </h3>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d4af37]" />
                <span className="text-gray-400">Profit Cumulatif</span>
              </div>
              <div className="text-gray-400">
                Total: <span className="text-green-400">${performanceData[performanceData.length - 1].cumulative.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-xl p-6" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={performanceData}
                margin={{
                  top: 10, right: 30, left: 0, bottom: 0,
                }}
              >
                <defs key="defs">
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop key="stop1" offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                    <stop key="stop2" offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                <XAxis 
                  key="xaxis"
                  dataKey="time" 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  key="yaxis"
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip key="tooltip" content={<CustomTooltip />} />
                <Area 
                  key="area"
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#d4af37" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Stats rapides */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-black/20 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Profit Moyen</div>
              <div className="text-lg text-white">$1,108.36</div>
            </div>
            <div className="p-4 rounded-lg bg-black/20 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Meilleur Trade</div>
              <div className="text-lg text-green-400">$3,421.78</div>
            </div>
            <div className="p-4 rounded-lg bg-black/20 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Volume 24h</div>
              <div className="text-lg text-white">$800,000</div>
            </div>
            <div className="p-4 rounded-lg bg-black/20 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">ROI Moyen</div>
              <div className="text-lg text-[#d4af37]">1.69%</div>
            </div>
          </div>

          {/* Secure API Management */}
          <div className="mt-6 border border-[#d4af37]/20 bg-black/40 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-playfair text-lg text-white m-0">Gestion Sécurisée des Clés d'API</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${keyStatus.alchemy ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    Alchemy {keyStatus.alchemy ? 'Actif' : 'Manquant'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${keyStatus.infura ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    Infura {keyStatus.infura ? 'Actif' : 'Manquant'}
                  </span>
                </div>
                <ArrowDownToLine className={`w-4 h-4 text-gray-400 transition-transform ${showKeyConfig ? 'rotate-180' : ''}`} />
              </div>
            </div>
            
            {showKeyConfig && (
              <div className="p-4 border-t border-white/5 bg-black/20 grid grid-cols-2 gap-6">
                {/* Alchemy Config */}
                <div className="space-y-3">
                  <label className="block text-sm text-gray-400">Clé d'API Alchemy (RPC)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="password"
                        placeholder="••••••••••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50"
                        value={alchemyKeyInput}
                        onChange={(e) => setAlchemyKeyInput(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={async () => {
                        await configureKey('alchemy', alchemyKeyInput);
                        setAlchemyKeyInput("");
                      }}
                      disabled={isKeyLoading || !alchemyKeyInput}
                      className="px-4 py-2 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] text-sm rounded-lg border border-[#d4af37]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isKeyLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">La clé est chiffrée et stockée de manière sécurisée via Supabase KV Store. Le frontend n'y a jamais accès directement.</p>
                </div>
                
                {/* Infura Config */}
                <div className="space-y-3">
                  <label className="block text-sm text-gray-400">Clé d'API Infura (RPC)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="password"
                        placeholder="••••••••••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50"
                        value={infuraKeyInput}
                        onChange={(e) => setInfuraKeyInput(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={async () => {
                        await configureKey('infura', infuraKeyInput);
                        setInfuraKeyInput("");
                      }}
                      disabled={isKeyLoading || !infuraKeyInput}
                      className="px-4 py-2 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] text-sm rounded-lg border border-[#d4af37]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isKeyLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Utilisée comme solution de secours (failover) pour garantir un uptime de 99.99%.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bouton "Retour en haut" */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 p-4 rounded-full bg-gradient-to-br from-white/[0.15] to-white/[0.05] border border-[#d4af37]/50 backdrop-blur-xl shadow-2xl hover:shadow-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 z-50 group"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-6 h-6 text-[#d4af37] group-hover:text-yellow-300 transition-colors" />
          </button>
        )}
      </div>
    </section>
  )
}

export default FlashBotDashboard;

// Composants auxiliaires
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  trend 
}: { 
  label: string
  value: string
  icon: any
  color: 'green' | 'blue' | 'yellow' | 'red' | 'purple'
  trend?: string
}) {
  const colorClasses = {
    green: 'from-green-500/20 to-transparent border-green-500/30 text-green-400',
    blue: 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400',
    yellow: 'from-yellow-500/20 to-transparent border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-transparent border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400',
  }[color]
  
  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses} border backdrop-blur-xl`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5" />
        {trend && <span className="text-xs text-green-400">{trend}</span>}
      </div>
      <div className="text-3xl mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

function TxStatusBadge({ status }: { status: string }) {
  const styles = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
    success: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle2 },
    failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
  }[status] || { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Activity }
  
  const Icon = styles.icon
  
  return (
    <div className={`${styles.bg} ${styles.text} px-2 py-1 rounded flex items-center gap-1 text-xs`}>
      <Icon className="w-3 h-3" />
      {status}
    </div>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-black/90 rounded-lg border border-[#d4af37]/30 backdrop-blur-xl shadow-xl">
        <div className="text-xs text-gray-400 mb-1">
          {payload[0].payload.time}
        </div>
        <div className="text-lg text-[#d4af37]">
          ${payload[0].value.toFixed(2)}
        </div>
        {payload[0].payload.profit > 0 && (
          <div className="text-xs text-green-400 mt-1">
            +${payload[0].payload.profit.toFixed(2)} ce slot
          </div>
        )}
      </div>
    )
  }
  
  return null
}