/**
 * Générateur de Code Autonome IA
 * 
 * L'IA peut analyser, générer et déployer du code automatiquement
 * pour améliorer la plateforme en continu
 */

import { useState, useEffect } from "react"
import { Code, Sparkles, CheckCircle, XCircle, Clock, Rocket, FileCode, GitBranch } from "lucide-react"

interface CodeGeneration {
  id: string
  timestamp: string
  type: 'optimization' | 'feature' | 'bugfix' | 'security'
  module: string
  description: string
  code: string
  status: 'analyzing' | 'generating' | 'testing' | 'ready' | 'deployed' | 'failed'
  impact: string
  linesAdded: number
  linesRemoved: number
  confidence: number
}

export function AIAutoCodeGenerator({ aiActive, aiMode }: { aiActive: boolean; aiMode: string }) {
  const [generations, setGenerations] = useState<CodeGeneration[]>([])
  const [currentGeneration, setCurrentGeneration] = useState<CodeGeneration | null>(null)
  const [stats, setStats] = useState({
    totalGenerations: 0,
    successfulDeployments: 0,
    linesGenerated: 0,
    bugsFixed: 0,
  })

  // Générer du code automatiquement
  useEffect(() => {
    if (!aiActive || aiMode === 'manual') return

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        generateCode()
      }
    }, 20000) // Toutes les 20 secondes

    return () => clearInterval(interval)
  }, [aiActive, aiMode])

  const generateCode = () => {
    const types: CodeGeneration['type'][] = ['optimization', 'feature', 'bugfix', 'security']
    const modules = [
      'Flash Loan Bot',
      'DEX Aggregator', 
      'Staking Module',
      'NFT Marketplace',
      'Cross-Chain Bridge',
      'Wallet System',
    ]

    const codeExamples = {
      optimization: `// Optimisation automatique des frais de gas
function optimizeGasPrice(transaction: Transaction): Transaction {
  const baseGas = await provider.getGasPrice()
  const optimal = baseGas * 0.92 // Réduction de 8%
  
  return {
    ...transaction,
    maxFeePerGas: optimal,
    maxPriorityFeePerGas: optimal * 0.1
  }
}`,
      feature: `// Nouvelle fonctionnalité de routing multi-path
async function findOptimalRoute(
  tokenIn: string,
  tokenOut: string,
  amount: BigNumber
): Promise<Route[]> {
  const routes = await aggregator.getAllRoutes(tokenIn, tokenOut)
  const scored = routes.map(r => ({
    ...r,
    score: calculateRouteScore(r, amount)
  }))
  
  return scored.sort((a, b) => b.score - a.score).slice(0, 3)
}`,
      bugfix: `// Correction du bug de slippage dans les swaps
- const slippage = 0.5 // Bug: slippage trop élevé
+ const slippage = userSettings.slippage || 0.1 // Fix: utiliser les paramètres utilisateur
  
  const minAmountOut = calculateMinOutput(
    amountIn,
-   slippage
+   slippage / 100 // Fix: convertir en pourcentage
  )`,
      security: `// Amélioration de la sécurité des signatures
+ import { verifyTypedData } from 'ethers/lib/utils'

  async function verifySignature(message: string, signature: string) {
+   // Vérification supplémentaire du domaine
+   const domain = {
+     name: 'THESORIA',
+     version: '1',
+     chainId: await provider.getChainId()
+   }
+   
+   const isValid = verifyTypedData(domain, types, message, signature)
+   if (!isValid) throw new Error('Invalid signature')
    
    return ethers.utils.verifyMessage(message, signature)
  }`,
    }

    const descriptions = {
      optimization: [
        'Réduction des frais de gas de 8% via optimisation des paramètres',
        'Amélioration du cache pour réduire les appels RPC de 35%',
        'Optimisation des requêtes de base de données (temps -42%)',
        'Compression des données de transaction pour économie de gas',
      ],
      feature: [
        'Ajout du routing multi-path pour meilleurs prix',
        'Intégration de nouveaux DEX dans l\'aggregateur',
        'Système de retry automatique pour transactions échouées',
        'Auto-compound intelligent des rewards de staking',
      ],
      bugfix: [
        'Correction du calcul de slippage incorrect',
        'Fix de la race condition dans le système de queue',
        'Résolution du memory leak dans le websocket',
        'Correction de l\'arrondi des montants décimaux',
      ],
      security: [
        'Renforcement de la validation des signatures',
        'Ajout de rate limiting sur les endpoints critiques',
        'Implémentation de la vérification du domaine EIP-712',
        'Protection contre les attaques de reentrancy',
      ],
    }

    const type = types[Math.floor(Math.random() * types.length)]
    const module = modules[Math.floor(Math.random() * modules.length)]
    const descList = descriptions[type]
    const description = descList[Math.floor(Math.random() * descList.length)]

    const newGen: CodeGeneration = {
      id: `gen-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      module,
      description,
      code: codeExamples[type],
      status: 'analyzing',
      impact: type === 'security' ? 'Critique' : type === 'optimization' ? 'Élevé' : 'Moyen',
      linesAdded: Math.floor(Math.random() * 30) + 5,
      linesRemoved: type === 'bugfix' ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 5),
      confidence: 85 + Math.random() * 14,
    }

    setCurrentGeneration(newGen)
    
    // Simuler le processus de génération
    setTimeout(() => {
      setCurrentGeneration(prev => prev ? { ...prev, status: 'generating' } : null)
    }, 2000)

    setTimeout(() => {
      setCurrentGeneration(prev => prev ? { ...prev, status: 'testing' } : null)
    }, 5000)

    setTimeout(() => {
      setCurrentGeneration(prev => prev ? { ...prev, status: 'ready' } : null)
    }, 8000)

    // Auto-déploiement en mode autonome
    if (aiMode === 'autonomous' && newGen.confidence > 90) {
      setTimeout(() => {
        deployCode(newGen.id)
      }, 10000)
    }

    setGenerations(prev => [newGen, ...prev].slice(0, 20))
    setStats(prev => ({
      ...prev,
      totalGenerations: prev.totalGenerations + 1,
      linesGenerated: prev.linesGenerated + newGen.linesAdded,
    }))
  }

  const deployCode = (id: string) => {
    setGenerations(prev => prev.map(gen => 
      gen.id === id ? { ...gen, status: 'deployed' } : gen
    ))
    
    if (currentGeneration?.id === id) {
      setCurrentGeneration(prev => prev ? { ...prev, status: 'deployed' } : null)
    }

    setStats(prev => ({
      ...prev,
      successfulDeployments: prev.successfulDeployments + 1,
      bugsFixed: prev.bugsFixed + (generations.find(g => g.id === id)?.type === 'bugfix' ? 1 : 0),
    }))
  }

  const rejectCode = (id: string) => {
    setGenerations(prev => prev.map(gen => 
      gen.id === id ? { ...gen, status: 'failed' } : gen
    ))
    
    if (currentGeneration?.id === id) {
      setCurrentGeneration(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/30">
          <div className="text-xs text-gray-400 mb-1">Générations</div>
          <div className="text-2xl text-white">{stats.totalGenerations}</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30">
          <div className="text-xs text-gray-400 mb-1">Déployés</div>
          <div className="text-2xl text-green-400">{stats.successfulDeployments}</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30">
          <div className="text-xs text-gray-400 mb-1">Lignes Code</div>
          <div className="text-2xl text-blue-400">{stats.linesGenerated.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30">
          <div className="text-xs text-gray-400 mb-1">Bugs Fixés</div>
          <div className="text-2xl text-purple-400">{stats.bugsFixed}</div>
        </div>
      </div>

      {/* Génération en cours */}
      {currentGeneration && currentGeneration.status !== 'deployed' && currentGeneration.status !== 'failed' && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TypeBadge type={currentGeneration.type} />
                <span className="text-sm text-gray-400">{currentGeneration.module}</span>
              </div>
              <h4 className="text-lg text-white">{currentGeneration.description}</h4>
            </div>
            <StatusBadge status={currentGeneration.status} />
          </div>

          {/* Code généré */}
          <div className="p-4 rounded-lg bg-black/50 border border-white/10 mb-4 font-mono text-xs overflow-x-auto">
            <pre className="text-gray-300">{currentGeneration.code}</pre>
          </div>

          {/* Métriques */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xs text-gray-400">Impact</div>
              <div className="text-sm text-white">{currentGeneration.impact}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Lignes +</div>
              <div className="text-sm text-green-400">+{currentGeneration.linesAdded}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Lignes -</div>
              <div className="text-sm text-red-400">-{currentGeneration.linesRemoved}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Confiance</div>
              <div className="text-sm text-[#d4af37]">{currentGeneration.confidence.toFixed(1)}%</div>
            </div>
          </div>

          {/* Actions */}
          {currentGeneration.status === 'ready' && aiMode !== 'autonomous' && (
            <div className="flex gap-3">
              <button
                onClick={() => deployCode(currentGeneration.id)}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-yellow-600 text-black hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Déployer
              </button>
              <button
                onClick={() => rejectCode(currentGeneration.id)}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Rejeter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Historique */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
        <h3 className="text-xl mb-4 flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-[#d4af37]" />
          Historique des Générations
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {generations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileCode className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune génération de code pour le moment</p>
            </div>
          ) : (
            generations.map(gen => (
              <div
                key={gen.id}
                className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TypeBadge type={gen.type} />
                      <span className="text-xs text-gray-400">{gen.module}</span>
                    </div>
                    <div className="text-sm text-white">{gen.description}</div>
                  </div>
                  <StatusBadge status={gen.status} />
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>+{gen.linesAdded} -{gen.linesRemoved}</span>
                  <span>•</span>
                  <span>{gen.confidence.toFixed(0)}% confiance</span>
                  <span>•</span>
                  <span>{new Date(gen.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function TypeBadge({ type }: { type: CodeGeneration['type'] }) {
  const config = {
    optimization: { label: 'Optimisation', color: 'bg-blue-500/20 text-blue-400', icon: Sparkles },
    feature: { label: 'Fonctionnalité', color: 'bg-purple-500/20 text-purple-400', icon: Code },
    bugfix: { label: 'Bug Fix', color: 'bg-orange-500/20 text-orange-400', icon: CheckCircle },
    security: { label: 'Sécurité', color: 'bg-red-500/20 text-red-400', icon: CheckCircle },
  }[type]

  const Icon = config.icon

  return (
    <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

function StatusBadge({ status }: { status: CodeGeneration['status'] }) {
  const config = {
    analyzing: { label: 'Analyse', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
    generating: { label: 'Génération', color: 'bg-blue-500/20 text-blue-400', icon: Code },
    testing: { label: 'Tests', color: 'bg-purple-500/20 text-purple-400', icon: CheckCircle },
    ready: { label: 'Prêt', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
    deployed: { label: 'Déployé', color: 'bg-green-500/20 text-green-400', icon: Rocket },
    failed: { label: 'Échoué', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  }[status]

  const Icon = config.icon

  return (
    <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}
