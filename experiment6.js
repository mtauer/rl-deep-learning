import fs from 'fs';

import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';

const googleCloudStorage = new GoogleCloudStorage();

async function e6(version, iteration, layer) {
  const neuralNetwork = new PandemicNeuronalNetwork();
  await googleCloudStorage.readModel(neuralNetwork, iteration, version);
  const weights = neuralNetwork.pModel.layers[layer].getWeights()
    .map(w => ({ ...w, data: Array.from(w.dataSync()) }));

  fs.writeFileSync(`pandemic-web/src/neuralNetwork/weights_${version}__${iteration}__layer_${layer}.json`, JSON.stringify(weights));
}

e6('0.4.2', 3, 0);
