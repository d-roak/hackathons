//SPDX-License-Identifier: Unlicensed
pragma solidity >0.8.0;

import "@uniswap/v3-core";
import {IUniswapV3PoolActions} from "@uniswap/v3-core/contracts/interface/pool/IUniswapV3PoolActions.sol";

contract CopycatUniswap {
  IUniswapV3Pool pool;
  address uniswapAddress;

  constructor(){
    uniswapAddress = address(0x1F98431c8aD98523631AE4a59f267346ea31F984);
  }

  function mint(
      address recipient,
      int24 tickLower,
      int24 tickUpper,
      uint128 amount,
      bytes calldata data
  ) internal {

    pool.mint(recipient, tickLower, tickUpper, amount, data);
      
  }

  function collect(
      address recipient,
      int24 tickLower,
      int24 tickUpper,
      uint128 amount0Requested,
      uint128 amount1Requested
  ) internal{

    pool.collect(recipient, tickLower, tickUpper, amount0Requested, amount1Requested);
       
  }

  function swap(
      address recipient,
      bool zeroForOne,
      int256 amountSpecified,
      uint160 sqrtPriceLimitX96,
      bytes calldata data
      ) internal {

<<<<<<< HEAD
      pool.swap(recipient, zeroForOne, amountSpecified, sqrtPriceLimitX96, data);
=======

  constructor(){

  }

  function update(address copycat, address wallet, uint256 amount) public {

  }

  function doSomethingWithPool() public {
>>>>>>> 57bb9b0b40e82f12133a715454d1276267d02d3d

  }
}