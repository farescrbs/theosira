// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IERC20} from "./interfaces/IERC20.sol";
import {IPoolAddressesProvider} from "./interfaces/IPoolAddressesProvider.sol";
import {IPool} from "./interfaces/IPool.sol";

/**
 * @title AaveFlashLoanReceiver
 * @author THESORIA
 * @notice Flash loan receiver compatible avec Aave v3 pour THESORIA
 */
abstract contract AaveFlashLoanReceiver {
    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    IPool public immutable POOL;

    constructor(IPoolAddressesProvider provider) {
        ADDRESSES_PROVIDER = provider;
        POOL = IPool(provider.getPool());
    }

    /**
     * @notice Exécute l'opération après avoir reçu les fonds du flash loan
     * @param assets Les adresses des assets empruntés
     * @param amounts Les montants empruntés
     * @param premiums Les frais à payer
     * @param initiator L'adresse qui a initié le flash loan
     * @param params Paramètres encodés
     * @return True si succès
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external virtual returns (bool);
}

/**
 * @title ThesoriaFlashLoanExecutor
 * @notice Implémentation concrète pour exécuter des stratégies MEV avec flash loans Aave
 */
contract ThesoriaFlashLoanExecutor is AaveFlashLoanReceiver {
    address public immutable OWNER;
    
    event FlashLoanExecuted(
        address indexed asset,
        uint256 amount,
        uint256 premium,
        uint256 profit
    );

    modifier onlyOwner() {
        require(msg.sender == OWNER, "Not owner");
        _;
    }

    modifier onlyPool() {
        require(msg.sender == address(POOL), "Not pool");
        _;
    }

    constructor(IPoolAddressesProvider provider) AaveFlashLoanReceiver(provider) {
        OWNER = msg.sender;
    }

    /**
     * @notice Exécute la stratégie MEV avec les fonds du flash loan
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override onlyPool returns (bool) {
        require(initiator == OWNER, "Untrusted initiator");

        // Décoder les paramètres
        (
            address[] memory targets,
            bytes[] memory calldatas
        ) = abi.decode(params, (address[], bytes[]));

        // Exécuter la stratégie MEV
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, ) = targets[i].call(calldatas[i]);
            require(success, "Strategy call failed");
        }

        // Approuver le remboursement au pool
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwed = amounts[i] + premiums[i];
            IERC20(assets[i]).approve(address(POOL), amountOwed);
            
            emit FlashLoanExecuted(
                assets[i],
                amounts[i],
                premiums[i],
                0 // profit calculé après
            );
        }

        return true;
    }

    /**
     * @notice Lance un flash loan pour exécuter une stratégie
     */
    function requestFlashLoan(
        address[] calldata assets,
        uint256[] calldata amounts,
        address[] calldata targets,
        bytes[] calldata calldatas
    ) external onlyOwner {
        bytes memory params = abi.encode(targets, calldatas);
        
        uint256[] memory modes = new uint256[](assets.length);
        // Mode 0 = repay flash loan
        
        POOL.flashLoan(
            address(this),
            assets,
            amounts,
            modes,
            address(this),
            params,
            0
        );
    }

    /**
     * @notice Retire les profits accumulés
     */
    function withdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(OWNER, amount);
    }

    /**
     * @notice Fonction de secours pour retirer tout
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance > 0) {
            IERC20(token).transfer(OWNER, balance);
        }
    }
}
