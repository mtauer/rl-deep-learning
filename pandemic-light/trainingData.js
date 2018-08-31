import fs from 'fs';
import last from 'lodash/last';

import { getIterationStats, printIterationStats } from './stats';

const episodesFile = './pandemic-light/training-data/episodes.json';

export function saveEpisode(episodeStats, trainingExamples) {
  const episodes = JSON.parse(fs.readFileSync(episodesFile));
  episodes.push({
    episodeStats,
    trainingExamples,
  });
  fs.writeFileSync(episodesFile, JSON.stringify(episodes));
}

export function getSavedEpisodesCount() {
  const episodes = JSON.parse(fs.readFileSync(episodesFile));
  return episodes.length;
}

export function summarizeSavedEpisodes() {
  const episodes = JSON.parse(fs.readFileSync(episodesFile));
  const episodesStats = episodes.map(e => last(e.episodeStats) || e.episodeStats);
  const iterationStats = getIterationStats(episodesStats);
  printIterationStats(iterationStats);
}
