import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import jwt_decode from 'jwt-decode';

import moment from 'moment';
import { Tooltip } from 'antd';
import { Switch } from 'antd';
import _ from 'lodash';
import history from '../../history';
import {
  getCriticalBooking,
  returnCriticalBooking
} from '../../actions/bookings';
import { toastr } from 'react-redux-toastr';

export class LateReturnList extends Component {
  state = {
    isNewCustomer: true
  };

  componentDidMount() {
    this.props.getCriticalBooking(localStorage.getItem('id'));
    this.checkNewUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.criticalReturn !== prevProps.criticalReturn) {
      toastr.success('Success', 'Vehicle returned successfully');
      window.location.href = '/';
    }
  }

  checkNewUser = () => {
    const decodedToken = jwt_decode(localStorage.getItem('token'));
    let isNew = decodedToken.user.isnew;
    if (isNew === 0) {
      this.setState({
        isNewCustomer: false
      });
    }
    if (isNew === 1) {
      this.setState({
        isNewCustomer: true
      });
    }
  };

  onChange = checked => {
    const { lateReturns } = this.props;
    if (checked) {
      this.props.returnCriticalBooking(lateReturns.id);
    }
  };
  render() {
    const { lateReturns } = this.props;
    if (_.isEmpty(lateReturns)) {
      return (
        <table class='table'>
          <thead>
            <tr>
              <th scope='col'>Booked date</th>
              <th scope='col'>Returning date</th>
              <th scope='col' style={{ textAlign: 'center' }}>
                Vehicles
              </th>
              <th scope='col'>Equipments</th>
              <th scope='col'>Status</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No data
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      let isAvailable = false;
      if (lateReturns.equipments.length !== 0) {
        isAvailable = true;
      }
      if (lateReturns.equipments.length === 0) {
        isAvailable = false;
      }
      return (
        <table class='table'>
          <thead>
            <tr>
              <th scope='col'>Booked date</th>
              <th scope='col'>Returning date</th>
              <th scope='col' style={{ textAlign: 'center' }}>
                Vehicles
              </th>
              <th scope='col'>Equipments</th>
              <th scope='col'>Status</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {moment(lateReturns.booking_date).format('YYYY-MM-DD HH:mm')}
              </td>
              <td>
                {moment(lateReturns.return_date).format('YYYY-MM-DD HH:mm')}
              </td>
              <td style={{ textAlign: 'center' }}>
                {lateReturns.vehicles &&
                  lateReturns.vehicles.map((vehicle, index) => {
                    return <li key={index}>{vehicle.name}</li>;
                  })}
              </td>
              <td>
                {isAvailable ? (
                  lateReturns.equipments.map((equipment, index) => {
                    return (
                      <li key={index} style={{ listStyleType: 'none' }}>
                        {equipment.name}
                      </li>
                    );
                  })
                ) : (
                  <li style={{ listStyleType: 'none', textAlign: 'center' }}>
                    -
                  </li>
                )}
              </td>
              <td>
                <span className='badge badge-danger'>critical</span>
              </td>

              <td>
                {this.state.isNewCustomer ? (
                  <Tooltip title='returned ?'>
                    <Switch
                      defaultChecked={false}
                      disabled
                      onChange={this.onChange}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title='returned ?'>
                    <Switch defaultChecked={false} onChange={this.onChange} />
                  </Tooltip>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    lateReturns: state.lateReturns,
    criticalReturn: state.criticalReturn
  };
};

export default connect(mapStateToProps, {
  getCriticalBooking,
  returnCriticalBooking
})(LateReturnList);
