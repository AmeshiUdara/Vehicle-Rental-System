import React, { Component } from 'react';
import { BackTop, Modal } from 'antd';
import SideNavigation from '../SideNavigation';
import AdminHeader from '../AdminHeader';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import Pagination from 'react-js-pagination';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
  fetchUsers,
  deleteAdminUsers,
  statusChangeAdminUsers
} from '../../../actions/users';

import '../../../assets/css/sb-admin-2.css';
import '../../../assets/css/sb-admin-2.min.css';
const THINGS_PER_PAGE = 7;
export class UserManagement extends Component {
  state = {
    activePage: 1,
    visible: false,
    bill: null
  };

  componentDidMount() {
    this.props.fetchUsers();
  }

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber });
  };

  onDeleteClick = id => {
    const { confirm } = Modal;
    confirm({
      title: 'Are you sure delete this vehicle?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      centered: true,
      cancelText: 'No',
      onOk: () => {
        this.props.deleteAdminUsers(id, 0); //status 0 means delete
      },
      onCancel: () => {}
    });
  };

  onChangeStatus = (status, id) => {
    this.props.statusChangeAdminUsers(id, status);
  };
  renderStatusList = (status, id) => {
    let allStatus = ['Normal', 'White Listed', 'Black Listed'];
    return (
      <select
        className='form-control form-control-sm'
        defaultValue={status}
        onChange={e => {
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

  onBillView = id => {
    if (id) {
      this.setState({
        img: `http://localhost:5000/api/users/user/bill/${id}`,
        visible: true
      });
    }
  };
  onLicenceView = id => {
    if (id) {
      this.setState({
        img: `http://localhost:5000/api/users/user/licence/${id}`,
        visible: true
      });
    }
  };
  hideModal = () => {
    this.setState({
      visible: false
    });
  };
  renderRow = () => {
    const { users } = this.props;
    const indexOfLastThing = this.state.activePage * THINGS_PER_PAGE;
    const indexOfFirstThing = indexOfLastThing - THINGS_PER_PAGE;
    const thingsShown = users.slice(indexOfFirstThing, indexOfLastThing);
    let status;
    return (
      thingsShown &&
      thingsShown.map((user, index) => {
        if (user.status === 1) {
          status = {
            status: 'Normal',
            cn: 'badge badge-info'
          };
        }
        if (user.status === 2) {
          status = {
            status: 'White Listed',
            cn: 'badge badge-warning'
          };
        }
        if (user.status === 3) {
          status = {
            status: 'Black Listed',
            cn: 'badge badge-danger'
          };
        }
        return (
          <tr key={index}>
            <td>{user.fullname}</td>
            <td>{moment(user.dob).format('YYYY-MM-DD ')}</td>
            <td>{user.email}</td>
            <td>{user.contact}</td>
            <td style={{ textAlign: 'center' }}>
              <button
                type='button'
                class='btn btn-primary btn-sm'
                onClick={() => {
                  this.onLicenceView(user.id);
                }}
              >
                <i class='fa fa-download' aria-hidden='true'></i>
              </button>
            </td>
            <td style={{ textAlign: 'center' }}>
              <button
                type='button'
                class='btn btn-primary btn-sm'
                onClick={() => {
                  this.onBillView(user.id);
                }}
              >
                <i class='fa fa-download' aria-hidden='true'></i>
              </button>
            </td>

            <td style={{ textAlign: 'center' }}>
              <span className={`${status.cn}`}>
                {this.renderStatusList(user.status, user.id)}
              </span>
            </td>
            <td style={{ textAlign: 'center' }}>
              <button
                type='button'
                class='btn btn-danger btn-sm'
                style={{ marginLeft: 5 }}
                onClick={() => {
                  this.onDeleteClick(user.id);
                }}
              >
                <i class='fa fa-trash-o' aria-hidden='true'></i>
              </button>
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
                <h1 className='h3 mb-0 text-gray-800'>User Management</h1>
              </div>
              <Modal
                centered
                visible={this.state.visible}
                onCancel={this.hideModal}
                footer={null}
              >
                <div>
                  <img src={this.state.img} style={{ width: '100%' }} />
                </div>
              </Modal>
              <div className='row'>
                <div className='col-xl-12  mb-4 '>
                  <div className='card  shadow h-100 py-2'>
                    <div className='card-body'>
                      <table class='table table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th scope='col'>Full name</th>
                            <th scope='col'>DOB</th>
                            <th scope='col'>Email</th>
                            <th scope='col'>Contact Number</th>
                            <th scope='col'>Licence</th>
                            <th scope='col'>Bill</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Action</th>
                          </tr>
                        </thead>
                        <tbody>{this.renderRow()}</tbody>
                      </table>
                      <div>
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={5}
                          totalItemsCount={this.props.users.length}
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
const mapStateToProps = state => {
  return {
    users: Object.values(state.users)
  };
};

export default connect(mapStateToProps, {
  fetchUsers,
  deleteAdminUsers,
  statusChangeAdminUsers
})(UserManagement);
