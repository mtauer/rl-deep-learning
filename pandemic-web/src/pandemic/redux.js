const initialState = {
  gameState: {},
  validActions: [],
  predictedPValues: [],
  predictedVValues: [],
  naValues: [],
  paValues: [],
  qaValues: [],
  ucbSumValues: [],
  probabilities: [],
  tempProbabilities: [],
  nextAction: {},
};

const PREFIX = 'pandemic/';
const SIMULATION_UPDATE = `${PREFIX}SIMULATION_UPDATE`;

export function simulationUpdateAction(data) {
  return { type: SIMULATION_UPDATE, data };
}

export default function pandemicReducer(state = initialState, action) {
  switch (action.type) {
    case SIMULATION_UPDATE: {
      const {
        state: gameState,
        validActions,
        predictedPValues,
        predictedVValues,
        naValues,
        paValues,
        qaValues,
        ucbSumValues,
        probabilities,
        tempProbabilities,
        nextAction,
      } = action.data;
      return {
        ...state,
        gameState,
        validActions,
        predictedPValues,
        predictedVValues,
        naValues,
        paValues,
        qaValues,
        ucbSumValues,
        probabilities,
        tempProbabilities,
        nextAction,
      };
    }
    default: return state;
  }
}

export function getGameState(state) {
  return state.pandemic.gameState;
}

export function getValidActions(state) {
  return state.pandemic.validActions;
}

export function getPredictedPValues(state) {
  return state.pandemic.predictedPValues;
}

export function getPredictedVValues(state) {
  return state.pandemic.predictedVValues;
}

export function getNaValues(state) {
  return state.pandemic.naValues;
}

export function getPaValues(state) {
  return state.pandemic.paValues;
}

export function getQaValues(state) {
  return state.pandemic.qaValues;
}

export function getUcbSumValues(state) {
  return state.pandemic.ucbSumValues;
}

export function getProbabilities(state) {
  return state.pandemic.probabilities;
}

export function getTempProbabilities(state) {
  return state.pandemic.tempProbabilities;
}

export function getNextAction(state) {
  return state.pandemic.nextAction;
}
