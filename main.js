import Coach from './coach';
import Monitor from './monitor';

const monitor = new Monitor();

const coach = new Coach({
  iterations: 2,
  episodes: 500,
  mcts: {
    simulations: 500,
    cPuct: 1.0,
    cUcb1: 0.7,
    temperature: 1,
    rolloutThreshold: 0.1,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 25,
  },
});

coach.generateTrainingData(monitor);
// coach.train(monitor);
// coach.evaluate(monitor);
