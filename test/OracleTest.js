const { assert, EVMRevert, getEvents } = require('./utils');

const Oracle = artifacts.require('Oracle');
const UsingOracle = artifacts.require('UsingOracle');

contract('Oracle', (accounts) => {
  const sut = {};
  const serverAddress = accounts[1];

  beforeEach(async () => {
    sut.instance = await Oracle.new(serverAddress);
    sut.usingOracle = await UsingOracle.new(sut.instance.address);
  });

  it('should show server address it trusts', async () => {
    // when
    const trustedServer = await sut.instance.trustedServer();

    // then
    assert.equal(trustedServer, serverAddress, 'Oracle trusted server doesn\'t match one passend in the constructor');
  });

  it('should emit DataRequested event, when accepting request', async () => {
    // given
    const url = 'someurl.example.com';

    // when
    const transaction = await sut.instance.request(url);
    const events = transaction.logs;

    // then
    assert.equal(events.length, 1, 'Wrong number of events');
    assert.equal(events[0].event, 'DataRequested', 'Event name mismatched');
    assert.equal(events[0].args.url, url, 'Passed wrong event');
    assert.notEqual(events[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should emit RequestFulfilled event, when server fulfilled request', async () => {
    // given
    const url = 'someurl.example.com';
    const transaction1 = await sut.usingOracle.request(url);
    const { blockNumber } = transaction1.receipt;
    const events = await getEvents(
      sut.instance,
      { eventName: 'DataRequested', eventArgs: {} },
      { fromBlock: blockNumber, toBlock: blockNumber },
    );
    const { id } = events[0];

    // when
    const transaction2 = await sut.instance.fillRequest(id, '1', { from: serverAddress });
    const requestFulfilledEvents = transaction2.logs;

    // then
    assert.equal(requestFulfilledEvents.length, 1, 'Wrong number of events');
    assert.equal(requestFulfilledEvents[0].event, 'RequestFulfilled', 'Event name mismatched');
    assert.equal(requestFulfilledEvents[0].args.value, '1', 'Passed wrong value');
    assert.notEqual(requestFulfilledEvents[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should reject fulfilling request from address other than trusted server address', async () => {
    // given
    const url = 'someurl.example.com';
    const transaction1 = await sut.usingOracle.request(url);
    const { blockNumber } = transaction1.receipt;
    const events = await getEvents(
      sut.instance,
      { eventName: 'DataRequested', eventArgs: {} },
      { fromBlock: blockNumber, toBlock: blockNumber },
    );
    const { id } = events[0];

    // when
    const transaction2 = sut.instance.fillRequest(id, '1');

    // then
    return assert.isRejected(transaction2, EVMRevert);
  });

  it('should reject fulfilling request for request id which doesn\'t exist', async () => {
    // given
    const randomId = web3.sha3('');

    // when
    const transaction2 = sut.instance.fillRequest(randomId, '1');

    // then
    return assert.isRejected(transaction2, EVMRevert);
  });

  it('should reject fulfilling already accepted reqeust', async () => {
    // given
    const url = 'someurl.example.com';
    const transaction1 = await sut.usingOracle.request(url);
    const { blockNumber } = transaction1.receipt;
    const events = await getEvents(
      sut.instance,
      { eventName: 'DataRequested', eventArgs: {} },
      { fromBlock: blockNumber, toBlock: blockNumber },
    );
    const { id } = events[0];
    await sut.instance.fillRequest(id, '1', { from: serverAddress });

    // when
    const transaction2 = sut.instance.fillRequest(id, '2', { from: serverAddress });

    // then
    return assert.isRejected(transaction2, EVMRevert);
  });
});