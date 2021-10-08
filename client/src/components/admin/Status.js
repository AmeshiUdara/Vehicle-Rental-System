import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CurrencyFormat from 'react-currency-format';

import { fecthBookings } from '../../actions/bookings';
export class Status extends Component {
  componentDidMount() {
    this.props.fecthBookings();
  }

  calculateMonthlyEarnings = () => {
    const { bookings } = this.props;
    if (!_.isEmpty(bookings)) {
      let total_monthly = _.sum(_.map(bookings, 'price'));
      return total_monthly;
    }
  };

  pendingBookings = () => {
    const { bookings } = this.props;
    if (!_.isEmpty(bookings)) {
      let _bookings = _.filter(bookings, { status: 1 });
      return _bookings.length;
    }
  };
  pendingBookings = () => {
    const { bookings } = this.props;
    if (!_.isEmpty(bookings)) {
      let _bookings = _.filter(bookings, { status: 1 });
      return _bookings.length;
    }
  };

  lateReturns = () => {
    const { bookings } = this.props;
    if (!_.isEmpty(bookings)) {
      let _bookings = _.filter(bookings, { status: 3 });
      return _bookings.length;
    }
  };

  render() {
    const { bookings } = this.props;
    return (
      bookings && (
        <Fragment>
          <div
            className='col-xl-3 col-md-6 mb-4 hvr-grow'
            style={{ cursor: 'pointer' }}
          >
            <div className='card border-left-primary shadow h-100 py-2'>
              <div className='card-body'>
                <div className='row no-gutters align-items-center'>
                  <div className='col mr-2'>
                    <div className='text-xs font-weight-bold text-primary text-uppercase mb-1'>
                      Earnings (Monthly)
                    </div>
                    <div className='h5 mb-0 font-weight-bold text-gray-800'>
                      <CurrencyFormat
                        value={this.calculateMonthlyEarnings()}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'LKR '}
                        suffix={'.00'}
                      />
                    </div>
                  </div>
                  <div className='col-auto'>
                    <i className='fa fa-calendar fa-2x  text-gray-300'></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Earnings (Monthly) Card Example --> */}
          <div
            className='col-xl-3 col-md-6 mb-4 hvr-grow'
            style={{ cursor: 'pointer' }}
          >
            <div className='card border-left-success shadow h-100 py-2'>
              <div className='card-body'>
                <div className='row no-gutters align-items-center'>
                  <div className='col mr-2'>
                    <div className='text-xs font-weight-bold text-success text-uppercase mb-1'>
                      Earnings (Annual)
                    </div>
                    <div className='h5 mb-0 font-weight-bold text-gray-800'>
                      <CurrencyFormat
                        value={this.calculateMonthlyEarnings() * 12}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'LKR '}
                        suffix={'.00'}
                      />
                    </div>
                  </div>
                  <div className='col-auto'>
                    <i className='fa fa-dollar  fa-2x text-gray-300'></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Earnings (Monthly) Card Example --> */}
          <div
            className='col-xl-3 col-md-6 mb-4 hvr-grow'
            style={{ cursor: 'pointer' }}
          >
            <div className='card border-left-warning shadow h-100 py-2'>
              <div className='card-body'>
                <div className='row no-gutters align-items-center'>
                  <div className='col mr-2'>
                    <div className='text-xs font-weight-bold text-warning text-uppercase mb-1'>
                      Pending Bookings
                    </div>
                    <div className='h5 mb-0 font-weight-bold text-gray-800'>
                      {this.pendingBookings()}
                    </div>
                  </div>
                  <div className='col-auto'>
                    <i className='fa fa-exclamation-triangle fa-2x text-gray-300'></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Pending Requests Card Example --> */}
          <div
            className='col-xl-3 col-md-6 mb-4 hvr-grow'
            style={{ cursor: 'pointer' }}
          >
            <div className='card border-left-danger shadow h-100 py-2'>
              <div className='card-body'>
                <div className='row no-gutters align-items-center'>
                  <div className='col mr-2'>
                    <div className='text-xs font-weight-bold text-danger text-uppercase mb-1'>
                      Late Returns
                    </div>
                    <div className='h5 mb-0 font-weight-bold text-gray-800'>
                      {this.lateReturns()}
                    </div>
                  </div>
                  <div className='col-auto'>
                    <i className='fa fa-window-close fa-2x text-gray-300'></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    bookings: Object.values(state.bookingControl)
  };
};
export default connect(mapStateToProps, { fecthBookings })(Status);
