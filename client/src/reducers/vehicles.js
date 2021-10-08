import _ from 'lodash';

import { FETCH_VEHICLES } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_VEHICLES:
      return { ...state, ..._.mapKeys(action.payload, 'id') };

    default:
      return state;
  }
};
