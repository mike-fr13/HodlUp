const Hodl = artifacts.require("./Hodl.sol");
const { BN, expectRevert, expectEvent, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ERC20TransferABI = require ("../../client/src/contracts/IERC20.json");

contract('Hodl', accounts => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    let HodlInstance;

    describe("test constructor", function () {
        it("should be initialize contract states", async () => {
            HodlInstance = await Hodl.new();
            expect(await HodlInstance.name.call()).to.equal("Hodl");
            expect(await HodlInstance.symbol.call()).to.equal("HODL");
        });
    });

    describe("test mint", function () {

        beforeEach(async function () {
            HodlInstance = await Hodl.new();
        });

        it("should not mint (not owner)", async () => {
            HodlInstance = await Hodl.new();
            await expectRevert(HodlInstance.mint(owner, 100, {from: user1}), 'Ownable: caller is not the owner');
        });
        it("should mint", async () => {
            HodlInstance = await Hodl.new();
            expectedAmountnew = BN(10).pow(new BN(18))
            await HodlInstance.mint(owner, 1, {from: owner});
            expect(await HodlInstance.balanceOf(owner)).to.be.bignumber.equal(expectedAmountnew);
        });
    });


    // describe("test Pair creation", function () {

    //     beforeEach(async function () {
    //         HodlInstance = await Hodl.new();
    //         HodlUpRewardManagerInstance = await HodlUpRewardManager.new(HodlInstance.address, 600);
    //         HodlUpHubInstance = await HodlUpHub.new(uniswapRouterAddress,uniswapRouterAddress, 50, 20, {from:owner});
    //     });

    //     it("should not create Pair (not owner)", async () => {
    //         await expectRevert(HodlUpHubInstance.addPair(USDC_ADDRESS, SAND_ADDRESS, true, {from: user1}), 'Ownable: caller is not the owner');
    //     });

    //     it("should not create Pair (Non existing Input Token)", async () => {
    //         await expectRevert(HodlUpHubInstance.addPair(uniswapRouterAddress, SAND_ADDRESS, true, {from: owner}), 'Input Token is not available. No Supply');
    //     });

    //     it("should not create Pair (Non existing Output Token)", async () => {
    //         await expectRevert(HodlUpHubInstance.addPair(USDC_ADDRESS, uniswapRouterAddress, true, {from: owner}), 'Output Token is not available. No Supply');
    //     });

    //     it("should not create Pair (Non existing Output Token)", async () => {
    //         await expectRevert(HodlUpHubInstance.addPair(USDC_ADDRESS, uniswapRouterAddress, true, {from: owner}), 'Output Token is not available. No Supply');
    //     });

    //     it("should create Pair (event)", async () => {            
    //         //expect(await HodlUpHubInstance.pairsAvailable.length).to.be.bignumber.equal(new BN(0));
    //         expectEvent(await HodlUpHubInstance.addPair(USDC_ADDRESS, SAND_ADDRESS, true, {from: owner}) , "PairAdded", {token_from: USDC_ADDRESS, token_to: SAND_ADDRESS});
    //     });

    //     it("should create Pair", async () => {            
    //         await HodlUpHubInstance.addPair(USDC_ADDRESS, SAND_ADDRESS, true, {from: owner});
    //         const pair = await HodlUpHubInstance.pairsAvailable(0);
    //         await expect(pair.token_from).to.equal(USDC_ADDRESS);
    //         await expect(pair.token_to).to.equal(SAND_ADDRESS);
    //         await expect(pair.active).to.be.true;
    //     });

    //     it("should not create Pair (already exists)", async () => {            
    //         await HodlUpHubInstance.addPair(USDC_ADDRESS, SAND_ADDRESS, true, {from: owner});
    //         await expectRevert(HodlUpHubInstance.addPair(USDC_ADDRESS, SAND_ADDRESS, true, {from: owner}), 'Pair already exists');
    //     });
    // });



});