import React, { Component } from 'react';
import { BackTop, Modal } from 'antd';
import { connect } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import Pagination from 'react-js-pagination';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
  fetchAdminVehicles,
  deleteAdminVehicles,
  updateAdminVehicles
} from '../../../actions/vehicles';
import SideNavigation from '../SideNavigation';
import AdminHeader from '../AdminHeader';
import '../../../assets/css/sb-admin-2.css';
import '../../../assets/css/sb-admin-2.min.css';
import 'antd/dist/antd.css';
import VehicleCreateForm from '../../forms/VehicleCreateForm';
import VehicleUpdateForm from '../../forms/VehicleUpdateForm';
import moment from 'moment';

const THINGS_PER_PAGE = 7;

export class VehicleManagement extends Component {
  state = {
    visible: false,
    visibleUpdate: false,
    id: null,
    activePage: 1
  };

  componentDidMount() {
    this.props.fetchAdminVehicles();
  }

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  showUpdateModal = vehicle_id => {
    this.setState({
      visibleUpdate: true,
      id: vehicle_id
    });
  };
  handleUpdateCancel = e => {
    this.setState({
      visibleUpdate: false,
      id: null
    });
  };

  onUpdate = formValues => {
    this.props.updateAdminVehicles(this.state.id, formValues);
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
        this.props.deleteAdminVehicles(id, 0); //status 0 means delete
      },
      onCancel: () => {}
    });
  };

  renderRow = () => {
    const { vehicles } = this.props;
    const indexOfLastThing = this.state.activePage * THINGS_PER_PAGE;
    const indexOfFirstThing = indexOfLastThing - THINGS_PER_PAGE;
    const thingsShown = vehicles.slice(indexOfFirstThing, indexOfLastThing);
    let status;
    return (
      thingsShown &&
      thingsShown.map((vehicle, index) => {
        if (vehicle.status === 1) {
          status = {
            status: 'Available',
            cn: 'badge badge-info'
          };
        }
        if (vehicle.status === 2) {
          status = {
            status: 'Booked',
            cn: 'badge badge-warning'
          };
        }
        if (vehicle.status === 3) {
          status = {
            status: 'On Repair',
            cn: 'badge badge-danger'
          };
        }
        return (
          <tr key={index}>
            <td>{vehicle.name}</td>
            <td>
              <CurrencyFormat
                value={vehicle.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'LKR '}
                suffix={'.00'}
              />
            </td>
            <td>{vehicle.number_plate}</td>
            <td>{vehicle.minimum_age}</td>
            <td>{vehicle.transmission}</td>
            <td>{vehicle.type}</td>
            <td>{moment(vehicle.date_acquired).format('YYYY-MM-DD ')}</td>
            <td>
              <span className={status.cn}>{status.status}</span>
            </td>
            <td style={{ textAlign: 'center' }}>
              <button
                type='button'
                class='btn btn-success btn-sm'
                onClick={() => {
                  this.showUpdateModal(vehicle.id);
                }}
              >
                <i class='fa fa-pencil' aria-hidden='true'></i>
              </button>
              <button
                type='button'
                class='btn btn-danger btn-sm'
                style={{ marginLeft: 5 }}
                onClick={() => {
                  this.onDeleteClick(vehicle.id);
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
    const modalTitle = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>Create a Vehicle</span>
      </h4>
    );
    const modalUpdateTitle = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>Update a Vehicle</span>
      </h4>
    );
    return (
      <div id='wrapper'>
        <BackTop />
        <SideNavigation />

        <div id='content-wrapper' className='d-flex flex-column'>
          <div id='content'>
            <AdminHeader />
            <Modal
              title={modalTitle}
              visible={this.state.visible}
              onOk={this.handleCancel}
              onCancel={this.handleCancel}
              okText='Ok'
              footer={false}
            >
              <VehicleCreateForm onclose={this.handleCancel}/>
            </Modal>
            <div className='container-fluid'>
              <div className='d-sm-flex align-items-center justify-content-between mb-4'>
                <h1 className='h3 mb-0 text-gray-800'>Vehicle Management</h1>
                <button
                  className='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'
                  onClick={this.showModal}
                >
                  <i className='fa fa-download' aria-hidden='true'></i> Create a
                  vehicle
                </button>
              </div>
              <Modal
                title={modalUpdateTitle}
                visible={this.state.visibleUpdate}
                onOk={this.handleUpdateCancel}
                onCancel={this.handleUpdateCancel}
                okText='Ok'
                footer={false}
              >
                <VehicleUpdateForm onSubmit={this.onUpdate} onclose={this.handleUpdateCancel} />
              </Modal>
              <div className='row'>
                <div className='col-xl-12  mb-4 '>
                  <div className='card  shadow h-100 py-2'>
                    <div className='card-body'>
                      <table class='table table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th scope='col'>Vehicle name</th>
                            <th scope='col'>Price</th>
                            <th scope='col'>Number plate</th>
                            <th scope='col'>Minimum Age</th>
                            <th scope='col'>Transmission</th>
                            <th scope='col'>Type</th>
                            <th scope='col'>Date of acquired</th>
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
                          totalItemsCount={this.props.vehicles.length}
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
    vehicles: Object.values(state.vehicleControl)
  };
};
export default connect(mapStateToProps, {
  fetchAdminVehicles,
  deleteAdminVehicles,
  updateAdminVehicles
})(VehicleManagement);
