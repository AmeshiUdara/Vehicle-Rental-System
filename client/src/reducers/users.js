import _ from 'lodash';
import {
  FETCH_USERS,
  DELETE_USERS,
  STATUS_CHANGE_USERS
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case DELETE_USERS:
      return _.omit(state, action.payload);
    case STATUS_CHANGE_USERS:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
