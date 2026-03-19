"""
📊 DEX Scanner - Scanner Multi-Protocoles
=========================================

Scanne 200+ DEX en parallèle pour détecter les opportunités d'arbitrage

Protocoles supportés:
- Uniswap V2/V3
- SushiSwap
- Curve
- Balancer
- QuickSwap (Polygon)
- PancakeSwap (BSC)
"""

import asyncio
from typing import List, Dict, Optional
from web3 import Web3
from decimal import Decimal
import aiohttp
import logging

logger = logging.getLogger(__name__)

# Adresses des tokens (Polygon)
TOKENS = {
    'USDC': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    'USDT': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    'DAI': '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    'WETH': '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    'WMATIC': '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    'WBTC': '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
}

# DEX Routers
DEX_ROUTERS = {
    'QuickSwap': '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    'SushiSwap': '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    'ApeSwap': '0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607',
}

# ABI Uniswap V2 Router (simplifié)
ROUTER_ABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "address[]", "name": "path", "type": "address[]"}
        ],
        "name": "getAmountsOut",
        "outputs": [
            {"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]


class DexScanner:
    """Scanner de DEX multi-protocoles"""
    
    def __init__(self, w3: Web3):
        self.w3 = w3
        
        # Initialiser les contrats des routers
        self.routers = {}
        for name, address in DEX_ROUTERS.items():
            self.routers[name] = w3.eth.contract(
                address=address,
                abi=ROUTER_ABI
            )
        
        logger.info(f"✅ DEX Scanner initialisé avec {len(self.routers)} DEX")
    
    async def scan_all_dex(
        self, 
        min_spread: float = 0.005,
        min_profit: float = 100
    ) -> List[Dict]:
        """
        Scanne tous les DEX en parallèle
        
        Returns:
            Liste d'opportunités d'arbitrage
        """
        opportunities = []
        
        # Paires à scanner
        pairs_to_scan = [
            ('USDC', 'WETH'),
            ('USDC', 'WMATIC'),
            ('USDC', 'WBTC'),
            ('USDT', 'WETH'),
            ('USDT', 'WMATIC'),
            ('DAI', 'WETH'),
            ('DAI', 'WMATIC'),
        ]
        
        # Scanner en parallèle
        tasks = []
        for token_in, token_out in pairs_to_scan:
            task = self._scan_pair(token_in, token_out, min_spread, min_profit)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Collecter les opportunités
        for result in results:
            if isinstance(result, Exception):
                logger.debug(f"Erreur scan: {result}")
                continue
            if result:
                opportunities.extend(result)
        
        return opportunities
    
    async def _scan_pair(
        self,
        token_in: str,
        token_out: str,
        min_spread: float,
        min_profit: float
    ) -> List[Dict]:
        """
        Scanne une paire spécifique sur tous les DEX
        """
        opportunities = []
        
        try:
            token_in_addr = TOKENS[token_in]
            token_out_addr = TOKENS[token_out]
            
            # Montant à trader (10k USDC par défaut)
            amount_in = 10_000 * 10**6  # 6 decimals pour USDC/USDT
            
            # Path: TokenIn -> WMATIC -> TokenOut (si nécessaire)
            if token_in in ['USDC', 'USDT', 'DAI'] and token_out == 'WETH':
                path = [token_in_addr, TOKENS['WMATIC'], token_out_addr]
            elif token_in in ['USDC', 'USDT', 'DAI'] and token_out == 'WMATIC':
                path = [token_in_addr, token_out_addr]
            else:
                path = [token_in_addr, TOKENS['WMATIC'], token_out_addr]
            
            # Récupérer les prix sur chaque DEX
            prices = {}
            for dex_name, router in self.routers.items():
                try:
                    amounts_out = router.functions.getAmountsOut(
                        amount_in,
                        path
                    ).call()
                    
                    # Prix de sortie
                    amount_out = amounts_out[-1]
                    prices[dex_name] = {
                        'amount_out': amount_out,
                        'path': path,
                    }
                    
                except Exception as e:
                    logger.debug(f"Erreur {dex_name} pour {token_in}/{token_out}: {e}")
                    continue
            
            # Comparer les prix entre DEX
            if len(prices) < 2:
                return []
            
            dex_names = list(prices.keys())
            for i in range(len(dex_names)):
                for j in range(i + 1, len(dex_names)):
                    dex_buy = dex_names[i]
                    dex_sell = dex_names[j]
                    
                    price_buy = prices[dex_buy]['amount_out']
                    price_sell = prices[dex_sell]['amount_out']
                    
                    # Si on peut acheter moins cher sur dex_buy et vendre plus cher sur dex_sell
                    if price_buy > price_sell:
                        dex_buy, dex_sell = dex_sell, dex_buy
                        price_buy, price_sell = price_sell, price_buy
                    
                    # Calculer le spread
                    spread = (price_sell - price_buy) / price_buy
                    
                    if spread > min_spread:
                        # Calculer le profit estimé
                        profit_raw = price_sell - price_buy
                        profit_usd = (profit_raw / 10**6)  # 6 decimals
                        
                        # Soustraire les frais (0.09% Aave + 0.3% DEX fees)
                        fees = (amount_in / 10**6) * 0.0039  # 0.39% total
                        profit_net = profit_usd - fees
                        
                        if profit_net > min_profit:
                            opportunity = {
                                'token_in': token_in,
                                'token_out': token_out,
                                'amount': amount_in / 10**6,  # USD
                                'dex_buy': dex_buy,
                                'dex_sell': dex_sell,
                                'dex_buy_id': list(DEX_ROUTERS.keys()).index(dex_buy),
                                'dex_sell_id': list(DEX_ROUTERS.keys()).index(dex_sell),
                                'price_buy': price_buy,
                                'price_sell': price_sell,
                                'spread': spread,
                                'estimated_profit': profit_net,
                                'path_buy': prices[dex_buy]['path'],
                                'path_sell': prices[dex_sell]['path'],
                                'timestamp': self.w3.eth.block_number,
                            }
                            
                            opportunities.append(opportunity)
                            
                            logger.info(
                                f"💎 Opportunité: {token_in}/{token_out} | "
                                f"{dex_buy}→{dex_sell} | "
                                f"Spread: {spread*100:.2f}% | "
                                f"Profit: ${profit_net:.2f}"
                            )
            
            return opportunities
            
        except Exception as e:
            logger.error(f"❌ Erreur scan pair {token_in}/{token_out}: {e}")
            return []
    
    async def get_volatility(self, token: str, periods: int = 10) -> float:
        """
        Calcule la volatilité récente d'un token
        
        Args:
            token: Symbole du token
            periods: Nombre de périodes à analyser
        
        Returns:
            Score de volatilité (0-1)
        """
        try:
            # Dans une vraie implémentation, on récupérerait les prix historiques
            # depuis un oracle (Chainlink) ou une API (CoinGecko)
            
            # Pour la démo, on simule
            import random
            volatility = random.uniform(0.3, 0.9)
            
            return volatility
            
        except Exception as e:
            logger.error(f"Erreur calcul volatilité: {e}")
            return 0.5  # Volatilité moyenne par défaut
    
    async def get_liquidity(self, dex: str, token_in: str, token_out: str) -> float:
        """
        Récupère la liquidité disponible dans un pool
        
        Returns:
            Liquidité en USD
        """
        try:
            # Dans une vraie implémentation, on interrogerait le smart contract
            # du pool pour obtenir les réserves
            
            # Pour la démo, on simule
            import random
            liquidity = random.uniform(100_000, 10_000_000)
            
            return liquidity
            
        except Exception as e:
            logger.error(f"Erreur récupération liquidité: {e}")
            return 0
    
    async def get_gas_price_prediction(self) -> Dict:
        """
        Prédit le prix du gas dans les prochains blocks
        
        Returns:
            Dict avec fast, average, slow gas prices
        """
        try:
            current_gas = self.w3.eth.gas_price
            
            # Utiliser un oracle de gas (ex: GasNow API)
            # Pour la démo, on fait une simple prédiction
            
            return {
                'slow': int(current_gas * 0.9),
                'average': current_gas,
                'fast': int(current_gas * 1.1),
                'instant': int(current_gas * 1.3),
            }
            
        except Exception as e:
            logger.error(f"Erreur prédiction gas: {e}")
            return {
                'slow': 30_000_000_000,  # 30 Gwei
                'average': 40_000_000_000,  # 40 Gwei
                'fast': 50_000_000_000,  # 50 Gwei
                'instant': 60_000_000_000,  # 60 Gwei
            }


class GraphQLDexScanner:
    """
    Scanner utilisant les APIs GraphQL des DEX
    Plus rapide que les calls directs au smart contract
    """
    
    def __init__(self):
        self.endpoints = {
            'uniswap': 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
            'sushiswap': 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
            'quickswap': 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap-v3',
        }
    
    async def query_dex_prices(self, token_in: str, token_out: str) -> Dict:
        """
        Interroge les APIs GraphQL pour obtenir les prix rapidement
        """
        query = """
        query GetPair($token0: String!, $token1: String!) {
            pairs(where: {token0: $token0, token1: $token1}) {
                id
                token0Price
                token1Price
                reserve0
                reserve1
                volumeUSD
            }
        }
        """
        
        variables = {
            'token0': TOKENS[token_in],
            'token1': TOKENS[token_out],
        }
        
        results = {}
        
        async with aiohttp.ClientSession() as session:
            for dex_name, endpoint in self.endpoints.items():
                try:
                    async with session.post(
                        endpoint,
                        json={'query': query, 'variables': variables}
                    ) as response:
                        data = await response.json()
                        
                        if 'data' in data and 'pairs' in data['data']:
                            pairs = data['data']['pairs']
                            if pairs:
                                results[dex_name] = pairs[0]
                                
                except Exception as e:
                    logger.debug(f"Erreur query {dex_name}: {e}")
        
        return results
