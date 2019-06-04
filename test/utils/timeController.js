/* global web3, module */

module.exports = (() => {
  const mineBlock = () => (
    new Promise((resolve, reject) => web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime(),
    }, (error, result) => (error ? reject(error) : resolve(result.result)))));

  const addSeconds = seconds => (
    new Promise((resolve, reject) => web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [seconds],
      id: new Date().getTime(),
    }, (error, result) => (error ? reject(error) : resolve(result.result)))).then(mineBlock));

  const addDays = days => addSeconds(days * 24 * 60 * 60);

  const currentTimestamp = async () => {
    const currentBlockNumber = await web3.eth.getBlockNumber();
    const currentBlock = await web3.eth.getBlock(currentBlockNumber);

    return web3.utils.toBN(currentBlock.timestamp);
  };

  return {
    addSeconds,
    addDays,
    currentTimestamp,
  };
})();
