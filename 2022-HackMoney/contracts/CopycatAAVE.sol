//SPDX-License-Identifier: Unlicensed
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider, UserReserveData} from '@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol';

contract CopycatAAVE {
    IPool pool;
		IPoolAddressesProvider poolAddressesProvider;
		mapping(address => mapping(address => mapping(address => uint256))) private prevTokenBalance;

    constructor() {}

    function update(address copycat, address wallet, address token, uint256 amount)
        public
        view
        returns (bool)
    {
			uint256 prevBalance = prevTokenBalance[copycat][wallet][token];
			// provider and address
			address poolProvider = 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb;
			IUserReserveData[] userReserveData = poolAddressesProvider.getUserReservesData(provider, wallet);

		}

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) public {
        pool.withdraw(asset, amount, to);
    }

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint16 referralCode,
        address onBehalfOf
    ) public {
        pool.borrow(asset, amount, interestRateMode, referralCode, onBehalfOf);
    }

    function repay(
        address asset,
        uint256 amount,
        uint256 rateMode,
        address onBehalfOf
    ) public {
        pool.repay(asset, amount, rateMode, onBehalfOf);
    }

    function repayWithATokens(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) public {
        pool.repayWithATokens(asset, amount, interestRateMode);
    }

    function swapBorrowRateMode(address asset, uint256 rateMode) public {
        pool.swapBorrowRateMode(asset, rateMode);
    }

    function rebalanceStableBorrowRate(address asset, address user) public {
        pool.rebalanceStableBorrowRate(asset, user);
    }

    function setUserUseReserveAsCollateral(address asset, bool useAsCollateral) public
    {
        pool.setUserUseReserveAsCollateral(asset, useAsCollateral);
    }
}
