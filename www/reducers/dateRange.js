import { DATE_RANGE_CHANGE } from '../constants/ActionTypes';
import objectAssign from 'object-assign';
import DateRange from '../helpers/DateRange';

const initialState = null;

export default function dateRange(state = initialState, action) {
  switch (action.type) {
    case DATE_RANGE_CHANGE:
      return action.range;
    default:
      return state;
  }
}

