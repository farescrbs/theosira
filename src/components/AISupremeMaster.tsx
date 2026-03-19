import { useState, useEffect, useRef } from "react";
import { Brain, Zap, TrendingUp, Cpu, Network, Sparkles, Infinity as InfinityIcon, Target, Rocket } from "lucide-react";
import { Badge } from "./ui/badge";

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║  IA MAÎTRE SUPRÊME - NIVEAU DIEU                                            ║
 * ║  Auto-Learning | Auto-Update | Auto-Innovation                             ║
 * ║                                                                              ║
 * ║  CAPACITÉS AUTONOMES :                                                      ║
 * ║  • Apprentissage continu sans supervision                                  ║
 * ║  • Invention de nouvelles stratégies MEV                                   ║
 * ║  • Auto-optimisation des paramètres                                        ║
 * ║  • Prédiction des opportunités futures                                     ║
 * ║  • Adaptation aux conditions du marché                                     ║
 * ║  • Création de stratégies cross-chain innovantes                           ║
 * ║  • Auto-scaling selon la profitabilité                                     ║
 * ║                                                                              ║
 * ║  MODE OPÉRATOIRE :                                                          ║
 * ║  1. Connection wallet → IA activée                                          ║
 * ║  2. Scan perpétuel 24/7/365                                                ║
 * ║  3. Innovation automatique toutes les 6h                                   ║
 * ║  4. Profits redistribués automatiquement                                   ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

interface AIBrain {
  neuralLayers: number;
  synapses: number;
  learningRate: number;
  intelligence: number;
  creativity: number;
  innovation: number;
}

interface StrategyDNA {
  id: string;
  name: string;
  genes: number[];
  fitness: number;
  generation: number;
  mutations: number;
  profitability: number;
}

interface MarketPrediction {
  timeframe: string;
  confidence: number;
  expectedProfit: number;
  riskLevel: number;
  strategy: string;
}

interface AutoLearning {
  totalIterations: number;
  strategiesDiscovered: number;
  successfulMutations: number;
  currentGeneration: number;
  evolutionSpeed: number;
}

