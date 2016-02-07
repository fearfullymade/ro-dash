import { REFRESH_DATA, REFRESHING_DATA } from '../constants/ActionTypes';
import objectAssign from 'object-assign';
import DateRange from '../helpers/DateRange';

const initialState = { };

export default function cardData(state = initialState, action) {
  switch (action.type) {
    case REFRESHING_DATA:
      return objectAssign({}, state, { [action.cardId]: null });
    case REFRESH_DATA:
      return objectAssign({}, state, { [action.cardId]: action.data });
    default:
      return state;
  }
}
