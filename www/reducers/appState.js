import { DATE_RANGE_CHANGE, TOGGLE_CONFIG_MODE } from '../constants/ActionTypes';
import DateRange from '../helpers/DateRange';
import Immutable from 'immutable';

const AppState = Immutable.Record({
  dateRange: null,
  configMode: false
});

const initialState = new AppState();

export default function appState(state = initialState, action) {
  switch (action.type) {
    case DATE_RANGE_CHANGE:
      return state.set('dateRange', action.range);
    case TOGGLE_CONFIG_MODE:
      return state.set('configMode', action.value);
    default:
      return state;
  }
}

