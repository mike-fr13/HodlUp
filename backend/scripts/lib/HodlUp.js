const fs = require("fs")
const path = require("path")

/* get ABI from local artifact */
const getAbi = (contractName, folder) => {
  try {

    let filePath = `../../artifacts/contracts/${folder ? `${folder}/` : ''}${contractName}.sol/${contractName}.json`;

    const dir = path.resolve(
      __dirname,
      filePath
    )
    const file = fs.readFileSync(dir, "utf8")
    const json = JSON.parse(file)
    const abi = json.abi
    //console.log(`abi`, abi)

    return abi
  } catch (e) {
    console.log(`e`, e)
  }
}

/* Retrieve tokenPair creation event */
async function getTokenPairContractAdress(hodlupManager) {
    const [owner, account1, account2, account3, account4] = await ethers.getSigners();

    const filter = hodlupManager.filters.DcaCreated;
    const events = await hodlupManager.queryFilter(filter, 0);

    const tokenPairContractAdress = [];

    events.forEach((event) => {
      tokenPairContractAdress.push(event.args._contractAddress);
      });

    return tokenPairContractAdress;
  }

  /* retrieve DCA position created event */
  async function getPositionCreated(dcaPairContractAddress) {
    const [owner, account1, account2, account3, account4] = await ethers.getSigners();

    const filter = dcaPairContractAddress.filters.PositionCreated;
    const events = await dcaPairContractAddress.queryFilter(filter, 0);

    console.log("events length: ", events.length)

    const positionCreated = [];

    events.forEach((event) => {
      console.log("event.args : ", event.args)
      console.log("event.args._name : ", event.args.name)
      positionCreated.push(event.args.name);
      });
    
    console.log("positionCreated : ", positionCreated)

    return positionCreated;
  }
  


async function getlastPairDCAExecutionResultEvent(_doApp, _pairId) {
  const [owner, account1, account2, account3, account4] = await ethers.getSigners();

  const currentBlockNumber = await ethers.provider.getBlockNumber();
  const fromBlockNumber = currentBlockNumber - 1; // to get the last two blocks
  const filter = _doApp.filters.PairDCAExecutionResult(_pairId, null, null, null, null);
  const events = await _doApp.queryFilter(filter, fromBlockNumber);
  const lastEvent = events[events.length - 1];

  //console.log(lastEvent)

  return lastEvent;
}

function pause(x) {
  return new Promise(resolve => {
      setTimeout(resolve, x); // Pause de 5 secondes (5000 millisecondes)
  });
}


async function addTokenPair(
  datastorecontract,
  tokenAAddress,
  tokenBAddress,
  tokenPairSegmentSize,
  mockChainLinkAggregatorV3Address,
  mockAAVEPoolAddressesProviderAddress,
  mockUniswapISwapRouterAddress
) {
  console.log('addTokenPair - start');

  datastorecontract.addTokenPair(
    tokenAAddress,
    tokenPairSegmentSize,
    tokenBAddress,
    mockChainLinkAggregatorV3Address,
    mockAAVEPoolAddressesProviderAddress,
    mockUniswapISwapRouterAddress
  );
  //pause(5000);
  //pairs = await getTokenPairs(datastorecontract) 
  //console.log(`addTokenPair - Token Pair added : ${pairs[(pairs.length)-1]}`);
}  

async function mintToken(
  _tokenContract,
  _user, 
  _amount) {
    console.log('mintToken - start ');
    await (_tokenContract.mint(_user, _amount))
    console.log(`mintToken - ${_amount} token ${_tokenContract.target} mint for address ${_user}`)
}

async function depositToken(doAPPContract, pairId, _tokenContract, _user, _amount, dataStorage) {
  console.log('depositToken - start ')

  const userSigner = await ethers.provider.getSigner(_user);
  
  await (_tokenContract.connect(userSigner).approve(doAPPContract.target, _amount))
  await ( (doAPPContract.connect(userSigner)).depositTokenA(pairId, _amount))
  console.log(`Balance of ${_user} for token ${_tokenContract.target} : `  ,await ( (_tokenContract.balanceOf(_user))))
  console.log(`Balance of ${doAPPContract.target} for token ${_tokenContract.target} : `  ,await ( (_tokenContract.balanceOf(doAPPContract.target))))

  console.log('depositToken - account1 doApp tokenA : ', (await doAPPContract.connect(_user).getTokenUserBalances(_tokenContract.target,_user)))
}

async function addDCAConfig(
  dataStorage,
  user, 
  pairId, 
  swapAToB, 
  min, 
  max, 
  amount,
  scalingFactor,
  delay
  ) {
    console.log("addDCAConfig - Starting DCA Config creation")
    const userSigner = await ethers.provider.getSigner(user);
    dataStorage.connect(userSigner).addDCAConfig(
    pairId,
    swapAToB, 
    min, 
    max, 
    amount,
    scalingFactor,
    delay
    )
    console.log (`addDCAConfig - DCA config added for pair${pairId} and user ${user}`)
}


  
module.exports = {
  pause,
  getTokenPairContractAdress,
  getPositionCreated,
  getlastPairDCAExecutionResultEvent,
  getAbi,
  addTokenPair,
  mintToken,
  depositToken,
  addDCAConfig
}

