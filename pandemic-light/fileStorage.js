/* eslint-disable class-methods-use-this */

import _ from 'lodash';
import fs from 'fs';
import padStart from 'lodash/padStart';
import uuidv4 from 'uuid/v4';

import packageJson from '../package.json';

const MATCH = 'Match';

export default class FileStorage {
  readTrainingEpisodes(iteration) {
    const directory = this.getTrainingDataDirectory(iteration);
    console.log('Loading training episodes from', directory);
    const episodes = [];
    if (fs.existsSync(directory)) {
      fs.readdirSync(directory).forEach((episodeFilename) => {
        const episode = JSON.parse(fs.readFileSync(`${directory}/${episodeFilename}`));
        episodes.push(episode);
      });
    }
    return episodes;
  }

  writeTrainingEpisode(trainingEpisode, iteration) {
    const directory = this.getTrainingDataDirectory(iteration);
    console.log('Saving training data to', directory);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    const episodeFilename = `${uuidv4()}.json`;
    fs.writeFileSync(`${directory}/${episodeFilename}`, JSON.stringify(trainingEpisode));
  }

  async readModel(neuralNetwork, iteration, tag) {
    const directory = this.getModelDirectory(iteration, tag);
    console.log('Loading model from', directory);
    if (fs.existsSync(directory)) {
      await neuralNetwork.load(directory);
    } else {
      await neuralNetwork.build();
      await this.writeModel(neuralNetwork, iteration, tag);
    }
  }

  async writeModel(neuralNetwork, iteration, tag) {
    const directory = this.getModelDirectory(iteration, tag);
    console.log('Saving model to', directory);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    await neuralNetwork.save(directory);
  }

  readMatches(iterationId) {
    console.log('Read matches from file', iterationId);
    const items = this.read(this.getKey(MATCH));
    return items.filter(i => i.iterationId === iterationId);
  }

  readLastMatches() {
    return [];
  }

  writeMatches() {
    // no-op
  }

  writeMatch(versionId, iterationId, matchId, match) {
    console.log('Write match to file', matchId);
    return this.write(
      this.getKey(MATCH, matchId),
      { versionId, iterationId, matchId, ...match },
    );
  }

  writeMatchDetails() {
    // no-op
  }

  writeMatchSteps() {
    // no-op
  }

  getDataDirectory() {
    const directory = `pandemic-light/file-storage/v${packageJson.version}_data`;
    return directory;
  }

  getModelDirectory(iteration, tag = '') {
    const iterationString = padStart(iteration, 3, '0');
    const directory = `pandemic-light/file-storage/v${packageJson.version}${tag}_iteration_${iterationString}_model`;
    return directory;
  }

  getKey(type, id) {
    return { type, id };
  }

  read(entity) {
    const directory = this.getDataDirectory();
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    let items = [];
    const filename = `${directory}/${entity.type}.json`;
    if (fs.existsSync(filename)) {
      items = JSON.parse(fs.readFileSync(filename));
    }
    return items;
  }

  write(entity, item) {
    const directory = this.getDataDirectory();
    const filename = `${directory}/${entity.type}.json`;
    const items = this.read(entity);
    fs.writeFileSync(filename, JSON.stringify([...items, ..._.castArray(item)]));
  }
}
