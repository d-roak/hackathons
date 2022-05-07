//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CopyCat {
    mapping(address => uint256) private balances;
    mapping(address => address) private walletsToBeCopied;

    //owner to send fees to
    address private owner;

    constructor() payable {
        owner = msg.sender;
    }

    function deposit() public payable returns (uint256) {
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }

    function withdraw(uint256 amount) public returns (uint256 newBalance) {
        require(amount <= balances[msg.sender], "Amount exceeds balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        return balances[msg.sender];
    }

    function balance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function addWalletToCopyCat(address wallet) public {
        //check if client is already copying another person
        //maybe add feature to let one user deposit different amounts to copycat different wallets
        walletsToBeCopied[msg.sender] = wallet;
    }

    function openPosition(address smartContractAddress, uint256 amount) public {
        //TODO
    }

    function closePosition(address smartContractAddress, uint256 amount) public {
        //TODO
    }
}
