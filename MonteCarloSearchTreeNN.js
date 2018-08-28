class MonteCarloSearchTreeNN {
  constructor() {
    this.Qsa = {}; // stores Q values for s,a
    this.Nsa = {}; // stores #times edge s,a was visited
    this.Ns = {}; // stores #times state s was visited
    this.Ps = {}; // stores initial policy (returned by neural network)
    this.Ws = {}; // stores game.getWinner for state s
  }

  search(game, state, neuralNetwork) {
    const s = game.toKey(state);

    if (!this.Ws[s]) { this.Ws[s] = game.getWinner(state); }
    if (this.Ws[s] !== null) { return this.Ws[s]; }

    if (!this.Ps[s]) {
      this.Ps[s] = neuralNetwork.predictP(state);
      const validActions = game.getValidActions(state);
      console.log(validActions, this.Ps);
    }

    return 0;
  }
}

export default MonteCarloSearchTreeNN;
