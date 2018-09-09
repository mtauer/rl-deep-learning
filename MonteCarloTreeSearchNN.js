/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */

import defaultsDeep from 'lodash/defaultsDeep';
import isEmpty from 'lodash/isEmpty';
import repeat from 'lodash/repeat';
import max from 'lodash/max';
import sample from 'lodash/sample';
import sum from 'lodash/sum';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';

import { sleep, randomChoice, fromNNProbabilities } from './utils';

const defaultConfig = {
  playingSimulations: 400,
  trainingSimulations: 800,
  cPuct: 1,
  cUcb1: Math.sqrt(2),
  temperature: 1,
  explorationSteps: 20,
  rolloutThreshold: 0,
};

export default class MonteCarloTreeSearchNN {
  constructor(config = {}, game, neuralNetwork, monitor) {
    this.config = defaultsDeep(config, defaultConfig);
    this.game = game;
    this.neuralNetwork = neuralNetwork;
    this.monitor = monitor;
    this.reset();
  }

  reset() {
    this.root = new StateNode(this.game.getInitialState(), false);
    this.simulationsEnded = 0;
  }

  async getActionProbabilities(step = 0, isTraining = true) {
    this.simulationsEnded = 0;
    const simulations = isTraining
      ? this.config.trainingSimulations
      : this.config.playingSimulations;
    for (let i = 0; i < simulations; i += 1) {
      this.runSimulation();
      // Do not block the Node.js event loop
      await sleep(0);
    }
    if (this.monitor) {
      this.monitor.updateSimulation(this, this.root.state);
    }
    const temperature = isTraining && (step < this.config.explorationSteps)
      ? this.config.temperature
      : 0.01;
    const nValues = this.getNsaValues()
      .map(n => n ** temperature);
    const nSum = sum(nValues);
    const probabilities = nValues.map(v => v / nSum);
    const nextActionIndex = randomChoice(probabilities);
    const validActions = this.game.getValidActions(this.root.state);
    return {
      probabilities,
      nextAction: validActions[nextActionIndex],
      stats: { simulationsEnded: this.simulationsEnded },
    };
  }

  runSimulation() {
    let currentStateNode;
    // 1. Tree traversal
    currentStateNode = this.traverseTree(this.root);
    // 2. Node expansion
    currentStateNode = this.expandNode(currentStateNode);
    // 3. Rollout / predict v value
    const vValue = this.getVValue(currentStateNode);
    // 4. Back propagation
    this.backPropagateValue(currentStateNode, vValue);
    // 5. Update UCB values
    this.calculateUCBValues(this.root);
  }

  performAction(action, state) {
    const actionNode = find(this.root.actionNodes,
      an => isEqual(an.action, action));
    let stateNode = find(actionNode.stateNodes,
      sn => this.game.toKey(sn.state) === this.game.toKey(state));
    if (!stateNode) {
      stateNode = new StateNode(state, this.game.hasEnded(state));
    }
    stateNode.parent = undefined;
    this.root = stateNode;
  }

  traverseTree(stateNode) {
    const { state } = stateNode;
    if (stateNode.isLeaf()) { return stateNode; }

    const maxUcb = max(stateNode.actionNodes.map(an => an.ucb));
    const actionNodes = stateNode.actionNodes.filter(an => an.ucb === maxUcb);
    const actionNode = sample(actionNodes);

    const nextState = this.game.performAction(state, actionNode.action);
    const nextStateNodes = actionNode.stateNodes
      .filter(sn => this.game.toKey(sn.state) === this.game.toKey(nextState));
    if (nextStateNodes[0]) { return this.traverseTree(nextStateNodes[0]); }

    return actionNode.createAndAddStateNode(nextState, this.game.hasEnded(nextState));
  }

  expandNode(stateNode) {
    const { state, hasEnded } = stateNode;
    if (hasEnded) {
      return stateNode;
    }

    const validActions = this.game.getValidActions(state);
    const actionNodes = stateNode.createAndAddActionNodes(validActions);
    const probabilities = fromNNProbabilities(
      this.game,
      this.neuralNetwork.predictP(this.game.toNNState(state)),
      validActions,
    );
    actionNodes.forEach((actionNode, i) => {
      actionNode.p = probabilities[i];
    });
    const actionIndex = randomChoice(probabilities);
    const nextState = this.game.performAction(state, validActions[actionIndex]);
    const nextStateNode = actionNodes[actionIndex]
      .createAndAddStateNode(nextState, this.game.hasEnded(nextState));
    return nextStateNode;
  }

