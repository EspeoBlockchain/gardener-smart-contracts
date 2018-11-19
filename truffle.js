const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config();
/*
§ * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // match any network
    },
    ropsten: {
      // eslint-disable-next-line max-len
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY || process.env.MNEMONIC, process.env.ROPSTEN_PROVIDER_URL),
      network_id: '3',
    },
  },
};
