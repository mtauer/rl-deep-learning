import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';

const googleCloudStorage = new GoogleCloudStorage();

async function e6(version, iteration) {
  const neuralNetwork = new PandemicNeuronalNetwork();
  await googleCloudStorage.readModel(neuralNetwork, iteration, version);
  const weights = neuralNetwork.pModel.getWeights();
  console.log('weights', weights);
  // console.log('weights', weights[1].dataSync());
}

e6('0.3.2', 7);
