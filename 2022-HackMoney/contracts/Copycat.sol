//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./CopycatAAVE.sol";
import "./CopycatUniswap.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract Copycat is KeeperCompatibleInterface {
    // no floats 0.3% = 0.0003 = 3 * 10^-5 = 3 / 10^5
    uint256 private fee = 3;
    uint256 private maxGas = 1000;
    address[] private copycats;
    mapping(address => mapping(address => uint256)) feeBalances;
    mapping(address => mapping(address => uint256)) private balances;
    mapping(address => address[]) private walletsToBeCopied;
    mapping(address => CopycatAAVE) private aavePositions;

    constructor() {}

    function deposit(address wallet) public payable returns (uint256) {
        require(balances[msg.sender][wallet]>0, "You are not following this wallet");
        balances[msg.sender][wallet] += msg.value;
        return balances[msg.sender][wallet];
    }

    function depositFee(address wallet) public payable returns (uint256) {
        require(balances[msg.sender][wallet]>0, "You are not following this wallet");
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
        require(balances[msg.sender][wallet]>0, "You are not following this wallet");
        return balances[msg.sender][wallet];
    }

    function feeBalance(address wallet) public view returns (uint256) {
        require(balances[msg.sender][wallet]>0, "You are not following this wallet");
        return feeBalances[msg.sender][wallet];
    }

    function addWalletToCopycat(address wallet) public {
        require(balances[msg.sender][wallet]<=0, "You are already following this wallet");
        if (walletsToBeCopied[msg.sender].length == 0) {
            aavePositions[msg.sender] = new CopycatAAVE();
        }

        aavePositions[msg.sender].addWallet(wallet);
        walletsToBeCopied[msg.sender].push(wallet);
    }

    function getAddressesBeingCopied() public view returns (address[] memory) {
        return walletsToBeCopied[msg.sender];
    }

    function updateAave(
        address copycat,
        address wallet,
        address token
    ) private view returns (bool success) {
        bool found = false;
        //TODO do this with mapping
        for (uint256 i = 0; i < walletsToBeCopied[copycat].length; i++) {
            if (walletsToBeCopied[copycat][i] == wallet) {
                found = true;
                break;
            }
        }
        require(balances[copycat][wallet] > 0, "Provide amount to copy");
        require(feeBalances[copycat][wallet] > gasleft(), "Provide amount to pay fees");

        if (aavePositions[copycat].update(wallet,token,balances[copycat][wallet])) {
            payable(msg.sender).transfer(fee); //TODO pay gas fees
            return true;
        }
        return false;
    }

    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = false;
        for (uint256 i = 0; i < copycats.length; i++) {
            
            for (uint256 j = 0;j < walletsToBeCopied[copycats[i]].length;j++) {
                if(feeBalances[copycats[i]][walletsToBeCopied[copycats[i]][j]] >= fee){
                
                    (bool needed, address token) = aavePositions[copycats[i]].upkeepNeeded(walletsToBeCopied[copycats[i]][j]);
                    if (needed) {
                        upkeepNeeded = true;
                        performData = abi.encode([copycats[i], walletsToBeCopied[copycats[i]][j], token]);
                        return (upkeepNeeded, performData);
                    }
                }
            }
        }
        return (upkeepNeeded, abi.encode(address(0)));
    }

    function performUpkeep(bytes calldata performData) external override {
        (address copycat, address wallet, address token)= abi.decode(performData, (address, address, address));
        updateAave(copycat, wallet, token);
    }
}
