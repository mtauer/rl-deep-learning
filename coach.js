/* eslint-disable no-console */
import ProgressBar from 'progress';
import shuffle from 'lodash/shuffle';
import flatten from 'lodash/flatten';
import uuidv4 from 'uuid/v4';

import game from './pandemic-web/src/pandemic-shared/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import MonteCarloTreeSearchNN from './MonteCarloTreeSearchNN';
import { getIterationSummary, savePlayingStats, loadPlayingStats } from './pandemic-light/stats';
import { getTestExamples } from './pandemic-light/testData';
import { toNetworkProbabilities } from './utils';

export default class Coach {
  constructor(config, trainingEpisodesStorage, modelStorage) {
    this.config = config;
    this.trainingEpisodesStorage = trainingEpisodesStorage;
    this.modelStorage = modelStorage;
  }

  async summarizeVersion(versionId) {
    const neuralNetwork = new PandemicNeuronalNetwork(this.config.neuralNetwork);
    const version = {
      name: `Version ${versionId}`,
      gameDescription: game.getDescription(),
      neuralNetworkDescription: neuralNetwork.getDescription(),
    };
    await this.trainingEpisodesStorage
      .writeVersion(versionId, version);
  }

  async summarizeIteration(monitor, iterationIndex, version) {
    const versionId = version;
    const iterationId = `${version}-${iterationIndex}`;
    const matches = await this.trainingEpisodesStorage.readMatches(iterationId);
    const iteration = getIterationSummary(matches);
    const name = `Iteration ${iterationIndex}`;
    await this.trainingEpisodesStorage
      .writeIteration(versionId, iterationId, { ...iteration, name });
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
    const iterationId = `${version}-${iterationIndex}`;
    let matches = await this.trainingEpisodesStorage.readMatches(iterationId);
    const mcts = new MonteCarloTreeSearchNN(this.config.mcts, game, this.neuralNetwork, monitor);
    while (matches.length < this.config.trainingEpisodes) {
      mcts.reset();
      console.log('Heap used (in MB)', (process.memoryUsage().heapUsed / 1000000).toFixed(3));
      console.log('Stats', getIterationSummary(matches));
      // eslint-disable-next-line no-await-in-loop
      const episodeResults = await this.executeEpisode(mcts);
      const versionId = version;
      const matchId = uuidv4();
      const name = `Match ${matchId.split('-')[0]}`;
      // eslint-disable-next-line no-await-in-loop
      await this.trainingEpisodesStorage
        .writeMatch(
          versionId,
          iterationId,
          matchId,
          {
            ...episodeResults.match,
            name,
          },
        );
      // eslint-disable-next-line no-await-in-loop
      await this.trainingEpisodesStorage
        .writeMatchDetails(
          versionId,
          iterationId,
          matchId,
          {
            ...episodeResults.matchDetails,
            name,
          },
        );
      // eslint-disable-next-line no-await-in-loop
      await this.trainingEpisodesStorage
        .writeMatchSteps(
          versionId,
          iterationId,
          matchId,
          {
            ...episodeResults.matchSteps,
            name,
          },
        );
      // eslint-disable-next-line no-await-in-loop
      matches = await this.trainingEpisodesStorage.readMatches(iterationId);
    }
    console.log('Training finished');
    console.log('Stats', getIterationSummary(matches));
  }

  async train(monitor, iterationIndex, version) {
    this.neuralNetwork = this.neuralNetwork || await this.getNeuralNetwork(iterationIndex, version);
    console.log('Preparing training data');
    const allMatchSteps = await this.trainingEpisodesStorage
      .readLastMatchSteps(version, this.config.trainWithLatest);
    const trainingExamples = shuffle(flatten(
      allMatchSteps.map((matchSteps) => {
        const { steps, resultValue: vValue } = matchSteps;
        return steps.map((step) => {
          const { state, p2 } = step;
          const s = game.toNNState(state);
          const pValues = toNetworkProbabilities(
            game,
            game.getValidActions(state),
            p2,
          );
          return {
            s,
            pValues,
            vValue,
          };
        });
      }),
    ));
    console.log('Training examples', trainingExamples.length);
    await this.neuralNetwork.train(trainingExamples);
    console.log('Training complete');
    this.modelStorage.writeModel(this.neuralNetwork, iterationIndex + 1, version);
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
    const actions = [];
    const states = [];
    const simulations = [];
    const networkPOutputs = [];
    const bar = new ProgressBar('[:bar] :elapsed :ended', { total: 100, head: '>', incomplete: ' ' });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { state, nextAction, simulation, stats } = await mcts
        .getActionProbabilities(step, isTraining);
      const networkPOutput = Array.from(mcts.neuralNetwork.predictP(game.toNNState(state)));
      actions.push(nextAction);
      states.push(state);
      simulations.push(simulation);
      networkPOutputs.push(networkPOutput);
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
        const steps = states.map((s, i) => {
          const { p2 } = simulations[i];
          return {
            state: s,
            p2,
          };
        });
        return {
          match: {
            resultValue,
            won: resultValue > 0,
          },
          matchDetails: {
            actions,
            states,
            simulations,
            networkPOutputs,
            time: Date.now() - startTime,
          },
          matchSteps: {
            resultValue,
            steps,
          },
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
