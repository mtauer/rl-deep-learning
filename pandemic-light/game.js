import fromPairs from 'lodash/fromPairs';
import range from 'lodash/range';
import shuffle from 'lodash/shuffle';
import slice from 'lodash/slice';
import concat from 'lodash/concat';
import includes from 'lodash/includes';
import flatten from 'lodash/flatten';

import { locations, routes } from './constants';

export const locationsMap = getLocationsMap();
export const players = getPlayers();
export const diseases = ['Yellow', 'Red', 'Blue', 'Black'];
export const initialState = prepareInitialState();

export const DO_NOTHING = 'DO_NOTHING';
export const DRIVE_FERRY = 'DRIVE_FERRY';
export const DIRECT_FLIGHT = 'DIRECT_FLIGHT';
export const CHARTER_FLIGHT = 'CHARTER_FLIGHT';
export const SHUTTLE_FLIGHT = 'SHUTTLE_FLIGHT';

export const PLAYERS = 'PLAYERS';
export const BOARD = 'BOARD';

export default {
  toNNInput,
  toKey,
  getValidActions,
  hasEnded,
  getWinner,
};

export function getValidActions(state = initialState) {
  const { currentPlayer, playerPosition, playerCards, researchCenters } = state;

  // DO_NOTHING
  const actions = [];
  actions.push({
    type: DO_NOTHING,
    player: currentPlayer,
  });
  const location = locationsMap[playerPosition[currentPlayer]];
  const cards = playerCards[currentPlayer];
  // DRIVE_FERRY
  actions.push(location.connectedLocations.map(id => ({
    type: DRIVE_FERRY,
    player: currentPlayer,
    from: location.id,
    to: id,
  })));
  // DIRECT_FLIGHT
  actions.push(cards.map(id => ({
    type: DIRECT_FLIGHT,
    player: currentPlayer,
    from: location.id,
    to: id,
    card: id,
  })));
  // CHARTER_FLIGHT
  if (includes(cards, location.id)) {
    actions.push(
      locations
        .filter(l => l.id !== location.id)
        .map(l => ({
          type: CHARTER_FLIGHT,
          player: currentPlayer,
          from: location.id,
          to: l.id,
          card: location.id,
        })),
    );
  }
  // SHUTTLE_FLIGHT
  if (researchCenters.length > 1 && includes(researchCenters, location.id)) {
    actions.push(
      researchCenters
        .filter(rc => rc !== location.id)
        .map(rc => ({
          type: SHUTTLE_FLIGHT,
          player: currentPlayer,
          from: location.id,
          to: rc,
        })),
    );
  }

  return flatten(actions);
}

export function hasEnded(state = initialState) {
  return Boolean(getWinner(state));
}

export function getWinner(state = initialState) {
  const {
    curedDiseases, insufficientPlayerCards,
  } = state;
  // TODO Change this back to length >= 4
  if (curedDiseases.length >= 2) {
    return PLAYERS;
  }
  if (insufficientPlayerCards) {
    return BOARD;
  }
  return null;
}

export function printState(state) {
  const buffer = toBuffer(state);
  const currentP0 = `${state.currentPlayer === 0 ? 'X' : ' '} ${state.currentPlayer === 0 ? state.currentMovesLeft : ' '}`;
  const currentP1 = `${state.currentPlayer === 1 ? 'X' : ' '} ${state.currentPlayer === 1 ? state.currentMovesLeft : ' '}`;
  /* eslint-disable no-console */
  console.log('P0', currentP0, buffer.player0Position.map(x => (x === 1 ? 'X' : '_')).join(''));
  console.log('P0    ', buffer.player0Cards.map(x => (x === 1 ? 'X' : '_')).join(''));
  console.log('P1', currentP1, buffer.player1Position.map(x => (x === 1 ? 'X' : '_')).join(''));
  console.log('P1    ', buffer.player1Cards.map(x => (x === 1 ? 'X' : '_')).join(''));
  console.log('RC    ', buffer.researchCenters.map(x => (x === 1 ? 'X' : '_')).join(''));
  console.log('Played', buffer.playedPlayerCards.map(x => (x === 1 ? 'X' : '_')).join(''));
  console.log('Cured diseases ', buffer.curedDiseases.map(x => (x === 1 ? 'X' : '_')).join(''),
    ' Insufficient player cards', state.insufficientPlayerCards ? 'X' : '_');
  /* eslint-enable no-console */
}

