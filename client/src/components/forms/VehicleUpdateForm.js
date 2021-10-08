import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { fetchAdminPrices } from '../../actions/prices';

export class VehicleUpdateForm extends Component {
  componentDidMount() {
    this.props.fetchAdminPrices();
  }

  renderField = ({ input, label, type, meta: { touched, error } }) => {
    return (
      <div className='col'>
        <label>{label}</label>
        <input
          {...input}
          type={type}
          className='form-control'
          // autoComplete='off'
          style={{ height: 35 }}
        />
        {touched && error && (
          <span className='form-text text-muted'>
            <small style={{ color: 'red' }}>{error}</small>
          </span>
        )}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  renderPriceFields = () => {
    const { prices } = this.props;
    return (
      prices &&
      prices.map((price, index) => {
        return (
          <option value={price.id} key={index}>
            Rs. {price.amount}.00
          </option>
        );
      })
    );
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className='form-group row'>
          <div className='col'>
            <div className='col'>
              <label>Price allocated per day</label>

              <Field
                name='price_id'
                component='select'
                className='form-control'
              >
                {this.renderPriceFields()}
              </Field>
            </div>
          </div>
        </div>

        <div className='form-group row'>
          <div className='col'>
            <Field
              name='minimum_age'
              type='number'
              component={this.renderField}
              label='Minimum age'
            />
          </div>
        </div>

        <div class='ant-modal-footer' style={{ marginTop: 10 }}>
          <div>
            <button type='button' class='ant-btn' onClick= {this.props.onclose}>
              <span>Cancel</span>
            </button>
            <button type='submit' class='ant-btn ant-btn-primary'>
              <span>Submit</span>
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.price_id) {
    errors.price_id = 'Required';
  }
  if (!values.minimum_age) {
    errors.minimum_age = 'Required';
  }

  return errors;
};

const mapStateToProps = state => {
  return {
    prices: Object.values(state.prices)
  };
};

export default connect(mapStateToProps, { fetchAdminPrices })(
  reduxForm({
    form: 'VehicleUpdateForm',
    validate
  })(VehicleUpdateForm)
);
