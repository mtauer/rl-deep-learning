import { map } from 'rxjs/operators';
import uuidv4 from 'uuid/v4';

import { mergeArrayIntoObject } from '../utils/reduxHelpers';

// Initial State

const initialState = {
  iterations: {},
  isInitialized: {},
  hasErrors: {},
};

// Action Types

const PREFIX = 'data/';
export const GET_ALL_ITERATIONS_SUCCESS = `${PREFIX}GET_ALL_ITERATIONS_SUCCESS`;

// Action Creators

export function getAllIterationsSuccessAction(iterations) {
  return { type: GET_ALL_ITERATIONS_SUCCESS, iterations };
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
          () => uuidv4(),
        ),
        isInitialized: mergeArrayIntoObject(
          state.isInitialized,
          [true],
          () => 'iterations',
        ),
      };
    }
    default: {
      return state;
    }
  }
}

// Epics

export function fetchIterationsEpic(action$, state$, { apiClient }) {
  const version = '0.3.2';
  return apiClient.getAllIterations$(version).pipe(
    map(iterations => getAllIterationsSuccessAction(iterations)),
  );
}
