import React, { Component } from 'react';
import img_1 from '../../assets/images/img_1.jpg';
import OwlCarousel from 'react-owl-carousel';

export class EquipmentOfferList extends Component {
  render() {
    return (
      <div className='container' data-aos='fade-up'>
        <div className='row justify-content-center text-center mb-5'>
          <div className='col-7 text-center mb-5'>
            <h2>Our Additional Stuffs</h2>
            <p>
            An emergency can happen anywhere, especially when you are traveling on the road. 
            So keep car safety products to ensures that you are prepared beforehand in case of 
            an emergency when traveling.
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
          <OwlCarousel
            className='owl-theme'
            loop
            margin={15}
            nav
            autoplay
            autoplayHoverPause
          >
            <div className='item-1 hvr-shrink'>
              <a href='#'>
                <img src={img_1} className='img-fluid' />
              </a>
              <div className='item-1-contents'>
                <div className='text-center'>
                  <h3>
                    <a href='#'>TOYOTA KDH</a>
                  </h3>
                  <div className='rating'>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                  </div>
                  <div className='rent-price'>
                    <span>LKR 20 000 /</span>day
                  </div>
                </div>
                <ul className='specs'>
                  <li>
                    <span>Doors</span>
                    <span className='spec'>4</span>
                  </li>
                  <li>
                    <span>Seats</span>
                    <span className='spec'>13</span>
                  </li>
                  <li>
                    <span>Transmission</span>
                    <span className='spec'>Automatic</span>
                  </li>
                  <li>
                    <span>Minium age</span>
                    <span className='spec'>21 years</span>
                  </li>
                </ul>
                <div className='d-flex action'>
                  <a href='contact.html' className='btn btn-primary'>
                    Rent Now
                  </a>
                </div>
              </div>
            </div>
            <div className='item-1 hvr-shrink'>
              <a href='#'>
                <img src={img_1} className='img-fluid' />
              </a>
              <div className='item-1-contents'>
                <div className='text-center'>
                  <h3>
                    <a href='#'>Toyota Axio</a>
                  </h3>
                  <div className='rating'>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                  </div>
                  <div className='rent-price'>
                    <span>LKR 5000 /</span>day
                  </div>
                </div>
                <ul className='specs'>
                  <li>
                    <span>Doors</span>
                    <span className='spec'>4</span>
                  </li>
                  <li>
                    <span>Seats</span>
                    <span className='spec'>4</span>
                  </li>
                  <li>
                    <span>Transmission</span>
                    <span className='spec'>Automatic</span>
                  </li>
                  <li>
                    <span>Minium age</span>
                    <span className='spec'>18 years</span>
                  </li>
                </ul>
                <div className='d-flex action'>
                  <a href='/home' className='btn btn-primary'>
                    Rent Now
                  </a>
                </div>
              </div>
            </div>
            <div className='item-1 hvr-shrink'>
              <a href='#'>
                <img src={img_1} className='img-fluid' />
              </a>
              <div className='item-1-contents'>
                <div className='text-center'>
                  <h3>
                    <a href='#'>TOYOTA NZE </a>
                  </h3>
                  <div className='rating'>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                    <span className='icon-star text-warning'></span>
                  </div>
                  <div className='rent-price'>
                    <span>LKR 5000/</span>day
                  </div>
                </div>
                <ul className='specs'>
                  <li>
                    <span>Doors</span>
                    <span className='spec'>4</span>
                  </li>
                  <li>
                    <span>Seats</span>
                    <span className='spec'>4</span>
                  </li>
                  <li>
                    <span>Transmission</span>
                    <span className='spec'>Automatic</span>
                  </li>
                  <li>
                    <span>Minium age</span>
                    <span className='spec'>18 years</span>
                  </li>
                </ul>
                <div className='d-flex action'>
                  <a href='/home' className='btn btn-primary'>
                    Rent Now
                  </a>
                </div>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </div>
    );
  }
}

export default EquipmentOfferList;
