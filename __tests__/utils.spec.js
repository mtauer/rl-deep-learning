import fill from 'lodash/fill';

import game, { allActions, DISEASE_BLUE, DISEASE_RED } from '../pandemic-web/src/pandemic-shared/game';
import { toNetworkProbabilities, fromNetworkProbabilities } from '../utils';

describe('toNetworkProbabilities', () => {
  const networkProbabilitiesSize = 341;

  it('should handle DO_NOTHING', () => {
    testToNetworkProbabilities(
      [{ type: allActions.DO_NOTHING }],
      [{ index: 0, value: 1.0 }],
    );
  });

  it('should handle DRIVE_FERRY', () => {
    const offset = 1 + 0 * 48;
    testToNetworkProbabilities(
      [
        { type: allActions.DRIVE_FERRY, to: 5 },
        { type: allActions.DRIVE_FERRY, to: 6 },
      ],
      [
        { index: offset + 5, value: 0.25 },
        { index: offset + 6, value: 0.75 },
      ],
    );
  });

  it('should handle DIRECT_FLIGHT', () => {
    const offset = 1 + 1 * 48;
    testToNetworkProbabilities(
      [
        { type: allActions.DIRECT_FLIGHT, to: 5 },
        { type: allActions.DIRECT_FLIGHT, to: 6 },
      ],
      [
        { index: offset + 5, value: 0.25 },
        { index: offset + 6, value: 0.75 },
      ],
    );
  });

  it('should handle CHARTER_FLIGHT', () => {
    const offset = 1 + 2 * 48;
    testToNetworkProbabilities(
      [
        { type: allActions.CHARTER_FLIGHT, to: 5 },
        { type: allActions.CHARTER_FLIGHT, to: 6 },
      ],
      [
        { index: offset + 5, value: 0.25 },
        { index: offset + 6, value: 0.75 },
      ],
    );
  });

  it('should handle SHUTTLE_FLIGHT', () => {
    const offset = 1 + 3 * 48;
    testToNetworkProbabilities(
      [
        { type: allActions.SHUTTLE_FLIGHT, to: 5 },
        { type: allActions.SHUTTLE_FLIGHT, to: 6 },
      ],
      [
        { index: offset + 5, value: 0.25 },
        { index: offset + 6, value: 0.75 },
      ],
    );
  });

  it('should handle BUILD_RESEARCH_CENTER', () => {
    const offset = 1 + 4 * 48;
    testToNetworkProbabilities(
      [{ type: allActions.BUILD_RESEARCH_CENTER, at: 5 }],
      [{ index: offset + 5, value: 1 }],
    );
  });

  it('should handle DISCARD_CARD', () => {
    const offset = 1 + 5 * 48;
    testToNetworkProbabilities(
      [
        { type: allActions.DISCARD_CARD, card: 5 },
        { type: allActions.DISCARD_CARD, card: 6 },
      ],
      [
        { index: offset + 5, value: 0.25 },
        { index: offset + 6, value: 0.75 },
      ],
    );
  });

  it('should handle SHARE_KNOWLEDGE', () => {
    const offset = 1 + 6 * 48;
    testToNetworkProbabilities(
      [{ type: allActions.SHARE_KNOWLEDGE, card: 7 }],
      [{ index: offset + 7, value: 1 }],
    );
  });

  it('should handle DISCOVER_CURE', () => {
    const offset = 1 + 7 * 48;
    testToNetworkProbabilities(
      [
        { type: allActions.DISCOVER_CURE, disease: DISEASE_BLUE },
        { type: allActions.DISCOVER_CURE, disease: DISEASE_RED },
      ],
      [
        { index: offset + 0, value: 0.25 },
        { index: offset + 3, value: 0.75 },
      ],
    );
  });

  function testToNetworkProbabilities(actions, expectedValues) {
    const actionProbabilities = actions.map((a, i) => expectedValues[i].value);
    const expected = fill(new Array(networkProbabilitiesSize), 0);
    expectedValues.forEach((expectedValue) => {
      expected[expectedValue.index] = expectedValue.value;
    });
    expect(toNetworkProbabilities(game, actions, actionProbabilities)).toEqual(expected);
  }
});

