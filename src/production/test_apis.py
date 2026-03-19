#!/usr/bin/env python3
"""
🧪 THESORIA - Test Rapide de Toutes les APIs
=============================================

Vérifie que toutes les intégrations fonctionnent
"""

import asyncio
import os
import sys
from dotenv import load_dotenv
from web3 import Web3
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def test_web3_connection():
    """Test connexion Web3"""
    print("\n" + "="*60)
    print("🔌 TEST CONNEXION WEB3")
    print("="*60)
    
    try:
        # Test QuickNode
        ws_url = os.getenv('ETH_WS_URL')
        http_url = os.getenv('ETH_HTTP_URL')
        
        if http_url:
            w3 = Web3(Web3.HTTPProvider(http_url))
            
            if w3.is_connected():
                block = w3.eth.block_number
                chain_id = w3.eth.chain_id
                
                print(f"✅ HTTP Connected")
                print(f"   URL: {http_url[:50]}...")
                print(f"   Block: {block:,}")
                print(f"   Chain ID: {chain_id}")
                
                return w3
            else:
                print(f"❌ HTTP Connection failed")
                return None
        else:
            print(f"❌ ETH_HTTP_URL not configured")
            return None
    
    except Exception as e:
        print(f"❌ Web3 Error: {e}")
        return None


async def test_account_balance(w3):
    """Test compte et balance"""
    print("\n" + "="*60)
    print("💰 TEST ACCOUNT & BALANCE")
    print("="*60)
    
    try:
        private_key = os.getenv('PRIVATE_KEY')
        
        if not private_key or private_key == "0xYOUR_PRIVATE_KEY_HERE":
            print(f"⚠️  PRIVATE_KEY not configured")
            return
        
        from eth_account import Account
        
        account = Account.from_key(private_key)
        address = account.address
        
        balance_wei = w3.eth.get_balance(address)
        balance_eth = balance_wei / 10**18
        
        print(f"✅ Account loaded")
        print(f"   Address: {address}")
        print(f"   Balance: {balance_eth:.4f} ETH")
        
        if balance_eth < 0.1:
            print(f"   ⚠️  Low balance! Recommended: 0.5+ ETH")
        else:
            print(f"   ✅ Sufficient balance")
    
    except Exception as e:
        print(f"❌ Account Error: {e}")


async def test_openai():
    """Test OpenAI API"""
    print("\n" + "="*60)
    print("🤖 TEST OPENAI GPT-4")
    print("="*60)
    
    try:
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key or 'YOUR_' in api_key:
            print(f"⚠️  OPENAI_API_KEY not configured")
            return
        
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4",
                    "messages": [
                        {"role": "user", "content": "Say 'API OK' if you can read this"}
                    ],
                    "max_tokens": 10
                },
                timeout=aiohttp.ClientTimeout(total=10)
            ) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    reply = result['choices'][0]['message']['content']
                    
                    print(f"✅ OpenAI API OK")
                    print(f"   Model: gpt-4")
                    print(f"   Response: {reply}")
                else:
                    error = await resp.text()
                    print(f"❌ OpenAI Error: {resp.status}")
                    print(f"   {error[:200]}")
    
    except Exception as e:
        print(f"❌ OpenAI Error: {e}")


async def test_infura():
    """Test Infura APIs"""
    print("\n" + "="*60)
    print("🌐 TEST INFURA")
    print("="*60)
    
    try:
        api_key = os.getenv('INFURA_API_KEY')
        
        if not api_key:
            print(f"⚠️  INFURA_API_KEY not configured")
            return
        
        # Test mainnet
        mainnet_url = f"https://mainnet.infura.io/v3/{api_key}"
        
        w3 = Web3(Web3.HTTPProvider(mainnet_url))
        
        if w3.is_connected():
            block = w3.eth.block_number
            
            print(f"✅ Infura Mainnet OK")
            print(f"   Block: {block:,}")
        else:
            print(f"❌ Infura connection failed")
        
        # Test gas API
        import aiohttp
        
        gas_url = f"https://gas.api.infura.io/v3/{api_key}/networks/1/suggestedGasFees"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(gas_url, timeout=aiohttp.ClientTimeout(total=5)) as resp:
                if resp.status == 200:
                    gas_data = await resp.json()
                    
                    print(f"✅ Infura Gas API OK")
                    print(f"   Fast: {gas_data.get('high', {}).get('maxFee', 'N/A')} Gwei")
                else:
                    print(f"❌ Gas API Error: {resp.status}")
    
    except Exception as e:
        print(f"❌ Infura Error: {e}")


