import { motion } from "motion/react";
import { Brain } from "lucide-react";
import { PageHero } from "../components/PageHero";
import AIAgentSection from "../components/AIAgentSection";
import AICommandCenter from "../components/AICommandCenter";

export default function AIPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="IA MAÎTRE · NEURAL ENGINE"
        icon={Brain}
        title="Intelligence Artificielle"
        highlight="Intelligence"
        description="Agents IA autonomes et centre de commande pour l'optimisation de vos stratégies blockchain. Prédictions neurales, DAO governance et alpha generation en temps réel."
        bgImageIndex={3}
        stats={[
          { label: "PRÉCISION",      value: "97.8%",     color: "#d4af37" },
          { label: "AGENTS ACTIFS",  value: "48 IA",     color: "#c084fc" },
          { label: "ALPHA GÉNÉRÉ",   value: "+$1.2M",    color: "#f0e68c" },
        ]}
      />
      <div className="pt-0">
        <AIAgentSection />
        <AICommandCenter />
      </div>
    </motion.div>
  );
}
