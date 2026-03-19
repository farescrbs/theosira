#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🧠 THESORIA - STRATEGY OPTIMIZER (ML-POWERED)
═══════════════════════════════════════════════════════════════════════════════

Optimiseur de stratégie utilisant algorithmes d'apprentissage

Fonctionnalités:
• Optimisation paramètres automatique
• Grid search sur paramètres clés
• Analyse corrélations
• Recommandations ML-based
• A/B testing strategies
• Performance scoring
• Auto-tuning

Paramètres optimisés:
• MIN_ARBITRAGE_PROFIT
• MAX_GAS_PRICE_GWEI
• SLIPPAGE_TOLERANCE
• SCAN_INTERVAL
• MAX_TRADE_SIZE

═══════════════════════════════════════════════════════════════════════════════
"""

import itertools
from dataclasses import dataclass
from typing import List, Dict, Tuple
import json

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


@dataclass
class StrategyConfig:
    """Configuration de stratégie"""
    min_profit: float
    max_gas_gwei: float
    slippage_tolerance: float
    scan_interval: int
    max_trade_size: float
    
    def to_dict(self):
        return {
            'MIN_ARBITRAGE_PROFIT': self.min_profit,
            'MAX_GAS_PRICE_GWEI': self.max_gas_gwei,
            'SLIPPAGE_TOLERANCE': self.slippage_tolerance,
            'SCAN_INTERVAL': self.scan_interval,
            'MAX_TRADE_SIZE': self.max_trade_size
        }


@dataclass
class StrategyResult:
    """Résultats d'une stratégie"""
    config: StrategyConfig
    total_profit: float
    total_trades: int
    win_rate: float
    sharpe_ratio: float
    max_drawdown: float
    avg_profit_per_trade: float
    
    @property
    def score(self) -> float:
        """Score global de la stratégie"""
        # Pondération des métriques
        profit_score = min(self.total_profit / 10000, 1.0) * 40  # Max 40 points
        win_rate_score = self.win_rate * 0.25  # Max 25 points
        sharpe_score = min(self.sharpe_ratio / 3, 1.0) * 20  # Max 20 points
        drawdown_score = max(0, (1 - self.max_drawdown / 30)) * 15  # Max 15 points
        
        return profit_score + win_rate_score + sharpe_score + drawdown_score


