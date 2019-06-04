const UsingOracle = artifacts.require('UsingOracle');
const Oracle = artifacts.require('Oracle');

module.exports = async (deployer) => {
  await deployer.deploy(UsingOracle, Oracle.address);

  const oracleInstance = await Oracle.deployed();
  await oracleInstance.grantAccessToAddress(UsingOracle.address);
};
