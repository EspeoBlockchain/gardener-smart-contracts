const Oracle = artifacts.require('Oracle.sol');

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Oracle, accounts[9]);
};