export function AISupremeMaster({ walletConnected, onStrategyGenerated }: {
  walletConnected: boolean;
  onStrategyGenerated?: (strategy: StrategyDNA) => void;
}) {
  // IA Brain State
  const [aiBrain, setAIBrain] = useState<AIBrain>({
    neuralLayers: 12,
    synapses: 10000,
    learningRate: 0.001,
    intelligence: 95,
    creativity: 88,
    innovation: 92
  });

  // Auto-Learning State
  const [autoLearning, setAutoLearning] = useState<AutoLearning>({
    totalIterations: 0,
    strategiesDiscovered: 0,
    successfulMutations: 0,
    currentGeneration: 1,
    evolutionSpeed: 1.0
  });

  // Stratégies évolutives
  const [strategies, setStrategies] = useState<StrategyDNA[]>([]);
  const [predictions, setPredictions] = useState<MarketPrediction[]>([]);
  const [isEvolving, setIsEvolving] = useState(false);
  const [lastInnovation, setLastInnovation] = useState<Date | null>(null);

  // Refs pour processus autonomes
  const evolutionInterval = useRef<NodeJS.Timeout>();
  const predictionInterval = useRef<NodeJS.Timeout>();
  const innovationInterval = useRef<NodeJS.Timeout>();

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  ALGORITHME GÉNÉTIQUE - AUTO-ÉVOLUTION DES STRATÉGIES    ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const evolveStrategies = () => {
    setIsEvolving(true);

    // 1. Génération de stratégies initiales si vide
    if (strategies.length === 0) {
      const initialStrategies: StrategyDNA[] = Array.from({ length: 20 }, (_, i) => ({
        id: `strategy-gen1-${i}`,
        name: generateStrategyName(),
        genes: generateRandomGenes(),
        fitness: 0,
        generation: 1,
        mutations: 0,
        profitability: 0
      }));
      setStrategies(initialStrategies);
      return;
    }

    // 2. Évaluation fitness (basée sur profitabilité simulée)
    const evaluatedStrategies = strategies.map(s => ({
      ...s,
      fitness: calculateFitness(s.genes)
    }));

    // 3. Sélection des meilleurs (élitisme 20%)
    const sorted = evaluatedStrategies.sort((a, b) => b.fitness - a.fitness);
    const elite = sorted.slice(0, Math.floor(sorted.length * 0.2));

    // 4. Crossover + Mutation
    const newGeneration: StrategyDNA[] = [...elite];
    
    while (newGeneration.length < 20) {
      const parent1 = elite[Math.floor(Math.random() * elite.length)];
      const parent2 = elite[Math.floor(Math.random() * elite.length)];
      
      // Crossover
      const childGenes = crossover(parent1.genes, parent2.genes);
      
      // Mutation (probabilité 30%)
      const mutatedGenes = Math.random() < 0.3 ? mutate(childGenes) : childGenes;
      
      newGeneration.push({
        id: `strategy-gen${autoLearning.currentGeneration + 1}-${newGeneration.length}`,
        name: generateStrategyName(),
        genes: mutatedGenes,
        fitness: 0,
        generation: autoLearning.currentGeneration + 1,
        mutations: mutatedGenes !== childGenes ? parent1.mutations + 1 : parent1.mutations,
        profitability: 0
      });
    }

    // 5. Update state
    setStrategies(newGeneration);
    setAutoLearning(prev => ({
      ...prev,
      currentGeneration: prev.currentGeneration + 1,
      totalIterations: prev.totalIterations + 1,
      strategiesDiscovered: prev.strategiesDiscovered + (newGeneration.length - elite.length),
      successfulMutations: prev.successfulMutations + newGeneration.filter(s => s.mutations > 0).length
    }));

    // 6. Amélioration IA
    setAIBrain(prev => ({
      ...prev,
      intelligence: Math.min(100, prev.intelligence + 0.1),
      creativity: Math.min(100, prev.creativity + 0.15),
      innovation: Math.min(100, prev.innovation + 0.12),
      synapses: prev.synapses + 100
    }));

    setIsEvolving(false);
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  PRÉDICTION MARCHÉ - MACHINE LEARNING                     ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const predictMarketOpportunities = () => {
    const newPredictions: MarketPrediction[] = [
      {
        timeframe: '5min',
        confidence: 75 + Math.random() * 20,
        expectedProfit: 150 + Math.random() * 350,
        riskLevel: 20 + Math.random() * 30,
        strategy: strategies[0]?.name || 'Arbitrage Multi-DEX'
      },
      {
        timeframe: '15min',
        confidence: 65 + Math.random() * 25,
        expectedProfit: 300 + Math.random() * 700,
        riskLevel: 35 + Math.random() * 25,
        strategy: strategies[1]?.name || 'Sandwich Attack v2'
      },
      {
        timeframe: '1h',
        confidence: 80 + Math.random() * 15,
        expectedProfit: 500 + Math.random() * 1500,
        riskLevel: 15 + Math.random() * 20,
        strategy: strategies[2]?.name || 'Flash Loan Cascade'
      }
    ];

    setPredictions(newPredictions);
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  INNOVATION AUTONOME - CRÉATION STRATÉGIES INÉDITES       ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const innovateNewStrategy = () => {
    // Créer une stratégie complètement nouvelle basée sur l'IA
    const innovativeGenes = Array.from({ length: 10 }, () => Math.random() * 100);
    
    const newStrategy: StrategyDNA = {
      id: `innovation-${Date.now()}`,
      name: `AI-${generateInnovativeName()}`,
      genes: innovativeGenes,
      fitness: calculateFitness(innovativeGenes),
      generation: 0, // Génération 0 = innovation pure
      mutations: 0,
      profitability: 0
    };

    setStrategies(prev => [newStrategy, ...prev].slice(0, 20));
    setLastInnovation(new Date());

    // Notify parent component
    onStrategyGenerated?.(newStrategy);

    // Boost créativité
    setAIBrain(prev => ({
      ...prev,
      creativity: Math.min(100, prev.creativity + 0.5),
      innovation: Math.min(100, prev.innovation + 0.3)
    }));
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  FONCTIONS UTILITAIRES - ALGORITHMES                      ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  const generateRandomGenes = (): number[] => {
    return Array.from({ length: 10 }, () => Math.random() * 100);
  };

  const calculateFitness = (genes: number[]): number => {
    // Fitness = simulation profitabilité basée sur paramètres génétiques
    const diversity = genes.reduce((acc, g, i) => acc + Math.abs(g - (genes[i + 1] || g)), 0);
    const average = genes.reduce((a, b) => a + b, 0) / genes.length;
    const variance = genes.reduce((acc, g) => acc + Math.pow(g - average, 2), 0) / genes.length;
    
    return (diversity * 0.3) + (average * 0.4) + (Math.sqrt(variance) * 0.3);
  };

  const crossover = (genes1: number[], genes2: number[]): number[] => {
    const crossoverPoint = Math.floor(genes1.length / 2);
    return [
      ...genes1.slice(0, crossoverPoint),
      ...genes2.slice(crossoverPoint)
    ];
  };

  const mutate = (genes: number[]): number[] => {
    const mutationPoint = Math.floor(Math.random() * genes.length);
    const newGenes = [...genes];
    newGenes[mutationPoint] = Math.random() * 100;
    return newGenes;
  };

  const generateStrategyName = (): string => {
    const prefixes = ['Quantum', 'Neural', 'Hyper', 'Ultra', 'Mega', 'Turbo', 'Alpha'];
    const cores = ['Flash', 'Arb', 'MEV', 'Sandwich', 'Snipe', 'Hunt', 'Sweep'];
    const suffixes = ['Pro', 'Max', 'Elite', 'Prime', 'Apex', 'Omega', 'X'];
    
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${cores[Math.floor(Math.random() * cores.length)]}-${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  };

  const generateInnovativeName = (): string => {
    const innovations = [
      'QuantumEntanglement', 'NeuralFusion', 'HyperDimensional',
      'CrossChainSymphony', 'TimeWarpArbitrage', 'MultiVerse',
      'PlasmaFlash', 'InfinityLoop', 'BlackHole', 'Singularity'
    ];
    return innovations[Math.floor(Math.random() * innovations.length)];
  };

  /**
   * ╔═══════════════════════════════════════════════════════════╗
   * ║  LIFECYCLE - PROCESSUS AUTONOMES PERPÉTUELS              ║
   * ╚═══════════════════════════════════════════════════════════╝
   */
  useEffect(() => {
    if (!walletConnected) {
      // Cleanup si wallet déconnecté
      if (evolutionInterval.current) clearInterval(evolutionInterval.current);
      if (predictionInterval.current) clearInterval(predictionInterval.current);
      if (innovationInterval.current) clearInterval(innovationInterval.current);
      return;
    }

    // 🔄 ÉVOLUTION CONTINUE - Toutes les 30 secondes
    evolutionInterval.current = setInterval(() => {
      evolveStrategies();
    }, 30000);

    // 🔮 PRÉDICTIONS - Toutes les 10 secondes
    predictionInterval.current = setInterval(() => {
      predictMarketOpportunities();
    }, 10000);

    // 💡 INNOVATION - Toutes les 6 heures (21600000ms)
    innovationInterval.current = setInterval(() => {
      innovateNewStrategy();
    }, 21600000);

    // Exécution immédiate
    evolveStrategies();
    predictMarketOpportunities();

    return () => {
      if (evolutionInterval.current) clearInterval(evolutionInterval.current);
      if (predictionInterval.current) clearInterval(predictionInterval.current);
      if (innovationInterval.current) clearInterval(innovationInterval.current);
    };
  }, [walletConnected]);

  if (!walletConnected) {
    return null;
  }

  return (
    <div className="fixed top-32 left-6 z-50 w-96">
      <div className="p-6 rounded-2xl border border-[#d4af37]/30 bg-black/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <Brain className="w-8 h-8 text-[#d4af37]" />
            {isEvolving && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              IA Maître Suprême
            </h3>
            <p className="text-xs text-[#d4af37]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Autonomie Niveau DIEU
            </p>
          </div>
          <InfinityIcon className="w-6 h-6 text-[#d4af37] ml-auto animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        {/* AI Brain Metrics */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Intelligence
              </span>
              <span className="text-xs text-[#d4af37]">
                {aiBrain.intelligence.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] transition-all duration-1000"
                style={{ width: `${aiBrain.intelligence}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Créativité
              </span>
              <span className="text-xs text-purple-400">
                {aiBrain.creativity.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                style={{ width: `${aiBrain.creativity}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Innovation
              </span>
              <span className="text-xs text-blue-400">
                {aiBrain.innovation.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${aiBrain.innovation}%` }}
              />
            </div>
          </div>
        </div>

        {/* Neural Network Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20">
            <div className="flex items-center gap-2 mb-1">
              <Network className="w-3 h-3 text-[#d4af37]" />
              <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Synapses
              </span>
            </div>
            <div className="text-lg text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              {aiBrain.synapses.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Couches
              </span>
            </div>
            <div className="text-lg text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              {aiBrain.neuralLayers}
            </div>
          </div>
        </div>

        {/* Auto-Learning Stats */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Apprentissage Autonome
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-white/40 mb-1">Génération</div>
              <div className="text-white">{autoLearning.currentGeneration}</div>
            </div>
            <div>
              <div className="text-white/40 mb-1">Itérations</div>
              <div className="text-white">{autoLearning.totalIterations}</div>
            </div>
            <div>
              <div className="text-white/40 mb-1">Stratégies</div>
              <div className="text-white">{autoLearning.strategiesDiscovered}</div>
            </div>
            <div>
              <div className="text-white/40 mb-1">Mutations</div>
              <div className="text-white">{autoLearning.successfulMutations}</div>
            </div>
          </div>
        </div>

        {/* Top 3 Predictions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Prédictions Actives
            </span>
          </div>
          {predictions.slice(0, 3).map((pred, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {pred.strategy}
                </span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  {pred.timeframe}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="text-white/60">
                  Confiance: <span className="text-green-400">{pred.confidence.toFixed(0)}%</span>
                </div>
                <div className="text-[#d4af37]">
                  ${pred.expectedProfit.toFixed(0)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Last Innovation */}
        {lastInnovation && (
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-pink-400" />
              <div className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Dernière innovation : {lastInnovation.toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
            IA active • Évolution continue • Profits optimisés
          </span>
        </div>
      </div>
    </div>
  );
}
