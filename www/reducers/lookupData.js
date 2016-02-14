import { LOOKUP_DATA_REFRESHED } from '../constants/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function dateRange(state = initialState, action) {
  switch (action.type) {
    case LOOKUP_DATA_REFRESHED:
      return state.set(action.key, Immutable.Map(action.data));
    default:
      return state;
  }
}
