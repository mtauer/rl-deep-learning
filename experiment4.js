import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import game from './pandemic-web/src/pandemic-shared/game';
import { forceGC } from './utils';

export default async function runExperiment3(config) {
  const neuralNetwork = new PandemicNeuronalNetwork(config.neuralNetwork);
  await neuralNetwork.init();
  forceGC();
  console.log('Heap used (in MB)', (process.memoryUsage().heapUsed / 1000000).toFixed(3));
  console.log('Tensors', neuralNetwork.getMemory().numTensors);
  for (let j = 0; j < 100; j += 1) {
    for (let i = 0; i < 1000; i += 1) {
      neuralNetwork.predictP(game.toNNState(game.getInitialState()));
      neuralNetwork.predictV(game.toNNState(game.getInitialState()));
    }
    forceGC();
    console.log('Heap used (in MB)', (process.memoryUsage().heapUsed / 1000000).toFixed(3));
    console.log('Tensors', neuralNetwork.getMemory().numTensors);
  }
}
