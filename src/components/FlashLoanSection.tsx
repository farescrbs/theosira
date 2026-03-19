import { useState } from "react";
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  AlertCircle, 
  ChevronRight, 
  ArrowRight, 
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Coins,
  Activity,
  Info,
  Download,
  Filter,
  Search,
  Target,
  Flame,
  Users,
  BarChart3
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

interface FlashLoanToken {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  color: string;
  availableLiquidity: number;
  fee: number;
  blockchain: string;
  price: number;
}

interface FlashLoanStrategy {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  riskLevel: 'low' | 'medium' | 'high';
  potentialReturn: string;
}

interface FlashLoanHistory {
  id: string;
  token: string;
  amount: number;
  strategy: string;
  profit: number;
  fee: number;
  status: 'success' | 'failed';
  timestamp: string;
  blockchain: string;
  icon: string;
  color: string;
}

const flashLoanTokens: FlashLoanToken[] = [
  {
    id: '1',
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '💵',
    color: '#26A17B',
    availableLiquidity: 50000000,
    fee: 0.09,
    blockchain: 'Ethereum',
    price: 1.00
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    color: '#627EEA',
    availableLiquidity: 25000,
    fee: 0.09,
    blockchain: 'Ethereum',
    price: 3450.00
  },
  {
    id: '3',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💰',
    color: '#2775CA',
    availableLiquidity: 40000000,
    fee: 0.09,
    blockchain: 'Polygon',
    price: 1.00
  },
  {
    id: '4',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    icon: '◈',
    color: '#F5AC37',
    availableLiquidity: 30000000,
    fee: 0.09,
    blockchain: 'Ethereum',
    price: 1.00
  },
  {
    id: '5',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    icon: '₿',
    color: '#F7931A',
    availableLiquidity: 850,
    fee: 0.09,
    blockchain: 'Ethereum',
    price: 68500.00
  },
  {
    id: '6',
    symbol: 'BNB',
    name: 'Binance Coin',
    icon: '🔶',
    color: '#F3BA2F',
    availableLiquidity: 120000,
    fee: 0.09,
    blockchain: 'BSC',
    price: 625.00
  }
];

const flashLoanStrategies: FlashLoanStrategy[] = [
  {
    id: '1',
    name: 'Arbitrage DEX',
    description: 'Exploiter les différences de prix entre plusieurs échanges décentralisés',
    icon: <TrendingUp className="w-5 h-5" />,
    riskLevel: 'medium',
    potentialReturn: '0.5% - 3%'
  },
  {
    id: '2',
    name: 'Liquidation',
    description: 'Liquider des positions sous-collatéralisées sur les plateformes de prêt',
    icon: <Activity className="w-5 h-5" />,
    riskLevel: 'low',
    potentialReturn: '2% - 8%'
  },
  {
    id: '3',
    name: 'Refinancement Collatéral',
    description: 'Refinancer une dette avec de meilleures conditions sans apport initial',
    icon: <Shield className="w-5 h-5" />,
    riskLevel: 'low',
    potentialReturn: '0.1% - 0.5%'
  },
  {
    id: '4',
    name: 'Arbitrage Tri-DEX',
    description: 'Cycle d\'arbitrage sur trois échanges ou plus pour maximiser les profits',
    icon: <Zap className="w-5 h-5" />,
    riskLevel: 'high',
    potentialReturn: '1% - 5%'
  },
  {
    id: '5',
    name: 'Front-Running',
    description: 'Anticiper et exécuter avant les transactions importantes détectées dans la mempool',
    icon: <Target className="w-5 h-5" />,
    riskLevel: 'high',
    potentialReturn: '3% - 15%'
  },
  {
    id: '6',
    name: 'Back-Running',
    description: 'Profiter des opportunités créées immédiatement après une grande transaction',
    icon: <Flame className="w-5 h-5" />,
    riskLevel: 'medium',
    potentialReturn: '1% - 7%'
  },
  {
    id: '7',
    name: 'Sandwich Attack',
    description: 'Combiner front-running et back-running pour encadrer une transaction cible',
    icon: <Users className="w-5 h-5" />,
    riskLevel: 'high',
    potentialReturn: '5% - 20%'
  },
  {
    id: '8',
    name: 'Liquidation Premium',
    description: 'Liquidation avancée avec bonus de liquidateur sur Aave, Compound, MakerDAO',
    icon: <BarChart3 className="w-5 h-5" />,
    riskLevel: 'medium',
    potentialReturn: '8% - 25%'
  }
];

