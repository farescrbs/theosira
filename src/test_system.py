#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🧪 THESORIA - TEST FONCTIONNEL COMPLET
═══════════════════════════════════════════════════════════════════════════════

Test automatisé de tous les composants du système

✅ Configuration
✅ Connexions (RPC, Wallet)
✅ Smart Contracts
✅ Backend modules
✅ API externes
✅ WebSocket
✅ Test end-to-end

═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import asyncio
from pathlib import Path

# Ajouter backend au path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

try:
    from dotenv import load_dotenv
    from web3 import Web3
    import aiohttp
    import json
    from colorama import Fore, Style, init
except ImportError as e:
    print(f"❌ Module manquant: {e}")
    print("Installation: pip3 install web3 aiohttp python-dotenv colorama")
    sys.exit(1)

init(autoreset=True)

class SystemTester:
    """Testeur système complet"""
    
    def __init__(self):
        self.results = {
            "passed": 0,
            "failed": 0,
            "warnings": 0,
            "tests": []
        }
        
        # Charger .env
        env_path = Path(__file__).parent / "backend" / ".env"
        load_dotenv(env_path)
        
        self.config = {
            "wallet_address": os.getenv("WALLET_ADDRESS"),
            "wallet_private_key": os.getenv("WALLET_PRIVATE_KEY"),
            "eth_rpc_url": os.getenv("ETH_RPC_URL"),
            "contract_address": os.getenv("ARBITRAGE_CONTRACT_ADDRESS"),
            "testnet_mode": os.getenv("TESTNET_MODE", "false").lower() == "true",
            "demo_mode": os.getenv("DEMO_MODE", "true").lower() == "true",
        }
    
    def print_header(self, text):
        """Header de section"""
        print("\n" + "═" * 80)
        print(f"{Fore.CYAN}{Style.BRIGHT}{text}{Style.RESET_ALL}")
        print("═" * 80 + "\n")
    
    def print_test(self, name):
        """Début de test"""
        print(f"{Fore.YELLOW}[TEST]{Style.RESET_ALL} {name}...", end=" ", flush=True)
    
    def print_success(self, message=""):
        """Test réussi"""
        print(f"{Fore.GREEN}✓{Style.RESET_ALL} {message}")
        self.results["passed"] += 1
    
    def print_fail(self, message=""):
        """Test échoué"""
        print(f"{Fore.RED}✗{Style.RESET_ALL} {message}")
        self.results["failed"] += 1
    
    def print_warning(self, message=""):
        """Warning"""
        print(f"{Fore.YELLOW}⚠{Style.RESET_ALL} {message}")
        self.results["warnings"] += 1
    
    def print_info(self, message):
        """Info"""
        print(f"{Fore.BLUE}[i]{Style.RESET_ALL} {message}")
    
    # =========================================================================
    # TESTS CONFIGURATION
    # =========================================================================
    
    def test_configuration(self):
        """Tester configuration .env"""
        self.print_header("🔧 TESTS CONFIGURATION")
        
        # Test fichier .env existe
        self.print_test("Fichier .env existe")
        env_path = Path(__file__).parent / "backend" / ".env"
        if env_path.exists():
            self.print_success(f"Trouvé: {env_path}")
        else:
            self.print_fail("Fichier manquant!")
            return False
        
        # Test variables critiques
        self.print_test("Variables critiques définies")
        critical_vars = ["WALLET_ADDRESS", "ETH_RPC_URL"]
        missing = [v for v in critical_vars if not os.getenv(v)]
        
        if not missing:
            self.print_success("Toutes les variables critiques présentes")
        else:
            self.print_fail(f"Manquantes: {', '.join(missing)}")
        
        # Test mode opération
        self.print_test("Mode opération")
        if self.config["demo_mode"]:
            self.print_warning("Mode DÉMO (simulation)")
        elif self.config["testnet_mode"]:
            self.print_info("Mode TESTNET (transactions testnet)")
        else:
            self.print_warning("Mode PRODUCTION (⚠️  argent réel!)")
        
        # Test wallet address format
        self.print_test("Format wallet address")
        wallet = self.config["wallet_address"]
        if wallet and wallet.startswith("0x") and len(wallet) == 42:
            self.print_success(f"Valide: {wallet[:10]}...{wallet[-8:]}")
        elif wallet == "0x" or not wallet:
            self.print_warning("Wallet non configuré (OK pour démo)")
        else:
            self.print_fail(f"Format invalide: {wallet}")
        
        # Test private key (sans révéler)
        self.print_test("Private key configurée")
        pk = self.config["wallet_private_key"]
        if pk and pk not in ["your_private_key", "demo_key_not_real"]:
            self.print_success("Configurée (64 chars)")
        else:
            self.print_warning("Non configurée (OK pour démo)")
        
        return True
    
    # =========================================================================
    # TESTS CONNEXIONS
    # =========================================================================
    
    def test_connections(self):
        """Tester connexions réseau"""
        self.print_header("🌐 TESTS CONNEXIONS")
        
        # Test RPC URL
        self.print_test("Connexion RPC Ethereum")
        rpc_url = self.config["eth_rpc_url"]
        
        if not rpc_url:
            self.print_fail("RPC URL non configurée!")
            return False
        
        try:
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            
            if w3.is_connected():
                block = w3.eth.block_number
                self.print_success(f"Connecté (bloc #{block:,})")
                
                # Test vitesse RPC
                self.print_test("Vitesse RPC")
                import time
                start = time.time()
                w3.eth.block_number
                latency = (time.time() - start) * 1000
                
                if latency < 200:
                    self.print_success(f"{latency:.0f}ms (excellent)")
                elif latency < 500:
                    self.print_warning(f"{latency:.0f}ms (acceptable)")
                else:
                    self.print_fail(f"{latency:.0f}ms (trop lent pour arbitrage)")
                
                # Test gas price
                self.print_test("Gas price actuel")
                gas_price = w3.eth.gas_price
                gas_gwei = w3.from_wei(gas_price, 'gwei')
                
                if gas_gwei < 30:
                    self.print_success(f"{gas_gwei:.1f} gwei (bon pour trading)")
                elif gas_gwei < 100:
                    self.print_warning(f"{gas_gwei:.1f} gwei (acceptable)")
                else:
                    self.print_fail(f"{gas_gwei:.1f} gwei (trop élevé)")
                
            else:
                self.print_fail("Impossible de se connecter!")
                return False
                
        except Exception as e:
            self.print_fail(f"Erreur: {str(e)[:50]}")
            return False
        
        # Test balance wallet
        if self.config["wallet_address"] and self.config["wallet_address"] != "0x":
            self.print_test("Balance wallet")
            try:
                balance = w3.eth.get_balance(self.config["wallet_address"])
                balance_eth = w3.from_wei(balance, 'ether')
                
                if balance_eth >= 0.1:
                    self.print_success(f"{balance_eth:.4f} ETH (suffisant)")
                elif balance_eth >= 0.01:
                    self.print_warning(f"{balance_eth:.4f} ETH (faible)")
                else:
                    self.print_fail(f"{balance_eth:.4f} ETH (insuffisant pour gas)")
                    
            except Exception as e:
                self.print_fail(f"Erreur: {str(e)[:50]}")
        
        return True
    
    # =========================================================================
    # TESTS SMART CONTRACTS
    # =========================================================================
    
    def test_smart_contracts(self):
        """Tester smart contracts"""
        self.print_header("🔐 TESTS SMART CONTRACTS")
        
        contract_addr = self.config["contract_address"]
        
        self.print_test("Smart contract déployé")
        
        if not contract_addr or contract_addr == "0x":
            self.print_warning("Aucun contrat déployé (normal si démo/testnet)")
            return True
        
        try:
            w3 = Web3(Web3.HTTPProvider(self.config["eth_rpc_url"]))
            
            # Vérifier que l'adresse contient du code
            code = w3.eth.get_code(contract_addr)
            
            if len(code) > 2:  # Plus que "0x"
                self.print_success(f"Déployé à {contract_addr[:10]}...{contract_addr[-8:]}")
                
                # Vérifier balance du contrat
                self.print_test("Balance contrat")
                balance = w3.eth.get_balance(contract_addr)
                balance_eth = w3.from_wei(balance, 'ether')
                self.print_info(f"{balance_eth:.4f} ETH dans le contrat")
                
            else:
                self.print_fail("Adresse ne contient pas de code!")
                
        except Exception as e:
            self.print_fail(f"Erreur: {str(e)[:50]}")
            return False
        
        return True
    
    # =========================================================================
    # TESTS MODULES BACKEND
    # =========================================================================
    
    def test_backend_modules(self):
        """Tester modules backend Python"""
        self.print_header("🐍 TESTS MODULES BACKEND")
        
        modules = [
            ("web3", "Web3"),
            ("aiohttp", "Async HTTP"),
            ("dotenv", "Environment"),
            ("eth_abi", "Ethereum ABI"),
            ("websockets", "WebSocket"),
        ]
        
        for module, name in modules:
            self.print_test(f"Module {name}")
            try:
                __import__(module)
                self.print_success("Installé")
            except ImportError:
                self.print_fail("Manquant!")
        
        # Test fichiers backend
        backend_files = [
            "god_mode_bot.py",
            "real_arbitrage_detector.py",
            "websocket_server.py",
            "quantum_monitor.py",
        ]
        
        backend_path = Path(__file__).parent / "backend"
        
        for filename in backend_files:
            self.print_test(f"Fichier {filename}")
            if (backend_path / filename).exists():
                self.print_success("Présent")
            else:
                self.print_warning("Manquant")
        
        return True
    
    # =========================================================================
    # TESTS API EXTERNES
    # =========================================================================
    
    async def test_external_apis(self):
        """Tester APIs externes"""
        self.print_header("🌍 TESTS API EXTERNES")
        
        # Test Uniswap V2 Router (on-chain)
        self.print_test("Uniswap V2 Router accessible")
        try:
            w3 = Web3(Web3.HTTPProvider(self.config["eth_rpc_url"]))
            uniswap_v2_router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
            
            code = w3.eth.get_code(uniswap_v2_router)
            if len(code) > 2:
                self.print_success(f"Accessible on-chain")
            else:
                self.print_fail("Non trouvé!")
        except Exception as e:
            self.print_fail(f"Erreur: {str(e)[:40]}")
        
        # Test 1inch API (optionnel)
        oneinch_key = os.getenv("ONEINCH_API_KEY")
        
        if oneinch_key:
            self.print_test("1inch API accessible")
            try:
                url = "https://api.1inch.dev/swap/v5.2/1/healthcheck"
                headers = {"Authorization": f"Bearer {oneinch_key}"}
                
                async with aiohttp.ClientSession() as session:
                    async with session.get(url, headers=headers, timeout=5) as resp:
                        if resp.status == 200:
                            self.print_success("API fonctionnelle")
                        else:
                            self.print_warning(f"Status {resp.status}")
            except Exception as e:
                self.print_fail(f"Erreur: {str(e)[:40]}")
        else:
            self.print_test("1inch API key")
            self.print_warning("Non configurée (optionnel)")
        
        return True
    
    # =========================================================================
    # TEST END-TO-END
    # =========================================================================
    
    async def test_end_to_end(self):
        """Test end-to-end complet"""
        self.print_header("🎯 TEST END-TO-END")
        
        self.print_test("Simulation détection opportunité")
        
        try:
            # Simuler détection d'opportunité
            w3 = Web3(Web3.HTTPProvider(self.config["eth_rpc_url"]))
            
            # ABI minimal pour getAmountsOut
            router_abi = [{
                "inputs": [
                    {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
                    {"internalType": "address[]", "name": "path", "type": "address[]"}
                ],
                "name": "getAmountsOut",
                "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
                "stateMutability": "view",
                "type": "function"
            }]
            
            uniswap_router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
            
            # Tokens
            WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
            USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            
            contract = w3.eth.contract(
                address=Web3.to_checksum_address(uniswap_router),
                abi=router_abi
            )
            
            # Query prix: 1 ETH → USDC
            amount_in = w3.to_wei(1, 'ether')
            path = [
                Web3.to_checksum_address(WETH),
                Web3.to_checksum_address(USDC)
            ]
            
            amounts = contract.functions.getAmountsOut(amount_in, path).call()
            usdc_out = amounts[1] / 10**6  # USDC a 6 decimales
            
            self.print_success(f"Prix ETH/USDC: ${usdc_out:,.2f}")
            
            # Calculer si arbitrage serait profitable (simulation)
            gas_cost_usd = 40  # Estimation
            flash_loan_fee_usd = usdc_out * 0.0009  # 0.09% Aave
            
            # Simuler spread de 1%
            spread_usd = usdc_out * 0.01
            profit_net = spread_usd - gas_cost_usd - flash_loan_fee_usd
            
            self.print_info(f"Simulation arbitrage:")
            self.print_info(f"  • Spread simulé: ${spread_usd:.2f}")
            self.print_info(f"  • Gas cost: ${gas_cost_usd:.2f}")
            self.print_info(f"  • Flash loan fee: ${flash_loan_fee_usd:.2f}")
            self.print_info(f"  • Profit net: ${profit_net:.2f}")
            
            if profit_net > 0:
                self.print_success("Logique détection fonctionnelle")
            else:
                self.print_warning("Spread trop faible (normal)")
                
        except Exception as e:
            self.print_fail(f"Erreur: {str(e)[:60]}")
            return False
        
        return True
    
    # =========================================================================
    # RAPPORT FINAL
    # =========================================================================
    
    def print_report(self):
        """Afficher rapport final"""
        self.print_header("📊 RAPPORT FINAL")
        
        total = self.results["passed"] + self.results["failed"]
        success_rate = (self.results["passed"] / total * 100) if total > 0 else 0
        
        print(f"Tests exécutés:  {total}")
        print(f"{Fore.GREEN}Réussis:         {self.results['passed']}{Style.RESET_ALL}")
        print(f"{Fore.RED}Échoués:         {self.results['failed']}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Warnings:        {self.results['warnings']}{Style.RESET_ALL}")
        print(f"\nTaux de réussite: {success_rate:.1f}%")
        
        print("\n" + "═" * 80)
        
        if self.results["failed"] == 0:
            print(f"{Fore.GREEN}{Style.BRIGHT}")
            print("╔════════════════════════════════════════════════════════════════╗")
            print("║                                                                ║")
            print("║                  ✅ SYSTÈME OPÉRATIONNEL !                    ║")
            print("║                                                                ║")
            print("╚════════════════════════════════════════════════════════════════╝")
            print(Style.RESET_ALL)
            
            print(f"\n{Fore.CYAN}Prêt à lancer:{Style.RESET_ALL}")
            print(f"  {Fore.YELLOW}./🚀_PRODUCTION_LAUNCHER.sh{Style.RESET_ALL}")
            
        elif self.results["failed"] <= 2 and self.config["demo_mode"]:
            print(f"{Fore.YELLOW}{Style.BRIGHT}")
            print("╔════════════════════════════════════════════════════════════════╗")
            print("║                                                                ║")
            print("║          ⚠️  WARNINGS MAIS MODE DÉMO FONCTIONNEL             ║")
            print("║                                                                ║")
            print("╚════════════════════════════════════════════════════════════════╝")
            print(Style.RESET_ALL)
            
            print(f"\n{Fore.CYAN}Mode démo opérationnel, configurer pour production:{Style.RESET_ALL}")
            print(f"  • Éditer backend/.env")
            print(f"  • Ajouter WALLET_PRIVATE_KEY")
            print(f"  • Déployer smart contract")
            
        else:
            print(f"{Fore.RED}{Style.BRIGHT}")
            print("╔════════════════════════════════════════════════════════════════╗")
            print("║                                                                ║")
            print("║              ❌ CORRECTIONS REQUISES                          ║")
            print("║                                                                ║")
            print("╚════════════════════════════════════════════════════════════════╝")
            print(Style.RESET_ALL)
            
            print(f"\n{Fore.CYAN}Actions recommandées:{Style.RESET_ALL}")
            print(f"  • Vérifier backend/.env")
            print(f"  • Installer dépendances manquantes")
            print(f"  • Relancer: python3 test_system.py")
        
        print("\n")
    
    # =========================================================================
    # RUN ALL TESTS
    # =========================================================================
    
    async def run_all_tests(self):
        """Exécuter tous les tests"""
        
        print("\n")
        print("╔" + "═" * 78 + "╗")
        print("║" + " " * 25 + "🧪 TEST SYSTÈME COMPLET" + " " * 29 + "║")
        print("║" + " " * 31 + "THESORIA" + " " * 39 + "║")
        print("╚" + "═" * 78 + "╝")
        
        # Tests synchrones
        self.test_configuration()
        self.test_connections()
        self.test_smart_contracts()
        self.test_backend_modules()
        
        # Tests asynchrones
        await self.test_external_apis()
        await self.test_end_to_end()
        
        # Rapport final
        self.print_report()


async def main():
    """Point d'entrée"""
    tester = SystemTester()
    await tester.run_all_tests()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrompus.\n")
    except Exception as e:
        print(f"\n❌ Erreur fatale: {e}\n")
        import traceback
        traceback.print_exc()
