import Coach from './coach';
// import Monitor from './monitor';
import FileStorage from './pandemic-light/fileStorage';
import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
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
    trainingEpochs: 16,
  },
};

const monitor = undefined; // new Monitor();
const trainingEpisodesStorage = new GoogleCloudStorage();
const modelStorage = new FileStorage();
const coach = new Coach(config, trainingEpisodesStorage, modelStorage);

async function experiment() {
  const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
  await modelStorage.readModel(neuralNetwork, 0, config.neuralNetwork.tag);
  trainingEpisodesStorage.writeModel(neuralNetwork, 0, config.neuralNetwork.ta);
}

experiment();

// trainingEpisodesStorage.experiment();

// coach.play(monitor);
// coach.generateTrainingData(monitor, 2);
// coach.summarizeIteration(monitor, 0);
// coach.train(monitor, 1);
// coach.evaluate(monitor);

// runExperiment4(config);
