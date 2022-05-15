//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./CopycatAAVE.sol";
import "./CopycatUniswap.sol";

contract Copycat is KeeperCompatibleInterface {
    CopycatUniswap uniswap;
    CopycatAAVE aave;
    // no floats 0.3% = 0.0003 = 3 * 10^-5 = 3 / 10^5
    uint256 private fee = 3;
    address[] private copycats;
    mapping(address => mapping(address => uint256)) feeBalances;
    mapping(address => mapping(address => uint256)) private balances;
    mapping(address => address[]) private walletsToBeCopied;

    constructor() {}

    function deposit(address wallet) public payable returns (uint256) {
        balances[msg.sender][wallet] += msg.value;
        return balances[msg.sender][wallet];
    }

    function depositFee(address wallet) public payable returns (uint256) {
        feeBalances[msg.sender][wallet] += msg.value;
        return feeBalances[msg.sender][wallet];
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

    function withdrawFee(uint256 amount, address wallet)
        public
        returns (uint256)
    {
        require(
            amount <= feeBalances[msg.sender][wallet],
            "Amount exceeds balance"
        );
        feeBalances[msg.sender][wallet] -= amount;
        payable(msg.sender).transfer(amount);
        return feeBalances[msg.sender][wallet];
    }

    function balance(address wallet) public view returns (uint256) {
        return balances[msg.sender][wallet];
    }

    function feeBalance(address wallet) public view returns (uint256) {
        return feeBalances[msg.sender][wallet];
    }

    function addWalletToCopycat(address wallet) public {
        walletsToBeCopied[msg.sender].push(wallet);
    }

    function getAddressesBeingCopied() public view returns (address[] memory) {
        return walletsToBeCopied[msg.sender];
    }

    function updateAave(
        address copycat,
        address wallet,
        address token
    ) public view returns (bool success){
        bool found = false;
        //TODO do this with mapping
        for (uint256 i = 0; i < walletsToBeCopied[copycat].length; i++) {
            if (walletsToBeCopied[copycat][i] == wallet) {
                found = true;
                break;
            }
        }
        require(found, "The address is not copying the wallet");

        if (aave.update(copycat, wallet, token, balances[copycat][wallet])) {
            payable(msg.sender).transfer(fee); //TODO pay gas fees
            return true;
        }
            return false;
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = false;
        address[] performData;
        for(uint256 i=0;i<copycats.length;i++){
            for(uint j=0;j<walletsToBeCopied[copycats[i]].length;j++){
                //change smart contract to each copycat's smart contract
                if(aave.upkeepNeeded(walletsToBeCopied[copycats[i]][j])){
                    upkeepNeeded = true;
                    return (upkeepNeeded, [copycats[i], walletsToBeCopied[copycats[i]][j]]);
                }
            }
        }
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        address[] copycats = performData[0];
        updateAave(performData[0], performData[1], performData[2]);
    }
}
