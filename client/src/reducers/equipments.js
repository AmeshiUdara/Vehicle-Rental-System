import _ from 'lodash';

import {
  FETCH_EQUIPMENTS,
  DELETE_ADMIN_EQUIPMENTS,
  CREATE_ADMIN_EQUIPMENTS
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_EQUIPMENTS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case DELETE_ADMIN_EQUIPMENTS:
      return _.omit(state, action.payload);
    case CREATE_ADMIN_EQUIPMENTS:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
