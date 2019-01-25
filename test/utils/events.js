/* global module */

const getEvents = async (contract, eventName, blockNumber) => {
  const events = await contract.getPastEvents(eventName, {
    fromBlock: blockNumber,
    toBlock: blockNumber,
  });

  return events.map(event => event.returnValues);
};

const getRequestIdFromEvent = async (contract, eventName, blockNumber) => {
  const events = (await contract.getPastEvents(eventName, {
    fromBlock: blockNumber,
    toBlock: blockNumber,
  })).map(event => event.returnValues);

  return events[0].id;
};

module.exports = { getRequestIdFromEvent, getEvents };
