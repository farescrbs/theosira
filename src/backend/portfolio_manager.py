#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
💼 THESORIA - PORTFOLIO MANAGER
═══════════════════════════════════════════════════════════════════════════════

Gestionnaire de portfolio multi-stratégies et multi-wallets

Fonctionnalités:
• Multi-wallet management
• Multi-strategy allocation
• Performance tracking par stratégie
• Rebalancing automatique
• Profit distribution
• Consolidated reporting
• Risk diversification
• Capital allocation optimizer

═══════════════════════════════════════════════════════════════════════════════
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict
from enum import Enum

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


class StrategyType(Enum):
    """Types de stratégies"""
    FLASH_LOAN_ARBITRAGE = "Flash Loan Arbitrage"
    DEX_ARBITRAGE = "DEX Arbitrage"
    LIQUIDATION = "Liquidation Hunting"
    MEV_FRONTRUN = "MEV Front-running"
    TRIANGULAR_ARBITRAGE = "Triangular Arbitrage"


@dataclass
class Wallet:
    """Wallet configuration"""
    address: str
    name: str
    balance: float
    allocated_capital: float
    strategy: StrategyType
    
    @property
    def utilization_pct(self) -> float:
        """Taux d'utilisation du capital"""
        return (self.allocated_capital / self.balance * 100) if self.balance > 0 else 0


@dataclass
class StrategyPerformance:
    """Performance d'une stratégie"""
    strategy: StrategyType
    total_trades: int
    winning_trades: int
    total_profit: float
    total_loss: float
    avg_profit_per_trade: float
    sharpe_ratio: float
    max_drawdown: float
    
    @property
    def win_rate(self) -> float:
        return (self.winning_trades / self.total_trades * 100) if self.total_trades > 0 else 0
    
    @property
    def net_profit(self) -> float:
        return self.total_profit + self.total_loss
    
    @property
    def profit_factor(self) -> float:
        return abs(self.total_profit / self.total_loss) if self.total_loss != 0 else float('inf')


