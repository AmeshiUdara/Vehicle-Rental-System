import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

import { updateUserDetails } from '../../actions/users';
export class UserEditForm extends Component {
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
    this.props.updateUserDetails(localStorage.getItem('id'), formValues);
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <form class='form-horizontal' onSubmit={handleSubmit(this.onSubmit)}>
        <fieldset>
          <div class='form-group'>
            <div class='controls'>
              <Field
                name='fullname'
                type='text'
                component={this.renderField}
                label='Full name'
              />
            </div>
          </div>

          <div class='form-group'>
            <div class='controls'>
              <Field
                name='contact'
                type='text'
                component={this.renderField}
                label='Contact number'
              />
            </div>
          </div>

          <div class='form-group'>
            <div class='controls'>
              <Field
                name='old_password'
                type='password'
                component={this.renderField}
                label='Current Password'
              />
            </div>
          </div>

          <div class='form-group'>
            <div class='controls'>
              <Field
                name='new_password'
                type='password'
                component={this.renderField}
                label='New Password'
              />
            </div>
          </div>

          <div class='form-group'>
            <div class='controls'>
              <button
                type='submit'
                className='btn btn-success'
                style={{
                  display: 'block',
                  width: '100%',
                  fontSize: 18,
                  marginTop: 20,
                  border: '1px solid white'
                }}
              >
                Update
                <span>
                  <i class='fa fa-hand-o-right' aria-hidden='true'></i>
                </span>
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.fullname) {
    errors.fullname = 'Required';
  }
  if (!values.contact) {
    errors.contact = 'Required';
  }
 
  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

export default connect(null, { updateUserDetails })(
  reduxForm({
    form: 'UserEditForm',
    validate
  })(UserEditForm)
);
