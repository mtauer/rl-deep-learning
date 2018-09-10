import fs from 'fs';
import padStart from 'lodash/padStart';
import uuidv4 from 'uuid/v4';

import packageJson from '../package.json';

// eslint-disable-next-line import/prefer-default-export
export function writeTrainingEpisode(trainingEpisode, iteration) {
  const directory = getTrainingDataDirectory(iteration);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  const episodeFilename = `${uuidv4()}.json`;
  fs.writeFileSync(`${directory}/${episodeFilename}`, JSON.stringify(trainingEpisode));
}

export function readTrainingEpisodes(iteration) {
  const directory = getTrainingDataDirectory(iteration);
  const episodes = [];
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((episodeFilename) => {
      const episode = JSON.parse(fs.readFileSync(`${directory}/${episodeFilename}`));
      episodes.push(episode);
    });
  }
  return episodes;
}

function getTrainingDataDirectory(iteration) {
  const iterationString = padStart(iteration, 3, '0');
  const directory = `pandemic-light/v${packageJson.version}_iteration_${iterationString}_training_data`;
  return directory;
}
