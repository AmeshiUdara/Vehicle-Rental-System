import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import history from '../history';
import {
  FETCH_VEHICLES,
  FETCH_ADMIN_VEHICLES,
  DELETE_ADMIN_VEHICLES,
  CREATE_ADMIN_VEHICLES,
  UPDATE_ADMIN_VEHICLES
} from './types';

export const fetchVehicles = () => async dispatch => {
  try {
    const response = await axios.get(`api/vehicles`);
    dispatch({ type: FETCH_VEHICLES, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Server error');
  }
};

export const fetchAdminVehicles = () => async dispatch => {
  try {
    const response = await axios.get(`api/vehicles/all/admin`);
    dispatch({ type: FETCH_ADMIN_VEHICLES, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};

export const deleteAdminVehicles = (id, status) => async dispatch => {
  try {
    const response = await axios.put(`api/vehicles/${id}`, { status });
    if (!response.data.id) {
      console.log('id not found');
    }
    dispatch({ type: DELETE_ADMIN_VEHICLES, payload: id });
  } catch (err) {
    console.log(err.message);
  }
};

export const createAdminVehicle = vehicle => async dispatch => {
  try {
    const response = await axios.post(`api/vehicles`, vehicle, {
      headers: {
        accept: 'application/json',
        'Acept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'multipart/form-data'
      }
    });

    toastr.success('Success', 'Vehicle created successfully');
    dispatch({ type: CREATE_ADMIN_VEHICLES, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};

export const updateAdminVehicles = (id, updatingData) => async dispatch => {
  try {
    const response = await axios.patch(`api/vehicles/${id}`, updatingData);
    if (!response.data.id) {
      console.log('vehicle not found');
    }
    toastr.success('Success', 'Vehicle updated successfully');
    window.location.href = '/admin-vehicle';
  } catch (err) {
    console.log(err.message);
  }
};
