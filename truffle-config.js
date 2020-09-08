const path = require("path");
require("dotenv").config({path: `${__dirname}/.env`});
const HDWalletProvider = require("./client/node_modules/@truffle/hdwallet-provider");

const accountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    },
    ganache: {
      provider: function () {
        return new HDWalletProvider(process.env.DEVMNEMONIC, "http://127.0.0.1:7545", accountIndex)
      },
      network_id: 5777
    },
    goerli_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.DEVMNEMONIC, "https://goerli.infura.io/v3/83301e4b4e234662b7769295c0f4a2e1", accountIndex)
      },
      network_id: 5,
      skipDryRun: true
    },
    ropsten_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.DEVMNEMONIC, "https://ropsten.infura.io/v3/83301e4b4e234662b7769295c0f4a2e1", accountIndex)
      },
      network_id: 3,
      skipDryRun: true
    },
    mainnet_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.PRODMNEMONIC, "https://mainnet.infura.io/v3/83301e4b4e234662b7769295c0f4a2e1", accountIndex)
      },
      network_id: 1,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.6.6"
    }
  }
};
