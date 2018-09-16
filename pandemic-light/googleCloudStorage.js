import Datastore from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';
import uuidv4 from 'uuid/v4';

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
}
