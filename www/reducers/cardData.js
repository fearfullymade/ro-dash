import { REFRESH_DATA, REFRESHING_DATA } from '../constants/ActionTypes';
import DateRange from '../helpers/DateRange';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function cardData(state = initialState, action) {
  switch (action.type) {
    case REFRESHING_DATA:
      return state.delete(action.cardId);
    case REFRESH_DATA:
      return state.set(action.cardId, action.data);
    default:
      return state;
  }
}
