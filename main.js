import Coach from './coach';

const coach = new Coach({
  iterations: 5,
  episodes: 20,
  mcst: {
    simulations: 800,
    cPuct: 1,
    temperature: 1,
    rolloutThreshold: 0.25,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 30,
  },
});

coach.train();

// import MonteCarloSearchTreeNN from './MonteCarloSearchTreeNN';
// import initialState from './pandemic-light/initialState.json';
// import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
// import game from './pandemic-light/game';
//
// const config = {
//   iterations: 5,
//   episodes: 2000,
//   mcst: {
//     simulations: 10,
//     cPuct: 0,
//     temperature: 1,
//     rolloutThreshold: 0.5,
//   },
//   neuralNetwork: {
//     modelPath: 'pandemic-light/nn-models/',
//     trainingEpochs: 40,
//   },
// };
//
// async function main() {
//   const state = initialState;
//   const nn = new PandemicNeuronalNetwork(config.neuralNetwork);
//   await nn.init();
//
//   const mcst = new MonteCarloSearchTreeNN(config.mcst);
//   for (let i = 0; i < 800; i += 1) {
//     mcst.search(game, state, nn);
//   }
//   console.log('getPsValues', mcst.getPsValues(game, state));
//   console.log('getQsaValues', mcst.getQsaValues(game, state));
//   console.log('getNsaValues', mcst.getNsaValues(game, state));
//   console.log('getUcbQValues', mcst.getUcbQValues(game, state));
//   console.log('getValidActions', game.getValidActions(state));
// }
//
// main();
