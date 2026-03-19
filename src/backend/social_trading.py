#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
👥 THESORIA - SOCIAL TRADING / COPY TRADING
═══════════════════════════════════════════════════════════════════════════════

Système de trading social et copy trading

Fonctionnalités:
• Suivre traders experts
• Copy trading automatique
• Leaderboard performance
• Partage stratégies
• Social feed
• Rating système
• Auto-follow top traders
• Profit sharing

Modes:
• Mirror Trading (copie exacte)
• Proportional (ajusté capital)
• Inverse Trading (opposé)
• Selective Copy (filtres)

Features:
• Performance tracking
• Risk analysis followers
• Reputation system
• Commission système
• Transparent stats
• Real-time notifications

═══════════════════════════════════════════════════════════════════════════════
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Optional
from enum import Enum
import random

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


class CopyMode(Enum):
    """Modes de copy trading"""
    MIRROR = "Mirror (copie exacte)"
    PROPORTIONAL = "Proportional (ajusté)"
    INVERSE = "Inverse (opposé)"
    SELECTIVE = "Selective (avec filtres)"


@dataclass
class Trader:
    """Trader sur plateforme"""
    id: str
    username: str
    total_profit: float
    total_trades: int
    win_rate: float
    sharpe_ratio: float
    max_drawdown: float
    followers: int
    reputation: float  # 0-5 étoiles
    verified: bool
    
    @property
    def score(self) -> float:
        """Score global 0-100"""
        profit_score = min(self.total_profit / 10000 * 30, 30)
        win_rate_score = self.win_rate * 0.25
        sharpe_score = min(self.sharpe_ratio / 3 * 20, 20)
        reputation_score = self.reputation / 5 * 15
        verified_bonus = 10 if self.verified else 0
        
        return profit_score + win_rate_score + sharpe_score + reputation_score + verified_bonus


@dataclass
class CopyConfig:
    """Configuration copy trading"""
    trader_id: str
    mode: CopyMode
    max_copy_amount: float
    min_profit_threshold: float
    stop_loss_pct: float
    enabled: bool


@dataclass
class CopiedTrade:
    """Trade copié"""
    original_trader: str
    follower: str
    pair: str
    original_amount: float
    copied_amount: float
    profit: float
    timestamp: datetime


