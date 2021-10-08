import axios from 'axios';
import { toastr } from 'react-redux-toastr';

import {
  FETCH_USERS,
  DELETE_USERS,
  STATUS_CHANGE_USERS,
  FETCH_BLOCKED_USERS
} from './types';

export const updateUserDetails = (user_id, userData) => async (dispatch) => {
  try {
    const response = await axios.patch(`api/users/${user_id}`, userData);
    toastr.success('Success', 'Profile updated successfully');
    window.location.href = '/';
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Profile updated failed');
  }
};

export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await axios.get(`api/users`);
    dispatch({ type: FETCH_USERS, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};

export const deleteAdminUsers = (id, status) => async (dispatch) => {
  try {
    const response = await axios.put(`api/users/${id}`, { status });
    if (!response.data.id) {
      console.log('user not found');
    }
    dispatch({ type: DELETE_USERS, payload: id });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Can not delete the profile');
  }
};

export const statusChangeAdminUsers = (id, status) => async (dispatch) => {
  try {
    const response = await axios.put(`api/users/${id}`, { status });
    if (!response.data.id) {
      console.log('user not found');
    }
    dispatch({ type: STATUS_CHANGE_USERS, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Status can not be changed');
  }
};

export const fetchBlockedUsers = () => async (dispatch) => {
  try {
    const response = await axios.get(`api/users/web/blocked`); // get blocked users from insurance database
    dispatch({ type: FETCH_BLOCKED_USERS, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Status can not be changed');
  }
};
