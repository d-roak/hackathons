//SPDX-License-Identifier: Unlicensed
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IUiPoolDataProviderV3} from "@aave/periphery-v3/contracts/misc/interfaces/IUiPoolDataProviderV3.sol";
import {WalletBalanceProvider} from "@aave/periphery-v3/contracts/misc/WalletBalanceProvider.sol";

contract CopycatAAVE {
    IPool pool;
    IUiPoolDataProviderV3 poolDataProvider;
    WalletBalanceProvider walletBalanceProvider;
    mapping(address => mapping(address => uint256)) prevBalances;
    mapping(address => mapping(address => IUiPoolDataProviderV3.UserReserveData))
        private prevUserReserves;

    function addWallet(address wallet){
        
    }

    function upkeepNeeded(address copied) public view returns (bool) {
        IPoolAddressesProvider poolProvider = pool.ADDRESSES_PROVIDER();
        IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
        // no idea what is the second return value
        uint256 u;
        (userReserveData, u) = poolDataProvider.getUserReservesData(
            poolProvider,
            copied
        );

        if (userReserveData.length == 0) {
            return false;
        }

        for (uint256 i = 0; i < userReserveData.length; i++) {
            IUiPoolDataProviderV3.UserReserveData
                memory prevUserReserveData = prevUserReserves[copied][
                    userReserveData[i].underlyingAsset
                ];
            IUiPoolDataProviderV3.UserReserveData
                memory newUserReserveData = userReserveData[i];

            bool eqScaledAToken = prevUserReserveData.scaledATokenBalance ==
                newUserReserveData.scaledATokenBalance;
            bool eqCollateralEnabled = prevUserReserveData
                .usageAsCollateralEnabledOnUser ==
                newUserReserveData.usageAsCollateralEnabledOnUser;
            bool eqVariableDebt = prevUserReserveData.scaledVariableDebt ==
                newUserReserveData.scaledVariableDebt;
            bool eqStableDebt = prevUserReserveData.principalStableDebt ==
                newUserReserveData.principalStableDebt;

            if (
                !(eqScaledAToken &&
                    eqCollateralEnabled &&
                    eqVariableDebt &&
                    eqStableDebt)
            ) {
                return true;
            }
        }

        return false;
    }

    function update(
        address copied,
        address token,
        uint256 balance
    ) public payable returns (bool) {
        IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
        // no idea what is the second return value
        uint256 u;
        (userReserveData, u) = poolDataProvider.getUserReservesData(
            pool.ADDRESSES_PROVIDER(),
            copied
        );

        if (userReserveData.length == 0) {
            return false;
        }

        IUiPoolDataProviderV3.UserReserveData
            memory prevUserReserveData = prevUserReserves[copied][token];
        IUiPoolDataProviderV3.UserReserveData memory newUserReserveData;
        for (uint256 i = 0; i < userReserveData.length; i++) {
            if (userReserveData[i].underlyingAsset == token) {
                newUserReserveData = userReserveData[i];
                break;
            }
        }

        IUiPoolDataProviderV3.UserReserveData memory walletReserveData;
        (userReserveData, u) = poolDataProvider.getUserReservesData(
            pool.ADDRESSES_PROVIDER(),
            address(this)
        );
        for (uint256 i = 0; i < userReserveData.length; i++) {
            if (userReserveData[i].underlyingAsset == token) {
                walletReserveData = userReserveData[i];
                break;
            }
        }

        if (
            prevBalances[copied][token] ==
            walletBalanceProvider.balanceOf(copied, token) &&
            prevUserReserveData.scaledATokenBalance ==
            newUserReserveData.scaledATokenBalance &&
            prevUserReserveData.usageAsCollateralEnabledOnUser ==
            newUserReserveData.usageAsCollateralEnabledOnUser &&
            prevUserReserveData.scaledVariableDebt ==
            newUserReserveData.scaledVariableDebt &&
            prevUserReserveData.principalStableDebt ==
            newUserReserveData.principalStableDebt
        ) {
            return false;
        }

        // totalCopycat = balance + walletReserveData.scaledATokenBalance;
        // totalCopied = walletBalanceProvider.balanceOf(copied, token) + newUserReserveData.scaledATokenBalance;
        if (
            walletReserveData.scaledATokenBalance /
                (balance + walletReserveData.scaledATokenBalance) >
            newUserReserveData.scaledATokenBalance /
                (walletBalanceProvider.balanceOf(copied, token) +
                    newUserReserveData.scaledATokenBalance)
        ) {
            pool.withdraw(
                token,
                walletReserveData.scaledATokenBalance -
                    (balance * newUserReserveData.scaledATokenBalance) /
                    walletBalanceProvider.balanceOf(copied, token)
            );
        } else if (
            walletReserveData.scaledATokenBalance /
                (balance + walletReserveData.scaledATokenBalance) <
            newUserReserveData.scaledATokenBalance /
                (walletBalanceProvider.balanceOf(copied, token) +
                    newUserReserveData.scaledATokenBalance)
        ) {
            pool.supply(
                token,
                (((balance + walletReserveData.scaledATokenBalance) *
                    newUserReserveData.scaledATokenBalance) /
                    (walletBalanceProvider.balanceOf(copied, token) +
                        newUserReserveData.scaledATokenBalance)) -
                    walletReserveData.scaledATokenBalance
            );
        }

        if (
            prevUserReserveData.usageAsCollateralEnabledOnUser !=
            newUserReserveData.usageAsCollateralEnabledOnUser
        ) {
            pool.setUserUseReserveAsCollateral(
                token,
                newUserReserveData.usageAsCollateralEnabledOnUser
            );
        }

        // TODO check with oracle
        // Stable: 1, Variable: 2
        if (
            prevUserReserveData.scaledVariableDebt !=
            newUserReserveData.scaledVariableDebt
        ) {
            if (
                prevUserReserveData.scaledVariableDebt >
                newUserReserveData.scaledVariableDebt
            ) {
                pool.repay(token, balance, 2, address(this));
            } else {
                pool.borrow(token, balance, 2, 0, address(this));
            }
        }
        if (
            prevUserReserveData.principalStableDebt ==
            newUserReserveData.principalStableDebt
        ) {
            if (
                prevUserReserveData.principalStableDebt >
                newUserReserveData.principalStableDebt
            ) {
                pool.repay(token, balance, 1, address(this));
            } else {
                pool.borrow(token, balance, 1, 0, address(this));
            }
        }

        prevUserReserveData = newUserReserveData;
        return true;
    }
}
