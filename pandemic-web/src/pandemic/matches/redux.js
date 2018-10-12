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
  selectedVersion: null,
  selectedIteration: null,
  selectedMatch: null,
  currentStep: 1,
  path: ACTIONS_PATH,
};

// Action Types

const PREFIX = 'matches/';
export const SELECT_VERSION = `${PREFIX}SELECT_VERSION`;
export const PREVIOUS_STEP = `${PREFIX}PREVIOUS_STEP`;
export const NEXT_STEP = `${PREFIX}NEXT_STEP`;
export const SET_MATCH_PATH = `${PREFIX}SET_MATCH_PATH`;

// Action Creators

export function selectVersionAction(versionId) {
  return { type: SELECT_VERSION, versionId };
}

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
    case SELECT_VERSION: {
      return {
        ...state,
        selectedVersion: action.versionId,
      };
    }
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

export function getSelectedVersion(state) {
  return state.matches.selectedVersion;
}

export function getCurrentStep(state) {
  return state.matches.currentStep;
}

export function getMatchesPath(state) {
  return state.matches.path;
}
