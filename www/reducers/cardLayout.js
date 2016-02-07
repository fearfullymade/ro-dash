import { REFRESH_DATA } from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = [ 
  {
    children: [
      {
        size: 'col-lg-8',
        children: [
          { cardId: 1 },
          { cardId: 2 }
        ]
      },
      {
        size: 'col-lg-4',
        children: [
          { cardId: 3 }
        ]
      }
    ]
  },
  {
    children: [
      {
        size: 'col-lg-8',
        children: [
          { cardId: 4, size: 'col-sm-6' },
          { cardId: 5, size: 'col-sm-6' },
          { cardId: 6 }
        ]
      },
      {
        size: 'col-lg-4',
        children: [
          { cardId: 7 }
        ]
      }
    ]
  },
  {
    children: [
      {
        size: 'col-lg-8',
        children: [
          { cardId: 8 }
        ]
      }
    ]
  }
];

export default function cardLayout(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
