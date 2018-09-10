import { readEpisodes } from './pandemic-light/trainingData';
import { writeTrainingEpisode } from './pandemic-light/storage';

function migrate() {
  const episodes = readEpisodes();
  episodes.forEach((episode) => {
    const { episodeStats, episodeResults } = episode;
    writeTrainingEpisode({ episodeStats, episodeResults }, 0);
  });
}

migrate();
