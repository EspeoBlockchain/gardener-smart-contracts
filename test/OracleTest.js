const { assert, EVMRevert, getRequestIdFromEvent } = require('./utils');
const timeController = require('./utils/timeController');

const Oracle = artifacts.require('Oracle');
const UsingOracle = artifacts.require('UsingOracle');

const ONE_DAY = web3.utils.toBN(60 * 60 * 24);

contract('Oracle', (accounts) => {
  const sut = {};
  const serverAddress = accounts[1];

  beforeEach(async () => {
    sut.instance = await Oracle.new(serverAddress);
    sut.usingOracle = await UsingOracle.new(sut.instance.address);
    await sut.instance.grantAccessToAddress(sut.usingOracle.address);
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
    await sut.instance.grantAccessToAddress(accounts[0]);

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
    const id = await getRequestIdFromEvent(sut.instance, 'DataRequested', blockNumber);

    // when
    const transaction2 = await sut.instance.fillRequest(id, '1', 0, { from: serverAddress });
    const requestFulfilledEvents = transaction2.logs;

    // then
    assert.equal(requestFulfilledEvents.length, 1, 'Wrong number of events');
    assert.equal(requestFulfilledEvents[0].event, 'RequestFulfilled', 'Event name mismatched');
    assert.equal(requestFulfilledEvents[0].args.value, '1', 'Passed wrong value');
    assert.equal(requestFulfilledEvents[0].args.errorCode, 0, 'Error passed');
    assert.notEqual(requestFulfilledEvents[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should emit RequestFulfilled event with non zero errorCode when invalid request sent', async () => {
    // given
    const url = 'invalidrequest';
    const transaction1 = await sut.usingOracle.request(url);
    const { blockNumber } = transaction1.receipt;
    const id = await getRequestIdFromEvent(sut.instance, 'DataRequested', blockNumber);

    // when
    const transaction2 = await sut.instance.fillRequest(id, '', 1, { from: serverAddress });
    const requestFulfilledEvents = transaction2.logs;

    // then
    assert.equal(requestFulfilledEvents.length, 1, 'Wrong number of events');
    assert.equal(requestFulfilledEvents[0].event, 'RequestFulfilled', 'Event name mismatched');
    assert.equal(requestFulfilledEvents[0].args.value, '', 'Value should be empty when errorCode is passed');
    assert.equal(requestFulfilledEvents[0].args.errorCode, 1, 'Error should be passed');
    assert.notEqual(requestFulfilledEvents[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should reject fulfilling request from address other than trusted server address', async () => {
    // given
    const url = 'someurl.example.com';
    const transaction1 = await sut.usingOracle.request(url);
    const { blockNumber } = transaction1.receipt;
    const id = await getRequestIdFromEvent(sut.instance, 'DataRequested', blockNumber);

    // when
    const transaction2 = sut.instance.fillRequest(id, '1', 0);

    // then
    return assert.isRejected(transaction2, EVMRevert);
  });

  it('should reject fulfilling request for request id which doesn\'t exist', async () => {
    // given
    const randomId = web3.utils.sha3('random');

    // when
    const transaction2 = sut.instance.fillRequest(randomId, '1', 0);

    // then
    return assert.isRejected(transaction2, EVMRevert);
  });

  it('should reject fulfilling already accepted reqeust', async () => {
    // given
    const url = 'someurl.example.com';
    const transaction1 = await sut.usingOracle.request(url);
    const { blockNumber } = transaction1.receipt;
    const id = await getRequestIdFromEvent(sut.instance, 'DataRequested', blockNumber);
    await sut.instance.fillRequest(id, '1', 0, { from: serverAddress });

    // when
    const transaction2 = sut.instance.fillRequest(id, '2', 0, { from: serverAddress });

    // then
    return assert.isRejected(transaction2, EVMRevert);
  });

  it('should emit DelayedDataRequested event when accepting reqeust for valid timestamp in seconds', async () => {
    // given
    const url = 'someurl.example.com';
    const delayInSeconds = 900;
    const transaction = await sut.usingOracle.delayedRequest(url, delayInSeconds);
    const { blockNumber } = transaction.receipt;
    const id = await getRequestIdFromEvent(sut.instance, 'DelayedDataRequested', blockNumber);
    timeController.addSeconds(delayInSeconds);

    // when
    const transaction1 = await sut.instance.fillRequest(id, '2', 0, { from: serverAddress });
    const requestFulfilledEvents = transaction1.logs;

    // then
    assert.equal(requestFulfilledEvents.length, 1, 'Wrong number of events');
    assert.equal(requestFulfilledEvents[0].event, 'RequestFulfilled', 'Event name mismatched');
    assert.equal(requestFulfilledEvents[0].args.value, '2', 'Passed wrong value');
    assert.notEqual(requestFulfilledEvents[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should reject fulfill request for request id with invalid timestamp in seconds', async () => {
    // given
    const url = 'someurl.example.com';
    const delayInSeconds = 1000;
    const transaction = await sut.usingOracle.delayedRequest(url, delayInSeconds);
    const { blockNumber } = transaction.receipt;
    timeController.addSeconds(10);
    const id = await getRequestIdFromEvent(sut.instance, 'DelayedDataRequested', blockNumber);


    // when
    const transaction1 = sut.instance.fillRequest(id, '2', 0, { from: serverAddress });

    // then
    return assert.isRejected(transaction1, EVMRevert);
  });

  it('should emit RequestFullfilled event when fulfill request with valid delay as timestamp', async () => {
    // given
    const url = 'someurl.example.com';
    const delayAsTimestamp = (await timeController.currentTimestamp()).add(ONE_DAY);

    const transaction = await sut.usingOracle.delayedRequest(url, delayAsTimestamp);
    const { blockNumber } = transaction.receipt;
    timeController.addDays(1);
    const id = await getRequestIdFromEvent(sut.instance, 'DelayedDataRequested', blockNumber);

    // when
    const transaction1 = await sut.instance.fillRequest(id, '2', 0, { from: serverAddress });
    const requestFulfilledEvents = transaction1.logs;

    // then
    assert.equal(requestFulfilledEvents.length, 1, 'Wrong number of events');
    assert.equal(requestFulfilledEvents[0].event, 'RequestFulfilled', 'Event name mismatched');
    assert.equal(requestFulfilledEvents[0].args.value, '2', 'Passed wrong value');
    assert.notEqual(requestFulfilledEvents[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should reject fulfilling request for invalid request delay as timestamp', async () => {
    // given
    const url = 'someurl.example.com';
    const delayInSeconds = (await timeController.currentTimestamp()).add(ONE_DAY);
    const transaction = await sut.usingOracle.delayedRequest(url, delayInSeconds);
    const { blockNumber } = transaction.receipt;
    const id = await getRequestIdFromEvent(sut.instance, 'DelayedDataRequested', blockNumber);

    // when
    const transaction1 = sut.instance.fillRequest(id, '2', 0, { from: serverAddress });

    // then
    return assert.isRejected(transaction1, EVMRevert);
  });

  it('should emit DelayedDataRequested event, when accepting request with given proper delay time in second', async () => {
    // given
    const url = 'someurl.example.com';
    const delayTime = 10;

    // when
    const transaction = await sut.instance.delayedRequest(url, delayTime);
    const events = transaction.logs;
    // then
    assert.equal(events.length, 1, 'Wrong number of events');
    assert.equal(events[0].event, 'DelayedDataRequested', 'Event name mismatched');
    assert.equal(events[0].args.url, url, 'Passed wrong event');
    assert.notEqual(events[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should revert DelayedDataRequested event when given delay time is at least 2 years', async () => {
    // given
    const url = 'someurl.example.com';
    const exceededDelayTime = 90000000;

    // when
    const transaction = sut.instance.delayedRequest(url, exceededDelayTime);

    // then
    return assert.isRejected(transaction, EVMRevert);
  });

  it('should emit DelayedDataRequested event, when accepting request with given proper delay time as timestamp', async () => {
    // given
    const url = 'someurl.example.com';
    const delayTimestamp = 1577836800; // 2020/01/01 00:00:00 written in unix timestamp.

    // when
    const transaction = await sut.instance.delayedRequest(url, delayTimestamp);
    const events = transaction.logs;

    // then
    assert.equal(events.length, 1, 'Wrong number of events');
    assert.equal(events[0].event, 'DelayedDataRequested', 'Event name mismatched');
    assert.equal(events[0].args.url, url, 'Passed wrong event');
    assert.notEqual(events[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should revert DelayedDataRequested event when given delay timestamp is unreachable', async () => {
    // given
    const url = 'someurl.example.com';
    const exceededDelayTimestamp = 4102444801; // 2100/01/01 00:00:00 written in unix timestamp.

    // when
    const transaction = sut.instance.delayedRequest(url, exceededDelayTimestamp);

    // then
    return assert.isRejected(transaction, EVMRevert);
  });
});
