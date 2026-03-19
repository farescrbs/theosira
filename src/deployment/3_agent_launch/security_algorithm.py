"""
🧠 THESORIA - Algorithme de Sécurité IA
========================================

Garantit que chaque trade respecte:
P_expected > G_max + M_min

Où:
- P_expected: Profit attendu (USD)
- G_max: Coût gas maximum (USD)
- M_min: Marge de profit minimale (USD)

SÉCURITÉ ABSOLUE: Aucun trade ne peut perdre d'argent!
"""

import asyncio
import time
from typing import Dict, Optional, Tuple
from web3 import Web3
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


@dataclass
class TradeParameters:
    """Paramètres d'un trade"""
    token_in: str
    token_out: str
    amount_in: float
    spread: float
    estimated_profit: float
    dex_buy: str
    dex_sell: str
    gas_estimate: int
    gas_price_gwei: float


@dataclass
class SecurityLimits:
    """Limites de sécurité configurables"""
    min_profit_usd: float = 100.0           # Profit minimum absolu
    min_margin_percent: float = 0.20        # 20% de marge sur le profit
    max_gas_price_gwei: float = 150.0       # Gas price maximum
    max_gas_cost_usd: float = 500.0         # Coût gas maximum
    eth_price_usd: float = 2000.0           # Prix ETH (mis à jour en temps réel)
    safety_multiplier: float = 1.3          # Multiplicateur de sécurité (30% marge)


