"""
🌐 THESORIA - ERC-3156 Flash Loan Integration
==============================================

Standard universel de flash loans compatible avec:
- Aave V3
- Uniswap
- Tout protocole supportant ERC-3156

ERC-3156: https://eips.ethereum.org/EIPS/eip-3156
"""

import os
import logging
from typing import Dict, Optional
from decimal import Decimal
from web3 import Web3
from eth_abi import encode, decode

logger = logging.getLogger(__name__)


# ============================================
# ERC-3156 CONSTANTS
# ============================================

# keccak256("ERC3156FlashBorrower.onFlashLoan")
CALLBACK_SUCCESS = "0x439148f0bbc682ca079e46d6e2c2f0c1e3b820f1a291b069d8882abf8cf18dd9"


# ============================================
# ABIs
# ============================================

FLASH_LENDER_ABI = [
    {
        "inputs": [
            {"name": "token", "type": "address"}
        ],
        "name": "maxFlashLoan",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "token", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "flashFee",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "receiver", "type": "address"},
            {"name": "token", "type": "address"},
            {"name": "amount", "type": "uint256"},
            {"name": "data", "type": "bytes"}
        ],
        "name": "flashLoan",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

FLASH_BORROWER_ABI = [
    {
        "inputs": [
            {"name": "initiator", "type": "address"},
            {"name": "token", "type": "address"},
            {"name": "amount", "type": "uint256"},
            {"name": "fee", "type": "uint256"},
            {"name": "data", "type": "bytes"}
        ],
        "name": "onFlashLoan",
        "outputs": [{"name": "", "type": "bytes32"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]


# ============================================
# ERC-3156 FLASH LENDER INTEGRATION
# ============================================

class ERC3156FlashLender:
    """
    Client pour interagir avec un Flash Lender ERC-3156
    """
    
    def __init__(self, w3: Web3, lender_address: str):
        """
        Initialize ERC-3156 Flash Lender
        
        Args:
            w3: Web3 instance
            lender_address: Address of the flash lender contract
        """
        self.w3 = w3
        self.lender_address = Web3.to_checksum_address(lender_address)
        
        self.contract = w3.eth.contract(
            address=self.lender_address,
            abi=FLASH_LENDER_ABI
        )
        
        logger.info(f"✅ ERC-3156 Flash Lender initialized: {lender_address}")
    
    def max_flash_loan(self, token: str) -> int:
        """
        Maximum amount available for flash loan
        
        Args:
            token: Token address
            
        Returns:
            Maximum loan amount
        """
        try:
            max_amount = self.contract.functions.maxFlashLoan(
                Web3.to_checksum_address(token)
            ).call()
            
            logger.debug(f"📊 Max flash loan for {token}: {max_amount}")
            
            return max_amount
        
        except Exception as e:
            logger.error(f"❌ Max flash loan error: {e}")
            return 0
    
    def flash_fee(self, token: str, amount: int) -> int:
        """
        Fee for a flash loan
        
        Args:
            token: Token address
            amount: Loan amount
            
        Returns:
            Fee amount
        """
        try:
            fee = self.contract.functions.flashFee(
                Web3.to_checksum_address(token),
                amount
            ).call()
            
            logger.debug(f"💰 Flash loan fee: {fee}")
            
            return fee
        
        except Exception as e:
            logger.error(f"❌ Flash fee error: {e}")
            return 0
    
    def flash_loan(
        self,
        receiver: str,
        token: str,
        amount: int,
        data: bytes = b''
    ) -> Dict:
        """
        Execute flash loan
        
        Args:
            receiver: Receiver contract address
            token: Token to borrow
            amount: Amount to borrow
            data: Arbitrary data for callback
            
        Returns:
            Transaction dict
        """
        try:
            tx = self.contract.functions.flashLoan(
                Web3.to_checksum_address(receiver),
                Web3.to_checksum_address(token),
                amount,
                data
            ).build_transaction({
                'from': self.w3.eth.default_account,
                'nonce': self.w3.eth.get_transaction_count(self.w3.eth.default_account),
                'gas': 500000,
                'gasPrice': self.w3.eth.gas_price
            })
            
            logger.info(f"⚡ Flash loan TX built: {amount} of {token}")
            
            return tx
        
        except Exception as e:
            logger.error(f"❌ Flash loan TX error: {e}")
            return {}


# ============================================
# KNOWN FLASH LENDERS
# ============================================

class FlashLenderRegistry:
    """
    Registry of known ERC-3156 flash lenders
    """
    
    # Mainnet lenders
    LENDERS = {
        'aave_v3': {
            'address': '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
            'name': 'Aave V3 Pool',
            'fee': Decimal('0.0009')  # 0.09%
        },
        'uniswap_v3': {
            'address': '0x1F98431c8aD98523631AE4a59f267346ea31F984',
            'name': 'Uniswap V3 Factory',
            'fee': Decimal('0')
        },
        'balancer': {
            'address': '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
            'name': 'Balancer Vault',
            'fee': Decimal('0')
        }
    }
    
    @classmethod
    def get_lender(cls, name: str) -> Optional[Dict]:
        """
        Get lender info by name
        
        Args:
            name: Lender name
            
        Returns:
            Lender info dict
        """
        return cls.LENDERS.get(name)
    
    @classmethod
    def get_best_lender(cls, token: str, amount: int, w3: Web3) -> Optional[str]:
        """
        Find best lender (lowest fee, sufficient liquidity)
        
        Args:
            token: Token to borrow
            amount: Amount needed
            w3: Web3 instance
            
        Returns:
            Best lender address
        """
        best_lender = None
        best_fee = Decimal('999999')
        
        for name, info in cls.LENDERS.items():
            try:
                lender = ERC3156FlashLender(w3, info['address'])
                
                max_loan = lender.max_flash_loan(token)
                
                if max_loan >= amount:
                    fee = lender.flash_fee(token, amount)
                    
                    if Decimal(fee) < best_fee:
                        best_fee = Decimal(fee)
                        best_lender = info['address']
            
            except Exception as e:
                logger.warning(f"⚠️  Lender {name} unavailable: {e}")
                continue
        
        if best_lender:
            logger.info(f"✅ Best lender found: {best_lender} (fee: {best_fee})")
        
        return best_lender


# ============================================
# ERC-3156 FLASH BORROWER (Example)
# ============================================

FLASH_BORROWER_SOLIDITY = """
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";
import "./interfaces/IERC3156FlashBorrower.sol";
import "./interfaces/IERC3156FlashLender.sol";

/**
 * @title FlashBorrower
 * @dev Example ERC-3156 flash loan borrower
 */
contract FlashBorrower is IERC3156FlashBorrower {
    
    enum Action {NORMAL, ARBITRAGE, JIT_LIQUIDITY}
    
    IERC3156FlashLender public lender;
    address public owner;
    
    constructor(IERC3156FlashLender lender_) {
        lender = lender_;
        owner = msg.sender;
    }
    
    /// @dev ERC-3156 Flash loan callback
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external override returns(bytes32) {
        require(
            msg.sender == address(lender),
            "FlashBorrower: Untrusted lender"
        );
        require(
            initiator == address(this),
            "FlashBorrower: Untrusted loan initiator"
        );
        
        (Action action) = abi.decode(data, (Action));
        
        if (action == Action.ARBITRAGE) {
            // Execute arbitrage
            executeArbitrage(token, amount);
        } else if (action == Action.JIT_LIQUIDITY) {
            // Execute JIT liquidity
            executeJIT(token, amount);
        }
        
        // Repay loan + fee
        IERC20(token).approve(address(lender), amount + fee);
        
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
    
    /// @dev Initiate a flash loan
    function flashBorrow(
        address token,
        uint256 amount,
        Action action
    ) public {
        require(msg.sender == owner, "Not owner");
        
        bytes memory data = abi.encode(action);
        lender.flashLoan(this, token, amount, data);
    }
    
    function executeArbitrage(address token, uint256 amount) internal {
        // TODO: Implement arbitrage logic
    }
    
    function executeJIT(address token, uint256 amount) internal {
        // TODO: Implement JIT logic
    }
}
"""


# ============================================
# USAGE EXAMPLE
# ============================================

async def main():
    """Test ERC-3156 integration"""
    from dotenv import load_dotenv
    
    load_dotenv()
    
    # Setup logging
    logging.basicConfig(level=logging.INFO)
    
    # Web3
    w3 = Web3(Web3.HTTPProvider(os.getenv('ETH_HTTP_URL')))
    
    if not w3.is_connected():
        print("❌ Not connected")
        return
    
    print(f"✅ Connected: Block {w3.eth.block_number}")
    
    # Get Aave V3 lender
    aave_info = FlashLenderRegistry.get_lender('aave_v3')
    
    if aave_info:
        lender = ERC3156FlashLender(w3, aave_info['address'])
        
        # USDC address
        usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        
        # Check max loan
        max_loan = lender.max_flash_loan(usdc)
        print(f"📊 Max USDC flash loan: {max_loan / 10**6:.2f} USDC")
        
        # Check fee for 100k USDC
        amount = 100_000 * 10**6
        fee = lender.flash_fee(usdc, amount)
        print(f"💰 Fee for 100k USDC: {fee / 10**6:.2f} USDC ({(fee/amount)*100:.4f}%)")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
