import Datastore from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';
import uuidv4 from 'uuid/v4';
import fs from 'fs-extra';
import padStart from 'lodash/padStart';

import googleCloudConfig from './googleCloudConfig.json';
import packageJson from '../package.json';

const TRAINING_EPISODE = 'TrainingEpisode';
const ITERATION_SUMMARY = 'IterationSummary';

export default class GoogleCloudStorage {
  constructor() {
    this.datastore = new Datastore(googleCloudConfig);
    this.storage = new Storage(googleCloudConfig);
  }

  async experiment() {
    const filename = './pandemic-light/v0.1.0_iteration_000_model/pModel/weights.bin';
    return this.storage
      .bucket('pandemic-models')
      .upload(filename, {
        destination: 'v0.1.0_iteration_000_model/pModel/weights.bin',
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: 'public, max-age=31536000',
        },
      })
      .then(() => {
        console.log('File uploaded');
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
  }

  async readTrainingEpisodes(iteration) {
    console.log('Loading training episodes from Datastore');
    const query = this.datastore.createQuery(TRAINING_EPISODE)
      .filter('version', '=', packageJson.version)
      .filter('iteration', '=', iteration);
    return this.datastore
      .runQuery(query)
      .then(results => results[0].map(entity => entity.trainingEpisode));
  }

  async writeTrainingEpisode(trainingEpisode, iteration) {
    console.log('Writing training episode to Datastore');
    const name = uuidv4();
    const key = this.datastore.key([TRAINING_EPISODE, name]);
    const trainingEpisodeEntity = {
      key,
      data: {
        createdAt: new Date().toISOString(),
        version: packageJson.version,
        iteration,
        trainingEpisode,
      },
    };
    return this.datastore.save(trainingEpisodeEntity);
  }

  async writeIterationSummary(iterationSummary, iteration) {
    console.log('Writing iteration summary to Datastore');
    const name = uuidv4();
    const key = this.datastore.key([ITERATION_SUMMARY, name]);
    const iterationSummaryEntity = {
      key,
      data: {
        createdAt: new Date().toISOString(),
        version: packageJson.version,
        iteration,
        iterationSummary,
      },
    };
    return this.datastore.save(iterationSummaryEntity);
  }

  async readModel(neuralNetwork, iteration, tag) {
    const bucketDirectory = this.getModelBucketDirectory(iteration, tag);
    console.log('Downloading model from', bucketDirectory);
    const tempDirectory = this.getModelTempDirectory();
    fs.ensureDirSync(`${tempDirectory}/pModel`);
    fs.ensureDirSync(`${tempDirectory}/vModel`);
    try {
      await Promise.all([
        this.downloadFile(tempDirectory, bucketDirectory, 'pModel', 'model.json'),
        this.downloadFile(tempDirectory, bucketDirectory, 'pModel', 'weights.bin'),
        this.downloadFile(tempDirectory, bucketDirectory, 'vModel', 'model.json'),
        this.downloadFile(tempDirectory, bucketDirectory, 'vModel', 'weights.bin'),
      ]);
      await neuralNetwork.load(tempDirectory);
    } catch (err) {
      if (err.code === 404) {
        // If the model does not exist initialize it with random weights and
        // upload it.
        await neuralNetwork.build();
        await this.writeModel(neuralNetwork, iteration, tag);
      } else {
        // eslint-disable-next-line no-console
        console.log('Could not download the model', err.code);
      }
    }
    fs.removeSync(tempDirectory);
  }

  async writeModel(neuralNetwork, iteration, tag) {
    const bucketDirectory = this.getModelBucketDirectory(iteration, tag);
    console.log('Uploading model to', bucketDirectory);
    const tempDirectory = this.getModelTempDirectory();
    fs.ensureDirSync(tempDirectory);
    await neuralNetwork.save(tempDirectory);
    await Promise.all([
      this.uploadFile(tempDirectory, bucketDirectory, 'pModel', 'model.json'),
      this.uploadFile(tempDirectory, bucketDirectory, 'pModel', 'weights.bin'),
      this.uploadFile(tempDirectory, bucketDirectory, 'vModel', 'model.json'),
      this.uploadFile(tempDirectory, bucketDirectory, 'vModel', 'weights.bin'),
    ]);
    fs.removeSync(tempDirectory);
  }

  // eslint-disable-next-line class-methods-use-this
  getModelBucketDirectory(iteration, tag = '') {
    const iterationString = padStart(iteration, 3, '0');
    const directory = `model_v${packageJson.version}${tag}_iteration_${iterationString}`;
    return directory;
  }

  // eslint-disable-next-line class-methods-use-this
  getModelTempDirectory() {
    return `./temp_model_${uuidv4()}`;
  }

  async downloadFile(localDirectory, bucketDirectory, sharedDirectory, filename) {
    return this.storage
      .bucket('pandemic-models')
      .file(`${bucketDirectory}/${sharedDirectory}/${filename}`)
      .download({
        destination: `${localDirectory}/${sharedDirectory}/${filename}`,
      });
  }

  async uploadFile(localDirectory, bucketDirectory, sharedDirectory, filename) {
    return this.storage
      .bucket('pandemic-models')
      .upload(`${localDirectory}/${sharedDirectory}/${filename}`, {
        destination: `${bucketDirectory}/${sharedDirectory}/${filename}`,
        gzip: true,
        metadata: {
          // Enable long-lived HTTP caching headers
          cacheControl: 'public, max-age=31536000',
        },
      });
  }
}
