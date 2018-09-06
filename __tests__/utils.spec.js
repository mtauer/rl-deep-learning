import { DO_NOTHING, BUILD_RESEARCH_CENTER, DISCOVER_CURE, SHARE_KNOWLEDGE,
  DISCARD_CARD, DRIVE_FERRY, DIRECT_FLIGHT, SHUTTLE_FLIGHT, CHARTER_FLIGHT,
} from '../pandemic-web/src/pandemic-shared/game';

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
  });
});
