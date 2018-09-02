import fs from 'fs';
import last from 'lodash/last';
import flatten from 'lodash/flatten';

import { getIterationStats, printIterationStats } from './stats';

const episodesFile = './pandemic-light/training-data/episodes.json';

export function saveEpisode(episodeStats, trainingExamples) {
  const episodes = readEpisodes();
  episodes.push({
    episodeStats,
    trainingExamples,
  });
  writeEpisodes(episodes);
}

export function getSavedEpisodesCount() {
  const episodes = fs.readFileSync(episodesFile) || [];
  return episodes.length;
}

export function summarizeSavedEpisodes() {
  const episodes = readEpisodes();
  const episodesStats = episodes.map(e => last(e.episodeStats) || e.episodeStats);
  printIterationStats(getIterationStats(episodesStats));
  const wonEpisodesStats = episodesStats.filter(stats => stats.won);
  printIterationStats(getIterationStats(wonEpisodesStats));
}

export function getSavedTrainingExamples() {
  const episodes = readEpisodes();
  const trainingExamples = episodes.map(e => e.trainingExamples);
  return flatten(trainingExamples);
}

function readEpisodes() {
  return JSON.parse(fs.readFileSync(episodesFile) || []);
}

function writeEpisodes(episodes) {
  fs.writeFileSync(episodesFile, JSON.stringify(episodes));
}
