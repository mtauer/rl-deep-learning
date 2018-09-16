import FileStorage from './pandemic-light/fileStorage';
import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';

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
const fileStorage = new FileStorage();
const googleCloudStorage = new GoogleCloudStorage();

async function migrateModels() {
  await migrateModel(0);
  await migrateModel(1);
  await migrateModel(2);
  await migrateModel(3);
}

async function migrateModel(iteration) {
  const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
  await fileStorage.readModel(neuralNetwork, iteration);
  await googleCloudStorage.writeModel(neuralNetwork, iteration);
}

migrateModels();
