import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastr } from 'react-redux-toastr';

import security from './security';
import messages from './messages';
import vehicles from './vehicles';
import equipments from './equipments';
import bookings from './bookings';
import errmsgs from './errors';
import userBookings from './userBookings';
import cartEquipments from './cartEquipments';
import cartVehicles from './cartVehicles';
import critical from './critical';
import lateReturns from './lateReturns';
import criticalReturn from './criticalReturn';
import extendBooking from './extendBooking';
import bookingControl from './bookingControl';
import vehicleControl from './vehicleControl';
import earnings from './earnings';
import prices from './prices';
import users from './users';
import adminBookings from './adminBookings';
import onlinePrices from './onlinePrices';
import blockedUsers from './blockedUsers';
import notifications from './notifications';
export default combineReducers({
  security,
  toastr,
  messages,
  vehicles,
  equipments,
  bookings,
  errmsgs,
  userBookings,
  cartEquipments,
  cartVehicles,
  critical,
  lateReturns,
  criticalReturn,
  bookingControl,
  vehicleControl,
  users,
  earnings,
  prices,
  adminBookings,
  notifications,
  onlinePrices,
  blockedUsers,
  extendBooking,
  form: formReducer
});