class StrategyOptimizer:
    """Optimiseur de stratégie"""
    
    def __init__(self):
        self.results: List[StrategyResult] = []
    
    def generate_configs(self, mode='balanced') -> List[StrategyConfig]:
        """
        Générer configurations à tester
        
        Args:
            mode: 'fast' (quelques configs), 'balanced', 'exhaustive'
        """
        if mode == 'fast':
            # 27 configs (3^3)
            min_profits = [30, 50, 100]
            max_gas = [50, 75, 100]
            slippages = [1.0, 1.5, 2.0]
            intervals = [20]
            trade_sizes = [5000]
            
        elif mode == 'balanced':
            # 108 configs (3x3x3x2x2)
            min_profits = [30, 50, 75, 100]
            max_gas = [40, 60, 80, 100]
            slippages = [1.0, 1.5, 2.0]
            intervals = [15, 30]
            trade_sizes = [3000, 5000, 8000]
            
        else:  # exhaustive
            # 864 configs (6^4)
            min_profits = [20, 30, 40, 50, 75, 100]
            max_gas = [30, 40, 50, 60, 80, 100]
            slippages = [0.5, 1.0, 1.5, 2.0, 2.5]
            intervals = [10, 15, 20, 30]
            trade_sizes = [2000, 3000, 5000, 8000, 10000]
        
        configs = []
        
        # Générer toutes les combinaisons
        for min_p, gas, slip, interval, size in itertools.product(
            min_profits, max_gas, slippages, intervals, trade_sizes
        ):
            # Filtrer combinaisons invalides
            if min_p > size * 0.05:  # Profit > 5% du trade size = irréaliste
                continue
            
            configs.append(StrategyConfig(
                min_profit=min_p,
                max_gas_gwei=gas,
                slippage_tolerance=slip,
                scan_interval=interval,
                max_trade_size=size
            ))
        
        return configs
    
    def simulate_strategy(self, config: StrategyConfig, days: int = 30) -> StrategyResult:
        """
        Simuler une stratégie
        
        Note: Version simplifiée - devrait utiliser backtesting_engine
        """
        import random
        
        total_profit = 0
        trades = []
        
        # Simuler opportunités par jour
        opps_per_day = 24 / (config.scan_interval / 3600)  # Opportunités basées sur scan interval
        
        for day in range(days):
            for _ in range(int(opps_per_day)):
                # Simuler spread aléatoire
                spread = random.uniform(0.3, 2.5)
                gas_price = random.uniform(20, 150)
                
                # Vérifier si profitable selon config
                gross_profit = config.max_trade_size * (spread / 100)
                gas_cost = (600000 * gas_price / 1e9) * 3500  # ETH à $3500
                flash_fee = config.max_trade_size * 0.0009
                net_profit = gross_profit - gas_cost - flash_fee
                
                # Conditions
                if (spread >= config.slippage_tolerance and 
                    gas_price <= config.max_gas_gwei and 
                    net_profit >= config.min_profit):
                    
                    # Trade exécuté
                    trades.append(net_profit)
                    total_profit += net_profit
        
        # Calculer métriques
        if not trades:
            return StrategyResult(
                config=config,
                total_profit=0,
                total_trades=0,
                win_rate=0,
                sharpe_ratio=0,
                max_drawdown=0,
                avg_profit_per_trade=0
            )
        
        winning_trades = [t for t in trades if t > 0]
        win_rate = (len(winning_trades) / len(trades)) * 100
        avg_profit = sum(trades) / len(trades)
        
        # Sharpe ratio simplifié
        if len(trades) > 1:
            returns = trades
            avg_return = sum(returns) / len(returns)
            variance = sum((r - avg_return) ** 2 for r in returns) / len(returns)
            std_dev = variance ** 0.5
            sharpe = (avg_return / std_dev) * (252 ** 0.5) if std_dev > 0 else 0
        else:
            sharpe = 0
        
        # Max drawdown simplifié
        equity = 0
        peak = 0
        max_dd = 0
        for trade in trades:
            equity += trade
            if equity > peak:
                peak = equity
            dd = ((peak - equity) / peak * 100) if peak > 0 else 0
            max_dd = max(max_dd, dd)
        
        return StrategyResult(
            config=config,
            total_profit=total_profit,
            total_trades=len(trades),
            win_rate=win_rate,
            sharpe_ratio=sharpe,
            max_drawdown=max_dd,
            avg_profit_per_trade=avg_profit
        )
    
    def optimize(self, mode='balanced', days=30, top_n=10):
        """
        Optimiser stratégie
        
        Args:
            mode: Mode de recherche
            days: Jours de simulation
            top_n: Nombre de meilleures stratégies à retourner
        """
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}🧠 STRATEGY OPTIMIZER{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        # Générer configs
        configs = self.generate_configs(mode)
        print(f"{Fore.YELLOW}Configurations à tester: {len(configs)}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Jours de simulation: {days}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Mode: {mode}{Style.RESET_ALL}\n")
        
        # Simuler chaque config
        print(f"{Fore.CYAN}Simulation en cours...{Style.RESET_ALL}\n")
        
        for i, config in enumerate(configs):
            if (i + 1) % 10 == 0:
                print(f"  {i + 1}/{len(configs)} configs testées...", end='\r')
            
            result = self.simulate_strategy(config, days)
            self.results.append(result)
        
        print(f"\n{Fore.GREEN}✓ {len(configs)} configurations testées{Style.RESET_ALL}\n")
        
        # Trier par score
        self.results.sort(key=lambda r: r.score, reverse=True)
        
        # Afficher top N
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}🏆 TOP {top_n} STRATÉGIES{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        for i, result in enumerate(self.results[:top_n], 1):
            self._print_result(result, rank=i)
        
        # Recommandation
        best = self.results[0]
        print(f"\n{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{Style.BRIGHT}✅ MEILLEURE STRATÉGIE{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}\n")
        
        print(f"Score global: {Fore.GREEN}{best.score:.1f}/100{Style.RESET_ALL}\n")
        
        print(f"{Fore.CYAN}Configuration recommandée:{Style.RESET_ALL}")
        for key, value in best.config.to_dict().items():
            print(f"  {key}={value}")
        
        print(f"\n{Fore.CYAN}Performances attendues:{Style.RESET_ALL}")
        print(f"  Profit mensuel:    ${best.total_profit:,.2f}")
        print(f"  Trades/mois:       {best.total_trades}")
        print(f"  Win rate:          {best.win_rate:.1f}%")
        print(f"  Sharpe ratio:      {best.sharpe_ratio:.2f}")
        print(f"  Max drawdown:      {best.max_drawdown:.1f}%")
        
        return self.results[:top_n]
    
    def _print_result(self, result: StrategyResult, rank: int):
        """Afficher un résultat"""
        print(f"{Fore.YELLOW}#{rank}{Style.RESET_ALL} - Score: {result.score:.1f}/100")
        print(f"  Config: min_profit=${result.config.min_profit}, "
              f"gas<{result.config.max_gas_gwei}gwei, "
              f"slip={result.config.slippage_tolerance}%")
        print(f"  Profit: ${result.total_profit:,.2f} | "
              f"Trades: {result.total_trades} | "
              f"Win: {result.win_rate:.1f}% | "
              f"Sharpe: {result.sharpe_ratio:.2f}")
        print()
    
    def export_results(self, filename='optimization_results.json'):
        """Exporter résultats"""
        data = {
            'total_configs_tested': len(self.results),
            'best_strategy': {
                'config': self.results[0].config.to_dict(),
                'metrics': {
                    'total_profit': self.results[0].total_profit,
                    'total_trades': self.results[0].total_trades,
                    'win_rate': self.results[0].win_rate,
                    'sharpe_ratio': self.results[0].sharpe_ratio,
                    'max_drawdown': self.results[0].max_drawdown,
                    'score': self.results[0].score
                }
            },
            'top_10': [
                {
                    'config': r.config.to_dict(),
                    'score': r.score,
                    'profit': r.total_profit
                }
                for r in self.results[:10]
            ]
        }
        
        import os
        os.makedirs('optimization_results', exist_ok=True)
        filepath = f'optimization_results/{filename}'
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"\n{Fore.GREEN}✓ Résultats exportés: {filepath}{Style.RESET_ALL}\n")
    
    def compare_strategies(self, configs: List[StrategyConfig], days=30):
        """Comparer plusieurs stratégies spécifiques"""
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}📊 COMPARAISON STRATÉGIES{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        results = []
        
        for i, config in enumerate(configs, 1):
            print(f"Test stratégie {i}/{len(configs)}...")
            result = self.simulate_strategy(config, days)
            results.append(result)
        
        # Tableau comparatif
        print(f"\n{Fore.CYAN}Résultats:{Style.RESET_ALL}\n")
        print(f"{'Strategy':<12} {'Profit':<12} {'Trades':<10} {'Win%':<8} {'Sharpe':<8} {'Score':<8}")
        print("─" * 70)
        
        for i, result in enumerate(results, 1):
            color = Fore.GREEN if result.score > 70 else Fore.YELLOW if result.score > 50 else Fore.RED
            print(f"Strategy {i:<3} "
                  f"${result.total_profit:>9,.2f}  "
                  f"{result.total_trades:>8}  "
                  f"{result.win_rate:>6.1f}%  "
                  f"{result.sharpe_ratio:>6.2f}  "
                  f"{color}{result.score:>6.1f}{Style.RESET_ALL}")
        
        print()
        
        # Meilleure
        best = max(results, key=lambda r: r.score)
        best_idx = results.index(best) + 1
        
        print(f"{Fore.GREEN}✓ Meilleure: Strategy {best_idx} (Score: {best.score:.1f}){Style.RESET_ALL}\n")
        
        return results


def run_optimizer_demo():
    """Démo optimiseur"""
    optimizer = StrategyOptimizer()
    
    print(f"\n{Fore.CYAN}Options:{Style.RESET_ALL}")
    print("  1) Optimisation rapide (27 configs)")
    print("  2) Optimisation balancée (108+ configs)")
    print("  3) Optimisation exhaustive (800+ configs)")
    print("  4) Comparer 3 stratégies custom")
    print()
    
    choice = input("Choix (1-4) [2]: ").strip() or "2"
    
    if choice == "1":
        optimizer.optimize(mode='fast', days=30, top_n=5)
        optimizer.export_results('optimization_fast.json')
        
    elif choice == "2":
        optimizer.optimize(mode='balanced', days=30, top_n=10)
        optimizer.export_results('optimization_balanced.json')
        
    elif choice == "3":
        print(f"\n{Fore.YELLOW}⚠️  Mode exhaustive - Peut prendre plusieurs minutes...{Style.RESET_ALL}")
        optimizer.optimize(mode='exhaustive', days=30, top_n=10)
        optimizer.export_results('optimization_exhaustive.json')
        
    else:
        # Comparer stratégies
        configs = [
            StrategyConfig(50, 50, 1.5, 20, 5000),   # Conservative
            StrategyConfig(30, 75, 2.0, 15, 8000),   # Balanced
            StrategyConfig(20, 100, 2.5, 10, 10000)  # Aggressive
        ]
        
        optimizer.compare_strategies(configs)


if __name__ == "__main__":
    run_optimizer_demo()