class SocialTrading:
    """Système de trading social"""
    
    def __init__(self):
        self.traders = self._generate_traders()
        self.followers: Dict[str, List[CopyConfig]] = {}
        self.copied_trades: List[CopiedTrade] = []
    
    def _generate_traders(self) -> List[Trader]:
        """Générer traders exemple"""
        traders = []
        
        usernames = [
            "CryptoKing", "ETH_Wizard", "DeFi_Master", "ArbitrageGod",
            "BlockchainPro", "YieldHunter", "MEV_Expert", "FlashLoanKing",
            "CryptoWhale", "TradingBot", "SmartContract", "Web3Trader"
        ]
        
        for i, username in enumerate(usernames):
            trader = Trader(
                id=f"trader_{i+1:03d}",
                username=username,
                total_profit=random.uniform(5000, 50000),
                total_trades=random.randint(100, 1000),
                win_rate=random.uniform(60, 85),
                sharpe_ratio=random.uniform(1.5, 3.0),
                max_drawdown=random.uniform(5, 15),
                followers=random.randint(10, 500),
                reputation=random.uniform(3.5, 5.0),
                verified=random.random() > 0.3
            )
            traders.append(trader)
        
        return traders
    
    def get_leaderboard(self, limit: int = 10) -> List[Trader]:
        """Obtenir classement traders"""
        return sorted(self.traders, key=lambda t: t.score, reverse=True)[:limit]
    
    def follow_trader(self, follower_id: str, trader_id: str, 
                     mode: CopyMode = CopyMode.PROPORTIONAL,
                     max_amount: float = 1000):
        """Suivre un trader"""
        config = CopyConfig(
            trader_id=trader_id,
            mode=mode,
            max_copy_amount=max_amount,
            min_profit_threshold=50,
            stop_loss_pct=5,
            enabled=True
        )
        
        if follower_id not in self.followers:
            self.followers[follower_id] = []
        
        self.followers[follower_id].append(config)
    
    def copy_trade(self, trader_id: str, original_trade: Dict) -> List[CopiedTrade]:
        """Copier un trade pour tous les followers"""
        copied_trades = []
        
        # Trouver tous les followers de ce trader
        for follower_id, configs in self.followers.items():
            for config in configs:
                if config.trader_id == trader_id and config.enabled:
                    # Calculer montant copié selon mode
                    if config.mode == CopyMode.MIRROR:
                        copied_amount = min(original_trade['amount'], config.max_copy_amount)
                    elif config.mode == CopyMode.PROPORTIONAL:
                        # Ajuster proportionnellement
                        copied_amount = min(
                            original_trade['amount'] * 0.5,  # 50% par défaut
                            config.max_copy_amount
                        )
                    else:
                        copied_amount = config.max_copy_amount * 0.3
                    
                    # Profit proportionnel
                    profit_ratio = original_trade['profit'] / original_trade['amount']
                    copied_profit = copied_amount * profit_ratio
                    
                    # Créer trade copié
                    copied = CopiedTrade(
                        original_trader=trader_id,
                        follower=follower_id,
                        pair=original_trade['pair'],
                        original_amount=original_trade['amount'],
                        copied_amount=copied_amount,
                        profit=copied_profit,
                        timestamp=datetime.now()
                    )
                    
                    copied_trades.append(copied)
                    self.copied_trades.append(copied)
        
        return copied_trades
    
    def get_follower_stats(self, follower_id: str) -> Dict:
        """Statistiques pour un follower"""
        follower_trades = [t for t in self.copied_trades if t.follower == follower_id]
        
        if not follower_trades:
            return {
                'total_trades': 0,
                'total_profit': 0,
                'win_rate': 0,
                'best_trade': 0
            }
        
        total_profit = sum(t.profit for t in follower_trades)
        winning_trades = [t for t in follower_trades if t.profit > 0]
        
        return {
            'total_trades': len(follower_trades),
            'total_profit': total_profit,
            'win_rate': len(winning_trades) / len(follower_trades) * 100,
            'best_trade': max(t.profit for t in follower_trades),
            'avg_profit': total_profit / len(follower_trades)
        }
    
    def print_leaderboard(self, limit: int = 10):
        """Afficher leaderboard"""
        print(f"\n{Fore.CYAN}{'═' * 100}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}👥 SOCIAL TRADING LEADERBOARD{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 100}{Style.RESET_ALL}\n")
        
        leaderboard = self.get_leaderboard(limit)
        
        print(f"{'Rank':<6} {'Trader':<20} {'Profit':<15} {'Trades':<10} {'Win%':<8} {'Sharpe':<8} {'Followers':<12} {'Score':<8}")
        print("─" * 100)
        
        for i, trader in enumerate(leaderboard, 1):
            verified_badge = "✓" if trader.verified else ""
            username = f"{trader.username} {verified_badge}"
            
            profit_str = f"${trader.total_profit:,.0f}"
            
            color = Fore.GREEN if i <= 3 else Fore.YELLOW if i <= 5 else Fore.WHITE
            
            print(f"{color}{i:<6} "
                  f"{username:<20} "
                  f"{profit_str:<15} "
                  f"{trader.total_trades:<10} "
                  f"{trader.win_rate:.1f}%{' ' * 2} "
                  f"{trader.sharpe_ratio:.2f}{' ' * 4} "
                  f"{trader.followers:<12} "
                  f"{trader.score:.1f}{Style.RESET_ALL}")
        
        print()
    
    def print_trader_profile(self, trader: Trader):
        """Afficher profil trader"""
        print(f"\n{Fore.YELLOW}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{Style.BRIGHT}👤 TRADER PROFILE{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{'═' * 70}{Style.RESET_ALL}\n")
        
        verified = "✅ Verified" if trader.verified else "⚠️  Not Verified"
        
        print(f"Username:        {trader.username} {verified}")
        print(f"ID:              {trader.id}")
        print(f"Reputation:      {'⭐' * int(trader.reputation)} ({trader.reputation:.1f}/5)")
        print()
        
        print(f"Performance:")
        print(f"  Total Profit:  ${trader.total_profit:,.2f}")
        print(f"  Total Trades:  {trader.total_trades}")
        print(f"  Win Rate:      {trader.win_rate:.1f}%")
        print(f"  Sharpe Ratio:  {trader.sharpe_ratio:.2f}")
        print(f"  Max Drawdown:  {trader.max_drawdown:.1f}%")
        print()
        
        print(f"Social:")
        print(f"  Followers:     {trader.followers}")
        print(f"  Score:         {trader.score:.1f}/100")
        print()
    
    def run_demo(self):
        """Démo social trading"""
        print(f"\n{Fore.GREEN}{'╔' + '═' * 68 + '╗'}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}║{' ' * 20}👥 SOCIAL TRADING DEMO{' ' * 27}║{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{'╚' + '═' * 68 + '╝'}{Style.RESET_ALL}")
        
        # Leaderboard
        self.print_leaderboard(10)
        
        # Top trader
        top_trader = self.get_leaderboard(1)[0]
        self.print_trader_profile(top_trader)
        
        # Follow
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}📋 COPY TRADING SETUP{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        follower_id = "user_001"
        
        print(f"Following top 3 traders...\n")
        
        for i, trader in enumerate(self.get_leaderboard(3), 1):
            self.follow_trader(
                follower_id=follower_id,
                trader_id=trader.id,
                mode=CopyMode.PROPORTIONAL,
                max_amount=1000
            )
            print(f"{Fore.GREEN}✓ Now following: {trader.username}{Style.RESET_ALL}")
        
        print()
        
        # Simuler trades
        print(f"{Fore.YELLOW}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{Style.BRIGHT}📊 SIMULATING COPIED TRADES{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{'═' * 70}{Style.RESET_ALL}\n")
        
        for trader in self.get_leaderboard(3):
            # Trade original
            original_trade = {
                'pair': 'ETH/USDC',
                'amount': 5000,
                'profit': random.uniform(100, 300)
            }
            
            print(f"Original trade by {trader.username}:")
            print(f"  Amount: ${original_trade['amount']:,.0f}")
            print(f"  Profit: ${original_trade['profit']:.2f}")
            
            # Copier
            copied = self.copy_trade(trader.id, original_trade)
            
            if copied:
                print(f"  → Copied by {len(copied)} follower(s)")
                for ct in copied:
                    print(f"     Copied amount: ${ct.copied_amount:,.0f}, "
                          f"Profit: ${ct.profit:.2f}")
            print()
        
        # Stats follower
        print(f"{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{Style.BRIGHT}💰 FOLLOWER STATS{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}\n")
        
        stats = self.get_follower_stats(follower_id)
        
        print(f"Total Copied Trades:  {stats['total_trades']}")
        print(f"Total Profit:         ${stats['total_profit']:.2f}")
        print(f"Win Rate:             {stats['win_rate']:.1f}%")
        print(f"Best Trade:           ${stats['best_trade']:.2f}")
        print(f"Avg Profit/Trade:     ${stats['avg_profit']:.2f}")
        
        print()


if __name__ == "__main__":
    social = SocialTrading()
    social.run_demo()
