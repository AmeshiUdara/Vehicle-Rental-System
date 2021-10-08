import axios from 'axios';
import { toastr } from 'react-redux-toastr';

import history from '../history';

import {
  DETECT_CRITICAL_BOOKING,
  RETURN_CRITICAL_BOOKING,
  FETCH_USER_BOOKINGS,
  GET_CRITICAL_BOOKING,
  CREATE_BOOKING,
  FETCH_BOOKINGS,
  FETCH_WEEKLY_EARNINGS,
  FETCH_ADMIN_BOOKINGS
} from './types';

export const createBooking = (bookingData) => async (dispatch) => {
  try {
    const response = await axios.post(`api/bookings`, bookingData);
    if (response) {
      localStorage.setItem('status', 2);
      dispatch({ type: CREATE_BOOKING, payload: response.data });
    }
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Booking failed, Issue occured with license number');
  }
};

export const fetchUserBookings = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`api/bookings/${id}`);
    dispatch({ type: FETCH_USER_BOOKINGS, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};

export const detectCriticalBooking = (user_id) => async (dispatch) => {
  try {
    const response = await axios.get(`api/bookings/critical/${user_id}`);

    if (!response.data.msg) {
      dispatch({ type: DETECT_CRITICAL_BOOKING, payload: response.data });
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const getCriticalBooking = (user_id) => async (dispatch) => {
  try {
    const response = await axios.get(`api/bookings/critical/${user_id}`);

    if (!response.data.msg) {
      dispatch({ type: GET_CRITICAL_BOOKING, payload: response.data });
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const returnCriticalBooking = (booking_id) => async (dispatch) => {
  try {
    const response = await axios.put(`api/bookings/critical/${booking_id}`);
    if (response) {
      const data = {
        msg: 'Vehicle successfully returned'
      };
      localStorage.setItem('status', 1);
      dispatch({ type: RETURN_CRITICAL_BOOKING, payload: data });
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const updateEquipments = (booking_id, equipments) => async (
  dispatch
) => {
  try {
    const data = {
      equipments
    };

    const response = await axios.put(
      `api/bookings/equipments/${booking_id}`,
      data
    );
    if (response) {
      toastr.success('Success', 'Equipments are updated');
      window.location.href = '/';
    }
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Equipments update failed');
  }
};

export const extendReturnTime = (booking_id, extend_time) => async (
  dispatch
) => {
  try {
    const data = {
      extend_time
    };

    const response = await axios.put(
      `api/bookings/extends/${booking_id}`,
      data
    );
    if (response) {
      toastr.success('Success', 'Return time is extended');
      window.location.href = '/';
    }
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Return time extending failed');
  }
};

export const fecthBookings = () => async (dispatch) => {
  try {
    const response = await axios.get(`api/bookings`);
    dispatch({ type: FETCH_BOOKINGS, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};
export const fetechWeeklyEarnings = () => async (dispatch) => {
  try {
    const response = await axios.get(`api/bookings/all/earnigns`);
    dispatch({ type: FETCH_WEEKLY_EARNINGS, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};

export const fecthAdminBookings = () => async (dispatch) => {
  try {
    const response = await axios.get(`api/bookings/admin/all`);
    dispatch({ type: FETCH_ADMIN_BOOKINGS, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};

export const statusChangeAdminBooking = (id, status) => async (dispatch) => {
  try {
    const response = await axios.put(`api/bookings/admin/${id}`, { status });
    if (!response.data.id) {
      console.log('booking not found');
    }
    toastr.success('Success', 'Status changed successfully');

    window.location.href = '/admin-booking';
  } catch (err) {
    console.log(err.message);
    toastr.error('Error', 'Status can not be changed');
  }
};

export const detectNotCollectedBooking = (user_id) => async (dispatch) => {
  try {
    const response = await axios.get(`api/bookings/check/blacklist/${user_id}`);
    if (!response.data.msg) {
      localStorage.setItem('status', 3);
      toastr.error(
        'Error',
        'You have not collected your booked vehicle, You are black listed'
      );
    }
  } catch (err) {
    console.log(err.message);
  }
};
