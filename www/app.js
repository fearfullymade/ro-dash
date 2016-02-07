import React from 'react';
import {render} from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root';
import { Provider } from 'react-redux';
import DashApp from './containers/DashApp';
import * as actions from './actions/dashActions';
import DateRange from './helpers/DateRange';

let store = createStore(rootReducer, applyMiddleware(thunk));

//initial data load
store.dispatch(actions.changeDateRange(new DateRange('-30d')));

render(
  <Provider store={store}>
    <DashApp />
  </Provider>, document.getElementById('dash-app')
);
