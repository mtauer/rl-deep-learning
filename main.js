import Coach from './coach';

const coach = new Coach({
  iterations: 5,
  episodes: 20,
  mcts: {
    simulations: 800,
    cPuct: 1,
    temperature: 1,
    rolloutThreshold: 0,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 40,
  },
});

coach.train();