async def test_chainlink(w3):
    """Test Chainlink"""
    print("\n" + "="*60)
    print("🔗 TEST CHAINLINK")
    print("="*60)
    
    try:
        from sdk_integrations.external_apis import ChainlinkIntegration
        
        chainlink = ChainlinkIntegration(w3)
        
        # Test ETH price
        eth_price = await chainlink.get_eth_price()
        
        if eth_price:
            print(f"✅ Chainlink Price Feed OK")
            print(f"   ETH/USD: ${eth_price.price:,.2f}")
        else:
            print(f"⚠️  Chainlink price feed not available (wrong network?)")
    
    except Exception as e:
        print(f"❌ Chainlink Error: {e}")


async def test_uniswap(w3):
    """Test Uniswap V3"""
    print("\n" + "="*60)
    print("🦄 TEST UNISWAP V3")
    print("="*60)
    
    try:
        from sdk_integrations.uniswap_integration import UniswapV3Integration
        
        uni = UniswapV3Integration(w3)
        
        # Test factory
        print(f"✅ Uniswap V3 Integration loaded")
        print(f"   Factory: 0x1F98431c8aD98523631AE4a59f267346ea31F984")
        
        # Note: Pool queries only work on mainnet
        print(f"   ⚠️  Pool queries require mainnet")
    
    except Exception as e:
        print(f"❌ Uniswap Error: {e}")


async def test_docker():
    """Test Docker"""
    print("\n" + "="*60)
    print("🐳 TEST DOCKER")
    print("="*60)
    
    try:
        import subprocess
        
        # Docker version
        result = subprocess.run(
            ['docker', '--version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode == 0:
            print(f"✅ Docker installed")
            print(f"   {result.stdout.strip()}")
        else:
            print(f"❌ Docker not found")
            return
        
        # Docker Compose version
        result = subprocess.run(
            ['docker-compose', '--version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode == 0:
            print(f"✅ Docker Compose installed")
            print(f"   {result.stdout.strip()}")
        else:
            print(f"❌ Docker Compose not found")
    
    except Exception as e:
        print(f"❌ Docker Error: {e}")


async def test_config_completeness():
    """Test configuration complète"""
    print("\n" + "="*60)
    print("📋 TEST CONFIGURATION")
    print("="*60)
    
    required = {
        'PRIVATE_KEY': os.getenv('PRIVATE_KEY'),
        'ETH_HTTP_URL': os.getenv('ETH_HTTP_URL'),
        'ETH_WS_URL': os.getenv('ETH_WS_URL'),
    }
    
    optional = {
        'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY'),
        'INFURA_API_KEY': os.getenv('INFURA_API_KEY'),
        'DISCORD_WEBHOOK_URL': os.getenv('DISCORD_WEBHOOK_URL'),
        'FLASHBOT_CONTRACT_ADDRESS': os.getenv('FLASHBOT_CONTRACT_ADDRESS'),
    }
    
    print("\nREQUIRED:")
    for key, value in required.items():
        if value and 'YOUR_' not in value:
            print(f"   ✅ {key}")
        else:
            print(f"   ❌ {key} (NOT CONFIGURED)")
    
    print("\nOPTIONAL:")
    for key, value in optional.items():
        if value and 'YOUR_' not in value:
            print(f"   ✅ {key}")
        else:
            print(f"   ⚠️  {key} (not configured)")


async def main():
    """Run all tests"""
    
    print("\n" + "="*60)
    print("🧪 THESORIA - TEST SUITE")
    print("="*60)
    print("Test de toutes les intégrations APIs")
    print("="*60)
    
    # Load .env
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print(f"✅ .env loaded from {env_path}")
    else:
        print(f"⚠️  .env not found at {env_path}")
        print(f"   Créer .env depuis .env.example")
    
    # Run tests
    await test_config_completeness()
    
    w3 = await test_web3_connection()
    
    if w3:
        await test_account_balance(w3)
        await test_chainlink(w3)
        await test_uniswap(w3)
    
    await test_openai()
    await test_infura()
    await test_docker()
    
    # Summary
    print("\n" + "="*60)
    print("✅ TESTS TERMINÉS")
    print("="*60)
    print("\nPour lancer le système:")
    print("   chmod +x activate.sh")
    print("   ./activate.sh")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
