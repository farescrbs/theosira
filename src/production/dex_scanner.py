"""
🔍 THESORIA - Scanner Multi-DEX RÉEL
=====================================

Scanner ultra-rapide pour détecter opportunités d'arbitrage:
- Surveillance prix on-chain en temps réel
- Multi-DEX (Uniswap, SushiSwap, QuickSwap, etc.)
- Calcul spread instantané
- Filtrage opportunités profitables

Latence cible: < 50ms par scan
"""

import asyncio
import time
from typing import Dict, List, Optional, Tuple
from web3 import Web3
from eth_abi import encode
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


# ABIs minimaux pour les pairs DEX
PAIR_ABI = [
    {
        "constant": True,
        "inputs": [],
        "name": "getReserves",
        "outputs": [
            {"name": "reserve0", "type": "uint112"},
            {"name": "reserve1", "type": "uint112"},
            {"name": "blockTimestampLast", "type": "uint32"}
        ],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "token0",
        "outputs": [{"name": "", "type": "address"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "token1",
        "outputs": [{"name": "", "type": "address"}],
        "type": "function"
    }
]


class DexScanner:
    """
    Scanner Multi-DEX pour opportunités d'arbitrage
    
    Surveille plusieurs DEX en parallèle et détecte les spreads
    """
    
    # Adresses des pairs populaires (Polygon)
    POLYGON_PAIRS = {
        'USDC-WETH': {
            'QuickSwap': '0x853Ee4b2A13f8a742d64C8F088bE7bA2131f670d',
            'SushiSwap': '0x34965ba0ac2451A34a0471F04CCa3F990b8dea27',
            'Uniswap': '0x88f3C15523544835fF6c738DDb30995339AD57d6',
        },
        'USDC-WMATIC': {
            'QuickSwap': '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
            'SushiSwap': '0xcd353F79d9FADe311fC3119B841e1f456b54e858',
        },
        'WMATIC-WETH': {
            'QuickSwap': '0xadbF1854e5883eB8aa7BAf50705338739e558E5b',
            'SushiSwap': '0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E',
        },
    }
    
    def __init__(
        self,
        w3: Web3,
        min_spread_percent: float = 0.5,
        min_profit_usd: float = 50.0
    ):
        """
        Initialise le scanner
        
        Args:
            w3: Instance Web3
            min_spread_percent: Spread minimum pour opportunité (%)
            min_profit_usd: Profit minimum estimé ($)
        """
        self.w3 = w3
        self.min_spread_percent = Decimal(str(min_spread_percent))
        self.min_profit_usd = Decimal(str(min_profit_usd))
        
        # Cache des contrats
        self.pair_contracts = {}
        
        # Statistiques
        self.stats = {
            'scans_total': 0,
            'opportunities_found': 0,
            'opportunities_profitable': 0,
        }
        
        logger.info(f"🔍 DEX Scanner initialisé")
        logger.info(f"   Min spread: {min_spread_percent}%")
        logger.info(f"   Min profit: ${min_profit_usd}")
    
    def get_pair_contract(self, pair_address: str):
        """
        Obtient le contrat d'une pair (avec cache)
        
        Args:
            pair_address: Adresse de la pair
        
        Returns:
            Contrat Web3
        """
        if pair_address not in self.pair_contracts:
            self.pair_contracts[pair_address] = self.w3.eth.contract(
                address=Web3.to_checksum_address(pair_address),
                abi=PAIR_ABI
            )
        
        return self.pair_contracts[pair_address]
    
    async def get_pair_price(
        self,
        pair_address: str,
        token_in_is_token0: bool = True
    ) -> Optional[Decimal]:
        """
        Obtient le prix d'une pair
        
        Formule Uniswap V2: price = reserve1 / reserve0
        
        Args:
            pair_address: Adresse de la pair
            token_in_is_token0: True si on achète token0
        
        Returns:
            Prix (Decimal) ou None si erreur
        """
        try:
            contract = self.get_pair_contract(pair_address)
            
            # Appel synchrone (pour éviter overhead async)
            reserves = contract.functions.getReserves().call()
            
            reserve0 = Decimal(reserves[0])
            reserve1 = Decimal(reserves[1])
            
            if reserve0 == 0 or reserve1 == 0:
                return None
            
            # Calcul prix selon direction
            if token_in_is_token0:
                # Acheter token0 avec token1
                price = reserve1 / reserve0
            else:
                # Acheter token1 avec token0
                price = reserve0 / reserve1
            
            return price
            
        except Exception as e:
            logger.debug(f"Erreur get_pair_price {pair_address}: {e}")
            return None
    
    async def calculate_output_amount(
        self,
        amount_in: int,
        reserve_in: int,
        reserve_out: int,
        fee: int = 997
    ) -> int:
        """
        Calcule le montant de sortie selon la formule Uniswap V2
        
        Formule: amountOut = (amountIn * fee * reserveOut) / (reserveIn * 1000 + amountIn * fee)
        
        Args:
            amount_in: Montant d'entrée (wei)
            reserve_in: Réserve token entrée
            reserve_out: Réserve token sortie
            fee: Fee (997 = 0.3%, 998 = 0.2%)
        
        Returns:
            Montant de sortie (wei)
        """
        if reserve_in == 0 or reserve_out == 0:
            return 0
        
        amount_in_with_fee = amount_in * fee
        numerator = amount_in_with_fee * reserve_out
        denominator = (reserve_in * 1000) + amount_in_with_fee
        
        amount_out = numerator // denominator
        
        return amount_out
    
    async def scan_pair_opportunity(
        self,
        pair_name: str,
        dex_addresses: Dict[str, str],
        amount_in_usd: float = 10000.0
    ) -> Optional[Dict]:
        """
        Scanne une paire sur plusieurs DEX pour détecter arbitrage
        
        Args:
            pair_name: Nom de la paire (ex: "USDC-WETH")
            dex_addresses: Dict {dex_name: pair_address}
            amount_in_usd: Montant pour simulation ($)
        
        Returns:
            Opportunité si trouvée, None sinon
        """
        scan_start = time.time()
        
        try:
            # 1. Récupérer les prix de tous les DEX en parallèle
            prices = {}
            
            for dex_name, pair_address in dex_addresses.items():
                price = await self.get_pair_price(pair_address)
                
                if price:
                    prices[dex_name] = {
                        'price': price,
                        'address': pair_address
                    }
            
            if len(prices) < 2:
                # Pas assez de DEX avec prix valides
                return None
            
            # 2. Trouver le DEX le moins cher (acheter) et le plus cher (vendre)
            buy_dex = min(prices.items(), key=lambda x: x[1]['price'])
            sell_dex = max(prices.items(), key=lambda x: x[1]['price'])
            
            buy_dex_name, buy_data = buy_dex
            sell_dex_name, sell_data = sell_dex
            
            buy_price = buy_data['price']
            sell_price = sell_data['price']
            
            # 3. Calculer le spread
            spread = (sell_price - buy_price) / buy_price
            spread_percent = spread * Decimal('100')
            
            # Vérifier spread minimum
            if spread_percent < self.min_spread_percent:
                return None
            
            # 4. Estimer le profit
            # Simplification: profit = amount * spread - fees
            # Fees: 0.3% * 2 = 0.6% total
            gross_profit_percent = spread_percent - Decimal('0.6')
            
            if gross_profit_percent <= 0:
                return None
            
            estimated_profit = (Decimal(str(amount_in_usd)) * gross_profit_percent / Decimal('100'))
            
            # Vérifier profit minimum
            if estimated_profit < self.min_profit_usd:
                return None
            
            # 5. Opportunité trouvée!
            scan_time = time.time() - scan_start
            
            self.stats['opportunities_found'] += 1
            
            if estimated_profit >= self.min_profit_usd:
                self.stats['opportunities_profitable'] += 1
            
            opportunity = {
                'pair': pair_name,
                'dex_buy': buy_dex_name,
                'dex_sell': sell_dex_name,
                'buy_price': float(buy_price),
                'sell_price': float(sell_price),
                'spread_percent': float(spread_percent),
                'estimated_profit_usd': float(estimated_profit),
                'amount_usd': amount_in_usd,
                'scan_time_ms': scan_time * 1000,
                'timestamp': time.time(),
                'buy_pair_address': buy_data['address'],
                'sell_pair_address': sell_data['address'],
            }
            
            logger.info(f"\n💎 OPPORTUNITÉ DÉTECTÉE!")
            logger.info(f"   Pair: {pair_name}")
            logger.info(f"   {buy_dex_name} → {sell_dex_name}")
            logger.info(f"   Spread: {spread_percent:.2f}%")
            logger.info(f"   Profit estimé: ${estimated_profit:.2f}")
            logger.info(f"   Scan: {scan_time*1000:.1f}ms")
            
            return opportunity
            
        except Exception as e:
            logger.error(f"Erreur scan_pair_opportunity {pair_name}: {e}")
            return None
    
    async def scan_all_pairs(
        self,
        amount_in_usd: float = 10000.0
    ) -> List[Dict]:
        """
        Scanne toutes les paires configurées
        
        Args:
            amount_in_usd: Montant pour simulation
        
        Returns:
            Liste des opportunités trouvées
        """
        scan_start = time.time()
        self.stats['scans_total'] += 1
        
        opportunities = []
        
        # Scanner toutes les paires en parallèle
        tasks = []
        
        for pair_name, dex_addresses in self.POLYGON_PAIRS.items():
            task = self.scan_pair_opportunity(
                pair_name=pair_name,
                dex_addresses=dex_addresses,
                amount_in_usd=amount_in_usd
            )
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filtrer les opportunités valides
        for result in results:
            if result and not isinstance(result, Exception):
                opportunities.append(result)
        
        scan_time = time.time() - scan_start
        
        if opportunities:
            logger.info(f"\n📊 SCAN COMPLET:")
            logger.info(f"   Opportunités: {len(opportunities)}")
            logger.info(f"   Temps total: {scan_time*1000:.1f}ms")
        
        return opportunities
    
    async def continuous_scan(
        self,
        interval_seconds: float = 0.1,
        callback = None
    ):
        """
        Boucle de scan continu
        
        Args:
            interval_seconds: Intervalle entre scans (0.1 = 10/sec)
            callback: Fonction appelée avec opportunités trouvées
        """
        logger.info(f"\n🔄 SCAN CONTINU DÉMARRÉ")
        logger.info(f"   Intervalle: {interval_seconds}s ({1/interval_seconds:.0f} scans/sec)")
        
        while True:
            try:
                scan_start = time.time()
                
                # Scanner
                opportunities = await self.scan_all_pairs()
                
                # Callback si opportunités
                if opportunities and callback:
                    for opp in opportunities:
                        await callback(opp)
                
                # Respecter l'intervalle
                scan_time = time.time() - scan_start
                sleep_time = max(0, interval_seconds - scan_time)
                
                if sleep_time > 0:
                    await asyncio.sleep(sleep_time)
                
            except Exception as e:
                logger.error(f"Erreur continuous_scan: {e}")
                await asyncio.sleep(1)
    
    def get_statistics(self) -> Dict:
        """Retourne les statistiques"""
        return {
            **self.stats,
            'success_rate': (
                self.stats['opportunities_profitable'] / self.stats['scans_total'] * 100
                if self.stats['scans_total'] > 0
                else 0
            )
        }


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

async def example_usage():
    """Exemple d'utilisation du scanner"""
    from web3 import Web3
    import os
    
    # Setup
    rpc_url = os.getenv('POLYGON_RPC_URL', 'https://polygon-rpc.com')
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        print(f"❌ Impossible de se connecter au RPC")
        return
    
    print(f"✅ Connecté au RPC")
    print(f"   Block: {w3.eth.block_number}")
    
    # Créer scanner
    scanner = DexScanner(
        w3=w3,
        min_spread_percent=0.5,  # 0.5% minimum
        min_profit_usd=50.0      # $50 minimum
    )
    
    print(f"\n🔍 Test scan unique...")
    
    # Scan unique
    opportunities = await scanner.scan_all_pairs(amount_in_usd=10000.0)
    
    if opportunities:
        print(f"\n✅ Opportunités trouvées: {len(opportunities)}")
        for opp in opportunities:
            print(f"\n💎 {opp['pair']}")
            print(f"   {opp['dex_buy']} → {opp['dex_sell']}")
            print(f"   Spread: {opp['spread_percent']:.2f}%")
            print(f"   Profit: ${opp['estimated_profit_usd']:.2f}")
    else:
        print(f"\n⚠️  Aucune opportunité trouvée")
    
    # Stats
    stats = scanner.get_statistics()
    print(f"\n📊 Statistiques:")
    for key, value in stats.items():
        print(f"   {key}: {value}")


async def example_continuous():
    """Exemple de scan continu"""
    from web3 import Web3
    import os
    
    rpc_url = os.getenv('POLYGON_RPC_URL', 'https://polygon-rpc.com')
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    scanner = DexScanner(w3, min_spread_percent=0.5, min_profit_usd=50.0)
    
    # Callback
    async def on_opportunity(opp):
        print(f"\n🚨 OPPORTUNITÉ! {opp['pair']}")
        print(f"   Profit: ${opp['estimated_profit_usd']:.2f}")
        # Ici: Exécuter le trade
    
    # Scan continu (10/sec)
    await scanner.continuous_scan(
        interval_seconds=0.1,
        callback=on_opportunity
    )


if __name__ == "__main__":
    import logging
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Test scan unique
    asyncio.run(example_usage())
    
    # Pour scan continu:
    # asyncio.run(example_continuous())
