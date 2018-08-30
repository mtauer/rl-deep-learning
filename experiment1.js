import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import initialState from './pandemic-web/src/pandemic-shared/initialState.json';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import game from './pandemic-web/src/pandemic-shared/game';

const config = {
  iterations: 5,
  episodes: 2000,
  mcts: {
    simulations: 10,
    cPuct: 1.0,
    cUcb1: 1.4,
    temperature: 1,
    rolloutThreshold: 0.5,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 30,
  },
};

export default async function runExperiment1(socket) {
  const state = initialState;
  const nn = new PandemicNeuronalNetwork(config.neuralNetwork);
  await nn.init();

  const mcts = new MonteCarloTreeSearchNN(config.mcts);
  for (let i = 0; i < 10; i += 1) {
    mcts.search(game, state, nn);
  }
  if (socket) {
    socket.emit('simulation_start', {
      predictedPValues: mcts.getPredictedPValues(game, state, nn),
      validActions: game.getValidActions(state),
    });
  }
}
