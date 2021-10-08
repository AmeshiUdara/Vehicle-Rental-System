import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Line } from 'react-chartjs-2';

import { fetechWeeklyEarnings } from '../../actions/bookings';

export class EarningOverviewChart extends Component {
  componentDidMount() {
    this.props.fetechWeeklyEarnings();
  }

  setData = () => {
    const { earnings } = this.props;
    if (!_.isEmpty(earnings)) {
      let chartData = {
        labels: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        datasets: [
          {
            label: 'Income in £',
            data: [
              earnings.mon.total,
              earnings.tue.total,
              earnings.wed.total,
              earnings.thr.total,
              earnings.fri.total,
              earnings.sat.total,
              earnings.sun.total
            ],
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
    const { earnings } = this.props;

    return (
      earnings && (
        <Line
          data={this.setData()}
          options={{
            title: {
              display: true,
              text: 'Weekly Earnings',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          }}
          width={750}
          height={320}
        />
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    earnings: state.earnings
  };
};
export default connect(mapStateToProps, {
  fetechWeeklyEarnings
})(EarningOverviewChart);
