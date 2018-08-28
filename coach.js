import range from 'lodash/range';
import concat from 'lodash/concat';

import game from './pandemic-light/game';
import neuralNetwork from './pandemic-light/neuralNetwork';
import initialState from './pandemic-light/initialState.json';
import MonteCarloSearchTreeNN from './MonteCarloSearchTreeNN';
import { printStatistics, saveTrainingExamplesAsImage } from './pandemic-light/debug';

export function executeEpisode(mcst) {
  let state = initialState;
  const trainingExamples = [];
  while (true) {
    const pi = mcst.getActionProbabilities(game, state, neuralNetwork);
    const trainingExample = [game.toNNInput(state), pi];


    const actionIndex = randomChoice(pi);
    const nextAction = game.getValidActions(state)[actionIndex];
    trainingExamples.push([...trainingExample, nextAction]);
    state = game.performAction(state, nextAction);
    if (game.hasEnded(state)) {
      const value = game.getValue(state);
      console.log('Game result', value);
      return trainingExamples.map(e => [...e, value]);
    }
  }
}

export function train() {
  let mcst;
  let iterationTrainingExamples = [];
  range(50).forEach((i) => {
    console.log('Episode', i, '| training examples', iterationTrainingExamples.length);
    mcst = new MonteCarloSearchTreeNN();
    const trainingExamples = executeEpisode(mcst);
    saveTrainingExamplesAsImage(trainingExamples, './pandemic-light/log/', 0, i);
    iterationTrainingExamples = concat(
      iterationTrainingExamples,
      trainingExamples,
    );
    printStatistics(iterationTrainingExamples);
  });
}

function randomChoice(p) {
  let random = Math.random();
  return p.findIndex((a) => {
    random -= a;
    return random < 0;
  });
}
