/**
 * Centre de Commande de l'IA Maître THESORIA
 * 
 * Interface de contrôle ultime pour piloter l'ensemble de la plateforme
 * via une intelligence artificielle superintelligente
 */

import { useState, useRef, useEffect } from "react"
import { 
  Brain, 
  Cpu, 
  Activity, 
  Zap, 
  TrendingUp, 
  Shield, 
  Eye,
  Terminal,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Target,
  Network,
  Database,
  Send,
} from "lucide-react"
import { useAIMaster, formatUptime } from "../hooks/useAIMaster"

export function AICommandCenter() {
  const {
    aiActive,
    aiMode,
    metrics,
    modules,
    recentDecisions,
    activeOptimizations,
    commandHistory,
    capabilities,
    toggleAI,
    setMode,
    executeCommand,
    approveDecision,
    rejectDecision,
    totalOptimizations,
    platformEfficiency,
    profitIncrease,
  } = useAIMaster()
  
  const [commandInput, setCommandInput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const commandInputRef = useRef<HTMLInputElement>(null)
  const consoleEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [commandHistory])
  
  const handleExecuteCommand = async () => {
    if (!commandInput.trim() || isExecuting) return
    
    setIsExecuting(true)
    await executeCommand(commandInput)
    setCommandInput('')
    setIsExecuting(false)
    commandInputRef.current?.focus()
  }
  
  return (
    <section id="ai-master" className="py-32 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37] rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
      </div>
      
      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37]/20 to-blue-500/20 border border-[#d4af37]/30 mb-6">
            <Brain className="w-5 h-5 text-[#d4af37]" />
            <span className="text-sm tracking-wider text-[#d4af37]">INTELLIGENCE ARTIFICIELLE MAÎTRE</span>
          </div>
          
          <h2 className="text-6xl mb-6 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent">
            Centre de Commande Suprême
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Pilotage autonome de l'ensemble de la plateforme THESORIA par une IA superintelligente.
            <br />Optimisation continue • Apprentissage permanent • Contrôle total
          </p>
        </div>
        
        {/* Main Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - AI Status & Metrics */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Core Status */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#d4af37]/20">
                    <Brain className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  Noyau IA
                </h3>
                
                <button
                  onClick={toggleAI}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    aiActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {aiActive ? 'ACTIF' : 'INACTIF'}
                </button>
              </div>
              
              {/* Mode Selection */}
              <div className="space-y-3 mb-6">
                <label className="text-sm text-gray-400">Mode de Fonctionnement</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['manual', 'semi-auto', 'autonomous'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setMode(mode)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        aiMode === mode
                          ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {mode === 'manual' ? 'Manuel' : mode === 'semi-auto' ? 'Semi-Auto' : 'Autonome'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Live Metrics */}
              <div className="space-y-4">
                <MetricBar 
                  label="CPU" 
                  value={metrics.cpuUsage} 
                  max={100}
                  unit="%"
                  color="blue"
                />
                <MetricBar 
                  label="Mémoire" 
                  value={metrics.memoryUsage} 
                  max={100}
                  unit="%"
                  color="purple"
                />
                <MetricBar 
                  label="Confiance" 
                  value={metrics.confidenceScore} 
                  max={100}
                  unit="%"
                  color="gold"
                />
                
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  <StatCard 
                    label="Latence"
                    value={`${metrics.networkLatency.toFixed(0)}ms`}
                    icon={Zap}
                  />
                  <StatCard 
                    label="Décisions/s"
                    value={metrics.decisionsPerSecond.toFixed(0)}
                    icon={Cpu}
                  />
                  <StatCard 
                    label="Uptime"
                    value={formatUptime(metrics.uptime)}
                    icon={Clock}
                  />
                  <StatCard 
                    label="Learning"
                    value={`${(metrics.learningRate * 100).toFixed(1)}%`}
                    icon={Brain}
                  />
                </div>
              </div>
            </div>
            
            {/* Global Stats */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/30">
              <h3 className="text-xl mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                Performance Globale
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Efficacité Plateforme</span>
                    <span className="text-lg text-[#d4af37]">{platformEfficiency.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-300 transition-all duration-1000"
                      style={{ width: `${platformEfficiency}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-lg bg-black/30">
                    <div className="text-sm text-gray-400 mb-1">Optimisations</div>
                    <div className="text-2xl text-white">{totalOptimizations}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/30">
                    <div className="text-sm text-gray-400 mb-1">Profit +</div>
                    <div className="text-2xl text-green-400">+{profitIncrease.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle Column - AI Decisions & Optimizations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Active Optimizations */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl mb-6 flex items-center gap-3">
                <Target className="w-5 h-5 text-[#d4af37]" />
                Optimisations Actives
              </h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {activeOptimizations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aucune optimisation en cours</p>
                  </div>
                ) : (
                  activeOptimizations.map((opt, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-black/30 border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-sm text-white mb-1">{opt.module}</div>
                          <div className="text-xs text-gray-400">{opt.metric}</div>
                        </div>
                        <div className="text-xs text-[#d4af37]">{opt.progress.toFixed(0)}%</div>
                      </div>
                      
                      <div className="h-1.5 bg-black/50 rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-300 transition-all duration-500"
                          style={{ width: `${opt.progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{opt.currentValue.toFixed(1)} → {opt.targetValue.toFixed(1)}</span>
                        <span>{new Date(opt.estimatedCompletion).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* AI Decisions */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl mb-6 flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#d4af37]" />
                Décisions IA Récentes
              </h3>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {recentDecisions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">En attente de décisions...</p>
                  </div>
                ) : (
                  recentDecisions.slice(0, 10).map((decision) => (
                    <div 
                      key={decision.id} 
                      className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-white mb-1">{decision.action}</div>
                          <div className="text-xs text-gray-400">{decision.module}</div>
                        </div>
                        
                        <DecisionStatusBadge status={decision.status} />
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3 leading-relaxed">
                        {decision.reasoning}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImpactBadge impact={decision.impact} />
                          <span className="text-xs text-gray-500">
                            Confiance: {decision.confidence.toFixed(0)}%
                          </span>
                        </div>
                        
                        {decision.status === 'pending' && aiMode === 'semi-auto' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveDecision(decision.id)}
                              className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => rejectDecision(decision.id)}
                              className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {decision.result && (
                        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-green-400">
                          ✓ {decision.result}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Modules & Command Console */}
          <div className="lg:col-span-1 space-y-6">
            {/* Controlled Modules */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl mb-6 flex items-center gap-3">
                <Network className="w-5 h-5 text-[#d4af37]" />
                Modules Contrôlés
              </h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {modules.map((module, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white">{module.name}</div>
                      <ModuleStatusBadge status={module.status} />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            module.performance > 95 ? 'bg-green-400' :
                            module.performance > 90 ? 'bg-[#d4af37]' :
                            'bg-orange-400'
                          }`}
                          style={{ width: `${module.performance}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-12 text-right">
                        {module.performance.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {module.aiControlled ? '🤖 IA' : '👤 Manuel'}
                      </span>
                      <span>{new Date(module.lastOptimization).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* AI Capabilities */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl mb-6 flex items-center gap-3">
                <Database className="w-5 h-5 text-[#d4af37]" />
                Capacités IA
              </h3>
              
              <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto custom-scrollbar">
                {capabilities.slice(0, 6).map((capability) => (
                  <div 
                    key={capability.id}
                    className="p-3 rounded-lg bg-black/30 border border-white/5"
                  >
                    <div className="text-xs text-white mb-1 line-clamp-1">
                      {capability.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-2 rounded-sm ${
                              i < capability.level ? 'bg-[#d4af37]' : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Command Console - Full Width */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-black/50 to-black/30 border border-[#d4af37]/30 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-xl">Console de Commande</h3>
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Connecté</span>
            </div>
          </div>
          
          {/* Console Output */}
          <div className="bg-black/50 rounded-lg p-4 mb-4 h-64 overflow-y-auto custom-scrollbar font-mono text-sm">
            {commandHistory.length === 0 ? (
              <div className="text-gray-500">
                <span className="text-[#d4af37]">THESORIA AI</span> v2.0.0 - Prêt à recevoir vos commandes.
                <br />
                <br />
                Tapez 'status' pour voir l'état du système.
                <br />
                Tapez 'help' pour la liste des commandes.
              </div>
            ) : (
              <div className="space-y-3">
                {commandHistory.slice().reverse().map((cmd) => (
                  <div key={cmd.id}>
                    <div className="text-[#d4af37]">
                      <span className="text-gray-500">$</span> {cmd.command}
                    </div>
                    <div className="text-gray-300 pl-4 mt-1">
                      {cmd.response}
                    </div>
                    <div className="text-xs text-gray-600 pl-4 mt-1">
                      Exécuté en {cmd.executionTime}ms • {new Date(cmd.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
            )}
          </div>
          
          {/* Command Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={commandInputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteCommand()}
                placeholder="Entrez une commande (ex: optimize, scan, status, profit...)"
                disabled={!aiActive || isExecuting}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              />
            </div>
            <button
              onClick={handleExecuteCommand}
              disabled={!aiActive || isExecuting || !commandInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-yellow-600 text-black rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Exécution...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Exécuter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AICommandCenter;

// Composants auxiliaires
function MetricBar({ 
  label, 
  value, 
  max, 
  unit,
  color 
}: { 
  label: string
  value: number
  max: number
  unit: string
  color: 'blue' | 'purple' | 'gold'
}) {
  const percentage = (value / max) * 100
  const colorClass = {
    blue: 'from-blue-500 to-cyan-400',
    purple: 'from-purple-500 to-pink-400',
    gold: 'from-[#d4af37] to-yellow-300',
  }[color]
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-white">{value.toFixed(1)}{unit}</span>
      </div>
      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="p-3 rounded-lg bg-black/30">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-base text-white">{value}</div>
    </div>
  )
}

function DecisionStatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    executing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[status]
  
  const labels = {
    pending: 'En attente',
    executing: 'Exécution',
    completed: 'Terminé',
    failed: 'Échoué',
  }[status]
  
  return (
    <span className={`px-2 py-1 rounded text-xs border ${styles}`}>
      {labels}
    </span>
  )
}

function ImpactBadge({ impact }: { impact: string }) {
  const styles = {
    low: 'bg-gray-500/20 text-gray-400',
    medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-orange-500/20 text-orange-400',
    critical: 'bg-red-500/20 text-red-400',
  }[impact]
  
  const labels = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    critical: 'Critique',
  }[impact]
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles}`}>
      {labels}
    </span>
  )
}

function ModuleStatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-green-500/20 text-green-400',
    idle: 'bg-gray-500/20 text-gray-400',
    optimizing: 'bg-[#d4af37]/20 text-[#d4af37]',
    error: 'bg-red-500/20 text-red-400',
  }[status]
  
  const labels = {
    active: 'Actif',
    idle: 'Repos',
    optimizing: 'Optimisation',
    error: 'Erreur',
  }[status]
  
  return (
    <span className={`px-2 py-1 rounded text-xs ${styles}`}>
      {labels}
    </span>
  )
}