import _ from 'lodash';

import { FETCH_NOT_RETURNED_BOOKINGS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_NOT_RETURNED_BOOKINGS:
      return {
        ...state,
        ..._.mapKeys(action.payload, 'id')
      };

    default:
      return state;
  }
};
