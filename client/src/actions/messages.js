import axios from 'axios';
import { toastr } from 'react-redux-toastr';

import history from '../history';
import { CREATE_MESSAGE, FETCH_MESSAGES } from './types';

export const sendMessage = message => async dispatch => {
  try {
    const response = await axios.post(`api/contacts`, message);
    toastr.success('Success', 'Thank you very much for your feedback');
    history.push('contact-us');
    dispatch({ type: CREATE_MESSAGE, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Server error');
  }
};

export const fetchMessages = () => async dispatch => {
  try {
    const response = await axios.get(`api/contacts`);
    dispatch({ type: FETCH_MESSAGES, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Server error');
  }
};

export const deleteMessages = () => async dispatch => {
  try {
    const response = await axios.put(`api/contacts`);
    if (response) {
      window.location.href = '/admin-dashboard';
    }
  } catch (err) {
    console.log(err.message);
  }
};
