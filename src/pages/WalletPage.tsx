import { motion } from "motion/react";
import { Wallet } from "lucide-react";
import { PageHero } from "../components/PageHero";
import WalletSection from "../components/WalletSection";
import WalletCreationPage from "../components/WalletCreationPage";
import CardCreationSection from "../components/CardCreationSection";
import CardixIntegration from "../components/CardixIntegration";
import ProfitTransferSection from "../components/ProfitTransferSection";

export default function WalletPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="WALLET · MULTI-CHAIN"
        icon={Wallet}
        title="Wallet & Cartes"
        highlight="Wallet"
        description="Créez votre wallet interchain, gérez vos actifs et commandez votre carte crypto premium via Cardix. Sécurité bancaire suisse, accès mondial."
        bgImageIndex={0}
        stats={[
          { label: "CHAINS",         value: "24 Réseaux", color: "#d4af37" },
          { label: "SÉCURITÉ",       value: "AES-256",    color: "#f0e68c" },
          { label: "CARTE CARDIX",   value: "Disponible", color: "#a3e635" },
        ]}
      />
      <div className="pt-0">
        <ProfitTransferSection />
        <WalletSection />
        <section id="wallet-creation">
          <WalletCreationPage />
        </section>
        <CardixIntegration />
        <CardCreationSection />
      </div>
    </motion.div>
  );
}