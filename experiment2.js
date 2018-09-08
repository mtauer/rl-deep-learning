// import { getTestExamples } from './pandemic-light/testData';
import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import initialState from './pandemic-web/src/pandemic-shared/initialState3.json';

export default async function runExperiment1(config, monitor) {
  monitor.addListener({
    onConnection: showTestExamples(config, monitor),
  });
}

function showTestExamples(config, monitor) {
  return async function show() {
    const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
    await neuralNetwork.init();
    const mcts = new MonteCarloTreeSearchNN(config.mcts, game, neuralNetwork, monitor);
    // const testExamples = getTestExamples();
    for (let i = 0; i < 1; i += 1) {
      mcts.getActionProbabilities(initialState, i);
      // eslint-disable-next-line no-await-in-loop
      await sleep(6000);
    }
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
