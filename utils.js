import values from 'lodash/values';
import sum from 'lodash/sum';
import range from 'lodash/range';

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

// TODO move to game class
export function toNNProbabilities(game, p, actions) {
  const pOffset = getPOffset(game);
  const length = sum(values(game.getActionsMaxCount()));
  const probabilities = range(0, length, 0);
  actions.forEach((a, i) => {
    const offset = pOffset[a.type];
    probabilities[offset] = p[i];
    pOffset[a.type] += 1;
  });
  return probabilities;
}

// TODO move to game class
export function fromNNProbabilities(game, p, actions) {
  const pOffset = getPOffset(game);
  const probabilities = [];
  actions.forEach((a) => {
    const offset = pOffset[a.type];
    probabilities.push(p[offset]);
    pOffset[a.type] += 1;
  });
  const pSum = sum(probabilities);
  return probabilities.map(probability => probability / pSum);
}

function getPOffset(game) {
  const actionsMaxCount = game.getActionsMaxCount();
  const actionsOrder = game.getActionsOrder();
  const pOffset = {};
  let offset = 0;
  actionsOrder.forEach((type) => {
    pOffset[type] = offset;
    offset += actionsMaxCount[type];
  });
  return pOffset;
}
