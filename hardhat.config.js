const { task } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("./tasks/block-number");
require("./tasks/accounts");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */

const RPC_URL_GOERLI = process.env.RPC_URL_GOERLI || 0;
const KEY_GOERLI = process.env.KEY_GOERLI || 0;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 0;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 0;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: RPC_URL_GOERLI,
      accounts: [KEY_GOERLI],
      chainId: 5,
    },
    localHost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
  },
  solidity: "0.8.7",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    currency: "USD",
  },
};
