import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import { forceGC } from './utils';

export default async function runExperiment3(config, monitor) {
  await showTestExamples(config, monitor)();
}

function showTestExamples(config, monitor) {
  return async function show() {
    const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
    await neuralNetwork.init();
    const mcts = new MonteCarloTreeSearchNN(
      { ...config.mcts, trainingSimulations: 3200 }, game, neuralNetwork, monitor,
    );
    forceGC();
    await mcts.getActionProbabilities();
    forceGC();
    console.log('Heap used (in MB)', (process.memoryUsage().heapUsed / 1000000).toFixed(3));
    mcts.reset();
    forceGC();
    console.log('Heap used (in MB)', (process.memoryUsage().heapUsed / 1000000).toFixed(3));
  };
}
