import { GET_CRITICAL_BOOKING } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_CRITICAL_BOOKING:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
