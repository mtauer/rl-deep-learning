import { createStore, combineReducers } from 'redux';

import pandemicReducer from './pandemic/redux';

const rootReducer = combineReducers({
  pandemic: pandemicReducer,
});

const store = createStore(rootReducer);

export default store;
