import _ from 'lodash';
import { FETCH_MESSAGES } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_MESSAGES:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    default:
      return state;
  }
};
