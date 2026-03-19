"""
🔍 THESORIA - Calldata Decoder (Uniswap V3)
============================================

Décode les transactions pending pour identifier:
- Swaps Uniswap V3 (exactInput, exactOutput)
- Montants exacts
- Pools cibles
- Slippage toléré

CRITIQUE: Détection nanoseconde pour front-run JIT
"""

import logging
from typing import Dict, Optional, Tuple, List
from web3 import Web3
from eth_abi import decode
from decimal import Decimal

logger = logging.getLogger(__name__)


class CalldataDecoder:
    """
    Décodeur de calldata pour Uniswap V3
    
    Identifie et extrait les paramètres des swaps
    """
    
    # Uniswap V3 Router Addresses
    ROUTERS = {
        'SwapRouter': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        'SwapRouter02': '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        'UniversalRouter': '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    }
    
    # Function Signatures (4 bytes)
    FUNCTION_SIGS = {
        # SwapRouter
        'exactInputSingle': '0x414bf389',
        'exactInput': '0xc04b8d59',
        'exactOutputSingle': '0xdb3e2198',
        'exactOutput': '0xf28c0498',
        
        # SwapRouter02
        'exactInputSingle02': '0x04e45aaf',  # Même nom mais signature diff
        
        # UniversalRouter
        'execute': '0x3593564c',
    }
    
    # Pool fee tiers
    FEE_TIERS = {
        100: '0.01%',
        500: '0.05%',
        3000: '0.3%',
        10000: '1%',
    }
    
    def __init__(self, w3: Web3):
        """
        Initialise le décodeur
        
        Args:
            w3: Instance Web3
        """
        self.w3 = w3
        
        # Stats
        self.stats = {
            'txs_decoded': 0,
            'swaps_identified': 0,
            'decode_errors': 0,
        }
        
        logger.info(f"🔍 Calldata Decoder initialisé")
    
    def is_uniswap_v3_router(self, to_address: str) -> bool:
        """
        Vérifie si l'adresse est un router Uniswap V3
        
        Args:
            to_address: Adresse destination
        
        Returns:
            True si router Uniswap V3
        """
        if not to_address:
            return False
        
        to_address_lower = to_address.lower()
        
        return any(
            router.lower() == to_address_lower
            for router in self.ROUTERS.values()
        )
    
    def get_function_selector(self, calldata: str) -> str:
        """
        Extrait le function selector (4 premiers bytes)
        
        Args:
            calldata: Calldata hex string
        
        Returns:
            Function selector (0x...)
        """
        if not calldata or len(calldata) < 10:
            return ""
        
        # 0x + 8 chars = 4 bytes
        return calldata[:10]
    
    def decode_exact_input_single(
        self,
        calldata: str
    ) -> Optional[Dict]:
        """
        Décode exactInputSingle
        
        Params:
        - tokenIn: address
        - tokenOut: address
        - fee: uint24
        - recipient: address
        - deadline: uint256
        - amountIn: uint256
        - amountOutMinimum: uint256
        - sqrtPriceLimitX96: uint160
        
        Args:
            calldata: Calldata hex
        
        Returns:
            Paramètres décodés ou None
        """
        try:
            # Remove function selector (4 bytes = 8 hex chars)
            params_data = '0x' + calldata[10:]
            
            # Decode
            # Structure: tuple(address,address,uint24,address,uint256,uint256,uint256,uint160)
            decoded = decode(
                ['address', 'address', 'uint24', 'address', 'uint256', 'uint256', 'uint256', 'uint160'],
                bytes.fromhex(params_data[2:])
            )
            
            result = {
                'function': 'exactInputSingle',
                'tokenIn': decoded[0],
                'tokenOut': decoded[1],
                'fee': decoded[2],
                'fee_tier': self.FEE_TIERS.get(decoded[2], 'unknown'),
                'recipient': decoded[3],
                'deadline': decoded[4],
                'amountIn': decoded[5],
                'amountOutMinimum': decoded[6],
                'sqrtPriceLimitX96': decoded[7],
                'path': [decoded[0], decoded[1]],
            }
            
            # Calculer slippage
            result['slippage_tolerance'] = self._calculate_slippage(
                decoded[5],
                decoded[6]
            )
            
            return result
            
        except Exception as e:
            logger.debug(f"Erreur decode exactInputSingle: {e}")
            return None
    
    def decode_exact_input(
        self,
        calldata: str
    ) -> Optional[Dict]:
        """
        Décode exactInput (multi-hop)
        
        Params:
        - path: bytes (encoded path)
        - recipient: address
        - deadline: uint256
        - amountIn: uint256
        - amountOutMinimum: uint256
        
        Args:
            calldata: Calldata hex
        
        Returns:
            Paramètres décodés ou None
        """
        try:
            params_data = '0x' + calldata[10:]
            
            # Decode
            decoded = decode(
                ['bytes', 'address', 'uint256', 'uint256', 'uint256'],
                bytes.fromhex(params_data[2:])
            )
            
            # Decode path
            path_decoded = self._decode_path(decoded[0])
            
            result = {
                'function': 'exactInput',
                'path': path_decoded['tokens'],
                'fees': path_decoded['fees'],
                'recipient': decoded[1],
                'deadline': decoded[2],
                'amountIn': decoded[3],
                'amountOutMinimum': decoded[4],
                'tokenIn': path_decoded['tokens'][0],
                'tokenOut': path_decoded['tokens'][-1],
            }
            
            # Slippage
            result['slippage_tolerance'] = self._calculate_slippage(
                decoded[3],
                decoded[4]
            )
            
            return result
            
        except Exception as e:
            logger.debug(f"Erreur decode exactInput: {e}")
            return None
    
    def decode_exact_output_single(
        self,
        calldata: str
    ) -> Optional[Dict]:
        """
        Décode exactOutputSingle
        
        Args:
            calldata: Calldata hex
        
        Returns:
            Paramètres décodés ou None
        """
        try:
            params_data = '0x' + calldata[10:]
            
            decoded = decode(
                ['address', 'address', 'uint24', 'address', 'uint256', 'uint256', 'uint256', 'uint160'],
                bytes.fromhex(params_data[2:])
            )
            
            result = {
                'function': 'exactOutputSingle',
                'tokenIn': decoded[0],
                'tokenOut': decoded[1],
                'fee': decoded[2],
                'fee_tier': self.FEE_TIERS.get(decoded[2], 'unknown'),
                'recipient': decoded[3],
                'deadline': decoded[4],
                'amountOut': decoded[5],
                'amountInMaximum': decoded[6],
                'sqrtPriceLimitX96': decoded[7],
                'path': [decoded[0], decoded[1]],
            }
            
            return result
            
        except Exception as e:
            logger.debug(f"Erreur decode exactOutputSingle: {e}")
            return None
    
    def _decode_path(self, path_bytes: bytes) -> Dict:
        """
        Décode un path Uniswap V3
        
        Format: token0 (20 bytes) + fee (3 bytes) + token1 (20 bytes) + ...
        
        Args:
            path_bytes: Path encodé
        
        Returns:
            {tokens: [], fees: []}
        """
        tokens = []
        fees = []
        
        offset = 0
        
        # Premier token
        tokens.append('0x' + path_bytes[offset:offset+20].hex())
        offset += 20
        
        while offset < len(path_bytes):
            # Fee (3 bytes = uint24)
            fee_bytes = path_bytes[offset:offset+3]
            fee = int.from_bytes(fee_bytes, byteorder='big')
            fees.append(fee)
            offset += 3
            
            # Token suivant
            if offset + 20 <= len(path_bytes):
                tokens.append('0x' + path_bytes[offset:offset+20].hex())
                offset += 20
        
        return {
            'tokens': tokens,
            'fees': fees,
        }
    
    def _calculate_slippage(
        self,
        amount_in: int,
        amount_out_min: int
    ) -> float:
        """
        Calcule le slippage toléré
        
        Args:
            amount_in: Montant input
            amount_out_min: Montant output minimum
        
        Returns:
            Slippage en % (approximatif)
        """
        # Approximation: Slippage = (1 - amountOutMin / expectedOut) * 100
        # Sans prix exact, on utilise ratio brut
        
        if amount_in == 0:
            return 0.0
        
        # Ratio approximatif
        ratio = amount_out_min / amount_in
        
        # Slippage estimé (très approximatif)
        # En pratique, dépend du prix actuel
        slippage = max(0, (1 - ratio) * 100)
        
        return min(slippage, 100.0)
    
    def decode_swap(
        self,
        tx_data: str,
        to_address: str
    ) -> Optional[Dict]:
        """
        Décode une transaction de swap
        
        Args:
            tx_data: Calldata de la transaction
            to_address: Adresse destination
        
        Returns:
            Paramètres du swap ou None
        """
        self.stats['txs_decoded'] += 1
        
        # Vérifier si c'est un router Uniswap V3
        if not self.is_uniswap_v3_router(to_address):
            return None
        
        # Extraire function selector
        func_selector = self.get_function_selector(tx_data)
        
        # Décoder selon la fonction
        result = None
        
        if func_selector == self.FUNCTION_SIGS['exactInputSingle']:
            result = self.decode_exact_input_single(tx_data)
        
        elif func_selector == self.FUNCTION_SIGS['exactInput']:
            result = self.decode_exact_input(tx_data)
        
        elif func_selector == self.FUNCTION_SIGS['exactOutputSingle']:
            result = self.decode_exact_output_single(tx_data)
        
        elif func_selector == self.FUNCTION_SIGS['exactOutput']:
            # TODO: Implémenter
            logger.debug(f"exactOutput non implémenté encore")
            return None
        
        elif func_selector == self.FUNCTION_SIGS['execute']:
            # UniversalRouter - plus complexe
            logger.debug(f"UniversalRouter.execute - décodage complexe")
            return None
        
        else:
            logger.debug(f"Function selector inconnu: {func_selector}")
            return None
        
        if result:
            self.stats['swaps_identified'] += 1
            logger.debug(f"✅ Swap décodé: {result['function']}")
        
        return result
    
    def is_large_swap(
        self,
        swap_params: Dict,
        min_usd: float = 50000.0,
        token_prices: Dict[str, float] = None
    ) -> bool:
        """
        Vérifie si c'est un gros swap (candidat JIT)
        
        Args:
            swap_params: Paramètres décodés
            min_usd: Montant minimum ($)
            token_prices: Prix des tokens
        
        Returns:
            True si gros swap
        """
        if not swap_params:
            return False
        
        # Obtenir amountIn
        amount_in = swap_params.get('amountIn', 0)
        token_in = swap_params.get('tokenIn')
        
        if amount_in == 0:
            return False
        
        # Estimer valeur USD
        if token_prices and token_in:
            token_in_lower = token_in.lower()
            
            # Chercher prix
            price_usd = None
            for addr, price in token_prices.items():
                if addr.lower() == token_in_lower:
                    price_usd = price
                    break
            
            if price_usd:
                # Convertir en USD (assume 18 decimals par défaut)
                decimals = 18  # TODO: Get real decimals
                amount_usd = (amount_in / 10**decimals) * price_usd
                
                return amount_usd >= min_usd
        
        # Fallback: Vérifier montant brut
        # Si > 10 ETH ou > 10k USDC (avec 6 decimals)
        return amount_in > 10 * 10**18 or amount_in > 10000 * 10**6
    
    def get_pool_address(
        self,
        token0: str,
        token1: str,
        fee: int
    ) -> str:
        """
        Calcule l'adresse du pool Uniswap V3
        
        Formule: CREATE2 avec factory
        
        Args:
            token0: Adresse token 0 (sorted)
            token1: Adresse token 1 (sorted)
            fee: Fee tier
        
        Returns:
            Adresse du pool
        """
        # Uniswap V3 Factory
        factory = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
        
        # Sort tokens
        if token0.lower() > token1.lower():
            token0, token1 = token1, token0
        
        # Pool init code hash
        pool_init_code_hash = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
        
        # Encode parameters
        # salt = keccak256(abi.encodePacked(token0, token1, fee))
        salt_input = Web3.solidity_keccak(
            ['address', 'address', 'uint24'],
            [
                Web3.to_checksum_address(token0),
                Web3.to_checksum_address(token1),
                fee
            ]
        )
        
        # CREATE2 address
        # address = keccak256(0xff ++ factory ++ salt ++ pool_init_code_hash)[12:]
        create2_input = b'\xff' + bytes.fromhex(factory[2:]) + salt_input + bytes.fromhex(pool_init_code_hash[2:])
        
        pool_address = '0x' + Web3.keccak(create2_input)[12:].hex()
        
        return Web3.to_checksum_address(pool_address)
    
    def get_statistics(self) -> Dict:
        """Retourne les statistiques"""
        success_rate = 0
        if self.stats['txs_decoded'] > 0:
            success_rate = (self.stats['swaps_identified'] / self.stats['txs_decoded']) * 100
        
        return {
            **self.stats,
            'success_rate': success_rate,
        }


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

