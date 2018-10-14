import fromPairs from 'lodash/fromPairs';
import toPairs from 'lodash/toPairs';
import range from 'lodash/range';
import shuffle from 'lodash/shuffle';
import slice from 'lodash/slice';
import concat from 'lodash/concat';
import includes from 'lodash/includes';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import values from 'lodash/values';
import take from 'lodash/take';
import groupBy from 'lodash/groupBy';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

import { locations, routes } from './constants';

export const locationsMap = getLocationsMap();
export const players = getPlayers();
export const diseases = ['Yellow', 'Red', 'Blue', 'Black'];
export const initialState = getInitialState();

export const DO_NOTHING = 'DO_NOTHING';
export const DRIVE_FERRY = 'DRIVE_FERRY';
export const DIRECT_FLIGHT = 'DIRECT_FLIGHT';
export const CHARTER_FLIGHT = 'CHARTER_FLIGHT';
export const SHUTTLE_FLIGHT = 'SHUTTLE_FLIGHT';
export const BUILD_RESEARCH_CENTER = 'BUILD_RESEARCH_CENTER';
export const DISCARD_CARD = 'DISCARD_CARD';
export const SHARE_KNOWLEDGE = 'SHARE_KNOWLEDGE';
export const DISCOVER_CURE = 'DISCOVER_CURE';

export const allActions = {
  DO_NOTHING,
  DRIVE_FERRY,
  DIRECT_FLIGHT,
  CHARTER_FLIGHT,
  SHUTTLE_FLIGHT,
  BUILD_RESEARCH_CENTER,
  DISCARD_CARD,
  SHARE_KNOWLEDGE,
  DISCOVER_CURE,
};

export const PLAYERS = 'PLAYERS';
export const BOARD = 'BOARD';

export const DISEASE_BLUE = 'Blue';
export const DISEASE_YELLOW = 'Yellow';
export const DISEASE_BLACK = 'Black';
export const DISEASE_RED = 'Red';

export default {
  toNNState,
  toKey,
  getValidActions,
  performAction,
  getValue,
  hasEnded,
  getWinner,
  getInitialState,
  getDescription,
};

const gameConfig = {
  discoverCure: {
    cardsNeeded: 4,
    researchCenterNeeded: true,
  },
  description: 'To win discover 1 cure in a research center with 4 cards (of the same color). No diseases, no roles, no special cards.',
};

function getDescription() {
  return gameConfig.description;
}

function getValidActions(state = initialState) {
  const { currentPlayer, playerPosition, playerCards, researchCenters } = state;
  const actions = [];

  // Immediate actions
  range(2).forEach((player) => {
    const cards = playerCards[player];
    if (cards.length > 7) {
      actions.push(cards.map(card => ({
        type: DISCARD_CARD,
        player,
        card,
      })));
    }
  });
  if (actions.length > 0) {
    return flatten(actions);
  }

  // DO_NOTHING
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
  // BUILD_RESEARCH_CENTER
  if (includes(cards, location.id)) {
    actions.push({
      type: BUILD_RESEARCH_CENTER,
      player: currentPlayer,
      at: location.id,
      card: location.id,
    });
  }
  // DISCOVER_CURE
  const cardsByDisease = groupBy(cards, (c => locationsMap[c].disease));
  const { cardsNeeded, researchCenterNeeded } = gameConfig.discoverCure;
  const islocationValid = researchCenterNeeded
    ? includes(researchCenters, location.id)
    : true;
  if (islocationValid) {
    actions.push(
      toPairs(cardsByDisease)
        .filter(pair => pair[1].length >= cardsNeeded)
        .map((pair) => {
          const usedCards = take(pair[1], cardsNeeded);
          return {
            type: DISCOVER_CURE,
            player: currentPlayer,
            disease: pair[0],
            usedCards,
          };
        }),
    );
  }
  // SHARE_KNOWLEDGE
  const playersOnLocation = toPairs(playerPosition)
    .filter(pair => pair[1] === location.id)
    .map(pair => Number(pair[0]));
  if (playersOnLocation.length > 1) {
    const others = playersOnLocation.filter(id => id !== currentPlayer);
    if (includes(cards, location.id)) {
      actions.push(others.map(id => ({
        type: SHARE_KNOWLEDGE,
        player: currentPlayer,
        card: location.id,
        from: currentPlayer,
        to: id,
      })));
    } else {
      others.forEach((id) => {
        if (includes(playerCards[id], location.id)) {
          actions.push({
            type: SHARE_KNOWLEDGE,
            player: currentPlayer,
            card: location.id,
            from: id,
            to: currentPlayer,
          });
        }
      });
    }
  }

  return flatten(actions);
}

