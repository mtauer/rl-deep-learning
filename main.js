import Coach from './coach';
// import Monitor from './monitor';
import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
// import runExperiment4 from './experiment4';

const config = {
  iterations: 2,
  trainingEpisodes: 1000,
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
    trainingEpochs: 12,
  },
};

const monitor = undefined; // new Monitor();
const googleCloudStorage = new GoogleCloudStorage();
const coach = new Coach(config, googleCloudStorage, googleCloudStorage);

// coach.play(monitor);
coach.generateTrainingData(monitor, 0);
// coach.summarizeIteration(monitor, 0);
// coach.train(monitor, 2);
// coach.evaluate(monitor);

// runExperiment4(config);