def main():
    """Test du décodeur"""
    from web3 import Web3
    
    w3 = Web3()
    decoder = CalldataDecoder(w3)
    
    # Exemple calldata exactInputSingle
    # Source: Transaction Uniswap V3 réelle
    calldata_example = "0x414bf389000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000063e8d5c10000000000000000000000000000000000000000000000000000000002faf0800000000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000000000000000000"
    
    to_address = "0xE592427A0AEce92De3Edee1F18E0157C05861564"  # SwapRouter
    
    print(f"🔍 Test décodage calldata...")
    print(f"   To: {to_address}")
    print(f"   Calldata length: {len(calldata_example)} chars")
    
    result = decoder.decode_swap(calldata_example, to_address)
    
    if result:
        print(f"\n✅ SWAP DÉCODÉ:")
        print(f"   Function: {result['function']}")
        print(f"   Token In: {result['tokenIn']}")
        print(f"   Token Out: {result['tokenOut']}")
        print(f"   Fee: {result.get('fee_tier', 'N/A')}")
        print(f"   Amount In: {result['amountIn']:,}")
        print(f"   Amount Out Min: {result['amountOutMinimum']:,}")
        print(f"   Slippage: {result.get('slippage_tolerance', 0):.2f}%")
        
        # Pool address
        pool = decoder.get_pool_address(
            result['tokenIn'],
            result['tokenOut'],
            result.get('fee', 3000)
        )
        print(f"   Pool: {pool}")
        
        # Check si gros swap
        token_prices = {
            result['tokenIn'].lower(): 1.0,  # USDC = $1
        }
        
        is_large = decoder.is_large_swap(result, min_usd=50000, token_prices=token_prices)
        print(f"   Large swap: {is_large}")
    else:
        print(f"\n❌ Échec décodage")
    
    # Stats
    stats = decoder.get_statistics()
    print(f"\n📊 Statistiques:")
    for key, value in stats.items():
        print(f"   {key}: {value}")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    main()
