import { REFRESH_DATA } from '../constants/ActionTypes';
import Immutable from 'immutable';

const Card = Immutable.Record({
  cardId: 0,
  width: 'col-lg-12'
});

const Container = Immutable.Record({
  width: 'col-lg-12',
  children: Immutable.List()
});

function processRawData(data) {
    if (data.children) {
      let children = Immutable.Seq(data.children).map(x => processRawData(x)).toList();

      return new Container(data).set('children', children);
    }
    else {
      return new Card(data);
    }

  /*return Immutable.fromJS(data, function(key, value) {
    if (key == 'children')
      return value.toList();

    if (key == '' || /^[0-9]+$/.test(key)) {
        if (value.has('cardId'))
          return new Card(value);
        if (value.has('children'))
          return new Container(value);
    }
  });*/
}

const initialState = processRawData({ 
  children: [
    {
      children: [
        {
          width: 'col-lg-8',
          children: [
            { cardId: 1 },
            { cardId: 2 }
          ]
        },
        {
          width: 'col-lg-4',
          children: [
            { cardId: 3 }
          ]
        }
      ]
    },
    {
      children: [
        {
          width: 'col-lg-8',
          children: [
            { cardId: 4, width: 'col-sm-6' },
            { cardId: 5, width: 'col-sm-6' },
            { cardId: 6 }
          ]
        },
        {
          width: 'col-lg-4',
          children: [
            { cardId: 7 }
          ]
        }
      ]
    }
  ]
});

export default function cardLayout(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
