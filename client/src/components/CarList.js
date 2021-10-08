import React, { Component } from 'react';

import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';

import { fetchVehicles } from '../actions/vehicles';
import hero_2 from '../assets/images/hero_2.jpg';
import img_1 from '../assets/images/img_1.jpg';
import { BackTop } from 'antd';
const THINGS_PER_PAGE = 6;

export class CarList extends Component {
  state = {
    activePage: 1
  };

  componentDidMount() {
    this.props.fetchVehicles();
  }
  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber });
  };
  renderVehicles = () => {
    const { vehicles } = this.props;
    const indexOfLastThing = this.state.activePage * THINGS_PER_PAGE;
    const indexOfFirstThing = indexOfLastThing - THINGS_PER_PAGE;
    const thingsShown = vehicles.slice(indexOfFirstThing, indexOfLastThing);
    return (
      thingsShown &&
      thingsShown.map((vehicle, index) => {
        return (
          <div className='col-lg-4 col-md-6 mb-4' key={index}>
            <div className='item-1 hvr-shrink'>
              <a href='#'>
                <img
                  src={`http://localhost:5000/api/vehicles/img/${vehicle.image}`}
                  alt='Image'
                  className='img-fluid'
                />
              </a>
              <div className='item-1-contents'>
                <div className='text-center'>
                  <h3>
                    <a href='#'>{vehicle.name}</a>
                  </h3>
                  <div className='rating'>
                    {Array.apply(null, { length: vehicle.rating }).map(
                      (e, i) => (
                        <span className='icon-star text-warning' key={i}></span>
                      )
                    )}
                  </div>
                  <div className='rent-price'>
                    <span>LKR {vehicle.price}.00/</span>day
                  </div>
                </div>
                <ul className='specs'>
                  <li>
                    <span>Doors</span>
                    <span className='spec'>{vehicle.doors}</span>
                  </li>
                  <li>
                    <span>Seats</span>
                    <span className='spec'>{vehicle.seats}</span>
                  </li>
                  <li>
                    <span>Transmission</span>
                    <span className='spec'>{vehicle.transmission}</span>
                  </li>
                  <li>
                    <span>Minium age</span>
                    <span className='spec'>{vehicle.minimum_age}</span>
                  </li>
                </ul>
                <div className='d-flex action'>
                  <a href='/' className='btn btn-primary'>
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
    console.log(this.props.vehicles);
    return (
      <div className='site-wrap' id='home-section'>
        <BackTop />
        <div className='ftco-blocks-cover-1'>
          <div
            className='ftco-cover-1 overlay innerpage'
            style={{ backgroundImage: `url(${hero_2})` }}
          >
            <div className='container'>
              <div className='row align-items-center justify-content-center'>
                <div className='col-lg-6 text-center'>
                  <h1>Our Vehicle Collection</h1>
                  <p>
                    Style and class are what we promise for your any type of
                    vehicle need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='site-section bg-light'>
          <div className='container'>
            <div className='row'>
              {this.renderVehicles()}

              <div className='col-12'>
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

        <div className='container site-section mb-5'>
          <div className='row justify-content-center text-center'>
            <div className='col-7 text-center mb-5'>
              <h2>How it works</h2>
              <p>
                Janahitha Tours offers a very quick booking process where you can
                get the vehicle from the click of a button!
              </p>
            </div>
          </div>
          <div className='how-it-works d-flex cssanimation hu__hu__ '>
            <div className='step'>
              <span className='number'>
                <span>01</span>
              </span>
              <span className='caption'>Time &amp; Place</span>
            </div>
            <div className='step'>
              <span className='number'>
                <span>02</span>
              </span>
              <span className='caption'>Car</span>
            </div>
            <div className='step'>
              <span className='number'>
                <span>03</span>
              </span>
              <span className='caption'>Details</span>
            </div>
            <div className='step'>
              <span className='number'>
                <span>04</span>
              </span>
              <span className='caption'>Checkout</span>
            </div>
            <div className='step'>
              <span className='number'>
                <span>05</span>
              </span>
              <span className='caption'>Done</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    vehicles: Object.values(state.vehicles)
  };
};
export default connect(mapStateToProps, { fetchVehicles })(CarList);
