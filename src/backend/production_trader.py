#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🚀 THESORIA - PRODUCTION TRADER (MODE RÉEL)
═══════════════════════════════════════════════════════════════════════════════

SYSTÈME DE TRADING PRODUCTION RÉEL - SANS SIMULATION

Connecté à:
• Vraies blockchains (Ethereum, Polygon, Arbitrum, etc.)
• Vrais exchanges (Binance, Bybit, etc.)
• Vrais wallets (vos private keys)
• Vraies transactions on-chain
• Vrai argent

⚠️ ATTENTION: Ce module utilise de l'argent RÉEL!

═══════════════════════════════════════════════════════════════════════════════
"""

import asyncio
import os
from datetime import datetime
from typing import Dict, List, Optional
from decimal import Decimal

try:
    from web3 import Web3
    from eth_account import Account
    import ccxt
    from dotenv import load_dotenv
    from colorama import Fore, Style, init
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Run: pip3 install web3 eth-account ccxt python-dotenv colorama")
    exit(1)

init(autoreset=True)
load_dotenv()


class ProductionTrader:
    """Trader production avec connexions réelles"""
    
    def __init__(self):
        self.mode = os.getenv('MODE', 'demo')
        
        if self.mode != 'production':
            raise ValueError("⚠️ MODE must be 'production' in .env file!")
        
        # Connexions blockchain
        self.w3_eth = None
        self.w3_polygon = None
        self.w3_arbitrum = None
        
        # Account
        self.account = None
        
        # Exchanges
        self.binance = None
        self.bybit = None
        
        # Stats
        self.total_profit = 0.0
        self.trades_executed = 0
        self.trades_successful = 0
        
        print(f"{Fore.RED}{Style.BRIGHT}⚠️  PRODUCTION MODE ACTIVATED{Style.RESET_ALL}")
        print(f"{Fore.RED}This is REAL trading with REAL money!{Style.RESET_ALL}\n")
    
    async def initialize(self):
        """Initialiser connexions production"""
        
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}Initializing Production Connections...{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        # 1. Blockchain connections
        await self._init_blockchain()
        
        # 2. Wallet
        await self._init_wallet()
        
        # 3. Exchanges
        await self._init_exchanges()
        
        # 4. Validate
        await self._validate_connections()
        
        print(f"\n{Fore.GREEN}✓ All production connections initialized{Style.RESET_ALL}\n")
    
    async def _init_blockchain(self):
        """Initialiser connexions blockchain"""
        
        print(f"{Fore.YELLOW}1. Initializing Blockchain Connections...{Style.RESET_ALL}\n")
        
        # Ethereum
        eth_rpc = os.getenv('ETH_RPC_URL')
        if not eth_rpc:
            raise ValueError("❌ ETH_RPC_URL not set in .env!")
        
        self.w3_eth = Web3(Web3.HTTPProvider(eth_rpc))
        
        if self.w3_eth.is_connected():
            block = self.w3_eth.eth.block_number
            print(f"  {Fore.GREEN}✓{Style.RESET_ALL} Ethereum Mainnet: Connected (Block {block:,})")
        else:
            raise ConnectionError("❌ Cannot connect to Ethereum!")
        
        # Polygon
        polygon_rpc = os.getenv('POLYGON_RPC_URL')
        if polygon_rpc:
            self.w3_polygon = Web3(Web3.HTTPProvider(polygon_rpc))
            if self.w3_polygon.is_connected():
                block = self.w3_polygon.eth.block_number
                print(f"  {Fore.GREEN}✓{Style.RESET_ALL} Polygon: Connected (Block {block:,})")
        
        # Arbitrum
        arbitrum_rpc = os.getenv('ARBITRUM_RPC_URL')
        if arbitrum_rpc:
            self.w3_arbitrum = Web3(Web3.HTTPProvider(arbitrum_rpc))
            if self.w3_arbitrum.is_connected():
                block = self.w3_arbitrum.eth.block_number
                print(f"  {Fore.GREEN}✓{Style.RESET_ALL} Arbitrum: Connected (Block {block:,})")
        
        print()
    
    async def _init_wallet(self):
        """Initialiser wallet"""
        
        print(f"{Fore.YELLOW}2. Initializing Wallet...{Style.RESET_ALL}\n")
        
        private_key = os.getenv('MAIN_WALLET_PRIVATE_KEY')
        if not private_key:
            raise ValueError("❌ MAIN_WALLET_PRIVATE_KEY not set!")
        
        if not private_key.startswith('0x'):
            private_key = '0x' + private_key
        
        self.account = Account.from_key(private_key)
        
        print(f"  Address: {Fore.CYAN}{self.account.address}{Style.RESET_ALL}")
        
        # Check balances
        eth_balance = self.w3_eth.eth.get_balance(self.account.address)
        eth_balance_ether = self.w3_eth.from_wei(eth_balance, 'ether')
        
        print(f"  ETH Balance: {Fore.GREEN}{eth_balance_ether:.4f} ETH{Style.RESET_ALL}")
        
        if eth_balance_ether < 0.01:
            print(f"  {Fore.YELLOW}⚠️  Low ETH balance! Add ETH for gas fees{Style.RESET_ALL}")
        
        print()
    
    async def _init_exchanges(self):
        """Initialiser exchanges"""
        
        print(f"{Fore.YELLOW}3. Initializing Exchanges...{Style.RESET_ALL}\n")
        
        # Binance
        binance_key = os.getenv('BINANCE_API_KEY')
        binance_secret = os.getenv('BINANCE_API_SECRET')
        
        if binance_key and binance_secret:
            self.binance = ccxt.binance({
                'apiKey': binance_key,
                'secret': binance_secret,
                'enableRateLimit': True,
                'options': {
                    'defaultType': 'spot',
                }
            })
            
            try:
                balance = self.binance.fetch_balance()
                usdt_balance = balance.get('USDT', {}).get('free', 0)
                print(f"  {Fore.GREEN}✓{Style.RESET_ALL} Binance: Connected (USDT: ${usdt_balance:,.2f})")
                
                if usdt_balance < 100:
                    print(f"  {Fore.YELLOW}⚠️  Low USDT balance on Binance{Style.RESET_ALL}")
            except Exception as e:
                print(f"  {Fore.RED}✗{Style.RESET_ALL} Binance: Error - {e}")
        else:
            print(f"  {Fore.YELLOW}⚠{Style.RESET_ALL} Binance: Not configured")
        
        # Bybit
        bybit_key = os.getenv('BYBIT_API_KEY')
        bybit_secret = os.getenv('BYBIT_API_SECRET')
        
        if bybit_key and bybit_secret:
            self.bybit = ccxt.bybit({
                'apiKey': bybit_key,
                'secret': bybit_secret,
                'enableRateLimit': True,
            })
            
            try:
                balance = self.bybit.fetch_balance()
                usdt_balance = balance.get('USDT', {}).get('free', 0)
                print(f"  {Fore.GREEN}✓{Style.RESET_ALL} Bybit: Connected (USDT: ${usdt_balance:,.2f})")
            except Exception as e:
                print(f"  {Fore.YELLOW}⚠{Style.RESET_ALL} Bybit: {e}")
        
        print()
    
    async def _validate_connections(self):
        """Valider toutes les connexions"""
        
        print(f"{Fore.YELLOW}4. Validating Configuration...{Style.RESET_ALL}\n")
        
        errors = []
        
        # Check blockchain
        if not self.w3_eth or not self.w3_eth.is_connected():
            errors.append("Ethereum RPC not connected")
        
        # Check wallet
        if not self.account:
            errors.append("Wallet not initialized")
        
        # Check at least one exchange
        if not self.binance and not self.bybit:
            errors.append("No exchange configured")
        
        if errors:
            print(f"{Fore.RED}Validation Errors:{Style.RESET_ALL}")
            for error in errors:
                print(f"  ❌ {error}")
            raise ValueError("Configuration validation failed!")
        
        print(f"  {Fore.GREEN}✓{Style.RESET_ALL} Configuration validated")
    
    async def execute_swap_on_chain(self, token_in: str, token_out: str,
                                     amount: float, dex: str = 'uniswap') -> Dict:
        """Exécuter swap on-chain RÉEL"""
        
        print(f"\n{Fore.CYAN}{'─' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}Executing ON-CHAIN SWAP (REAL){Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'─' * 70}{Style.RESET_ALL}\n")
        
        print(f"  Token In:  {token_in}")
        print(f"  Token Out: {token_out}")
        print(f"  Amount:    {amount}")
        print(f"  DEX:       {dex}")
        print()
        
        # REAL IMPLEMENTATION HERE
        # This is where you'd call Uniswap/Sushiswap router
        
        print(f"{Fore.RED}⚠️  REAL SWAP EXECUTION PAUSED{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Implement router call in production{Style.RESET_ALL}\n")
        
        return {
            'success': False,
            'message': 'Manual implementation required',
            'tx_hash': None
        }
    
    async def execute_trade_on_exchange(self, symbol: str, side: str,
                                        amount: float, exchange: str = 'binance') -> Dict:
        """Exécuter trade sur exchange RÉEL"""
        
        print(f"\n{Fore.CYAN}{'─' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}Executing EXCHANGE TRADE (REAL){Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'─' * 70}{Style.RESET_ALL}\n")
        
        print(f"  Exchange: {exchange}")
        print(f"  Symbol:   {symbol}")
        print(f"  Side:     {side}")
        print(f"  Amount:   {amount}")
        print()
        
        if exchange == 'binance' and self.binance:
            try:
                # Get current price
                ticker = self.binance.fetch_ticker(symbol)
                current_price = ticker['last']
                
                print(f"  Current Price: ${current_price:,.4f}")
                
                # Calculate total
                if side == 'buy':
                    total = amount * current_price
                    print(f"  Total Cost: ${total:,.2f}")
                else:
                    total = amount * current_price
                    print(f"  Total Receive: ${total:,.2f}")
                
                # Confirmation
                print(f"\n{Fore.YELLOW}⚠️  REAL ORDER - Confirm?{Style.RESET_ALL}")
                confirm = input("  Type 'EXECUTE' to confirm: ")
                
                if confirm != 'EXECUTE':
                    print(f"{Fore.RED}✗ Trade cancelled{Style.RESET_ALL}\n")
                    return {'success': False, 'message': 'Cancelled by user'}
                
                # Execute order
                print(f"\n{Fore.CYAN}Placing order...{Style.RESET_ALL}")
                
                order = self.binance.create_market_order(
                    symbol=symbol,
                    side=side,
                    amount=amount
                )
                
                print(f"{Fore.GREEN}✓ Order executed!{Style.RESET_ALL}")
                print(f"  Order ID: {order['id']}")
                print(f"  Status: {order['status']}")
                print(f"  Filled: {order['filled']}")
                print()
                
                self.trades_executed += 1
                self.trades_successful += 1
                
                return {
                    'success': True,
                    'order_id': order['id'],
                    'filled': order['filled'],
                    'price': order.get('average', current_price)
                }
                
            except Exception as e:
                print(f"{Fore.RED}✗ Trade failed: {e}{Style.RESET_ALL}\n")
                self.trades_executed += 1
                return {'success': False, 'error': str(e)}
        
        return {'success': False, 'message': 'Exchange not available'}
    
    async def run_production_cycle(self):
        """Cycle de trading production"""
        
        print(f"\n{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{Style.BRIGHT}🚀 PRODUCTION TRADING CYCLE{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}\n")
        
        print(f"{Fore.CYAN}Monitoring markets for opportunities...{Style.RESET_ALL}\n")
        
        # Example: Monitor ETH/USDC on Binance
        if self.binance:
            try:
                ticker = self.binance.fetch_ticker('ETH/USDC')
                
                print(f"ETH/USDC:")
                print(f"  Price: ${ticker['last']:,.2f}")
                print(f"  24h Change: {ticker['percentage']:.2f}%")
                print(f"  Volume: ${ticker['quoteVolume']:,.0f}")
                print()
                
            except Exception as e:
                print(f"Error fetching ticker: {e}\n")
        
        # Stats
        print(f"{Fore.YELLOW}Session Stats:{Style.RESET_ALL}")
        print(f"  Trades Executed: {self.trades_executed}")
        print(f"  Successful: {self.trades_successful}")
        print(f"  Total Profit: ${self.total_profit:,.2f}")
        print()


async def main():
    """Point d'entrée production"""
    
    print(f"\n{Fore.RED}{'╔' + '═' * 68 + '╗'}{Style.RESET_ALL}")
    print(f"{Fore.RED}║{' ' * 15}🚀 PRODUCTION TRADER{' ' * 31}║{Style.RESET_ALL}")
    print(f"{Fore.RED}{'╚' + '═' * 68 + '╝'}{Style.RESET_ALL}\n")
    
    # Check .env exists
    if not os.path.exists('.env'):
        print(f"{Fore.RED}❌ .env file not found!{Style.RESET_ALL}")
        print(f"Create one: cp .env.example .env")
        print(f"Then fill it with your production keys\n")
        return
    
    # Initialize trader
    trader = ProductionTrader()
    
    try:
        # Initialize connections
        await trader.initialize()
        
        # Run cycle
        await trader.run_production_cycle()
        
        print(f"\n{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}✓ Production cycle complete{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}\n")
        
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}⚠️  Shutdown requested{Style.RESET_ALL}\n")
    
    except Exception as e:
        print(f"\n{Fore.RED}❌ Error: {e}{Style.RESET_ALL}\n")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