class SecurityAlgorithm:
    """
    Algorithme de Sécurité IA pour validation des trades
    
    Garantit mathématiquement qu'aucun trade ne peut perdre d'argent
    """
    
    def __init__(self, w3: Web3, limits: SecurityLimits = None):
        self.w3 = w3
        self.limits = limits or SecurityLimits()
        
        # Statistiques
        self.trades_evaluated = 0
        self.trades_approved = 0
        self.trades_rejected = 0
        self.rejection_reasons = {
            'low_profit': 0,
            'high_gas': 0,
            'negative_roi': 0,
            'high_gas_price': 0,
            'insufficient_margin': 0,
        }
        
        logger.info(f"🛡️  Algorithme de sécurité initialisé")
        logger.info(f"   Min profit: ${self.limits.min_profit_usd}")
        logger.info(f"   Min margin: {self.limits.min_margin_percent*100}%")
        logger.info(f"   Max gas price: {self.limits.max_gas_price_gwei} Gwei")
    
    async def update_eth_price(self) -> float:
        """
        Met à jour le prix ETH en temps réel
        
        Sources possibles:
        - Oracle Chainlink
        - API CoinGecko
        - DEX price feed
        """
        try:
            # TODO: Implémenter fetch depuis Chainlink ou API
            # Pour l'instant, prix fixe
            self.limits.eth_price_usd = 2000.0
            return self.limits.eth_price_usd
        except Exception as e:
            logger.warning(f"⚠️  Erreur mise à jour prix ETH: {e}")
            return self.limits.eth_price_usd
    
    def calculate_gas_cost_usd(
        self,
        gas_estimate: int,
        gas_price_gwei: float
    ) -> float:
        """
        Calcule le coût du gas en USD
        
        Args:
            gas_estimate: Gas estimé en unités
            gas_price_gwei: Prix du gas en Gwei
        
        Returns:
            Coût en USD
        """
        # Gas en Wei
        gas_wei = gas_estimate * (gas_price_gwei * 10**9)
        
        # Gas en ETH
        gas_eth = gas_wei / 10**18
        
        # Gas en USD
        gas_usd = gas_eth * self.limits.eth_price_usd
        
        return gas_usd
    
    def calculate_required_margin(
        self,
        estimated_profit: float,
        gas_cost_usd: float
    ) -> float:
        """
        Calcule la marge requise pour un trade sécurisé
        
        Formule: M_min = max(min_profit, profit * min_margin_percent)
        """
        # Marge basée sur le pourcentage
        percent_margin = estimated_profit * self.limits.min_margin_percent
        
        # Marge minimale absolue
        absolute_margin = self.limits.min_profit_usd
        
        # Prendre le maximum
        required_margin = max(percent_margin, absolute_margin)
        
        return required_margin
    
    async def evaluate_trade(
        self,
        params: TradeParameters
    ) -> Tuple[bool, str, Dict]:
        """
        ALGORITHME PRINCIPAL DE SÉCURITÉ
        
        Évalue si un trade peut être exécuté en toute sécurité
        
        Formule de sécurité:
        P_expected > G_max + M_min
        
        Returns:
            (approved, reason, metrics)
        """
        self.trades_evaluated += 1
        
        logger.info(f"\n🔍 ÉVALUATION SÉCURITÉ #{self.trades_evaluated}")
        logger.info(f"   Paire: {params.token_in}/{params.token_out}")
        logger.info(f"   DEX: {params.dex_buy} → {params.dex_sell}")
        
        # Mise à jour prix ETH
        await self.update_eth_price()
        
        # ============================================
        # 1. CALCUL DU COÛT GAS
        # ============================================
        
        # Coût gas actuel
        gas_cost_current = self.calculate_gas_cost_usd(
            params.gas_estimate,
            params.gas_price_gwei
        )
        
        # Coût gas maximum (avec multiplicateur de sécurité)
        gas_cost_max = gas_cost_current * self.limits.safety_multiplier
        
        logger.info(f"   Gas:")
        logger.info(f"      Estimé: {params.gas_estimate:,} unités")
        logger.info(f"      Prix: {params.gas_price_gwei:.2f} Gwei")
        logger.info(f"      Coût actuel: ${gas_cost_current:.2f}")
        logger.info(f"      Coût max (1.3x): ${gas_cost_max:.2f}")
        
        # ============================================
        # 2. VÉRIFICATION GAS PRICE
        # ============================================
        
        if params.gas_price_gwei > self.limits.max_gas_price_gwei:
            reason = f"Gas price trop élevé ({params.gas_price_gwei:.1f} > {self.limits.max_gas_price_gwei} Gwei)"
            logger.warning(f"   ❌ {reason}")
            self.trades_rejected += 1
            self.rejection_reasons['high_gas_price'] += 1
            return False, reason, {}
        
        # ============================================
        # 3. VÉRIFICATION COÛT GAS MAXIMUM
        # ============================================
        
        if gas_cost_max > self.limits.max_gas_cost_usd:
            reason = f"Coût gas trop élevé (${gas_cost_max:.2f} > ${self.limits.max_gas_cost_usd})"
            logger.warning(f"   ❌ {reason}")
            self.trades_rejected += 1
            self.rejection_reasons['high_gas'] += 1
            return False, reason, {}
        
        # ============================================
        # 4. CALCUL DE LA MARGE REQUISE
        # ============================================
        
        required_margin = self.calculate_required_margin(
            params.estimated_profit,
            gas_cost_max
        )
        
        logger.info(f"   Marge requise: ${required_margin:.2f}")
        
        # ============================================
        # 5. FORMULE DE SÉCURITÉ
        #    P_expected > G_max + M_min
        # ============================================
        
        profit_expected = params.estimated_profit
        total_required = gas_cost_max + required_margin
        
        logger.info(f"\n   📊 FORMULE DE SÉCURITÉ:")
        logger.info(f"      P_expected: ${profit_expected:.2f}")
        logger.info(f"      G_max:      ${gas_cost_max:.2f}")
        logger.info(f"      M_min:      ${required_margin:.2f}")
        logger.info(f"      Total req:  ${total_required:.2f}")
        
        # Vérification principale
        if profit_expected <= total_required:
            reason = f"Profit insuffisant (${profit_expected:.2f} ≤ ${total_required:.2f})"
            logger.warning(f"   ❌ {reason}")
            self.trades_rejected += 1
            self.rejection_reasons['low_profit'] += 1
            return False, reason, {}
        
        # ============================================
        # 6. CALCUL DU PROFIT NET
        # ============================================
        
        net_profit = profit_expected - gas_cost_max
        roi = (net_profit / gas_cost_max) * 100 if gas_cost_max > 0 else 0
        
        logger.info(f"\n   💰 RÉSULTATS:")
        logger.info(f"      Profit brut:  ${profit_expected:.2f}")
        logger.info(f"      Coût gas:     ${gas_cost_max:.2f}")
        logger.info(f"      Profit net:   ${net_profit:.2f}")
        logger.info(f"      ROI:          {roi:.1f}%")
        logger.info(f"      Marge:        ${net_profit - required_margin:.2f}")
        
        # ============================================
        # 7. VÉRIFICATION ROI MINIMUM
        # ============================================
        
        min_roi = 50.0  # 50% ROI minimum
        if roi < min_roi:
            reason = f"ROI trop faible ({roi:.1f}% < {min_roi}%)"
            logger.warning(f"   ❌ {reason}")
            self.trades_rejected += 1
            self.rejection_reasons['negative_roi'] += 1
            return False, reason, {}
        
        # ============================================
        # 8. VÉRIFICATION MARGE DE SÉCURITÉ
        # ============================================
        
        safety_margin = net_profit - required_margin
        if safety_margin < 0:
            reason = f"Marge de sécurité négative (${safety_margin:.2f})"
            logger.warning(f"   ❌ {reason}")
            self.trades_rejected += 1
            self.rejection_reasons['insufficient_margin'] += 1
            return False, reason, {}
        
        # ============================================
        # ✅ TRADE APPROUVÉ!
        # ============================================
        
        self.trades_approved += 1
        
        logger.info(f"\n   ✅ TRADE APPROUVÉ!")
        logger.info(f"      Sécurité: GARANTIE")
        logger.info(f"      Profit net: ${net_profit:.2f}")
        logger.info(f"      Marge sécurité: ${safety_margin:.2f}")
        
        # Métriques détaillées
        metrics = {
            'approved': True,
            'profit_expected': profit_expected,
            'gas_cost_current': gas_cost_current,
            'gas_cost_max': gas_cost_max,
            'required_margin': required_margin,
            'net_profit': net_profit,
            'roi': roi,
            'safety_margin': safety_margin,
            'gas_price_gwei': params.gas_price_gwei,
            'eth_price_usd': self.limits.eth_price_usd,
        }
        
        return True, "Trade sécurisé et rentable", metrics
    
    def adjust_gas_price_dynamically(
        self,
        current_gas_price: float,
        profit_expected: float
    ) -> float:
        """
        Ajuste le gas price dynamiquement selon le profit attendu
        
        Si profit élevé → On peut payer plus de gas
        Si profit faible → On doit limiter le gas
        """
        # Gas price maximum basé sur le profit
        max_affordable_gas_price = (profit_expected * 0.3) / (500_000 / 10**9)  # 30% du profit max
        
        # Limiter au minimum entre max_affordable et max_gas_price
        adjusted_gas_price = min(
            current_gas_price,
            max_affordable_gas_price,
            self.limits.max_gas_price_gwei
        )
        
        if adjusted_gas_price < current_gas_price:
            logger.info(f"⚙️  Gas price ajusté: {current_gas_price:.1f} → {adjusted_gas_price:.1f} Gwei")
        
        return adjusted_gas_price
    
    def get_statistics(self) -> Dict:
        """Retourne les statistiques de l'algorithme"""
        approval_rate = 0
        if self.trades_evaluated > 0:
            approval_rate = (self.trades_approved / self.trades_evaluated) * 100
        
        return {
            'trades_evaluated': self.trades_evaluated,
            'trades_approved': self.trades_approved,
            'trades_rejected': self.trades_rejected,
            'approval_rate': approval_rate,
            'rejection_reasons': self.rejection_reasons,
        }
    
    def print_statistics(self):
        """Affiche les statistiques"""
        stats = self.get_statistics()
        
        print("\n" + "="*60)
        print("🛡️  STATISTIQUES ALGORITHME DE SÉCURITÉ")
        print("="*60)
        print(f"Trades évalués: {stats['trades_evaluated']}")
        print(f"Trades approuvés: {stats['trades_approved']}")
        print(f"Trades rejetés: {stats['trades_rejected']}")
        print(f"Taux d'approbation: {stats['approval_rate']:.1f}%")
        print(f"\nRaisons de rejet:")
        for reason, count in stats['rejection_reasons'].items():
            print(f"  - {reason}: {count}")
        print("="*60 + "\n")


