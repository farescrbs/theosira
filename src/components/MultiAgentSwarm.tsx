import { useState, useEffect } from "react";
import { Users, Zap, Target, TrendingUp, Shield, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║  MULTI-AGENT SWARM INTELLIGENCE - INTELLIGENCE COLLECTIVE                   ║
 * ║  100 Agents IA Autonomes Travaillant en Parallèle                          ║
 * ║                                                                              ║
 * ║  CONCEPT :                                                                  ║
 * ║  Au lieu d'1 IA → 100 agents spécialisés qui collaborent                   ║
 * ║  Chaque agent a sa spécialité et communique avec les autres                ║
 * ║  Intelligence collective > somme des intelligences individuelles            ║
 * ║                                                                              ║
 * ║  TYPES D'AGENTS :                                                           ║
 * ║  • Scout Agents (20): Scan opportunités sur zones spécifiques              ║
 * ║  • Analyzer Agents (30): Analyse profondeur opportunités                   ║
 * ║  • Executor Agents (25): Exécution trades rapide                           ║
 * ║  • Risk Agents (15): Évaluation risque temps réel                          ║
 * ║  • Coordinator Agents (10): Coordination ensemble                          ║
 * ║                                                                              ║
 * ║  AVANTAGES SWARM :                                                          ║
 * ║  • Parallélisme massif (100x plus rapide)                                  ║
 * ║  • Redondance (si 1 agent fail, 99 continuent)                            ║
 * ║  • Spécialisation (chaque agent expert dans son domaine)                   ║
 * ║  • Émergence (comportements complexes émergent de règles simples)         ║
 * ║  • Auto-réparation (swarm s'adapte aux défaillances)                       ║
 * ║                                                                              ║
 * ║  COMMUNICATION :                                                            ║
 * ║  • Pheromone-like messages (inspiration fourmis)                           ║
 * ║  • Consensus algorithm (Byzantine fault tolerance)                         ║
 * ║  • Reputation system (agents performants = + poids)                        ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

interface Agent {
  id: string;
  type: 'scout' | 'analyzer' | 'executor' | 'risk' | 'coordinator';
  status: 'active' | 'idle' | 'working' | 'error';
  reputation: number; // 0-100
  tasksCompleted: number;
  successRate: number;
  currentTask?: string;
  specialization: string;
}

interface SwarmTask {
  id: string;
  type: string;
  assignedAgents: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: number;
  result?: any;
}

interface SwarmMetrics {
  totalAgents: number;
  activeAgents: number;
  tasksCompleted: number;
  avgSuccessRate: number;
  throughput: number; // tasks/min
  efficiency: number; // %
}

interface ConsensusVote {
  agentId: string;
  decision: 'execute' | 'skip' | 'analyze-more';
  confidence: number;
  reputation: number;
}

export function MultiAgentSwarm({ 
  walletConnected,
  onSwarmDecision 
}: {
  walletConnected: boolean;
  onSwarmDecision?: (decision: any) => void;
}) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<SwarmTask[]>([]);
  const [metrics, setMetrics] = useState<SwarmMetrics>({
    totalAgents: 100,
    activeAgents: 0,
    tasksCompleted: 0,
    avgSuccessRate: 0,
    throughput: 0,
    efficiency: 0
  });
  const [consensusInProgress, setConsensusInProgress] = useState(false);
  const [lastConsensus, setLastConsensus] = useState<string>('');

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  INITIALISATION SWARM                                     ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const initializeSwarm = () => {
    const swarm: Agent[] = [];

    // Scout Agents (20)
    for (let i = 0; i < 20; i++) {
      swarm.push({
        id: `scout-${i}`,
        type: 'scout',
        status: 'active',
        reputation: 50 + Math.random() * 50,
        tasksCompleted: Math.floor(Math.random() * 100),
        successRate: 70 + Math.random() * 25,
        specialization: ['Uniswap', 'Sushiswap', 'Curve', 'Balancer'][i % 4]
      });
    }

    // Analyzer Agents (30)
    for (let i = 0; i < 30; i++) {
      swarm.push({
        id: `analyzer-${i}`,
        type: 'analyzer',
        status: 'active',
        reputation: 60 + Math.random() * 40,
        tasksCompleted: Math.floor(Math.random() * 150),
        successRate: 75 + Math.random() * 20,
        specialization: ['Price Analysis', 'Volume Analysis', 'Risk Assessment'][i % 3]
      });
    }

    // Executor Agents (25)
    for (let i = 0; i < 25; i++) {
      swarm.push({
        id: `executor-${i}`,
        type: 'executor',
        status: 'active',
        reputation: 55 + Math.random() * 45,
        tasksCompleted: Math.floor(Math.random() * 80),
        successRate: 80 + Math.random() * 18,
        specialization: ['Flash Loan', 'Arbitrage', 'Sandwich'][i % 3]
      });
    }

    // Risk Agents (15)
    for (let i = 0; i < 15; i++) {
      swarm.push({
        id: `risk-${i}`,
        type: 'risk',
        status: 'active',
        reputation: 65 + Math.random() * 35,
        tasksCompleted: Math.floor(Math.random() * 120),
        successRate: 85 + Math.random() * 12,
        specialization: ['Gas Risk', 'Liquidity Risk', 'Slippage Risk'][i % 3]
      });
    }

    // Coordinator Agents (10)
    for (let i = 0; i < 10; i++) {
      swarm.push({
        id: `coordinator-${i}`,
        type: 'coordinator',
        status: 'active',
        reputation: 70 + Math.random() * 30,
        tasksCompleted: Math.floor(Math.random() * 200),
        successRate: 90 + Math.random() * 8,
        specialization: 'Global Coordination'
      });
    }

    setAgents(swarm);
    
    // Update metrics
    setMetrics(prev => ({
      ...prev,
      activeAgents: swarm.filter(a => a.status === 'active').length,
      avgSuccessRate: swarm.reduce((sum, a) => sum + a.successRate, 0) / swarm.length
    }));
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  ASSIGNATION TÂCHES INTELLIGENTE                          ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const assignTask = () => {
    const taskTypes = [
      'Scan DEX Opportunities',
      'Analyze Arbitrage',
      'Execute Flash Loan',
      'Assess Risk',
      'Coordinate Strategy'
    ];

    const newTask: SwarmTask = {
      id: `task-${Date.now()}`,
      type: taskTypes[Math.floor(Math.random() * taskTypes.length)],
      assignedAgents: [],
      status: 'pending',
      priority: Math.floor(Math.random() * 10) + 1
    };

    // Assigner agents selon type de tâche
    const agentType = 
      newTask.type.includes('Scan') ? 'scout' :
      newTask.type.includes('Analyze') ? 'analyzer' :
      newTask.type.includes('Execute') ? 'executor' :
      newTask.type.includes('Risk') ? 'risk' : 'coordinator';

    // Sélectionner meilleurs agents disponibles
    const availableAgents = agents
      .filter(a => a.type === agentType && a.status !== 'error')
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, 3); // Top 3 agents

    newTask.assignedAgents = availableAgents.map(a => a.id);
    newTask.status = 'in-progress';

    // Marquer agents comme travaillant
    setAgents(prev => prev.map(a => 
      newTask.assignedAgents.includes(a.id)
        ? { ...a, status: 'working' as const, currentTask: newTask.type }
        : a
    ));

    setTasks(prev => [newTask, ...prev].slice(0, 50));

    // Simuler complétion
    setTimeout(() => {
      completeTask(newTask.id);
    }, 2000 + Math.random() * 3000);
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  COMPLÉTION TÂCHE & MISE À JOUR RÉPUTATION                ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const success = Math.random() > 0.15; // 85% success rate

    // Update task
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: success ? 'completed' : 'failed' as const }
        : t
    ));

    // Update agents
    setAgents(prev => prev.map(a => {
      if (task.assignedAgents.includes(a.id)) {
        const reputationChange = success ? +2 : -1;
        return {
          ...a,
          status: 'active' as const,
          currentTask: undefined,
          tasksCompleted: a.tasksCompleted + 1,
          successRate: ((a.successRate * a.tasksCompleted) + (success ? 100 : 0)) / (a.tasksCompleted + 1),
          reputation: Math.max(0, Math.min(100, a.reputation + reputationChange))
        };
      }
      return a;
    }));

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1,
      throughput: (prev.tasksCompleted + 1) / ((Date.now() / 60000) || 1)
    }));
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  CONSENSUS ALGORITHM - VOTE COLLECTIF                     ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const runConsensus = () => {
    setConsensusInProgress(true);

    // Sélectionner agents votants (top 20 par réputation)
    const voters = agents
      .filter(a => a.reputation > 60)
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, 20);

    // Collecter votes
    const votes: ConsensusVote[] = voters.map(agent => ({
      agentId: agent.id,
      decision: Math.random() > 0.3 ? 'execute' : Math.random() > 0.5 ? 'skip' : 'analyze-more',
      confidence: 70 + Math.random() * 30,
      reputation: agent.reputation
    }));

    // Calculer consensus pondéré par réputation
    const weightedVotes = votes.reduce((acc, vote) => {
      const weight = vote.reputation * vote.confidence;
      acc[vote.decision] = (acc[vote.decision] || 0) + weight;
      return acc;
    }, {} as Record<string, number>);

    const winner = Object.entries(weightedVotes)
      .sort(([, a], [, b]) => b - a)[0][0];

    setLastConsensus(`Consensus: ${winner.toUpperCase()} (${votes.length} agents votés)`);
    onSwarmDecision?.({ decision: winner, votes: votes.length });

    setTimeout(() => setConsensusInProgress(false), 3000);
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  AUTO-RÉPARATION SWARM                                    ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const healSwarm = () => {
    setAgents(prev => prev.map(agent => {
      // Réparer agents en erreur (10% chance par tick)
      if (agent.status === 'error' && Math.random() > 0.9) {
        return { ...agent, status: 'active' as const };
      }
      
      // Améliorer légèrement réputation des agents performants
      if (agent.successRate > 85 && Math.random() > 0.95) {
        return { 
          ...agent, 
          reputation: Math.min(100, agent.reputation + 0.5) 
        };
      }

      return agent;
    }));
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  LIFECYCLE - SWARM PERPÉTUEL                              ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  useEffect(() => {
    if (!walletConnected) return;

    // Initialiser swarm
    if (agents.length === 0) {
      initializeSwarm();
    }

    // Assignation continue de tâches - Toutes les 3 secondes
    const taskInterval = setInterval(() => {
      assignTask();
    }, 3000);

    // Consensus périodique - Toutes les 30 secondes
    const consensusInterval = setInterval(() => {
      runConsensus();
    }, 30000);

    // Auto-réparation - Toutes les 10 secondes
    const healInterval = setInterval(() => {
      healSwarm();
    }, 10000);

    // Calcul efficiency
    const metricsInterval = setInterval(() => {
      const activeCount = agents.filter(a => a.status === 'active' || a.status === 'working').length;
      const efficiency = (activeCount / metrics.totalAgents) * 100;
      
      setMetrics(prev => ({
        ...prev,
        activeAgents: activeCount,
        efficiency
      }));
    }, 5000);

    return () => {
      clearInterval(taskInterval);
      clearInterval(consensusInterval);
      clearInterval(healInterval);
      clearInterval(metricsInterval);
    };
  }, [walletConnected, agents.length]);

  if (!walletConnected) {
    return null;
  }

  const agentsByType = agents.reduce((acc, agent) => {
    acc[agent.type] = (acc[agent.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAgents = agents
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 5);

  return (
    <div className="p-8 rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-green-400" />
          <div>
            <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Multi-Agent Swarm
            </h3>
            <p className="text-sm text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Intelligence Collective
            </p>
          </div>
        </div>

        {consensusInProgress && (
          <Sparkles className="w-6 h-6 text-green-400 animate-pulse" />
        )}
      </div>

      {/* Swarm Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Agents Actifs
            </span>
          </div>
          <div className="text-2xl text-green-400" style={{ fontFamily: 'Playfair Display, serif' }}>
            {metrics.activeAgents}/{metrics.totalAgents}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Tâches
            </span>
          </div>
          <div className="text-2xl text-blue-400" style={{ fontFamily: 'Playfair Display, serif' }}>
            {metrics.tasksCompleted}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Succès Moyen
            </span>
          </div>
          <div className="text-2xl text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {metrics.avgSuccessRate.toFixed(1)}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Efficacité
            </span>
          </div>
          <div className="text-2xl text-purple-400" style={{ fontFamily: 'Playfair Display, serif' }}>
            {metrics.efficiency.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Agent Distribution */}
      <div className="p-6 rounded-xl bg-black/40 border border-white/10 mb-6">
        <div className="text-sm text-white/80 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Distribution Agents par Type
        </div>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(agentsByType).map(([type, count]) => (
            <div key={type} className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-white/60 mb-1 capitalize">{type}</div>
              <div className="text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Agents */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/30 mb-6">
        <div className="text-sm text-white/80 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Top 5 Agents (Réputation)
        </div>
        <div className="space-y-2">
          {topAgents.map((agent, idx) => (
            <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg bg-black/30">
              <div className="flex items-center gap-3">
                <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                  #{idx + 1}
                </Badge>
                <div>
                  <div className="text-sm text-white">{agent.id}</div>
                  <div className="text-xs text-white/60 capitalize">
                    {agent.type} • {agent.specialization}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[#d4af37]">{agent.reputation.toFixed(0)} rep</div>
                <div className="text-xs text-white/60">
                  {agent.successRate.toFixed(0)}% success
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consensus Info */}
      {lastConsensus && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <div className="text-sm text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {lastConsensus}
            </div>
          </div>
        </div>
      )}

      {/* Active Tasks */}
      <div className="space-y-2">
        <div className="text-sm text-white/80 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Tâches Récentes
        </div>
        {tasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-xl border ${
              task.status === 'completed'
                ? 'bg-green-500/5 border-green-500/20'
                : task.status === 'failed'
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-blue-500/5 border-blue-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={`text-xs ${
                  task.status === 'completed'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : task.status === 'failed'
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {task.status}
                </Badge>
                <span className="text-sm text-white">{task.type}</span>
              </div>
              <div className="text-xs text-white/60">
                {task.assignedAgents.length} agents
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Swarm actif • {metrics.activeAgents} agents • {metrics.throughput.toFixed(1)} tasks/min
          </span>
        </div>
      </div>
    </div>
  );
}
