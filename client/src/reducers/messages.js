import { CREATE_MESSAGE } from '../actions/types';
const initialState = {
  message: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MESSAGE:
      return {
        ...state,
        message: action.payload
      };
    default:
      return state;
  }
};
