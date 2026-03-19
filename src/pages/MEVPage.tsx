import { motion } from "motion/react";
import { Zap, Target } from "lucide-react";
import { PageHero } from "../components/PageHero";
import FlashLoanGodMode from "../components/FlashLoanGodMode";
import FlashBotDashboard from "../components/FlashBotDashboard";
import GodModePanel from "../components/GodModePanel";

export default function MEVPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="MEV GOD · ARBITRAGE MAXIMAL"
        icon={Zap}
        title="MEV God Mode"
        highlight="God Mode"
        description="Flash Loan God Mode, FlashBot Dashboard et panneau de contrôle avancé pour le MEV. Dominez la mempool avec une intelligence artificielle de niveau institutionnel."
        bgImageIndex={2}
        stats={[
          { label: "PROFIT MEV",     value: "+$847K",   color: "#d4af37" },
          { label: "TX CAPTURÉES",   value: "22 400+",  color: "#f0e68c" },
          { label: "LATENCE",        value: "< 12ms",   color: "#f87171" },
        ]}
      />
      <div className="flex justify-center -mt-16 mb-16 relative z-20">
        <motion.button
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-god-mode'))}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-black border border-[#d4af37]/50 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-all group"
        >
          <Target className="w-5 h-5 text-[#d4af37] group-hover:rotate-180 transition-transform duration-700" />
          <span className="text-[#d4af37] font-bold tracking-[0.2em] text-sm">
            OUVRIR LE CONTRÔLE ABSOLU (G)
          </span>
        </motion.button>
      </div>
      <div className="pt-0">
        <FlashLoanGodMode />
        <FlashBotDashboard />
        <GodModePanel />
      </div>
    </motion.div>
  );
}
