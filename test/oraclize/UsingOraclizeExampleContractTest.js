const { assert, getRequestIdFromEvent, getEvents } = require('../utils');

const UsingOraclizeExampleContract = artifacts.require('UsingOraclizeExampleContract');
const OraclizeWrapper = artifacts.require('OraclizeWrapper');
const OraclizeAddrResolver = artifacts.require('OraclizeAddrResolver');
const Oracle = artifacts.require('Oracle');


contract('UsingOraclizeExampleContract', (accounts) => {
  const sut = {};
  const serverAddress = accounts[1];
  const notAServer = accounts[2];

  beforeEach(async () => {
    sut.oracle = await Oracle.new(serverAddress);
    sut.wrapper = await OraclizeWrapper.new(sut.oracle.address);
    await sut.oracle.grantAccessToAddress(sut.wrapper.address);
    sut.oar = await OraclizeAddrResolver.new();
    await sut.oar.setAddr(sut.wrapper.address);
    sut.instance = await UsingOraclizeExampleContract.new(sut.oar.address);
  });

  it('should reject request from contract which isn\'t authorized in OraclizeWrapper', async () => {
    // when
    const transaction = sut.instance.updatePrice();

    // then
    return assert.isRejected(transaction);
  });

  it('should emit event that query was sent', async () => {
    // given
    await sut.wrapper.grantAccessToAddress(sut.instance.address);

    // when
    const transaction = await sut.instance.updatePrice();
    const events = transaction.logs;

    // then
    assert.equal(events.length, 1, 'Wrong number of events');
    assert.equal(events[0].event, 'LogNewOraclizeQuery', 'Event name mismatched');
    assert.equal(events[0].args.description, 'Oraclize query was sent, standing by for the answer..', 'Event description mismatched');
  });

  it('should get answer on it\'s request', async () => {
    // given
    await sut.wrapper.grantAccessToAddress(sut.instance.address);
    const transaction1 = await sut.instance.updatePrice();
    const { blockNumber } = transaction1.receipt;
    const id = await getRequestIdFromEvent(sut.oracle, 'DataRequested', blockNumber);

    // when
    const transaction2 = await sut.oracle.fillRequest(id, '1', 0, { from: serverAddress });
    const { blockNumber2 } = transaction2.receipt;
    const events2 = await getEvents(
      sut.instance,
      'LogPriceUpdated',
      blockNumber2,
    );

    // then
    assert.equal(events2.length, 1, 'Wrong number of events');
    assert.equal(events2[0].price, '1', 'Invalid result');
  });

  it('should reject answer from address other than oracle callback', async () => {
    // given
    await sut.wrapper.grantAccessToAddress(sut.instance.address);
    const transaction1 = await sut.instance.updatePrice();
    const { blockNumber } = transaction1.receipt;
    const id = await getRequestIdFromEvent(sut.oracle, 'DataRequested', blockNumber);

    // when
    // eslint-disable-next-line no-underscore-dangle
    const transaction2 = sut.instance.__callback(id, '1', { from: notAServer });

    // then
    return assert.isRejected(transaction2);
  });
});
