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
