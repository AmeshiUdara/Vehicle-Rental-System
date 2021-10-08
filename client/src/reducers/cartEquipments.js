import _ from 'lodash';

import { FETCH_CART_EQUIPMENTS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_CART_EQUIPMENTS:
      return {
        ...state,
        ..._.mapKeys(action.payload, 'id')
      };

    default:
      return state;
  }
};
