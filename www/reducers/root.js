import { combineReducers } from 'redux';
import cardData from './cardData';
import cardConfig from './cardConfig';
import cardLayout from './cardLayout';
import appState from './appState';
import lookupData from './lookupData';

const rootReducer = combineReducers({
  cardData,
  cardConfig,
  cardLayout,
  appState,
  lookupData,
});

export default rootReducer;
