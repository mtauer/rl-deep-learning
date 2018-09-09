import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import defaultsDeep from 'lodash/defaultsDeep';

import packageJson from '../package.json';

const defaultConfig = {
  modelPath: 'pandemic-light/nn-models/',
  trainingEpochs: 20,
};

const INPUT_UNITS = 299;
const HIDDEN_LAYER_UNITS = 400;
const P_OUTPUT_UNITS = 77;
const V_OUTPUT_UNITS = 1;

export default class PandemicNeuronalNetwork {
  constructor(config = {}) {
    this.config = defaultsDeep(config, defaultConfig);
  }

  async init() {
    try {
      const pModelPath = `file://${this.config.modelPath}pModel-${packageJson.version}-rules-0/model.json`;
      // eslint-disable-next-line no-console
      console.log(`-> Loading p model from path "${pModelPath}"`);
      this.pModel = await tf.loadModel(pModelPath);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Could not load model. It will be created from scratch.');
      this.pModel = tf.sequential({
        layers: [
          tf.layers.dense({ units: HIDDEN_LAYER_UNITS, inputShape: [INPUT_UNITS], activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: HIDDEN_LAYER_UNITS, activation: 'relu' }),
          tf.layers.dense({ units: P_OUTPUT_UNITS, activation: 'softmax' }),
        ],
      });
    }
    this.pModel.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
    this.pModel.summary();
    try {
      const vModelPath = `file://${this.config.modelPath}vModel-${packageJson.version}-rules-0/model.json`;
      // eslint-disable-next-line no-console
      console.log(`-> Loading v model from path "${vModelPath}"`);
      this.vModel = await tf.loadModel(vModelPath);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Could not load model. It will be created from scratch.');
      this.vModel = tf.sequential({
        layers: [
          tf.layers.dense({ units: HIDDEN_LAYER_UNITS, inputShape: [INPUT_UNITS], activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: HIDDEN_LAYER_UNITS, activation: 'relu' }),
          tf.layers.dense({ units: V_OUTPUT_UNITS, activation: 'tanh' }),
        ],
      });
    }
    this.vModel.compile({
      optimizer: 'sgd',
      loss: 'meanSquaredError',
      metrics: ['accuracy'],
    });
    this.vModel.summary();
  }

  predictP(s) {
    const p = this.pModel.predict(tf.tensor2d([s]));
    return p.dataSync();
  }

  predictV(s) {
    const v = this.vModel.predict(tf.tensor2d([s]));
    return v.dataSync()[0];
  }

  evaluate(testExamples) {
    const testStates = tf.tensor2d(testExamples.map(e => e.s), undefined, 'bool');
    const testP = tf.tensor2d(testExamples.map(e => e.pValues), undefined, 'float32');
    const testV = tf.tensor2d(testExamples.map(e => [e.vValue]), undefined, 'float32');
    const resP = this.pModel.evaluate(testStates, testP);
    console.log('probabilities loss and accuracy', resP[0].dataSync()[0], resP[1].dataSync()[0]);
    const resV = this.vModel.evaluate(testStates, testV);
    console.log('v value loss and accuracy', resV[0].dataSync()[0], resV[1].dataSync()[0]);
  }

  async train(trainingExamples) {
    const trainingStates = tf.tensor2d(trainingExamples.map(e => e.s), undefined, 'bool');
    const trainingP = tf.tensor2d(trainingExamples.map(e => e.pValues), undefined, 'float32');
    const trainingV = tf.tensor2d(trainingExamples.map(e => [e.vValue]), undefined, 'float32');
    await this.pModel.fit(trainingStates, trainingP, {
      epochs: this.config.trainingEpochs,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log('pModel onEpochEnd', epoch + 1, logs);
        },
      },
    });
    await this.pModel.save(`file://${this.config.modelPath}pModel-${packageJson.version}-rules-0`);
    await this.vModel.fit(trainingStates, trainingV, {
      epochs: this.config.trainingEpochs,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log('vModel onEpochEnd', epoch + 1, logs);
        },
      },
    });
    await this.vModel.save(`file://${this.config.modelPath}vModel-${packageJson.version}-rules-0`);
  }

  async save() {
    await this.pModel.save(`file://${this.config.modelPath}pModel-${packageJson.version}-rules-0`);
    await this.vModel.save(`file://${this.config.modelPath}vModel-${packageJson.version}-rules-0`);
  }
}
