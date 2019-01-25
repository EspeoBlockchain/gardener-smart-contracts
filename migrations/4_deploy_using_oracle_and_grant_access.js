const UsingOracle = artifacts.require('UsingOracle.sol');
const Oracle = artifacts.require('Oracle.sol');

module.exports = async (deployer) => {
  await deployer.deploy(UsingOracle, Oracle.address);

  const oracleInstance = await Oracle.deployed();
  await oracleInstance.grantAccessToAddress(UsingOracle.address);
};
