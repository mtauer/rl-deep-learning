import { map, switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import values from 'lodash/values';

import { getIterationsSuccessAction, getIterations } from '../../data/redux';

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
  selectedVersionId: null,
  selectedIterationId: null,
  selectedMatchId: null,
  currentStep: 1,
  path: ACTIONS_PATH,
};

// Action Types

const PREFIX = 'matches/';
export const SELECT_VERSION = `${PREFIX}SELECT_VERSION`;
export const SELECT_ITERATION = `${PREFIX}SELECT_ITERATION`;
export const PREVIOUS_STEP = `${PREFIX}PREVIOUS_STEP`;
export const NEXT_STEP = `${PREFIX}NEXT_STEP`;
export const SET_MATCH_PATH = `${PREFIX}SET_MATCH_PATH`;

// Action Creators

export function selectVersionAction(versionId) {
  return { type: SELECT_VERSION, versionId };
}

export function selectIterationAction(iterationId) {
  return { type: SELECT_ITERATION, iterationId };
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
        selectedVersionId: action.versionId,
      };
    }
    case SELECT_ITERATION: {
      return {
        ...state,
        selectedIterationId: action.iterationId,
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

export function getSelectedVersionId(state) {
  return state.matches.selectedVersionId;
}

export function getSelectedIterationId(state) {
  return state.matches.selectedIterationId;
}

export function getSelectedIterationsArray(state) {
  const versionId = getSelectedVersionId(state);
  const iterationsMap = getIterations(state);
  return values(iterationsMap)
    .filter(i => i.versionId === versionId);
}

export function getCurrentStep(state) {
  return state.matches.currentStep;
}

export function getMatchesPath(state) {
  return state.matches.path;
}

// Epics

export function fetchIterationsEpic(action$, state$, { apiClient }) {
  return action$.pipe(
    ofType(SELECT_VERSION),
    switchMap(({ versionId }) => apiClient.getIterations$(versionId).pipe(
      map(iterations => getIterationsSuccessAction(versionId, iterations)),
    )),
  );
}
