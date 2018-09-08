import MonteCarloTreeSearchNN2 from './MonteCarloTreeSearchNN2';
import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';

export default async function runExperiment3(config, monitor) {
  monitor.addListener({
    onConnection: showTestExamples(config, monitor),
  });
}

function showTestExamples(config, monitor) {
  return async function show() {
    const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
    await neuralNetwork.init();
    const mcts = new MonteCarloTreeSearchNN2(config.mcts, game, neuralNetwork);
    for (let i = 0; i < 400; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await mcts.step();
    }
    if (monitor) {
      monitor.updateSimulation(mcts, mcts.root.state);
    }
  };
}
