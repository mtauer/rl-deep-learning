import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import range from 'lodash/range';

export default class PandemicNeuronalNetwork {
  constructor() {
    this.pModel = tf.sequential({
      layers: [
        tf.layers.dense({ units: 512, inputShape: [299], activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 200, activation: 'softmax' }),
      ],
    });
    this.pModel.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    this.vModel = tf.sequential({
      layers: [
        tf.layers.dense({ units: 512, inputShape: [299], activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1, activation: 'tanh' }),
      ],
    });
    this.vModel.compile({
      optimizer: 'sgd',
      loss: 'meanSquaredError',
      metrics: ['accuracy'],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  predictP() {
    return range(200).map(() => Math.random());
  }

  // eslint-disable-next-line class-methods-use-this
  predictV() {
    return (Math.random() * 2.0) - 1.0;
  }

  async train(trainingExamples) {
    const trainingStates = tf.tensor2d(trainingExamples.map(e => e[0]), undefined, 'bool');
    const trainingP = tf.tensor2d(trainingExamples.map(e => e[1]), undefined, 'float32');
    const trainingV = tf.tensor2d(trainingExamples.map(e => [e[3]]), undefined, 'float32');
    await this.pModel.fit(trainingStates, trainingP, {
      epochs: 50,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log('pModel onEpochEnd', epoch + 1, logs);
        },
      },
    });
    await this.vModel.fit(trainingStates, trainingV, {
      epochs: 20,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log('vModel onEpochEnd', epoch + 1, logs);
        },
      },
    });
  }
}
