import fs from 'fs';

import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';

const googleCloudStorage = new GoogleCloudStorage();

async function e6(version, iteration) {
  const neuralNetwork = new PandemicNeuronalNetwork();
  await googleCloudStorage.readModel(neuralNetwork, iteration, version);
  const weights = neuralNetwork.pModel.layers[3].getWeights()
    .map(w => ({ ...w, data: Array.from(w.dataSync()) }));

  fs.writeFileSync('weights_0_3_2__7__layer_3.json', JSON.stringify(weights));
}

e6('0.3.2', 7);
