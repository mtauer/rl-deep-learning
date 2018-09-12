import some from 'lodash/some';

import FileStorage from './pandemic-light/fileStorage';
import GoogleCloudStorage from './pandemic-light/googleCloudStorage';

const fileStorage = new FileStorage();
const googleCloudStorage = new GoogleCloudStorage();
const iteration = 1;

async function migrateTrainingEpisodes() {
  const trainingEpisodesFromFile = fileStorage.readTrainingEpisodes(iteration);
  const trainingEpisodesFromDatastrore = await googleCloudStorage.readTrainingEpisodes(iteration);
  console.log('trainingEpisodesFromFile', trainingEpisodesFromFile.length);
  console.log('trainingEpisodesFromDatastrore', trainingEpisodesFromDatastrore.length);
  for (let i = 0; i < trainingEpisodesFromFile.length; i += 1) {
    const trainingEpisodeFromFile = trainingEpisodesFromFile[i];
    const episodeExists = some(trainingEpisodesFromDatastrore, trainingEpisodeFromFile);
    if (!episodeExists) {
      // eslint-disable-next-line no-await-in-loop
      await googleCloudStorage.writeTrainingEpisode(trainingEpisodeFromFile, iteration);
    }
  }
}

migrateTrainingEpisodes();
