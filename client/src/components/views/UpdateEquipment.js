import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { InputNumber } from 'antd';
import _ from 'lodash';

import 'antd/dist/antd.css';

import OwlCarousel from 'react-owl-carousel';
import img_1 from '../../assets/images/img_1.jpg';
import { fetchEquipments } from '../../actions/equipments';
import { updateEquipments } from '../../actions/bookings';

export class UpdateEquipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEquipments: [],
      selectedAmount: {}
    };
  }

  componentDidMount() {
    this.props.fetchEquipments();
  }

  onChange = (amount, id) => {
    this.setState({
      selectedAmount: { id, amount }
    });
  };

  onSubmit = () => {
    let booking_id = this.props.booking_id;

    this.props.updateEquipments(booking_id, this.state.selectedEquipments);
  };

  handleEquipmentClick = (id) => {
    if (_.isEmpty(this.state.selectedAmount)) {
      this.setState((state) => {
        const selectedEquipments = state.selectedEquipments.concat({
          id,
          amount: 1
        });
        return {
          selectedEquipments
        };
      });
    } else {
      this.setState((state) => {
        const selectedEquipments = state.selectedEquipments.concat(
          this.state.selectedAmount
        );
        return {
          selectedEquipments
        };
      });
    }
    this.setState({
      selectedAmount: {}
    });
  };

  renderEquipmentList = () => {
    const { equipments } = this.props;
    return equipments.map((equipment, index) => {
      return (
        <div className='item-1 hvr-shrink' key={index}>
          <a href='#'>
            <img
              src={`http://localhost:5000/api/equipments/img/${equipment.image}`}
              className='img-fluid'
            />
          </a>
          <div className='item-1-contents'>
            <div className='text-center'>
              <h3>
                <a href='#'>{equipment.name}</a>
              </h3>
              <div className='rating'>
                {Array.apply(null, { length: equipment.rating }).map((e, i) => (
                  <span className='icon-star text-warning' key={i}></span>
                ))}
              </div>
              <div className='rent-price'>
                <span>$ {equipment.price}/</span>day
              </div>
            </div>
            <ul className='specs'>
              <li>
                <span>Tags</span>
                <span className='spec'>5</span>
              </li>
              <li>
                <span>Qty</span>
                <span className='spec'>
                  <InputNumber
                    size='small'
                    min={1}
                    max={equipment.qty}
                    defaultValue={1}
                    onChange={(event) => this.onChange(event, equipment.id)}
                    style={{ width: '50px', marginRight: '4px' }}
                  />
                  {/* this.onChange(event, equipment.id) */}/ {equipment.qty}
                </span>
              </li>
            </ul>
            <div className='d-flex action'>
              <button
                className='btn btn-primary btn-sm'
                onClick={() => this.handleEquipmentClick(equipment.id)}
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <Fragment>
        <div className='row'>
          {this.props.equipments.length && (
            <OwlCarousel
              className='owl-theme'
              margin={7}
              dots={false}
              autoplay
              autoplayHoverPause
            >
              {this.renderEquipmentList()}
            </OwlCarousel>
          )}
        </div>
        <div class='ant-modal-footer'>
          <div>
            <button type='button' class='ant-btn'>
              <span>Cancel</span>
            </button>
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
const mapStateToProps = (state) => {
  return {
    equipments: Object.values(state.equipments)
  };
};
export default connect(mapStateToProps, { fetchEquipments, updateEquipments })(
  UpdateEquipment
);
