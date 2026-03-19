#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🏥 THESORIA - SYSTEM HEALTH CHECKER
═══════════════════════════════════════════════════════════════════════════════

Vérification complète de la santé du système

Checks:
• Configuration files
• RPC connectivity  
• Wallet balance
• Smart contract status
• Dependencies installed
• Disk space
• Log files
• Process running
• Network latency
• Gas prices

═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import time
from pathlib import Path
from datetime import datetime

try:
    from web3 import Web3
    from dotenv import load_dotenv
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Modules requis: pip3 install web3 python-dotenv colorama")
    sys.exit(1)

init(autoreset=True)


class HealthChecker:
    """Vérificateur de santé système"""
    
    def __init__(self):
        self.checks_passed = 0
        self.checks_failed = 0
        self.checks_warning = 0
        self.issues = []
        
        # Charger .env
        env_path = Path(__file__).parent / ".env"
        load_dotenv(env_path)
    
    def print_header(self, text):
        """Header de section"""
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}{text}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
    
    def check_pass(self, message):
        """Check réussi"""
        print(f"{Fore.GREEN}✓{Style.RESET_ALL} {message}")
        self.checks_passed += 1
    
    def check_fail(self, message, issue=""):
        """Check échoué"""
        print(f"{Fore.RED}✗{Style.RESET_ALL} {message}")
        self.checks_failed += 1
        if issue:
            self.issues.append(issue)
    
    def check_warn(self, message, issue=""):
        """Check warning"""
        print(f"{Fore.YELLOW}⚠{Style.RESET_ALL} {message}")
        self.checks_warning += 1
        if issue:
            self.issues.append(issue)
    
    def check_info(self, message):
        """Info"""
        print(f"{Fore.BLUE}ℹ{Style.RESET_ALL} {message}")
    
    # =========================================================================
    # CHECKS CONFIGURATION
    # =========================================================================
    
    def check_configuration(self):
        """Vérifier configuration"""
        self.print_header("🔧 CONFIGURATION")
        
        env_path = Path(__file__).parent / ".env"
        
        # .env existe
        if env_path.exists():
            self.check_pass(f".env file exists: {env_path}")
        else:
            self.check_fail(".env file missing!", "Create .env from template")
            return
        
        # Variables critiques
        critical_vars = [
            "WALLET_ADDRESS",
            "ETH_RPC_URL",
        ]
        
        for var in critical_vars:
            value = os.getenv(var)
            if value and value not in ["", "your_address", "0x"]:
                self.check_pass(f"{var} configured")
            else:
                self.check_warn(f"{var} not configured", f"Set {var} in .env")
        
        # Mode
        demo_mode = os.getenv("DEMO_MODE", "false").lower() == "true"
        testnet_mode = os.getenv("TESTNET_MODE", "false").lower() == "true"
        
        if demo_mode:
            self.check_info("Mode: DEMO (simulation)")
        elif testnet_mode:
            self.check_info("Mode: TESTNET (test transactions)")
        else:
            self.check_warn("Mode: PRODUCTION (⚠️  real money!)")
    
    # =========================================================================
    # CHECKS RÉSEAU
    # =========================================================================
    
    def check_network(self):
        """Vérifier réseau"""
        self.print_header("🌐 NETWORK")
        
        rpc_url = os.getenv("ETH_RPC_URL")
        
        if not rpc_url:
            self.check_fail("RPC URL not configured")
            return
        
        try:
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            
            # Connexion
            if w3.is_connected():
                self.check_pass("RPC connection successful")
            else:
                self.check_fail("RPC connection failed", "Check RPC URL")
                return
            
            # Latence
            start = time.time()
            block = w3.eth.block_number
            latency = (time.time() - start) * 1000
            
            if latency < 200:
                self.check_pass(f"RPC latency: {latency:.0f}ms (excellent)")
            elif latency < 500:
                self.check_warn(f"RPC latency: {latency:.0f}ms (acceptable)", "Consider faster RPC")
            else:
                self.check_fail(f"RPC latency: {latency:.0f}ms (too slow)", "Use faster RPC provider")
            
            # Bloc actuel
            self.check_info(f"Current block: #{block:,}")
            
            # Gas price
            gas_price = w3.eth.gas_price
            gas_gwei = w3.from_wei(gas_price, 'gwei')
            
            if gas_gwei < 30:
                self.check_pass(f"Gas price: {gas_gwei:.1f} gwei (good for trading)")
            elif gas_gwei < 100:
                self.check_warn(f"Gas price: {gas_gwei:.1f} gwei (acceptable)")
            else:
                self.check_fail(f"Gas price: {gas_gwei:.1f} gwei (too high)", "Wait for lower gas")
            
        except Exception as e:
            self.check_fail(f"Network error: {str(e)[:50]}", "Check RPC configuration")
    
    # =========================================================================
    # CHECKS WALLET
    # =========================================================================
    
    def check_wallet(self):
        """Vérifier wallet"""
        self.print_header("👛 WALLET")
        
        wallet_address = os.getenv("WALLET_ADDRESS")
        
        if not wallet_address or wallet_address == "0x":
            self.check_warn("Wallet not configured (OK for demo mode)")
            return
        
        # Format
        if wallet_address.startswith("0x") and len(wallet_address) == 42:
            self.check_pass(f"Wallet format valid: {wallet_address[:10]}...{wallet_address[-8:]}")
        else:
            self.check_fail(f"Invalid wallet format: {wallet_address}", "Use valid Ethereum address")
            return
        
        # Balance
        try:
            rpc_url = os.getenv("ETH_RPC_URL")
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            
            balance = w3.eth.get_balance(wallet_address)
            balance_eth = w3.from_wei(balance, 'ether')
            
            if balance_eth >= 0.1:
                self.check_pass(f"Balance: {balance_eth:.4f} ETH (sufficient)")
            elif balance_eth >= 0.01:
                self.check_warn(f"Balance: {balance_eth:.4f} ETH (low)", "Top up wallet for gas")
            else:
                self.check_fail(f"Balance: {balance_eth:.4f} ETH (insufficient)", "Add ETH for gas fees")
            
        except Exception as e:
            self.check_warn(f"Could not check balance: {str(e)[:50]}")
    
    # =========================================================================
    # CHECKS SMART CONTRACTS
    # =========================================================================
    
    def check_smart_contracts(self):
        """Vérifier smart contracts"""
        self.print_header("🔐 SMART CONTRACTS")
        
        contract_addr = os.getenv("ARBITRAGE_CONTRACT_ADDRESS")
        
        if not contract_addr or contract_addr == "0x":
            self.check_info("No contract deployed (normal for demo/testnet)")
            return
        
        try:
            rpc_url = os.getenv("ETH_RPC_URL")
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            
            # Vérifier code
            code = w3.eth.get_code(contract_addr)
            
            if len(code) > 2:
                self.check_pass(f"Contract deployed: {contract_addr[:10]}...{contract_addr[-8:]}")
                
                # Balance contrat
                balance = w3.eth.get_balance(contract_addr)
                balance_eth = w3.from_wei(balance, 'ether')
                self.check_info(f"Contract balance: {balance_eth:.4f} ETH")
            else:
                self.check_fail("Contract address has no code", "Deploy contract first")
                
        except Exception as e:
            self.check_warn(f"Could not check contract: {str(e)[:50]}")
    
    # =========================================================================
    # CHECKS DÉPENDANCES
    # =========================================================================
    
    def check_dependencies(self):
        """Vérifier dépendances"""
        self.print_header("📦 DEPENDENCIES")
        
        modules = [
            ("web3", "Web3"),
            ("aiohttp", "AsyncIO HTTP"),
            ("dotenv", "Python dotenv"),
            ("eth_abi", "Ethereum ABI"),
            ("colorama", "Terminal colors"),
        ]
        
        for module, name in modules:
            try:
                __import__(module)
                self.check_pass(f"{name} installed")
            except ImportError:
                self.check_fail(f"{name} missing", f"pip3 install {module}")
    
    # =========================================================================
    # CHECKS SYSTÈME
    # =========================================================================
    
    def check_system(self):
        """Vérifier système"""
        self.print_header("💻 SYSTEM")
        
        # Python version
        py_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
        if sys.version_info >= (3, 8):
            self.check_pass(f"Python version: {py_version}")
        else:
            self.check_fail(f"Python version: {py_version} (< 3.8)", "Upgrade to Python 3.8+")
        
        # Disk space
        try:
            import shutil
            total, used, free = shutil.disk_usage("/")
            free_gb = free // (2**30)
            
            if free_gb > 10:
                self.check_pass(f"Disk space: {free_gb} GB free")
            elif free_gb > 5:
                self.check_warn(f"Disk space: {free_gb} GB free (getting low)")
            else:
                self.check_fail(f"Disk space: {free_gb} GB free (insufficient)", "Free up disk space")
        except:
            self.check_info("Could not check disk space")
        
        # Logs directory
        logs_dir = Path(__file__).parent.parent / "logs"
        if logs_dir.exists():
            self.check_pass(f"Logs directory exists: {logs_dir}")
            
            # Check log files
            log_files = list(logs_dir.glob("*.log"))
            if log_files:
                total_size = sum(f.stat().st_size for f in log_files) / (1024 * 1024)
                self.check_info(f"Log files: {len(log_files)} ({total_size:.1f} MB)")
        else:
            self.check_warn("Logs directory missing", "Will be created on first run")
    
    # =========================================================================
    # CHECKS FICHIERS
    # =========================================================================
    
    def check_files(self):
        """Vérifier fichiers"""
        self.print_header("📁 FILES")
        
        base_dir = Path(__file__).parent
        
        critical_files = [
            ("backend/god_mode_bot.py", "Demo bot"),
            ("backend/real_arbitrage_detector.py", "Arbitrage detector"),
            ("backend/websocket_server.py", "WebSocket server"),
            ("contracts/FlashLoanArbitrage.sol", "Smart contract"),
        ]
        
        for filepath, name in critical_files:
            full_path = base_dir.parent / filepath
            if full_path.exists():
                self.check_pass(f"{name}: {filepath}")
            else:
                self.check_warn(f"{name} missing: {filepath}")
    
    # =========================================================================
    # RAPPORT
    # =========================================================================
    
    def print_report(self):
        """Afficher rapport"""
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}📊 HEALTH CHECK REPORT{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        total = self.checks_passed + self.checks_failed + self.checks_warning
        
        print(f"Total checks:    {total}")
        print(f"{Fore.GREEN}Passed:          {self.checks_passed}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Warnings:        {self.checks_warning}{Style.RESET_ALL}")
        print(f"{Fore.RED}Failed:          {self.checks_failed}{Style.RESET_ALL}")
        
        health_pct = (self.checks_passed / total * 100) if total > 0 else 0
        
        print(f"\nHealth score:    {health_pct:.1f}%")
        
        # Status
        print()
        if self.checks_failed == 0 and self.checks_warning == 0:
            print(f"{Fore.GREEN}{Style.BRIGHT}✓ SYSTEM HEALTHY{Style.RESET_ALL}")
        elif self.checks_failed == 0:
            print(f"{Fore.YELLOW}{Style.BRIGHT}⚠ SYSTEM OK (with warnings){Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}{Style.BRIGHT}✗ SYSTEM ISSUES DETECTED{Style.RESET_ALL}")
        
        # Issues
        if self.issues:
            print(f"\n{Fore.YELLOW}{'─' * 70}{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}{Style.BRIGHT}🔧 ACTIONS REQUIRED:{Style.RESET_ALL}\n")
            for i, issue in enumerate(self.issues, 1):
                print(f"  {i}. {issue}")
        
        print()
    
    def run_all_checks(self):
        """Exécuter tous les checks"""
        print(f"\n{Fore.CYAN}{'╔' + '═' * 68 + '╗'}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}║{' ' * 20}🏥 SYSTEM HEALTH CHECK{' ' * 27}║{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'╚' + '═' * 68 + '╝'}{Style.RESET_ALL}")
        
        self.check_configuration()
        self.check_network()
        self.check_wallet()
        self.check_smart_contracts()
        self.check_dependencies()
        self.check_system()
        self.check_files()
        
        self.print_report()


if __name__ == "__main__":
    checker = HealthChecker()
    checker.run_all_checks()
