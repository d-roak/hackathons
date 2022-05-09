//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WalletTransactions {

    uint nStaking;
    mapping(uint=>address) staking;
    uint nBorrows;
    mapping(uint=>address[]) borrowing;
    uint nLendings;
    mapping(uint=>address[]) lendings;

    constructor(){

    }

    function checkPosition() public {

    }

    function updatePosition() public{

    }


}