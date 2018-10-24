import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import defaultsDeep from 'lodash/defaultsDeep';

const defaultConfig = {
  modelPath: 'pandemic-light/nn-models/',
  trainingEpochs: 20,
};

const INPUT_UNITS = 299;
const HIDDEN_LAYER_UNITS = 400;
const P_OUTPUT_UNITS = 385;
const V_OUTPUT_UNITS = 1;

export default class PandemicNeuronalNetwork {
  constructor(config = {}) {
    this.config = defaultsDeep(config, defaultConfig);
    this.description = 'Uses 2 separate models (for p and v) and for each model 2 fully connected hidden layers (with 400 neurons each). Input: a single state. Output for p: probabilities of action parameters (sigmoid activation).';
  }

  getDescription() {
    return this.description;
  }

  // // Deprecated
  // // TODO: delete this method
  // async init() {
  //   try {
  //     const pModelPath = `file://${this.config.modelPath}pModel-${packageJson.version}-rules-0/model.json`;
  //     // eslint-disable-next-line no-console
  //     console.log(`-> Loading p model from path "${pModelPath}"`);
  //     this.pModel = await tf.loadModel(pModelPath);
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.error('Could not load model. It will be created from scratch.');
  //     this.pModel = tf.sequential({
  //       layers: [
  //         tf.layers.dense(
  //           { units: HIDDEN_LAYER_UNITS, inputShape: [INPUT_UNITS], activation: 'relu' }),
  //         tf.layers.dense({ units: HIDDEN_LAYER_UNITS, activation: 'relu' }),
  //         tf.layers.dense({ units: P_OUTPUT_UNITS, activation: 'relu' }),
  //       ],
  //     });
  //   }
  //   this.pModel.compile({
  //     optimizer: 'adam',
  //     loss: 'meanSquaredError',
  //     metrics: ['accuracy'],
  //   });
  //   this.pModel.summary();
  //   try {
  //     const vModelPath = `file://${this.config.modelPath}vModel-${packageJson.version}-rules-0/model.json`;
  //     // eslint-disable-next-line no-console
  //     console.log(`-> Loading v model from path "${vModelPath}"`);
  //     this.vModel = await tf.loadModel(vModelPath);
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.error('Could not load model. It will be created from scratch.');
  //     this.vModel = tf.sequential({
  //       layers: [
  //         tf.layers.dense(
  //          { units: HIDDEN_LAYER_UNITS, inputShape: [INPUT_UNITS], activation: 'relu' }),
  //         tf.layers.dense({ units: HIDDEN_LAYER_UNITS, activation: 'relu' }),
  //         tf.layers.dense({ units: V_OUTPUT_UNITS, activation: 'tanh' }),
  //       ],
  //     });
  //   }
  //   this.vModel.compile({
  //     optimizer: 'sgd',
  //     loss: 'meanSquaredError',
  //     metrics: ['accuracy'],
  //   });
  //   this.vModel.summary();
  // }

  predictP(s) {
    return tf.tidy(() => {
      const p = this.pModel.predict(tf.tensor2d([s]));
      const res = p.dataSync();
      return res;
    });
  }

  predictV(s) {
    return tf.tidy(() => {
      const v = this.vModel.predict(tf.tensor2d([s]));
      const res = v.dataSync()[0];
      return res;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getMemory() {
    return tf.memory();
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
          console.log('pModel Training Epoch', epoch + 1, logs);
        },
      },
    });
    await this.vModel.fit(trainingStates, trainingV, {
      epochs: this.config.trainingEpochs,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log('vModel Training Epoch', epoch + 1, logs);
        },
      },
    });
  }

  build() {
    this.pModel = tf.sequential({
      layers: [
        tf.layers.dense({ units: HIDDEN_LAYER_UNITS, activation: 'relu', inputShape: [INPUT_UNITS] }),
        tf.layers.dense({ units: HIDDEN_LAYER_UNITS, activation: 'relu' }),
        tf.layers.dense({ units: P_OUTPUT_UNITS, activation: 'sigmoid' }),
      ],
    });
    this.vModel = tf.sequential({
      layers: [
        tf.layers.dense({ units: HIDDEN_LAYER_UNITS, activation: 'relu', inputShape: [INPUT_UNITS] }),
        tf.layers.dense({ units: HIDDEN_LAYER_UNITS, activation: 'relu' }),
        tf.layers.dense({ units: V_OUTPUT_UNITS, activation: 'tanh' }),
      ],
    });
    this.compile();
  }

  async load(directory) {
    this.pModel = await tf.loadModel(`file://${directory}/pModel/model.json`);
    this.vModel = await tf.loadModel(`file://${directory}/vModel/model.json`);
    this.compile();
  }

  async save(directory) {
    await this.pModel.save(`file://${directory}/pModel`);
    await this.vModel.save(`file://${directory}/vModel`);
  }

  compile() {
    this.pModel.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
    this.pModel.summary();
    this.vModel.compile({
      optimizer: 'sgd',
      loss: 'meanSquaredError',
      metrics: ['accuracy'],
    });
    this.vModel.summary();
  }
}
