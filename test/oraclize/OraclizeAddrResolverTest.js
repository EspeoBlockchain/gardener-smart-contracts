const { assert } = require('../utils');

const OraclizeAddrResolver = artifacts.require('OraclizeAddrResolver');

contract('OraclizeAddrResolver', (accounts) => {
  const sut = {};

  beforeEach(async () => {
    sut.instance = await OraclizeAddrResolver.new();
  });

  it('should accept changing owner by current owner', async () => {
    // given
    const newOwner = accounts[1];

    // when
    const transaction = sut.instance.changeOwner(newOwner, { from: accounts[0] });

    // then
    return assert.isFulfilled(transaction);
  });

  it('should reject changing owner by someone other than current owner', async () => {
    // given
    const newOwner = accounts[1];
    const notAnOwner = accounts[1];

    // when
    const transaction = sut.instance.changeOwner(newOwner, { from: notAnOwner });

    // then
    return assert.isRejected(transaction);
  });

  it('should accept changing address by owner', async () => {
    // given
    const newAddress = accounts[4];

    // when
    await sut.instance.setAddr(newAddress);

    // then
    const currentAddress = await sut.instance.getAddress();
    assert.equal(currentAddress, newAddress, 'Address hasn\'t changed');
  });

  it('should reject changing address by someone other than owner', async () => {
    // given
    const notAnOwner = accounts[1];
    const newAddress = accounts[4];

    // when
    const transaction = sut.instance.setAddr(newAddress, { from: notAnOwner });

    // then
    return assert.isRejected(transaction);
  });
});
