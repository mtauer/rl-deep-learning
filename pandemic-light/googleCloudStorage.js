import Datastore from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';
import uuidv4 from 'uuid/v4';
import fs from 'fs-extra';
import padStart from 'lodash/padStart';

import packageJson from '../package.json';
import { retry } from '../utils';

const TRAINING_EPISODE = 'TrainingEpisode';
const ITERATION = 'Iteration';
const ITERATION_SUMMARY = 'IterationSummary';
const MATCH = 'Match';
const MATCH_DETAILS = 'MatchDetails';

export default class GoogleCloudStorage {
  constructor() {
    const googleCloudConfig = {
      projectId: process.env.GCP_PROJECT_ID,
    };
    this.datastore = new Datastore(googleCloudConfig);
    this.storage = new Storage(googleCloudConfig);
  }

  async readTrainingEpisodes(iteration, version = packageJson.version) {
    // eslint-disable-next-line no-console
    console.log('Loading training episodes from Datastore', version, iteration);
    const query = this.datastore.createQuery(TRAINING_EPISODE)
      .filter('version', '=', version)
      .filter('iteration', '=', iteration);
    return retry(
      10,
      () => this.datastore
        .runQuery(query)
        .then(results => results[0].map(entity => entity.trainingEpisode)),
    );
  }

  async readLastTrainingEpisodes(limit, version = packageJson.version) {
    // eslint-disable-next-line no-console
    console.log('Loading last training episodes from Datastore', version, limit);
    const query = this.datastore.createQuery(TRAINING_EPISODE)
      .filter('version', '=', version)
      .order('createdAt', { descending: true })
      .limit(limit);
    return retry(
      10,
      () => this.datastore
        .runQuery(query)
        .then(results => results[0].map(entity => entity.trainingEpisode)),
    );
  }

  async writeTrainingEpisode(trainingEpisode, iteration, version = packageJson.version) {
    // eslint-disable-next-line no-console
    console.log('Writing training episode to Datastore', version, iteration);
    const name = uuidv4();
    const key = this.datastore.key([TRAINING_EPISODE, name]);
    const trainingEpisodeEntity = {
      key,
      data: {
        createdAt: new Date().toISOString(),
        version,
        iteration,
        trainingEpisode,
      },
    };
    return retry(10, () => this.datastore.save(trainingEpisodeEntity));
  }

  async readIterationSummaries(version = packageJson.version) {
    // eslint-disable-next-line no-console
    console.log('Reading iteration summary from Datastore', version);
    const query = this.datastore.createQuery(ITERATION_SUMMARY)
      .filter('version', '=', version)
      .order('createdAt', { descending: false });
    return retry(
      10,
      () => this.datastore
        .runQuery(query)
        .then(results => results[0]),
    );
  }

  async writeIteration(iteration, iterationIndex, versionNumber = packageJson.version) {
    // eslint-disable-next-line no-console
    console.log('Writing iteration to Datastore', versionNumber, iterationIndex);
    const iterationId = `${versionNumber}-${iterationIndex}`;
    const iterationData = {
      ...iteration,
      iterationId,
      versionId: versionNumber,
    };
    return this.writeEntity(ITERATION, iterationId, iterationData);
  }

  async writeMatch(matchId = uuidv4(), match, iterationIndex,
    versionNumber = packageJson.version) {
    // eslint-disable-next-line no-console
    console.log('Writing match to Datastore', versionNumber, iterationIndex);
    const matchData = {
      ...match,
      matchId,
      iterationId: `${versionNumber}-${iterationIndex}`,
      versionId: versionNumber,
    };
    return this.writeEntity(MATCH, matchId, matchData);
  }

  async writeMatchDetails(matchId = uuidv4(), matchDetails, iterationIndex,
    versionNumber = packageJson.version) {
    // eslint-disable-next-line no-console
    console.log('Writing match details to Datastore', versionNumber, iterationIndex);
    const matchDetailsData = {
      ...matchDetails,
      matchId,
      iterationId: `${versionNumber}-${iterationIndex}`,
      versionId: versionNumber,
    };
    return this.writeEntity(MATCH_DETAILS, matchId, matchDetailsData);
  }

  async writeEntity(entityKey, id, data) {
    const key = this.datastore.key([entityKey, id]);
    const entity = {
      key,
      data: {
        ...data,
        createdAt: new Date().toISOString(),
      },
    };
    return retry(10, () => this.datastore.save(entity));
  }

