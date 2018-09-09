import fs from 'fs';
import padStart from 'lodash/padStart';
import uuidv4 from 'uuid/v4';

import packageJson from '../package.json';

// eslint-disable-next-line import/prefer-default-export
export function writeTrainingEpisode(episodeStats, episodeResults, iteration) {
  const iterationString = padStart(iteration, 3, '0');
  const directory = `pandemic-light/v${packageJson.version}_iteration_${iterationString}_training_data`;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  const episodeFilename = `${uuidv4()}.json`;
  fs.writeFileSync(`${directory}/${episodeFilename}`, JSON.stringify({
    episodeStats,
    episodeResults,
  }));
}
