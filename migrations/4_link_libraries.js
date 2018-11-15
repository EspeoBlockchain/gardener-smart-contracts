const StringParser = artifacts.require('StringParser');
const StringParserCoverage = artifacts.require('StringParserCoverage');

module.exports = (deployer) => {
  deployer.deploy(StringParser);
  deployer.link(StringParser, StringParserCoverage);
};
