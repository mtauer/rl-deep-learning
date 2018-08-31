import defaultsDeep from 'lodash/defaultsDeep';
import shuffle from 'lodash/shuffle';
import ProgressBar from 'progress';

import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import initialState from './pandemic-web/src/pandemic-shared/initialState.json';
import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import { getEpisodeStats, getIterationStats, printIterationStats } from './pandemic-light/stats';
import { saveEpisode, getSavedEpisodesCount, summarizeSavedEpisodes,
  getSavedTrainingExamples } from './pandemic-light/trainingData';

const defaultConfig = {
  iterations: 1,
  episodes: 20,
  mcts: {
    simulations: 400,
    cPuct: 1,
    temperature: 1,
    rolloutThreshold: 0,
  },
  neuralNetwork: {
    modelPath: 'pandemic-light/nn-models/',
    trainingEpochs: 40,
  },
};

export default class Coach {
  constructor(config = {}) {
    this.config = defaultsDeep(config, defaultConfig);
  }

  async play(monitor) {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    summarizeSavedEpisodes();
    let mcts;
    const episodesStats = [];
    for (let j = getSavedEpisodesCount(); j < this.config.episodes; j += 1) {
      console.log('Episode', j);
      mcts = new MonteCarloTreeSearchNN(this.config.mcts, monitor);
      // eslint-disable-next-line no-await-in-loop
      const trainingExamples = await this.executeEpisode(mcts, this.neuralNetwork);
      const episodeStats = getEpisodeStats(trainingExamples);
      episodesStats.push(episodeStats);
      saveEpisode(episodeStats, trainingExamples);
      printIterationStats(getIterationStats(episodesStats));
    }
  }

  async train() {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    summarizeSavedEpisodes();
    const trainingExamples = shuffle(getSavedTrainingExamples());
    console.log('Training examples', trainingExamples.length);
    await this.neuralNetwork.train(trainingExamples);
    console.log('Training complete');
  }

  async executeEpisode(mcts) {
    let state = initialState;
    const trainingExamples = [];
    const bar = new ProgressBar('[:bar] :etas', { total: 80, head: '>', incomplete: ' ' });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(0);
      const pi = mcts.getActionProbabilities(game, state, this.neuralNetwork);
      const trainingExample = [game.toNNInput(state), pi];
      const actionIndex = randomChoice(pi);
      const nextAction = game.getValidActions(state)[actionIndex];
      trainingExamples.push([...trainingExample, nextAction]);
      state = game.performAction(state, nextAction);
      bar.tick();
      if (game.hasEnded(state)) {
        const value = game.getValue(state);
        return trainingExamples.map(e => [...e, value]);
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomChoice(p) {
  let random = Math.random();
  return p.findIndex((a) => {
    random -= a;
    return random < 0;
  });
}