class PortfolioManager:
    """Gestionnaire de portfolio"""
    
    def __init__(self):
        self.wallets: List[Wallet] = []
        self.strategy_performances: Dict[StrategyType, StrategyPerformance] = {}
        self.total_capital = 0.0
        self.total_profit = 0.0
    
    def add_wallet(self, address: str, name: str, balance: float, 
                   strategy: StrategyType, allocation: float):
        """Ajouter un wallet"""
        wallet = Wallet(
            address=address,
            name=name,
            balance=balance,
            allocated_capital=allocation,
            strategy=strategy
        )
        
        self.wallets.append(wallet)
        self.total_capital += balance
        
        print(f"{Fore.GREEN}✓ Wallet ajouté: {name} ({strategy.value}){Style.RESET_ALL}")
    
    def get_strategy_allocation(self) -> Dict[StrategyType, float]:
        """Obtenir allocation par stratégie"""
        allocation = {}
        
        for wallet in self.wallets:
            if wallet.strategy not in allocation:
                allocation[wallet.strategy] = 0
            allocation[wallet.strategy] += wallet.allocated_capital
        
        return allocation
    
    def get_portfolio_metrics(self):
        """Obtenir métriques portfolio"""
        total_allocated = sum(w.allocated_capital for w in self.wallets)
        total_balance = sum(w.balance for w in self.wallets)
        
        return {
            'total_wallets': len(self.wallets),
            'total_balance': total_balance,
            'total_allocated': total_allocated,
            'total_available': total_balance - total_allocated,
            'utilization_pct': (total_allocated / total_balance * 100) if total_balance > 0 else 0,
            'total_profit': self.total_profit
        }
    
    def rebalance(self, target_allocation: Dict[StrategyType, float]):
        """
        Rebalancer portfolio selon allocation cible
        
        Args:
            target_allocation: Dict {strategy: percentage} (total = 100%)
        """
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}⚖️  PORTFOLIO REBALANCING{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        # Vérifier total = 100%
        total_pct = sum(target_allocation.values())
        if abs(total_pct - 100) > 0.01:
            print(f"{Fore.RED}✗ Erreur: Total allocation doit être 100% (actuel: {total_pct}%){Style.RESET_ALL}")
            return
        
        # Calculer nouvelle allocation
        total_capital = sum(w.balance for w in self.wallets)
        
        print(f"{Fore.YELLOW}Capital total: ${total_capital:,.2f}{Style.RESET_ALL}\n")
        
        print(f"{'Strategy':<30} {'Current':<12} {'Target':<12} {'Change':<12}")
        print("─" * 70)
        
        for strategy, target_pct in target_allocation.items():
            # Capital actuel pour cette stratégie
            current_capital = sum(
                w.allocated_capital for w in self.wallets if w.strategy == strategy
            )
            current_pct = (current_capital / total_capital * 100) if total_capital > 0 else 0
            
            # Capital cible
            target_capital = total_capital * (target_pct / 100)
            change = target_capital - current_capital
            
            change_color = Fore.GREEN if change >= 0 else Fore.RED
            
            print(f"{strategy.value:<30} "
                  f"{current_pct:>6.1f}%{' ' * 5} "
                  f"{target_pct:>6.1f}%{' ' * 5} "
                  f"{change_color}{change:>+10,.2f}{Style.RESET_ALL}")
        
        print()
        print(f"{Fore.GREEN}✓ Rebalancing calculé{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Note: Implémenter transferts entre wallets{Style.RESET_ALL}\n")
    
    def update_strategy_performance(self, strategy: StrategyType, 
                                   trades: int, winning: int,
                                   profit: float, loss: float,
                                   sharpe: float = 0, drawdown: float = 0):
        """Mettre à jour performance d'une stratégie"""
        avg_profit = (profit + loss) / trades if trades > 0 else 0
        
        perf = StrategyPerformance(
            strategy=strategy,
            total_trades=trades,
            winning_trades=winning,
            total_profit=profit,
            total_loss=loss,
            avg_profit_per_trade=avg_profit,
            sharpe_ratio=sharpe,
            max_drawdown=drawdown
        )
        
        self.strategy_performances[strategy] = perf
        self.total_profit += perf.net_profit
    
    def print_dashboard(self):
        """Afficher dashboard portfolio"""
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}💼 PORTFOLIO DASHBOARD{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        # Métriques globales
        metrics = self.get_portfolio_metrics()
        
        print(f"{Fore.YELLOW}Global Metrics{Style.RESET_ALL}")
        print(f"{'─' * 70}\n")
        
        print(f"Total Wallets:        {metrics['total_wallets']}")
        print(f"Total Balance:        ${metrics['total_balance']:,.2f}")
        print(f"Allocated Capital:    ${metrics['total_allocated']:,.2f}")
        print(f"Available Capital:    ${metrics['total_available']:,.2f}")
        print(f"Utilization:          {metrics['utilization_pct']:.1f}%")
        
        profit_color = Fore.GREEN if metrics['total_profit'] >= 0 else Fore.RED
        print(f"Total Profit:         {profit_color}${metrics['total_profit']:,.2f}{Style.RESET_ALL}")
        
        # Wallets
        print(f"\n{Fore.YELLOW}Wallets{Style.RESET_ALL}")
        print(f"{'─' * 70}\n")
        
        print(f"{'Name':<15} {'Strategy':<25} {'Balance':<12} {'Allocated':<12} {'Util%':<8}")
        print("─" * 70)
        
        for wallet in self.wallets:
            print(f"{wallet.name:<15} "
                  f"{wallet.strategy.value:<25} "
                  f"${wallet.balance:>9,.2f}  "
                  f"${wallet.allocated_capital:>9,.2f}  "
                  f"{wallet.utilization_pct:>6.1f}%")
        
        # Allocation par stratégie
        print(f"\n{Fore.YELLOW}Strategy Allocation{Style.RESET_ALL}")
        print(f"{'─' * 70}\n")
        
        allocation = self.get_strategy_allocation()
        total_allocated = sum(allocation.values())
        
        for strategy, amount in sorted(allocation.items(), key=lambda x: x[1], reverse=True):
            pct = (amount / total_allocated * 100) if total_allocated > 0 else 0
            bar_length = int(pct / 2)  # Max 50 chars
            bar = '█' * bar_length
            
            print(f"{strategy.value:<30} ${amount:>9,.2f}  {pct:>5.1f}%  {Fore.CYAN}{bar}{Style.RESET_ALL}")
        
        # Performances par stratégie
        if self.strategy_performances:
            print(f"\n{Fore.YELLOW}Strategy Performance{Style.RESET_ALL}")
            print(f"{'─' * 70}\n")
            
            print(f"{'Strategy':<30} {'Trades':<8} {'Win%':<8} {'Profit':<12} {'Sharpe':<8}")
            print("─" * 70)
            
            for strategy, perf in self.strategy_performances.items():
                profit_color = Fore.GREEN if perf.net_profit >= 0 else Fore.RED
                
                print(f"{strategy.value:<30} "
                      f"{perf.total_trades:<8} "
                      f"{perf.win_rate:>6.1f}%  "
                      f"{profit_color}${perf.net_profit:>9,.2f}{Style.RESET_ALL}  "
                      f"{perf.sharpe_ratio:>6.2f}")
        
        print()
    
    def optimize_allocation(self) -> Dict[StrategyType, float]:
        """
        Optimiser allocation basée sur performances
        
        Returns:
            Allocation optimale (percentages)
        """
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}🎯 ALLOCATION OPTIMIZATION{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        if not self.strategy_performances:
            print(f"{Fore.YELLOW}⚠ Pas de données de performance{Style.RESET_ALL}\n")
            return {}
        
        # Calculer scores pour chaque stratégie
        scores = {}
        
        for strategy, perf in self.strategy_performances.items():
            # Score basé sur:
            # - Profit net (40%)
            # - Win rate (25%)
            # - Sharpe ratio (20%)
            # - Profit factor (15%)
            
            profit_score = min(max(perf.net_profit / 1000, 0), 10)  # Max 10
            win_rate_score = perf.win_rate / 10  # Max 10
            sharpe_score = min(max(perf.sharpe_ratio, 0), 3) * 3.33  # Max 10
            pf_score = min(max(perf.profit_factor - 1, 0), 3) * 3.33  # Max 10
            
            total_score = (
                profit_score * 0.4 +
                win_rate_score * 0.25 +
                sharpe_score * 0.2 +
                pf_score * 0.15
            )
            
            scores[strategy] = total_score
        
        # Normaliser en percentages
        total_score = sum(scores.values())
        
        if total_score > 0:
            allocation = {s: (score / total_score * 100) for s, score in scores.items()}
        else:
            # Equal allocation si tous scores = 0
            n = len(scores)
            allocation = {s: 100 / n for s in scores.keys()}
        
        # Afficher
        print(f"{'Strategy':<30} {'Score':<10} {'Allocation':<12}")
        print("─" * 70)
        
        for strategy in sorted(allocation.keys(), key=lambda s: allocation[s], reverse=True):
            score = scores[strategy]
            pct = allocation[strategy]
            
            print(f"{strategy.value:<30} "
                  f"{score:>8.2f}  "
                  f"{pct:>10.1f}%")
        
        print()
        print(f"{Fore.GREEN}✓ Allocation optimale calculée{Style.RESET_ALL}\n")
        
        return allocation


def demo_portfolio_manager():
    """Démo portfolio manager"""
    print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{Style.BRIGHT}💼 PORTFOLIO MANAGER DEMO{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
    
    pm = PortfolioManager()
    
    # Ajouter wallets
    print(f"{Fore.YELLOW}Configuration wallets...{Style.RESET_ALL}\n")
    
    pm.add_wallet(
        "0x1234...5678",
        "MainWallet",
        5000,
        StrategyType.FLASH_LOAN_ARBITRAGE,
        3000
    )
    
    pm.add_wallet(
        "0xabcd...efgh",
        "SecondaryWallet",
        3000,
        StrategyType.DEX_ARBITRAGE,
        2000
    )
    
    pm.add_wallet(
        "0x9999...1111",
        "AggressiveWallet",
        2000,
        StrategyType.LIQUIDATION,
        1500
    )
    
    print()
    
    # Ajouter performances
    print(f"{Fore.YELLOW}Mise à jour performances...{Style.RESET_ALL}\n")
    
    pm.update_strategy_performance(
        StrategyType.FLASH_LOAN_ARBITRAGE,
        trades=50,
        winning=35,
        profit=2500,
        loss=-800,
        sharpe=2.1,
        drawdown=8
    )
    
    pm.update_strategy_performance(
        StrategyType.DEX_ARBITRAGE,
        trades=80,
        winning=45,
        profit=1800,
        loss=-1200,
        sharpe=1.5,
        drawdown=12
    )
    
    pm.update_strategy_performance(
        StrategyType.LIQUIDATION,
        trades=20,
        winning=15,
        profit=1200,
        loss=-400,
        sharpe=1.8,
        drawdown=6
    )
    
    # Dashboard
    pm.print_dashboard()
    
    # Optimisation
    optimal_allocation = pm.optimize_allocation()
    
    # Rebalancing
    if optimal_allocation:
        pm.rebalance(optimal_allocation)


if __name__ == "__main__":
    demo_portfolio_manager()
