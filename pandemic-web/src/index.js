/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './configureStore';
import NeuralNetworkPage from './neuralNetwork/NeuralNetworkPage';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <NeuralNetworkPage />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
