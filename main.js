import Coach from './coach';
import Monitor from './monitor';

const monitor = new Monitor();

const coach = new Coach({
  iterations: 2,
  episodes: 500,
  mcts: {
    simulations: 400,
    cPuct: 1.0,
    cUcb1: 0.7,
    temperature: 1,
    rolloutThreshold: 0.0,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 25,
  },
});

// coach.play(monitor);
// coach.train(monitor);
coach.evaluate(monitor);
