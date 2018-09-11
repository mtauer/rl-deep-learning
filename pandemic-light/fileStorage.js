import fs from 'fs';
import padStart from 'lodash/padStart';
import uuidv4 from 'uuid/v4';

import packageJson from '../package.json';

export default class FileStorage {
  readTrainingEpisodes(iteration) {
    const directory = this.getTrainingDataDirectory(iteration);
    console.log('Loading training data from', directory);
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

  // eslint-disable-next-line
  getTrainingDataDirectory(iteration) {
    const iterationString = padStart(iteration, 3, '0');
    const directory = `pandemic-light/v${packageJson.version}_iteration_${iterationString}_training_data`;
    return directory;
  }

  // eslint-disable-next-line
  getModelDirectory(iteration, tag = '') {
    const iterationString = padStart(iteration, 3, '0');
    const directory = `pandemic-light/v${packageJson.version}${tag}_iteration_${iterationString}_model`;
    return directory;
  }
}
