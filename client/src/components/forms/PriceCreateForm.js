import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { createAdminPrice } from '../../actions/prices';

export class PriceCreateForm extends Component {
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
    this.props.createAdminPrice(formValues);
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className='form-group row'>
          <div className='col'>
            <Field
              name='amount'
              type='number'
              component={this.renderField}
              label='Price per day (more than 5 hours)'
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

  if (!values.amount) {
    errors.amount = 'Required';
  }

  return errors;
};

export default connect(null, { createAdminPrice })(
  reduxForm({
    form: 'PriceCreateForm',
    validate
  })(PriceCreateForm)
);
