import { useState } from "react";
import { 
  Bot, 
  TrendingUp, 
  Settings, 
  Activity, 
  BarChart3,
  Power,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Percent,
  Target,
  Shield,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Play,
  RefreshCw,
  Eye,
  TrendingDown,
  Brain
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { useFlashLoanBot } from "../hooks/useFlashLoanBot";

export function FlashLoanBotSection() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'strategies' | 'config'>('dashboard');
  
  // Utiliser le hook personnalisé pour le bot
  const {
    botActive,
    strategies,
    config,
    recentTrades,
    opportunities,
    currentOperation,
    totalProfit,
    successRate,
    activeStrategiesCount,
    toggleBot,
    toggleStrategy,
    updateConfig,
    executeFlashLoan,
    sdk,
  } = useFlashLoanBot();

  return (
    <section className="relative py-32 overflow-hidden" id="flashloan-bot">
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
            <Bot className="w-5 h-5 text-[#d4af37]" />
            <span className="text-[#d4af37] tracking-[0.2em] uppercase text-sm">Intelligence Artificielle</span>
          </div>
          
          <h2 className="text-6xl mb-6 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Robot Flash Loan
          </h2>
          
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Automatisez vos stratégies de flash loan avec notre IA avancée. Trading 24/7 sans intervention humaine.
          </p>

          {/* Bot Status Banner */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 to-transparent rounded-3xl blur-xl" />
              <div className="relative p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                        botActive 
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30' 
                          : 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-500/30'
                      }`}>
                        <Bot className={`w-10 h-10 ${botActive ? 'text-green-400' : 'text-gray-400'}`} />
                      </div>
                      {botActive && (
                        <div className="absolute -top-1 -right-1">
                          <span className="flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Bot Status
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`${
                            botActive 
                              ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                              : 'border-gray-500/30 text-gray-400 bg-gray-500/10'
                          }`}
                        >
                          {botActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {botActive 
                          ? 'Le robot surveille activement les opportunités sur 65 blockchains' 
                          : 'Le robot est en pause - Aucune transaction n\'est effectuée'}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => toggleBot()}
                    className={`h-14 px-8 rounded-xl text-base ${
                      botActive
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        : 'bg-gradient-to-r from-[#d4af37] to-[#f4d03f] hover:from-[#f4d03f] hover:to-[#d4af37] text-black'
                    }`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {botActive ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Arrêter le Bot
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Démarrer le Bot
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
            {[
              { 
                label: 'Profit 24h', 
                value: `$${totalProfit.toLocaleString()}`, 
                icon: <DollarSign className="w-5 h-5" />,
                trend: '+12.5%',
                positive: true
              },
              { 
                label: 'Taux de Succès', 
                value: `${successRate}%`, 
                icon: <Target className="w-5 h-5" />,
                trend: '+2.3%',
                positive: true
              },
              { 
                label: 'Trades Actifs', 
                value: activeStrategiesCount.toString(), 
                icon: <Activity className="w-5 h-5" />,
                trend: '4/4',
                positive: true
              },
              { 
                label: 'Dernière Opération', 
                value: '2 min', 
                icon: <Clock className="w-5 h-5" />,
                trend: 'En cours',
                positive: true
              }
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.6s ease' }} />
                <div className="relative p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[#d4af37]">{stat.icon}</div>
                    <div className={`flex items-center gap-1 text-xs ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </div>
                  </div>
                  <div className="text-3xl mb-1 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
                <TabsTrigger 
                  value="dashboard" 
                  className="px-8 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37]/20 data-[state=active]:to-[#d4af37]/5 data-[state=active]:text-[#d4af37] data-[state=active]:border data-[state=active]:border-[#d4af37]/30 text-white/60"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="strategies" 
                  className="px-8 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37]/20 data-[state=active]:to-[#d4af37]/5 data-[state=active]:text-[#d4af37] data-[state=active]:border data-[state=active]:border-[#d4af37]/30 text-white/60"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Stratégies
                </TabsTrigger>
                <TabsTrigger 
                  value="config" 
                  className="px-8 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37]/20 data-[state=active]:to-[#d4af37]/5 data-[state=active]:text-[#d4af37] data-[state=active]:border data-[state=active]:border-[#d4af37]/30 text-white/60"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuration
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Trades */}
                <div className="lg:col-span-2">
                  <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                      <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Trades Récents
                      </h3>
                      <Button variant="ghost" size="sm" className="text-[#d4af37] hover:text-[#d4af37]/80">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir tout
                      </Button>
                    </div>

                    <div className="divide-y divide-white/5">
                      {recentTrades.length > 0 ? (
                        recentTrades.slice(0, 5).map((trade) => (
                          <div key={trade.id} className="p-6 hover:bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6 flex-1">
                                {/* Status Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  trade.status === 'success' 
                                    ? 'bg-green-500/10 border border-green-500/30' 
                                    : 'bg-red-500/10 border border-red-500/30'
                                }`}>
                                  {trade.status === 'success' ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                  ) : (
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                  )}
                                </div>

                                {/* Trade Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                      {trade.strategy}
                                    </span>
                                    <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] bg-[#d4af37]/5 text-xs">
                                      {trade.blockchain}
                                    </Badge>
                                    {trade.txHash && (
                                      <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 text-xs">
                                        Confirmé
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-white/40">
                                    <span>{new Date(trade.timestamp).toLocaleTimeString('fr-FR')}</span>
                                    <span>•</span>
                                    <span>{trade.amount.toLocaleString()} {trade.token}</span>
                                    <span>•</span>
                                    <span>{trade.duration}s</span>
                                    {trade.flashLoanFee && (
                                      <>
                                        <span>•</span>
                                        <span>Fee: {trade.flashLoanFee.toFixed(4)} ETH</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Profit */}
                                <div className="text-right">
                                  <div className={`text-xl mb-1 ${
                                    trade.profit > 0 ? 'text-green-400' : 'text-red-400'
                                  }`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    {trade.profit > 0 ? '+' : ''}{trade.profit > 0 ? `$${trade.profit.toLocaleString()}` : '$0'}
                                  </div>
                                  <div className="text-xs text-white/40">
                                    {trade.status === 'success' ? 'Profit' : 'Échec'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center">
                          <Activity className="w-12 h-12 text-white/20 mx-auto mb-4" />
                          <p className="text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Aucun trade exécuté. Démarrez le bot pour commencer.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opportunités en Temps Réel */}
                  {botActive && opportunities.length > 0 && (
                    <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden mt-8">
                      <div className="p-8 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Opportunités Détectées
                          </h3>
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#d4af37] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d4af37]"></span>
                          </span>
                        </div>
                        <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] bg-[#d4af37]/10">
                          {opportunities.length} en cours
                        </Badge>
                      </div>

                      <div className="divide-y divide-white/5">
                        {opportunities.slice(0, 3).map((opp) => (
                          <div key={opp.id} className="p-6 hover:bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center">
                                  <TrendingUp className="w-6 h-6 text-[#d4af37]" />
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                      {opp.fromDex} → {opp.toDex}
                                    </span>
                                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-xs">
                                      +{opp.profitPercentage.toFixed(2)}%
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-white/40">
                                    <span>{opp.type === 'dex' ? 'Arbitrage DEX' : opp.type === 'liquidation' ? 'Liquidation' : opp.type === 'triangular' ? 'Triangular' : 'MEV'}</span>
                                    <span>•</span>
                                    <span>Flash Loan: {opp.flashLoanRequired ? 'Requis' : 'Non requis'}</span>
                                    <span>•</span>
                                    <span>{new Date(opp.timestamp).toLocaleTimeString('fr-FR')}</span>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="text-xl text-emerald-400 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    ${opp.estimatedProfit.toLocaleString()}
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => executeFlashLoan(opp)}
                                    disabled={currentOperation?.status === 'pending'}
                                    className="h-8 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:from-[#f4d03f] hover:to-[#d4af37] text-xs"
                                  >
                                    <Zap className="w-3 h-3 mr-1" />
                                    Exécuter
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opération en Cours */}
                  {currentOperation && (
                    <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent p-8 mt-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                          {currentOperation.status === 'pending' && <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />}
                          {currentOperation.status === 'confirmed' && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                          {currentOperation.status === 'failed' && <AlertTriangle className="w-6 h-6 text-red-400" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {currentOperation.status === 'pending' && 'Flash Loan en Cours'}
                            {currentOperation.status === 'confirmed' && 'Flash Loan Réussi'}
                            {currentOperation.status === 'failed' && 'Flash Loan Échoué'}
                          </h4>
                          <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {currentOperation.status === 'pending' && 'Exécution de la transaction sur la blockchain...'}
                            {currentOperation.status === 'confirmed' && `Transaction confirmée: ${currentOperation.txHash?.substring(0, 10)}...`}
                            {currentOperation.status === 'failed' && `Erreur: ${currentOperation.error || 'Transaction échouée'}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Stats */}
                <div className="space-y-6">
                  {/* Performance Overview */}
                  <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
                    <h3 className="text-xl mb-6 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Performance
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Profit Total
                          </span>
                          <span className="text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            +{((totalProfit / 10000) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-3xl text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          ${totalProfit.toLocaleString()}
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] rounded-full"
                            style={{ width: '73%' }}
                          />
                        </div>
                      </div>

                      <div className="h-px bg-white/10" />

                      <div className="space-y-4">
                        {[
                          { label: 'Trades Réussis', value: '847', color: 'text-green-400' },
                          { label: 'Trades Échoués', value: '38', color: 'text-red-400' },
                          { label: 'En Attente', value: '12', color: 'text-yellow-400' },
                          { label: 'Profit Moyen', value: '$3,250', color: 'text-[#d4af37]' }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {item.label}
                            </span>
                            <span className={`${item.color}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Strategies */}
                  <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
                    <h3 className="text-xl mb-6 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Stratégies Actives
                    </h3>

                    <div className="space-y-4">
                      {strategies.filter(s => s.enabled).map((strategy) => (
                        <div key={strategy.id} className="p-4 rounded-xl border border-white/5 bg-black/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {strategy.name}
                            </span>
                            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5 text-xs">
                              Actif
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/40">
                            <span>{strategy.totalTrades} trades</span>
                            <span>{strategy.successRate}% succès</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Strategies Tab */}
            <TabsContent value="strategies" className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
                <div className="mb-8">
                  <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Gestion des Stratégies
                  </h3>
                  <p className="text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Activez ou désactivez les stratégies de trading automatique selon vos préférences
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {strategies.map((strategy) => (
                    <div 
                      key={strategy.id} 
                      className={`relative p-8 rounded-2xl border ${
                        strategy.enabled 
                          ? 'border-[#d4af37]/50 bg-gradient-to-br from-[#d4af37]/10 to-transparent' 
                          : 'border-white/5 bg-black/20'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h4 className="text-xl text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {strategy.name}
                          </h4>
                          <p className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {strategy.description}
                          </p>
                        </div>
                        <Switch
                          checked={strategy.enabled}
                          onCheckedChange={() => toggleStrategy(strategy.id)}
                          className="data-[state=checked]:bg-[#d4af37]"
                        />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl border border-white/5 bg-black/20">
                          <div className="text-xs text-white/40 mb-1">Taux de Succès</div>
                          <div className="text-xl text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {strategy.successRate}%
                          </div>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-black/20">
                          <div className="text-xs text-white/40 mb-1">Total Trades</div>
                          <div className="text-xl text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {strategy.totalTrades}
                          </div>
                        </div>
                      </div>

                      {/* Parameters */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Profit Minimum
                            </span>
                            <span className="text-[#d4af37]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {strategy.minProfit}%
                            </span>
                          </div>
                          <Slider
                            value={[strategy.minProfit]}
                            min={0}
                            max={5}
                            step={0.1}
                            disabled={!strategy.enabled}
                            className="[&_[role=slider]]:bg-[#d4af37] [&_[role=slider]]:border-[#d4af37]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Risque Maximum
                            </span>
                            <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {strategy.maxRisk}/5
                            </span>
                          </div>
                          <Slider
                            value={[strategy.maxRisk]}
                            min={1}
                            max={5}
                            step={1}
                            disabled={!strategy.enabled}
                            className="[&_[role=slider]]:bg-[#d4af37] [&_[role=slider]]:border-[#d4af37]"
                          />
                        </div>
                      </div>

                      {/* Last Execution */}
                      {strategy.lastExecution && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            <span>Dernière exécution: {strategy.lastExecution}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="config" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
                  <h3 className="text-2xl text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Paramètres Généraux
                  </h3>

                  <div className="space-y-8">
                    {/* Max Loan Amount */}
                    <div>
                      <label className="block text-sm text-white/60 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Montant Maximum par Flash Loan
                      </label>
                      <Input
                        type="number"
                        value={config.maxLoanAmount}
                        onChange={(e) => updateConfig({...config, maxLoanAmount: parseFloat(e.target.value)})}
                        className="bg-black/40 border-white/10 text-white h-14 text-xl"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      />
                      <p className="text-xs text-white/40 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Limite de sécurité pour chaque transaction
                      </p>
                    </div>

                    {/* Min Profit Threshold */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Seuil de Profit Minimum
                        </label>
                        <span className="text-[#d4af37]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {config.minProfitThreshold}%
                        </span>
                      </div>
                      <Slider
                        value={[config.minProfitThreshold]}
                        onValueChange={(value) => updateConfig({...config, minProfitThreshold: value[0]})}
                        min={0}
                        max={5}
                        step={0.1}
                        className="[&_[role=slider]]:bg-[#d4af37] [&_[role=slider]]:border-[#d4af37]"
                      />
                      <p className="text-xs text-white/40 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Le bot n'exécutera que les trades avec un profit supérieur à ce seuil
                      </p>
                    </div>

                    {/* Max Gas Price */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Prix du Gas Maximum (Gwei)
                        </label>
                        <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {config.maxGasPrice}
                        </span>
                      </div>
                      <Slider
                        value={[config.maxGasPrice]}
                        onValueChange={(value) => updateConfig({...config, maxGasPrice: value[0]})}
                        min={10}
                        max={300}
                        step={10}
                        className="[&_[role=slider]]:bg-[#d4af37] [&_[role=slider]]:border-[#d4af37]"
                      />
                      <p className="text-xs text-white/40 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Refuser les transactions si le gas dépasse ce prix
                      </p>
                    </div>

                    {/* Risk Level */}
                    <div>
                      <label className="block text-sm text-white/60 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Niveau de Risque Global
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'conservative', label: 'Conservateur', icon: <Shield className="w-4 h-4" /> },
                          { value: 'balanced', label: 'Équilibré', icon: <Activity className="w-4 h-4" /> },
                          { value: 'aggressive', label: 'Agressif', icon: <Zap className="w-4 h-4" /> }
                        ].map((risk) => (
                          <button
                            key={risk.value}
                            onClick={() => updateConfig({...config, riskLevel: risk.value as any})}
                            className={`p-4 rounded-xl border text-center ${
                              config.riskLevel === risk.value
                                ? 'border-[#d4af37]/50 bg-gradient-to-br from-[#d4af37]/10 to-transparent'
                                : 'border-white/5 bg-black/20 hover:border-[#d4af37]/30'
                            }`}
                          >
                            <div className="flex justify-center mb-2 text-[#d4af37]">
                              {risk.icon}
                            </div>
                            <div className="text-sm text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {risk.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-8">
                  {/* Automation */}
                  <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
                    <h3 className="text-2xl text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Automatisation
                    </h3>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20">
                        <div className="flex-1">
                          <div className="text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Redémarrage Automatique
                          </div>
                          <div className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Redémarre le bot automatiquement après un arrêt
                          </div>
                        </div>
                        <Switch
                          checked={config.autoRestart}
                          onCheckedChange={(checked) => updateConfig({...config, autoRestart: checked})}
                          className="data-[state=checked]:bg-[#d4af37]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20">
                        <div className="flex-1">
                          <div className="text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Notifications Push
                          </div>
                          <div className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Recevoir des alertes pour chaque trade
                          </div>
                        </div>
                        <Switch
                          checked={config.notifications}
                          onCheckedChange={(checked) => updateConfig({...config, notifications: checked})}
                          className="data-[state=checked]:bg-[#d4af37]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Warning */}
                  <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-8">
                    <div className="flex gap-4">
                      <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                      <div>
                        <h4 className="text-xl text-amber-400 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Avertissement de Sécurité
                        </h4>
                        <p className="text-sm text-amber-200/80 leading-relaxed mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Le trading automatique comporte des risques importants. Ne confiez au bot que des fonds que vous pouvez vous permettre de perdre. Les performances passées ne garantissent pas les résultats futurs.
                        </p>
                        <ul className="space-y-2 text-xs text-amber-200/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          <li>• Surveillez régulièrement les performances du bot</li>
                          <li>• Ajustez les paramètres selon les conditions du marché</li>
                          <li>• Maintenez toujours une réserve de liquidités</li>
                          <li>• Testez les nouvelles stratégies avec de petits montants</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
                    className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:from-[#f4d03f] hover:to-[#d4af37] rounded-xl text-base"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Sauvegarder la Configuration
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export default FlashLoanBotSection;