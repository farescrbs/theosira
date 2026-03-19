#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🧪 THESORIA - TEST D'INSTALLATION
═══════════════════════════════════════════════════════════════════════════════

Script de test pour vérifier que tout est bien installé et configuré.

Usage:
    python test_installation.py
"""

import sys
import os

try:
    from colorama import Fore, Style, init
    init(autoreset=True)
except ImportError:
    print("⚠️  Module 'colorama' manquant")
    print("Installer: pip install colorama")
    sys.exit(1)

print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
print(f"{Fore.CYAN}{Style.BRIGHT}🧪 THESORIA - TEST D'INSTALLATION{Style.RESET_ALL}")
print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")

# Test 1: Version Python
print(f"{Fore.YELLOW}Test 1: Version Python{Style.RESET_ALL}")
print(f"  Python: {sys.version}")
if sys.version_info >= (3, 8):
    print(f"  {Fore.GREEN}✓ Python 3.8+ détecté{Style.RESET_ALL}")
else:
    print(f"  {Fore.RED}✗ Python 3.8+ requis{Style.RESET_ALL}")
    sys.exit(1)
print()

# Test 2: Modules Python
print(f"{Fore.YELLOW}Test 2: Modules Python{Style.RESET_ALL}")

required_modules = [
    'web3',
    'colorama',
    'fastapi',
    'uvicorn',
    'sqlalchemy',
    'redis',
    'aiohttp',
    'asyncio',
    'requests',
    'dotenv',
    'yaml',
    'cryptography',
]

missing_modules = []

for module in required_modules:
    try:
        if module == 'dotenv':
            __import__('dotenv')
        elif module == 'yaml':
            __import__('yaml')
        else:
            __import__(module)
        print(f"  {Fore.GREEN}✓{Style.RESET_ALL} {module}")
    except ImportError:
        print(f"  {Fore.RED}✗{Style.RESET_ALL} {module} (manquant)")
        missing_modules.append(module)

if missing_modules:
    print(f"\n{Fore.YELLOW}Modules manquants à installer:{Style.RESET_ALL}")
    for mod in missing_modules:
        install_name = mod
        if mod == 'dotenv':
            install_name = 'python-dotenv'
        elif mod == 'yaml':
            install_name = 'pyyaml'
        print(f"  pip install {install_name}")
    print()
else:
    print(f"\n  {Fore.GREEN}✓ Tous les modules sont installés{Style.RESET_ALL}\n")

# Test 3: Fichier .env
print(f"{Fore.YELLOW}Test 3: Configuration .env{Style.RESET_ALL}")

env_file = '../.env.production'
if not os.path.exists(env_file):
    env_file = '.env.production'
if not os.path.exists(env_file):
    env_file = '.env'

if os.path.exists(env_file):
    print(f"  {Fore.GREEN}✓{Style.RESET_ALL} Fichier trouvé: {env_file}")
    
    # Charger et vérifier
    try:
        from dotenv import load_dotenv
        load_dotenv(env_file)
        
        # Vérifier variables critiques
        critical_vars = [
            'MAIN_WALLET_PRIVATE_KEY',
            'MAIN_WALLET_ADDRESS',
            'ETH_RPC_URL'
        ]
        
        print(f"\n  {Fore.YELLOW}Variables critiques:{Style.RESET_ALL}")
        all_configured = True
        
        for var in critical_vars:
            value = os.getenv(var)
            if value and value != f'YOUR_{var}_HERE':
                # Masquer les valeurs sensibles
                if 'KEY' in var or 'SECRET' in var:
                    display = value[:10] + '...' if len(value) > 10 else '***'
                else:
                    display = value[:20] + '...' if len(value) > 20 else value
                print(f"    {Fore.GREEN}✓{Style.RESET_ALL} {var}: {display}")
            else:
                print(f"    {Fore.RED}✗{Style.RESET_ALL} {var}: NON CONFIGURÉ")
                all_configured = False
        
        if not all_configured:
            print(f"\n  {Fore.YELLOW}⚠️  Certaines variables ne sont pas configurées{Style.RESET_ALL}")
            print(f"  Éditer: {env_file}")
    except Exception as e:
        print(f"  {Fore.RED}✗{Style.RESET_ALL} Erreur lecture .env: {e}")
else:
    print(f"  {Fore.RED}✗{Style.RESET_ALL} Fichier .env.production non trouvé")
    print(f"\n  {Fore.YELLOW}Créer le fichier:{Style.RESET_ALL}")
    print(f"    copy .env.example .env.production")
    print(f"    notepad .env.production")

print()

# Test 4: Connexion Blockchain
print(f"{Fore.YELLOW}Test 4: Connexion Blockchain{Style.RESET_ALL}")

try:
    from web3 import Web3
    from dotenv import load_dotenv
    
    load_dotenv(env_file)
    
    rpc_url = os.getenv('ETH_RPC_URL')
    
    if rpc_url and rpc_url != 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID':
        try:
            web3 = Web3(Web3.HTTPProvider(rpc_url, request_kwargs={'timeout': 10}))
            
            if web3.is_connected():
                print(f"  {Fore.GREEN}✓{Style.RESET_ALL} Connexion réussie")
                print(f"    RPC: {rpc_url[:50]}...")
                
                try:
                    block = web3.eth.block_number
                    print(f"    Block actuel: {block:,}")
                except Exception as e:
                    print(f"    {Fore.YELLOW}⚠️{Style.RESET_ALL} Impossible de lire block: {e}")
                
                # Test wallet balance
                wallet = os.getenv('MAIN_WALLET_ADDRESS')
                if wallet and wallet != 'YOUR_WALLET_ADDRESS_HERE':
                    try:
                        balance_wei = web3.eth.get_balance(wallet)
                        balance_eth = web3.from_wei(balance_wei, 'ether')
                        print(f"    Wallet: {wallet[:10]}...{wallet[-8:]}")
                        print(f"    Balance: {balance_eth:.4f} ETH")
                        
                        if balance_eth < 0.01:
                            print(f"    {Fore.YELLOW}⚠️  Balance faible - Approvisionner pour gas fees{Style.RESET_ALL}")
                    except Exception as e:
                        print(f"    {Fore.YELLOW}⚠️{Style.RESET_ALL} Impossible de lire balance: {e}")
            else:
                print(f"  {Fore.RED}✗{Style.RESET_ALL} Connexion échouée")
                print(f"    Vérifier ETH_RPC_URL")
        except Exception as e:
            print(f"  {Fore.RED}✗{Style.RESET_ALL} Erreur: {e}")
    else:
        print(f"  {Fore.YELLOW}⚠️{Style.RESET_ALL} ETH_RPC_URL non configuré")
        print(f"    Obtenir API key sur: https://infura.io")
except ImportError:
    print(f"  {Fore.RED}✗{Style.RESET_ALL} Module web3 non installé")
    print(f"    pip install web3")

print()

# Test 5: Dossiers
print(f"{Fore.YELLOW}Test 5: Structure des Dossiers{Style.RESET_ALL}")

required_dirs = ['logs', 'backups', 'reports', 'dashboards']
missing_dirs = []

for dir_name in required_dirs:
    dir_path = os.path.join('..', dir_name)
    if not os.path.exists(dir_path):
        dir_path = dir_name
    
    if os.path.exists(dir_path):
        print(f"  {Fore.GREEN}✓{Style.RESET_ALL} {dir_name}/")
    else:
        print(f"  {Fore.YELLOW}⚠️{Style.RESET_ALL} {dir_name}/ (sera créé)")
        missing_dirs.append(dir_name)
        try:
            os.makedirs(dir_name, exist_ok=True)
            print(f"    {Fore.GREEN}✓{Style.RESET_ALL} Créé")
        except Exception as e:
            print(f"    {Fore.RED}✗{Style.RESET_ALL} Erreur: {e}")

print()

# Résumé
print(f"{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}")
print(f"{Fore.GREEN}{Style.BRIGHT}📊 RÉSUMÉ DU TEST{Style.RESET_ALL}")
print(f"{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}\n")

if not missing_modules and os.path.exists(env_file):
    print(f"{Fore.GREEN}✅ Installation OK - Prêt pour le lancement{Style.RESET_ALL}\n")
    
    print(f"{Fore.YELLOW}Prochaines étapes:{Style.RESET_ALL}")
    print(f"  1. Vérifier .env.production (toutes API keys)")
    print(f"  2. Approvisionner wallet (ETH pour gas)")
    print(f"  3. Lancer: python production_trader.py")
    print(f"  4. OU lancer: start_all_windows.bat\n")
else:
    print(f"{Fore.YELLOW}⚠️  Configuration incomplète{Style.RESET_ALL}\n")
    
    if missing_modules:
        print(f"{Fore.YELLOW}Action requise:{Style.RESET_ALL}")
        print(f"  Installer modules manquants:")
        for mod in missing_modules:
            install_name = mod
            if mod == 'dotenv':
                install_name = 'python-dotenv'
            elif mod == 'yaml':
                install_name = 'pyyaml'
            print(f"    pip install {install_name}")
        print()
    
    if not os.path.exists(env_file):
        print(f"{Fore.YELLOW}Action requise:{Style.RESET_ALL}")
        print(f"  1. copy .env.example .env.production")
        print(f"  2. notepad .env.production")
        print(f"  3. Remplir toutes les variables\n")

print(f"{Fore.CYAN}Documentation:{Style.RESET_ALL}")
print(f"  • INSTALLATION_WINDOWS_GUIDE.md")
print(f"  • QUICK_START_PRODUCTION.md")
print(f"  • PRODUCTION_DEPLOYMENT_GUIDE.md\n")

print(f"{Fore.GREEN}{'═' * 70}{Style.RESET_ALL}\n")
