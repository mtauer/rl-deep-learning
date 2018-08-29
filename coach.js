import concat from 'lodash/concat';
import shuffle from 'lodash/shuffle';
import ProgressBar from 'progress';

import game from './pandemic-light/game';
import PandemicNeuronalNetwork from './pandemic-light/neuralNetwork';
import initialState from './pandemic-light/initialState.json';
import MonteCarloSearchTreeNN from './MonteCarloSearchTreeNN';
import { printStatistics, saveTrainingExamplesAsImage } from './pandemic-light/debug';

export function executeEpisode(mcst, neuralNetwork) {
  let state = initialState;
  const trainingExamples = [];
  const bar = new ProgressBar('[:bar] :etas', { total: 80, head: '>', incomplete: ' ' });
  while (true) {
    const pi = mcst.getActionProbabilities(game, state, neuralNetwork);
    const trainingExample = [game.toNNInput(state), pi];
    const actionIndex = randomChoice(pi);
    const nextAction = game.getValidActions(state)[actionIndex];
    trainingExamples.push([...trainingExample, nextAction]);
    state = game.performAction(state, nextAction);
    bar.tick();

    if (game.hasEnded(state)) {
      const value = game.getValue(state);
      console.log('Game result', value);
      return trainingExamples.map(e => [...e, value]);
    }
  }
}

export async function train() {
  const neuralNetwork = new PandemicNeuronalNetwork();
  let mcst;
  let iterationTrainingExamples;
  for (let i = 0; i < 5; i += 1) {
    console.log();
    console.log(`=== Iteration ${i} ===`);
    console.log();
    iterationTrainingExamples = [];
    for (let j = 0; j < 20; j += 1) {
      console.log('Episode', j, '| training examples', iterationTrainingExamples.length);
      mcst = new MonteCarloSearchTreeNN();
      const trainingExamples = executeEpisode(mcst, neuralNetwork);
      saveTrainingExamplesAsImage(trainingExamples, './pandemic-light/log/', i, j);
      iterationTrainingExamples = concat(
        iterationTrainingExamples,
        trainingExamples,
      );
      printStatistics(iterationTrainingExamples);
    }
    iterationTrainingExamples = shuffle(iterationTrainingExamples);
    // eslint-disable-next-line no-await-in-loop
    await neuralNetwork.train(iterationTrainingExamples);
  }
}

function randomChoice(p) {
  let random = Math.random();
  return p.findIndex((a) => {
    random -= a;
    return random < 0;
  });
}
