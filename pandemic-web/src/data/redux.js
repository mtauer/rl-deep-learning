import { map } from 'rxjs/operators';

import { mergeArrayIntoObject } from '../utils/reduxHelpers';

// Initial State

const initialState = {
  versions: {},
  iterations: {},
  matches: {},
  isInitialized: {},
};

// Action Types

const PREFIX = 'data/';
export const GET_VERSIONS_SUCCESS = `${PREFIX}GET_VERSIONS_SUCCESS`;
export const GET_ITERATIONS_SUCCESS = `${PREFIX}GET_ITERATIONS_SUCCESS`;
export const GET_MATCH_DETAILS_SUCCESS = `${PREFIX}GET_MATCH_DETAILS_SUCCESS`;

// Action Creators

export function getVersionsSuccessAction(versions) {
  return { type: GET_VERSIONS_SUCCESS, versions };
}

export function getIterationsSuccessAction(iterations) {
  return { type: GET_ITERATIONS_SUCCESS, iterations };
}

export function getMatchDetailsSuccessAction(matchDetails) {
  return { type: GET_MATCH_DETAILS_SUCCESS, matchDetails };
}

// Reducer

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VERSIONS_SUCCESS: {
      return {
        ...state,
        versions: mergeArrayIntoObject(
          state.versions,
          action.versions,
          v => v.versionId,
        ),
        isInitialized: mergeArrayIntoObject(
          state.isInitialized,
          [true],
          () => 'versions',
        ),
      };
    }
    case GET_ITERATIONS_SUCCESS: {
      return {
        ...state,
        iterations: mergeArrayIntoObject(
          state.iterations,
          action.iterations,
          i => i.iterationId,
        ),
        isInitialized: mergeArrayIntoObject(
          state.isInitialized,
          [{ [action.iterations.iterationId]: true }],
          () => 'iterations',
        ),
      };
    }
    case GET_MATCH_DETAILS_SUCCESS: {
      return {
        ...state,
        matches: mergeArrayIntoObject(
          state.matches,
          [action.matchDetails],
          m => m.matchId,
        ),
        isInitialized: mergeArrayIntoObject(
          state.isInitialized,
          [{ [action.matchDetails.matchId]: true }],
          () => 'matches',
        ),
      };
    }
    default: {
      return state;
    }
  }
}

// Selectors

export function getIterations(state) {
  return state.data.iterations;
}

export function getMatches(state) {
  return state.data.matches;
}

export function getIsInitialized(state) {
  return state.data.isInitialized;
}

// Epics

export function fetchVersionsEpic(action$, state$, { apiClient }) {
  return apiClient.getAllVersions$().pipe(
    map(versions => getVersionsSuccessAction(versions)),
  );
}

export function fetchIterationsEpic(action$, state$, { apiClient }) {
  const version = '0.3.2';
  return apiClient.getIterations$(version).pipe(
    map(iterations => getIterationsSuccessAction(iterations)),
  );
}

export function fetchMatchDetailsEpic(action$, state$, { apiClient }) {
  const matchId = 'bbdea21a-cae8-402d-a1a1-f31a6692ebf5';
  return apiClient.getMatchDetails$(matchId).pipe(
    map(matchDetails => getMatchDetailsSuccessAction(matchDetails)),
  );
}
