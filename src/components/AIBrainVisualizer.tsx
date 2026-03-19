/**
 * Visualiseur du Cerveau IA THESORIA
 * 
 * Représentation visuelle en temps réel du réseau neuronal de l'IA
 * montrant comment elle "pense" et prend des décisions
 */

import { useEffect, useRef, useState } from "react"
import { Brain, Cpu, Zap, Activity } from "lucide-react"

interface Neuron {
  x: number
  y: number
  layer: number
  activation: number
  id: string
}

interface Connection {
  from: string
  to: string
  weight: number
  active: boolean
}

export function AIBrainVisualizer({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [neurons, setNeurons] = useState<Neuron[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [thoughtProcess, setThoughtProcess] = useState<string>("")
  const animationRef = useRef<number>()

  // Initialiser le réseau neuronal
  useEffect(() => {
    const layers = [8, 16, 24, 16, 8, 4] // Architecture du réseau
    const newNeurons: Neuron[] = []
    const newConnections: Connection[] = []

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height
    const layerSpacing = width / (layers.length + 1)

    // Créer les neurones
    layers.forEach((count, layerIdx) => {
      const neuronSpacing = height / (count + 1)
      for (let i = 0; i < count; i++) {
        newNeurons.push({
          x: layerSpacing * (layerIdx + 1),
          y: neuronSpacing * (i + 1),
          layer: layerIdx,
          activation: Math.random(),
          id: `n-${layerIdx}-${i}`,
        })
      }
    })

    // Créer les connexions entre couches
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayer = newNeurons.filter(n => n.layer === l)
      const nextLayer = newNeurons.filter(n => n.layer === l + 1)

      currentLayer.forEach(neuron1 => {
        nextLayer.forEach(neuron2 => {
          // Ne connecter que quelques neurones pour la clarté visuelle
          if (Math.random() > 0.3) {
            newConnections.push({
              from: neuron1.id,
              to: neuron2.id,
              weight: Math.random() * 2 - 1,
              active: false,
            })
          }
        })
      })
    }

    setNeurons(newNeurons)
    setConnections(newConnections)
  }, [])

  // Animation du réseau neuronal
  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const thoughts = [
      "Analyse des opportunités d'arbitrage sur Uniswap...",
      "Calcul du ratio risque/rendement optimal...",
      "Détection d'une anomalie de prix sur ETH/USDC...",
      "Optimisation des paramètres de slippage...",
      "Prédiction de mouvement de prix à court terme...",
      "Évaluation de la liquidité disponible...",
      "Ajustement de la stratégie de trading...",
      "Scan des pools de staking à haut rendement...",
      "Analyse du sentiment du marché...",
      "Calcul de l'impact de prix multi-DEX...",
    ]

    let thoughtIndex = 0

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Mettre à jour les activations
      setNeurons(prev => prev.map(n => ({
        ...n,
        activation: Math.max(0, Math.min(1, n.activation + (Math.random() - 0.5) * 0.3))
      })))

      // Mettre à jour les connexions actives
      setConnections(prev => prev.map(conn => ({
        ...conn,
        active: Math.random() > 0.7
      })))

      // Dessiner les connexions
      connections.forEach(conn => {
        const fromNeuron = neurons.find(n => n.id === conn.from)
        const toNeuron = neurons.find(n => n.id === conn.to)

        if (!fromNeuron || !toNeuron) return

        const opacity = conn.active ? 0.6 : 0.1
        const width = Math.abs(conn.weight)

        ctx.beginPath()
        ctx.moveTo(fromNeuron.x, fromNeuron.y)
        ctx.lineTo(toNeuron.x, toNeuron.y)
        
        if (conn.weight > 0) {
          ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`
        } else {
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
        }
        
        ctx.lineWidth = width * 2
        ctx.stroke()
      })

      // Dessiner les neurones
      neurons.forEach(neuron => {
        const radius = 3 + neuron.activation * 5

        // Glow effect
        const gradient = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, radius * 2
        )
        gradient.addColorStop(0, `rgba(212, 175, 55, ${neuron.activation})`)
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, radius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Neurone
        ctx.fillStyle = neuron.activation > 0.7 
          ? '#d4af37' 
          : neuron.activation > 0.4 
            ? '#f0e68c' 
            : 'rgba(212, 175, 55, 0.3)'
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Changer de pensée toutes les 3 secondes
      if (Math.random() > 0.99) {
        thoughtIndex = (thoughtIndex + 1) % thoughts.length
        setThoughtProcess(thoughts[thoughtIndex])
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    setThoughtProcess(thoughts[0])

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, neurons, connections])

  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#d4af37]/20">
            <Brain className="w-5 h-5 text-[#d4af37]" />
          </div>
          Réseau Neuronal en Direct
        </h3>
        
        <div className="flex items-center gap-2 text-xs">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-green-400">Pensée Active</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-lg bg-black/50 border border-[#d4af37]/20 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto"
        />
        
        {/* Stats overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between text-xs">
          <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-[#d4af37]/30">
            <div className="text-gray-400 mb-1">Neurones</div>
            <div className="text-white">{neurons.length}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-[#d4af37]/30">
            <div className="text-gray-400 mb-1">Connexions</div>
            <div className="text-white">{connections.length}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-[#d4af37]/30">
            <div className="text-gray-400 mb-1">Activation</div>
            <div className="text-[#d4af37]">
              {((neurons.reduce((sum, n) => sum + n.activation, 0) / neurons.length) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Processus de pensée */}
      <div className="mt-4 p-4 rounded-lg bg-black/30 border border-[#d4af37]/20">
        <div className="flex items-start gap-3">
          <Zap className="w-4 h-4 text-[#d4af37] mt-1 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-400 mb-1">Processus de Pensée</div>
            <div className="text-sm text-white leading-relaxed">
              {thoughtProcess || "Initialisation du réseau neuronal..."}
            </div>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-[#d4af37] to-transparent" />
          <span className="text-gray-400">Connexion Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
          <span className="text-gray-400">Connexion Négative</span>
        </div>
      </div>
    </div>
  )
}
