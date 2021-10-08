import React, { Component } from 'react';
import { BackTop, Modal } from 'antd';
import SideNavigation from '../SideNavigation';
import AdminHeader from '../AdminHeader';
import { connect } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import Pagination from 'react-js-pagination';

import { fetchAdminPrices, deleteAdminPrices } from '../../../actions/prices';
import '../../../assets/css/sb-admin-2.css';
import '../../../assets/css/sb-admin-2.min.css';
import PriceCreateForm from '../../forms/PriceCreateForm';
import OnlinePriceList from '../../lists/OnlinePriceList';

const THINGS_PER_PAGE = 7;

export class PriceManagement extends Component {
  state = {
    visible: false,
    visibleWeb: false,
    activePage: 1
  };

  componentDidMount() {
    this.props.fetchAdminPrices();
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
  showWebModal = () => {
    this.setState({
      visibleWeb: true
    });
  };

  handleWebCancel = (e) => {
    this.setState({
      visibleWeb: false
    });
  };
  onDeleteClick = (id) => {
    const { confirm } = Modal;
    confirm({
      title: 'Are you sure delete this package?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      centered: true,
      cancelText: 'No',
      onOk: () => {
        this.props.deleteAdminPrices(id, 0); //status 0 means delete
      },
      onCancel: () => {}
    });
  };
  renderRow = () => {
    const { prices } = this.props;

    const indexOfLastThing = this.state.activePage * THINGS_PER_PAGE;
    const indexOfFirstThing = indexOfLastThing - THINGS_PER_PAGE;
    const thingsShown = prices.slice(indexOfFirstThing, indexOfLastThing);
    return (
      thingsShown &&
      thingsShown.map((price, index) => {
        return (
          <tr key={index}>
            <td>{price.id}</td>
            <td>
              <CurrencyFormat
                value={price.amount}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'LKR '}
                suffix={'.00'}
              />
            </td>

            <td>{moment(price.created_date).format('YYYY-MM-DD')}</td>
            <td>
              <span className='badge badge-success'>Active</span>
            </td>
            <td style={{ textAlign: 'center' }}>
              <button
                type='button'
                class='btn btn-danger btn-sm'
                style={{ marginLeft: 5 }}
                onClick={() => {
                  this.onDeleteClick(price.id);
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
        <span class='text-muted'>Create a new price package</span>
      </h4>
    );
    const modalWebTitle = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>Browse Online Prices</span>
      </h4>
    );
    return (
      <div id='wrapper'>
        <BackTop />
        <SideNavigation />

        <div id='content-wrapper' className='d-flex flex-column'>
          <div id='content'>
            <AdminHeader />

            <div className='container-fluid'>
              <div className='d-sm-flex align-items-center justify-content-between mb-4'>
                <h1 className='h3 mb-0 text-gray-800'>Price Management</h1>
                <button
                  className='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'
                  onClick={this.showModal}
                  style={{ marginLeft: 530 }}
                >
                  <i className='fa fa-plus' aria-hidden='true'></i> Create a
                  package
                </button>
                <button
                  className='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'
                  onClick={this.showWebModal}
                >
                  <i className='fa fa-globe' aria-hidden='true'></i> Check
                  packages from Online
                </button>
              </div>
              <Modal
                title={modalTitle}
                visible={this.state.visible}
                onOk={this.handleCancel}
                onCancel={this.handleCancel}
                okText='Ok'
                footer={false}
              >
                <PriceCreateForm onclose={this.handleCancel} />
              </Modal>
              <Modal
                title={modalWebTitle}
                visible={this.state.visibleWeb}
                onOk={this.handleWebCancel}
                onCancel={this.handleWebCancel}
                okText='Ok'
                footer={false}
              >
                <OnlinePriceList />
              </Modal>
              <div className='row'>
                <div className='col-xl-12  mb-4 '>
                  <div className='card  shadow h-100 py-2'>
                    <div className='card-body'>
                      <table class='table table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th scope='col'>Package ID</th>
                            <th scope='col'>Price</th>
                            <th scope='col'>Created date</th>
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
                          totalItemsCount={this.props.prices.length}
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
    prices: Object.values(state.prices)
  };
};
export default connect(mapStateToProps, {
  fetchAdminPrices,
  deleteAdminPrices
})(PriceManagement);
