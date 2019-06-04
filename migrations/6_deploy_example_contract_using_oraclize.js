const OraclizeAddrResolver = artifacts.require('OraclizeAddrResolver');
const UsingOraclizeExampleContract = artifacts.require('UsingOraclizeExampleContract');
const OraclizeWrapper = artifacts.require('OraclizeWrapper');

module.exports = async (deployer) => {
  await deployer.deploy(OraclizeAddrResolver);

  const oraclizeAddrResolver = await OraclizeAddrResolver.deployed();
  await oraclizeAddrResolver.setAddr(OraclizeWrapper.address);

  await deployer.deploy(UsingOraclizeExampleContract, OraclizeAddrResolver.address);

  const oraclizeWrapper = await OraclizeWrapper.deployed();
  await oraclizeWrapper.grantAccessToAddress(UsingOraclizeExampleContract.address);
};
