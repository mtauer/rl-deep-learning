import fs from 'fs';

import GoogleCloudStorage from './pandemic-light/googleCloudStorage';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';

const googleCloudStorage = new GoogleCloudStorage();

async function e6(version, iteration) {
  const neuralNetwork = new PandemicNeuronalNetwork();
  await googleCloudStorage.readModel(neuralNetwork, iteration, version);
  const weights = neuralNetwork.pModel.layers[0].getWeights()
    .map(w => ({ ...w, data: Array.from(w.dataSync()) }));

  fs.writeFileSync('pandemic-web/src/neuralNetwork/weights_0_3_2__17__layer_0.json', JSON.stringify(weights));
}

e6('0.3.2', 17);
