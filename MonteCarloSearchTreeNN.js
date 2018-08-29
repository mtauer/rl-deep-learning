import defaultsDeep from 'lodash/defaultsDeep';
import slice from 'lodash/slice';
import sum from 'lodash/sum';
import range from 'lodash/range';
import max from 'lodash/max';
import sample from 'lodash/sample';

const defaultConfig = {
  simulations: 400,
  cPuct: 1,
  temperature: 1,
  rolloutThreshold: 0,
};

class MonteCarloSearchTreeNN {
  constructor(config = {}) {
    this.config = defaultsDeep(config, defaultConfig);
    this.Q_sa = {}; // stores Q values for s,a
    this.N_sa = {}; // stores #times edge s,a was visited
    this.N_s = {}; // stores #times state s was visited
    this.P_s = {}; // stores initial policy (returned by neural network)
  }

  getActionProbabilities(game, state, neuralNetwork) {
    range(this.config.simulations).forEach(() => {
      this.search(game, state, neuralNetwork);
    });

    const s = game.toKey(state);
    const nValues = range(200)
      .map((i) => {
        const sa = `${s}__${i}`;
        return this.N_sa[sa] || 0;
      })
      .map(v => v ** (1 / this.config.temperature));
    const nSum = sum(nValues);
    return nValues.map(v => v / nSum);
  }

  search(game, state, neuralNetwork) {
    const s = game.toKey(state);

    if (game.hasEnded(state)) {
      return game.getValue(state);
    }

    let validActions;
    let v;

    if (!this.P_s[s]) {
      // This is a leaf node
      this.P_s[s] = neuralNetwork.predictP(game.toNNInput(state));
      validActions = game.getValidActions(state);
      this.P_s[s] = slice(this.P_s[s], 0, validActions.length);
      const sumP = sum(this.P_s[s]);
      if (sumP === 0) {
        // eslint-disable-next-line no-console
        // console.log('Warning: All valid moves were masked.');
        this.P_s[s] = validActions.map(() => 1.0 / validActions.length);
      } else {
        this.P_s[s] = this.P_s[s].map(x => x / sumP);
      }
      if (Math.random() < this.config.rolloutThreshold) {
        v = getRolloutValue(game, state);
      } else {
        v = neuralNetwork.predictV(game.toNNInput(state));
      }

      return v;
    }

    validActions = game.getValidActions(state).map((a, index) => ({ ...a, index }));
    // Upper confidence bound
    const ucbQValues = validActions.map((a, i) => {
      const sa = `${s}__${i}`;
      const q = this.Q_sa[sa] || 0.0;
      const ucb = !this.N_s[s] || !this.N_sa[sa]
        ? this.config.cPuct * this.P_s[s][i]
        : this.config.cPuct * this.P_s[s][i] * Math.sqrt(this.N_s[s]) / (1 + this.N_sa[sa]);
      return q + ucb;
    });

    const maxUcbQ = max(ucbQValues);
    const nextAction = sample(validActions.filter((a, i) => ucbQValues[i] === maxUcbQ));
    const nextState = game.performAction(state, nextAction);
    v = this.search(game, nextState, neuralNetwork);

    const sa = `${s}__${nextAction.index}`;
    if (!this.Q_sa[sa]) {
      this.Q_sa[sa] = v;
      this.N_sa[sa] = 1;
    } else {
      this.Q_sa[sa] = (this.N_sa[sa] * this.Q_sa[sa] + v) / (this.N_sa[sa] + 1);
      this.N_sa[sa] += 1;
    }

    this.N_s[s] = this.N_s[s] ? this.N_s[s] + 1 : 1;
    return v;
  }
}

function getRolloutValue(game, state) {
  if (game.hasEnded(state)) { return game.getValue(state); }
  const nextAction = sample(game.getValidActions(state));
  const nextState = game.performAction(state, nextAction);
  return getRolloutValue(game, nextState);
}

export default MonteCarloSearchTreeNN;
