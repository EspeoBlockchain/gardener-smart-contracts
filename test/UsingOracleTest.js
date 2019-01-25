const { assert, getRequestIdFromEvent } = require('./utils');

const UsingOracle = artifacts.require('UsingOracle');
const Oracle = artifacts.require('Oracle');


contract('UsingOracle', (accounts) => {
  const sut = {};
  const serverAddress = accounts[1];

  beforeEach(async () => {
    sut.oracle = await Oracle.new(serverAddress);
    sut.instance = await UsingOracle.new(sut.oracle.address);
    await sut.oracle.grantAccessToAddress(sut.instance.address);
  });

  it('should show oracle address', async () => {
    // when
    const oracleAddress = await sut.instance.oracle();

    // then
    assert.equal(oracleAddress, sut.oracle.address, 'Oracle address doesn\'t match');
  });

  it('should emit DataRequestedFromOracle event when requesting data', async () => {
    // given
    const url = 'someurl.example.com';

    // when
    const transaction = await sut.instance.request(url);
    const events = transaction.logs;

    // then
    assert.equal(events.length, 1, 'Wrong number of events');
    assert.equal(events[0].event, 'DataRequestedFromOracle', 'Event name mismatched');
    assert.equal(events[0].args.url, url, 'Passed wrong event');
    assert.notEqual(events[0].args.id, '0x0000000000000000000000000000000000000000000000000000000000000000', 'Request id is zero');
  });

  it('should emit DataReadFromOracle event when get data on callback from oracle', async () => {
    // given
    const url = 'someurl.example.com';
    const transaction = await sut.instance.request(url);
    const { blockNumber } = transaction.receipt;
    const id = await getRequestIdFromEvent(sut.instance, 'DataRequestedFromOracle', blockNumber);

    // when
    const transaction2 = await sut.oracle.fillRequest(id, '1', 0, { from: serverAddress });
    const { blockNumber: blockNumber2 } = transaction2.receipt;

    // then
    const events = (await sut.instance.getPastEvents('DataReadFromOracle', {
      filter: { id },
      fromBlock: blockNumber2,
      toBlock: blockNumber2,
    })).map(event => event.returnValues);

    assert.equal(events.length, 1, 'Wrong number of events');
    assert.equal(events[0].id, id, 'Request id doesn\'t match');
    assert.equal(events[0].value, '1', 'Readed value doesn\'t match');
  });

  it('should reject callback from address other than oracle', async () => {
    // given
    const url = 'someurl.example.com';
    const transaction = await sut.instance.request(url);
    const { blockNumber } = transaction.receipt;
    const id = await getRequestIdFromEvent(sut.instance, 'DataRequestedFromOracle', blockNumber);

    // when
    const transaction2 = sut.instance.__callback(id, '1', 0); // eslint-disable-line no-underscore-dangle

    // then
    return assert.isRejected(transaction2);
  });
});
