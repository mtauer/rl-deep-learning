import slice from 'lodash/slice';
import sum from 'lodash/sum';

class MonteCarloSearchTreeNN {
  constructor() {
    this.Q_sa = {}; // stores Q values for s,a
    this.N_sa = {}; // stores #times edge s,a was visited
    this.N_s = {}; // stores #times state s was visited
    this.P_s = {}; // stores initial policy (returned by neural network)
    this.z_s = {}; // stores game.getWinner for state s
  }

  search(game, state, neuralNetwork) {
    const s = game.toKey(state);

    if (!this.z_s[s]) { this.z_s[s] = game.getWinner(state); }
    if (this.z_s[s] !== null) { return this.z_s[s]; }

    if (!this.P_s[s]) {
      this.P_s[s] = neuralNetwork.predictP(state);
      const validActions = game.getValidActions(state);
      this.P_s[s] = slice(this.P_s[s], 0, validActions.length);
      const sumP = sum(this.P_s[s]);
      if (sumP === 0) {
        // eslint-disable-next-line no-console
        console.log('All valid moves were masked, do workaround.');
        this.P_s[s] = validActions.map(() => 1.0 / validActions.length);
      } else {
        this.P_s[s] = this.P_s[s].map(x => x / sumP);
      }
      console.log('validActions', validActions);
      console.log('Ps', this.P_s);
    }

    return 0;
  }
}

export default MonteCarloSearchTreeNN;
