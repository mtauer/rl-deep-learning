import http from 'http';
import express from 'express';
import SocketIo from 'socket.io';

import runExperiment1 from './experiment1';

const app = express();
const server = http.Server(app);
const io = new SocketIo(server);
const port = process.env.PORT || 3001;

let connectedSocket = null;

io.on('connection', (socket) => {
  connectedSocket = socket;
  runExperiment1(connectedSocket);
  // socket.emit('simulation_start', { test: 'TEST' });
  socket.on('disconnect', () => {
    connectedSocket = null;
  });
});

server.listen(port, () => {
  console.log('[INFO] Listening on *:', port);
});
