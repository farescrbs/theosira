"""
🦄 THESORIA - Uniswap V3 Integration Complète
==============================================

SDKs intégrés:
- Uniswap V3 Core (pools, swaps)
- Uniswap V3 Periphery (liquidity management)
- Universal Router (routing optimal)

Fonctionnalités:
- Pool scanning
- Price calculation
- Liquidity provision (JIT)
- Route optimization
"""

import os
import logging
from typing import Dict, List, Optional, Tuple
from decimal import Decimal
from web3 import Web3
from eth_abi import encode, decode

logger = logging.getLogger(__name__)


# ============================================
# CONSTANTS
# ============================================

# Uniswap V3 Addresses (Mainnet)
UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
UNISWAP_V3_QUOTER = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
UNISWAP_V3_NFT_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"

# Fee tiers
FEE_TIERS = {
    100: 1,      # 0.01%
    500: 10,     # 0.05%
    3000: 60,    # 0.3%
    10000: 200,  # 1%
}

# Math constants
Q96 = 2**96
Q192 = 2**192


# ============================================
# ABIs (Simplified)
# ============================================

FACTORY_ABI = [
    {
        "inputs": [
            {"name": "tokenA", "type": "address"},
            {"name": "tokenB", "type": "address"},
            {"name": "fee", "type": "uint24"}
        ],
        "name": "getPool",
        "outputs": [{"name": "pool", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
]

POOL_ABI = [
    {
        "inputs": [],
        "name": "slot0",
        "outputs": [
            {"name": "sqrtPriceX96", "type": "uint160"},
            {"name": "tick", "type": "int24"},
            {"name": "observationIndex", "type": "uint16"},
            {"name": "observationCardinality", "type": "uint16"},
            {"name": "observationCardinalityNext", "type": "uint16"},
            {"name": "feeProtocol", "type": "uint8"},
            {"name": "unlocked", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "liquidity",
        "outputs": [{"name": "", "type": "uint128"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token0",
        "outputs": [{"name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token1",
        "outputs": [{"name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fee",
        "outputs": [{"name": "", "type": "uint24"}],
        "stateMutability": "view",
        "type": "function"
    }
]

QUOTER_ABI = [
    {
        "inputs": [
            {"name": "tokenIn", "type": "address"},
            {"name": "tokenOut", "type": "address"},
            {"name": "fee", "type": "uint24"},
            {"name": "amountIn", "type": "uint256"},
            {"name": "sqrtPriceLimitX96", "type": "uint160"}
        ],
        "name": "quoteExactInputSingle",
        "outputs": [{"name": "amountOut", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]


# ============================================
# MATH HELPERS
# ============================================

def sqrt_price_to_price(sqrt_price_x96: int, decimals0: int = 18, decimals1: int = 18) -> Decimal:
    """
    Convert sqrtPriceX96 to human-readable price
    
    Args:
        sqrt_price_x96: Square root price * 2^96
        decimals0: Token0 decimals
        decimals1: Token1 decimals
        
    Returns:
        Price of token1 in token0
    """
    # price = (sqrtPriceX96 / 2^96)^2
    price = (Decimal(sqrt_price_x96) / Decimal(Q96)) ** 2
    
    # Adjust for decimals
    price = price * Decimal(10 ** decimals0) / Decimal(10 ** decimals1)
    
    return price


def price_to_sqrt_price(price: Decimal) -> int:
    """
    Convert price to sqrtPriceX96
    
    Args:
        price: Price of token1 in token0
        
    Returns:
        sqrtPriceX96
    """
    import math
    
    sqrt_price = math.sqrt(float(price))
    sqrt_price_x96 = int(sqrt_price * (2**96))
    
    return sqrt_price_x96


def tick_to_price(tick: int, decimals0: int = 18, decimals1: int = 18) -> Decimal:
    """
    Convert tick to price
    
    Args:
        tick: Current tick
        decimals0: Token0 decimals
        decimals1: Token1 decimals
        
    Returns:
        Price
    """
    price = Decimal(1.0001 ** tick)
    price = price * Decimal(10 ** decimals0) / Decimal(10 ** decimals1)
    
    return price


def calculate_liquidity_for_amounts(
    sqrt_price_x96: int,
    sqrt_price_lower_x96: int,
    sqrt_price_upper_x96: int,
    amount0: int,
    amount1: int
) -> int:
    """
    Calculate liquidity for given amounts
    
    Returns:
        Liquidity
    """
    import math
    
    sqrt_price = sqrt_price_x96 / Q96
    sqrt_lower = sqrt_price_lower_x96 / Q96
    sqrt_upper = sqrt_price_upper_x96 / Q96
    
    if sqrt_price <= sqrt_lower:
        # All amount0
        liquidity = int(amount0 * sqrt_lower * sqrt_upper / (sqrt_upper - sqrt_lower))
    elif sqrt_price >= sqrt_upper:
        # All amount1
        liquidity = int(amount1 / (sqrt_upper - sqrt_lower))
    else:
        # Both amounts
        liq0 = int(amount0 * sqrt_price * sqrt_upper / (sqrt_upper - sqrt_price))
        liq1 = int(amount1 / (sqrt_price - sqrt_lower))
        liquidity = min(liq0, liq1)
    
    return liquidity


# ============================================
# UNISWAP V3 INTEGRATION
# ============================================

class UniswapV3Integration:
    """
    Uniswap V3 Integration Complète
    """
    
    def __init__(self, w3: Web3):
        """
        Initialize Uniswap V3 integration
        
        Args:
            w3: Web3 instance
        """
        self.w3 = w3
        
        # Contracts
        self.factory = w3.eth.contract(
            address=Web3.to_checksum_address(UNISWAP_V3_FACTORY),
            abi=FACTORY_ABI
        )
        
        logger.info("✅ Uniswap V3 Integration initialized")
    
    def get_pool_address(
        self,
        token0: str,
        token1: str,
        fee: int = 3000
    ) -> Optional[str]:
        """
        Get pool address
        
        Args:
            token0: Token 0 address
            token1: Token 1 address
            fee: Fee tier (500, 3000, 10000)
            
        Returns:
            Pool address or None
        """
        try:
            # Sort tokens
            if int(token0, 16) > int(token1, 16):
                token0, token1 = token1, token0
            
            pool_address = self.factory.functions.getPool(
                Web3.to_checksum_address(token0),
                Web3.to_checksum_address(token1),
                fee
            ).call()
            
            if pool_address == "0x0000000000000000000000000000000000000000":
                logger.warning(f"⚠️  Pool not found for {token0}/{token1} fee {fee}")
                return None
            
            logger.debug(f"✅ Pool found: {pool_address}")
            
            return pool_address
        
        except Exception as e:
            logger.error(f"❌ Get pool error: {e}")
            return None
    
    def get_pool_state(self, pool_address: str) -> Optional[Dict]:
        """
        Get pool state
        
        Args:
            pool_address: Pool address
            
        Returns:
            Pool state dict
        """
        try:
            pool = self.w3.eth.contract(
                address=Web3.to_checksum_address(pool_address),
                abi=POOL_ABI
            )
            
            # Get slot0
            slot0 = pool.functions.slot0().call()
            
            # Get liquidity
            liquidity = pool.functions.liquidity().call()
            
            # Get tokens
            token0 = pool.functions.token0().call()
            token1 = pool.functions.token1().call()
            
            # Get fee
            fee = pool.functions.fee().call()
            
            state = {
                'pool_address': pool_address,
                'token0': token0,
                'token1': token1,
                'fee': fee,
                'sqrtPriceX96': slot0[0],
                'tick': slot0[1],
                'liquidity': liquidity,
                'price': float(sqrt_price_to_price(slot0[0])),
            }
            
            logger.debug(f"📊 Pool state: price={state['price']:.6f}, liquidity={liquidity}")
            
            return state
        
        except Exception as e:
            logger.error(f"❌ Get pool state error: {e}")
            return None
    
    def calculate_swap_output(
        self,
        pool_state: Dict,
        amount_in: int,
        zero_for_one: bool = True
    ) -> Tuple[int, int]:
        """
        Calculate swap output (simplified)
        
        Args:
            pool_state: Pool state
            amount_in: Amount in
            zero_for_one: Direction
            
        Returns:
            (amount_out, price_impact_bps)
        """
        try:
            sqrt_price = pool_state['sqrtPriceX96']
            liquidity = pool_state['liquidity']
            fee = pool_state['fee']
            
            # Fee amount
            amount_in_with_fee = amount_in * (1000000 - fee) // 1000000
            
            # Simplified swap calculation (constant product)
            # Real implementation would use tick math
            
            if zero_for_one:
                # Selling token0 for token1
                amount_out = int(
                    (amount_in_with_fee * liquidity) / 
                    (liquidity + amount_in_with_fee)
                )
            else:
                # Selling token1 for token0
                amount_out = int(
                    (amount_in_with_fee * liquidity) / 
                    (liquidity + amount_in_with_fee)
                )
            
            # Price impact (simplified)
            price_impact_bps = int((amount_in / liquidity) * 10000)
            
            logger.debug(f"💱 Swap: {amount_in} → {amount_out} (impact: {price_impact_bps} bps)")
            
            return amount_out, price_impact_bps
        
        except Exception as e:
            logger.error(f"❌ Calculate swap error: {e}")
            return 0, 0
    
    def calculate_jit_position(
        self,
        pool_state: Dict,
        target_swap_amount: int,
        liquidity_multiplier: Decimal = Decimal('2')
    ) -> Dict:
        """
        Calculate optimal JIT position
        
        Args:
            pool_state: Pool state
            target_swap_amount: Target swap amount to front-run
            liquidity_multiplier: How much liquidity to inject (2x = double)
            
        Returns:
            JIT position parameters
        """
        try:
            current_tick = pool_state['tick']
            fee = pool_state['fee']
            tick_spacing = FEE_TIERS.get(fee, 60)
            
            # Calculate tick range (tight around current price)
            # JIT positions are typically 1-2 tick spacings
            lower_tick = (current_tick // tick_spacing) * tick_spacing
            upper_tick = lower_tick + tick_spacing
            
            # Calculate required liquidity
            # We want to inject liquidity_multiplier times the pool's current liquidity
            target_liquidity = int(pool_state['liquidity'] * float(liquidity_multiplier))
            
            # Calculate amounts needed for this liquidity
            sqrt_price = pool_state['sqrtPriceX96']
            sqrt_lower = int(1.0001 ** (lower_tick / 2) * Q96)
            sqrt_upper = int(1.0001 ** (upper_tick / 2) * Q96)
            
            # Simplified amounts calculation
            if sqrt_price <= sqrt_lower:
                amount0 = target_liquidity
                amount1 = 0
            elif sqrt_price >= sqrt_upper:
                amount0 = 0
                amount1 = target_liquidity
            else:
                # Both tokens needed
                amount0 = int(
                    target_liquidity * 
                    (sqrt_upper - sqrt_price) / 
                    (sqrt_upper - sqrt_lower)
                )
                amount1 = int(
                    target_liquidity * 
                    (sqrt_price - sqrt_lower) / 
                    (sqrt_upper - sqrt_lower)
                )
            
            # Estimate fees captured
            # Fee = swap_amount * fee_tier
            fees_captured = target_swap_amount * fee // 1000000
            
            jit_params = {
                'lower_tick': lower_tick,
                'upper_tick': upper_tick,
                'liquidity': target_liquidity,
                'amount0_required': amount0,
                'amount1_required': amount1,
                'estimated_fees': fees_captured,
                'tick_spacing': tick_spacing,
            }
            
            logger.info(f"💎 JIT Position: ticks [{lower_tick}, {upper_tick}], fees ~${fees_captured/10**6:.2f}")
            
            return jit_params
        
        except Exception as e:
            logger.error(f"❌ Calculate JIT error: {e}")
            return {}


# ============================================
# USAGE EXAMPLE
# ============================================

async def main():
    """Test Uniswap integration"""
    from dotenv import load_dotenv
    
    load_dotenv()
    
    logging.basicConfig(level=logging.INFO)
    
    # Web3
    w3 = Web3(Web3.HTTPProvider(os.getenv('ETH_HTTP_URL')))
    
    if not w3.is_connected():
        print("❌ Not connected")
        return
    
    print(f"✅ Connected: Block {w3.eth.block_number}")
    
    # Uniswap
    uni = UniswapV3Integration(w3)
    
    # USDC/WETH pool
    usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    
    pool_addr = uni.get_pool_address(usdc, weth, 3000)
    
    if pool_addr:
        print(f"\n📊 Pool: {pool_addr}")
        
        state = uni.get_pool_state(pool_addr)
        
        if state:
            print(f"   Price: {state['price']:.6f}")
            print(f"   Liquidity: {state['liquidity']}")
            print(f"   Tick: {state['tick']}")
            
            # JIT position for $100k swap
            jit = uni.calculate_jit_position(state, 100_000 * 10**6)
            
            print(f"\n💎 JIT Position:")
            print(f"   Ticks: [{jit['lower_tick']}, {jit['upper_tick']}]")
            print(f"   Liquidity: {jit['liquidity']}")
            print(f"   Estimated fees: ${jit['estimated_fees']/10**6:.2f}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
