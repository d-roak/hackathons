//SPDX-License-Identifier: Unlicensed
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IUiPoolDataProviderV3} from '@aave/periphery-v3/contracts/misc/interfaces/IUiPoolDataProviderV3.sol';
import {WalletBalanceProvider} from "@aave/periphery-v3/contracts/misc/WalletBalanceProvider.sol";

contract CopycatAAVE {
	IPool pool;
	IUiPoolDataProviderV3 poolDataProvider;
	WalletBalanceProvider walletBalanceProvider;
	mapping(address => mapping(address => IUiPoolDataProviderV3.UserReserveData)) private prevUserReserves;

	constructor() {}

	function update(address copied, address token, uint256 available)
			public
			payable
			returns (bool)
	{
		IPoolAddressesProvider poolProvider = pool.ADDRESSES_PROVIDER();
		IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
		// no idea what is the second return value
		uint256 u;
		(userReserveData, u) = poolDataProvider.getUserReservesData(poolProvider, copied);

		if (userReserveData.length == 0) {
			return false;
		}

		IUiPoolDataProviderV3.UserReserveData memory prevUserReserveData = prevUserReserves[copied][token];
		IUiPoolDataProviderV3.UserReserveData memory newUserReserveData;
		for (uint256 i = 0; i < userReserveData.length; i++) {
			if (userReserveData[i].underlyingAsset == token) {
				newUserReserveData = userReserveData[i];
				break;
			}
		}

		bool eqScaledAToken = prevUserReserveData.scaledATokenBalance == newUserReserveData.scaledATokenBalance;
		bool eqCollateralEnabled = prevUserReserveData.usageAsCollateralEnabledOnUser == newUserReserveData.usageAsCollateralEnabledOnUser;
		bool eqVariableDebt = prevUserReserveData.scaledVariableDebt == newUserReserveData.scaledVariableDebt;
		bool eqStableDebt = prevUserReserveData.principalStableDebt == newUserReserveData.principalStableDebt;
		
		if(eqScaledAToken && eqCollateralEnabled && eqVariableDebt && eqStableDebt) {
			return false;
		}

		// TODO calculate amounts
		uint256 totalCopycat = available + 1;
		uint256 totalCopied = walletBalanceProvider.balanceOf(copied, token);
		// + newUserReserveData.scaledATokenBalance;

		if(!eqScaledAToken) {
			if (prevUserReserveData.scaledATokenBalance > newUserReserveData.scaledATokenBalance) {
				pool.withdraw(token, available, msg.sender);
			} else {
				pool.supply(token, available, msg.sender, 0);
			}
		}
		if(!eqCollateralEnabled) {
			pool.setUserUseReserveAsCollateral(token, newUserReserveData.usageAsCollateralEnabledOnUser);
		}

		// Stable: 1, Variable: 2
		if(!eqVariableDebt) {
			if (prevUserReserveData.scaledVariableDebt > newUserReserveData.scaledVariableDebt) {
				pool.repay(token, available, 2, msg.sender);
			} else {
				pool.borrow(token, available, 2, 0, msg.sender);
			}
		}
		if(!eqStableDebt) {
			if (prevUserReserveData.principalStableDebt > newUserReserveData.principalStableDebt) {
				pool.repay(token, available, 1, msg.sender);
			} else {
				pool.borrow(token, available, 1, 0, msg.sender);
			}
		}

		prevUserReserves[copied][token] = newUserReserveData;
		return true;
	}
}
