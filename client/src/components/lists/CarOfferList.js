import React, { Component, Fragment } from 'react';
import img_1 from '../../assets/images/img_1.jpg';
import img_2 from '../../assets/images/img_2.jpg';

export class CarOfferList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCars: []
    };
  }

  handleCarClick = id => {
    this.setState(state => {
      const selectedCars = state.selectedCars.concat(id);
      return {
        selectedCars
      };
    });

    this.props.onCarSelection(this.state.selectedCars);
  };
  render() {
    return (
      <Fragment>
        <div className='item-1 hvr-shrink'>
          <a href='#'>
            <img src={img_1} className='img-fluid' />
          </a>
          <div className='item-1-contents'>
            <div className='text-center'>
              <h3>
                <a href='#'>Range Rover S64 Coupe</a>
              </h3>
              <div className='rating'>
                <span className='icon-star text-warning'></span>
                <span className='icon-star text-warning'></span>
                <span className='icon-star text-warning'></span>
                <span className='icon-star text-warning'></span>
                <span className='icon-star text-warning'></span>
              </div>
              <div className='rent-price'>
                <span>$250/</span>day
              </div>
            </div>
            <ul className='specs'>
              <li>
                <span>Doors</span>
                <span className='spec'>4</span>
              </li>
              <li>
                <span>Seats</span>
                <span className='spec'>5</span>
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
              <button
                disabled={this.state.disabledButton}
                className='btn btn-primary'
                onClick={() => this.handleCarClick('1')}
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>

        <div className='item-1 hvr-shrink'>
          <a href='#'>
            <img src={img_2} alt='Image' className='img-fluid' />
          </a>
          <div className='item-1-contents'>
            <div className='text-center'>
              <h3>
                <a href='#'>Range Rover S64 Coupe</a>
              </h3>
              <div className='rating'>
                <span className='icon-star text-warning'></span>
                <span className='icon-star text-warning'></span>
                <span className='icon-star text-warning'></span>
                <span className='icon-star text-warning'></span>
                <span className='icon-star text-warning'></span>
              </div>
              <div className='rent-price'>
                <span>$250/</span>day
              </div>
            </div>
            <ul className='specs'>
              <li>
                <span>Doors</span>
                <span className='spec'>4</span>
              </li>
              <li>
                <span>Seats</span>
                <span className='spec'>5</span>
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
              <button
                disabled={this.state.disabledButton}
                className='btn btn-primary'
                onClick={() => this.handleCarClick('2')}
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CarOfferList;
