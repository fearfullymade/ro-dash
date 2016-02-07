import { combineReducers } from 'redux';
import cardData from './cardData';
import cardConfig from './cardConfig';
import cardLayout from './cardLayout';
import dateRange from './dateRange';
import lookupData from './lookupData';

const rootReducer = combineReducers({
  cardData,
  cardConfig,
  cardLayout,
  dateRange,
  lookupData,
});

export default rootReducer;
