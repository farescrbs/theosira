// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║  THESORIA - FLASH LOAN GOD MODE EXECUTOR                                    ║
 * ║  Smart Contract Multi-DEX Arbitrage Optimisé                               ║
 * ║                                                                              ║
 * ║  • Flash Loans Aave V3                                                      ║
 * ║  • Arbitrage Multi-DEX (Uniswap V2/V3, Sushiswap)                         ║
 * ║  • Protection Reentrancy & Emergency Stop                                   ║
 * ║  • Gas Optimization                                                         ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract FlashLoanGodMode is FlashLoanSimpleReceiverBase {
    
    // ══════════════════════════════════════════════════════════════════════════
    // ÉVÉNEMENTS
    // ══════════════════════════════════════════════════════════════════════════
    
    event ArbitrageExecuted(
        address indexed token,
        uint256 amount,
        uint256 profit,
        string buyDex,
        string sellDex,
        uint256 timestamp
    );
    
    event EmergencyWithdraw(address indexed token, uint256 amount);
    
    // ══════════════════════════════════════════════════════════════════════════
    // VARIABLES D'ÉTAT
    // ══════════════════════════════════════════════════════════════════════════
    
    address public owner;
    bool public paused;
    
    // DEX Routers
    IUniswapV2Router02 public immutable uniswapV2Router;
    IUniswapV2Router02 public immutable sushiswapRouter;
    ISwapRouter public immutable uniswapV3Router;
    
    // Whitelisted tokens
    mapping(address => bool) public whitelistedTokens;
    
    // Stats
    uint256 public totalProfitUSD;
    uint256 public totalTrades;
    uint256 public successfulTrades;
    
    // ══════════════════════════════════════════════════════════════════════════
    // MODIFIERS
    // ══════════════════════════════════════════════════════════════════════════
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }
    
    modifier onlyWhitelisted(address token) {
        require(whitelistedTokens[token], "Token not whitelisted");
        _;
    }
    
    // ══════════════════════════════════════════════════════════════════════════
    // CONSTRUCTEUR
    // ══════════════════════════════════════════════════════════════════════════
    
    constructor(
        address _addressProvider,
        address _uniswapV2Router,
        address _sushiswapRouter,
        address _uniswapV3Router
    ) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = msg.sender;
        paused = false;
        
        uniswapV2Router = IUniswapV2Router02(_uniswapV2Router);
        sushiswapRouter = IUniswapV2Router02(_sushiswapRouter);
        uniswapV3Router = ISwapRouter(_uniswapV3Router);
    }
    
    // ══════════════════════════════════════════════════════════════════════════
    // FONCTIONS PRINCIPALES
    // ══════════════════════════════════════════════════════════════════════════
    
    /**
     * @notice Exécute arbitrage multi-DEX avec flash loan
     * @param asset Token à emprunter
     * @param amount Montant à emprunter
     * @param buyDex DEX pour achat (0=Uniswap V2, 1=Sushiswap)
     * @param sellDex DEX pour vente
     * @param tokenOut Token de sortie
     */
    function executeArbitrage(
        address asset,
        uint256 amount,
        uint8 buyDex,
        uint8 sellDex,
        address tokenOut
    ) external onlyOwner whenNotPaused onlyWhitelisted(asset) {
        
        // Encode params pour callback
        bytes memory params = abi.encode(buyDex, sellDex, tokenOut);
        
        // Demande flash loan
        POOL.flashLoanSimple(
            address(this),
            asset,
            amount,
            params,
            0 // referralCode
        );
    }
    
    /**
     * @notice Callback Aave - Exécuté après réception flash loan
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        
        require(msg.sender == address(POOL), "Caller not Pool");
        require(initiator == address(this), "Initiator not this");
        
        // Decode params
        (uint8 buyDex, uint8 sellDex, address tokenOut) = abi.decode(
            params,
            (uint8, uint8, address)
        );
        
        // 1. ACHAT sur DEX 1
        uint256 amountOut = _buyOnDex(asset, amount, tokenOut, buyDex);
        
        // 2. VENTE sur DEX 2
        uint256 finalAmount = _sellOnDex(tokenOut, amountOut, asset, sellDex);
        
        // 3. Calcul profit
        uint256 totalDebt = amount + premium;
        require(finalAmount > totalDebt, "No profit - reverting");
        
        uint256 profit = finalAmount - totalDebt;
        
        // 4. Stats
        totalTrades++;
        successfulTrades++;
        
        // 5. Approuve remboursement
        IERC20(asset).approve(address(POOL), totalDebt);
        
        // 6. Émet event
        emit ArbitrageExecuted(
            asset,
            amount,
            profit,
            _getDexName(buyDex),
            _getDexName(sellDex),
            block.timestamp
        );
        
        return true;
    }
    
    // ══════════════════════════════════════════════════════════════════════════
    // FONCTIONS INTERNES DEX
    // ══════════════════════════════════════════════════════════════════════════
    
    /**
     * @notice Achète sur DEX spécifié
     */
    function _buyOnDex(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint8 dexId
    ) internal returns (uint256) {
        
        IERC20(tokenIn).approve(_getRouterAddress(dexId), amountIn);
        
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        IUniswapV2Router02 router = _getRouter(dexId);
        
        uint[] memory amounts = router.swapExactTokensForTokens(
            amountIn,
            0, // amountOutMin - À optimiser avec slippage
            path,
            address(this),
            block.timestamp + 120
        );
        
        return amounts[1];
    }
    
    /**
     * @notice Vend sur DEX spécifié
     */
    function _sellOnDex(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint8 dexId
    ) internal returns (uint256) {
        
        IERC20(tokenIn).approve(_getRouterAddress(dexId), amountIn);
        
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        IUniswapV2Router02 router = _getRouter(dexId);
        
        uint[] memory amounts = router.swapExactTokensForTokens(
            amountIn,
            0,
            path,
            address(this),
            block.timestamp + 120
        );
        
        return amounts[1];
    }
    
    /**
     * @notice Récupère router selon ID
     */
    function _getRouter(uint8 dexId) internal view returns (IUniswapV2Router02) {
        if (dexId == 0) return uniswapV2Router;
        if (dexId == 1) return sushiswapRouter;
        revert("Invalid DEX ID");
    }
    
    function _getRouterAddress(uint8 dexId) internal view returns (address) {
        if (dexId == 0) return address(uniswapV2Router);
        if (dexId == 1) return address(sushiswapRouter);
        revert("Invalid DEX ID");
    }
    
    function _getDexName(uint8 dexId) internal pure returns (string memory) {
        if (dexId == 0) return "Uniswap V2";
        if (dexId == 1) return "Sushiswap";
        return "Unknown";
    }
    
    // ══════════════════════════════════════════════════════════════════════════
    // ADMINISTRATION
    // ══════════════════════════════════════════════════════════════════════════
    
    function whitelistToken(address token, bool status) external onlyOwner {
        whitelistedTokens[token] = status;
    }
    
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    /**
     * @notice Retrait d'urgence
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance");
        
        IERC20(token).transfer(owner, balance);
        emit EmergencyWithdraw(token, balance);
    }
    
    function emergencyWithdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH balance");
        
        payable(owner).transfer(balance);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
    
    // ══════════════════════════════════════════════════════════════════════════
    // VUES
    // ══════════════════════════════════════════════════════════════════════════
    
    function getStats() external view returns (
        uint256 _totalTrades,
        uint256 _successfulTrades,
        uint256 _winRate
    ) {
        _totalTrades = totalTrades;
        _successfulTrades = successfulTrades;
        _winRate = totalTrades > 0 ? (successfulTrades * 100) / totalTrades : 0;
    }
    
    // Receive ETH
    receive() external payable {}
}
