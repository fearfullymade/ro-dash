import * as types from '../constants/ActionTypes';
import * as cardTypes from '../constants/CardTypes';
import DateRange from '../helpers/DateRange';
import { collectCardIds } from '../helpers/layout';
import request from 'superagent';

function refreshingData(cardId) {
  return { type: types.REFRESHING_DATA, cardId };
}

function refreshData(cardId, data) {
  return { type: types.REFRESH_DATA, cardId, data };
}

let dataProcessors = {
  [cardTypes.TIME_GRAPH]: (result, config) => {
    var data = []; 

    for (var s in result) {
      var series = {
        label: s,
        data: result[s]
      };

      series.color = config.colors.get(''+series.label);

      data.push(series);
    }

    if (data.length == 1)
      data[0].label = '';

    return data;
  },

  [cardTypes.PIE]: (result, config) => {
    var data = []; 

    if (result.length > 0) {
      result[0].sort(function (a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      for (var i = 0; i < result[0].length; i++) {
        var series = {
          label: result[0][i][0],
          data: result[0][i][1]
        };

        series.color = config.colors.get(''+series.label);
        
        data.push(series);
      }
    }

    return data;
  },

  [cardTypes.LIST]: (result) => {
    return result[0] || [];
  }
};

export function refreshDataAsync(cardId, range) {
  return (dispatch, getState) => {
    const config = getState().cardConfig.get(cardId);
  
    let src = config.src;

    const startDate = range.getStartDate();
    const endDate = range.getEndDate();

    if (startDate)
      src += (src.indexOf('?') >= 0 ? '&' : '?') + 'date>=' + startDate.format("YYYY-MM-DD");
    if (endDate)
      src += (src.indexOf('?') >= 0 ? '&' : '?') + 'date<=' + endDate.format("YYYY-MM-DD");

    dispatch(refreshingData(cardId));

    request
      .get(src)
      .end(function (err, response) {
        let result = response.body;

        let processor = dataProcessors[config.type];

        if (processor)
            result = processor(result, config);
              
        dispatch(refreshData(cardId, result));
      });

  };
}

export function changeDateRange(range) {
  return (dispatch, getState) => {
    const currentRange = getState().appState.dateRange;

    if (!DateRange.areSame(currentRange, range)) {
      dispatch({ type: types.DATE_RANGE_CHANGE, range });

      const layout = getState().cardLayout;

      collectCardIds(layout).map((id) => dispatch(refreshDataAsync(id, range)));
    }
  };
}

export function refreshLookupDataAsync(key) {
  return (dispatch, getState) => {
    request
      .get('/api/' + key)
      .end(function (err, response) {
        let result = response.body;
        var data = { };

        for (var i = 0; i < result.length; i++)
          data[result[i]._id] = result[i].name;

        dispatch({ type: types.LOOKUP_DATA_REFRESHED, key, data });
      });
  };
}

export function toggleConfigMode(value) {
  if (value)
    return { type: types.TOGGLE_CONFIG_MODE, value };

  return (dispatch, getState) => {
    let state = getState();

    //load data for any new or changed cards
    collectCardIds(state.cardLayout)
      .filter(id => !state.cardData.has(id))
      .map(id => dispatch(refreshDataAsync(id, state.appState.dateRange)));

    dispatch({ type: types.TOGGLE_CONFIG_MODE, value });
  }
}

export function updateCardConfig(id, changes) {
  return { type: types.UPDATE_CARD_CONFIG, id, changes };
}
