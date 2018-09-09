import memwatchNext from 'memwatch-next';

import Coach from './coach';
import Monitor from './monitor';
// import runExperiment3 from './experiment3';

memwatchNext.on('leak', info => console.log('+++ leak', info));

const monitor = new Monitor();
const config = {
  iterations: 2,
  trainingEpisodes: 300,
  playingEpisodes: 50,
  mcts: {
    playingSimulations: 400,
    trainingSimulations: 800,
    cPuct: 1.0,
    cUcb1: 0.7,
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
coach.initNN(monitor);
// coach.play(monitor);
// coach.generateTrainingData(monitor);
// coach.train(monitor);
// coach.evaluate(monitor);

// runExperiment3(config, monitor);
