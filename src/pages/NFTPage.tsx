import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { PageHero } from "../components/PageHero";
import NFTSection from "../components/NFTSection";
import CollectionSection from "../components/CollectionSection";

export default function NFTPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="NFT · MARKETPLACE EXCLUSIVE"
        icon={ShoppingBag}
        title="NFT & Collections"
        highlight="Collections"
        description="Explorez, créez et échangez des NFT premium sur notre marketplace exclusive. Accédez aux collections les plus rares de l'univers blockchain THESORIA."
        bgImageIndex={3}
        stats={[
          { label: "COLLECTIONS",    value: "1 840+",    color: "#d4af37" },
          { label: "VOLUME TOTAL",   value: "$340M",     color: "#f0e68c" },
          { label: "ARTISTES",       value: "6 200+",    color: "#c084fc" },
        ]}
      />
      <div className="pt-0">
        <NFTSection />
        <CollectionSection />
      </div>
    </motion.div>
  );
}