export function toNNInput(state) {
  const buffer = toBuffer(state);
  return concat(
    buffer.currentPlayer,
    buffer.currentMovesLeft,
    buffer.player0Position,
    buffer.player0Cards,
    buffer.player1Position,
    buffer.player1Cards,
    buffer.researchCenters,
    buffer.playedPlayerCards,
    buffer.curedDiseases,
    buffer.insufficientPlayerCards,
  );
}

export function toKey(state) {
  return toNNInput(state).map(b => (b === 1 ? 'X' : '_')).join('');
}

function toBuffer(state) {
  return {
    currentPlayer: players.map(p => (state.currentPlayer === p.id ? 1 : 0)),
    currentMovesLeft: range(1, 5).map(m => (state.currentMovesLeft === m ? 1 : 0)),
    player0Position: locations.map(l => (state.playerPosition[0] === l.id ? 1 : 0)),
    player0Cards: locations.map(l => (includes(state.playerCards[0], l.id) ? 1 : 0)),
    player1Position: locations.map(l => (state.playerPosition[1] === l.id ? 1 : 0)),
    player1Cards: locations.map(l => (includes(state.playerCards[1], l.id) ? 1 : 0)),
    playedPlayerCards: locations.map(l => (includes(state.playedPlayerCards, l.id) ? 1 : 0)),
    researchCenters: locations.map(l => (includes(state.researchCenters, l.id) ? 1 : 0)),
    curedDiseases: diseases.map(d => (includes(state.curedDiseases, d) ? 1 : 0)),
    insufficientPlayerCards: state.insufficientPlayerCards ? [1] : [0],
  };
}

function getLocationsMap() {
  const locationIdsByName = fromPairs(locations.map(l => [l.name, l.id]));
  const locationsById = fromPairs(locations.map(l => [l.id, {
    ...l,
    connectedLocations: [],
  }]));
  routes.forEach(([name1, name2]) => {
    const location1 = locationsById[locationIdsByName[name1]];
    const location2 = locationsById[locationIdsByName[name2]];
    location1.connectedLocations.push(location2.id);
    location2.connectedLocations.push(location1.id);
  });
  return locationsById;
}

function getPlayers() {
  return range(2).map(i => ({ id: i }));
}

function prepareInitialState() {
  let state = {};
  state = prepareResources(state);
  state = preparePlayerCards(state);
  return state;
}

function prepareResources(state) {
  // Position all players and a research center in Atlanta
  return {
    ...state,
    currentPlayer: players[0].id,
    currentMovesLeft: 4,
    curedDiseases: [],
    playerPosition: fromPairs(players.map(p => [p.id, 3])),
    researchCenters: [3],
  };
}

function preparePlayerCards(state) {
  // Shuffle the location player cards
  const cards = shuffle(locations.map(l => l.id));
  // Give 2 players 4 cards each, 3 player 3 cards, and 4 players 2 cards
  const cardsPerPlayerMap = { 2: 4, 3: 3, 4: 2 };
  const cardsPerPlayer = cardsPerPlayerMap[players.length];
  const playerCards = fromPairs(players.map((p, i) => [
    p.id,
    slice(cards, i * cardsPerPlayer, (i + 1) * cardsPerPlayer),
  ]));
  return {
    ...state,
    playerCards,
    playedPlayerCards: [],
    insufficientPlayerCards: false,
  };
}
