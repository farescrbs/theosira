// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * @title IPool
 * @author Aave
 * @notice Defines the basic interface for an Aave Pool.
 */
interface IPool {
  /**
   * @notice Allows smartcontracts to access the liquidity of the pool within one transaction,
   * as long as the amount taken plus a fee is returned.
   * @dev IMPORTANT There are security concerns for developers of flashloan receiver contracts that must be kept
   * into consideration. For further details please visit https://docs.aave.com/developers/
   * @param receiverAddress The address of the contract receiving the funds, implementing IFlashLoanReceiver interface
   * @param assets The addresses of the assets being flash-borrowed
   * @param amounts The amounts of the assets being flash-borrowed
   * @param interestRateModes Types of the debt to open if the flash loan is not returned:
   *   0 -> Don't open any debt, just revert if funds can't be transferred from the receiver
   *   1 -> Open debt at stable rate for the value of the amount flash-borrowed to the `onBehalfOf` address
   *   2 -> Open debt at variable rate for the value of the amount flash-borrowed to the `onBehalfOf` address
   * @param onBehalfOf The address  that will receive the debt in the case of using on `modes` 1 or 2
   * @param params Variadic packed params to pass to the receiver as extra information
   * @param referralCode The code used to register the integrator originating the operation, for potential rewards.
   *   0 if the action is executed directly by the user, without any middle-man
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
   * @notice Allows smartcontracts to access the liquidity of the pool within one transaction,
   * as long as the amount taken plus a fee is returned.
   * @dev IMPORTANT There are security concerns for developers of flashloan receiver contracts that must be kept
   * into consideration. For further details please visit https://docs.aave.com/developers/
   * @param receiverAddress The address of the contract receiving the funds, implementing IFlashLoanSimpleReceiver interface
   * @param asset The address of the asset being flash-borrowed
   * @param amount The amount of the asset being flash-borrowed
   * @param params Variadic packed params to pass to the receiver as extra information
   * @param referralCode The code used to register the integrator originating the operation, for potential rewards.
   *   0 if the action is executed directly by the user, without any middle-man
   */
  function flashLoanSimple(
    address receiverAddress,
    address asset,
    uint256 amount,
    bytes calldata params,
    uint16 referralCode
  ) external;

  /**
   * @notice Returns the normalized income per unit of asset
   * @param asset The address of the underlying asset
   * @return The reserve's normalized income
   */
  function getReserveNormalizedIncome(address asset) external view returns (uint256);

  /**
   * @notice Returns the normalized variable debt per unit of asset
   * @param asset The address of the underlying asset
   * @return The reserve normalized variable debt
   */
  function getReserveNormalizedVariableDebt(address asset) external view returns (uint256);

  /**
   * @notice Returns the state and configuration of the reserve
   * @param asset The address of the underlying asset of the reserve
   * @return The state and configuration data of the reserve
   */
  function getReserveData(address asset) external view returns (ReserveData memory);
}

struct ReserveData {
  //stores the reserve configuration
  ReserveConfigurationMap configuration;
  //the liquidity index. Expressed in ray
  uint128 liquidityIndex;
  //the current supply rate. Expressed in ray
  uint128 currentLiquidityRate;
  //variable borrow index. Expressed in ray
  uint128 variableBorrowIndex;
  //the current variable borrow rate. Expressed in ray
  uint128 currentVariableBorrowRate;
  //the current stable borrow rate. Expressed in ray
  uint128 currentStableBorrowRate;
  //timestamp of last update
  uint40 lastUpdateTimestamp;
  //the id of the reserve. Represents the position in the list of the active reserves
  uint16 id;
  //aToken address
  address aTokenAddress;
  //stableDebtToken address
  address stableDebtTokenAddress;
  //variableDebtToken address
  address variableDebtTokenAddress;
  //address of the interest rate strategy
  address interestRateStrategyAddress;
  //the current treasury balance, scaled
  uint128 accruedToTreasury;
  //the outstanding unbacked aTokens minted through the bridging feature
  uint128 unbacked;
  //the outstanding debt borrowed against this asset in isolation mode
  uint128 isolationModeTotalDebt;
}

struct ReserveConfigurationMap {
  //bit 0-15: LTV
  //bit 16-31: Liq. threshold
  //bit 32-47: Liq. bonus
  //bit 48-55: Decimals
  //bit 56: reserve is active
  //bit 57: reserve is frozen
  //bit 58: borrowing is enabled
  //bit 59: stable rate borrowing enabled
  //bit 60: asset is paused
  //bit 61: borrowing in isolation mode is enabled
  //bit 62-63: reserved
  //bit 64-79: reserve factor
  //bit 80-115 borrow cap in whole tokens, borrowCap == 0 => no cap
  //bit 116-151 supply cap in whole tokens, supplyCap == 0 => no cap
  //bit 152-167 liquidation protocol fee
  //bit 168-175 eMode category
  //bit 176-211 unbacked mint cap in whole tokens, unbackedMintCap == 0 => minting disabled
  //bit 212-251 debt ceiling for isolation mode with (ReserveConfiguration::DEBT_CEILING_DECIMALS) decimals
  //bit 252-255 unused

  uint256 data;
}
