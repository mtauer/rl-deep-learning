import Coach from './coach';

const coach = new Coach({
  iterations: 1,
  episodes: 10,
  mcts: {
    simulations: 4000,
    cPuct: 1.0,
    cUcb1: 1.4,
    temperature: 1,
    rolloutThreshold: 0.5,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 30,
  },
});

coach.train();

// import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
// import initialState from './pandemic-web/src/pandemic-shared/initialState.json';
// import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
// import game from './pandemic-web/src/pandemic-shared/game';
//
// const config = {
//   iterations: 5,
//   episodes: 2000,
//   mcts: {
//     simulations: 10,
//     cPuct: 1.0,
//     cUcb1: 1.4,
//     temperature: 1,
//     rolloutThreshold: 0.5,
//   },
//   neuralNetwork: {
//     modelPath: 'pandemic-light/nn-models/',
//     trainingEpochs: 30,
//   },
// };
//
// async function main() {
//   const state = initialState;
//   const nn = new PandemicNeuronalNetwork(config.neuralNetwork);
//   await nn.init();
//
//   const mcts = new MonteCarloTreeSearchNN(config.mcts);
//   for (let i = 0; i < 4000; i += 1) {
//     mcts.search(game, state, nn);
//   }
//   console.log('getPsValues', mcts.getPsValues(game, state));
//   console.log('getQsaValues', mcts.getQsaValues(game, state));
//   console.log('getNsaValues', mcts.getNsaValues(game, state));
//   console.log('getUcbSumValues', mcts.getUcbSumValues(game, state));
//   console.log('getValidActions', game.getValidActions(state));
// }
//
// main();
