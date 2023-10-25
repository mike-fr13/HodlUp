// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.8.19;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import './MockERC20.sol';

import "hardhat/console.sol";

contract MockUniswapISwapRouter is ISwapRouter{

    /// @notice Swaps `amountIn` of one token for as much as possible of another token
    /// @param params The parameters necessary for the swap, encoded as `ExactInputSingleParams` in calldata
    /// @return amountOut The amount of the received token
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut) {
/*        
         ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: DAI,
                fee: feeTier,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: minOut,
                sqrtPriceLimitX96: priceLimit
            });
*/
        MockERC20 tokenIn = MockERC20(params.tokenIn);
        MockERC20 tokenOut = MockERC20(params.tokenOut);
        uint amountIn = params.amountIn;
        address recipient = params.recipient;


        console.log("exactInputSingle - address msg.sender: ", msg.sender);
        console.log("exactInputSingle - address recipient: ", recipient);
        console.log("exactInputSingle - before - tokenIn balance msg.sender: ", IERC20(tokenIn).balanceOf(msg.sender));
        console.log("exactInputSingle - before - tokenIn balance recipient: ", IERC20(tokenIn).balanceOf(recipient));
        console.log("exactInputSingle - before - tokenOut balance msg.sender: ", IERC20(tokenOut).balanceOf(msg.sender));
        console.log("exactInputSingle - before - tokenOut balance recipient: ", IERC20(tokenOut).balanceOf(recipient));

        // check balance
        require (tokenIn.balanceOf(msg.sender) >= amountIn, "TokenIn Balance too low");

        //burn input token
        console.log("exactInputSingle - to be burn: ", amountIn);
        ERC20Burnable(tokenIn).burnFrom(msg.sender,amountIn);

        //calculate output amount
        //feeTiers is given with a 10**6 factor
        amountOut = (params.amountIn * (10**6 - params.fee)) / 10**6 ;
        console.log("exactInputSingle - amount received: ", amountOut);

        //mint output token and
        // supply AToken to msg.sender
        MockERC20(tokenOut).mint(recipient, amountOut);

        console.log("exactInputSingle - after - tokenIn balance msg.sender: ", IERC20(tokenIn).balanceOf(msg.sender));
        console.log("exactInputSingle - after - tokenIn balance recipient: ", IERC20(tokenIn).balanceOf(recipient));
        console.log("exactInputSingle - after - tokenOut balance msg.sender: ", IERC20(tokenOut).balanceOf(msg.sender));
        console.log("exactInputSingle - after - tokenOut balance recipient: ", IERC20(tokenOut).balanceOf(recipient));


        return (amountOut);
    }

    /// @notice Swaps `amountIn` of one token for as much as possible of another along the specified path
    /// @param  . The parameters necessary for the multi-hop swap, encoded as `ExactInputParams` in calldata
    /// @return  uint256 The amount of the received token
    function exactInput(ExactInputParams calldata ) external payable returns (uint256 ) {
        revert("Not implemented for Mock");
    }

    /// @notice Swaps as little as possible of one token for `amountOut` of another token
    /// @param . The parameters necessary for the swap, encoded as `ExactOutputSingleParams` in calldata
    /// @return uint256 The amount of the input token
    function exactOutputSingle(ExactOutputSingleParams calldata ) external payable returns (uint256 ) {
        revert("Not implemented for Mock");
    }

     /// @notice Swaps as little as possible of one token for `amountOut` of another along the specified path (reversed)
    /// @param . The parameters necessary for the multi-hop swap, encoded as `ExactOutputParams` in calldata
    /// @return uint256 The amount of the input token
    function exactOutput(ExactOutputParams calldata ) external payable returns (uint256 ) {
        revert("Not implemented for Mock");
    }

    /// @notice Called to `msg.sender` after executing a swap via IUniswapV3Pool#swap.
    /// @dev In the implementation you must pay the pool tokens owed for the swap.
    /// The caller of this method must be checked to be a UniswapV3Pool deployed by the canonical UniswapV3Factory.
    /// amount0Delta and amount1Delta can both be 0 if no tokens were swapped.
    function uniswapV3SwapCallback(
        int256 ,
        int256 ,
        bytes calldata 
    ) external pure{
        revert("Not implemented for Mock");
    }

}

