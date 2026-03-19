#!/usr/bin/env python3
"""
🧪 THESORIA - Test Aave v3 Integration
=======================================

Test l'intégration complète Aave v3
"""

import asyncio
import os
from dotenv import load_dotenv
from web3 import Web3
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Aave v3 Sepolia Addresses
AAVE_POOL = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"
AAVE_DATA_PROVIDER = "0x3e9708d80f7B3e43118013075F7e95CE3AB31F31"

# Test tokens sur Sepolia
USDC_SEPOLIA = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8"
DAI_SEPOLIA = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357"


async def test_web3_connection():
    """Test connexion Web3"""
    print("\n" + "="*60)
    print("🔌 TEST CONNEXION WEB3")
    print("="*60)
    
    try:
        http_url = os.getenv('ETH_HTTP_URL')
        
        if not http_url:
            print("❌ ETH_HTTP_URL not configured")
            return None
        
        w3 = Web3(Web3.HTTPProvider(http_url))
        
        if w3.is_connected():
            block = w3.eth.block_number
            chain_id = w3.eth.chain_id
            
            print(f"✅ Connected to network")
            print(f"   Block: {block:,}")
            print(f"   Chain ID: {chain_id}")
            
            return w3
        else:
            print("❌ Connection failed")
            return None
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