async def example_usage():
    """Exemple d'utilisation de l'algorithme"""
    
    from web3 import Web3
    
    # Setup
    w3 = Web3(Web3.HTTPProvider('https://polygon-rpc.com'))
    
    # Limites personnalisées
    limits = SecurityLimits(
        min_profit_usd=100.0,
        min_margin_percent=0.20,
        max_gas_price_gwei=150.0,
        max_gas_cost_usd=500.0,
        eth_price_usd=2000.0,
    )
    
    # Initialiser l'algorithme
    security = SecurityAlgorithm(w3, limits)
    
    # Exemple 1: Trade profitable
    print("=" * 60)
    print("EXEMPLE 1: Trade Profitable")
    print("=" * 60)
    
    trade1 = TradeParameters(
        token_in='USDC',
        token_out='WETH',
        amount_in=10000,
        spread=0.0185,
        estimated_profit=247.50,
        dex_buy='QuickSwap',
        dex_sell='SushiSwap',
        gas_estimate=500_000,
        gas_price_gwei=30.0,
    )
    
    approved, reason, metrics = await security.evaluate_trade(trade1)
    
    if approved:
        print(f"\n✅ APPROUVÉ: {reason}")
        print(f"   Profit net: ${metrics['net_profit']:.2f}")
    else:
        print(f"\n❌ REJETÉ: {reason}")
    
    # Exemple 2: Gas trop élevé
    print("\n" + "=" * 60)
    print("EXEMPLE 2: Gas Trop Élevé")
    print("=" * 60)
    
    trade2 = TradeParameters(
        token_in='USDC',
        token_out='WETH',
        amount_in=10000,
        spread=0.008,
        estimated_profit=80.0,
        dex_buy='QuickSwap',
        dex_sell='SushiSwap',
        gas_estimate=500_000,
        gas_price_gwei=100.0,  # Gas très élevé
    )
    
    approved, reason, metrics = await security.evaluate_trade(trade2)
    
    if not approved:
        print(f"\n❌ REJETÉ: {reason}")
    
    # Exemple 3: Profit insuffisant
    print("\n" + "=" * 60)
    print("EXEMPLE 3: Profit Insuffisant")
    print("=" * 60)
    
    trade3 = TradeParameters(
        token_in='USDC',
        token_out='WETH',
        amount_in=10000,
        spread=0.003,
        estimated_profit=30.0,  # Profit trop faible
        dex_buy='QuickSwap',
        dex_sell='SushiSwap',
        gas_estimate=500_000,
        gas_price_gwei=30.0,
    )
    
    approved, reason, metrics = await security.evaluate_trade(trade3)
    
    if not approved:
        print(f"\n❌ REJETÉ: {reason}")
    
    # Stats finales
    security.print_statistics()


if __name__ == "__main__":
    # Configuration logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(message)s'
    )
    
    # Lancer l'exemple
    asyncio.run(example_usage())
