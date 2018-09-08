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

export function toModelProbabilities(game, p, actions) {
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

export function fromModelProbabilities(game, p, actions) {
  const pOffset = getPOffset(game);
  const probabilities = [];
  actions.forEach((a) => {
    const offset = pOffset[a.type];
    probabilities.push(p[offset]);
    pOffset[a.type] += 1;
  });
  return probabilities;
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
