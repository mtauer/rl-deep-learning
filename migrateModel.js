import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import { writeModel } from './pandemic-light/storage';

const config = {
  tag: '',
  modelPath: 'pandemic-light/nn-models/',
  trainingEpochs: 16,
};

async function migrateModel() {
  const neuralNetwork = new PandemicNeuronalNetwork(config);
  await neuralNetwork.init();
  writeModel(neuralNetwork, 0);
}

migrateModel();
