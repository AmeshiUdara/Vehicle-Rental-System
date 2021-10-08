import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

export class ContactUsForm extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.messages !== prevProps.messages) {
      this.props.destroy('ContactUsForm');
    }
  }

  renderField = ({ input, placeholder, type, meta: { touched, error } }) => {
    return (
      <Fragment>
        <input
          {...input}
          type={type}
          placeholder={placeholder}
          className='form-control'
        />
        {touched && error && (
          <span className='form-text text-muted'>
            <small style={{ color: 'red' }}>{error}</small>
          </span>
        )}
      </Fragment>
    );
  };
  renderTextArea = ({ input, placeholder, meta: { touched, error } }) => (
    <Fragment>
      <textarea
        {...input}
        placeholder={placeholder}
        cols='30'
        className='form-control'
        rows='10'
      />
      {touched && error && (
        <span className='form-text text-muted'>
          <small style={{ color: 'red' }}>{error}</small>
        </span>
      )}
    </Fragment>
  );
  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className='form-group row'>
          <div className='col-md-6 mb-4 mb-lg-0'>
            <Field
              name='firstname'
              type='text'
              component={this.renderField}
              placeholder='First name'
            />
          </div>
          <div className='col-md-6'>
            <Field
              name='lastname'
              type='text'
              component={this.renderField}
              placeholder='Last name'
            />
          </div>
        </div>

        <div className='form-group row'>
          <div className='col-md-12'>
            <Field
              name='email'
              type='text'
              component={this.renderField}
              placeholder='Email address'
            />
          </div>
        </div>

        <div className='form-group row'>
          <div className='col-md-12'>
            <Field
              name='content'
              placeholder='Write your message.'
              component={this.renderTextArea}
            />
          </div>
        </div>
        <div className='form-group row'>
          <div className='col-md-6 mr-auto'>
            <button
              type='submit'
              className='btn btn-block btn-primary text-white py-3 px-5 hvr-float-shadow'
            >
              Send Message
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.lastname) {
    errors.lastname = 'Required';
  }
  if (!values.firstname) {
    errors.firstname = 'Required';
  }
  if (!values.content) {
    errors.content = 'Required';
  }
  return errors;
};

const mapStateToProps = state => {
  return { messages: state.messages.message };
};

export default connect(mapStateToProps)(
  reduxForm({
    form: 'ContactUsForm',
    validate
  })(ContactUsForm)
);
