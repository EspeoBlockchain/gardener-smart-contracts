const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config();


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // match any network
    },
    ropsten: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY || process.env.MNEMONIC,
        process.env.ROPSTEN_PROVIDER_URL,
      ),
      network_id: '3',
    },
  },
  compilers: {
    solc: {
      version: '0.5.9',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
