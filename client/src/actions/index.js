import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { toastr } from 'react-redux-toastr';

import { SET_CURRENT_USER, SET_ERRORS } from './types';
import setJWTToken from '../security/setJWT';

export const userSignUp = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/users`, formData, {
      headers: {
        accept: 'application/json',
        'Acept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response) {
      toastr.success('Success', 'Account successfully created');
      setInterval(() => {
        window.location.href = '/log-in';
      }, 1000);
    }
  } catch (err) {
    console.log('err=>');
    if (err.response.data.error) {
      toastr.error('Error', err.response.data.error);
    } else {
      toastr.error('Error', 'Server error');
    }
  }
};

export const userSignIn = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`api/auth`, credentials);
    //getting the token
    const { token } = response.data;

    //setting the token to local storage
    localStorage.setItem('token', token);

    //setting the token to headers
    setJWTToken(token);

    //decoding the token
    const decodedToken = jwt_decode(token);
    localStorage.setItem('id', decodedToken.user.id);
    localStorage.setItem('status', decodedToken.user.status);
    localStorage.setItem('role', decodedToken.user.role);
    localStorage.setItem('dob', decodedToken.user.dob);

    if (decodedToken.user.role === 'admin') {
      window.location.href = '/admin-dashboard';
    } else {
      window.location.href = '/';
    }
    dispatch({ type: SET_CURRENT_USER, payload: decodedToken });
  } catch (err) {
    console.log(err.response.data);

    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};
