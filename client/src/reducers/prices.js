import _ from 'lodash';
import { FETCH_PRICES, DELETE_PRICES, CREATE_PRICES } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_PRICES:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case DELETE_PRICES:
      return _.omit(state, action.payload);
    case CREATE_PRICES:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
