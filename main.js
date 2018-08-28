import game from './pandemic-light/game';
import neuralNetwork from './pandemic-light/neuralNetwork';
import initialState from './pandemic-light/initialState.json';
import MonteCarloSearchTreeNN from './MonteCarloSearchTreeNN';

const mcst = new MonteCarloSearchTreeNN();
mcst.search(game, initialState, neuralNetwork);
