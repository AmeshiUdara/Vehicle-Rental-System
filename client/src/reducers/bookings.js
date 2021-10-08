import { CREATE_BOOKING } from '../actions/types';

const initialState = {
  bookings: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BOOKING:
      return {
        ...state,
        bookings: action.payload
      };
    default:
      return state;
  }
};
