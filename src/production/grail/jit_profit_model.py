"""
💰 THESORIA - JIT Profit Mathematical Model
============================================

Modélisation mathématique EXACTE du profit JIT:

1. Calcul tick range optimal
2. Calcul liquidité nécessaire
3. Simulation swap impact
4. Calcul frais capturés
5. ROI instantané

Formules Uniswap V3:
- sqrtPriceX96 = sqrt(price) * 2^96
- liquidity = amount / (sqrt(pb) - sqrt(pa))
- fees = amountIn * feeRate * (ourLiquidity / totalLiquidity)
"""

import logging
from typing import Dict, Tuple, Optional
from decimal import Decimal, getcontext
import math

logger = logging.getLogger(__name__)

# Précision Decimal
getcontext().prec = 50


class JITProfitModel:
    """
    Modèle mathématique pour calculer profit JIT
    
    Implémente les formules exactes Uniswap V3
    """
    
    # Constantes Uniswap V3
    Q96 = 2**96
    Q128 = 2**128
    
    # Min/Max tick
    MIN_TICK = -887272
    MAX_TICK = 887272
    
    def __init__(self):
        """Initialise le modèle"""
        logger.info(f"💰 JIT Profit Model initialisé")
    
    def sqrt_price_x96_to_price(
        self,
        sqrt_price_x96: int,
        decimals0: int = 18,
        decimals1: int = 18
    ) -> Decimal:
        """
        Convertit sqrtPriceX96 en prix réel
        
        price = (sqrtPriceX96 / 2^96)^2 * (10^decimals1 / 10^decimals0)
        
        Args:
            sqrt_price_x96: sqrt price encodé
            decimals0: Decimals token0
            decimals1: Decimals token1
        
        Returns:
            Prix (token1 / token0)
        """
        sqrt_price = Decimal(sqrt_price_x96) / Decimal(self.Q96)
        price = sqrt_price ** 2
        
        # Ajuster pour decimals
        decimal_adjustment = Decimal(10 ** decimals1) / Decimal(10 ** decimals0)
        price_adjusted = price * decimal_adjustment
        
        return price_adjusted
    
    def price_to_sqrt_price_x96(
        self,
        price: Decimal,
        decimals0: int = 18,
        decimals1: int = 18
    ) -> int:
        """
        Convertit prix en sqrtPriceX96
        
        Args:
            price: Prix (token1 / token0)
            decimals0: Decimals token0
            decimals1: Decimals token1
        
        Returns:
            sqrtPriceX96
        """
        # Ajuster pour decimals
        decimal_adjustment = Decimal(10 ** decimals0) / Decimal(10 ** decimals1)
        price_adjusted = price * decimal_adjustment
        
        sqrt_price = price_adjusted.sqrt()
        sqrt_price_x96 = int(sqrt_price * Decimal(self.Q96))
        
        return sqrt_price_x96
    
    def tick_to_sqrt_price_x96(self, tick: int) -> int:
        """
        Convertit tick en sqrtPriceX96
        
        sqrtPriceX96 = 1.0001^(tick/2) * 2^96
        
        Args:
            tick: Tick
        
        Returns:
            sqrtPriceX96
        """
        sqrt_ratio = Decimal('1.0001') ** (Decimal(tick) / 2)
        sqrt_price_x96 = int(sqrt_ratio * Decimal(self.Q96))
        
        return sqrt_price_x96
    
    def sqrt_price_x96_to_tick(self, sqrt_price_x96: int) -> int:
        """
        Convertit sqrtPriceX96 en tick
        
        tick = log(sqrtPriceX96 / 2^96, 1.0001) * 2
        
        Args:
            sqrt_price_x96: sqrtPriceX96
        
        Returns:
            Tick
        """
        sqrt_ratio = Decimal(sqrt_price_x96) / Decimal(self.Q96)
        
        # log base 1.0001
        # log_base_b(x) = ln(x) / ln(b)
        tick = (sqrt_ratio.ln() / Decimal('1.0001').ln()) * 2
        
        return int(tick)
    
    def calculate_optimal_tick_range(
        self,
        current_tick: int,
        tick_spacing: int = 60,
        range_width_ticks: int = 60
    ) -> Tuple[int, int]:
        """
        Calcule le tick range optimal pour JIT
        
        Stratégie: Range TRÈS étroit autour du prix actuel
        
        Args:
            current_tick: Tick actuel
            tick_spacing: Tick spacing du pool
            range_width_ticks: Largeur du range (en tick spacing)
        
        Returns:
            (tick_lower, tick_upper)
        """
        # Aligner current_tick sur tick_spacing
        tick_lower = (current_tick // tick_spacing) * tick_spacing
        tick_upper = tick_lower + (range_width_ticks // tick_spacing) * tick_spacing
        
        # Vérifier limites
        tick_lower = max(tick_lower, self.MIN_TICK)
        tick_upper = min(tick_upper, self.MAX_TICK)
        
        return (tick_lower, tick_upper)
    
    def calculate_liquidity_for_amounts(
        self,
        sqrt_price_x96: int,
        sqrt_price_a_x96: int,
        sqrt_price_b_x96: int,
        amount0: int,
        amount1: int
    ) -> int:
        """
        Calcule la liquidité pour des montants donnés
        
        Formules Uniswap V3:
        - Si prix < lower: L = amount0 * (sqrtB * sqrtA) / (sqrtB - sqrtA)
        - Si prix > upper: L = amount1 / (sqrtB - sqrtA)
        - Sinon: L = min(L0, L1)
        
        Args:
            sqrt_price_x96: Prix actuel
            sqrt_price_a_x96: Prix lower bound
            sqrt_price_b_x96: Prix upper bound
            amount0: Montant token0
            amount1: Montant token1
        
        Returns:
            Liquidité
        """
        if sqrt_price_x96 <= sqrt_price_a_x96:
            # Prix en dessous du range
            liquidity = self._get_liquidity_for_amount0(
                sqrt_price_a_x96,
                sqrt_price_b_x96,
                amount0
            )
        
        elif sqrt_price_x96 >= sqrt_price_b_x96:
            # Prix au-dessus du range
            liquidity = self._get_liquidity_for_amount1(
                sqrt_price_a_x96,
                sqrt_price_b_x96,
                amount1
            )
        
        else:
            # Prix dans le range
            liquidity0 = self._get_liquidity_for_amount0(
                sqrt_price_x96,
                sqrt_price_b_x96,
                amount0
            )
            
            liquidity1 = self._get_liquidity_for_amount1(
                sqrt_price_a_x96,
                sqrt_price_x96,
                amount1
            )
            
            liquidity = min(liquidity0, liquidity1)
        
        return liquidity
    
    def _get_liquidity_for_amount0(
        self,
        sqrt_price_a_x96: int,
        sqrt_price_b_x96: int,
        amount0: int
    ) -> int:
        """
        L = amount0 * (sqrtB * sqrtA) / (sqrtB - sqrtA)
        """
        if sqrt_price_a_x96 > sqrt_price_b_x96:
            sqrt_price_a_x96, sqrt_price_b_x96 = sqrt_price_b_x96, sqrt_price_a_x96
        
        intermediate = (sqrt_price_a_x96 * sqrt_price_b_x96) // self.Q96
        
        liquidity = (amount0 * intermediate) // (sqrt_price_b_x96 - sqrt_price_a_x96)
        
        return liquidity
    
    def _get_liquidity_for_amount1(
        self,
        sqrt_price_a_x96: int,
        sqrt_price_b_x96: int,
        amount1: int
    ) -> int:
        """
        L = amount1 / (sqrtB - sqrtA)
        """
        if sqrt_price_a_x96 > sqrt_price_b_x96:
            sqrt_price_a_x96, sqrt_price_b_x96 = sqrt_price_b_x96, sqrt_price_a_x96
        
        liquidity = (amount1 * self.Q96) // (sqrt_price_b_x96 - sqrt_price_a_x96)
        
        return liquidity
    
    def calculate_swap_impact(
        self,
        liquidity: int,
        sqrt_price_x96: int,
        amount_in: int,
        zero_for_one: bool,
        fee_rate: int = 3000
    ) -> Dict:
        """
        Calcule l'impact d'un swap sur le prix
        
        Args:
            liquidity: Liquidité du pool
            sqrt_price_x96: Prix actuel
            amount_in: Montant swap
            zero_for_one: Direction (token0 → token1)
            fee_rate: Fee (3000 = 0.3%)
        
        Returns:
            {
                'sqrt_price_next': int,
                'amount_in': int,
                'amount_out': int,
                'fee_amount': int,
            }
        """
        # Fee
        amount_in_minus_fee = amount_in * (1_000_000 - fee_rate) // 1_000_000
        fee_amount = amount_in - amount_in_minus_fee
        
        # Calculer nouveau prix
        if zero_for_one:
            # Vendre token0 pour token1
            # sqrtPriceNext = L * sqrtPrice / (L + amountIn * sqrtPrice)
            denominator = liquidity * self.Q96 + amount_in_minus_fee * sqrt_price_x96
            sqrt_price_next = (liquidity * sqrt_price_x96 * self.Q96) // denominator
        else:
            # Acheter token0 avec token1
            # sqrtPriceNext = sqrtPrice + amountIn / L
            sqrt_price_next = sqrt_price_x96 + (amount_in_minus_fee * self.Q96) // liquidity
        
        # Calculer amount_out
        if zero_for_one:
            amount_out = (liquidity * (sqrt_price_x96 - sqrt_price_next)) // self.Q96
        else:
            amount_out = (liquidity * (sqrt_price_next - sqrt_price_x96) * self.Q96) // (sqrt_price_next * sqrt_price_x96)
        
        return {
            'sqrt_price_next': sqrt_price_next,
            'amount_in_after_fee': amount_in_minus_fee,
            'amount_out': amount_out,
            'fee_amount': fee_amount,
        }
    
    def calculate_jit_profit(
        self,
        swap_params: Dict,
        pool_state: Dict,
        jit_liquidity_usd: Decimal
    ) -> Dict:
        """
        Calcule le profit JIT complet
        
        Args:
            swap_params: Paramètres du swap (décodés)
            pool_state: État actuel du pool
            jit_liquidity_usd: Liquidité JIT à injecter ($)
        
        Returns:
            Profit model complet
        """
        logger.info(f"\n💰 CALCUL PROFIT JIT")
        
        # Extraire données
        amount_in = swap_params.get('amountIn', 0)
        fee_rate = pool_state.get('fee', 3000)
        current_liquidity = pool_state.get('liquidity', 0)
        sqrt_price_x96 = pool_state.get('sqrtPriceX96', 0)
        current_tick = pool_state.get('tick', 0)
        tick_spacing = pool_state.get('tickSpacing', 60)
        
        # 1. TICK RANGE OPTIMAL
        tick_lower, tick_upper = self.calculate_optimal_tick_range(
            current_tick,
            tick_spacing,
            range_width_ticks=60
        )
        
        logger.info(f"   Tick range: {tick_lower} → {tick_upper}")
        
        # 2. LIQUIDITÉ JIT
        # Convertir USD en tokens
        # Pour simplification: 50% token0, 50% token1
        # TODO: Calculer ratio exact selon prix
        
        token0_usd = jit_liquidity_usd / 2
        token1_usd = jit_liquidity_usd / 2
        
        # Convertir en Wei (assume 18 decimals)
        token0_amount = int(token0_usd * Decimal(10**18))
        token1_amount = int(token1_usd * Decimal(10**18))
        
        sqrt_price_a_x96 = self.tick_to_sqrt_price_x96(tick_lower)
        sqrt_price_b_x96 = self.tick_to_sqrt_price_x96(tick_upper)
        
        jit_liquidity = self.calculate_liquidity_for_amounts(
            sqrt_price_x96,
            sqrt_price_a_x96,
            sqrt_price_b_x96,
            token0_amount,
            token1_amount
        )
        
        logger.info(f"   JIT liquidity: {jit_liquidity:,}")
        logger.info(f"   Pool liquidity: {current_liquidity:,}")
        
        # 3. SIMULATION SWAP
        total_liquidity = current_liquidity + jit_liquidity
        
        swap_result = self.calculate_swap_impact(
            liquidity=total_liquidity,
            sqrt_price_x96=sqrt_price_x96,
            amount_in=amount_in,
            zero_for_one=True,  # Assume token0 → token1
            fee_rate=fee_rate
        )
        
        total_fees = swap_result['fee_amount']
        
        logger.info(f"   Total fees: {total_fees:,}")
        
        # 4. NOTRE PART DES FRAIS
        # fees_captured = total_fees * (jit_liquidity / total_liquidity)
        
        our_fee_share = (total_fees * jit_liquidity) // total_liquidity
        
        logger.info(f"   Our fee share: {our_fee_share:,}")
        
        # 5. CONVERTIR EN USD
        # Assume fee en token0, prix = $1 (USDC)
        # TODO: Utiliser prix réel
        our_fees_usd = Decimal(our_fee_share) / Decimal(10**18)
        
        # 6. ROI
        roi = (our_fees_usd / jit_liquidity_usd) * Decimal('100')
        
        # 7. ROI ANNUALISÉ
        # Temps immobilisation: 12 secondes (1 bloc)
        blocks_per_year = 365 * 24 * 3600 // 12
        roi_annualized = roi * Decimal(blocks_per_year)
        
        logger.info(f"\n✅ PROFIT JIT CALCULÉ:")
        logger.info(f"   Liquidité injectée: ${jit_liquidity_usd:,.2f}")
        logger.info(f"   Frais capturés: ${our_fees_usd:.2f}")
        logger.info(f"   ROI: {roi:.4f}%")
        logger.info(f"   ROI annualisé: {roi_annualized:,.0f}%")
        
        return {
            'tick_lower': tick_lower,
            'tick_upper': tick_upper,
            'jit_liquidity': jit_liquidity,
            'jit_liquidity_usd': float(jit_liquidity_usd),
            'total_fees': total_fees,
            'our_fee_share': our_fee_share,
            'our_fees_usd': float(our_fees_usd),
            'roi_percent': float(roi),
            'roi_annualized_percent': float(roi_annualized),
            'profitable': our_fees_usd > 0,
            'swap_impact': swap_result,
        }
    
    def is_profitable(
        self,
        profit_model: Dict,
        min_profit_usd: Decimal = Decimal('100'),
        gas_cost_usd: Decimal = Decimal('50')
    ) -> bool:
        """
        Vérifie si le JIT est profitable
        
        Args:
            profit_model: Modèle de profit
            min_profit_usd: Profit minimum
            gas_cost_usd: Coût gas estimé
        
        Returns:
            True si profitable
        """
        fees_usd = Decimal(str(profit_model['our_fees_usd']))
        
        net_profit = fees_usd - gas_cost_usd
        
        return net_profit >= min_profit_usd


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

def main():
    """Test du modèle"""
    
    model = JITProfitModel()
    
    # Exemple: Swap $100k USDC → WETH
    swap_params = {
        'amountIn': 100_000 * 10**6,  # 100k USDC (6 decimals)
        'tokenIn': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',  # USDC
        'tokenOut': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',  # WETH
        'fee': 3000,
    }
    
    # État pool USDC-WETH 0.3%
    pool_state = {
        'liquidity': 15_000_000_000_000_000_000,  # ~15M liquidity
        'sqrtPriceX96': 1461446703485210103287273052203988822378723970342,
        'tick': -193000,
        'fee': 3000,
        'tickSpacing': 60,
    }
    
    # Liquidité JIT: $50k
    jit_liquidity_usd = Decimal('50000')
    
    print(f"\n🧪 TEST MODÈLE PROFIT JIT")
    print(f"{'='*60}")
    print(f"Swap: $100,000 USDC → WETH")
    print(f"Pool: USDC-WETH 0.3%")
    print(f"JIT Liquidity: ${jit_liquidity_usd:,}")
    print(f"{'='*60}")
    
    # Calculer profit
    profit = model.calculate_jit_profit(
        swap_params,
        pool_state,
        jit_liquidity_usd
    )
    
    # Vérifier profitabilité
    is_prof = model.is_profitable(
        profit,
        min_profit_usd=Decimal('100'),
        gas_cost_usd=Decimal('50')
    )
    
    print(f"\n{'='*60}")
    print(f"RÉSULTAT:")
    print(f"{'='*60}")
    print(f"Frais capturés: ${profit['our_fees_usd']:.2f}")
    print(f"ROI: {profit['roi_percent']:.4f}%")
    print(f"ROI annualisé: {profit['roi_annualized_percent']:,.0f}%")
    print(f"Profitable: {'✅ OUI' if is_prof else '❌ NON'}")
    print(f"{'='*60}")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    main()
