import { map } from 'rxjs/operators';
import padStart from 'lodash/padStart';

import { mergeArrayIntoObject } from '../utils/reduxHelpers';

// Initial State

const initialState = {
  iterations: {},
  matches: {},
  isInitialized: {},
};

// Action Types

const PREFIX = 'data/';
export const GET_ALL_ITERATIONS_SUCCESS = `${PREFIX}GET_ALL_ITERATIONS_SUCCESS`;
export const GET_MATCH_DETAILS_SUCCESS = `${PREFIX}GET_MATCH_DETAILS_SUCCESS`;

// Action Creators

export function getAllIterationsSuccessAction(iterations) {
  return { type: GET_ALL_ITERATIONS_SUCCESS, iterations };
}

export function getMatchDetailsSuccessAction(matchDetails) {
  return { type: GET_MATCH_DETAILS_SUCCESS, matchDetails };
}

// Reducer

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_ITERATIONS_SUCCESS: {
      return {
        ...state,
        iterations: mergeArrayIntoObject(
          state.iterations,
          action.iterations,
          i => `${i.version}-${padStart(i.iteration, 3, '0')}`,
        ),
        isInitialized: mergeArrayIntoObject(
          state.isInitialized,
          [true],
          () => 'iterations',
        ),
      };
    }
    case GET_MATCH_DETAILS_SUCCESS: {
      return {
        ...state,
        iterations: mergeArrayIntoObject(
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

export function fetchIterationsEpic(action$, state$, { apiClient }) {
  const version = '0.3.2';
  return apiClient.getAllIterations$(version).pipe(
    map(iterations => getAllIterationsSuccessAction(iterations)),
  );
}

export function fetchMatchDetailsEpic(action$, state$, { apiClient }) {
  const matchId = 'bbdea21a-cae8-402d-a1a1-f31a6692ebf5';
  return apiClient.getMatchDetails$(matchId).pipe(
    map(matchDetails => getMatchDetailsSuccessAction(matchDetails)),
  );
}
