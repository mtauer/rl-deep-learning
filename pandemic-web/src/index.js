/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';

import store from './configureStore';
import MatchesPage from './pandemic/matches/MatchesPage';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const theme = createMuiTheme({
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        backgroundColor: '#333333',
      },
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <MatchesPage />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
