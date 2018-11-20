const Oracle = artifacts.require('Oracle.sol');

module.exports = (deployer, network, accounts) => {
  const oracleServerAddress = network === 'develop' ? accounts[9] : process.env.ORACLE_SERVER_ADDRESS;
  deployer.deploy(Oracle, oracleServerAddress);
};
