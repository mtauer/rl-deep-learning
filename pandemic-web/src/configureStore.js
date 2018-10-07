import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import dataReducer, { fetchMatchDetailsEpic } from './data/redux';
import pandemicReducer from './pandemic/redux';
import matchesReducer from './pandemic/matches/redux';
import ApiClient from './utils/apiClient';

const rootReducer = combineReducers({
  data: dataReducer,
  pandemic: pandemicReducer,
  matches: matchesReducer,
});
const rootEpic = combineEpics(
  fetchMatchDetailsEpic,
);

const apiClient = new ApiClient();
const epicMiddleware = createEpicMiddleware({
  dependencies: {
    apiClient,
  },
});
const middleware = [epicMiddleware];
const enhancers = [];

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-underscore-dangle
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}
const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(
  rootReducer,
  composedEnhancers,
);
epicMiddleware.run(rootEpic);

export default store;
