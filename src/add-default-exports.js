/**
 * Script pour ajouter automatiquement export default à tous les composants
 */

const components = [
  "HeroSection",
  "SecondaryHero",
  "ThirdHero",
  "FourthHero",
  "FifthHero",
  "SixthHero",
  "BlockchainVisualization",
  "CryptoMarketSection",
  "DomainSection",
  "TokenizationSection",
  "LotterySection",
  "LendingSection",
  "StakingSection",
  "NFTSection",
  "BridgeSection",
  "WalletSection",
  "CardCreationSection",
  "SecureMessagingSection",
  "AIAgentSection",
  "MiningSection",
  "GodModePanel",
  "LiveTradingDashboard",
  "FlashLoanGodMode",
  "FlashLoanBotSection",
  "CowFlashLoanSection",
  "AICommandCenter",
  "FlashBotDashboard",
  "CollectionSection",
  "PremiumSection",
  "ExperienceSection",
  "TestimonialsSection",
  "NewsSection",
  "Footer",
  "SystemHealthDashboard",
];

// Instructions pour ajouter manuellement
console.log("=".repeat(80));
console.log("AJOUTER 'export default ComponentName;' À LA FIN DE CES FICHIERS:");
console.log("=".repeat(80));
components.forEach(comp => {
  console.log(`/components/${comp}.tsx → export default ${comp};`);
});
console.log("=".repeat(80));
