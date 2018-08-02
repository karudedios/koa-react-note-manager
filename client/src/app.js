import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';

import theme from './theme';
import { store, history } from './store';
import Layout from './components/Layout';
import NoteList from './containers/NoteList';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <Layout>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <NoteList />
              )}
            />

            <Route
              render={() => (
                <NoteList />
              )}
            />
          </Switch>
        </Layout>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('application'),
);
