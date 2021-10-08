import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import history from '../history';
import {
  FETCH_EQUIPMENTS,
  DELETE_ADMIN_EQUIPMENTS,
  CREATE_ADMIN_EQUIPMENTS
} from './types';

export const createAdminEquipment = equipment => async dispatch => {
  try {
    const response = await axios.post(`api/equipments`, equipment, {
      headers: {
        accept: 'application/json',
        'Acept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'multipart/form-data'
      }
    });

    toastr.success('Success', 'Equipment created successfully');
    dispatch({ type: CREATE_ADMIN_EQUIPMENTS, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Server error');
  }
};

export const fetchEquipments = () => async dispatch => {
  try {
    const response = await axios.get(`api/equipments`);
    dispatch({ type: FETCH_EQUIPMENTS, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Server error');
  }
};

export const deleteAdminEquipments = (id, status) => async dispatch => {
  try {
    const response = await axios.put(`api/equipments/${id}`, { status });
    if (!response.data.id) {
      console.log('id not found');
    }
    dispatch({ type: DELETE_ADMIN_EQUIPMENTS, payload: id });
  } catch (err) {
    console.log(err.message);
  }
};

export const updateAdminEquipment = (id, updatingData) => async dispatch => {
  try {
    const response = await axios.patch(`api/equipments/${id}`, updatingData);
    if (!response.data.id) {
      console.log('equipment not found');
    }
    toastr.success('Success', 'Equipments updated successfully');
    window.location.href = '/admin-equipment';
  } catch (err) {
    console.log(err.message);
  }
};
