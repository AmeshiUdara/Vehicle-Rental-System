import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';

import { fecthBookings } from '../../actions/bookings';

export class BookingsChart extends Component {
  componentDidMount() {
    this.props.fecthBookings();
  }

  setData = () => {
    const { bookings } = this.props;
    if (!_.isEmpty(bookings)) {
      let _notCollected = 0;
      let _returnd = 0;
      let _lateReturnd = 0;
      let _notReturnd = 0;

      for (const booking of bookings) {
        if (booking.status === 1) {
          _notCollected++;
        } else if (booking.status === 2) {
          _returnd++;
        } else if (booking.status === 3) {
          _lateReturnd++;
        } else if (booking.status === 4) {
          _notReturnd++;
        }
      }
      let chartData = {
        labels: ['Not Collected', 'Returned', 'Late returned', 'Not Returned'],
        datasets: [
          {
            data: [_notCollected, _returnd, _lateReturnd, _notReturnd],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ]
          }
        ]
      };
      return chartData;
    }
  };

  render() {
    const { bookings } = this.props;

    return (
      bookings && (
        <Doughnut
          data={this.setData()}
          options={{
            title: {
              display: true,
              text: 'Weekly Bookings',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          }}
          width={301}
          height={280}
        />
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    bookings: Object.values(state.bookingControl)
  };
};
export default connect(mapStateToProps, { fecthBookings })(BookingsChart);
