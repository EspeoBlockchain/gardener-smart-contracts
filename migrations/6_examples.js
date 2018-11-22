const OraclizeAddrResolver = artifacts.require('OraclizeAddrResolver');
const UsingOraclizeExampleContract = artifacts.require('UsingOraclizeExampleContract');
const OraclizeWrapper = artifacts.require('OraclizeWrapper');

module.exports = (deployer) => {
  deployer.deploy(OraclizeAddrResolver)
    .then(instance => instance.setAddr(OraclizeWrapper.address))
    .then(() => deployer.deploy(UsingOraclizeExampleContract, OraclizeAddrResolver.address))
    .then(() => OraclizeWrapper.deployed())
    .then(instance => instance.grantAccessToAddress(UsingOraclizeExampleContract.address));
};
