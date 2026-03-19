import HeroSection from "../components/HeroSection";
import SecondaryHero from "../components/SecondaryHero";
import ThirdHero from "../components/ThirdHero";
import FourthHero from "../components/FourthHero";
import FifthHero from "../components/FifthHero";
import SixthHero from "../components/SixthHero";
import BlockchainVisualization from "../components/BlockchainVisualization";
import RealtimeStats from "../components/RealtimeStats";
import PremiumSection from "../components/PremiumSection";
import ExperienceSection from "../components/ExperienceSection";
import TestimonialsSection from "../components/TestimonialsSection";
import NewsSection from "../components/NewsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SecondaryHero />
      <ThirdHero />
      <FourthHero />
      <FifthHero />
      <SixthHero />
      <BlockchainVisualization />
      <RealtimeStats />
      <PremiumSection />
      <ExperienceSection />
      <TestimonialsSection />
      <NewsSection />
    </>
  );
}
