import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';

import { fetchAdminVehicles } from '../../actions/vehicles';

export class VehiclesChart extends Component {
  componentDidMount() {
    this.props.fetchAdminVehicles();
  }

  setData = () => {
    const { vehicles } = this.props;
    if (!_.isEmpty(vehicles)) {
      let _onRepair = 0;
      let _booked = 0;
      let _available = 0;

      for (const vehicle of vehicles) {
        if (vehicle.status === 1) {
          _available++;
        } else if (vehicle.status === 2) {
          _booked++;
        } else if (vehicle.status === 3) {
          _onRepair++;
        }
      }

      let chartData = {
        labels: ['Available', 'Booked', 'On Repart'],
        datasets: [
          {
            label: 'Population',
            data: [_available, _booked, _onRepair],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
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
    return (
      <Doughnut
        data={this.setData()}
        options={{
          title: {
            display: true,
            text: 'Vehicle status',
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
    );
  }
}
const mapStateToProps = state => {
  return {
    vehicles: Object.values(state.vehicleControl)
  };
};

export default connect(mapStateToProps, { fetchAdminVehicles })(VehiclesChart);
