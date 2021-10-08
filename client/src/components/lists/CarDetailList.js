import React, { Component, Fragment } from 'react';

export class CarDetailList extends Component {
  render() {
    return (
      <Fragment>
        <div
          className='feature-car-rent-box-1'
          style={{ zIndex: 4, marginBottom: 100, opacity: 0.9 }}
        >
          <h3>KDH</h3>
          <ul className='list-unstyled'>
            <li>
              <span>Doors</span>
              <span className='spec'>4</span>
            </li>
            <li>
              <span>Seats</span>
              <span className='spec'>6</span>
            </li>
            <li>
              <span>Lugage</span>
              <span className='spec'>2 Suitcase/2 Bags</span>
            </li>
            <li>
              <span>Transmission</span>
              <span className='spec'>Automatic</span>
            </li>
            <li>
              <span>Minium age</span>
              <span className='spec'>Automatic</span>
            </li>
          </ul>
          <div className='d-flex align-items-center bg-light p-3'>
            <span>LKR 20 000 /day</span>
            <a href='/cars' className='ml-auto btn btn-primary hvr-grow'>
              Rent Now
            </a>
          </div>
        </div>
        <div
          className='feature-car-rent-box-1 '
          style={{ zIndex: 4, marginBottom: 100, opacity: 0.9 }}
        >
          <h3>Wagon R</h3>
          <ul className='list-unstyled'>
            <li>
              <span>Doors</span>
              <span className='spec'>4</span>
            </li>
            <li>
              <span>Seats</span>
              <span className='spec'>6</span>
            </li>
            <li>
              <span>Lugage</span>
              <span className='spec'>2 Suitcase/2 Bags</span>
            </li>
            <li>
              <span>Transmission</span>
              <span className='spec'>Automatic</span>
            </li>
            <li>
              <span>Minium age</span>
              <span className='spec'>Automatic</span>
            </li>
          </ul>
          <div className='d-flex align-items-center bg-light p-3'>
            <span>LKR 5000 /day</span>
            <a href='/cars' className='ml-auto btn btn-primary hvr-grow'>
              Rent Now
            </a>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CarDetailList;
