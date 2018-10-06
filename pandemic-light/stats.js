import fs from 'fs';
import groupBy from 'lodash/groupBy';
import toPairs from 'lodash/toPairs';
import reduce from 'lodash/reduce';
import transform from 'lodash/transform';
import keys from 'lodash/keys';
import sum from 'lodash/sum';
import sortBy from 'lodash/sortBy';

const playingEpisodesFile = './pandemic-light/stats/iteration_000_playingEpisodes.json';

export function getTrainingEpisodesStats(trainingEpisodes) {
  const episodesStats = trainingEpisodes.map(e => e.episodeStats);
  const episodesWon = episodesStats.filter(stats => stats.won).length;
  const episodesLost = episodesStats.filter(stats => !stats.won).length;
  const actionCounts = episodesStats.map(stats => stats.actionCounts);
  const actionCountsSum = reduce(actionCounts, (acc, counts) => {
    keys(counts).forEach((actionType) => {
      acc[actionType] = (acc[actionType] || 0) + counts[actionType];
    });
    return acc;
  }, {});
  return {
    episodesCount: trainingEpisodes.length,
    episodesWon,
    episodesLost,
    winRate: episodesWon / trainingEpisodes.length,
    actionCounts: actionCountsSum,
  };
}

export function getEpisodeStats(episodeResults) {
  const { steps, time } = episodeResults;
  const actionGroups = groupBy(steps, s => s.action.type);
  const actionCounts = transform(actionGroups, (acc, actions, actionType) => {
    acc[actionType] = actions.length;
  }, {});
  const stepsCount = steps.length;
  return {
    won: episodeResults.vValue > 0,
    actionCounts,
    stepsCount,
    time,
    timePerStep: time / stepsCount,
  };
}

export function getIterationSummary(trainingEpisodes) {
  const trainingEpisodesStats = getTrainingEpisodesStats(trainingEpisodes);
  return {
    ...trainingEpisodesStats,
  };
}

export function printIterationStats(iterationStats) {
  const won = iterationStats.episodesWon;
  const lost = iterationStats.episodesLost;
  const winRate = won + lost === 0 ? '' : (won / (won + lost)).toFixed(2);
  console.log('Won / Lost', won, lost, ' | Win rate', winRate);
  const actionPairs = sortBy(toPairs(iterationStats.actionCounts), pair => -pair[1]);
  const actionsCount = sum(actionPairs.map(pair => pair[1]));
  actionPairs.forEach((pair) => {
    console.log('  ', pair[0], (pair[1] / actionsCount * 100).toFixed(2));
  });
}

export function savePlayingStats(steps, vValue) {
  const actionGroups = groupBy(steps, e => e.action.type);
  const actionCounts = transform(actionGroups, (acc, actions, actionType) => {
    acc[actionType] = actions.length;
  }, {});
  const stats = {
    won: vValue > 0,
    matchLength: steps.length,
    actionCounts,
  };
  const playingEpisodes = readPlayingEpisodes();
  playingEpisodes.push(stats);
  writePlayingEpisodes(playingEpisodes);
}

export function loadPlayingStats() {
  return readPlayingEpisodes();
}

function readPlayingEpisodes() {
  return JSON.parse(fs.readFileSync(playingEpisodesFile) || []);
}

function writePlayingEpisodes(playingEpisodes) {
  fs.writeFileSync(playingEpisodesFile, JSON.stringify(playingEpisodes));
}
