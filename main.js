import Coach from './coach';
import Monitor from './monitor';
import FileStorage from './pandemic-light/fileStorage';
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

const monitor = new Monitor();
const storage = new FileStorage();
const coach = new Coach(config);

// coach.play(storage, monitor);
coach.generateTrainingData(storage, monitor, 1);
// coach.train(storage, monitor, 1);
// coach.evaluate(storage, monitor);

// runExperiment4(config);
