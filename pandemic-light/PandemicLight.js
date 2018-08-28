import fromPairs from 'lodash/fromPairs';
import range from 'lodash/range';
import shuffle from 'lodash/shuffle';
import slice from 'lodash/slice';

import { locations, routes } from './constants';

export const locationsMap = getLocationsMap();
export const players = getPlayers();
export const initialState = prepareInitialState();

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
    currentMovesCount: 4,
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
