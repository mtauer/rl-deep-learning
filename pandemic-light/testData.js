import keys from 'lodash/keys';
import range from 'lodash/range';
import groupBy from 'lodash/groupBy';
import sampleSize from 'lodash/sampleSize';
import difference from 'lodash/difference';
import findIndex from 'lodash/findIndex';

import game, { locationsMap, DISCOVER_CURE } from '../pandemic-web/src/pandemic-shared/game';

// eslint-disable-next-line import/prefer-default-export
export function getTestExamples() {
  // generate perfect states
  const perfectStates = [];
  const cards = range(48);
  const samplesPerDisease = 100;
  const groupedCards = groupBy(cards, c => locationsMap[c].disease);
  keys(groupedCards).forEach((disease) => {
    for (let i = 0; i < samplesPerDisease; i += 1) {
      let playerACards = sampleSize(groupedCards[disease], 5);
      let otherCards = difference(cards, playerACards);
      playerACards = [
        ...playerACards,
        ...sampleSize(otherCards, Math.floor(Math.random() * 2)),
      ];
      otherCards = difference(otherCards, playerACards);
      const playerBCards = sampleSize(otherCards, Math.floor(Math.random() * 7));
      otherCards = difference(otherCards, playerBCards);
      const playedPlayerCards = sampleSize(
        otherCards, Math.floor(Math.random() * otherCards.length),
      );
      otherCards = difference(otherCards, playedPlayerCards);
      const otherResearchCenters = difference(cards, [3]);
      const researchCenters = [
        3,
        ...sampleSize(otherResearchCenters, Math.floor(Math.random() * 4)),
      ];
      const random = Math.random();
      const state = {
        currentPlayer: random < 0.5 ? 0 : 1,
        currentMovesLeft: Math.floor(Math.random() * 3) + 1,
        curedDiseases: [],
        playerPosition: {
          0: Math.floor(Math.random() * 48),
          1: Math.floor(Math.random() * 48),
        },
        researchCenters,
        playerCards: {
          0: random < 0.5 ? playerACards : playerBCards,
          1: random < 0.5 ? playerBCards : playerACards,
        },
        playedPlayerCards,
        insufficientPlayerCards: false,
      };
      perfectStates.push(state);
    }
  });
  return perfectStates.map((state) => {
    const validActions = game.getValidActions(state);
    const actionIndex = findIndex(validActions, a => a.type === DISCOVER_CURE);
    return {
      state,
      pValues: range(200).map((n, i) => (i === actionIndex ? 1 : 0)),
      vValue: 1,
      action: validActions[actionIndex],
    };
  });
}