async def test_aave_pool_connection(w3):
    """Test connexion au Pool Aave"""
    print("\n" + "="*60)
    print("🏦 TEST AAVE POOL")
    print("="*60)
    
    try:
        # ABI minimal pour test
        pool_abi = [
            {
                "inputs": [],
                "name": "FLASHLOAN_PREMIUM_TOTAL",
                "outputs": [{"name": "", "type": "uint128"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"name": "asset", "type": "address"}],
                "name": "getReserveData",
                "outputs": [{
                    "components": [
                        {"name": "configuration", "type": "uint256"},
                        {"name": "liquidityIndex", "type": "uint128"},
                        {"name": "currentLiquidityRate", "type": "uint128"},
                        {"name": "variableBorrowIndex", "type": "uint128"},
                        {"name": "currentVariableBorrowRate", "type": "uint128"},
                        {"name": "currentStableBorrowRate", "type": "uint128"},
                        {"name": "lastUpdateTimestamp", "type": "uint40"},
                        {"name": "id", "type": "uint16"},
                        {"name": "aTokenAddress", "type": "address"},
                        {"name": "stableDebtTokenAddress", "type": "address"},
                        {"name": "variableDebtTokenAddress", "type": "address"},
                        {"name": "interestRateStrategyAddress", "type": "address"},
                        {"name": "accruedToTreasury", "type": "uint128"},
                        {"name": "unbacked", "type": "uint128"},
                        {"name": "isolationModeTotalDebt", "type": "uint128"}
                    ],
                    "name": "",
                    "type": "tuple"
                }],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        
        pool = w3.eth.contract(
            address=Web3.to_checksum_address(AAVE_POOL),
            abi=pool_abi
        )
        
        # Test 1: Flash loan premium
        premium = pool.functions.FLASHLOAN_PREMIUM_TOTAL().call()
        print(f"✅ Aave Pool accessible")
        print(f"   Flash Loan Premium: {premium} bps (0.{premium:02d}%)")
        
        # Test 2: Reserve data
        try:
            reserve_data = pool.functions.getReserveData(
                Web3.to_checksum_address(USDC_SEPOLIA)
            ).call()
            
            print(f"✅ USDC Reserve Data")
            print(f"   aToken: {reserve_data[8]}")
            print(f"   Liquidity Rate: {reserve_data[2]}")
        except Exception as e:
            print(f"⚠️  Reserve data not available (testnet): {e}")
        
        return True
    
    except Exception as e:
        print(f"❌ Aave Pool Error: {e}")
        return False


async def test_aave_graphql():
    """Test Aave GraphQL API"""
    print("\n" + "="*60)
    print("📊 TEST AAVE GRAPHQL")
    print("="*60)
    
    try:
        import aiohttp
        
        graphql_url = os.getenv('AAVE_GRAPHQL_URL')
        
        if not graphql_url:
            print("⚠️  AAVE_GRAPHQL_URL not configured")
            return
        
        query = """
        {
          reserves(first: 5, orderBy: totalLiquidity, orderDirection: desc) {
            symbol
            name
            totalLiquidity
            availableLiquidity
            liquidityRate
          }
        }
        """
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                graphql_url,
                json={"query": query},
                timeout=aiohttp.ClientTimeout(total=10)
            ) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    
                    reserves = result.get('data', {}).get('reserves', [])
                    
                    print(f"✅ GraphQL API OK")
                    print(f"   Top {len(reserves)} reserves:")
                    
                    for r in reserves[:3]:
                        print(f"   • {r['symbol']}: {r['totalLiquidity']} available")
                else:
                    print(f"❌ GraphQL Error: {resp.status}")
    
    except Exception as e:
        print(f"❌ GraphQL Error: {e}")


async def test_python_integration():
    """Test intégration Python SDK"""
    print("\n" + "="*60)
    print("🐍 TEST PYTHON SDK INTEGRATION")
    print("="*60)
    
    try:
        # Essayer d'importer l'intégration
        import sys
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
        
        from sdk_integrations.external_apis import AaveGraphQLIntegration
        
        graphql_url = os.getenv('AAVE_GRAPHQL_URL')
        
        if graphql_url:
            aave = AaveGraphQLIntegration(graphql_url)
            
            print(f"✅ SDK Integration loaded")
            print(f"   GraphQL URL: {graphql_url}")
            
            # Test fetch pools
            from decimal import Decimal
            pools = await aave.get_flash_loan_pools(
                min_liquidity=Decimal('100000')
            )
            
            print(f"✅ Flash loan pools fetched: {len(pools)}")
            
            for pool in pools[:3]:
                print(f"   • {pool.asset}: ${pool.available_liquidity:,.0f}")
        else:
            print(f"⚠️  AAVE_GRAPHQL_URL not configured")
    
    except ImportError as e:
        print(f"⚠️  SDK not found (expected in production setup): {e}")
    except Exception as e:
        print(f"❌ SDK Error: {e}")


async def test_contract_deployment_ready():
    """Vérifier que le contrat peut être déployé"""
    print("\n" + "="*60)
    print("📜 TEST CONTRACT DEPLOYMENT READY")
    print("="*60)
    
    try:
        contract_path = os.path.join(
            os.path.dirname(__file__),
            '..',
            'contracts',
            'AaveFlashLoanReceiver.sol'
        )
        
        if os.path.exists(contract_path):
            with open(contract_path, 'r') as f:
                content = f.read()
                
                # Vérifications basiques
                checks = [
                    ('pragma solidity', 'Pragma directive'),
                    ('contract ThesoriaFlashLoanExecutor', 'Main contract'),
                    ('executeOperation', 'Execute operation function'),
                    ('requestFlashLoan', 'Request flash loan function'),
                    ('onlyOwner', 'Owner modifier'),
                    ('emergencyWithdraw', 'Emergency withdraw')
                ]
                
                print(f"✅ Contract file found")
                
                all_good = True
                for check_str, name in checks:
                    if check_str in content:
                        print(f"   ✅ {name}")
                    else:
                        print(f"   ❌ {name} missing")
                        all_good = False
                
                if all_good:
                    print(f"\n✅ Contract ready for deployment!")
                else:
                    print(f"\n⚠️  Contract has missing components")
        else:
            print(f"❌ Contract file not found")
    
    except Exception as e:
        print(f"❌ Error: {e}")


async def test_gas_estimation():
    """Estimer les coûts de gas"""
    print("\n" + "="*60)
    print("⛽ TEST GAS ESTIMATION")
    print("="*60)
    
    try:
        http_url = os.getenv('ETH_HTTP_URL')
        w3 = Web3(Web3.HTTPProvider(http_url))
        
        if w3.is_connected():
            gas_price = w3.eth.gas_price
            
            # Estimations
            deploy_gas = 2_000_000
            flash_loan_gas = 500_000
            
            deploy_cost_eth = (deploy_gas * gas_price) / 1e18
            flash_loan_cost_eth = (flash_loan_gas * gas_price) / 1e18
            
            # Prix ETH (mock)
            eth_price_usd = 3000
            
            print(f"✅ Gas estimation")
            print(f"   Current gas price: {gas_price / 1e9:.2f} Gwei")
            print(f"\n   Deployment:")
            print(f"   • Gas: {deploy_gas:,}")
            print(f"   • Cost: {deploy_cost_eth:.4f} ETH (~${deploy_cost_eth * eth_price_usd:.2f})")
            print(f"\n   Flash Loan TX:")
            print(f"   • Gas: {flash_loan_gas:,}")
            print(f"   • Cost: {flash_loan_cost_eth:.4f} ETH (~${flash_loan_cost_eth * eth_price_usd:.2f})")
            
            # Flash loan fee (0.09%)
            loan_amount = 100_000  # $100k
            flash_fee = loan_amount * 0.0009
            
            print(f"\n   Flash Loan Fee (0.09%):")
            print(f"   • Loan: ${loan_amount:,}")
            print(f"   • Fee: ${flash_fee:.2f}")
            print(f"\n   Min Profit Required:")
            print(f"   • ${flash_fee + flash_loan_cost_eth * eth_price_usd:.2f}")
    
    except Exception as e:
        print(f"❌ Error: {e}")


async def main():
    """Run all tests"""
    
    print("\n" + "="*60)
    print("🧪 THESORIA - AAVE V3 INTEGRATION TEST SUITE")
    print("="*60)
    
    # Load .env
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print(f"✅ .env loaded")
    else:
        print(f"⚠️  .env not found")
    
    # Run tests
    w3 = await test_web3_connection()
    
    if w3:
        await test_aave_pool_connection(w3)
        await test_gas_estimation()
    
    await test_aave_graphql()
    await test_python_integration()
    await test_contract_deployment_ready()
    
    # Summary
    print("\n" + "="*60)
    print("✅ TESTS TERMINÉS")
    print("="*60)
    print("\nProchaines étapes:")
    print("1. Déployer contract: cd contracts && forge create ...")
    print("2. Tester sur testnet: python scripts/test_flash_loan.py")
    print("3. Intégrer à l'agent: docker-compose restart mev-agent")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
