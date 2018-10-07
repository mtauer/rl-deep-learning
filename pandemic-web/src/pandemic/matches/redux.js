// Initial State

const initialState = {
  currentStep: 1,
};

// Action Types

const PREFIX = 'matches/';
const PREVIOUS_STEP = `${PREFIX}PREVIOUS_STEP`;
const NEXT_STEP = `${PREFIX}NEXT_STEP`;

// Action Creators

export function previousStepAction() {
  return { type: PREVIOUS_STEP };
}

export function nextStepAction() {
  return { type: NEXT_STEP };
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
    default: return state;
  }
}

// Selectors

export function getCurrentStep(state) {
  return state.matches.currentStep;
}
