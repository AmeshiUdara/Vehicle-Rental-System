import _ from 'lodash';
import { FETCH_BOOKINGS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_BOOKINGS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    default:
      return state;
  }
};
