//SPDX-License-Identifier: Unlicensed
pragma solidity >0.8.0;


contract CopycatUniswap {
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

      
  }

  function collect(
      address recipient,
      int24 tickLower,
      int24 tickUpper,
      uint128 amount0Requested,
      uint128 amount1Requested
  ) internal{

       
  }

  function swap(
      address recipient,
      bool zeroForOne,
      int256 amountSpecified,
      uint160 sqrtPriceLimitX96,
      bytes calldata data
      ) internal {


  }
}