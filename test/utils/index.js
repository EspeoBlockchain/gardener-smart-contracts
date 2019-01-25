const { assert } = require('chai').use(require('chai-as-promised'));
const events = require('./events');

const EVMThrow = message => `VM Exception while processing transaction: ${message}`;

module.exports = {
  assert,
  EVMRevert: EVMThrow('revert'),
  ...events,
};
