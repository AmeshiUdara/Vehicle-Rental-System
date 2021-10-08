import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchEquipments } from '../actions/equipments';
import { BackTop } from 'antd';

import Pagination from 'react-js-pagination';

import hero_2 from '../assets/images/hero_2.jpg';

const THINGS_PER_PAGE = 6;
export class EquipmentList extends Component {
  state = {
    activePage: 1
  };
  componentDidMount() {
    this.props.fetchEquipments();
  }
  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  };
  renderEquipments = () => {
    const { equipments } = this.props;
    const indexOfLastThing = this.state.activePage * THINGS_PER_PAGE;
    const indexOfFirstThing = indexOfLastThing - THINGS_PER_PAGE;
    const thingsShown = equipments.slice(indexOfFirstThing, indexOfLastThing);
    return (
      thingsShown &&
      thingsShown.map((equipment, index) => {
        return (
          <div class='col-lg-4 col-md-6 mb-4' key={index}>
            <div class='item-1 hvr-shrink'>
              <a href='#'>
                <img
                  src={`http://localhost:5000/api/equipments/img/${equipment.image}`}
                  alt='Image'
                  class='img-fluid'
                />
              </a>
              <div class='item-1-contents'>
                <div class='text-center'>
                  <h3>
                    <a href='#'>{equipment.name}</a>
                  </h3>
                  <div class='rating'>
                    {Array.apply(null, { length: equipment.rating }).map(
                      (e, i) => (
                        <span className='icon-star text-warning' key={i}></span>
                      )
                    )}
                  </div>
                  <div class='rent-price'>
                    <span>LKR {equipment.price}/</span>day
                  </div>
                </div>
                <ul class='specs'>
                  <li>
                    <span>Description</span>
                    <span class='spec'>4</span>
                  </li>
                  <li>
                    <span>Quantity</span>
                    <span class='spec'>{equipment.qty}</span>
                  </li>
                  <li>
                    <span>Tag</span>
                    <span class='spec'>Automatic</span>
                  </li>
                </ul>
                <div class='d-flex action'>
                  <a href='contact.html' class='btn btn-primary'>
                    Rent Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })
    );
  };

  render() {
    return (
      <div class='site-wrap' id='home-section'>
        <BackTop />
        <div class='ftco-blocks-cover-1'>
          <div
            class='ftco-cover-1 overlay innerpage'
            style={{ backgroundImage: `url(${hero_2})` }}
          >
            <div class='container'>
              <div class='row align-items-center justify-content-center'>
                <div class='col-lg-6 text-center'>
                  <h1>Our Equipment Collection</h1>
                  <p>
                    You need more to get the most of the trip? We've got you
                    coverd!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class='site-section bg-light'>
          <div class='container'>
            <div class='row'>
              {this.renderEquipments()}
              <div class='col-12'>
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

        <div class='container site-section mb-5'>
          <div class='row justify-content-center text-center'>
            <div class='col-7 text-center mb-5'>
              <h2>How it works</h2>
              <p>
                Janahitha Tours offers a very quick booking process where you can
                get the vehicle from the click of a button!
              </p>
            </div>
          </div>
          <div class='how-it-works d-flex cssanimation hu__hu__ '>
            <div class='step'>
              <span class='number'>
                <span>01</span>
              </span>
              <span class='caption'>Time &amp; Place</span>
            </div>
            <div class='step'>
              <span class='number'>
                <span>02</span>
              </span>
              <span class='caption'>Car</span>
            </div>
            <div class='step'>
              <span class='number'>
                <span>03</span>
              </span>
              <span class='caption'>Details</span>
            </div>
            <div class='step'>
              <span class='number'>
                <span>04</span>
              </span>
              <span class='caption'>Checkout</span>
            </div>
            <div class='step'>
              <span class='number'>
                <span>05</span>
              </span>
              <span class='caption'>Done</span>
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
export default connect(mapStateToProps, { fetchEquipments })(EquipmentList);
