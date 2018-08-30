import io from 'socket.io-client';

import initialGameState from '../pandemic-shared/initialState.json';
import game from '../pandemic-shared/game';

const initialState = {
  gameState: initialGameState,
  gameNextActions: game.getValidActions(initialGameState),
};

export default function pandemicReducer(state = initialState, action) {
  switch (action.type) {
    default: return state;
  }
}

export function getGameState(state) {
  return state.pandemic.gameState;
}

export function getGameNextActions(state) {
  return state.pandemic.gameNextActions;
}

const socket = io('http://localhost:3001');
socket.on('simulation_start', (data) => {
  console.log('on simulation_start', data);
});
socket.on('connect_error', () => {
  console.log('connect_error');
  socket.close();
});
socket.on('disconnect', () => {
  console.log('disconnect');
  socket.close();
});
