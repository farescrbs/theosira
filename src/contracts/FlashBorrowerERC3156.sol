// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";

/**
 * @title IERC3156FlashBorrower
 * @dev ERC-3156 Flash Borrower Interface
 */
interface IERC3156FlashBorrower {
    /**
     * @dev Receive a flash loan.
     * @param initiator The initiator of the loan.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @param fee The additional amount of tokens to repay.
     * @param data Arbitrary data structure, intended to contain user-defined parameters.
     * @return The keccak256 hash of "ERC3156FlashBorrower.onFlashLoan"
     */
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32);
}

/**
 * @title IERC3156FlashLender
 * @dev ERC-3156 Flash Lender Interface
 */
interface IERC3156FlashLender {
    /**
     * @dev The amount of currency available to be lent.
     * @param token The loan currency.
     * @return The amount of `token` that can be borrowed.
     */
    function maxFlashLoan(address token) external view returns (uint256);

    /**
     * @dev The fee to be charged for a given loan.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @return The amount of `token` to be charged for the loan, on top of the returned principal.
     */
    function flashFee(address token, uint256 amount) external view returns (uint256);

    /**
     * @dev Initiate a flash loan.
     * @param receiver The receiver of the tokens in the loan, and the receiver of the callback.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @param data Arbitrary data structure, intended to contain user-defined parameters.
     */
    function flashLoan(
        IERC3156FlashBorrower receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);
}

/**
 * @title FlashBorrowerERC3156
 * @author THESORIA
 * @notice Universal ERC-3156 Flash Loan Borrower
 * @dev Compatible with Aave V3, Uniswap, Balancer, etc.
 */
contract FlashBorrowerERC3156 is IERC3156FlashBorrower {
    
    // ============================================
    // CONSTANTS
    // ============================================
    
    bytes32 public constant CALLBACK_SUCCESS = keccak256("ERC3156FlashBorrower.onFlashLoan");
    
    // ============================================
    // ENUMS
    // ============================================
    
    enum Action {
        NORMAL,
        ARBITRAGE,
        JIT_LIQUIDITY,
        SANDWICH,
        LIQUIDATION
    }
    
    // ============================================
    // STATE VARIABLES
    // ============================================
    
    IERC3156FlashLender public lender;
    address public owner;
    
    // Stats
    uint256 public totalLoans;
    uint256 public totalProfit;
    
    // ============================================
    // EVENTS
    // ============================================
    
    event FlashLoanExecuted(
        address indexed token,
        uint256 amount,
        uint256 fee,
        Action action,
        uint256 profit
    );
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // ============================================
    // MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyLender() {
        require(msg.sender == address(lender), "Not lender");
        _;
    }
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor(IERC3156FlashLender _lender) {
        lender = _lender;
        owner = msg.sender;
    }
    
    // ============================================
    // ERC-3156 CALLBACK
    // ============================================
    
    /**
     * @dev ERC-3156 Flash loan callback
     * @param initiator The initiator of the loan
     * @param token The loan currency
     * @param amount The amount of tokens lent
     * @param fee The additional amount of tokens to repay
     * @param data Arbitrary data structure
     * @return The keccak256 hash of "ERC3156FlashBorrower.onFlashLoan"
     */
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external override onlyLender returns(bytes32) {
        // Verify initiator
        require(initiator == address(this), "Untrusted loan initiator");
        
        // Decode action
        (Action action) = abi.decode(data, (Action));
        
        // Execute strategy
        uint256 profit = 0;
        
        if (action == Action.ARBITRAGE) {
            profit = executeArbitrage(token, amount);
        } else if (action == Action.JIT_LIQUIDITY) {
            profit = executeJIT(token, amount);
        } else if (action == Action.SANDWICH) {
            profit = executeSandwich(token, amount);
        } else if (action == Action.LIQUIDATION) {
            profit = executeLiquidation(token, amount);
        }
        
        // Stats
        totalLoans++;
        totalProfit += profit;
        
        // Approve repayment
        IERC20(token).approve(address(lender), amount + fee);
        
        emit FlashLoanExecuted(token, amount, fee, action, profit);
        
        return CALLBACK_SUCCESS;
    }
    
    // ============================================
    // PUBLIC FUNCTIONS
    // ============================================
    
    /**
     * @dev Initiate a flash loan
     * @param token The loan currency
     * @param amount The amount to borrow
     * @param action The action to execute
     */
    function flashBorrow(
        address token,
        uint256 amount,
        Action action
    ) external onlyOwner {
        bytes memory data = abi.encode(action);
        
        // Check max loan
        uint256 maxLoan = lender.maxFlashLoan(token);
        require(amount <= maxLoan, "Amount exceeds max loan");
        
        // Check fee
        uint256 fee = lender.flashFee(token, amount);
        
        // Execute flash loan
        bool success = lender.flashLoan(this, token, amount, data);
        require(success, "Flash loan failed");
    }
    
    // ============================================
    // STRATEGY FUNCTIONS
    // ============================================
    
    /**
     * @dev Execute arbitrage strategy
     */
    function executeArbitrage(address token, uint256 amount) internal returns (uint256 profit) {
        // TODO: Implement arbitrage logic
        // Example: Buy on DEX A, sell on DEX B
        
        profit = 0;
    }
    
    /**
     * @dev Execute JIT liquidity strategy
     */
    function executeJIT(address token, uint256 amount) internal returns (uint256 profit) {
        // TODO: Implement JIT liquidity logic
        // Example: Mint Uniswap V3 position, capture fees, burn position
        
        profit = 0;
    }
    
    /**
     * @dev Execute sandwich attack
     */
    function executeSandwich(address token, uint256 amount) internal returns (uint256 profit) {
        // TODO: Implement sandwich logic
        // Example: Front-run victim, back-run victim
        
        profit = 0;
    }
    
    /**
     * @dev Execute liquidation
     */
    function executeLiquidation(address token, uint256 amount) internal returns (uint256 profit) {
        // TODO: Implement liquidation logic
        // Example: Liquidate undercollateralized position on Aave
        
        profit = 0;
    }
    
    // ============================================
    // ADMIN FUNCTIONS
    // ============================================
    
    /**
     * @dev Change lender
     */
    function setLender(IERC3156FlashLender _lender) external onlyOwner {
        lender = _lender;
    }
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
    
    /**
     * @dev Withdraw profits
     */
    function withdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
    
    /**
     * @dev Withdraw ETH
     */
    function withdrawETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // ============================================
    // VIEW FUNCTIONS
    // ============================================
    
    /**
     * @dev Get max flash loan for token
     */
    function getMaxFlashLoan(address token) external view returns (uint256) {
        return lender.maxFlashLoan(token);
    }
    
    /**
     * @dev Get flash loan fee
     */
    function getFlashFee(address token, uint256 amount) external view returns (uint256) {
        return lender.flashFee(token, amount);
    }
    
    // ============================================
    // FALLBACK
    // ============================================
    
    receive() external payable {}
}
