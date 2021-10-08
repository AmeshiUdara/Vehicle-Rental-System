import React, { Component } from 'react';
import { BackTop, Modal } from 'antd';
import { connect } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import Pagination from 'react-js-pagination';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
  fetchEquipments,
  deleteAdminEquipments,
  updateAdminEquipment
} from '../../../actions/equipments';
import SideNavigation from '../SideNavigation';
import AdminHeader from '../AdminHeader';
import '../../../assets/css/sb-admin-2.css';
import '../../../assets/css/sb-admin-2.min.css';
import 'antd/dist/antd.css';
import EquipmentCreateForm from '../../forms/EquipmentCreateForm';
import EquipmentUpdateForm from '../../forms/EquipmentUpdateForm';

const THINGS_PER_PAGE = 7;

export class EquipmentManagement extends Component {
  state = {
    visible: false,
    visibleUpdate: false,
    id: null,
    activePage: 1
  };

  componentDidMount() {
    this.props.fetchEquipments();
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  showUpdateModal = (vehicle_id) => {
    this.setState({
      visibleUpdate: true,
      id: vehicle_id
    });
  };
  handleUpdateCancel = (e) => {
    this.setState({
      visibleUpdate: false,
      id: null
    });
  };

  onUpdate = (formValues) => {
    this.props.updateAdminEquipment(this.state.id, formValues);
  };

  onDeleteClick = (id) => {
    const { confirm } = Modal;
    confirm({
      title: 'Are you sure delete this equipment?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      centered: true,
      cancelText: 'No',
      onOk: () => {
        this.props.deleteAdminEquipments(id, 0); //status 0 means delete
      },
      onCancel: () => {}
    });
  };

  renderRow = () => {
    const { equipments } = this.props;
    const indexOfLastThing = this.state.activePage * THINGS_PER_PAGE;
    const indexOfFirstThing = indexOfLastThing - THINGS_PER_PAGE;
    const thingsShown = equipments.slice(indexOfFirstThing, indexOfLastThing);
    let status;
    return (
      thingsShown &&
      thingsShown.map((equipment, index) => {
        if (equipment.status === 1) {
          status = {
            status: 'Available',
            cn: 'badge badge-info'
          };
        }
        if (equipment.status === 2) {
          status = {
            status: 'Booked',
            cn: 'badge badge-warning'
          };
        }
        if (equipment.status === 3) {
          status = {
            status: 'On Repair',
            cn: 'badge badge-danger'
          };
        }
        return (
          <tr key={index}>
            <td>{equipment.name}</td>
            <td>{equipment.qty}</td>
            <td>
              <CurrencyFormat
                value={equipment.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'LKR '}
                suffix={'.00'}
              />
            </td>

            <td>
              <span className={status.cn}>{status.status}</span>
            </td>
            <td style={{ textAlign: 'center' }}>
              <button
                type='button'
                class='btn btn-success btn-sm'
                onClick={() => {
                  this.showUpdateModal(equipment.id);
                }}
              >
                <i class='fa fa-pencil' aria-hidden='true'></i>
              </button>
              <button
                type='button'
                class='btn btn-danger btn-sm'
                style={{ marginLeft: 5 }}
                onClick={() => {
                  this.onDeleteClick(equipment.id);
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
        <span class='text-muted'>Create an Equipment</span>
      </h4>
    );

    const modalUpdateTitle = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>Update an Equipment</span>
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
              <EquipmentCreateForm onclose={this.handleCancel}/>
            </Modal>
            <div className='container-fluid'>
              <div className='d-sm-flex align-items-center justify-content-between mb-4'>
                <h1 className='h3 mb-0 text-gray-800'>Equipment Management</h1>
                <button
                  className='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'
                  onClick={this.showModal}
                >
                  <i className='fa fa-download' aria-hidden='true'></i> Create
                  an equipment
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
                <EquipmentUpdateForm onSubmit={this.onUpdate} onclose={this.handleUpdateCancel}/>
              </Modal>
              <div className='row'>
                <div className='col-xl-12  mb-4 '>
                  <div className='card  shadow h-100 py-2'>
                    <div className='card-body'>
                      <table class='table table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th scope='col'>Equipment name</th>
                            <th scope='col'>Quantity</th>
                            <th scope='col'>Price</th>
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
                          totalItemsCount={this.props.equipments.length}
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
    equipments: Object.values(state.equipments)
  };
};
export default connect(mapStateToProps, {
  fetchEquipments,
  deleteAdminEquipments,
  updateAdminEquipment
})(EquipmentManagement);
