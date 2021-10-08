import _ from 'lodash';

import { FETCH_BLOCKED_USERS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_BLOCKED_USERS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };

    default:
      return state;
  }
};
