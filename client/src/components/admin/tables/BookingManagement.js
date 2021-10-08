import React, { Component, Fragment } from 'react';
import { BackTop, Input, Modal } from 'antd';
import SideNavigation from '../SideNavigation';
import AdminHeader from '../AdminHeader';
import { connect } from 'react-redux';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import _ from 'lodash';
import Pagination from 'react-js-pagination';
import { toastr } from 'react-redux-toastr';

import {
  fecthAdminBookings,
  statusChangeAdminBooking
} from '../../../actions/bookings';
import { fetchBlockedUsers } from '../../../actions/users';
import '../../../assets/css/sb-admin-2.css';
import '../../../assets/css/sb-admin-2.min.css';
const { Search } = Input;
const THINGS_PER_PAGE = 7;

export class BookingManagement extends Component {
  state = {
    activePage: 1,
    visible: false,
    user: {}
  };
  componentDidMount() {
    this.props.fecthAdminBookings();
    this.props.fetchBlockedUsers();
  }
  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  };

  showModal = (checkedUser) => {
    this.setState({
      user: checkedUser
    });
    if (this.state.user !== null) {
      this.setState({
        visible: true
      });
    }
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  onChangeStatus = (status, id) => {
    this.props.statusChangeAdminBooking(id, status);
  };

  onUserSearch = (username) => {
    if (username == '') {
      toastr.warning('Warning', 'You must enter a customer name');
    } else {
      const { blockedUsers } = this.props;
      let checkedUser = _.filter(blockedUsers, { fullname: username });
      if (checkedUser.length !== 0) {
        this.showModal(checkedUser[0]);
      } else {
        toastr.info('Info', `${username} is validated`);
      }
    }
  };

  renderStatusList = (status, id) => {
    let allStatus = [
      'Not collected',
      'Returned',
      'Late Returned',
      'Not Returned'
    ];
    return (
      <select
        className='form-control form-control-sm'
        defaultValue={status}
        onChange={(e) => {
          this.onChangeStatus(e.target.value, id);
        }}
      >
        {allStatus.map((sts, index) => {
          return (
            <option id={id} key={index} value={index + 1}>
              {sts}
            </option>
          );
        })}
      </select>
    );
  };
  renderRow = () => {
    const { bookings } = this.props;
    const indexOfLastThing = this.state.activePage * THINGS_PER_PAGE;
    const indexOfFirstThing = indexOfLastThing - THINGS_PER_PAGE;
    const thingsShown = bookings.slice(indexOfFirstThing, indexOfLastThing);
    let status;
    let isAvailable = false;
    return (
      thingsShown &&
      thingsShown.map((booking, index) => {
        if (booking.status === 1) {
          status = {
            className: 'badge badge-warning',
            status: 'Not collected',
            mainClz: false
          };
        }
        if (booking.status === 2) {
          status = {
            className: 'badge badge-success',
            status: 'Returned',
            mainClz: true
          };
        }
        if (booking.status === 3) {
          status = {
            className: 'badge badge-danger',
            status: 'Late Returned',
            mainClz: true
          };
        }
        if (booking.status === 4) {
          status = {
            className: 'badge badge-dark',
            status: 'not Returned',
            mainClz: false
          };
        }

        if (booking.equipments.length !== 0) {
          isAvailable = true;
        }
        if (booking.equipments.length === 0) {
          isAvailable = false;
        }
        return (
          <tr key={index}>
            <td>{booking.user}</td>
            <td>{moment(booking.created_date).format('YYYY-MM-DD')}</td>

            <td>{moment(booking.booking_date).format('YYYY-MM-DD HH:mm')}</td>
            <td>{moment(booking.return_date).format('YYYY-MM-DD  HH:mm')}</td>
            <td style={{ textAlign: 'center' }}>
              {booking.vehicles &&
                booking.vehicles.map((vehicle, index) => {
                  return (
                    <li key={index} style={{ listStyleType: 'none' }}>
                      {vehicle.name}
                    </li>
                  );
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
              <CurrencyFormat
                value={booking.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'LKR '}
                suffix={'.00'}
              />
            </td>
            <td style={{ textAlign: 'center' }}>
              <span className={`${status.className}`}>
                {this.renderStatusList(booking.status, booking.id)}
              </span>
            </td>
          </tr>
        );
      })
    );
  };

  render() {
    return (
      <div id='wrapper'>
        <BackTop />
        <SideNavigation />

        <div id='content-wrapper' className='d-flex flex-column'>
          <div id='content'>
            <AdminHeader />

            <div className='container-fluid'>
              <div className='d-sm-flex align-items-center justify-content-between mb-4'>
                <div className='col-6' style={{ paddingLeft: 0 }}>
                  <h1 className='h3 mb-0 text-gray-800'>Booking Management</h1>
                </div>
                <div className='col-6' style={{ paddingRight: 0 }}>
                  <Search
                    placeholder='Enter Customer Name'
                    onSearch={(value) => this.onUserSearch(value)}
                    enterButton
                    size='large'
                  />
                </div>
              </div>
              <Modal
                title={'Profile Matched'}
                visible={this.state.visible}
                onOk={this.handleCancel}
                onCancel={this.handleCancel}
                okText='Ok'
                footer={false}
              >
                <div className='card' style={{ padding: 20, paddingTop: 30 }}>
                  <p>Full Name: {this.state.user.fullname}</p>
                  <p>License Number: {this.state.user.licensenumber}</p>
                  <p>NIC Number: {this.state.user.nic}</p>
                </div>
              </Modal>
              <div className='row'>
                <div className='col-xl-12  mb-4 '>
                  <div className='card  shadow h-100 py-2'>
                    <div className='card-body'>
                      <table
                        class='table table-striped table-bordered'
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <thead>
                          <tr>
                            {/* <th scope='col'>ID</th> */}
                            <th scope='col'>User</th>
                            <th scope='col'>Created date</th>
                            <th scope='col'>Booked date</th>
                            <th scope='col'>Return date</th>
                            <th scope='col'>Vehicles</th>
                            <th scope='col'>Equipments</th>
                            <th scope='col'>Price</th>
                            <th scope='col'>Status</th>
                          </tr>
                        </thead>
                        <tbody>{this.renderRow()}</tbody>
                      </table>
                      <div>
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={5}
                          totalItemsCount={this.props.bookings.length}
                          onChange={this.handlePageChange}
                          itemClass='page-item'
                          linkClass='page-link'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bookings: Object.values(state.adminBookings),
    blockedUsers: Object.values(state.blockedUsers)
  };
};
export default connect(mapStateToProps, {
  fecthAdminBookings,
  statusChangeAdminBooking,
  fetchBlockedUsers
})(BookingManagement);
