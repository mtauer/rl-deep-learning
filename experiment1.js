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
    rolloutThreshold: 0.0,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 30,
  },
};

export default async function runExperiment1(socket) {
  const state = initialState;
  const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
  await neuralNetwork.init();

  const mcts = new MonteCarloTreeSearchNN(config.mcts, game, neuralNetwork);
  for (let i = 0; i < 400; i += 1) {
    mcts.search(state);
  }
  if (socket) {
    socket.emit('simulation_update', {
      state,
      validActions: game.getValidActions(state),
      predictedPValues: mcts.getPredictedPValues(state),
      predictedVValues: [mcts.getPredictedVValue(state)],
      naValues: mcts.getNsaValues(state),
      qaValues: mcts.getQsaValues(state),
      ucbSumValues: mcts.getUcbSumValues(state),
    });
  }
}
