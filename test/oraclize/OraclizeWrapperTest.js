const { assert } = require('../utils');

const OraclizeWrapper = artifacts.require('OraclizeWrapper');
const Oracle = artifacts.require('Oracle');

contract('OraclizeWrapper', (accounts) => {
  const sut = {};
  const serverAddress = accounts[1];

  beforeEach(async () => {
    sut.oracle = await Oracle.new(serverAddress);
    sut.instance = await OraclizeWrapper.new(sut.oracle.address);
  });

  it('should reject query if sender is not authorized', async () => {
    // given
    const timestamp = Date.now();
    const datasource = 'RANDOM';
    const arg = 'something';

    // when
    const transaction = sut.instance.query(timestamp, datasource, arg);

    // then
    return assert.isRejected(transaction);
  });

  it('should reject query if datasource other than URL passed', async () => {
    // given
    await sut.instance.grantAccessToAddress(accounts[0]);
    const timestamp = Date.now();
    const datasource = 'RANDOM';
    const arg = 'something';

    // when
    const transaction = sut.instance.query(timestamp, datasource, arg);

    // then
    return assert.isRejected(transaction);
  });

  it('should throw error when query_withGasLimit invoked', async () => {
    // given
    await sut.instance.grantAccessToAddress(accounts[0]);
    const timestamp = Date.now();
    const datasource = 'URL';
    const arg = 'json(example.com).key1';
    const gasLimit = 100000;

    // when
    const transaction = sut.instance.query_withGasLimit(timestamp, datasource, arg, gasLimit);

    // then
    return assert.isRejected(transaction);
  });

  it('should throw error when query2 invoked', async () => {
    // given
    await sut.instance.grantAccessToAddress(accounts[0]);
    const timestamp = Date.now();
    const datasource = 'URL';
    const arg = 'json(example.com).key1';
    const arg2 = 'key2:value2';

    // when
    const transaction = sut.instance.query2(timestamp, datasource, arg, arg2);

    // then
    return assert.isRejected(transaction);
  });
  it('should throw error when query2_withGasLimit invoked', async () => {
    // given
    await sut.instance.grantAccessToAddress(accounts[0]);
    const timestamp = Date.now();
    const datasource = 'URL';
    const arg = 'json(example.com).key1';
    const arg2 = 'key2:value2';
    const gasLimit = 100000;

    // when
    const transaction = sut.instance.query2_withGasLimit(
      timestamp,
      datasource,
      arg,
      arg2,
      gasLimit,
    );

    // then
    return assert.isRejected(transaction);
  });

  it('should throw error when queryN invoked', async () => {
    // given
    await sut.instance.grantAccessToAddress(accounts[0]);
    const timestamp = Date.now();
    const datasource = 'URL';
    const arg = 'json(example.com).key1';

    // when
    const transaction = sut.instance.queryN(timestamp, datasource, arg);

    // then
    return assert.isRejected(transaction);
  });

  it('should throw error when queryN_withGasLimit invoked', async () => {
    // given
    await sut.instance.grantAccessToAddress(accounts[0]);
    const timestamp = Date.now();
    const datasource = 'URL';
    const arg = 'json(example.com).key1';
    const gasLimit = 100000;

    // when
    const transaction = sut.instance.queryN_withGasLimit(timestamp, datasource, arg, gasLimit);

    // then
    return assert.isRejected(transaction);
  });

  it('should return 0 when check for query price without gas limit', async () => {
    // when
    const result = await sut.instance.methods['getPrice(string)'].call('URL');

    // then
    assert.equal(result, 0);
  });

  it('should return 0 when check for query price with gas limit', async () => {
    // when
    const result = await sut.instance.getPrice.call('URL', 10000);

    // then
    assert.equal(result, 0);
  });

  it('should throw error when trying to set proof type', async () => {
    // when
    const transaction = sut.instance.setProofType(1);

    // then
    return assert.isRejected(transaction);
  });

  it('should throw error when trying to change gas price', async () => {
    // when
    const transaction = sut.instance.setCustomGasPrice(1);

    // then
    return assert.isRejected(transaction);
  });

  it('should throw error when randomDS_getSessionPubKeyHash invoked', async () => {
    // when
    const query = sut.instance.randomDS_getSessionPubKeyHash();

    // then
    return assert.isRejected(query);
  });
});
