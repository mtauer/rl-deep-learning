import Coach from './coach';
// import Monitor from './monitor';
import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
// import runExperiment4 from './experiment4';

const config = {
  iterations: 2,
  trainingEpisodes: 500,
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
    tag: '',
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 16,
  },
};

// const monitor = new Monitor();
const storage = new GoogleCloudStorage();
// const coach = new Coach(config);

// console.log('storage', storage);

// coach.play(storage, monitor);
// coach.generateTrainingData(storage, undefined, 1);
// coach.train(storage, monitor, 1);
// coach.evaluate(storage, monitor);

// runExperiment4(config);
