//SPDX-License-Identifier: Unlicensed
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IAaveOracle} from "@aave/core-v3/contracts/interfaces/IAaveOracle.sol";
import {IUiPoolDataProviderV3} from "@aave/periphery-v3/contracts/misc/interfaces/IUiPoolDataProviderV3.sol";
import {WalletBalanceProvider} from "@aave/periphery-v3/contracts/misc/WalletBalanceProvider.sol";

contract CopycatAAVE {
    IPool pool;
    IUiPoolDataProviderV3 poolDataProvider;
    WalletBalanceProvider walletBalanceProvider;
    mapping(address => mapping(address => uint256)) prevBalances;
    mapping(address => mapping(address => IUiPoolDataProviderV3.UserReserveData))
        private prevUserReserves;

		constructor() {
			pool = IPool(0x1758d4e6f68166C4B2d9d0F049F33dEB399Daa1F);
			poolDataProvider = IUiPoolDataProviderV3(0x94E9E8876Fd68574f17B2cd7Fa19AA8342fFaF51);
			walletBalanceProvider = WalletBalanceProvider(payable(0x78baC31Ed73c115EB7067d1AfE75eC7B4e16Df9e));
		}

		function addWallet(address copied, address token, uint256 amount) public {
			require(prevBalances[copied][token] <= 0, "CopycatAAVE.addWallet: You are already following this wallet");

			IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
			// no idea what is the second return value
			uint256 u;
			(userReserveData, u) = poolDataProvider.getUserReservesData(
					pool.ADDRESSES_PROVIDER(),
					copied
			);

			if (userReserveData.length == 0) {
				prevUserReserves[copied][token] = IUiPoolDataProviderV3.UserReserveData(token, 0, false, 0, 0, 0, 0);
			} else {
				for (uint256 i = 0; i < userReserveData.length; i++) {
					if (userReserveData[i].underlyingAsset == token) {
						prevUserReserves[copied][token] = userReserveData[i];
						if(userReserveData[i].scaledATokenBalance >0) {
							pool.supply(
								token,
								(amount * userReserveData[i].scaledATokenBalance) / (walletBalanceProvider.balanceOf(copied, token) + userReserveData[i].scaledATokenBalance),
								address(this), 0);
							pool.setUserUseReserveAsCollateral(token, userReserveData[i].usageAsCollateralEnabledOnUser);
						}
						break;
					}
				}
			}
			
			prevBalances[copied][token] = walletBalanceProvider.balanceOf(copied, token);
		}

    function upkeepNeeded(address copied) public view returns (bool, address) {
        IPoolAddressesProvider poolProvider = pool.ADDRESSES_PROVIDER();
        IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
        // no idea what is the second return value
        uint256 u;
        (userReserveData, u) = poolDataProvider.getUserReservesData(
            poolProvider,
            copied
        );

        if (userReserveData.length == 0) {
            return (false, address(0));
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
                return (true, userReserveData[i].underlyingAsset);
            }
        }

        return (false, address(0));
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
                    walletBalanceProvider.balanceOf(copied, token), address(this)
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
                    walletReserveData.scaledATokenBalance, address(this), 0
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

        // Stable: 1, Variable: 2
				uint256 newPos = (getCurrentVariableBorrowPrice(address(this), token) - (getCurrentVariableBorrowPrice(copied, token) * getTotalCollateralPrice(address(this)) / getTotalCollateralPrice(copied)))
					* getCurrentVariableBorrow(address(this), token)
					/ getCurrentVariableBorrowPrice(address(this), token);

				if (
						walletReserveData.scaledVariableDebt >
						newPos
				) {
						pool.repay(token, walletReserveData.scaledVariableDebt - newPos, 2, address(this));
				} else if (
						walletReserveData.scaledVariableDebt <
						newPos
				) {
						pool.borrow(token, newPos - walletReserveData.scaledVariableDebt, 2, 0, address(this));
				}

				newPos = (getCurrentStableBorrowPrice(address(this), token) - (getCurrentStableBorrowPrice(copied, token) * getTotalCollateralPrice(address(this)) / getTotalCollateralPrice(copied)))
					* getCurrentStableBorrow(address(this), token)
					/ getCurrentStableBorrowPrice(address(this), token);

				if (
						walletReserveData.principalStableDebt >
						newPos
				) {
						pool.repay(token, walletReserveData.principalStableDebt - newPos, 1, address(this));
				} else if (
						walletReserveData.principalStableDebt <
						newPos
				) {
						pool.borrow(token, newPos - walletReserveData.principalStableDebt, 1, 0, address(this));
				}

				prevBalances[copied][token] = walletBalanceProvider.balanceOf(copied, token);
				prevUserReserves[copied][token] = newUserReserveData;
        return true;
    }

		function getTotalCollateralPrice(address addr) private view returns (uint256) {
			IAaveOracle oracle = IAaveOracle(0x520D14AE678b41067f029Ad770E2870F85E76588);

			uint256 total = 0;
			IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
			// no idea what is the second return value
			uint256 u;
			(userReserveData, u) = poolDataProvider.getUserReservesData(
					pool.ADDRESSES_PROVIDER(),
					addr
			);

			for (uint256 i = 0; i < userReserveData.length; i++) {
					if (userReserveData[i].usageAsCollateralEnabledOnUser) {
							total += oracle.getAssetPrice(userReserveData[i].underlyingAsset) * userReserveData[i].scaledATokenBalance;
					}
			}
			return total;
		}

		function getCurrentStableBorrow(address addr,  address token) private view returns (uint256) {
			IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
			// no idea what is the second return value
			uint256 u;
			(userReserveData, u) = poolDataProvider.getUserReservesData(
					pool.ADDRESSES_PROVIDER(),
					addr
			);

			for (uint256 i = 0; i < userReserveData.length; i++) {
					if (userReserveData[i].usageAsCollateralEnabledOnUser) {
						if (userReserveData[i].underlyingAsset == token) {
							return userReserveData[i].principalStableDebt;
						}
					}
			}
			return 0;
		}

		function getCurrentStableBorrowPrice(address addr, address token) private view returns (uint256) {
			IAaveOracle oracle = IAaveOracle(0x520D14AE678b41067f029Ad770E2870F85E76588);

			IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
			// no idea what is the second return value
			uint256 u;
			(userReserveData, u) = poolDataProvider.getUserReservesData(
					pool.ADDRESSES_PROVIDER(),
					addr
			);

			for (uint256 i = 0; i < userReserveData.length; i++) {
					if (userReserveData[i].usageAsCollateralEnabledOnUser) {
						if (userReserveData[i].underlyingAsset == token) {
							return oracle.getAssetPrice(userReserveData[i].underlyingAsset) * userReserveData[i].principalStableDebt;
						}
					}
			}
			return 0;
		}

		function getCurrentVariableBorrow(address addr,  address token) private view returns (uint256) {
			IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
			// no idea what is the second return value
			uint256 u;
			(userReserveData, u) = poolDataProvider.getUserReservesData(
					pool.ADDRESSES_PROVIDER(),
					addr
			);

			for (uint256 i = 0; i < userReserveData.length; i++) {
					if (userReserveData[i].usageAsCollateralEnabledOnUser) {
						if (userReserveData[i].underlyingAsset == token) {
							return userReserveData[i].scaledVariableDebt;
						}
					}
			}
			return 0;
		}

		function getCurrentVariableBorrowPrice(address addr, address token) private view returns (uint256) {
			IAaveOracle oracle = IAaveOracle(0x520D14AE678b41067f029Ad770E2870F85E76588);

			IUiPoolDataProviderV3.UserReserveData[] memory userReserveData;
			// no idea what is the second return value
			uint256 u;
			(userReserveData, u) = poolDataProvider.getUserReservesData(
					pool.ADDRESSES_PROVIDER(),
					addr
			);

			for (uint256 i = 0; i < userReserveData.length; i++) {
					if (userReserveData[i].usageAsCollateralEnabledOnUser) {
						if (userReserveData[i].underlyingAsset == token) {
							return oracle.getAssetPrice(userReserveData[i].underlyingAsset) * userReserveData[i].scaledVariableDebt;
						}
					}
			}
			return 0;
		}
}
