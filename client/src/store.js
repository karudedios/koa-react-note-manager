import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { compose, createStore, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import saga from './sagas';
import reducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();

export const store = createStore(
  connectRouter(history)(reducer),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
    ),
  ),
);

sagaMiddleware.run(saga);
