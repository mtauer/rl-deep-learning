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
      { ...config.mcts, trainingSimulations: 1600 }, game, neuralNetwork, monitor,
    );
    const { nextAction } = await mcts.getActionProbabilities();
    // mcts.root.print(undefined, game);
    forceGC();
    console.log(process.memoryUsage().heapUsed / 1000);
    // console.log('root 1', mcts.root);
    console.log('++++++++++++++++');
    const nextState = game.performAction(mcts.root.state, nextAction);
    mcts.performAction(nextAction, nextState);
    // mcts.root.print(undefined, game);
    // console.log('root 2', mcts.root);
    forceGC();
    console.log(process.memoryUsage().heapUsed / 1000);
  };
}
