import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { PageHero } from "../components/PageHero";
import DomainSection from "../components/DomainSection";
import TokenizationSection from "../components/TokenizationSection";
import SmartContractStudio from "../components/SmartContractStudio";
import LotterySection from "../components/LotterySection";
import MiningSection from "../components/MiningSection";
import SecureMessagingSection from "../components/SecureMessagingSection";
import Web3Section from "../components/Web3Section";

export default function ServicesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="SERVICES · ÉCOSYSTÈME COMPLET"
        icon={Globe}
        title="Services THESORIA"
        highlight="THESORIA"
        description="Domaines blockchain, tokenisation, création de smart contracts institutionnels, messagerie sécurisée et intégration Web3. Tout l'écosystème THESORIA à portée de main."
        bgImageIndex={0}
        stats={[
          { label: "SERVICES",       value: "16 Actifs",  color: "#d4af37" },
          { label: "CONTRATS",       value: "Audités",    color: "#f0e68c" },
          { label: "CLIENTS",        value: "28 400+",    color: "#67e8f9" },
        ]}
      />
      <div className="pt-0">
        <SmartContractStudio />
        <DomainSection />
        <TokenizationSection />
        <LotterySection />
        <MiningSection />
        <SecureMessagingSection />
        <Web3Section />
      </div>
    </motion.div>
  );
}
