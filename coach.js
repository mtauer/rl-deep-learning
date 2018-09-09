import defaultsDeep from 'lodash/defaultsDeep';
import shuffle from 'lodash/shuffle';
import ProgressBar from 'progress';

import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import { getEpisodeStats, getIterationStats, printIterationStats,
  savePlayingStats, loadPlayingStats } from './pandemic-light/stats';
import { saveEpisode, getSavedEpisodesCount, summarizeSavedEpisodes,
  getSavedTrainingExamples } from './pandemic-light/trainingData';
import { getTestExamples } from './pandemic-light/testData';

const defaultConfig = {
  iterations: 1,
  trainingEpisodes: 20,
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

  async initNN() {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    await this.neuralNetwork.save();
  }

  async play(monitor) {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    const allPlayingStats = loadPlayingStats();
    const mcts = new MonteCarloTreeSearchNN(this.config.mcts, game, this.neuralNetwork, monitor);
    for (let i = allPlayingStats.length; i < this.config.playingEpisodes; i += 1) {
      console.log('Playing Episode', i);
      mcts.reset();
      // eslint-disable-next-line no-await-in-loop
      const { steps, vValue } = await this.executeEpisode(mcts, false);
      savePlayingStats(steps, vValue);
      console.log('vValue', vValue);
    }
  }

  async generateTrainingData(monitor) {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    summarizeSavedEpisodes();
    const mcts = new MonteCarloTreeSearchNN(this.config.mcts, game, this.neuralNetwork, monitor);
    const episodesStats = [];
    for (let j = getSavedEpisodesCount(); j < this.config.trainingEpisodes; j += 1) {
      console.log('Training Episode', j);
      mcts.reset();
      // eslint-disable-next-line no-await-in-loop
      const episodeResults = await this.executeEpisode(mcts);
      const episodeStats = getEpisodeStats(episodeResults);
      episodesStats.push(episodeStats);
      saveEpisode(episodeStats, episodeResults);
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

  async evaluate() {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    const testExamples = getTestExamples();
    this.neuralNetwork.evaluate(testExamples);
  }

  // eslint-disable-next-line class-methods-use-this
  async executeEpisode(mcts, isTraining = true) {
    console.log(process.memoryUsage());
    let step = 0;
    const steps = [];
    const bar = new ProgressBar('[:bar] :elapsed :ended', { total: 100, head: '>', incomplete: ' ' });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { probabilities, nextAction, stats } = await mcts
        .getActionProbabilities(step, isTraining);
      steps.push({
        state: mcts.root.state,
        pValues: probabilities,
        action: nextAction,
      });
      bar.tick({ ended: stats.simulationsEnded });
      // Perform action and get new state
      const nextState = game.performAction(mcts.root.state, nextAction);
      mcts.performAction(nextAction, nextState);
      if (game.hasEnded(mcts.root.state)) {
        const vValue = game.getValue(mcts.root.state);
        return {
          steps,
          vValue,
        };
      }
      step += 1;
    }
  }
}
