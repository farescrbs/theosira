// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IPool
 * @notice Interface principale pour Aave v3 Pool
 */
interface IPool {
    /**
     * @notice Exécute un flash loan
     * @param receiverAddress L'adresse du contrat receveur
     * @param assets Les assets à emprunter
     * @param amounts Les montants à emprunter
     * @param interestRateModes Les modes de taux d'intérêt
     * @param onBehalfOf L'adresse pour qui le debt sera créé
     * @param params Paramètres additionnels
     * @param referralCode Code de référence
     */
    function flashLoan(
        address receiverAddress,
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata interestRateModes,
        address onBehalfOf,
        bytes calldata params,
        uint16 referralCode
    ) external;

    /**
     * @notice Flash loan simple (un seul asset)
     */
    function flashLoanSimple(
        address receiverAddress,
        address asset,
        uint256 amount,
        bytes calldata params,
        uint16 referralCode
    ) external;

    /**
     * @notice Retourne l'adresse de l'aToken pour un asset
     */
    function getReserveAToken(address asset) external view returns (address);

    /**
     * @notice Retourne le virtual underlying balance
     */
    function getVirtualUnderlyingBalance(address asset) external view returns (uint256);
}
