import _ from 'lodash';
import {
  FETCH_ADMIN_VEHICLES,
  DELETE_ADMIN_VEHICLES,
  CREATE_ADMIN_VEHICLES
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_ADMIN_VEHICLES:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case DELETE_ADMIN_VEHICLES:
      return _.omit(state, action.payload);
    case CREATE_ADMIN_VEHICLES:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
