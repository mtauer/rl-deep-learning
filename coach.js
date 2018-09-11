import ProgressBar from 'progress';
import shuffle from 'lodash/shuffle';
import flatten from 'lodash/flatten';

import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import { getTrainingEpisodesStats, getEpisodeStats,
  savePlayingStats, loadPlayingStats } from './pandemic-light/stats';
import { getTestExamples } from './pandemic-light/testData';
import { toNNProbabilities } from './utils';

export default class Coach {
  constructor(config) {
    this.config = config;
  }

  async play(storage, monitor) {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    const allPlayingStats = loadPlayingStats();
    const mcts = new MonteCarloTreeSearchNN(this.config.mcts, game, this.neuralNetwork, monitor);
    // const mcts = new MonteCarloTreeSearchNN(this.config.mcts, game, this.neuralNetwork, monitor);
    for (let i = allPlayingStats.length; i < this.config.playingEpisodes; i += 1) {
      mcts.reset();
      console.log('Playing Episode', i);
      console.log('Heap used (in MB)', (process.memoryUsage().heapUsed / 1000000).toFixed(3));
      // eslint-disable-next-line no-await-in-loop
      const { steps, vValue } = await this.executeEpisode(mcts, false);
      savePlayingStats(steps, vValue);
      console.log('vValue', vValue);
    }
  }

  async generateTrainingData(storage, monitor, iteration = 0) {
    this.neuralNetwork = this.neuralNetwork || await this.getNeuralNetwork(storage, iteration);
    const trainingEpisodes = storage.readTrainingEpisodes(iteration);
    const mcts = new MonteCarloTreeSearchNN(this.config.mcts, game, this.neuralNetwork, monitor);
    for (let j = trainingEpisodes.length; j < this.config.trainingEpisodes; j += 1) {
      mcts.reset();
      console.log('Training Episode', j);
      console.log('Heap used (in MB)', (process.memoryUsage().heapUsed / 1000000).toFixed(3));
      console.log('Stats', getTrainingEpisodesStats(trainingEpisodes));
      // eslint-disable-next-line no-await-in-loop
      const episodeResults = await this.executeEpisode(mcts);
      const episodeStats = getEpisodeStats(episodeResults);
      const trainingEpisode = { episodeStats, episodeResults };
      storage.writeTrainingEpisode(trainingEpisode, iteration);
      trainingEpisodes.push(trainingEpisode);
    }
    console.log('Training finished');
    console.log('Stats', getTrainingEpisodesStats(trainingEpisodes));
  }

  async train(storage, monitor, iteration = 0) {
    this.neuralNetwork = this.neuralNetwork || await this.getNeuralNetwork(storage, iteration);
    console.log('Preparing training data');
    const trainingEpisodes = storage.readTrainingEpisodes(iteration);
    const trainingExamples = shuffle(
      flatten(
        trainingEpisodes.map((trainingEpisode) => {
          const { steps, vValue } = trainingEpisode.episodeResults;
          const examples = steps.map((step) => {
            const s = game.toNNState(step.state);
            const pValues = toNNProbabilities(game, step.pValues, game.getValidActions(step.state));
            return { s, pValues, vValue };
          });
          return examples;
        }),
      ),
    );
    console.log('Training examples', trainingExamples.length);
    await this.neuralNetwork.train(trainingExamples);
    console.log('Training complete');
    storage.writeModel(this.neuralNetwork, iteration + 1);
  }

  async evaluate() {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    const testExamples = getTestExamples();
    this.neuralNetwork.evaluate(testExamples);
  }

  // eslint-disable-next-line class-methods-use-this
  async executeEpisode(mcts, isTraining = true) {
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

  async getNeuralNetwork(storage, iteration) {
    const neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await storage.readModel(neuralNetwork, iteration, this.config.neuralNetwork.tag);
    return neuralNetwork;
  }
}
