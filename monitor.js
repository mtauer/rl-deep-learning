import http from 'http';
import express from 'express';
import SocketIo from 'socket.io';

export default class Monitor {
  constructor() {
    this.connectedSocket = null;
    this.lastUpdate = 0;
    const app = express();
    const server = http.Server(app);
    const io = new SocketIo(server);
    const port = process.env.PORT || 3001;

    io.on('connection', (socket) => {
      this.connectedSocket = socket;
      socket.on('disconnect', () => {
        this.connectedSocket = null;
      });
    });

    server.listen(port, () => {
      console.log('++++++++++++++++++++ [INFO] Listening on *:', port);
    });
  }

  updateSimulation(mcts, game, state, neuralNetwork) {
    const now = Date.now();
    if (mcts && this.connectedSocket && now - this.lastUpdate > 5000) {
      this.lastUpdate = now;
      this.connectedSocket.emit('simulation_update', {
        state,
        validActions: game.getValidActions(state),
        predictedPValues: mcts.getPredictedPValues(game, state, neuralNetwork),
        predictedVValues: [mcts.getPredictedVValue(game, state, neuralNetwork)],
        naValues: mcts.getNsaValues(game, state),
        qaValues: mcts.getQsaValues(game, state),
        ucbSumValues: mcts.getUcbSumValues(game, state),
      });
    }
  }
}
