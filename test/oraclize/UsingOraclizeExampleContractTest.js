const { assert, getEvents } = require('../utils');

const UsingOraclizeExampleContract = artifacts.require('UsingOraclizeExampleContract');
const OraclizeWrapper = artifacts.require('OraclizeWrapper');
const OraclizeAddrResolver = artifacts.require('OraclizeAddrResolver');
const Oracle = artifacts.require('Oracle');


contract('UsingOraclizeExampleContract', (accounts) => {
  const sut = {};
  const serverAddress = accounts[1];

  beforeEach(async () => {
    sut.oracle = await Oracle.new(serverAddress);
    sut.wrapper = await OraclizeWrapper.new(sut.oracle.address);
    await sut.oracle.grantAccessToAddress(sut.wrapper.address);
    sut.oar = await OraclizeAddrResolver.new();
    await sut.oar.setAddr(sut.wrapper.address);
    sut.instance = await UsingOraclizeExampleContract.new(sut.oar.address);
  });


  it('should emit event that query was sent', async () => {
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
    const transaction1 = await sut.instance.updatePrice();
    const { blockNumber } = transaction1.receipt;
    const events = await getEvents(
      sut.oracle,
      { eventName: 'DataRequested', eventArgs: {} },
      { fromBlock: blockNumber, toBlock: blockNumber },
    );
    const { id } = events[0];

    // when
    const transaction2 = await sut.oracle.fillRequest(id, '1', 0, { from: serverAddress });
    const { blockNumber2 } = transaction2.receipt;
    const events2 = await getEvents(
      sut.instance,
      { eventName: 'LogPriceUpdated', eventArgs: {} },
      { fromBlock: blockNumber2, toBlock: blockNumber2 },
    );

    // then
    assert.equal(events2.length, 1, 'Wrong number of events');
    assert.equal(events2[0].price, '1', 'Invalid result');
  });
});
