// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 THESORIA FLASHBOT - Smart Contract de Flash Loan
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ce contrat permet d'exécuter des Flash Loans via Aave V3 pour réaliser
 * des arbitrages entre différents DEX (Uniswap, Sushiswap, QuickSwap, etc.)
 * 
 * VERSION: 1.0.0
 * RÉSEAUX SUPPORTÉS: Polygon, Gnosis Chain
 * 
 * ⚠️ AVERTISSEMENT : Ce contrat comporte des risques financiers.
 *    Utilisez-le à vos propres risques. Auditez le code avant déploiement.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract FlashBot is FlashLoanSimpleReceiverBase {
    
    // ═══════════════════════════════════════════════════════════════════════
    // VARIABLES D'ÉTAT
    // ═══════════════════════════════════════════════════════════════════════
    
    address public owner;
    uint256 public totalProfits;
    uint256 public totalTransactions;
    uint256 public successfulTransactions;
    
    // Adresses des DEX Routers
    mapping(uint8 => address) public dexRouters;
    
    // ═══════════════════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════════════════
    
    event FlashLoanExecuted(
        address indexed asset,
        uint256 amount,
        uint256 premium,
        uint256 profit,
        bool success
    );
    
    event ArbitrageExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 profit,
        uint8 dex1,
        uint8 dex2
    );
    
    event ProfitWithdrawn(
        address indexed token,
        uint256 amount,
        address indexed to
    );
    
    event DexRouterUpdated(
        uint8 indexed dexId,
        address indexed routerAddress
    );
    
    // ═══════════════════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * @param _addressProvider Adresse du Aave Pool Address Provider
     * 
     * Polygon : 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb
     * Gnosis  : 0x36616cf17557639614c1cdDb356b1B83fc0B2132
     */
    constructor(address _addressProvider) 
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) 
    {
        owner = msg.sender;
        
        // Configuration des DEX Routers (Polygon par défaut)
        // Uniswap V3 Router
        dexRouters[0] = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
        // Sushiswap Router
        dexRouters[1] = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506;
        // QuickSwap Router
        dexRouters[2] = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // MODIFIERS
    // ═══════════════════════════════════════════════════════════════════════
    
    modifier onlyOwner() {
        require(msg.sender == owner, "FlashBot: Not owner");
        _;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // FONCTIONS PRINCIPALES
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * 🚀 Demander un Flash Loan
     * 
     * @param _token Adresse du token à emprunter
     * @param _amount Montant à emprunter (en unités de token)
     * @param _params Paramètres encodés pour l'arbitrage
     */
    function requestFlashLoan(
        address _token,
        uint256 _amount,
        bytes calldata _params
    ) external onlyOwner {
        address receiverAddress = address(this);
        address asset = _token;
        uint256 amount = _amount;
        bytes memory params = _params;
        uint16 referralCode = 0;
        
        totalTransactions++;
        
        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }
    
    /**
     * ⚡ Callback exécuté par Aave après réception du Flash Loan
     * 
     * Cette fonction est appelée automatiquement par Aave V3 Pool
     * après avoir reçu les fonds du Flash Loan
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "FlashBot: Caller must be POOL");
        require(initiator == address(this), "FlashBot: Invalid initiator");
        
        // Décoder les paramètres d'arbitrage
        (
            address tokenIn,
            address tokenOut,
            address[] memory path1,
            address[] memory path2,
            uint256 minProfit,
            uint8 dex1,
            uint8 dex2
        ) = abi.decode(
            params, 
            (address, address, address[], address[], uint256, uint8, uint8)
        );
        
        // Solde initial
        uint256 balanceBefore = IERC20(asset).balanceOf(address(this));
        
        bool success = false;
        uint256 profit = 0;
        
        try this.executeArbitrage(
            tokenIn,
            tokenOut,
            amount,
            path1,
            path2,
            minProfit,
            dex1,
            dex2
        ) returns (uint256 _profit) {
            profit = _profit;
            success = true;
            successfulTransactions++;
            totalProfits += profit;
        } catch {
            // L'arbitrage a échoué, on continue quand même pour rembourser
            success = false;
        }
        
        // Calculer le montant total à rembourser
        uint256 totalDebt = amount + premium;
        
        // Vérifier qu'on a assez de fonds pour rembourser
        uint256 balanceAfter = IERC20(asset).balanceOf(address(this));
        require(balanceAfter >= totalDebt, "FlashBot: Insufficient funds to repay");
        
        // Approuver Aave pour le remboursement
        IERC20(asset).approve(address(POOL), totalDebt);
        
        emit FlashLoanExecuted(asset, amount, premium, profit, success);
        
        return true;
    }
    
    /**
     * 💱 Exécuter l'arbitrage entre deux DEX
     */
    function executeArbitrage(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        address[] memory path1,
        address[] memory path2,
        uint256 minProfit,
        uint8 dex1,
        uint8 dex2
    ) external returns (uint256) {
        require(msg.sender == address(this), "FlashBot: Internal only");
        
        // Approuver le router DEX1
        IERC20(tokenIn).approve(dexRouters[dex1], amountIn);
        
        // Swap 1 : tokenIn -> tokenOut sur DEX1
        uint256[] memory amounts1 = IUniswapV2Router02(dexRouters[dex1])
            .swapExactTokensForTokens(
                amountIn,
                0, // accepter n'importe quel montant (à optimiser)
                path1,
                address(this),
                block.timestamp + 300
            );
        
        uint256 amountOut1 = amounts1[amounts1.length - 1];
        
        // Approuver le router DEX2
        IERC20(tokenOut).approve(dexRouters[dex2], amountOut1);
        
        // Swap 2 : tokenOut -> tokenIn sur DEX2
        uint256[] memory amounts2 = IUniswapV2Router02(dexRouters[dex2])
            .swapExactTokensForTokens(
                amountOut1,
                amountIn, // minimum le montant initial
                path2,
                address(this),
                block.timestamp + 300
            );
        
        uint256 amountOut2 = amounts2[amounts2.length - 1];
        
        // Calculer le profit
        require(amountOut2 > amountIn, "FlashBot: No profit");
        uint256 profit = amountOut2 - amountIn;
        require(profit >= minProfit, "FlashBot: Profit below minimum");
        
        emit ArbitrageExecuted(
            tokenIn,
            tokenOut,
            amountIn,
            amountOut2,
            profit,
            dex1,
            dex2
        );
        
        return profit;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // FONCTIONS DE GESTION
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * 💰 Retirer un token spécifique
     */
    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "FlashBot: No balance");
        
        token.transfer(owner, balance);
        emit ProfitWithdrawn(_tokenAddress, balance, owner);
    }
    
    /**
     * 💸 Retirer ETH/MATIC/xDAI
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "FlashBot: No ETH balance");
        
        payable(owner).transfer(balance);
        emit ProfitWithdrawn(address(0), balance, owner);
    }
    
    /**
     * 🔧 Mettre à jour l'adresse d'un DEX Router
     */
    function updateDexRouter(uint8 _dexId, address _routerAddress) external onlyOwner {
        require(_routerAddress != address(0), "FlashBot: Invalid router address");
        dexRouters[_dexId] = _routerAddress;
        emit DexRouterUpdated(_dexId, _routerAddress);
    }
    
    /**
     * 👑 Transférer la propriété
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "FlashBot: Invalid new owner");
        owner = _newOwner;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // FONCTIONS DE LECTURE
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * 📊 Obtenir le solde d'un token
     */
    function getBalance(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }
    
    /**
     * 📈 Obtenir les statistiques globales
     */
    function getStats() external view returns (
        uint256 _totalProfits,
        uint256 _totalTransactions,
        uint256 _successfulTransactions,
        uint256 _successRate
    ) {
        _totalProfits = totalProfits;
        _totalTransactions = totalTransactions;
        _successfulTransactions = successfulTransactions;
        
        if (_totalTransactions > 0) {
            _successRate = (_successfulTransactions * 100) / _totalTransactions;
        } else {
            _successRate = 0;
        }
    }
    
    /**
     * 🔍 Obtenir l'adresse d'un DEX Router
     */
    function getDexRouter(uint8 _dexId) external view returns (address) {
        return dexRouters[_dexId];
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // FALLBACK
    // ═══════════════════════════════════════════════════════════════════════
    
    receive() external payable {}
}
