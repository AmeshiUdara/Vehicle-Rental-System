import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { Modal } from 'antd';

import { Button, Tooltip } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import { fetchUserBookings } from '../../actions/bookings';
import UpdateEquipment from '../views/UpdateEquipment';
export class BookingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      booking_id: null,
      isBlackListed: false
    };
  }

  componentDidMount() {
    this.props.fetchUserBookings(localStorage.getItem('id'));
    if (localStorage.getItem('status') == 3) {
      this.setState({ isBlackListed: true });
    }
  }

  handleEdit = (booking_id) => {
    this.setState({
      visible: true,
      booking_id: booking_id
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  renderTableRow = () => {
    const { userBookings } = this.props;
    _.remove(userBookings, { status: 0 });
    let status;
    let isAvailable = false;

    if (userBookings.length !== 0) {
      return (
        userBookings &&
        userBookings.map((booking, index) => {
          if (booking.status === 1) {
            status = {
              className: 'badge badge-warning',
              status: 'Not collected',
              mainClz: false,
              clz: ''
            };
          }
          if (booking.status === 2) {
            status = {
              className: 'badge badge-success',
              status: 'Returned',
              mainClz: true,
              clz: 'table-secondary'
            };
          }
          if (booking.status === 3) {
            status = {
              className: 'badge badge-danger',
              status: 'Late Returned',
              mainClz: true,
              clz: 'table-secondary'
            };
          }
          if (booking.status === 4) {
            status = {
              className: 'badge badge-dark',
              status: 'not Returned',
              mainClz: true,
              clz: 'table-secondary'
            };
          }

          if (booking.equipments.length !== 0) {
            isAvailable = true;
          }
          if (booking.equipments.length === 0) {
            isAvailable = false;
          }

          return (
            <tr key={index} className={status.clz}>
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
                <span className={`${status.className}`}>{status.status}</span>
              </td>

              <td>
                {this.state.isBlackListed ? (
                  <Tooltip title='edit'>
                    <Button
                      type='primary'
                      icon={<EditTwoTone twoToneColor='#eb2f96' />}
                      disabled={true}
                      onClick={() =>
                        this.handleEdit(booking.id, booking.equipments)
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title='edit'>
                    <Button
                      type='primary'
                      icon={<EditTwoTone twoToneColor='#eb2f96' />}
                      disabled={status.mainClz}
                      onClick={() =>
                        this.handleEdit(booking.id, booking.equipments)
                      }
                    />
                  </Tooltip>
                )}
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
    const modalTitle = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>Edit equipments</span>
      </h4>
    );

    return (
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
        <tbody>
          {this.renderTableRow()}
          <Modal
            title={modalTitle}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={false}
          >
            <UpdateEquipment booking_id={this.state.booking_id} />
          </Modal>
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return { userBookings: Object.values(state.userBookings) };
};

export default connect(mapStateToProps, { fetchUserBookings })(BookingList);
