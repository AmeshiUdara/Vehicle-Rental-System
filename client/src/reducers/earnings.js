import { FETCH_WEEKLY_EARNINGS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_WEEKLY_EARNINGS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
