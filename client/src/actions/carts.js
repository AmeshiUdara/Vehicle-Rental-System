import axios from 'axios';
import { FETCH_CART_EQUIPMENTS, FETCH_CART_VEHICLES } from './types';

export const fetchCartEquipments = equipment_ids => async dispatch => {
  try {
    const data = {
      equipment_ids
    };

    const response = await axios.post(`api/carts/equipments`, data);
    dispatch({ type: FETCH_CART_EQUIPMENTS, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};
export const fetchCartVehicles = vehicles_ids => async dispatch => {
  try {
    const data = {
      vehicles_ids
    };
    const response = await axios.post(`api/carts/vehicles`, data);
    dispatch({ type: FETCH_CART_VEHICLES, payload: response.data });
  } catch (err) {
    console.log(err.message);
  }
};
