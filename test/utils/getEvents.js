/* global module */
const _ = require('lodash');

const searchForEvents = (event, eventArgs, params) => new Promise((resolve, reject) => {
  event(eventArgs, params).get((error, logs) => {
    if (error) {
      reject(error);
    }

    const predicate = ({ args }) => {
      const filteredArgs = _.pick(args, Object.keys(eventArgs));

      return _.isEqual(filteredArgs, eventArgs);
    };

    resolve(logs.filter(predicate));
  });
});

const getEvents = async (contract, { eventName, eventArgs }, params) => {
  const contractEvent = contract[eventName];
  const eventParams = Object.assign({}, { fromBlock: 0, toBlock: 'latest' }, params);

  return (await searchForEvents(contractEvent, eventArgs, eventParams)).map(event => event.args);
};

module.exports = getEvents;
