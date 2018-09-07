import defaultsDeep from 'lodash/defaultsDeep';
import slice from 'lodash/slice';
import sum from 'lodash/sum';
import range from 'lodash/range';
import max from 'lodash/max';
import sample from 'lodash/sample';

import { randomChoice } from './utils';

const defaultConfig = {
  playingSimulations: 400,
  trainingSimulations: 800,
  cPuct: 1,
  cUcb1: Math.sqrt(2),
  temperature: 1,
  explorationSteps: 20,
  rolloutThreshold: 0,
};

class MonteCarloTreeSearchNN {
  constructor(config = {}, monitor) {
    this.config = defaultsDeep(config, defaultConfig);
    this.Q_sa = {}; // stores Q values for s,a
    this.N_sa = {}; // stores #times edge s,a was visited
    this.N_s = {}; // stores #times state s was visited
    this.P_s = {}; // stores initial policy (returned by neural network)
    this.N = 0;
    this.monitor = monitor;
  }

  async getActionProbabilities(game, state, neuralNetwork, step, isTraining) {
    this.simulationsEnded = 0;
    const simulations = isTraining
      ? this.config.trainingSimulations
      : this.config.playingSimulations;
    for (let i = 0; i < simulations; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(0);
      this.search(game, state, neuralNetwork);
    }
    if (this.monitor) {
      this.monitor.updateSimulation(this, game, state, neuralNetwork);
    }

    const temperature = isTraining && (step < this.config.explorationSteps)
      ? this.config.temperature
      : 0.01;
    const s = game.toKey(state);
    const nValues = range(200)
      .map((i) => {
        const sa = `${s}__${i}`;
        return this.N_sa[sa] || 0;
      });
      //
    const nSum = sum(nValues);
    const probabilities = nValues.map(v => v / nSum);
    const temperatureNValues = nValues.map(v => v ** (1 / temperature));
    const temperatureNSum = sum(temperatureNValues);
    const temperatureProbabilities = temperatureNValues.map(v => v / temperatureNSum);
    const nextActionIndex = randomChoice(temperatureProbabilities);
    const validActions = game.getValidActions(state);
    return {
      probabilities,
      nextAction: validActions[nextActionIndex],
      stats: { simulationsEnded: this.simulationsEnded },
    };
  }

  search(game, state, neuralNetwork) {
    const s = game.toKey(state);

    if (game.hasEnded(state)) {
      this.simulationsEnded += 1;
      return game.getValue(state);
    }

    let validActions;
    let v;

    if (!this.P_s[s]) {
      // This is a leaf node
      const probabilities = neuralNetwork.predictP(game.toNNInput(state));
      validActions = game.getValidActions(state);
      this.P_s[s] = slice(probabilities, 0, validActions.length);
      const sumP = sum(this.P_s[s]);
      if (sumP === 0) {
        // eslint-disable-next-line no-console
        // console.log('Warning: All valid moves were masked.');
        this.P_s[s] = validActions.map(() => 1.0 / validActions.length);
      } else {
        this.P_s[s] = this.P_s[s].map(x => x / sumP);
      }
      if (Math.random() < this.config.rolloutThreshold) {
        this.simulationsEnded += 1;
        v = getRolloutValue(game, state);
      } else {
        v = neuralNetwork.predictV(game.toNNInput(state));
      }

      return v;
    }

    validActions = game.getValidActions(state).map((a, index) => ({ ...a, index }));
    // Upper confidence bound
    const ucbSumValues = this.getUcbSumValues(game, state);
    const maxUcbSum = max(ucbSumValues);
    const nextAction = sample(validActions.filter((a, i) => ucbSumValues[i] === maxUcbSum));
    const nextState = game.performAction(state, nextAction);
    v = this.search(game, nextState, neuralNetwork);

    const sa = `${s}__${nextAction.index}`;
    if (!this.Q_sa[sa]) {
      this.Q_sa[sa] = v;
      this.N_sa[sa] = 1;
      this.N += 1;
    } else {
      this.Q_sa[sa] = (this.N_sa[sa] * this.Q_sa[sa] + v) / (this.N_sa[sa] + 1);
      this.N_sa[sa] += 1;
      this.N += 1;
    }

    this.N_s[s] = this.N_s[s] ? this.N_s[s] + 1 : 1;
    return v;
  }

  // eslint-disable-next-line class-methods-use-this
  getPredictedPValues(game, state, neuralNetwork) {
    const p = neuralNetwork.predictP(game.toNNInput(state));
    const validActions = game.getValidActions(state);
    return slice(p, 0, validActions.length);
  }

  // eslint-disable-next-line class-methods-use-this
  getPredictedVValue(game, state, neuralNetwork) {
    const v = neuralNetwork.predictV(game.toNNInput(state));
    return v;
  }

  getPsValues(game, state) {
    const s = game.toKey(state);
    const validActions = game.getValidActions(state).map((a, index) => ({ ...a, index }));
    // Upper confidence bound
    return validActions.map((a, i) => this.P_s[s][i] || 0.0);
  }

  getQsaValues(game, state) {
    const s = game.toKey(state);
    const validActions = game.getValidActions(state).map((a, index) => ({ ...a, index }));
    // Upper confidence bound
    return validActions.map((a, i) => {
      const sa = `${s}__${i}`;
      return this.Q_sa[sa] || 0.0;
    });
  }

  getNsaValues(game, state) {
    const s = game.toKey(state);
    const validActions = game.getValidActions(state).map((a, index) => ({ ...a, index }));
    // Upper confidence bound
    return validActions.map((a, i) => {
      const sa = `${s}__${i}`;
      return this.N_sa[sa] || 0.0;
    });
  }

  getPsaValues(game, state) {
    const s = game.toKey(state);
    const validActions = game.getValidActions(state).map((a, index) => ({ ...a, index }));
    const nValues = validActions
      .map((a, i) => {
        const sa = `${s}__${i}`;
        return this.N_sa[sa] || 0;
      })
      .map(v => v ** (1 / this.config.temperature));
    const nSum = sum(nValues);
    return nValues.map(v => v / nSum);
  }

  getUcbSumValues(game, state) {
    const s = game.toKey(state);
    const validActions = game.getValidActions(state).map((a, index) => ({ ...a, index }));
    return validActions.map((a, i) => {
      const sa = `${s}__${i}`;
      const q = this.Q_sa[sa] || 0.0;
      const ucb1 = !this.N_sa[sa]
        ? q + this.config.cUcb1 * 2
        : q + this.config.cUcb1 * Math.sqrt(Math.log(this.N) / this.N_sa[sa]);
      const puct = !this.N_s[s] || !this.N_sa[sa]
        ? this.config.cPuct * this.P_s[s][i]
        : this.config.cPuct * this.P_s[s][i] * Math.sqrt(this.N_s[s]) / (1 + this.N_sa[sa]);
      return ucb1 + puct;
    });
  }
}

function getRolloutValue(game, state) {
  if (game.hasEnded(state)) { return game.getValue(state); }
  const nextAction = sample(game.getValidActions(state));
  const nextState = game.performAction(state, nextAction);
  return getRolloutValue(game, nextState);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default MonteCarloTreeSearchNN;
