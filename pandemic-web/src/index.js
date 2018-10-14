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
    MuiMenuItem: {
      root: {
        fontSize: '14px',
        paddingBottom: '4px',
        paddingTop: '4px',
      },
    },
    MuiTableRow: {
      root: {
        height: 40,
      },
      head: {
        backgroundColor: '#F7F7F7',
        height: 32,
      },
    },
    MuiTableCell: {
      head: {
        borderTop: '2px solid #e0e0e0',
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