const mockHistory: FlashLoanHistory[] = [
  {
    id: '1',
    token: 'USDT',
    amount: 500000,
    strategy: 'Arbitrage DEX',
    profit: 8750,
    fee: 450,
    status: 'success',
    timestamp: '2025-12-21 14:23:15',
    blockchain: 'Ethereum',
    icon: '💵',
    color: '#26A17B'
  },
  {
    id: '2',
    token: 'ETH',
    amount: 150,
    strategy: 'Liquidation',
    profit: 15525,
    fee: 465.75,
    status: 'success',
    timestamp: '2025-12-21 12:45:32',
    blockchain: 'Ethereum',
    icon: '⟠',
    color: '#627EEA'
  },
  {
    id: '3',
    token: 'USDC',
    amount: 1000000,
    strategy: 'Arbitrage Tri-DEX',
    profit: 0,
    fee: 900,
    status: 'failed',
    timestamp: '2025-12-21 10:18:47',
    blockchain: 'Polygon',
    icon: '💰',
    color: '#2775CA'
  },
  {
    id: '4',
    token: 'DAI',
    amount: 750000,
    strategy: 'Refinancement Collatéral',
    profit: 2250,
    fee: 675,
    status: 'success',
    timestamp: '2025-12-20 18:56:21',
    blockchain: 'Ethereum',
    icon: '◈',
    color: '#F5AC37'
  }
];

