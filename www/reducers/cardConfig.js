import { UPDATE_CARD_CONFIG } from '../constants/ActionTypes';
import Immutable from 'immutable';
import * as cardTypes from '../constants/CardTypes';

const CardConfig = Immutable.Record({
  id: 0,
  type: null,
  title: null,
  src: null,
  mapX: null,
  colors: Immutable.Map()
});

function processData(data) {
  return Immutable.Map(Immutable.Seq(data).map(x => {
    let colors = Immutable.Map(x.colors);

    return [x.id, new CardConfig(x).set('colors', colors)]
  }));
}

const initialState = processData([ 
  {
    id: 1,
    type: cardTypes.TIME_GRAPH,
    title: 'Total Activity',
    src: '/api/metric/date/total?split=isTrial'
  },
  {
    id: 2,
    type: cardTypes.TIME_GRAPH,
    title: 'Active Users',
    src: '/api/metric/date/count?group=userId&split=isTrial&userId!=null'
  },
  {
    id: 3,
    type: cardTypes.LIST,
    title: 'Top Users',
    src: '/api/metric/userId/total?userId!=null&sort=-total&limit=10',
    mapX: 'users'
  },
  {
    id: 4,
    type: cardTypes.PIE,
    title: 'Response Code',
    src: '/api/metric/responseCode/total',
    colors: {200:3, 304:1, 401:0, 404:4, 500:2}
  },
  {
    id: 5,
    type: cardTypes.PIE,
    title: 'Method',
    src: '/api/metric/method/total',
    colors: {'DELETE':2, 'GET':3, 'POST':0, 'PUT':1}
  },
  {
    id: 6,
    type: cardTypes.TIME_GRAPH,
    title: 'Client Error Reports',
    src: '/api/metric/date/total?path=rest/reportError',
    colors: {0:2}
  },
  {
    id: 7,
    type: cardTypes.LIST,
    title: 'Top Paths',
    src: '/api/metric/path/total?sort=-total&limit=10'
  }
]);

export default function cardData(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CARD_CONFIG:
      let newConfig = Immutable.Seq(action.changes).reduce((config, newValue, key) => config.set(key, newValue), state.get(action.id));
      return state.set(action.id, newConfig);
    default:
      return state;
  }
}

