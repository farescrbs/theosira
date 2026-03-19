"""
💰 THESORIA - Calculateur de Profit Net EXACT
==============================================

Formule de Profit Net (LE GRAAL):
Profit Net = Profit Brut - (Coût Gas + Prime Flash Loan)

Où:
- Profit Brut = Solde Final Token - (Montant Emprunté + Prime)
- Coût Gas = Gas utilisé * Gas price effectif (en ETH)
- Prime Flash Loan = Montant emprunté * 0.0005 (0.05% Aave V3)

PRÉCISION ABSOLUE: Calculs en Wei pour éviter erreurs d'arrondi
"""

from typing import Dict, Tuple
from web3 import Web3
from decimal import Decimal, getcontext
import logging

logger = logging.getLogger(__name__)

# Précision décimale maximale
getcontext().prec = 50


class ProfitCalculator:
    """
    Calculateur de profit net EXACT
    
    Garantit des calculs précis au Wei près
    """
    
    # Frais Aave V3 Flash Loan: 0.05%
    AAVE_V3_FEE_RATE = Decimal('0.0005')
    
    def __init__(self, w3: Web3, eth_price_usd: float = 2000.0):
        """
        Initialise le calculateur
        
        Args:
            w3: Instance Web3
            eth_price_usd: Prix ETH en USD (mis à jour en temps réel)
        """
        self.w3 = w3
        self.eth_price_usd = Decimal(str(eth_price_usd))
    
    def calculate_flash_loan_fee(
        self,
        amount_borrowed_wei: int,
        token_decimals: int = 6
    ) -> int:
        """
        Calcule la prime du Flash Loan Aave V3
        
        Args:
            amount_borrowed_wei: Montant emprunté en wei
            token_decimals: Décimales du token (6 pour USDC)
        
        Returns:
            Prime en wei
        """
        # Convertir en Decimal pour précision
        amount = Decimal(amount_borrowed_wei)
        
        # Calculer frais: montant * 0.05%
        fee = amount * self.AAVE_V3_FEE_RATE
        
        # Arrondir au wei supérieur (pour être sûr)
        fee_wei = int(fee.to_integral_value())
        
        return fee_wei
    
    def calculate_gross_profit(
        self,
        final_balance_wei: int,
        amount_borrowed_wei: int,
        flash_loan_fee_wei: int
    ) -> int:
        """
        Calcule le profit BRUT
        
        Formule: Solde Final - (Montant Emprunté + Prime)
        
        Args:
            final_balance_wei: Solde final du token dans le contrat
            amount_borrowed_wei: Montant emprunté
            flash_loan_fee_wei: Prime calculée
        
        Returns:
            Profit brut en wei (peut être négatif!)
        """
        total_to_repay = amount_borrowed_wei + flash_loan_fee_wei
        gross_profit_wei = final_balance_wei - total_to_repay
        
        return gross_profit_wei
    
    def calculate_gas_cost(
        self,
        gas_used: int,
        effective_gas_price_wei: int
    ) -> Tuple[int, Decimal]:
        """
        Calcule le coût du gas en ETH et USD
        
        Args:
            gas_used: Gas utilisé (ex: 487234)
            effective_gas_price_wei: Prix effectif du gas en wei
        
        Returns:
            (gas_cost_wei, gas_cost_usd)
        """
        # Coût en Wei
        gas_cost_wei = gas_used * effective_gas_price_wei
        
        # Coût en ETH
        gas_cost_eth = Decimal(gas_cost_wei) / Decimal(10**18)
        
        # Coût en USD
        gas_cost_usd = gas_cost_eth * self.eth_price_usd
        
        return gas_cost_wei, gas_cost_usd
    
    def calculate_net_profit(
        self,
        gross_profit_wei: int,
        gas_cost_wei: int,
        token_decimals: int = 6,
        token_price_usd: Decimal = None
    ) -> Dict:
        """
        Calcule le PROFIT NET (LE GRAAL!)
        
        Formule: Profit Net = Profit Brut - Coût Gas
        
        Args:
            gross_profit_wei: Profit brut en wei (token)
            gas_cost_wei: Coût gas en wei (ETH)
            token_decimals: Décimales du token
            token_price_usd: Prix du token en USD (None = stablecoin)
        
        Returns:
            {
                'net_profit_wei': int,
                'net_profit_token': Decimal,
                'net_profit_usd': Decimal,
                'gross_profit_wei': int,
                'gross_profit_usd': Decimal,
                'gas_cost_eth': Decimal,
                'gas_cost_usd': Decimal,
                'roi_percent': Decimal,
            }
        """
        # Convertir gross profit en token (unités)
        gross_profit_token = Decimal(gross_profit_wei) / Decimal(10**token_decimals)
        
        # Prix du token (défaut = $1 pour stablecoins)
        if token_price_usd is None:
            token_price_usd = Decimal('1.0')
        
        # Profit brut en USD
        gross_profit_usd = gross_profit_token * token_price_usd
        
        # Coût gas en ETH et USD
        gas_cost_eth = Decimal(gas_cost_wei) / Decimal(10**18)
        gas_cost_usd = gas_cost_eth * self.eth_price_usd
        
        # PROFIT NET en USD
        net_profit_usd = gross_profit_usd - gas_cost_usd
        
        # ROI en %
        roi_percent = (net_profit_usd / gas_cost_usd * Decimal('100')) if gas_cost_usd > 0 else Decimal('0')
        
        logger.info(f"\n💰 CALCUL PROFIT NET:")
        logger.info(f"   Profit brut: {gross_profit_token:.6f} {token_decimals == 6 and 'USDC' or 'tokens'}")
        logger.info(f"   Profit brut: ${gross_profit_usd:.2f}")
        logger.info(f"   Coût gas: {gas_cost_eth:.6f} ETH")
        logger.info(f"   Coût gas: ${gas_cost_usd:.2f}")
        logger.info(f"   PROFIT NET: ${net_profit_usd:.2f}")
        logger.info(f"   ROI: {roi_percent:.2f}%")
        
        return {
            'net_profit_wei': int(gross_profit_usd * Decimal(10**6) - gas_cost_usd * Decimal(10**6)),
            'net_profit_token': gross_profit_token,
            'net_profit_usd': net_profit_usd,
            'net_profit_eth': net_profit_usd / self.eth_price_usd,
            'gross_profit_wei': gross_profit_wei,
            'gross_profit_usd': gross_profit_usd,
            'gas_cost_wei': gas_cost_wei,
            'gas_cost_eth': gas_cost_eth,
            'gas_cost_usd': gas_cost_usd,
            'roi_percent': roi_percent,
        }
    
    def calculate_complete_profit(
        self,
        amount_borrowed_wei: int,
        final_balance_wei: int,
        gas_used: int,
        effective_gas_price_wei: int,
        token_decimals: int = 6,
        token_price_usd: Decimal = None
    ) -> Dict:
        """
        Calcule le profit complet en UNE SEULE fois
        
        Pipeline complet:
        1. Prime Flash Loan
        2. Profit Brut
        3. Coût Gas
        4. Profit Net
        
        Args:
            amount_borrowed_wei: Montant emprunté (ex: 10000 * 10^6 pour $10k USDC)
            final_balance_wei: Solde final dans le contrat après swaps
            gas_used: Gas utilisé (ex: 487234)
            effective_gas_price_wei: Prix gas effectif en wei
            token_decimals: Décimales (6 pour USDC)
            token_price_usd: Prix token en USD
        
        Returns:
            Dict complet avec toutes les métriques
        """
        logger.info(f"\n{'='*60}")
        logger.info(f"💰 CALCUL PROFIT COMPLET")
        logger.info(f"{'='*60}")
        
        # 1. Prime Flash Loan
        flash_loan_fee_wei = self.calculate_flash_loan_fee(
            amount_borrowed_wei,
            token_decimals
        )
        
        flash_loan_fee_token = Decimal(flash_loan_fee_wei) / Decimal(10**token_decimals)
        logger.info(f"1️⃣  Prime Flash Loan: {flash_loan_fee_token:.6f} tokens ({flash_loan_fee_wei} wei)")
        
        # 2. Profit Brut
        gross_profit_wei = self.calculate_gross_profit(
            final_balance_wei,
            amount_borrowed_wei,
            flash_loan_fee_wei
        )
        
        if gross_profit_wei <= 0:
            logger.error(f"❌ Profit brut négatif: {gross_profit_wei}")
            return {
                'success': False,
                'error': 'Profit brut négatif',
                'gross_profit_wei': gross_profit_wei,
            }
        
        # 3. Coût Gas
        gas_cost_wei, gas_cost_usd = self.calculate_gas_cost(
            gas_used,
            effective_gas_price_wei
        )
        
        # 4. Profit Net
        profit_metrics = self.calculate_net_profit(
            gross_profit_wei,
            gas_cost_wei,
            token_decimals,
            token_price_usd
        )
        
        # Ajouter infos supplémentaires
        profit_metrics['success'] = True
        profit_metrics['flash_loan_fee_wei'] = flash_loan_fee_wei
        profit_metrics['flash_loan_fee_usd'] = float(flash_loan_fee_token)
        profit_metrics['amount_borrowed_wei'] = amount_borrowed_wei
        profit_metrics['final_balance_wei'] = final_balance_wei
        
        logger.info(f"{'='*60}\n")
        
        return profit_metrics
    
    def update_eth_price(self, new_price: float):
        """Met à jour le prix ETH"""
        self.eth_price_usd = Decimal(str(new_price))
        logger.info(f"💱 Prix ETH mis à jour: ${new_price:.2f}")


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

