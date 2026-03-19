import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { PageHero } from "../components/PageHero";
import LendingSection from "../components/LendingSection";
import StakingSection from "../components/StakingSection";
import BridgeSection from "../components/BridgeSection";
import { VaultSection } from "../components/VaultSectionSimple";
import AavePage from "../components/AavePage";

export default function DeFiPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="DeFi · PROTOCOLES AVANCÉS"
        icon={Layers}
        title="DeFi Hub"
        highlight="DeFi"
        description="Lending, Staking, Bridge, Vaults et intégration AAVE — tous vos outils DeFi en un seul endroit. Optimisé par l'IA pour maximiser vos rendements."
        bgImageIndex={2}
        stats={[
          { label: "TVL TOTAL",      value: "$18.6B",  color: "#d4af37" },
          { label: "APY MOYEN",      value: "34.2%",   color: "#f0e68c" },
          { label: "PROTOCOLES",     value: "12 Live", color: "#67e8f9" },
        ]}
      />
      <div className="pt-0">
        <LendingSection />
        <StakingSection />
        <BridgeSection />
        <VaultSection />
        <AavePage />
      </div>
    </motion.div>
  );
}
