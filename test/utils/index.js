const { assert } = require('chai').use(require('chai-as-promised'));
const getEvents = require('./getEvents');

const EVMThrow = message => `VM Exception while processing transaction: ${message}`;

module.exports = {
  assert,
  EVMRevert: EVMThrow('revert'),
  getEvents,
};