describe.skip('fromNetworkProbabilities', () => {
  it('should handle DO_NOTHING', () => {
    testFromNetworkProbabilities(
      [{ type: allActions.DO_NOTHING }],
      [0],
    );
  });

  it('should handle DRIVE_FERRY', () => {
    const offset = 1 + 0 * 48;
    testFromNetworkProbabilities(
      [{ type: allActions.DRIVE_FERRY, to: 7 }, { type: allActions.DRIVE_FERRY, to: 8 }],
      [offset + 7, offset + 8],
    );
  });

  it('should handle DIRECT_FLIGHT', () => {
    const offset = 1 + 1 * 48;
    testFromNetworkProbabilities(
      [{ type: allActions.DIRECT_FLIGHT, to: 7 }, { type: allActions.DIRECT_FLIGHT, to: 8 }],
      [offset + 7, offset + 8],
    );
  });

  it('should handle CHARTER_FLIGHT', () => {
    const offset = 1 + 2 * 48;
    testFromNetworkProbabilities(
      [{ type: allActions.CHARTER_FLIGHT, to: 7 }, { type: allActions.CHARTER_FLIGHT, to: 8 }],
      [offset + 7, offset + 8],
    );
  });

  it('should handle SHUTTLE_FLIGHT', () => {
    const offset = 1 + 3 * 48;
    testFromNetworkProbabilities(
      [{ type: allActions.SHUTTLE_FLIGHT, to: 7 }, { type: allActions.SHUTTLE_FLIGHT, to: 8 }],
      [offset + 7, offset + 8],
    );
  });

  it('should handle BUILD_RESEARCH_CENTER', () => {
    const offset = 1 + 4 * 48;
    testFromNetworkProbabilities(
      [{ type: allActions.BUILD_RESEARCH_CENTER, at: 7 }],
      [offset + 7],
    );
  });

  it('should handle DISCARD_CARD', () => {
    const offset = 1 + 5 * 48;
    testFromNetworkProbabilities(
      [{ type: allActions.DISCARD_CARD, card: 7 }, { type: allActions.DISCARD_CARD, card: 8 }],
      [offset + 7, offset + 8],
    );
  });

  it('should handle SHARE_KNOWLEDGE', () => {
    const offset = 1 + 6 * 48;
    testFromNetworkProbabilities(
      [
        { type: allActions.SHARE_KNOWLEDGE, card: 7 },
        { type: allActions.SHARE_KNOWLEDGE, card: 8 },
      ],
      [offset + 7, offset + 8],
    );
  });

  it('should handle DISCOVER_CURE', () => {
    const offset = 1 + 7 * 48;
    const actions = [
      { type: allActions.DISCOVER_CURE, usedCards: [1, 2, 3, 4] },
      { type: allActions.DISCOVER_CURE, usedCards: [3, 4, 5, 6] },
    ];
    const networkProbabilities = fill(new Array(385), 0.5);
    networkProbabilities[offset + 1] = 0.1;
    networkProbabilities[offset + 2] = 0.1;
    networkProbabilities[offset + 3] = 0.3;
    networkProbabilities[offset + 4] = 0.3;
    networkProbabilities[offset + 5] = 0.2;
    networkProbabilities[offset + 6] = 0.2;
    const expected = [0.2, 0.25];
    expect(fromNetworkProbabilities(game, actions, networkProbabilities)).toEqual(expected);
  });

  function testFromNetworkProbabilities(actions, indices) {
    const expected = actions.map((a, i) => (i + 1) * 0.1);
    const networkProbabilities = fill(new Array(385), 0.5);
    indices.forEach((index, i) => {
      networkProbabilities[index] = expected[i];
    });
    expect(fromNetworkProbabilities(game, actions, networkProbabilities)).toEqual(expected);
  }
});
