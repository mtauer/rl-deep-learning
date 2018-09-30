import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import pandemicReducer from './pandemic/redux';

const rootReducer = combineReducers({
  pandemic: pandemicReducer,
});
const rootEpic = combineEpics(
);

const epicMiddleware = createEpicMiddleware();
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
