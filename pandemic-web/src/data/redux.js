import { filter, tap } from 'rxjs/operators';

// Initial State

const initialState = {
  iterations: {},
};

// Reducer

export default function dataReducer(state = initialState, action) {
  switch (action) {
    default: {
      return state;
    }
  }
}

// Epics

export function fetchIterationsEpic(action$, state$, { apiClient }) {
  const version = '0.3.2';
  return apiClient.getAllIterations$(version).pipe(
    tap(x => console.log('iterations', x)),
    filter(() => false),
  );
}
