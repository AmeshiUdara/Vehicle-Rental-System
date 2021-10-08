import _ from 'lodash';

import { FETCH_ONLINE_PRICES } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_ONLINE_PRICES:
      return { ...state, ..._.mapKeys(action.payload, 'id') };

    default:
      return state;
  }
};
