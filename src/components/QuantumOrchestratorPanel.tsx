import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Network, Cpu, Zap, Activity, Globe, Lock, Shield, Sparkles, Server } from "lucide-react";

export function QuantumOrchestratorPanel() {
  const [qubits, setQubits] = useState(1024);
  const [entanglementRatio, setEntanglementRatio] = useState(99.99);
  const [nodes, setNodes] = useState([
    { id: "alpha", label: "Alpha Node (ETH)", status: "active", power: 98 },
    { id: "beta", label: "Beta Node (ARB)", status: "active", power: 95 },
    { id: "gamma", label: "Gamma Node (OPT)", status: "active", power: 99 },
    { id: "delta", label: "Delta Node (BSC)", status: "syncing", power: 72 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQubits((prev) => prev + Math.floor(Math.random() * 10 - 2));
      setEntanglementRatio((prev) => Math.min(100, prev + (Math.random() * 0.02 - 0.01)));
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          power: node.status === "active" ? Math.min(100, node.power + (Math.random() * 2 - 1)) : node.power,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-6 text-white font-sans">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "COEURS QUANTIQUES ACTIFS", value: qubits.toLocaleString(), icon: Cpu, color: "text-[#d4af37]" },
          { label: "RATIO D'INTRICATION", value: `${entanglementRatio.toFixed(4)}%`, icon: Network, color: "text-[#22d3ee]" },
          { label: "ROUTES MULTIVERS", value: "14,092,301", icon: Globe, color: "text-[#a78bfa]" },
          { label: "SÉCURITÉ CRYPTOGRAPHIQUE", value: "RÉSISTANT QUANTIQUE", icon: Shield, color: "text-[#34d399]" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-black/40 border border-[#d4af37]/20 backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent opacity-50" />
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <h3 className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-bold">{stat.label}</h3>
            </div>
            <p className={`text-2xl font-bold ${stat.color} font-mono tracking-tight`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Orchestrator View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left: Nodes Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 rounded-xl bg-black/40 border border-[#d4af37]/20 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-widest text-[#d4af37]">RÉSEAU DE NOEUDS IA</h2>
            <Activity className="w-4 h-4 text-[#d4af37] animate-pulse" />
          </div>

          <div className="space-y-3">
            {nodes.map((node) => (
              <div key={node.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-white/70" />
                    <span className="text-sm font-semibold">{node.label}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                    node.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c]"
                    initial={{ width: 0 }}
                    animate={{ width: `${node.power}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Quantum Visualizer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 rounded-xl bg-black/40 border border-[#d4af37]/20 p-6 relative overflow-hidden flex flex-col"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-[#d4af37]">VISUALISATION D'INTRICATION MULTIVERS</h2>
              <p className="text-xs text-white/40 mt-1">Superposition des états d'arbitrage en temps réel</p>
            </div>
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
          </div>

          <div className="flex-1 relative flex items-center justify-center border border-white/5 rounded-lg bg-black/50 overflow-hidden min-h-[300px]">
            {/* Core */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-32 h-32 rounded-full border border-[#d4af37]/30 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: -720 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-2 border-dashed border-[#d4af37]/50"
              />
            </motion.div>
            
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/40 to-transparent blur-xl"
            />
            
            <Zap className="w-8 h-8 text-[#d4af37] relative z-10" />

            {/* Orbiting Particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#f0e68c] shadow-[0_0_10px_#f0e68c]"
                animate={{
                  x: [Math.cos(i * (Math.PI / 4)) * 100, Math.cos(i * (Math.PI / 4)) * 150, Math.cos(i * (Math.PI / 4)) * 100],
                  y: [Math.sin(i * (Math.PI / 4)) * 100, Math.sin(i * (Math.PI / 4)) * 150, Math.sin(i * (Math.PI / 4)) * 100],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Log Console */}
          <div className="mt-4 h-32 bg-black/60 rounded-lg border border-white/5 p-3 font-mono text-[10px] text-[#34d399]/70 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/60 to-transparent z-10" />
            <motion.div
              animate={{ y: [0, -100] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="flex flex-col gap-1"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-white/30">[{new Date(Date.now() - i * 1000).toISOString().split('T')[1].slice(0, 12)}]</span>
                  <span>Calcul d'état superposé pour la route {Math.random().toString(36).substring(2, 8).toUpperCase()}... {Math.random() > 0.1 ? 'RÉSOLU' : 'RÉVISION'}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
