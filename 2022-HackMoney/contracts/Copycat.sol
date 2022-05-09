//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Copycat {
    mapping(address => mapping(address => uint256)) private balances;
    mapping(address => uint256) private nWalletsCopied;
    mapping(address => mapping(uint256 => address)) private walletsToBeCopied;

    //owner to send fees to
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit(address wallet) public payable returns (uint256) {
        balances[msg.sender][wallet] += msg.value;
        return balances[msg.sender][wallet];
    }

    function withdraw(uint256 amount, address wallet) public returns (uint256) {
        require(
            amount <= balances[msg.sender][wallet],
            "Amount exceeds balance"
        );
        balances[msg.sender][wallet] -= amount;
        payable(msg.sender).transfer(amount);
        return balances[msg.sender][wallet];
    }

    function balance(address wallet) public view returns (uint256) {
        return balances[msg.sender][wallet];
    }

    function addWalletToCopyCat(address wallet) public {
        walletsToBeCopied[msg.sender][nWalletsCopied[msg.sender]] = wallet;
        nWalletsCopied[msg.sender]++;
    }

    function openPosition(address smartContractAddress, uint256 amount)
        private
    {
        //TODO
    }

    function update(address copycat) public {}

    function closePosition(address smartContractAddress)
        private
        returns (uint256)
    {
        //TODO
    }
}
