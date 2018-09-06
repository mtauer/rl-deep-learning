import Coach from './coach';
import Monitor from './monitor';
// import runExperiment2 from './experiment2';

const monitor = new Monitor();
const config = {
  iterations: 2,
  trainingEpisodes: 300,
  playingEpisodes: 40,
  mcts: {
    simulations: 400,
    cPuct: 1.0,
    cUcb1: 0.3,
    temperature: 1,
    explorationSteps: 28,
    rolloutThreshold: 0,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 16,
  },
};

const coach = new Coach(config);
coach.play(monitor);
// coach.train(monitor);
// coach.evaluate(monitor);

// runExperiment2(config, monitor);
