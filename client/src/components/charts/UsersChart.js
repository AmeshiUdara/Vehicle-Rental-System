import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';

import { fetchUsers } from '../../actions/users';
export class UsersChart extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  setData = () => {
    const { users } = this.props;
    if (!_.isEmpty(users)) {
      let _blackListed = 0;
      let _whiteListed = 0;
      let _normal = 0;

      for (const user of users) {
        if (user.status === 1) {
          _normal++;
        } else if (user.status === 2) {
          _whiteListed++;
        } else if (user.status === 3) {
          _blackListed++;
        }
      }

      let chartData = {
        labels: ['Normal', 'White Listed', 'Black Listed'],
        datasets: [
          {
            label: 'Population',
            data: [_normal, _whiteListed, _blackListed],
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
            text: 'User status',
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
    users: Object.values(state.users)
  };
};
export default connect(mapStateToProps, { fetchUsers })(UsersChart);
