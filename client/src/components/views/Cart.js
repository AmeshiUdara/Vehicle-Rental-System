import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Spin } from 'antd';
import CurrencyFormat from 'react-currency-format';

import { createBooking } from '../../actions/bookings';
import { fetchCartEquipments, fetchCartVehicles } from '../../actions/carts';

export class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: null
    };
  }

  componentDidMount() {
    if (this.props.vehicles && this.props.equipments) {
      this.props.fetchCartEquipments(this.props.equipments);
      this.props.fetchCartVehicles(this.props.vehicles);
    }
  }

  renderVehicleList = () => {
    const { cart_vehicles } = this.props;

    return (
      cart_vehicles &&
      cart_vehicles.map((vehicle, index) => {
        return (
          <li
            class='list-group-item d-flex justify-content-between lh-condensed'
            key={index}
          >
            <div>
              <h6 class='my-0'>{vehicle.name}</h6>
              <small class='text-muted'>Brief description</small>
            </div>
            <span class='text-muted'>
              <CurrencyFormat
                value={vehicle.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'LKR '}
                suffix={'.00'}
              />
            </span>
          </li>
        );
      })
    );
  };
  renderEquipmentList = () => {
    const { cart_equipments } = this.props;

    return (
      cart_equipments &&
      cart_equipments.map((equipment, index) => {
        let price = equipment.price * equipment.qty;
        return (
          <li
            class='list-group-item d-flex justify-content-between lh-condensed'
            key={index}
          >
            <div>
              <h6 class='my-0'>
                {equipment.name} X {equipment.qty}
              </h6>
              <small class='text-muted'>Brief description</small>
            </div>
            <span class='text-muted'>
              <CurrencyFormat
                value={price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'LKR '}
                suffix={'.00'}
              />
            </span>
          </li>
        );
      })
    );
  };

  calculateSum = () => {
    const { cart_vehicles } = this.props;
    const { cart_equipments } = this.props;
    let _eqSum = 0;
    let _vhSum;
    for (const _eq of cart_equipments) {
      _eqSum += _eq.price * _eq.qty;
    }

    _vhSum = _.sum(_.map(cart_vehicles, 'price'));

    let amount = _vhSum + _eqSum;

    return amount;
  };

  renderSum = () => {
    const { cart_vehicles } = this.props;

    if (cart_vehicles.length !== 0) {
      return (
        <li class='list-group-item d-flex justify-content-between bg-light'>
          <div class='text-success'>
            <h6 class='my-0'>Total(LKR)</h6>
          </div>
          <span class='text-success'>
            <CurrencyFormat
              value={this.calculateSum()}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'LKR '}
              suffix={'.00'}
            />
          </span>
        </li>
      );
    } else {
      return (
        <li className='list-group-item d-flex justify-content-center lh-condensed'>
          <Spin size='large' />
        </li>
      );
    }
  };
  onSubmit = () => {
    let data = this.props.bookingData;
    let total = this.calculateSum();
    this.props.createBooking(_.assign(data, { total }));
  };

  render() {
    return (
      <Fragment>
        <div class='col'>
          <ul class='list-group mb-3'>
            {this.renderVehicleList()}
            {this.renderEquipmentList()}
            {this.renderSum()}
          </ul>
        </div>
        <div class='ant-modal-footer'>
          <div>
            <button
              type='button'
              class='ant-btn ant-btn-primary'
              onClick={this.onSubmit}
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
  return {
    cart_vehicles: Object.values(state.cartVehicles),
    cart_equipments: Object.values(state.cartEquipments)
  };
};

export default connect(mapStateToProps, {
  fetchCartEquipments,
  fetchCartVehicles,
  createBooking
})(Cart);
