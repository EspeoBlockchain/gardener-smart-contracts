const Oracle = artifacts.require('Oracle');

module.exports = (deployer, network, accounts) => {
  const oracleServerAddress = network === 'develop' ? accounts[9] : process.env.ORACLE_SERVER_ADDRESS;
  if (!oracleServerAddress) {
    throw new Error('Oracle server address is not set!');
  }
  deployer.deploy(Oracle, oracleServerAddress);
};
