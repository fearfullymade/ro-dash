import { REFRESH_DATA, REFRESHING_DATA, UPDATE_CARD_CONFIG } from '../constants/ActionTypes';
import DateRange from '../helpers/DateRange';
import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function cardData(state = initialState, action) {
  switch (action.type) {
    case REFRESHING_DATA:
      return state.delete(action.cardId);
    case REFRESH_DATA:
      return state.set(action.cardId, action.data);
    case UPDATE_CARD_CONFIG:
      if (action.changes.src)
        return state.delete(action.id);
      else
        return state;
    default:
      return state;
  }
}
