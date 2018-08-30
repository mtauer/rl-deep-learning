import defaultsDeep from 'lodash/defaultsDeep';
import concat from 'lodash/concat';
import shuffle from 'lodash/shuffle';
import ProgressBar from 'progress';

import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import initialState from './pandemic-web/src/pandemic-shared/initialState.json';
import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import { getEpisodeStats, getIterationStats, printIterationStats, saveTrainingExamplesAsImage } from './pandemic-light/stats';

const defaultConfig = {
  iterations: 5,
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

  async train() {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    let mcts;
    let iterationTrainingExamples;
    for (let i = 0; i < this.config.iterations; i += 1) {
      const episodeStats = [];
      console.log();
      console.log(`=== Iteration ${i} ===`);
      console.log();
      iterationTrainingExamples = [];
      for (let j = 0; j < this.config.episodes; j += 1) {
        console.log('Episode', j, '| training examples', iterationTrainingExamples.length);
        mcts = new MonteCarloTreeSearchNN(this.config.mcts);
        const trainingExamples = this.executeEpisode(mcts, this.neuralNetwork);
        episodeStats.push(getEpisodeStats(trainingExamples));
        saveTrainingExamplesAsImage(trainingExamples, './pandemic-light/log/', i, j);
        iterationTrainingExamples = concat(
          iterationTrainingExamples,
          trainingExamples,
        );
        printIterationStats(getIterationStats(episodeStats));
      }
      iterationTrainingExamples = shuffle(iterationTrainingExamples);
      // eslint-disable-next-line no-await-in-loop
      await this.neuralNetwork.train(iterationTrainingExamples);
    }
  }

  executeEpisode(mcts) {
    let state = initialState;
    const trainingExamples = [];
    const bar = new ProgressBar('[:bar] :etas', { total: 80, head: '>', incomplete: ' ' });
    // eslint-disable-next-line no-constant-condition
    while (true) {
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

function randomChoice(p) {
  let random = Math.random();
  return p.findIndex((a) => {
    random -= a;
    return random < 0;
  });
}
