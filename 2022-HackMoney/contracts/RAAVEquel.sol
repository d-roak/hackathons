//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ILendingPool} from "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";

contract RAAVEquel {
    /**
    AAVE protocol
    */

    constructor() {}

    function deposit() public {
        LendingPoolAddressesProvider provider = LendingPoolAddressesProvider(
            address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8)
        ); //mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        LendingPool lendingPool = LendingPool(provider.getLendingPool());

        // Input variables
        address daiAddress = address(
            0x6B175474E89094C44Da98b954EedeAC495271d0F
        ); // mainnet DAI
        uint256 amount = 1000 * 1e18;
        uint16 referral = 0;

        // Approve LendingPool contract to move your DAI
        IERC20(daiAddress).approve(provider.getLendingPoolCore(), amount);

        // Deposit 1000 DAI
        lendingPool.deposit(daiAddress, amount, referral);
    }

    function setUserUseReserveAsCollateral() public {
        /// Retrieve LendingPoolAddress
        LendingPoolAddressesProvider provider = LendingPoolAddressesProvider(
            address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8)
        ); // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        LendingPool lendingPool = LendingPool(provider.getLendingPool());

        /// Input variables
        address daiAddress = address(
            0x6B175474E89094C44Da98b954EedeAC495271d0F
        ); // mainnet DAI
        bool useAsCollateral = true;

        /// setUserUseReserveAsCollateral method call
        lendingPool.setUserUseReserveAsCollateral(daiAddress, useAsCollateral);
    }

    function borrow() public {
        /// Retrieve LendingPool address
        LendingPoolAddressesProvider provider = LendingPoolAddressesProvider(
            address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8)
        ); // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        LendingPool lendingPool = LendingPool(provider.getLendingPool());

        /// Input variables
        address daiAddress = address(
            0x6B175474E89094C44Da98b954EedeAC495271d0F
        ); // mainnet DAI
        uint256 amount = 1000 * 1e18;

        /// 1 is stable rate, 2 is variable rate
        uint256 variableRate = 2;
        uint256 referral = 0;

        /// Borrow method call
        lendingPool.borrow(daiAddress, amount, variableRate, referral);
    }

    function repay() public {
        /// Retrieve LendingPool address
        LendingPoolAddressesProvider provider = LendingPoolAddressesProvider(
            address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8)
        ); // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        LendingPool lendingPool = LendingPool(provider.getLendingPool());

        /// Input variables
        address daiAddress = address(
            0x6B175474E89094C44Da98b954EedeAC495271d0F
        ); // mainnet DAI
        uint256 amount = 1000 * 1e18;

        /// If repaying own loan
        lendingPool.repay(daiAddress, amount, msg.sender);

        /** 
        /// If repaying on behalf of someone else
        address userAddress = //users_address;
        IERC20(daiAddress).approve(provider.getLendingPoolCore(), amount); // Approve LendingPool contract
        lendingPool.repay(daiAddres, amount, userAddress);
        */
    }

    function swapBorrowRateModel() public {
        /// Retrieve the LendingPool address
        LendingPoolAddressesProvider provider = LendingPoolAddressesProvider(
            address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8)
        ); // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        LendingPool lendingPool = LendingPool(provider.getLendingPool());

        /// Input variables
        address daiAddress = address(
            0x6B175474E89094C44Da98b954EedeAC495271d0F
        ); // mainnet DAI

        /// swapBorrowRateMode method call
        lendingPool.swapBorrowRateMode(daiAddress);
    }

    function rebalanceStableBorrowRate() public {
        /// Retrieve the LendingPool address
        LendingPoolAddressesProvider provider = LendingPoolAddressesProvider(
            address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8)
        ); // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        LendingPool lendingPool = LendingPool(provider.getLendingPool());

        /// Input variables
        address daiAddress = address(
            0x6B175474E89094C44Da98b954EedeAC495271d0F
        ); // mainnet DAI

        /// swapBorrowRateMode method call
        lendingPool.swapBorrowRateMode(daiAddress);
    }
}
