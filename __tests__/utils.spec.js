import fill from 'lodash/fill';

import game, { allActions, DISEASE_BLUE, DISEASE_RED } from '../pandemic-web/src/pandemic-shared/game';
import { toNetworkProbabilities, fromNetworkProbabilities } from '../utils';

const networkProbabilitiesSize = 341;

describe('toNetworkProbabilities', () => {
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
    const actionProbabilities = expectedValues.map(expectedValue => expectedValue.value);
    const expected = fill(new Array(networkProbabilitiesSize), 0);
    expectedValues.forEach((expectedValue) => {
      expected[expectedValue.index] = expectedValue.value;
    });
    expect(toNetworkProbabilities(game, actions, actionProbabilities)).toEqual(expected);
  }
});

describe('fromNetworkProbabilities', () => {
  it('should handle DO_NOTHING', () => {
    testFromNetworkProbabilities(
      [{ type: allActions.DO_NOTHING }],
      [{ index: 0, value: 1 }],
    );
  });

  it('should handle DRIVE_FERRY', () => {
    const offset = 1 + 0 * 48;
    testFromNetworkProbabilities(
      [
        { type: allActions.DRIVE_FERRY, to: 7 },
        { type: allActions.DRIVE_FERRY, to: 8 },
      ],
      [
        { index: offset + 7, value: 0.25 },
        { index: offset + 8, value: 0.75 },
      ],
    );
  });

  it('should handle DIRECT_FLIGHT', () => {
    const offset = 1 + 1 * 48;
    testFromNetworkProbabilities(
      [
        { type: allActions.DIRECT_FLIGHT, to: 7 },
        { type: allActions.DIRECT_FLIGHT, to: 8 },
      ],
      [
        { index: offset + 7, value: 0.25 },
        { index: offset + 8, value: 0.75 },
      ],
    );
  });

  it('should handle CHARTER_FLIGHT', () => {
    const offset = 1 + 2 * 48;
    testFromNetworkProbabilities(
      [
        { type: allActions.CHARTER_FLIGHT, to: 7 },
        { type: allActions.CHARTER_FLIGHT, to: 8 },
      ],
      [
        { index: offset + 7, value: 0.25 },
        { index: offset + 8, value: 0.75 },
      ],
    );
  });

  it('should handle SHUTTLE_FLIGHT', () => {
    const offset = 1 + 3 * 48;
    testFromNetworkProbabilities(
      [
        { type: allActions.SHUTTLE_FLIGHT, to: 7 },
        { type: allActions.SHUTTLE_FLIGHT, to: 8 },
      ],
      [
        { index: offset + 7, value: 0.25 },
        { index: offset + 8, value: 0.75 },
      ],
    );
  });

  it('should handle BUILD_RESEARCH_CENTER', () => {
    const offset = 1 + 4 * 48;
    testFromNetworkProbabilities(
      [{ type: allActions.BUILD_RESEARCH_CENTER, at: 7 }],
      [{ index: offset + 7, value: 1 }],
    );
  });

  it('should handle DISCARD_CARD', () => {
    const offset = 1 + 5 * 48;
    testFromNetworkProbabilities(
      [
        { type: allActions.DISCARD_CARD, card: 7 },
        { type: allActions.DISCARD_CARD, card: 8 },
      ],
      [
        { index: offset + 7, value: 0.25 },
        { index: offset + 8, value: 0.75 },
      ],
    );
  });

  it('should handle SHARE_KNOWLEDGE', () => {
    const offset = 1 + 6 * 48;
    testFromNetworkProbabilities(
      [
        { type: allActions.SHARE_KNOWLEDGE, card: 7 },
        { type: allActions.SHARE_KNOWLEDGE, card: 8 },
      ],
      [
        { index: offset + 7, value: 0.25 },
        { index: offset + 8, value: 0.75 },
      ],
    );
  });

  it('should handle DISCOVER_CURE', () => {
    const offset = 1 + 7 * 48;
    testFromNetworkProbabilities(
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

  function testFromNetworkProbabilities(actions, expectedValues) {
    const networkProbabilities = fill(new Array(networkProbabilitiesSize), 0);
    expectedValues.forEach((expectedValue) => {
      networkProbabilities[expectedValue.index] = expectedValue.value;
    });
    const expected = expectedValues.map(expectedValue => expectedValue.value);
    expect(fromNetworkProbabilities(game, actions, networkProbabilities)).toEqual(expected);
  }
});
