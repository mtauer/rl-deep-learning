// Initial State

const initialState = {
  currentStep: 1,
};

// Action Types

// Action Creators

// Reducer

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    default: return state;
  }
}

// Selectors

export function getCurrentStep(state) {
  return state.matches.currentStep;
}