def example_calculation():
    """Exemple de calcul complet"""
    from web3 import Web3
    
    # Setup
    w3 = Web3()
    calculator = ProfitCalculator(w3, eth_price_usd=2000.0)
    
    print("\n" + "="*60)
    print("💰 EXEMPLE: Calcul Profit Flash Loan")
    print("="*60)
    
    # Scénario: Flash Loan $10,000 USDC
    print("\n📊 SCÉNARIO:")
    print("   Montant emprunté: $10,000 USDC")
    print("   Spread détecté: 1.85%")
    print("   Profit brut estimé: $185")
    print("   Gas utilisé: 487,234")
    print("   Gas price: 30 Gwei")
    
    # Paramètres
    amount_borrowed = 10_000  # $10k
    amount_borrowed_wei = amount_borrowed * 10**6  # USDC a 6 décimales
    
    # Après exécution des swaps
    # Profit brut: $185 → Final balance = $10,185
    gross_profit_expected = 185
    final_balance_wei = (amount_borrowed + gross_profit_expected) * 10**6
    
    # Gas
    gas_used = 487_234
    gas_price_gwei = 30
    gas_price_wei = gas_price_gwei * 10**9
    
    # CALCUL
    result = calculator.calculate_complete_profit(
        amount_borrowed_wei=amount_borrowed_wei,
        final_balance_wei=final_balance_wei,
        gas_used=gas_used,
        effective_gas_price_wei=gas_price_wei,
        token_decimals=6,
        token_price_usd=Decimal('1.0')  # USDC = $1
    )
    
    if result['success']:
        print("\n" + "="*60)
        print("✅ RÉSULTAT FINAL")
        print("="*60)
        print(f"Profit Brut: ${result['gross_profit_usd']:.2f}")
        print(f"Coût Gas: ${result['gas_cost_usd']:.2f}")
        print(f"Prime Flash Loan: ${result['flash_loan_fee_usd']:.2f}")
        print(f"\n💰 PROFIT NET: ${result['net_profit_usd']:.2f}")
        print(f"   En ETH: {result['net_profit_eth']:.6f} ETH")
        print(f"   ROI: {result['roi_percent']:.2f}%")
        print("="*60 + "\n")
    else:
        print(f"\n❌ ÉCHEC: {result['error']}\n")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(message)s'
    )
    
    example_calculation()
