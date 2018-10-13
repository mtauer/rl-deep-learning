import fill from 'lodash/fill';

import game, { allActions } from '../pandemic-web/src/pandemic-shared/game';
import { toNetworkProbabilities } from '../utils';

describe('toNetworkProbabilities', () => {
  it('should handle DO_NOTHING', () => {
    testActionType(
      [{ type: allActions.DO_NOTHING }],
      [0],
    );
  });

  it('should handle DRIVE_FERRY', () => {
    const offset = 1 + 0 * 48;
    testActionType(
      [{ type: allActions.DRIVE_FERRY, to: 5 }, { type: allActions.DRIVE_FERRY, to: 6 }],
      [offset + 5, offset + 6],
    );
  });

  it('should handle DIRECT_FLIGHT', () => {
    const offset = 1 + 1 * 48;
    testActionType(
      [{ type: allActions.DIRECT_FLIGHT, to: 5 }, { type: allActions.DIRECT_FLIGHT, to: 6 }],
      [offset + 5, offset + 6],
    );
  });

  it('should handle CHARTER_FLIGHT', () => {
    const offset = 1 + 2 * 48;
    testActionType(
      [{ type: allActions.CHARTER_FLIGHT, to: 5 }, { type: allActions.CHARTER_FLIGHT, to: 6 }],
      [offset + 5, offset + 6],
    );
  });

  it('should handle SHUTTLE_FLIGHT', () => {
    const offset = 1 + 3 * 48;
    testActionType(
      [{ type: allActions.SHUTTLE_FLIGHT, to: 5 }, { type: allActions.SHUTTLE_FLIGHT, to: 6 }],
      [offset + 5, offset + 6],
    );
  });

  it('should handle BUILD_RESEARCH_CENTER', () => {
    const offset = 1 + 4 * 48;
    testActionType(
      [{ type: allActions.BUILD_RESEARCH_CENTER, at: 5 }],
      [offset + 5],
    );
  });

  it('should handle DISCARD_CARD', () => {
    const offset = 1 + 5 * 48;
    testActionType(
      [{ type: allActions.DISCARD_CARD, card: 5 }, { type: allActions.DISCARD_CARD, card: 6 }],
      [offset + 5, offset + 6],
    );
  });

  it('should handle SHARE_KNOWLEDGE', () => {
    const offset = 1 + 6 * 48;
    testActionType(
      [{ type: allActions.SHARE_KNOWLEDGE, card: 7 }],
      [offset + 7],
    );
  });

  it('should handle DISCOVER_CURE', () => {
    const offset = 1 + 7 * 48;
    const actions = [
      { type: allActions.DISCOVER_CURE, usedCards: [1, 2, 3, 4] },
      { type: allActions.DISCOVER_CURE, usedCards: [3, 4, 5, 6] },
    ];
    const actionProbabilities = [
      0.1,
      0.2,
    ];
    const expected = fill(new Array(385), 0);
    expected[offset + 1] = 0.1;
    expected[offset + 2] = 0.1;
    expected[offset + 3] = 0.1 + 0.2;
    expected[offset + 4] = 0.1 + 0.2;
    expected[offset + 5] = 0.2;
    expected[offset + 6] = 0.2;
    expect(toNetworkProbabilities(game, actions, actionProbabilities)).toEqual(expected);
  });

  function testActionType(actions, indices) {
    const actionProbabilities = actions.map((a, i) => (i + 1) * 0.1);
    const expected = fill(new Array(385), 0);
    indices.forEach((index, i) => {
      expected[index] = actionProbabilities[i];
    });
    expect(toNetworkProbabilities(game, actions, actionProbabilities)).toEqual(expected);
  }
});
