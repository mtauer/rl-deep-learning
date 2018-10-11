/* eslint-disable no-console */

import Datastore from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';
import uuidv4 from 'uuid/v4';
import fs from 'fs-extra';
import padStart from 'lodash/padStart';

import packageJson from '../package.json';
import { retry } from '../utils';

const VERSION = 'Version';
const ITERATION = 'Iteration';
const MATCH = 'Match';
const MATCH_DETAILS = 'MatchDetails';

const TRAINING_EPISODE = 'TrainingEpisode';
const ITERATION_SUMMARY = 'IterationSummary';

export default class GoogleCloudStorage {
  constructor() {
    const googleCloudConfig = {
      projectId: process.env.GCP_PROJECT_ID,
    };
    this.datastore = new Datastore(googleCloudConfig);
    this.storage = new Storage(googleCloudConfig);
  }

  // Versions

  async readVersions() {
    console.log('Loading versions from Datastore');
    return this.read(
      this.datastore.createQuery(VERSION),
    );
  }

  async writeVersion(versionId, version) {
    console.log('Write version to Datastore', versionId);
    return this.write(
      this.datastore.key([VERSION, versionId]),
      { versionId, ...version },
    );
  }

  // Iterations

  async readIterations(versionId) {
    console.log('Loading iterations from Datastore', versionId);
    return this.read(
      this.datastore.createQuery(ITERATION)
        .filter('versionId', '=', versionId),
    );
  }

  async writeIteration(versionId, iterationId, iteration) {
    console.log('Write iteration to Datastore', iterationId);
    return this.write(
      this.datastore.key([ITERATION, iterationId]),
      { versionId, iterationId, ...iteration },
    );
  }

  // Matches

  async readMatches(iterationId) {
    console.log('Read matches from Datastore', iterationId);
    return this.read(
      this.datastore.createQuery(MATCH)
        .filter('iterationId', '=', iterationId),
    );
  }

  async writeMatch(versionId, iterationId, matchId, match) {
    console.log('Write match to Datastore', matchId);
    return this.write(
      this.datastore.key([MATCH, matchId]),
      { versionId, iterationId, matchId, ...match },
    );
  }

  // Match details

  async readMatchDetails(matchId) {
    console.log('Read match details from Datastore', matchId);
    return this.read(
      this.datastore.createQuery(MATCH_DETAILS)
        .filter('matchId', '=', matchId),
    ).then(result => result[0]);
  }

  async writeMatchDetails(versionId, iterationId, matchId, matchDetails) {
    console.log('Write match details to Datastore', matchId);
    return this.write(
      this.datastore.key([MATCH_DETAILS, matchId]),
      { versionId, iterationId, matchId, ...matchDetails },
    );
  }

  async read(query) {
    return retry(
      10,
      () => this.datastore.runQuery(query).then(results => results[0]),
    );
  }

  async write(key, data) {
    return retry(
      10,
      () => this.datastore.save({
        key,
        data: {
          ...data,
          createdAt: new Date().toISOString(),
        },
      }),
    );
  }

  async readTrainingEpisodes(iteration, version = packageJson.version) {
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

  async writeDebugLog(debug, version = packageJson.version) {
    const bucketDirectory = this.getDebugBucketDirectory(version);
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
        console.log('### Initialize models with random weights ###');
        await neuralNetwork.build();
        await this.writeModel(neuralNetwork, iteration, version);
      } else {
        console.log('Could not download the model', err.code);
      }
    }
    fs.removeSync(tempDirectory);
  }

  async writeModel(neuralNetwork, iteration, version = packageJson.version) {
    const bucketDirectory = this.getModelBucketDirectory(iteration, version);
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
