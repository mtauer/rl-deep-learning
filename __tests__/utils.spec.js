import range from 'lodash/range';

import game, { DO_NOTHING, BUILD_RESEARCH_CENTER, DISCOVER_CURE, SHARE_KNOWLEDGE,
  DISCARD_CARD, DRIVE_FERRY, DIRECT_FLIGHT, SHUTTLE_FLIGHT, CHARTER_FLIGHT,
} from '../pandemic-web/src/pandemic-shared/game';
import { diffuseProbabilities, condenseProbabilities } from '../utils';

describe('diffuseProbabilities', () => {
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
    expect(diffuseProbabilities(game, probabilities, actions)).toEqual(expected);
  });
});

describe('condenseProbabilities', () => {
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
    expect(condenseProbabilities(game, probabilities, actions)).toEqual(expected);
  });
});
