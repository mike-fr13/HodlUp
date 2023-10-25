const hre = require("hardhat");
const Constant = require("../test/lib/Constants.js");
const { 
  pause, 
  getAbi, 
  getTokenPairContractAdress, 
  getPositionCreated,
  getPositionStatusChanged, 
  addTokenPair, 
  mintToken, 
  depositToken, 
  addDCAConfig } = require("./lib/HodlUp.js");

async function main() {

  let ADD_owner;
  let ADD_account1;
  let ADD_account2;
  let ADD_account3;
  let ADD_account4;
  let ADD_account5;
  let ADD_account6;

  const network = hre.network.name;

  // Check if the network name is provided
  if ((!network) || (network == "hardhat")) {
    console.error("Please specify the deployment network name (e.g., localhost, rinkeby, mainnet)");
    console.error("We do not auhtorize the default hardhat network to avoid deployment misstake and waste of time");
    return;
  } else {
    console.log(`Deployment on network : ${network}`);
  }

  const {
    HodlupManagercontractAddress,
    TokenAcontractAddress,
    TokenBcontractAddress,
    MockChainlinkcontractAddress,
    MockUniswapContractAddress,
  } = require("./lib/deployedContractAddresses.js")

  console.log("HodlupManagercontractAddress : ", HodlupManagercontractAddress)
  console.log("TokenAcontractAddress : ", TokenAcontractAddress)
  console.log("TokenBcontractAddress : ", TokenBcontractAddress)
  console.log("MockChainlinkcontractAddress : ", MockChainlinkcontractAddress)
  console.log("MockUniswapContractAddress : ", MockUniswapContractAddress)


  if ((!network)||(network =="hardhat")||(network =="localhost")) {
     ADD_owner    = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
     ADD_account1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
     ADD_account2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
     ADD_account3 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
     ADD_account4 = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";
     ADD_account5 = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc";
     ADD_account6 = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
  }
  else {
     ADD_owner ="0x0699b6F7e3ab7Be573cec92F43c12F8f567C03eE"
     ADD_account1 = "0xd83571aD1012E8422CAD8A554675cca23ABc1f73";
     ADD_account2 = "0xCFcaC3017A98626008f60feb722dEE08EA3c4562";
     ADD_account3 = "0x3735F912712F62dAfEB78f0236DB371c5605945e";
     ADD_account4 = "0xdB1Efe3108B9B32505aBF806b026aDDbAAc6Cc67";
     ADD_account5 = "0xE02fe790a7Ee624EffBE9824728c19d991CB9f52";
     ADD_account6 = "0xf42eD5d95DD6a20c8DD68fD706ABDF89845Afa7B";
  }

  const hodlupManagerABI = getAbi("HodlupManager");
  const DcaHodlupABI = getAbi("DcaHodlup");
  const MockERC20 = getAbi("MockERC20","mocks/");

  //console.log(hodlupManagerABI);
  const { ethers } = require("hardhat");
  const provider = ethers.provider;
  const owner = await provider.getSigner(ADD_owner);
  const hodlupManager = new ethers.Contract(HodlupManagercontractAddress, hodlupManagerABI, owner);

  
  /*
 // 1s Interval to show swap during demo
 await hodlupManager.addInterval("1");
 
 // WEEK
 await hodlupManager.addInterval("604800");

 //MONTH
 await hodlupManager.addInterval("2629746");
*/
dcaPairContractTransaction = await hodlupManager.createDcaPaire("MOCKA_MOCKB_v0", TokenAcontractAddress, TokenBcontractAddress, MockUniswapContractAddress, 20);
//console.log(`dcaPairContractTransaction : ${dcaPairContractTransaction}`);
  
//await pause(5000);
 
dcaPairContractAddress = await getTokenPairContractAdress(hodlupManager)
  console.log("dcaPairContractAddress : ", dcaPairContractAddress)

//console.log(DcaHodlupABI);
const mockA_mockB_v0 = new ethers.Contract(dcaPairContractAddress[0], DcaHodlupABI, owner);
//console.log(mockA_mockB_v0);

//create a dca position
// ( _name, _totalAmountToSwap, _interval, _amountPerSwap, _dcaIterations)
await mockA_mockB_v0.createPosition("position_nb_1",1000,10,50,0);

//add allowance for this position
const tokenAContract = new ethers.Contract(TokenAcontractAddress, MockERC20, owner);
//console.log(owner)
console.log("allowance :", await tokenAContract.allowance(owner.address, dcaPairContractAddress[0]))
await tokenAContract.increaseAllowance(dcaPairContractAddress[0],1000);
console.log("allowance :", await tokenAContract.allowance(owner.address, dcaPairContractAddress[0]))

//PositionCreated(msg.sender, address(inputToken), address(outputToken), _name, block.timestamp);
positionCreated = await getPositionCreated(mockA_mockB_v0)
console.log("positionCreated : ", positionCreated);

//execute DCA
/*
hodlupManager.executeSwap("MOCKA_MOCKB_v0");
positionStatusChanged = await getPositionStatusChanged(mockA_mockB_v0)
console.log("positionStatusChanged : ", positionStatusChanged);
*/

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
