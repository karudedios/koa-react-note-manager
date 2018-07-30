import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { compose, createStore, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router';

import saga from './sagas';
import reducer from './reducers';

const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  connectRouter(history)(reducer),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
    ),
  ),
);

sagaMiddleware.run(saga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <Route
            exact
            path="/" render={() => (
              <h1>
                What up
              </h1>
            )}
          />
          
          <Route
            render={() => (
              <h1>
                Default?
              </h1>
            )}
          />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('application'),
);
