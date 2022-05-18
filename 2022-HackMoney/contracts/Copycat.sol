//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./CopycatAAVE.sol";
import "./CopycatUniswap.sol";

contract Copycat is KeeperCompatibleInterface {
    // no floats 0.3% = 0.0003 = 3 * 10^-5 = 3 / 10^5
    uint256 private fee = 3;
    uint256 private maxGas = 1000;
    address[] private copycats;
    mapping(address => mapping(address => uint256)) feeBalances;
    mapping(address => mapping(address => Wallet)) private balances;
    mapping(address => address[]) private walletsToBeCopied;
    mapping(address => CopycatAAVE) private aavePositions;

    constructor() {}

    struct Wallet {
        uint value;
        bool exists;
    }

    modifier isFollowing (address wallet) {
        require(balances[msg.sender][wallet].exists, "You are not following this wallet");
        _;
    }

    function deposit(address wallet) external payable isFollowing(wallet){
        balances[msg.sender][wallet].value += msg.value;
    }

    function depositFee(address wallet) external payable isFollowing(wallet){
        feeBalances[msg.sender][wallet] += msg.value;
    }

    function withdraw(uint256 amount, address wallet) external isFollowing(wallet) {
        require( amount <= balances[msg.sender][wallet].value, "Amount exceeds balance");
        balances[msg.sender][wallet].value -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "There was an error! Transfer failed.");
    }

    function withdrawFee(uint256 amount, address wallet) external isFollowing(wallet){
        require( amount <= feeBalances[msg.sender][wallet], "Amount exceeds balance");
        feeBalances[msg.sender][wallet] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "There was an error! Transfer failed.");
    }

    function balance(address wallet) external view isFollowing(wallet) returns (uint256) {
        return balances[msg.sender][wallet].value;
    }

    function feeBalance(address wallet) external view isFollowing(wallet) returns (uint256) {
        return feeBalances[msg.sender][wallet];
    }

    function addWalletToCopycat(address wallet) external {
        require(balances[msg.sender][wallet].value<=0, "You are already following this wallet");
        if (walletsToBeCopied[msg.sender].length == 0) {
            aavePositions[msg.sender] = new CopycatAAVE();
        }

        balances[msg.sender][wallet] = Wallet(0, true);
        feeBalances[msg.sender][wallet] = 0;
        aavePositions[msg.sender].addWallet(wallet);
        walletsToBeCopied[msg.sender].push(wallet);
    }

    function getAddressesBeingCopied() external view returns (address[] memory) {
        return walletsToBeCopied[msg.sender];
    }

    function updateAave(
        address copycat,
        address wallet,
        address token
    ) private returns (bool success) {
        bool found = false;
        //TODO do this with mapping
        for (uint256 i = 0; i < walletsToBeCopied[copycat].length; i++) {
            if (walletsToBeCopied[copycat][i] == wallet) {
                found = true;
                break;
            }
        }
        require(balances[copycat][wallet].value > 0, "Provide amount to copy");
        require(feeBalances[copycat][wallet] > gasleft(), "Provide amount to pay fees");

        if (aavePositions[copycat].update(wallet,token,balances[copycat][wallet].value)) {
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
