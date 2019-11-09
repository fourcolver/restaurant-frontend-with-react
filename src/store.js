import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastrReducer } from "react-redux-toastr";
// Import reducers
import * as reducers from './services/reducer';


/**
 * Import Saga subscribers
 */

import {
  authSubscriber,
  citySubscriber,
  categorySubscriber,
  restaurantSubscriber,
  menuSubscriber,
  itemSubscriber
} from './services/saga';


export const history = createHistory();

const initialState = {};
const enhancers = [];
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const reducer = combineReducers({
  ...reducers,
  form: formReducer,
  toastr: toastrReducer
});

const store = createStore(reducer, initialState, composedEnhancers);

/**
 *
 * Run saga subscribers
 *
 */
sagaMiddleware.run(authSubscriber);
sagaMiddleware.run(citySubscriber);
sagaMiddleware.run(categorySubscriber);
sagaMiddleware.run(restaurantSubscriber);
sagaMiddleware.run(menuSubscriber);
sagaMiddleware.run(itemSubscriber);
export default store;