  async writeDebugLog(debug, version = packageJson.version) {
    const bucketDirectory = this.getDebugBucketDirectory(version);
    // eslint-disable-next-line no-console
    console.log('Uploading debug to', bucketDirectory);
    const tempDirectory = this.getDebugTempDirectory();
    const filename = `debug_${uuidv4()}.json`;
    fs.ensureDirSync(tempDirectory);
    fs.writeFileSync(`${tempDirectory}/${filename}`, JSON.stringify(debug));
    await this.uploadFile(tempDirectory, bucketDirectory, '', filename);
    fs.removeSync(tempDirectory);
  }

  async readModel(neuralNetwork, iteration, version = packageJson.version) {
    const bucketDirectory = this.getModelBucketDirectory(iteration, version);
    // eslint-disable-next-line no-console
    console.log('Downloading model from', bucketDirectory);
    const tempDirectory = this.getModelTempDirectory();
    fs.ensureDirSync(`${tempDirectory}/pModel`);
    fs.ensureDirSync(`${tempDirectory}/vModel`);
    try {
      await Promise.all([
        this.downloadFile(tempDirectory, bucketDirectory, 'pModel/', 'model.json'),
        this.downloadFile(tempDirectory, bucketDirectory, 'pModel/', 'weights.bin'),
        this.downloadFile(tempDirectory, bucketDirectory, 'vModel/', 'model.json'),
        this.downloadFile(tempDirectory, bucketDirectory, 'vModel/', 'weights.bin'),
      ]);
      await neuralNetwork.load(tempDirectory);
    } catch (err) {
      if (err.code === 404) {
        // If the model does not exist initialize it with random weights and
        // upload it.
        // eslint-disable-next-line no-console
        console.log('### Initialize models with random weights ###');
        await neuralNetwork.build();
        await this.writeModel(neuralNetwork, iteration, version);
      } else {
        // eslint-disable-next-line no-console
        console.log('Could not download the model', err.code);
      }
    }
    fs.removeSync(tempDirectory);
  }

  async writeModel(neuralNetwork, iteration, version = packageJson.version) {
    const bucketDirectory = this.getModelBucketDirectory(iteration, version);
    // eslint-disable-next-line no-console
    console.log('Uploading model to', bucketDirectory);
    const tempDirectory = this.getModelTempDirectory();
    fs.ensureDirSync(tempDirectory);
    await neuralNetwork.save(tempDirectory);
    try {
      await Promise.all([
        this.uploadFile(tempDirectory, bucketDirectory, 'pModel/', 'model.json'),
        this.uploadFile(tempDirectory, bucketDirectory, 'pModel/', 'weights.bin'),
        this.uploadFile(tempDirectory, bucketDirectory, 'vModel/', 'model.json'),
        this.uploadFile(tempDirectory, bucketDirectory, 'vModel/', 'weights.bin'),
      ]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Could not upload the model', err.code);
    }
    fs.removeSync(tempDirectory);
  }

  // eslint-disable-next-line class-methods-use-this
  getModelBucketDirectory(iteration, version) {
    const iterationString = padStart(iteration, 3, '0');
    const directory = `model_v${version}_iteration_${iterationString}`;
    return directory;
  }

  // eslint-disable-next-line class-methods-use-this
  getModelTempDirectory() {
    return `./temp_model_${uuidv4()}`;
  }

  // eslint-disable-next-line class-methods-use-this
  getDebugBucketDirectory(version) {
    return `debug_v${version}`;
  }

  // eslint-disable-next-line class-methods-use-this
  getDebugTempDirectory() {
    return `./temp_debug_${uuidv4()}`;
  }

  async downloadFile(localDirectory, bucketDirectory, sharedDirectory, filename) {
    return retry(
      10,
      () => this.storage
        .bucket('pandemic-models')
        .file(`${bucketDirectory}/${sharedDirectory}${filename}`)
        .download({
          destination: `${localDirectory}/${sharedDirectory}${filename}`,
        }),
      err => err.code === 404,
    );
  }

  async uploadFile(localDirectory, bucketDirectory, sharedDirectory, filename) {
    return retry(
      10,
      () => this.storage
        .bucket('pandemic-models')
        .upload(`${localDirectory}/${sharedDirectory}${filename}`, {
          destination: `${bucketDirectory}/${sharedDirectory}${filename}`,
          gzip: true,
          metadata: {
            // Enable long-lived HTTP caching headers
            cacheControl: 'public, max-age=31536000',
          },
        }),
    );
  }
}
