import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import { fetchOnlinePrices } from '../../actions/prices';
export class OnlinePriceList extends Component {
  componentDidMount() {
    this.props.fetchOnlinePrices();
  }

  renderRow = () => {
    const { onlinePrices } = this.props;
    // console.log('OnlinePriceList -> renderRow -> onlinePrices', onlinePrices);
    if (onlinePrices.length !== 0) {
      return (
        onlinePrices &&
        onlinePrices.map((price, index) => {
          return (
            <tr key={index}>
              <td>{price.vehicle}</td>
              <td>{price.price} LKR</td>
            </tr>
          );
        })
      );
    } else {
      return (
        <tr>
          <td colSpan='2' style={{ textAlign: 'center' }}>
            <Spin size='large' />
          </td>
        </tr>
      );
    }
  };

  render() {
    return (
      <table class='table table-striped table-bordered table-hover'>
        <thead>
          <tr>
            <th scope='col'>Vehicle Name</th>
            <th scope='col'>Price /Per week</th>
          </tr>
        </thead>
        <tbody>{this.renderRow()}</tbody>
      </table>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    onlinePrices: Object.values(state.onlinePrices)
  };
};

export default connect(mapStateToProps, { fetchOnlinePrices })(OnlinePriceList);
