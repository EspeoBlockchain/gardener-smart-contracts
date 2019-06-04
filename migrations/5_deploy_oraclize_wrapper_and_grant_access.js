const OraclizeWrapper = artifacts.require('OraclizeWrapper');
const Oracle = artifacts.require('Oracle');

module.exports = async (deployer) => {
  await deployer.deploy(OraclizeWrapper, Oracle.address);

  const oracleInstance = await Oracle.deployed();
  await oracleInstance.grantAccessToAddress(OraclizeWrapper.address);
};
