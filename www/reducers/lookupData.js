import { LOOKUP_DATA_REFRESHED } from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = { };

export default function dateRange(state = initialState, action) {
  switch (action.type) {
    case LOOKUP_DATA_REFRESHED:
      return objectAssign({}, state, { [action.key]: action.data });
    default:
      return state;
  }
}
