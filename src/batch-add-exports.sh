#!/bin/bash

# Script pour ajouter automatiquement export default à tous les composants

components=(
  "SecondaryHero"
  "ThirdHero"
  "FourthHero"
  "FifthHero"
  "SixthHero"
  "BlockchainVisualization"
  "CryptoMarketSection"
  "DomainSection"
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

for comp in "${components[@]}"; do
  file="components/${comp}.tsx"
  
  if [ -f "$file" ]; then
    # Vérifier si export default existe déjà
    if ! grep -q "export default $comp" "$file"; then
      echo "" >> "$file"
      echo "export default $comp;" >> "$file"
      echo "✅ Added export default to $file"
    else
      echo "⏭️  Skipped $file (already has export default)"
    fi
  else
    echo "❌ File not found: $file"
  fi
done

echo "🎉 Done!"