  getVValue(stateNode) {
    const { state, hasEnded } = stateNode;
    if (hasEnded) {
      this.simulationsEnded += 1;
      return this.game.getValue(state);
    }
    if (Math.random() < this.config.rolloutThreshold) {
      return getRolloutValue(this.game, state);
    }
    return this.neuralNetwork.predictV(this.game.toNNState(state));

    function getRolloutValue(game, s) {
      if (game.hasEnded(s)) { return game.getValue(s); }
      const nextAction = sample(game.getValidActions(s));
      const nextState = game.performAction(s, nextAction);
      return getRolloutValue(game, nextState);
    }
  }

  backPropagateValue(node, value) {
    if (!node) { return; }
    if (node.q !== undefined) {
      node.q = (node.q * node.n + value) / (node.n + 1);
    }
    node.n += 1;
    this.backPropagateValue(node.parent, value);
  }

  calculateUCBValues(stateNode) {
    const { n: N } = stateNode;
    const { cUcb1, cPuct } = this.config;
    stateNode.actionNodes.forEach((actionNode) => {
      const { q, p, n } = actionNode;
      const ucb1 = !n
        ? q + cUcb1 * 1
        : q + cUcb1 * Math.sqrt(Math.log(this.root.n) / n);
      const puct = cPuct * p * Math.sqrt(N) / (1 + n);
      actionNode.ucb = ucb1 + puct;
      actionNode.stateNodes.forEach((sn) => {
        this.calculateUCBValues(sn);
      });
    });
  }

  getPredictedPValues() {
    const validActions = this.game.getValidActions(this.root.state);
    const probabilities = fromNNProbabilities(
      this.game,
      this.neuralNetwork.predictP(this.game.toNNState(this.root.state)),
      validActions,
    );
    return probabilities;
  }

  getPredictedVValue() {
    const v = this.neuralNetwork.predictV(this.game.toNNState(this.root.state));
    return v;
  }

  getQsaValues() {
    const { actionNodes } = this.root;
    return actionNodes.map(an => an.q);
  }

  getNsaValues() {
    const { actionNodes } = this.root;
    return actionNodes.map(an => an.n);
  }

  getPsaValues() {
    const { actionNodes } = this.root;
    const nValues = actionNodes
      .map(an => an.n)
      .map(v => v ** (1 / this.config.temperature));
    const nSum = sum(nValues);
    return nValues.map(v => v / nSum);
  }

  getUcbSumValues() {
    const { actionNodes } = this.root;
    return actionNodes.map(an => an.ucb);
  }

  getGame() {
    return this.game;
  }
}

export class ActionNode {
  constructor(action, parent) {
    this.stateNodes = [];
    this.parent = parent;
    this.n = 0;
    this.w = 0;
    this.q = 0;
    this.p = 0;
    this.ucb = Number.POSITIVE_INFINITY;
    this.action = action;
  }

  createAndAddStateNode(state, hasEnded) {
    const newStateNode = new StateNode(state, hasEnded, this);
    this.stateNodes = [...this.stateNodes, newStateNode];
    return newStateNode;
  }

  print(depth = 0, game) {
    // eslint-disable-next-line no-console
    console.log(repeat('  ', depth), '+-', this.n, this.q.toFixed(3), this.ucb.toFixed(3), this.action.type);
    this.stateNodes.forEach((stateNode) => {
      stateNode.print(depth + 1, game);
    });
  }
}

export class StateNode {
  constructor(state, hasEnded, parent) {
    this.actionNodes = [];
    this.parent = parent;
    this.n = 0;
    this.state = state;
    this.hasEnded = hasEnded;
  }

  isLeaf() {
    return isEmpty(this.actionNodes);
  }

  createAndAddActionNodes(actions) {
    const newActionNodes = actions.map(a => new ActionNode(a, this));
    this.actionNodes = [...this.actionNodes, ...newActionNodes];
    return newActionNodes;
  }

  print(depth = 0, game) {
    // eslint-disable-next-line no-console
    console.log(repeat('  ', depth), '+-', game ? game.toKey(this.state) : '');
    this.actionNodes.forEach((actionNode) => {
      actionNode.print(depth + 1, game);
    });
  }
}
