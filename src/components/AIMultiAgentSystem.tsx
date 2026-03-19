/**
 * Système Multi-Agents IA
 * 
 * Plusieurs IA spécialisées qui collaborent pour optimiser
 * différents aspects de la plateforme
 */

import { useState, useEffect } from "react"
import { Users, Brain, TrendingUp, Shield, Zap, Target, Activity, MessageSquare } from "lucide-react"

interface Agent {
  id: string
  name: string
  role: string
  specialty: string
  status: 'idle' | 'working' | 'collaborating' | 'completed'
  performance: number
  tasksCompleted: number
  currentTask: string
  icon: any
  color: string
}

interface Collaboration {
  id: string
  timestamp: string
  agents: string[]
  objective: string
  result: string
  improvement: number
}

export function AIMultiAgentSystem({ aiActive }: { aiActive: boolean }) {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-alpha',
      name: 'Agent Alpha',
      role: 'Stratégiste Principal',
      specialty: 'Trading & Arbitrage',
      status: 'working',
      performance: 97.3,
      tasksCompleted: 1247,
      currentTask: 'Optimisation stratégie multi-DEX',
      icon: Brain,
      color: 'from-[#d4af37] to-yellow-600',
    },
    {
      id: 'agent-beta',
      name: 'Agent Beta',
      role: 'Analyste de Risque',
      specialty: 'Sécurité & Protection',
      status: 'working',
      performance: 99.1,
      tasksCompleted: 2103,
      currentTask: 'Scan des vulnérabilités smart contracts',
      icon: Shield,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'agent-gamma',
      name: 'Agent Gamma',
      role: 'Optimiseur Performance',
      specialty: 'Gas & Vitesse',
      status: 'working',
      performance: 95.8,
      tasksCompleted: 1834,
      currentTask: 'Réduction frais de gas cross-chain',
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'agent-delta',
      name: 'Agent Delta',
      role: 'Prédicteur de Marché',
      specialty: 'ML & Prédictions',
      status: 'working',
      performance: 94.2,
      tasksCompleted: 987,
      currentTask: 'Analyse prédictive prix ETH 24h',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'agent-epsilon',
      name: 'Agent Epsilon',
      role: 'Chasseur d\'Opportunités',
      specialty: 'Détection Arbitrage',
      status: 'working',
      performance: 96.7,
      tasksCompleted: 3421,
      currentTask: 'Scan 200+ DEX pour opportunités',
      icon: Target,
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'agent-omega',
      name: 'Agent Omega',
      role: 'Coordinateur Central',
      specialty: 'Orchestration & Sync',
      status: 'collaborating',
      performance: 98.5,
      tasksCompleted: 5672,
      currentTask: 'Coordination des agents pour optimisation globale',
      icon: Users,
      color: 'from-indigo-500 to-violet-600',
    },
  ])

  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [communications, setCommunications] = useState<string[]>([])

  useEffect(() => {
    if (!aiActive) return

    // Générer des collaborations entre agents
    const collabInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        generateCollaboration()
      }
    }, 15000)

    // Générer des communications
    const commInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        generateCommunication()
      }
    }, 8000)

    // Mettre à jour les tâches des agents
    const taskInterval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        performance: Math.max(90, Math.min(100, agent.performance + (Math.random() - 0.5) * 2)),
        tasksCompleted: agent.tasksCompleted + (Math.random() > 0.7 ? 1 : 0),
      })))
    }, 10000)

    return () => {
      clearInterval(collabInterval)
      clearInterval(commInterval)
      clearInterval(taskInterval)
    }
  }, [aiActive])

  const generateCollaboration = () => {
    const objectives = [
      {
        agents: ['Agent Alpha', 'Agent Gamma'],
        objective: 'Optimisation stratégie Flash Loan + Gas',
        result: 'Réduction de 18% des coûts, augmentation de 12% du profit',
        improvement: 15.2,
      },
      {
        agents: ['Agent Beta', 'Agent Delta'],
        objective: 'Analyse risques basée sur prédictions ML',
        result: 'Détection précoce de 3 risques majeurs, mitigation automatique',
        improvement: 23.7,
      },
      {
        agents: ['Agent Epsilon', 'Agent Alpha'],
        objective: 'Exploitation opportunité arbitrage complexe',
        result: 'Profit de $4,230 sur route 4-DEX découverte',
        improvement: 18.9,
      },
      {
        agents: ['Agent Omega', 'Agent Beta', 'Agent Gamma'],
        objective: 'Synchronisation sécurité et performance',
        result: 'Équilibre optimal trouvé: +8% performance, 0 compromis sécurité',
        improvement: 12.4,
      },
    ]

    const collab = objectives[Math.floor(Math.random() * objectives.length)]

    const newCollab: Collaboration = {
      id: `collab-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...collab,
    }

    setCollaborations(prev => [newCollab, ...prev].slice(0, 10))

    // Mettre les agents en mode collaboration
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: collab.agents.includes(agent.name) ? 'collaborating' : agent.status,
    })))

    setTimeout(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: agent.status === 'collaborating' ? 'completed' : agent.status,
      })))

      setTimeout(() => {
        setAgents(prev => prev.map(agent => ({
          ...agent,
          status: agent.status === 'completed' ? 'working' : agent.status,
        })))
      }, 3000)
    }, 5000)
  }

  const generateCommunication = () => {
    const messages = [
      '🧠 Alpha → Epsilon: Nouvelle route arbitrage détectée, validation requise',
      '🛡️ Beta → Omega: Alerte mineure sur contrat 0x7a3b...2f4d, investigation en cours',
      '⚡ Gamma → Alpha: Optimisation gas approuvée, déploiement dans 2 min',
      '📊 Delta → Tous: Prédiction bullish ETH confirmée à 87%, ajuster stratégies',
      '🎯 Epsilon → Alpha: 12 opportunités identifiées, 3 haute confiance',
      '🔄 Omega → Tous: Synchronisation complète à 98.5%, performance optimale',
      '🧠 Alpha → Gamma: Besoin optimisation sur route Uniswap-SushiSwap',
      '🛡️ Beta → Delta: Corrélation risque/prédiction analysée, tout est vert',
      '⚡ Gamma → Epsilon: Gas price optimal détecté, lancer les opérations',
      '📊 Delta → Beta: Pattern suspect détecté, renforcement sécurité recommandé',
    ]

    const msg = messages[Math.floor(Math.random() * messages.length)]
    setCommunications(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev
    ].slice(0, 15))
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl mb-2 flex items-center gap-3">
              <Users className="w-6 h-6 text-[#d4af37]" />
              Système Multi-Agents IA
            </h3>
            <p className="text-gray-400">
              {agents.length} agents spécialisés collaborent pour optimiser la plateforme
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl text-[#d4af37] mb-1">
              {agents.reduce((sum, a) => sum + a.tasksCompleted, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Tâches totales</div>
          </div>
        </div>

        {/* Performance moyenne */}
        <div className="p-4 rounded-lg bg-black/30">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Performance Moyenne</span>
            <span className="text-lg text-[#d4af37]">
              {(agents.reduce((sum, a) => sum + a.performance, 0) / agents.length).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-300 transition-all duration-1000"
              style={{ width: `${agents.reduce((sum, a) => sum + a.performance, 0) / agents.length}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grille des Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${agent.color}`}>
                <agent.icon className="w-6 h-6 text-white" />
              </div>
              <AgentStatusBadge status={agent.status} />
            </div>

            <h4 className="text-lg text-white mb-1">{agent.name}</h4>
            <div className="text-sm text-[#d4af37] mb-1">{agent.role}</div>
            <div className="text-xs text-gray-400 mb-4">{agent.specialty}</div>

            {/* Performance */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">Performance</span>
                <span className="text-white">{agent.performance.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${agent.color} transition-all duration-500`}
                  style={{ width: `${agent.performance}%` }}
                />
              </div>
            </div>

            {/* Tâche actuelle */}
            <div className="p-3 rounded-lg bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Tâche en cours</div>
              <div className="text-xs text-white leading-relaxed">{agent.currentTask}</div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-gray-400">
              <span>{agent.tasksCompleted} complétées</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Actif
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Collaborations Récentes */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
        <h3 className="text-xl mb-6 flex items-center gap-3">
          <Users className="w-5 h-5 text-[#d4af37]" />
          Collaborations Récentes
        </h3>

        <div className="space-y-4">
          {collaborations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">En attente de collaborations...</p>
            </div>
          ) : (
            collaborations.map(collab => (
              <div
                key={collab.id}
                className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {collab.agents.map((agent, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37]">
                          {agent}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-white mb-1">{collab.objective}</div>
                  </div>
                  <div className="text-xs text-green-400">+{collab.improvement.toFixed(1)}%</div>
                </div>

                <div className="text-xs text-gray-400 leading-relaxed">
                  ✓ {collab.result}
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  {new Date(collab.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Communications Inter-Agents */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
        <h3 className="text-xl mb-6 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-[#d4af37]" />
          Communications en Temps Réel
        </h3>

        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar font-mono text-xs">
          {communications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>En attente de communications...</p>
            </div>
          ) : (
            communications.map((comm, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-black/30 border border-white/5 text-gray-300 hover:border-white/10 transition-all"
              >
                {comm}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function AgentStatusBadge({ status }: { status: Agent['status'] }) {
  const config = {
    idle: { label: 'Repos', color: 'bg-gray-500/20 text-gray-400' },
    working: { label: 'Actif', color: 'bg-green-500/20 text-green-400' },
    collaborating: { label: 'Collaboration', color: 'bg-[#d4af37]/20 text-[#d4af37]' },
    completed: { label: 'Terminé', color: 'bg-blue-500/20 text-blue-400' },
  }[status]

  return (
    <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
      {config.label}
    </span>
  )
}
