// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

/**
 * @title FlashLoanArbitrage
 * @notice Smart contract pour flash loan arbitrage entre DEX
 * @dev Utilise Aave V3 flash loans pour arbitrage Uniswap V2/V3
 * 
 * STRATÉGIE :
 * 1. Flash loan token A depuis Aave
 * 2. Swap A → B sur Uniswap V2 (prix bas)
 * 3. Swap B → A sur Uniswap V3 (prix haut)
 * 4. Rembourser flash loan + fee
 * 5. Profit = différence - fees
 * 
 * SÉCURITÉ :
 * - Owner only pour withdraw
 * - Slippage protection
 * - Deadline protection
 * - Reentrancy guard via Aave
 */
contract FlashLoanArbitrage is FlashLoanSimpleReceiverBase {
    address public immutable owner;
    
    ISwapRouter public immutable uniswapV3Router;
    IUniswapV2Router02 public immutable uniswapV2Router;
    
    // Events
    event ArbitrageExecuted(
        address indexed token,
        uint256 amount,
        uint256 profit,
        uint256 timestamp
    );
    
    event FlashLoanReceived(
        address indexed asset,
        uint256 amount,
        uint256 premium
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(
        address _addressProvider,
        address _uniswapV3Router,
        address _uniswapV2Router
    ) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = msg.sender;
        uniswapV3Router = ISwapRouter(_uniswapV3Router);
        uniswapV2Router = IUniswapV2Router02(_uniswapV2Router);
    }
    
    /**
     * @notice Exécuter arbitrage avec flash loan
     * @param asset Token à emprunter
     * @param amount Montant à emprunter
     * @param params Paramètres encodés (tokenOut, minProfit, deadline)
     */
    function executeArbitrage(
        address asset,
        uint256 amount,
        bytes calldata params
    ) external onlyOwner {
        // Demander flash loan à Aave
        POOL.flashLoanSimple(
            address(this),
            asset,
            amount,
            params,
            0 // referral code
        );
    }
    
    /**
     * @notice Callback appelé par Aave lors du flash loan
     * @dev DOIT rembourser amount + premium sinon revert
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(initiator == address(this), "Invalid initiator");
        
        emit FlashLoanReceived(asset, amount, premium);
        
        // Decode params
        (address tokenOut, uint256 minProfit, uint256 deadline) = abi.decode(
            params,
            (address, uint256, uint256)
        );
        
        require(block.timestamp <= deadline, "Deadline expired");
        
        // Balance avant arbitrage
        uint256 balanceBefore = IERC20(asset).balanceOf(address(this));
        
        // === ARBITRAGE LOGIC ===
        
        // 1. Approve Uniswap V2
        IERC20(asset).approve(address(uniswapV2Router), amount);
        
        // 2. Swap asset → tokenOut sur Uniswap V2
        address[] memory pathV2 = new address[](2);
        pathV2[0] = asset;
        pathV2[1] = tokenOut;
        
        uint256[] memory amountsV2 = uniswapV2Router.swapExactTokensForTokens(
            amount,
            0, // accepter n'importe quel montant (sera vérifié à la fin)
            pathV2,
            address(this),
            deadline
        );
        
        uint256 tokenOutReceived = amountsV2[1];
        
        // 3. Approve Uniswap V3
        IERC20(tokenOut).approve(address(uniswapV3Router), tokenOutReceived);
        
        // 4. Swap tokenOut → asset sur Uniswap V3
        ISwapRouter.ExactInputSingleParams memory swapParams = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenOut,
                tokenOut: asset,
                fee: 3000, // 0.3% pool
                recipient: address(this),
                deadline: deadline,
                amountIn: tokenOutReceived,
                amountOutMinimum: amount + premium + minProfit, // MINIMUM requis
                sqrtPriceLimitX96: 0
            });
        
        uint256 assetReceived = uniswapV3Router.exactInputSingle(swapParams);
        
        // === FIN ARBITRAGE ===
        
        // Balance après arbitrage
        uint256 balanceAfter = IERC20(asset).balanceOf(address(this));
        uint256 profit = balanceAfter - balanceBefore;
        
        // Vérifier profit minimum
        require(profit >= minProfit, "Insufficient profit");
        
        // Calculer montant à rembourser
        uint256 amountToRepay = amount + premium;
        
        // Approve Aave pool pour repayment
        IERC20(asset).approve(address(POOL), amountToRepay);
        
        emit ArbitrageExecuted(asset, amount, profit, block.timestamp);
        
        return true;
    }
    
    /**
     * @notice Withdraw profits
     */
    function withdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
    
    /**
     * @notice Withdraw ETH
     */
    function withdrawETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    /**
     * @notice Emergency withdraw all tokens
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance > 0) {
            IERC20(token).transfer(owner, balance);
        }
    }
    
    receive() external payable {}
}
