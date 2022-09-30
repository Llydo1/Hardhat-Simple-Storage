const { task } = require("hardhat/config");

task("block-number", "Print current block number").setAction(
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    const networkName = (await hre.ethers.provider._networkPromise).name;
    console.log(
      `Current block number of ${networkName.toUpperCase()} is ${blockNumber}`
    );
  }
);

module.exports = {};
