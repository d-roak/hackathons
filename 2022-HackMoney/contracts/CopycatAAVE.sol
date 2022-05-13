//SPDX-License-Identifier: Unlicensed
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";

contract CopycatAAVE {
    IPool pool;

    constructor() {}

    function update(address copycat, address wallet) public {}

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) {
        pool.withdraw(asset, amount, to);
    }

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint16 referralCode,
        address onBehalfOf
    ) {
        pool.borrow(asset, amount, interestRateMode, referralCode, onBehalfOf);
    }

    function repay(
        address asset,
        uint256 amount,
        uint256 rateMode,
        address onBehalfOf
    ) {
        pool.repay(asset, amount, rateMode, onBehalfOf);
    }

    function repayWithATokens(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) {
        pool.repayWithATokens(asset, amount, interestRateMode);
    }

    function swapBorrowRateMode(address asset, uint256 rateMode) {
        pool.swapBorrowRateMode(asset, rateMode);
    }

    function rebalanceStableBorrowRate(address asset, address user) {
        pool.rebalanceStableBorrowRate(asset, user);
    }

    function setUserUseReserveAsCollateral(address asset, bool useAsCollateral)
    {
        pool.setUserUseReserveAsCollateral(asset, useAsCollateral);
    }
}
