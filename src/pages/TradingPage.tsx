import { motion } from "motion/react";
import { Shield } from "lucide-react";
import { PageHero } from "../components/PageHero";
import LiveTradingDashboard from "../components/LiveTradingDashboard";
import FlashLoanBotSection from "../components/FlashLoanBotSection";
import CowFlashLoanSection from "../components/CowFlashLoanSection";

export default function TradingPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="TRADING · FLASH LOANS"
        icon={Shield}
        title="Trading & Flash Loans"
        highlight="Flash Loans"
        description="Dashboard de trading en temps réel, bots de Flash Loans et intégration CoW Protocol. Exécutez des stratégies avancées avec une précision chirurgicale."
        bgImageIndex={1}
        stats={[
          { label: "TRADES/JOUR",    value: "14 800+",  color: "#d4af37" },
          { label: "WIN RATE",       value: "91.3%",    color: "#a3e635" },
          { label: "PROFIT TOTAL",   value: "+$2.84M",  color: "#f0e68c" },
        ]}
      />
      <div className="pt-0">
        <LiveTradingDashboard />
        <FlashLoanBotSection />
        <CowFlashLoanSection />
      </div>
    </motion.div>
  );
}
