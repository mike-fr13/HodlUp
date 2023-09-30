const Constant = require("../test/lib/Constants.js");
const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const isDebugEnable = false

  // Get the deployment network name
  const network = hre.network.name;

  // Check if the network name is provided
  if ((!network)||(network =="hardhat")) {
    console.error("Please specify the deployment network name (e.g., localhost, rinkeby, mainnet)");
    console.error("We do not auhtorize the default hardhat network to avoid deployment misstake and waste of time");
    return;
  } else {
    console.log (`Deployment on network : ${network}`);
  }
  
  // create an ERC20 Mock: TokenA
  const TokenA = await hre.ethers.getContractFactory("MockERC20");
  const tokenA = await TokenA.deploy(Constant.MCKA_NAME, Constant.MCKA_SYMBOL, Constant.TOKEN_INITIAL_SUPPLY);
  await tokenA.waitForDeployment();
  console.log(`TokenA deployed to ${tokenA.target}`);

  // create an ERC20 Mock: TokenB
  const TokenB = await hre.ethers.getContractFactory("MockERC20");
  const tokenB = await TokenB.deploy(Constant.MCKB_NAME, Constant.MCKB_SYMBOL, Constant.TOKEN_INITIAL_SUPPLY);
  await tokenB.waitForDeployment();
  console.log(`TokenB deployed to ${tokenB.target}`);

  const MockChainLinkAggregatorV3 = await hre.ethers.getContractFactory("MockChainLinkAggregatorV3");
  const mockChainLinkAggregatorV3 = await MockChainLinkAggregatorV3.deploy(Constant.ADDRESS_0, true);
  await mockChainLinkAggregatorV3.waitForDeployment();
  console.log(`MockChainLinkAggregatorV3 deployed to ${mockChainLinkAggregatorV3.target}`);

  // create ChainLinkAggregatorV3 mock
  const MockUniswapISwapRouter = await hre.ethers.getContractFactory("MockUniswapISwapRouter");
  const mockUniswapISwapRouter = await MockUniswapISwapRouter.deploy();
  await mockUniswapISwapRouter.waitForDeployment();
  console.log(`MockUniswapISwapRouter deployed to ${mockUniswapISwapRouter.target}`);

 // create HodlupManager mock
 const HodlupManager = await hre.ethers.getContractFactory("HodlupManager");
 const hodlupManager = await HodlupManager.deploy();
 await hodlupManager.waitForDeployment();
 console.log(`HodlupManager deployed to ${hodlupManager.target}`);

 /*
 //create a new pair
 const pairMockToken_A_to_B = await hodlupManager.createDcaPaire("MockToken_A_to_B", tokenA.target, tokenB.target, mockUniswapISwapRouter.target, 20)
 console.log("New pair MockToken_A_to_B created to "+ pairMockToken_A_to_B);
 */

// Create the output file name with the network prefix
const fileName = `./scripts/lib/deployedContractAddresses.js`;

// Write contract addresses to output file
const output = `
  const HodlupManagercontractAddress = "${hodlupManager.target}";
  const TokenAcontractAddress = "${tokenA.target}";
  const TokenBcontractAddress = "${tokenB.target}";
  const MockChainlinkcontractAddress = "${mockChainLinkAggregatorV3.target}";
  const MockUniswapContractAddress = "${mockUniswapISwapRouter.target}";

  module.exports = {
    HodlupManagercontractAddress,
    TokenAcontractAddress,
    TokenBcontractAddress,
    MockChainlinkcontractAddress,
    MockUniswapContractAddress
}

`;

fs.writeFileSync(fileName, output);

console.log(`Contract addresses written to ${fileName}`);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
