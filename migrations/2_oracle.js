const Oracle = artifacts.require('Oracle.sol');

module.exports = (deployer) => {
  deployer.deploy(Oracle, process.env.ORACLE_SERVER_ADDRESS);
};
