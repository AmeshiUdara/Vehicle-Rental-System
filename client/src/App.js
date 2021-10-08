import React, { Fragment } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import ReduxToastr from 'react-redux-toastr';

import history from './history';
import Home from './components/Home';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import CarList from './components/CarList';
import About from './components/About';
import AdminDashboard from './components/admin/AdminDashboard';
import EquipmentList from './components/EquipmentList';
import { Login } from './components/views/Login';
import setJWTToken from './security/setJWT';
import { HeaderLayout } from './components/HeaderLayout';
import { SecureRoute } from './security/SecureRoute';
import VehicleManagement from './components/admin/tables/VehicleManagement';
import UserManagement from './components/admin/tables/UserManagement';
import PriceManagement from './components/admin/tables/PriceManagement';
import EquipmentManagement from './components/admin/tables/EquipmentManagement';
import BookingManagement from './components/admin/tables/BookingManagement';
const App = () => {
  const token = localStorage.getItem('token');

  if (token) {
    setJWTToken(token);

    const decodedToken = jwt_decode(token);

    const current_time = Date.now() / 1000;

    if (decodedToken.exp < current_time) {
      localStorage.clear();
      setJWTToken(false);
      window.location.href = '/';
    }
  }

  return (
    <Fragment>
      <ReduxToastr />

      <Router history={history}>
        <Switch>
          <HeaderLayout path='/' exact component={Home} />
          <HeaderLayout path='/contact-us' exact component={ContactUs} />
          <HeaderLayout path='/cars' exact component={CarList} />
          <HeaderLayout path='/equipments' exact component={EquipmentList} />
          <HeaderLayout path='/about-us' exact component={About} />
          <HeaderLayout path='/log-in' exact component={Login} />
          <SecureRoute
            path='/admin-dashboard'
            exact
            component={AdminDashboard}
          />
          <SecureRoute
            path='/admin-vehicle'
            exact
            component={VehicleManagement}
          />
          <SecureRoute path='/admin-user' exact component={UserManagement} />
          <SecureRoute path='/admin-price' exact component={PriceManagement} />
          <SecureRoute
            path='/admin-booking'
            exact
            component={BookingManagement}
          />
          <SecureRoute
            path='/admin-equipment'
            exact
            component={EquipmentManagement}
          />
        </Switch>
        <Footer />
      </Router>
    </Fragment>
  );
};
export default App;
