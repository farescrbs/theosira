#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
💰 THESORIA - PROFIT CALCULATOR
═══════════════════════════════════════════════════════════════════════════════

Calculateur de profit avancé pour différents scénarios

Fonctionnalités:
• Calcul profit flash loan arbitrage
• Simulation différents montants
• Optimisation trade size
• Calcul break-even point
• Projection mensuelle
• ROI calculator

═══════════════════════════════════════════════════════════════════════════════
"""

import os
from dataclasses import dataclass
from typing import List, Tuple

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


@dataclass
class ArbitrageScenario:
    """Scénario d'arbitrage"""
    spread_pct: float
    trade_size_usd: float
    gas_price_gwei: float
    eth_price_usd: float = 3500
    
    @property
    def gross_profit(self) -> float:
        """Profit brut avant fees"""
        return self.trade_size_usd * (self.spread_pct / 100)
    
    @property
    def gas_cost_usd(self) -> float:
        """Coût gas en USD"""
        gas_units = 600000  # Flash loan arbitrage typical
        gas_cost_eth = (gas_units * self.gas_price_gwei) / 1e9
        return gas_cost_eth * self.eth_price_usd
    
    @property
    def flash_loan_fee(self) -> float:
        """Fee flash loan Aave (0.09%)"""
        return self.trade_size_usd * 0.0009
    
    @property
    def total_fees(self) -> float:
        """Total fees"""
        return self.gas_cost_usd + self.flash_loan_fee
    
    @property
    def net_profit(self) -> float:
        """Profit net"""
        return self.gross_profit - self.total_fees
    
    @property
    def roi_pct(self) -> float:
        """ROI en % (sur capital gas uniquement)"""
        if self.gas_cost_usd == 0:
            return 0
        return (self.net_profit / self.gas_cost_usd) * 100
    
    @property
    def is_profitable(self) -> bool:
        """Est-ce profitable?"""
        return self.net_profit > 0


class ProfitCalculator:
    """Calculateur de profit"""
    
    def __init__(self, eth_price: float = 3500):
        self.eth_price = eth_price
    
    def calculate_breakeven_spread(self, 
                                   trade_size: float,
                                   gas_price_gwei: float) -> float:
        """
        Calculer le spread minimum pour break-even
        
        Args:
            trade_size: Taille du trade en USD
            gas_price_gwei: Prix du gas en gwei
            
        Returns:
            Spread % nécessaire pour break-even
        """
        scenario = ArbitrageScenario(
            spread_pct=1.0,  # 1% initial
            trade_size_usd=trade_size,
            gas_price_gwei=gas_price_gwei,
            eth_price_usd=self.eth_price
        )
        
        # Calculer spread nécessaire
        total_fees = scenario.total_fees
        breakeven_spread = (total_fees / trade_size) * 100
        
        return breakeven_spread
    
    def optimize_trade_size(self,
                           spread_pct: float,
                           gas_price_gwei: float,
                           min_size: float = 1000,
                           max_size: float = 100000,
                           step: float = 1000) -> Tuple[float, float]:
        """
        Trouver la taille de trade optimale
        
        Returns:
            (optimal_size, max_profit)
        """
        best_size = min_size
        best_profit = 0
        
        current_size = min_size
        while current_size <= max_size:
            scenario = ArbitrageScenario(
                spread_pct=spread_pct,
                trade_size_usd=current_size,
                gas_price_gwei=gas_price_gwei,
                eth_price_usd=self.eth_price
            )
            
            if scenario.net_profit > best_profit:
                best_profit = scenario.net_profit
                best_size = current_size
            
            current_size += step
        
        return best_size, best_profit
    
    def calculate_monthly_projection(self,
                                    avg_profit_per_trade: float,
                                    trades_per_day: int) -> dict:
        """
        Projection mensuelle
        
        Returns:
            Dict avec projections
        """
        daily_profit = avg_profit_per_trade * trades_per_day
        weekly_profit = daily_profit * 7
        monthly_profit = daily_profit * 30
        
        return {
            "daily": daily_profit,
            "weekly": weekly_profit,
            "monthly": monthly_profit,
            "yearly": monthly_profit * 12
        }
    
    def print_scenario(self, scenario: ArbitrageScenario, title: str = ""):
        """Afficher un scénario"""
        if title:
            print(f"\n{Fore.CYAN}{'─' * 70}{Style.RESET_ALL}")
            print(f"{Fore.CYAN}{Style.BRIGHT}{title}{Style.RESET_ALL}")
            print(f"{Fore.CYAN}{'─' * 70}{Style.RESET_ALL}\n")
        
        print(f"Trade Size:       ${scenario.trade_size_usd:,.0f}")
        print(f"Spread:           {scenario.spread_pct:.2f}%")
        print(f"Gas Price:        {scenario.gas_price_gwei:.0f} gwei")
        print()
        print(f"Gross Profit:     ${scenario.gross_profit:,.2f}")
        print(f"Gas Cost:         ${scenario.gas_cost_usd:,.2f}")
        print(f"Flash Loan Fee:   ${scenario.flash_loan_fee:,.2f}")
        print(f"Total Fees:       ${scenario.total_fees:,.2f}")
        print()
        
        if scenario.is_profitable:
            print(f"{Fore.GREEN}Net Profit:       ${scenario.net_profit:,.2f} ✓{Style.RESET_ALL}")
            print(f"{Fore.GREEN}ROI:              {scenario.roi_pct:,.0f}%{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}Net Loss:         ${scenario.net_profit:,.2f} ✗{Style.RESET_ALL}")
    
    def print_comparison_table(self, scenarios: List[ArbitrageScenario]):
        """Afficher tableau de comparaison"""
        print(f"\n{Fore.CYAN}{'═' * 100}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}COMPARAISON SCÉNARIOS{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 100}{Style.RESET_ALL}\n")
        
        # Header
        print(f"{'Spread':<10} {'Size':<12} {'Gas':<10} {'Gross':<12} {'Fees':<12} {'Net':<12} {'ROI':<10}")
        print("─" * 100)
        
        # Rows
        for s in scenarios:
            color = Fore.GREEN if s.is_profitable else Fore.RED
            print(f"{s.spread_pct:.2f}%{' ' * 5} "
                  f"${s.trade_size_usd:>9,.0f}  "
                  f"{s.gas_price_gwei:>6.0f}gwei "
                  f"${s.gross_profit:>9,.2f}  "
                  f"${s.total_fees:>9,.2f}  "
                  f"{color}${s.net_profit:>9,.2f}{Style.RESET_ALL}  "
                  f"{color}{s.roi_pct:>6.0f}%{Style.RESET_ALL}")
        
        print()


