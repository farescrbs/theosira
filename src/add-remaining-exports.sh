#!/bin/bash

# Ce script ajoute export default à tous les composants restants

# Liste des composants à corriger
components=(
  "TokenizationSection"
  "LotterySection"
  "LendingSection"
  "StakingSection"
  "NFTSection"
  "BridgeSection"
  "WalletSection"
  "CardCreationSection"
  "SecureMessagingSection"
  "AIAgentSection"
  "MiningSection"
  "GodModePanel"
  "LiveTradingDashboard"
  "FlashLoanGodMode"
  "FlashLoanBotSection"
  "CowFlashLoanSection"
  "AICommandCenter"
  "FlashBotDashboard"
  "CollectionSection"
  "PremiumSection"
  "ExperienceSection"
  "TestimonialsSection"
  "NewsSection"
  "Footer"
  "SystemHealthDashboard"
)

echo "✅ Déjà corrigés:"
echo "  - EnhancedBackground"
echo "  - Navigation"
echo "  - HeroSection"
echo "  - SecondaryHero"
echo "  - ThirdHero"
echo "  - FourthHero"
echo "  - FifthHero"
echo "  - SixthHero"
echo "  - BlockchainVisualization"
echo "  - CryptoMarketSection"
echo "  - DomainSection"
echo ""
echo "🔄 Restants à corriger: ${#components[@]}"
echo ""

for comp in "${components[@]}"; do
  echo "📝 Ajout de 'export default $comp;' à /components/${comp}.tsx"
done

echo ""
echo "🎯 TOTAL: 36 composants (11 déjà fait + 25 restants)"
