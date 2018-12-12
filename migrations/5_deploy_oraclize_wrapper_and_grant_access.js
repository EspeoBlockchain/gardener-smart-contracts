const OraclizeWrapper = artifacts.require('OraclizeWrapper');
const Oracle = artifacts.require('Oracle.sol');

module.exports = (deployer) => {
  deployer.deploy(OraclizeWrapper, Oracle.address);

  deployer.then(() => Oracle.deployed())
    .then(instance => instance.grantAccessToAddress(OraclizeWrapper.address));
};
