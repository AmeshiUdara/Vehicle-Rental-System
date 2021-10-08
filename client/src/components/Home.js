import React, { Component } from 'react';
import OwlCarousel from 'react-owl-carousel';
import BackgroundSlideshow from 'react-background-slideshow';
import AOS from 'aos';
import { InputNumber } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Modal, BackTop } from 'antd';
import CurrencyFormat from 'react-currency-format';

import { Result, Button } from 'antd';

import { fetchVehicles } from '../actions/vehicles';
import { fetchEquipments } from '../actions/equipments';
import {
  detectCriticalBooking,
  detectNotCollectedBooking
} from '../actions/bookings';

import hero_2 from '../assets/images/hero_2.jpg';
import person_1 from '../assets/images/person_1.jpg';
import person_2 from '../assets/images/person_2.jpg';
import person_4 from '../assets/images/person_4.jpg';
import bg1 from '../assets/images/bg1.jpg';
import bg2 from '../assets/images/bg2.jpg';
import bg3 from '../assets/images/bg3.jpg';
import bg4 from '../assets/images/bg4.jpg';
import bg5 from '../assets/images/bg5.jpg';
import VehicleRentForm from './forms/VehicleRentForm';

import CarDetailList from './lists/CarDetailList';

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCars: [],
      selectedEquipments: [],
      selectedAmount: {},
      visible: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem('token') !== null) {
      this.props.detectCriticalBooking(localStorage.getItem('id'));
      this.props.detectNotCollectedBooking(localStorage.getItem('id'));
    }

    this.props.fetchVehicles();
    this.props.fetchEquipments();
  }

  componentDidUpdate(prevProps) {
    if (this.props.critical !== prevProps.critical) {
      this.setState({ visible: true });
    }
  }

  handleCarClick = (id, _minAge) => {
    if (localStorage.getItem('dob')) {
      let dob = moment(localStorage.getItem('dob')).format('YYYY-MM-DD HH:mm');

      let today = moment().format('YYYY-MM-DD HH:mm');

      const differenceInYears = moment(today).diff(dob, 'years');

      if (differenceInYears < 18) {
        console.log('You are under 18');
        if (_minAge > 18) {
          console.log('you cant book this');
          alert('You can not book this');
          return;
        }
      }
    }

    this.setState((state) => {
      const selectedCars = state.selectedCars.concat(id);
      return {
        selectedCars
      };
    });
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

  onChange = (amount, id) => {
    this.setState({
      selectedAmount: { id, amount }
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
                <span>
                  <CurrencyFormat
                    value={equipment.price}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'LKR '}
                    suffix={'.00'}
                  />
                  /
                </span>
                day
              </div>
            </div>
            <ul className='specs'>
              <li>
                <span>Description</span>
                <span className='spec'>18 years</span>
              </li>
              <li>
                <span>Quantity</span>
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
              <li>
                <span>Tags</span>
                <span className='spec'>5</span>
              </li>
            </ul>
            <div className='d-flex action'>
              <button
                className='btn btn-primary'
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

  renderVehicleList = () => {
    const { vehicles } = this.props;
    return vehicles.map((vehicle, index) => {
      return (
        <div className='item-1 hvr-shrink' key={index}>
          <a href='#'>
            <img
              src={`http://localhost:5000/api/vehicles/img/${vehicle.image}`}
              // src={img_1}
              className='img-fluid'
            />
          </a>
          <div className='item-1-contents'>
            <div className='text-center'>
              <h3>
                <a href='#'>{vehicle.name}</a>
              </h3>
              <div className='rating'>
                {Array.apply(null, { length: vehicle.rating }).map((e, i) => (
                  <span className='icon-star text-warning' key={i}></span>
                ))}
              </div>
              <div className='rent-price'>
                <span>
                  <CurrencyFormat
                    value={vehicle.price}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'LKR '}
                    suffix={'.00'}
                  />
                  /
                </span>
                day
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
                <span className='spec'>{vehicle.minimum_age} years</span>
              </li>
              <li>
                <span>Type</span>
                <span className='spec'>{vehicle.type}</span>
              </li>
            </ul>
            <div className='d-flex action'>
              <button
                disabled={this.state.disabledButton}
                className='btn btn-primary'
                onClick={() =>
                  this.handleCarClick(vehicle.id, vehicle.minimum_age)
                }
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    AOS.init({ duration: 2000, delay: 200 });
    // console.log(this.state.selectedAmount);
    return (
      <div className='site-wrap' id='home-section'>
        <BackTop />
        <div className='ftco-blocks-cover-1'>
          <div
            className='ftco-cover-1 overlay'
            // style={{ backgroundImage: `url(${hero_1})` }}
          >
            <BackgroundSlideshow images={[bg1, bg2, bg3, bg4, bg5]} />

            <div className='container'>
              <div className='row align-items-center'>
                <div className='col-lg-5 '>
                  <OwlCarousel
                    className='owl-theme'
                    loop
                    margin={15}
                    dots={false}
                    autoplay
                    items={1}
                    style={{ zIndex: 5 }}
                  >
                    <CarDetailList />
                  </OwlCarousel>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='site-section pt-0 pb-0 bg-light'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <VehicleRentForm
                  cars={this.state.selectedCars}
                  tools={this.state.selectedEquipments}
                />
              </div>
            </div>
          </div>
        </div>
        <Modal centered visible={this.state.visible} footer={null}>
          <div>
            <Result
              status='500'
              title='Return your vehicle'
              subTitle='You still have not return your vehicle and equipments you borrowed'
              extra={
                <Button type='primary' onClick={this.hideModal}>
                  Back Home
                </Button>
              }
            />
          </div>
        </Modal>
        <div className='site-section bg-light'>
          <div className='container' data-aos='fade-right'>
            <div className='row'>
              <div className='col-lg-3'>
                <h3>Our Offer</h3>
                <p className='mb-4'>
                  Style and class are what we promise for your any type of
                  vehicle need!
                </p>

                <form className='form-inline'>
                  <input
                    className='form-control form-control-sm'
                    type='search'
                    placeholder='Search vehicle'
                    aria-label='Search'
                    style={{ height: 35 }}
                  />
                  <button
                    className='btn btn-outline-success btn-sm hvr-float-shadow'
                    type='submit'
                    style={{ marginLeft: 5 }}
                  >
                    Search
                  </button>
                </form>
              </div>
              <div className='col-lg-9'>
                {this.props.vehicles.length && (
                  <OwlCarousel
                    className='owl-theme'
                    margin={15}
                    autoplay
                    autoplayHoverPause
                    dots={false}
                  >
                    {this.renderVehicleList()}
                    {/* <CarOfferList onCarSelection={this.onSelectCars} /> */}
                  </OwlCarousel>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className='site-section section-3'
          style={{ backgroundImage: `url(${hero_2})` }}
        >
          <div className='container' data-aos='fade-left'>
            <div className='row'>
              <div className='col-12 text-center mb-5'>
                <h2 className='text-white'>Our services</h2>
              </div>
            </div>
            <div className='row '>
              <div className='col-lg-4 hvr-bob'>
                <div className='service-1'>
                  <span className='service-1-icon'>
                    <span className='flaticon-car-1'></span>
                  </span>
                  <div className='service-1-contents'>
                    <h3>Repair</h3>
                    <p>
                      A fair price in seconds, mechanics you can trust, next-day
                      service at your door.
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-lg-4 hvr-bob'>
                <div className='service-1'>
                  <span className='service-1-icon'>
                    <span className='flaticon-traffic'></span>
                  </span>
                  <div className='service-1-contents'>
                    <h3>Accessories</h3>
                    <p>
                      Everything you wish to take in your journey, We can
                      supply.
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-lg-4 hvr-bob'>
                <div className='service-1'>
                  <span className='service-1-icon'>
                    <span className='flaticon-valet'></span>
                  </span>
                  <div className='service-1-contents'>
                    <h3>Vehicles</h3>
                    <p>
                      Extensive fleet of luxury vehicles which will make your
                      journey unforgettable one.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='container site-section mb-5' data-aos='fade-up'>
          <div className='row justify-content-center text-center'>
            <div className='col-7 text-center mb-5'>
              <h2>How it works</h2>
              <p className='cssanimation'>
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
              <span className='caption'>Car & Equipments</span>
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

        <div className='site-section bg-light'>
          <div className='container' data-aos='flip-left'>
            <div className='row justify-content-center text-center mb-5'>
              <div className='col-7 text-center mb-5'>
                <h2>What Our customers say</h2>
                <p>
                  The following quotes are indicative of what Janahitha tours gets
                  for customer appreciation.
                </p>
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-4 mb-4 mb-lg-0 hvr-grow'>
                <div className='testimonial-2'>
                  <blockquote className='mb-4'>
                    <p>
                      "Best place to rent cars and car accessories good job and
                      outstanding maintenance, Friendly customer service keep up
                      the good work."
                    </p>
                  </blockquote>
                  <div className='d-flex v-card align-items-center'>
                    <img
                      src={person_1}
                      alt='Image'
                      className='img-fluid mr-3'
                    />
                    <span>Anjalie Fernando</span>
                  </div>
                </div>
              </div>
              <div className='col-lg-4 mb-4 mb-lg-0 hvr-grow'>
                <div className='testimonial-2'>
                  <blockquote className='mb-4'>
                    <p>
                      "Quality products with reliable price.Not letting
                      customers to wait outside, highly recommended for anyone
                      who wish to rent a vehicle."
                    </p>
                  </blockquote>
                  <div className='d-flex v-card align-items-center'>
                    <img
                      src={person_2}
                      alt='Image'
                      className='img-fluid mr-3'
                    />
                    <span>Chathura Madhushan</span>
                  </div>
                </div>
              </div>
              <div className='col-lg-4 mb-4 mb-lg-0 hvr-grow'>
                <div className='testimonial-2'>
                  <blockquote className='mb-4'>
                    <p>
                      "Offers a wide range of options from economy to luxury.
                      The fleet consists of cars, sports utility, and 4WD
                      vehicles, vans and buses."
                    </p>
                  </blockquote>
                  <div className='d-flex v-card align-items-center'>
                    <img
                      src={person_4}
                      alt='Image'
                      className='img-fluid mr-3'
                    />
                    <span>Ruwan Perera</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='site-section bg-white'>
          <div className='container' data-aos='fade-up'>
            <div className='row justify-content-center text-center mb-5'>
              <div className='col-7 text-center mb-5'>
                <h2>Our Additional Equipments</h2>
                <p>
                  You need more to get the most of the trip? We've got you
                  coverd!
                </p>
                <form className='form-inline' style={{ marginLeft: 195 }}>
                  <input
                    className='form-control form-control-sm'
                    type='search'
                    placeholder='Search for a stuff'
                    aria-label='Search'
                    style={{ height: 35 }}
                  />
                  <button
                    className='btn btn-outline-success btn-sm btn-sm hvr-float-shadow'
                    type='submit'
                    style={{ marginLeft: 5 }}
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            <div className='row'>
              {this.props.equipments.length && (
                <OwlCarousel
                  className='owl-theme'
                  margin={15}
                  dots={false}
                  autoplay
                  autoplayHoverPause
                >
                  {this.renderEquipmentList()}
                </OwlCarousel>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    vehicles: Object.values(state.vehicles),
    equipments: Object.values(state.equipments),
    critical: state.critical
  };
};

export default connect(mapStateToProps, {
  fetchVehicles,
  fetchEquipments,
  detectCriticalBooking,
  detectNotCollectedBooking
})(Home);
