import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import pandemicReducer, { serverEpic } from './pandemic/redux';

const rootReducer = combineReducers({
  pandemic: pandemicReducer,
});
const epicMiddleware = createEpicMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(epicMiddleware),
);

epicMiddleware.run(combineEpics(
  serverEpic,
));

export default store;