def run_interactive_calculator():
    """Calculateur interactif"""
    print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{Style.BRIGHT}💰 PROFIT CALCULATOR INTERACTIF{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
    
    calc = ProfitCalculator()
    
    # Menu
    print("Options:")
    print("  1) Calculer profit simple")
    print("  2) Optimiser taille trade")
    print("  3) Calculer break-even spread")
    print("  4) Projection mensuelle")
    print("  5) Comparer scénarios")
    print("  6) Tout exécuter (démo)")
    print()
    
    choice = input("Choix (1-6) [6]: ").strip() or "6"
    
    if choice == "1":
        # Calcul simple
        spread = float(input("Spread (%) [1.5]: ") or "1.5")
        size = float(input("Trade size ($) [5000]: ") or "5000")
        gas = float(input("Gas price (gwei) [50]: ") or "50")
        
        scenario = ArbitrageScenario(spread, size, gas)
        calc.print_scenario(scenario, "RÉSULTAT")
        
    elif choice == "2":
        # Optimisation
        spread = float(input("Spread (%) [1.5]: ") or "1.5")
        gas = float(input("Gas price (gwei) [50]: ") or "50")
        
        print(f"\n{Fore.YELLOW}Optimisation en cours...{Style.RESET_ALL}\n")
        
        optimal_size, max_profit = calc.optimize_trade_size(spread, gas)
        
        print(f"{Fore.GREEN}Taille optimale: ${optimal_size:,.0f}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}Profit maximum: ${max_profit:,.2f}{Style.RESET_ALL}")
        
    elif choice == "3":
        # Break-even
        size = float(input("Trade size ($) [5000]: ") or "5000")
        gas = float(input("Gas price (gwei) [50]: ") or "50")
        
        breakeven = calc.calculate_breakeven_spread(size, gas)
        
        print(f"\n{Fore.YELLOW}Spread minimum pour break-even: {breakeven:.3f}%{Style.RESET_ALL}")
        print(f"{Fore.CYAN}Spread recommandé (2x BE): {breakeven * 2:.3f}%{Style.RESET_ALL}")
        
    elif choice == "4":
        # Projection
        avg_profit = float(input("Profit moyen par trade ($) [100]: ") or "100")
        trades_day = int(input("Trades par jour [3]: ") or "3")
        
        proj = calc.calculate_monthly_projection(avg_profit, trades_day)
        
        print(f"\n{Fore.CYAN}{'═' * 50}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}PROJECTIONS{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 50}{Style.RESET_ALL}\n")
        
        print(f"Par jour:      ${proj['daily']:>10,.2f}")
        print(f"Par semaine:   ${proj['weekly']:>10,.2f}")
        print(f"Par mois:      ${proj['monthly']:>10,.2f}")
        print(f"Par an:        ${proj['yearly']:>10,.2f}")
        
    elif choice == "5":
        # Comparaison
        print(f"\n{Fore.YELLOW}Génération scénarios de comparaison...{Style.RESET_ALL}")
        
        scenarios = [
            ArbitrageScenario(0.5, 5000, 50),   # Faible spread
            ArbitrageScenario(1.0, 5000, 50),   # Moyen spread
            ArbitrageScenario(1.5, 5000, 50),   # Bon spread
            ArbitrageScenario(2.0, 5000, 50),   # Excellent spread
            ArbitrageScenario(1.5, 2000, 50),   # Petit trade
            ArbitrageScenario(1.5, 10000, 50),  # Gros trade
            ArbitrageScenario(1.5, 5000, 25),   # Gas bas
            ArbitrageScenario(1.5, 5000, 100),  # Gas élevé
        ]
        
        calc.print_comparison_table(scenarios)
        
    else:  # Démo complète
        # 1. Scénario de base
        scenario_base = ArbitrageScenario(
            spread_pct=1.5,
            trade_size_usd=5000,
            gas_price_gwei=50
        )
        calc.print_scenario(scenario_base, "📊 SCÉNARIO DE BASE")
        
        # 2. Break-even
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}📉 BREAK-EVEN ANALYSIS{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        breakeven = calc.calculate_breakeven_spread(5000, 50)
        print(f"Spread minimum (break-even):  {breakeven:.3f}%")
        print(f"Spread actuel:                {scenario_base.spread_pct:.3f}%")
        print(f"Marge de sécurité:            {scenario_base.spread_pct - breakeven:.3f}%")
        
        # 3. Optimisation
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}🎯 OPTIMISATION{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        optimal_size, max_profit = calc.optimize_trade_size(1.5, 50)
        print(f"Taille optimale:    ${optimal_size:,.0f}")
        print(f"Profit maximum:     ${max_profit:,.2f}")
        print(f"Taille actuelle:    ${scenario_base.trade_size_usd:,.0f}")
        print(f"Profit actuel:      ${scenario_base.net_profit:,.2f}")
        
        gain = max_profit - scenario_base.net_profit
        print(f"Gain potentiel:     ${gain:,.2f} (+{gain/scenario_base.net_profit*100:.1f}%)")
        
        # 4. Projections
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}📈 PROJECTIONS MENSUELLES{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        for trades_per_day in [2, 3, 5]:
            proj = calc.calculate_monthly_projection(scenario_base.net_profit, trades_per_day)
            print(f"{trades_per_day} trades/jour → ${proj['monthly']:>8,.2f}/mois  (${proj['yearly']:>10,.2f}/an)")
        
        # 5. Comparaisons
        scenarios = [
            ArbitrageScenario(1.0, 5000, 50),
            ArbitrageScenario(1.5, 5000, 50),
            ArbitrageScenario(2.0, 5000, 50),
            ArbitrageScenario(1.5, 3000, 50),
            ArbitrageScenario(1.5, 10000, 50),
        ]
        
        calc.print_comparison_table(scenarios)
        
        # 6. Recommandations
        print(f"{Fore.YELLOW}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{Style.BRIGHT}💡 RECOMMANDATIONS{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{'═' * 70}{Style.RESET_ALL}\n")
        
        print(f"• Spread minimum recommandé: {breakeven * 2:.2f}% (2x break-even)")
        print(f"• Taille trade optimale: ${optimal_size:,.0f}")
        print(f"• Gas maximum acceptable: 75 gwei (pour profit > $50)")
        print(f"• Fréquence réaliste: 2-3 trades/jour")
        print(f"• Profit mensuel attendu: ${calc.calculate_monthly_projection(scenario_base.net_profit, 3)['monthly']:,.2f}")
        print()


if __name__ == "__main__":
    run_interactive_calculator()
