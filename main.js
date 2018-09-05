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
    cUcb1: 0.7,
    temperature: 1,
    explorationSteps: 20,
    rolloutThreshold: 0,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 12,
  },
};

const coach = new Coach(config);
coach.generateTrainingData(monitor);
// coach.train(monitor);
// coach.evaluate(monitor);

// runExperiment2(config, monitor);
