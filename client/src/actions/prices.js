import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import history from '../history';
import {
  FETCH_PRICES,
  DELETE_PRICES,
  CREATE_PRICES,
  FETCH_ONLINE_PRICES
} from './types';

export const createAdminPrice = (amount) => async (dispatch) => {
  try {
    const response = await axios.post(`api/prices`, amount);
    toastr.success('Success', 'Price package created');
    history.push('/admin-price');
    dispatch({ type: CREATE_PRICES, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Server error');
  }
};

export const fetchAdminPrices = () => async (dispatch) => {
  try {
    const response = await axios.get(`api/prices`);
    dispatch({ type: FETCH_PRICES, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Server error');
  }
};

export const deleteAdminPrices = (id, status) => async (dispatch) => {
  try {
    const response = await axios.put(`api/prices/${id}`, { status });
    if (!response.data.id) {
      console.log('user not found');
    }
    dispatch({ type: DELETE_PRICES, payload: id });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Can not delete the price package');
  }
};

export const fetchOnlinePrices = () => async (dispatch) => {
  try {
    const response = await axios.get(`api/prices/web/online`); //calling intergration-server to get scraped data
    dispatch({ type: FETCH_ONLINE_PRICES, payload: response.data });
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Server error');
  }
};
