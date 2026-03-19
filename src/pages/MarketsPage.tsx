import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { PageHero } from "../components/PageHero";
import CryptoMarketSection from "../components/CryptoMarketSection";

export default function MarketsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="MARCHÉS · TEMPS RÉEL"
        icon={TrendingUp}
        title="Marchés Crypto"
        highlight="Marchés"
        description="Suivez les marchés en temps réel avec des données premium, des analyses avancées et des signaux exclusifs issus de l'intelligence artificielle THESORIA."
        bgImageIndex={1}
        stats={[
          { label: "ACTIFS SUIVIS",  value: "4 200+",  color: "#d4af37" },
          { label: "VOLUME 24H",     value: "$2.4T",    color: "#f0e68c" },
          { label: "PRÉCISION IA",   value: "94.7%",    color: "#a3e635" },
        ]}
      />
      <div className="pt-0">
        <CryptoMarketSection />
      </div>
    </motion.div>
  );
}
