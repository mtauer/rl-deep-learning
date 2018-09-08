import http from 'http';
import express from 'express';
import SocketIo from 'socket.io';

export default class Monitor {
  constructor() {
    this.connectedSocket = null;
    this.lastUpdate = 0;
    this.listeners = [];
    const app = express();
    const server = http.Server(app);
    const io = new SocketIo(server);
    const port = process.env.PORT || 3001;

    io.on('connection', (socket) => {
      this.connectedSocket = socket;
      this.listeners.forEach(l => l.onConnection());
      socket.on('disconnect', () => {
        this.connectedSocket = null;
        this.listeners.forEach(l => l.onDisconnection());
      });
    });

    server.listen(port, () => {
      console.log('++++++++++++++++++++ [INFO] Listening on *:', port);
    });
  }

  updateSimulation(mcts, state) {
    const now = Date.now();
    if (mcts && this.connectedSocket && now - this.lastUpdate > 5000) {
      this.lastUpdate = now;
      this.connectedSocket.emit('simulation_update', {
        state,
        validActions: mcts.getGame().getValidActions(state),
        predictedPValues: mcts.getPredictedPValues(state),
        predictedVValues: [mcts.getPredictedVValue(state)],
        naValues: mcts.getNsaValues(state),
        paValues: mcts.getPsaValues(state),
        qaValues: mcts.getQsaValues(state),
        ucbSumValues: mcts.getUcbSumValues(state),
      });
    }
  }

  addListener(listener) {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}
