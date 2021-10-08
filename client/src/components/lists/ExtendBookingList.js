import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Spin } from 'antd';
import _ from 'lodash';
import { toastr } from 'react-redux-toastr';

import { Tooltip } from 'antd';

import 'antd/dist/antd.css';
import { fetchUserBookings, extendReturnTime } from '../../actions/bookings';
import { TimePicker } from 'antd';

export class ExtendBookingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      _extendtime: null,
      visbile: true,
      booking_id: null
    };
  }

  componentDidMount() {
    this.props.fetchUserBookings(localStorage.getItem('id'));
  }

  onChange = (time, booking_id) => {
    let extend_time = moment(time).format('HH:mm');

    //Error handling should be done

    let max = moment('16:00', 'HH:mm').format('HH:mm');

    let min = moment('8:00', 'HH:mm').format('HH:mm');

    if (extend_time < min || extend_time > max) {
      toastr.error('Error', 'Invalid return time selected');
    } else {
      this.setState({
        value: time,
        _extendtime: extend_time,
        visbile: false,
        booking_id: booking_id
      });
    }
  };

  onSubmit = () => {
    this.props.extendReturnTime(this.state.booking_id, this.state._extendtime);
  };

  renderTableRow = () => {
    const { userBookings } = this.props;
    let bookings = _.filter(userBookings, { status: 4 });
    let isAvailable = false;

    if (userBookings.length !== 0) {
      return (
        bookings &&
        bookings.map((booking, index) => {
          if (booking.equipments.length !== 0) {
            isAvailable = true;
          }
          if (booking.equipments.length === 0) {
            isAvailable = false;
          }
          return (
            <tr key={index}>
              <td>{moment(booking.booking_date).format('YYYY-MM-DD HH:mm')}</td>
              <td>{moment(booking.return_date).format('YYYY-MM-DD HH:mm')}</td>
              <td style={{ textAlign: 'center' }}>
                {booking.vehicles &&
                  booking.vehicles.map((vehicle, index) => {
                    return <li key={index}>{vehicle.name}</li>;
                  })}
              </td>
              <td>
                {isAvailable ? (
                  booking.equipments.map((equipment, index) => {
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
                <span className='badge badge-dark'>Not returned</span>
              </td>

              <td>
                <Tooltip title='extend return date'>
                  <TimePicker
                    value={this.state.value}
                    format='HH:mm'
                    allowClear
                    onChange={e => this.onChange(e, booking.id)}
                  />
                </Tooltip>
              </td>
            </tr>
          );
        })
      );
    } else {
      return (
        <tr>
          <td colSpan='6' style={{ textAlign: 'center' }}>
            <Spin size='large' />
          </td>
        </tr>
      );
    }
  };

  render() {
    return (
      <Fragment>
        <table class='table'>
          <thead>
            <tr>
              <th scope='col'>Booked date</th>
              <th scope='col'>Returned date</th>
              <th scope='col' style={{ textAlign: 'center' }}>
                Vehicles
              </th>
              <th scope='col'>Equipments</th>
              <th scope='col'>Status</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>{this.renderTableRow()}</tbody>
        </table>
        <div class='ant-modal-footer'>
          <div>
            <button
              type='button'
              class='ant-btn ant-btn-primary'
              onClick={this.onSubmit}
              disabled={this.state.visbile}
            >
              <span>Submit</span>
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { userBookings: Object.values(state.userBookings) };
};

export default connect(mapStateToProps, {
  fetchUserBookings,
  extendReturnTime
})(ExtendBookingList);
