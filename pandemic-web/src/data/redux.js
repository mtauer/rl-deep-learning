import { map } from 'rxjs/operators';

import { mergeArrayIntoObject } from '../utils/reduxHelpers';

// Initial State

const initialState = {
  versions: {},
  iterations: {},
  matches: {},
  isInitialized: {
    versions: false,
    versionIterations: {},
    iterationMatches: {},
    matchMatchDetails: {},
  },
};

// Action Types

const PREFIX = 'data/';
export const GET_VERSIONS_SUCCESS = `${PREFIX}GET_VERSIONS_SUCCESS`;
export const GET_ITERATIONS_SUCCESS = `${PREFIX}GET_ITERATIONS_SUCCESS`;
export const GET_MATCHES_SUCCESS = `${PREFIX}GET_MATCHES_SUCCESS`;
export const GET_MATCH_DETAILS_SUCCESS = `${PREFIX}GET_MATCH_DETAILS_SUCCESS`;

// Action Creators

export function getVersionsSuccessAction(versions) {
  return { type: GET_VERSIONS_SUCCESS, versions };
}

export function getIterationsSuccessAction(versionId, iterations) {
  return { type: GET_ITERATIONS_SUCCESS, versionId, iterations };
}

export function getMatchesSuccessAction(iterationId, matches) {
  return { type: GET_MATCHES_SUCCESS, iterationId, matches };
}

export function getMatchDetailsSuccessAction(matchId, matchDetails) {
  return { type: GET_MATCH_DETAILS_SUCCESS, matchId, matchDetails };
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
      const { versionId, iterations } = action;
      return {
        ...state,
        iterations: mergeArrayIntoObject(
          state.iterations,
          iterations,
          i => i.iterationId,
        ),
        isInitialized: mergeArrayIntoObject(
          state.isInitialized,
          { [versionId]: true },
          () => 'versionIterations',
        ),
      };
    }
    case GET_MATCHES_SUCCESS: {
      const { iterationId, matches } = action;
      return {
        ...state,
        matches: mergeArrayIntoObject(
          state.matches,
          matches,
          i => i.matchId,
        ),
        isInitialized: mergeArrayIntoObject(
          state.isInitialized,
          { [iterationId]: true },
          () => 'iterationMatches',
        ),
      };
    }
    case GET_MATCH_DETAILS_SUCCESS: {
      const { matchId, matchDetails } = action;
      return {
        ...state,
        matches: mergeArrayIntoObject(
          state.matches,
          matchDetails,
          i => i.matchId,
        ),
        isInitialized: mergeArrayIntoObject(
          state.isInitialized,
          { [matchId]: true },
          () => 'matchMatchDetails',
        ),
      };
    }
    default: {
      return state;
    }
  }
}

// Selectors

export function getVersions(state) {
  return state.data.versions;
}

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
