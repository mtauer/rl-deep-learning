/* eslint-disable no-console */
import ProgressBar from 'progress';
import shuffle from 'lodash/shuffle';
import flatten from 'lodash/flatten';
import every from 'lodash/every';
import isFinite from 'lodash/isFinite';
import uuidv4 from 'uuid/v4';

import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import { getTrainingEpisodesStats, getIterationSummary, savePlayingStats,
  loadPlayingStats } from './pandemic-light/stats';
import { getTestExamples } from './pandemic-light/testData';
import { toNNProbabilities } from './utils';

export default class Coach {
  constructor(config, trainingEpisodesStorage, modelStorage) {
    this.config = config;
    this.trainingEpisodesStorage = trainingEpisodesStorage;
    this.modelStorage = modelStorage;
  }

  async play(monitor) {
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

  async generateTrainingData(monitor, iterationIndex, version) {
    this.neuralNetwork = this.neuralNetwork
      || await this.getNeuralNetwork(iterationIndex, version);
    const trainingEpisodes = await this.trainingEpisodesStorage
      .readTrainingEpisodes(iterationIndex, version);
    const mcts = new MonteCarloTreeSearchNN(this.config.mcts, game, this.neuralNetwork, monitor);
    for (let j = trainingEpisodes.length; j < this.config.trainingEpisodes; j += 1) {
      mcts.reset();
      console.log('Training Episode', j);
      console.log('Heap used (in MB)', (process.memoryUsage().heapUsed / 1000000).toFixed(3));
      console.log('Stats', getTrainingEpisodesStats(trainingEpisodes));
      // eslint-disable-next-line no-await-in-loop
      const episodeResults = await this.executeEpisode(mcts);
      const matchId = uuidv4();
      // eslint-disable-next-line no-await-in-loop
      await this.trainingEpisodesStorage
        .writeMatch(matchId, episodeResults.match, iterationIndex, version);
      // eslint-disable-next-line no-await-in-loop
      await this.trainingEpisodesStorage
        .writeMatchDetails(matchId, episodeResults.matchDetails, iterationIndex, version);
    }
    console.log('Training finished');
    console.log('Stats', getTrainingEpisodesStats(trainingEpisodes));
  }

  async summarizeIteration(monitor, iterationIndex, version) {
    const trainingEpisodes = await this.trainingEpisodesStorage
      .readTrainingEpisodes(iterationIndex, version);
    const iteration = getIterationSummary(trainingEpisodes);
    await this.trainingEpisodesStorage
      .writeIteration(iteration, iterationIndex, version);
  }

  async train(monitor, iteration, version) {
    this.neuralNetwork = this.neuralNetwork || await this.getNeuralNetwork(iteration, version);
    console.log('Preparing training data');
    const trainingEpisodes = await this.trainingEpisodesStorage
      .readLastTrainingEpisodes(this.config.trainWithLatest, version);
    const allTrainingExamples = shuffle(
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
    const trainingExamples = allTrainingExamples
      .filter((example) => {
        const validPValues = every(example.pValues, p => isFinite(p));
        if (!validPValues) {
          console.log('Invalid example detected');
        }
        return validPValues;
      });
    console.log('Training examples', trainingExamples.length);
    await this.neuralNetwork.train(trainingExamples);
    console.log('Training complete');
    this.modelStorage.writeModel(this.neuralNetwork, iteration + 1, version);
  }

  async evaluate() {
    this.neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.neuralNetwork.init();
    const testExamples = getTestExamples();
    this.neuralNetwork.evaluate(testExamples);
  }

  // eslint-disable-next-line class-methods-use-this
  async executeEpisode(mcts, isTraining = true) {
    const startTime = Date.now();
    let step = 0;
    // const steps = [];
    const actions = [];
    const states = [];
    const simulations = [];
    const bar = new ProgressBar('[:bar] :elapsed :ended', { total: 100, head: '>', incomplete: ' ' });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { state, nextAction, simulation, stats } = await mcts
        .getActionProbabilities(step, isTraining);
      actions.push(nextAction);
      states.push(state);
      simulations.push(simulation);
      bar.tick({ ended: stats.simulationsEnded });
      // Perform action and get new state
      const nextState = game.performAction(mcts.root.state, nextAction);
      mcts.performAction(nextAction, nextState);

      // The step count should never ever be greater than 120
      if (step > 120 && step <= 130) {
        this.trainingEpisodesStorage.writeDebugLog({
          state: mcts.root.state,
          hasEnded: game.hasEnded(mcts.root.state),
        });
      }

      if (game.hasEnded(mcts.root.state)) {
        const resultValue = game.getValue(mcts.root.state);
        return {
          match: {
            resultValue,
            won: resultValue > 0,
          },
          matchDetails: {
            actions,
            states,
            simulations,
            time: Date.now() - startTime,
          },
          steps: [],
        };
      }
      step += 1;
    }
  }

  async getNeuralNetwork(iteration, version) {
    const neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    await this.modelStorage.readModel(neuralNetwork, iteration, version);
    return neuralNetwork;
  }
}
