import fill from 'lodash/fill';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import flatten from 'lodash/flatten';
import sum from 'lodash/sum';

import { allActions } from './pandemic-web/src/pandemic-shared/game';

export function randomChoice(p) {
  let random = Math.random();
  return p.findIndex((a) => {
    random -= a;
    return random < 0;
  });
}

export function sleep(timeInMs) {
  return new Promise(resolve => setTimeout(resolve, timeInMs));
}

export async function retry(times, func, ignoreErrorFunc = () => false) {
  const waitingTime = 30 * 1000;
  for (let i = 0; i < (times - 1); i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await func();
    } catch (err) {
      if (ignoreErrorFunc(err)) {
        return new Promise((resolve, reject) => reject(err));
      }
      // eslint-disable-next-line no-console
      console.log(`# Operation failed. ${err}`);
      console.log(`-> Retry in ${waitingTime / 1000} s`);
      // eslint-disable-next-line no-await-in-loop
      await sleep(waitingTime);
    }
  }
  return func();
}

export function forceGC() {
  if (global.gc) { global.gc(); }
}

export function zeros(length) {
  return fill(Array(length), 0);
}

export function manyToValue(indexOrIndices, value, length) {
  const buffer = zeros(length);
  const indices = isArray(indexOrIndices) ? indexOrIndices : [indexOrIndices];
  indices.forEach((i) => {
    buffer[i] = value;
  });
  return buffer;
}

// TODO move to game class
export function toNetworkProbabilities(game, actions, actionProbabilities) {
  // TODO:
  // combine action and probbility
  // group actions
  // get action buffers
  // get action buffers for discover cure
  // concat action buffers
  const actionsWithP = actions.map((a, i) => ({ ...a, p: actionProbabilities[i] }));
  const result = [];
  result.push(bufferByType(actionsWithP, allActions.DO_NOTHING, () => 0, 1));
  result.push(bufferByType(actionsWithP, allActions.DRIVE_FERRY, a => a.to, 48));
  result.push(bufferByType(actionsWithP, allActions.DIRECT_FLIGHT, a => a.to, 48));
  result.push(bufferByType(actionsWithP, allActions.CHARTER_FLIGHT, a => a.to, 48));
  result.push(bufferByType(actionsWithP, allActions.SHUTTLE_FLIGHT, a => a.to, 48));
  result.push(bufferByType(actionsWithP, allActions.BUILD_RESEARCH_CENTER, a => a.at, 48));
  result.push(bufferByType(actionsWithP, allActions.DISCARD_CARD, a => a.card, 48));
  result.push(bufferByType(actionsWithP, allActions.SHARE_KNOWLEDGE, a => a.card, 48));
  result.push(bufferByType(actionsWithP, allActions.DISCOVER_CURE, a => a.usedCards, 48));
  return flatten(result);

  function bufferByType(array, type, indexFunc, length) {
    const filteredArray = array.filter(a => a.type === type);
    if (isEmpty(filteredArray)) { return zeros(length); }
    const buffersArray = filteredArray.map(a => manyToValue(indexFunc(a), a.p, length));
    const buffer = buffersArray[0].map((_, i) => {
      const values = buffersArray.map(b => b[i]);
      return sum(values);
    });
    return buffer;
  }
}

// TODO move to game class
// export function fromNetworkProbabilities(game, actions, networkProbabilities) {
//   // TODO
// }
