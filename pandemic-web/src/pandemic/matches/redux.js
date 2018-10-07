// Constants

export const ACTIONS_PATH = '/actions';
export const STATES_PATH = '/states';
export const SIMULATIONS_PATH = '/simulations';
export const allPaths = [
  ACTIONS_PATH,
  STATES_PATH,
  SIMULATIONS_PATH,
];

// Initial State

const initialState = {
  currentStep: 1,
  path: SIMULATIONS_PATH,
};

// Action Types

const PREFIX = 'matches/';
const PREVIOUS_STEP = `${PREFIX}PREVIOUS_STEP`;
const NEXT_STEP = `${PREFIX}NEXT_STEP`;
const SET_MATCH_PATH = `${PREFIX}SET_MATCH_PATH`;

// Action Creators

export function previousStepAction() {
  return { type: PREVIOUS_STEP };
}

export function nextStepAction() {
  return { type: NEXT_STEP };
}

export function setMatchPathAction(path) {
  return { type: SET_MATCH_PATH, path };
}

// Reducer

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case PREVIOUS_STEP: {
      return {
        ...state,
        currentStep: state.currentStep - 1,
      };
    }
    case NEXT_STEP: {
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    }
    case SET_MATCH_PATH: {
      return {
        ...state,
        path: action.path,
      };
    }
    default: return state;
  }
}

// Selectors

export function getCurrentStep(state) {
  return state.matches.currentStep;
}

export function getMatchesPath(state) {
  return state.matches.path;
}