function performAction(state = initialState, action) {
  const { player } = action;
  const newState = cloneState(state);
  switch (action.type) {
    case DO_NOTHING: {
      newState.currentMovesLeft -= 1;
      break;
    }
    case DRIVE_FERRY: {
      const { to } = action;
      newState.currentMovesLeft -= 1;
      newState.playerPosition[player] = to;
      break;
    }
    case DIRECT_FLIGHT: {
      const { to, card } = action;
      newState.currentMovesLeft -= 1;
      newState.playerPosition[player] = to;
      newState.playerCards[player] = newState.playerCards[player].filter(id => id !== card);
      newState.playedPlayerCards = sortBy([...newState.playedPlayerCards, card]);
      break;
    }
    case CHARTER_FLIGHT: {
      const { to, card } = action;
      newState.currentMovesLeft -= 1;
      newState.playerPosition[player] = to;
      newState.playerCards[player] = newState.playerCards[player].filter(id => id !== card);
      newState.playedPlayerCards = sortBy([...newState.playedPlayerCards, card]);
      break;
    }
    case SHUTTLE_FLIGHT: {
      const { to } = action;
      newState.currentMovesLeft -= 1;
      newState.playerPosition[player] = to;
      break;
    }
    case BUILD_RESEARCH_CENTER: {
      const { at, card } = action;
      newState.currentMovesLeft -= 1;
      newState.researchCenters = sortBy([...newState.researchCenters, at]);
      newState.playerCards[player] = newState.playerCards[player].filter(id => id !== card);
      newState.playedPlayerCards = sortBy([...newState.playedPlayerCards, card]);
      break;
    }
    case DISCOVER_CURE: {
      const { disease, usedCards } = action;
      newState.currentMovesLeft -= 1;
      newState.curedDiseases = sortBy([...newState.curedDiseases, disease]);
      newState.playerCards[player] = difference(newState.playerCards[player], usedCards);
      newState.playedPlayerCards = sortBy([...newState.playedPlayerCards, ...usedCards]);
      break;
    }
    case SHARE_KNOWLEDGE: {
      const { card, from, to } = action;
      newState.currentMovesLeft -= 1;
      newState.playerCards[from] = newState.playerCards[from].filter(id => id !== card);
      newState.playerCards[to] = sortBy([...newState.playerCards[to], card]);
      break;
    }
    case DISCARD_CARD: {
      const { card } = action;
      newState.playerCards[player] = newState.playerCards[player].filter(c => c !== card);
      newState.playedPlayerCards = sortBy([...newState.playedPlayerCards, card]);
      break;
    }
    default:
      break;
  }
  if (newState.currentMovesLeft === 0) {
    // Draw 2 cards
    const cardsOut = concat(...values(newState.playerCards), newState.playedPlayerCards);
    const unplayedPlayerCards = locations.filter(l => !includes(cardsOut, l.id)).map(l => l.id);
    if (unplayedPlayerCards.length <= 2) {
      newState.insufficientPlayerCards = true;
    } else {
      const shuffledCards = shuffle(unplayedPlayerCards);
      const newCards = take(shuffledCards, 2);
      newState.playerCards[player] = sortBy([
        ...newState.playerCards[player],
        ...newCards.filter(id => id < 48),
      ]);
    }
    // End of turn
    newState.currentPlayer = (newState.currentPlayer + 1) % players.length;
    newState.currentMovesLeft = 4;
  }
  return newState;
}

function getValue(state = initialState, timePenalty = 0) {
  const winner = getWinner(state);
  switch (winner) {
    case PLAYERS: {
      const negativReward = 0.9 * ((getMaxSteps() - getStepsLeft(state)) / getMaxSteps());
      return 1 - negativReward;
    }
    case BOARD: return -1;
    default: return timePenalty;
  }
}

function hasEnded(state = initialState) {
  return Boolean(getWinner(state));
}

function getWinner(state = initialState) {
  const {
    curedDiseases, insufficientPlayerCards,
  } = state;
  // TODO Change this back to length >= 4
  if (curedDiseases.length >= 1) {
    return PLAYERS;
  }
  if (insufficientPlayerCards) {
    return BOARD;
  }
  return null;
}

function getMaxSteps() {
  return 80 + 4;
}

function getStepsLeft(state = initialState) {
  const cardsLeft = locations.length
    - state.playerCards[0].length
    - state.playerCards[1].length
    - state.playedPlayerCards.length;
  const movesLeft = state.currentMovesLeft;
  return cardsLeft / 2 * 4 + movesLeft;
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

function toNNState(state) {
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

function toKey(state) {
  return [
    state.currentPlayer,
    state.currentMovesLeft,
    state.playerPosition[0],
    sortBy(state.playerCards[0]).join(','),
    state.playerPosition[1],
    sortBy(state.playerCards[1]).join(','),
    sortBy(state.researchCenters).join(','),
    sortBy(state.playedPlayerCards).join(','),
    sortBy(state.curedDiseases).join(','),
    state.insufficientPlayerCards ? 'X' : '_',
  ].join('|');
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

function cloneState(state) {
  return cloneDeep(state);
}

function getInitialState() {
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
    sortBy(slice(cards, i * cardsPerPlayer, (i + 1) * cardsPerPlayer)),
  ]));
  return {
    ...state,
    playerCards,
    playedPlayerCards: [],
    insufficientPlayerCards: false,
  };
}
