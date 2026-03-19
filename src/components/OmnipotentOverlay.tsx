import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, X, Terminal, Cpu, Globe, Infinity as InfinityIcon } from "lucide-react";
import { GraalDashboard } from "./graal/GraalDashboard";
import { OmniscientDashboard } from "./OmniscientDashboard";
import GodModePanel from "./GodModePanel";
import { QuantumOrchestratorPanel } from "./QuantumOrchestratorPanel";

export function OmnipotentOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"omniscient" | "graal" | "mev" | "quantum">("omniscient");

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-god-mode", handleToggle);
    return () => window.removeEventListener("toggle-god-mode", handleToggle);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100000] flex flex-col bg-black/95 backdrop-blur-3xl overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="flex-none flex items-center justify-between p-6 border-b border-[#d4af37]/20 bg-black/50">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full border-2 border-[#d4af37] border-t-transparent flex items-center justify-center"
              >
                <InfinityIcon className="w-6 h-6 text-[#d4af37]" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#d4af37] via-[#f0e68c] to-[#d4af37] bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                  OMNIPOTENT GOD MODE
                </h1>
                <p className="text-xs text-[#d4af37]/70 tracking-[0.3em] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  CONTRÔLE ABSOLU DU MULTIVERS DEFI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Navigation Tabs */}
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                {[
                  { id: "omniscient", label: "OMNISCIENT", icon: Globe },
                  { id: "graal", label: "GRAAL AI", icon: Cpu },
                  { id: "mev", label: "MEV GOD", icon: Zap },
                  { id: "quantum", label: "QUANTUM", icon: InfinityIcon },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${
                      activeTab === t.id
                        ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <t.icon size={14} />
                    {t.label}
                  </button>
                ))}
              </div>

              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500 transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.05) 0%, transparent 70%)" }} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-full p-8"
              >
                {activeTab === "omniscient" && (
                  <div className="max-w-[1400px] mx-auto">
                    <OmniscientDashboard walletConnected={true} />
                  </div>
                )}
                
                {activeTab === "graal" && (
                  <div className="rounded-2xl overflow-hidden border border-[#d4af37]/20 relative">
                    <GraalDashboard />
                  </div>
                )}
                
                {activeTab === "mev" && (
                  <div className="rounded-2xl border border-[#d4af37]/20 bg-black/40 p-4">
                     <GodModePanel />
                  </div>
                )}

                {activeTab === "quantum" && (
                  <div className="rounded-2xl border border-[#d4af37]/20 bg-black/40 p-4 h-[80vh]">
                     <QuantumOrchestratorPanel />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
