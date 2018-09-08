import range from 'lodash/range';

import game, { DO_NOTHING, BUILD_RESEARCH_CENTER, DISCOVER_CURE, SHARE_KNOWLEDGE,
  DISCARD_CARD, DRIVE_FERRY, DIRECT_FLIGHT, SHUTTLE_FLIGHT, CHARTER_FLIGHT,
} from '../pandemic-web/src/pandemic-shared/game';
import { toNNProbabilities, fromNNProbabilities } from '../utils';

describe('toNNProbabilities', () => {
  it('should diffuse a single probability per action (actions are in order)', () => {
    const probabilities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    const actions = [
      DO_NOTHING,
      BUILD_RESEARCH_CENTER,
      DISCOVER_CURE,
      SHARE_KNOWLEDGE,
      DISCARD_CARD,
      DRIVE_FERRY,
      DIRECT_FLIGHT,
      SHUTTLE_FLIGHT,
      CHARTER_FLIGHT,
    ].map(type => ({ type }));
    const expected = [
      0.1,
      0.2,
      0.3,
      0.4,
      0.5, ...range(0, 8, 0),
      0.6, ...range(0, 5, 0),
      0.7, ...range(0, 6, 0),
      0.8, ...range(0, 3, 0),
      0.9, ...range(0, 46, 0),
    ];
    expect(toNNProbabilities(game, probabilities, actions)).toEqual(expected);
  });

  it('should diffuse a single probability per action (actions are in random order)', () => {
    const probabilities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    const actions = [
      DIRECT_FLIGHT,
      DRIVE_FERRY,
      CHARTER_FLIGHT,
      BUILD_RESEARCH_CENTER,
      SHUTTLE_FLIGHT,
      SHARE_KNOWLEDGE,
      DISCARD_CARD,
      DO_NOTHING,
      DISCOVER_CURE,
    ].map(type => ({ type }));
    const expected = [
      0.8,
      0.4,
      0.9,
      0.6,
      0.7, ...range(0, 8, 0),
      0.2, ...range(0, 5, 0),
      0.1, ...range(0, 6, 0),
      0.5, ...range(0, 3, 0),
      0.3, ...range(0, 46, 0),
    ];
    expect(toNNProbabilities(game, probabilities, actions)).toEqual(expected);
  });

  it('should diffuse probabilities of the same action', () => {
    const probabilities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    const actions = [
      DO_NOTHING,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
    ].map(type => ({ type }));
    const expected = [
      0.1,
      0,
      0,
      0,
      0, ...range(0, 8, 0),
      0, ...range(0, 5, 0),
      0, ...range(0, 6, 0),
      0, ...range(0, 3, 0),
      0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, ...range(0, 39, 0),
    ];
    expect(toNNProbabilities(game, probabilities, actions)).toEqual(expected);
  });
});

describe('fromNNProbabilities', () => {
  it('should condense a single probability per action (actions are in order)', () => {
    const probabilities = [
      0.1,
      0.2,
      0.3,
      0.4,
      0.5, ...range(0, 8, 0),
      0.6, ...range(0, 5, 0),
      0.7, ...range(0, 6, 0),
      0.8, ...range(0, 3, 0),
      0.9, ...range(0, 46, 0),
    ];
    const actions = [
      DO_NOTHING,
      BUILD_RESEARCH_CENTER,
      DISCOVER_CURE,
      SHARE_KNOWLEDGE,
      DISCARD_CARD,
      DRIVE_FERRY,
      DIRECT_FLIGHT,
      SHUTTLE_FLIGHT,
      CHARTER_FLIGHT,
    ].map(type => ({ type }));
    const expected = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    expect(fromNNProbabilities(game, probabilities, actions)).toEqual(expected);
  });

  it('should condense a single probability per action (actions are in random order)', () => {
    const probabilities = [
      0.1,
      0.2,
      0.3,
      0.4,
      0.5, ...range(0, 8, 0),
      0.6, ...range(0, 5, 0),
      0.7, ...range(0, 6, 0),
      0.8, ...range(0, 3, 0),
      0.9, ...range(0, 46, 0),
    ];
    const actions = [
      DIRECT_FLIGHT,
      DRIVE_FERRY,
      CHARTER_FLIGHT,
      BUILD_RESEARCH_CENTER,
      SHUTTLE_FLIGHT,
      SHARE_KNOWLEDGE,
      DISCARD_CARD,
      DO_NOTHING,
      DISCOVER_CURE,
    ].map(type => ({ type }));
    const expected = [0.7, 0.6, 0.9, 0.2, 0.8, 0.4, 0.5, 0.1, 0.3];
    expect(fromNNProbabilities(game, probabilities, actions)).toEqual(expected);
  });

  it('should condense probabilities of the same action', () => {
    const probabilities = [
      0.1,
      0,
      0,
      0,
      0, ...range(0, 8, 0),
      0, ...range(0, 5, 0),
      0, ...range(0, 6, 0),
      0, ...range(0, 3, 0),
      0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, ...range(0, 39, 0),
    ];
    const actions = [
      DO_NOTHING,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
      CHARTER_FLIGHT,
    ].map(type => ({ type }));
    const expected = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    expect(fromNNProbabilities(game, probabilities, actions)).toEqual(expected);
  });
});
