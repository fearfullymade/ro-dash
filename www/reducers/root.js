import { combineReducers } from 'redux';
import cardData from './cardData';
import cardConfig from './cardConfig';
import cardLayout from './cardLayout';
import dateRange from './dateRange';

const rootReducer = combineReducers({
  cardData,
  cardConfig,
  cardLayout,
  dateRange
});

export default rootReducer;
