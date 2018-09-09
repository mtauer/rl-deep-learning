import ProgressBar from 'progress';

import MonteCarloTreeSearchNN2 from './MonteCarloTreeSearchNN2';
import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';

export default async function runExperiment3(config, monitor) {
  await showTestExamples(config, monitor)();
}

function showTestExamples(config, monitor) {
  return async function show() {
    const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
    await neuralNetwork.init();
    const mcts = new MonteCarloTreeSearchNN2(config.mcts, game, neuralNetwork, monitor);
    const res = await executeEpisode(mcts, false);
    console.log('res', res);
  };
}

async function executeEpisode(mcts, isTraining = true) {
  let step = 0;
  const bar = new ProgressBar('[:bar] :elapsed :ended', { total: 100, head: '>', incomplete: ' ' });
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { nextAction } = await mcts
      .getActionProbabilities(step, isTraining);
    bar.tick({ ended: 0 });
    // Perform action and get new state
    const nextState = game.performAction(mcts.root.state, nextAction);
    mcts.performAction(nextAction, nextState);
    if (game.hasEnded(nextState)) {
      const vValue = game.getValue(nextState);
      return {
        vValue,
      };
    }
    step += 1;
  }
}
