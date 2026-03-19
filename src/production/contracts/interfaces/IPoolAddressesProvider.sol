// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IPoolAddressesProvider
 * @notice Interface pour Aave v3 PoolAddressesProvider
 */
interface IPoolAddressesProvider {
    /**
     * @notice Retourne l'adresse du Pool principal
     */
    function getPool() external view returns (address);

    /**
     * @notice Retourne l'adresse de l'ACL Manager
     */
    function getACLManager() external view returns (address);

    /**
     * @notice Retourne l'adresse du Price Oracle
     */
    function getPriceOracle() external view returns (address);

    /**
     * @notice Retourne l'adresse du Price Oracle Sentinel
     */
    function getPriceOracleSentinel() external view returns (address);
}
