/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './configureStore';
import PandemicPage from './pandemic/PandemicPage';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <PandemicPage />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