export function FlashLoanSection() {
  const [activeTab, setActiveTab] = useState<'borrow' | 'history'>('borrow');
  const [selectedToken, setSelectedToken] = useState<FlashLoanToken | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<FlashLoanStrategy | null>(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showStrategyInfo, setShowStrategyInfo] = useState(false);
  
  // History filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBlockchain, setFilterBlockchain] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStrategy, setFilterStrategy] = useState('all');

  const handleExecuteFlashLoan = () => {
    setShowExecuteDialog(true);
  };
  
  const handleExecuteConfirm = () => {
    setShowExecuteDialog(false);
    
    // Show loading toast
    toast.loading('Exécution du Flash Loan en cours...', { 
      id: 'flash-loan-exec',
      duration: 2000 
    });
    
    setTimeout(() => {
      // Simulate successful execution
      const estimatedProfit = parseFloat(loanAmount) * 0.025; // 2.5% profit estimation
      const profitUSD = selectedToken ? estimatedProfit * selectedToken.price : 0;
      
      toast.success(`Flash Loan exécuté avec succès ! 🎉`, {
        id: 'flash-loan-exec',
        description: `Profit estimé: $${profitUSD.toFixed(2)}`,
        duration: 5000,
      });
      
      // Reset form
      setLoanAmount('');
      setSelectedToken(null);
      setSelectedStrategy(null);
    }, 2000);
  };
  
  const exportToCSV = () => {
    const headers = ['ID', 'Token', 'Montant', 'Stratégie', 'Profit ($)', 'Frais ($)', 'Statut', 'Date/Heure', 'Blockchain'];
    const rows = filteredHistory.map(loan => [
      loan.id,
      loan.token,
      loan.amount.toString(),
      loan.strategy,
      loan.profit.toString(),
      loan.fee.toString(),
      loan.status,
      loan.timestamp,
      loan.blockchain
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `flash-loans-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Export CSV réussi !', {
      description: `${filteredHistory.length} transactions exportées`,
      duration: 3000,
    });
  };
  
  // Filter history
  const filteredHistory = mockHistory.filter(loan => {
    const matchesSearch = loan.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.strategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.amount.toString().includes(searchQuery);
    const matchesBlockchain = filterBlockchain === 'all' || loan.blockchain === filterBlockchain;
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    const matchesStrategy = filterStrategy === 'all' || loan.strategy === filterStrategy;
    
    return matchesSearch && matchesBlockchain && matchesStatus && matchesStrategy;
  });
  
  // Calculate stats
  const totalTrades = mockHistory.length;
  const successfulTrades = mockHistory.filter(l => l.status === 'success').length;
  const winRate = ((successfulTrades / totalTrades) * 100).toFixed(1);
  const totalProfit = mockHistory.reduce((sum, l) => sum + (l.status === 'success' ? l.profit : 0), 0);
  const avgProfit = totalProfit / successfulTrades;

  const calculateFee = () => {
    if (!selectedToken || !loanAmount) return 0;
    return (parseFloat(loanAmount) * selectedToken.fee) / 100;
  };

  const calculateTotal = () => {
    if (!loanAmount) return 0;
    return parseFloat(loanAmount) + calculateFee();
  };

  return (
    <section className="relative py-32 overflow-hidden" id="flashloan">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37]/5 to-transparent border border-[#d4af37]/20 mb-8">
            <Zap className="w-5 h-5 text-[#d4af37]" />
            <span className="text-[#d4af37] tracking-[0.2em] uppercase text-sm">Flash Loans Premium</span>
          </div>
          
          <h2 className="text-6xl mb-6 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Prêts Instantanés
          </h2>
          
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Empruntez des millions sans collatéral. Arbitrage, liquidations et stratégies DeFi avancées.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
            {[
              { label: 'Liquidité Disponible', value: '$175M+', icon: <Coins className="w-5 h-5" /> },
              { label: 'Frais Flash Loan', value: '0.09%', icon: <Percent className="w-5 h-5" /> },
              { label: 'Temps d\'Exécution', value: '<15s', icon: <Clock className="w-5 h-5" /> },
              { label: 'Taux de Succès', value: '94.7%', icon: <CheckCircle className="w-5 h-5" /> }
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.6s ease' }} />
                <div className="relative p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
                  <div className="text-[#d4af37] mb-3">{stat.icon}</div>
                  <div className="text-3xl mb-2 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/50 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'borrow' | 'history')} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
                <TabsTrigger 
                  value="borrow" 
                  className="px-8 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37]/20 data-[state=active]:to-[#d4af37]/5 data-[state=active]:text-[#d4af37] data-[state=active]:border data-[state=active]:border-[#d4af37]/30 text-white/60"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Flash Loan
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="px-8 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37]/20 data-[state=active]:to-[#d4af37]/5 data-[state=active]:text-[#d4af37] data-[state=active]:border data-[state=active]:border-[#d4af37]/30 text-white/60"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Historique
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Flash Loan Tab */}
            <TabsContent value="borrow" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Token Selection & Strategy */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Token Selection */}
                  <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Sélectionner un Token
                      </h3>
                      <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] bg-[#d4af37]/5">
                        {flashLoanTokens.length} Disponibles
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {flashLoanTokens.map((token) => (
                        <button
                          key={token.id}
                          onClick={() => setSelectedToken(token)}
                          className={`relative group p-6 rounded-2xl border text-left ${
                            selectedToken?.id === token.id
                              ? 'border-[#d4af37]/50 bg-gradient-to-br from-[#d4af37]/10 to-transparent'
                              : 'border-white/5 bg-black/20 hover:border-[#d4af37]/30'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{token.icon}</div>
                              <div>
                                <div className="text-lg text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {token.symbol}
                                </div>
                                <div className="text-xs text-white/40">{token.name}</div>
                              </div>
                            </div>
                            {selectedToken?.id === token.id && (
                              <CheckCircle className="w-5 h-5 text-[#d4af37]" />
                            )}
                          </div>

                          <div className="space-y-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            <div className="flex justify-between text-white/60">
                              <span>Liquidité:</span>
                              <span className="text-white">
                                {token.availableLiquidity.toLocaleString()} {token.symbol}
                              </span>
                            </div>
                            <div className="flex justify-between text-white/60">
                              <span>Frais:</span>
                              <span className="text-[#d4af37]">{token.fee}%</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                              <span>Blockchain:</span>
                              <span className="text-white">{token.blockchain}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strategy Selection */}
                  <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Stratégie DeFi
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowStrategyInfo(true)}
                        className="text-[#d4af37] hover:text-[#d4af37]/80"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        En savoir plus
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {flashLoanStrategies.map((strategy) => (
                        <button
                          key={strategy.id}
                          onClick={() => setSelectedStrategy(strategy)}
                          className={`relative group w-full p-6 rounded-2xl border text-left ${
                            selectedStrategy?.id === strategy.id
                              ? 'border-[#d4af37]/50 bg-gradient-to-br from-[#d4af37]/10 to-transparent'
                              : 'border-white/5 bg-black/20 hover:border-[#d4af37]/30'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-[#d4af37] mt-1">{strategy.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-lg text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    {strategy.name}
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      strategy.riskLevel === 'low' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                      strategy.riskLevel === 'medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' :
                                      'border-red-500/30 text-red-400 bg-red-500/5'
                                    }`}
                                  >
                                    {strategy.riskLevel === 'low' ? 'Risque Faible' :
                                     strategy.riskLevel === 'medium' ? 'Risque Moyen' : 'Risque Élevé'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-white/60 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {strategy.description}
                                </p>
                                <div className="text-sm text-[#d4af37]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  Rendement potentiel: {strategy.potentialReturn}
                                </div>
                              </div>
                            </div>
                            {selectedStrategy?.id === strategy.id && (
                              <CheckCircle className="w-5 h-5 text-[#d4af37] ml-4" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Execution Panel */}
                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 sticky top-8">
                    <h3 className="text-2xl mb-8 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Exécution
                    </h3>

                    <div className="space-y-6">
                      {/* Token Display */}
                      <div>
                        <label className="block text-sm text-white/60 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Token Sélectionné
                        </label>
                        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                          {selectedToken ? (
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{selectedToken.icon}</span>
                              <div>
                                <div className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {selectedToken.symbol}
                                </div>
                                <div className="text-xs text-white/40">{selectedToken.blockchain}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-white/40 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Aucun token sélectionné
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Amount Input */}
                      <div>
                        <label className="block text-sm text-white/60 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Montant à Emprunter
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            placeholder="0.00"
                            disabled={!selectedToken}
                            className="bg-black/40 border-white/10 text-white text-xl pr-20 h-16 rounded-xl"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          />
                          {selectedToken && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                              {selectedToken.symbol}
                            </div>
                          )}
                        </div>
                        {selectedToken && (
                          <button
                            onClick={() => setLoanAmount(selectedToken.availableLiquidity.toString())}
                            className="text-xs text-[#d4af37] mt-2 hover:text-[#d4af37]/80"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            Max: {selectedToken.availableLiquidity.toLocaleString()} {selectedToken.symbol}
                          </button>
                        )}
                      </div>

                      {/* Strategy Display */}
                      <div>
                        <label className="block text-sm text-white/60 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Stratégie
                        </label>
                        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                          {selectedStrategy ? (
                            <div className="flex items-center gap-3">
                              <div className="text-[#d4af37]">{selectedStrategy.icon}</div>
                              <div className="text-white text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {selectedStrategy.name}
                              </div>
                            </div>
                          ) : (
                            <div className="text-white/40 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Aucune stratégie sélectionnée
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fee Calculation */}
                      {selectedToken && loanAmount && (
                        <div className="p-6 rounded-xl border border-[#d4af37]/20 bg-gradient-to-br from-[#d4af37]/5 to-transparent space-y-3">
                          <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            <span className="text-white/60">Montant emprunté:</span>
                            <span className="text-white">{parseFloat(loanAmount).toLocaleString()} {selectedToken.symbol}</span>
                          </div>
                          <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            <span className="text-white/60">Frais ({selectedToken.fee}%):</span>
                            <span className="text-[#d4af37]">{calculateFee().toFixed(4)} {selectedToken.symbol}</span>
                          </div>
                          <div className="h-px bg-white/10 my-2" />
                          <div className="flex justify-between" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            <span className="text-white">Total à rembourser:</span>
                            <span className="text-white">{calculateTotal().toLocaleString()} {selectedToken.symbol}</span>
                          </div>
                        </div>
                      )}

                      {/* Warning */}
                      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-200/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Le flash loan doit être remboursé dans la même transaction blockchain, sinon l'opération échouera entièrement.
                          </div>
                        </div>
                      </div>

                      {/* Execute Button */}
                      <Button
                        onClick={handleExecuteFlashLoan}
                        disabled={!selectedToken || !selectedStrategy || !loanAmount || parseFloat(loanAmount) <= 0}
                        className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:from-[#f4d03f] hover:to-[#d4af37] rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Exécuter le Flash Loan
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Historique des Flash Loans
                    </h3>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        94.7% Succès
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="p-8 border-b border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher token, stratégie, montant..."
                        className="bg-black/40 border-white/10 text-white pl-10 h-10 rounded-xl"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      />
                    </div>
                    
                    {/* Blockchain Filter */}
                    <Select value={filterBlockchain} onValueChange={setFilterBlockchain}>
                      <SelectTrigger className="bg-black/40 border-white/10 text-white h-10 rounded-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <SelectValue>{filterBlockchain === 'all' ? 'Toutes blockchains' : filterBlockchain}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-white/10">
                        <SelectItem value="all">Toutes blockchains</SelectItem>
                        <SelectItem value="Ethereum">Ethereum</SelectItem>
                        <SelectItem value="Polygon">Polygon</SelectItem>
                        <SelectItem value="BSC">BSC</SelectItem>
                        <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Status Filter */}
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="bg-black/40 border-white/10 text-white h-10 rounded-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <SelectValue>{filterStatus === 'all' ? 'Tous statuts' : filterStatus === 'success' ? 'Succès' : 'Échoué'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-white/10">
                        <SelectItem value="all">Tous statuts</SelectItem>
                        <SelectItem value="success">Succès</SelectItem>
                        <SelectItem value="failed">Échoué</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Export Button */}
                    <Button
                      onClick={exportToCSV}
                      variant="outline"
                      className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 h-10 rounded-xl"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  {/* Advanced Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                      <div className="text-xs text-white/40 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total Trades</div>
                      <div className="text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{totalTrades}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                      <div className="text-xs text-white/40 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Win Rate</div>
                      <div className="text-xl text-green-400" style={{ fontFamily: 'Playfair Display, serif' }}>{winRate}%</div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                      <div className="text-xs text-white/40 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Profit Total</div>
                      <div className="text-xl text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>${totalProfit.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                      <div className="text-xs text-white/40 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Profit Moyen</div>
                      <div className="text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>${avgProfit.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* History List */}
                <div className="divide-y divide-white/5">
                  {filteredHistory.map((loan) => (
                    <div key={loan.id} className="p-6 hover:bg-white/[0.02] group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 flex-1">
                          {/* Token */}
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{loan.icon}</div>
                            <div>
                              <div className="text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {loan.amount.toLocaleString()} {loan.token}
                              </div>
                              <div className="text-xs text-white/40">{loan.blockchain}</div>
                            </div>
                          </div>

                          {/* Strategy */}
                          <div className="flex-1">
                            <div className="text-sm text-white/60 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {loan.strategy}
                            </div>
                            <div className="text-xs text-white/40">{loan.timestamp}</div>
                          </div>

                          {/* Profit/Loss */}
                          <div className="text-right">
                            <div className={`text-lg mb-1 ${loan.profit > 0 ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {loan.profit > 0 ? '+' : ''}{loan.profit > 0 ? `$${loan.profit.toLocaleString()}` : '-'}
                            </div>
                            <div className="text-xs text-white/40">
                              Frais: ${loan.fee.toLocaleString()}
                            </div>
                          </div>

                          {/* Status */}
                          <div>
                            {loan.status === 'success' ? (
                              <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5">
                                <CheckCircle className="w-3 h-3 mr-2" />
                                Succès
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">
                                <XCircle className="w-3 h-3 mr-2" />
                                Échoué
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#d4af37] ml-4" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All */}
                <div className="p-6 border-t border-white/10">
                  <Button
                    variant="ghost"
                    className="w-full text-[#d4af37] hover:text-[#d4af37]/80 hover:bg-[#d4af37]/5"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Voir tout l'historique
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Execute Dialog */}
      <Dialog open={showExecuteDialog} onOpenChange={setShowExecuteDialog}>
        <DialogContent className="bg-black/95 border border-[#d4af37]/30 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Zap className="w-6 h-6 text-[#d4af37]" />
              Confirmer le Flash Loan
            </DialogTitle>
            <DialogDescription className="text-white/60 pt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Vous êtes sur le point d'exécuter un flash loan. Vérifiez les détails ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {selectedToken && loanAmount && selectedStrategy && (
              <>
                <div className="p-6 rounded-xl border border-white/10 bg-black/40 space-y-4">
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="text-white/60">Token:</span>
                    <span className="text-white flex items-center gap-2">
                      <span className="text-xl">{selectedToken.icon}</span>
                      {selectedToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="text-white/60">Montant:</span>
                    <span className="text-white">{parseFloat(loanAmount).toLocaleString()} {selectedToken.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="text-white/60">Stratégie:</span>
                    <span className="text-white">{selectedStrategy.name}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="text-white/60">Frais:</span>
                    <span className="text-[#d4af37]">{calculateFee().toFixed(4)} {selectedToken.symbol}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="text-white">Total à rembourser:</span>
                    <span className="text-white">{calculateTotal().toLocaleString()} {selectedToken.symbol}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-200/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <strong>Avertissement:</strong> Si la transaction échoue ou si le montant n'est pas remboursé dans la même transaction, vous perdrez les frais de gas.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowExecuteDialog(false)}
                    className="flex-1 border-white/10 text-white hover:bg-white/5"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleExecuteConfirm}
                    className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:from-[#f4d03f] hover:to-[#d4af37]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Exécuter
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Strategy Info Dialog */}
      <Dialog open={showStrategyInfo} onOpenChange={setShowStrategyInfo}>
        <DialogContent className="bg-black/95 border border-[#d4af37]/30 backdrop-blur-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Info className="w-6 h-6 text-[#d4af37]" />
              Stratégies Flash Loan
            </DialogTitle>
            <DialogDescription className="text-white/60 pt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Comprendre les différentes stratégies de flash loans disponibles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6 max-h-[60vh] overflow-y-auto">
            {flashLoanStrategies.map((strategy) => (
              <div key={strategy.id} className="p-6 rounded-xl border border-white/10 bg-black/40">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-[#d4af37]">{strategy.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {strategy.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          strategy.riskLevel === 'low' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                          strategy.riskLevel === 'medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' :
                          'border-red-500/30 text-red-400 bg-red-500/5'
                        }`}
                      >
                        {strategy.riskLevel === 'low' ? 'Risque Faible' :
                         strategy.riskLevel === 'medium' ? 'Risque Moyen' : 'Risque Élevé'}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {strategy.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/40">Rendement potentiel:</span>
                      <span className="text-[#d4af37]">{strategy.potentialReturn}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}