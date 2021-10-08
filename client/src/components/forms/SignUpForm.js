import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { toastr } from 'react-redux-toastr';

import { connect } from 'react-redux';
import { userSignUp } from '../../actions';

export class SignUpForm extends Component {
  state = {
    startDate: new Date(),
    licence: null,
    bill: null
  };

  onSubmit = (formValues) => {
    let formattedDob = moment(formValues.dob).format('YYYY/MM/DD');
    let licence = this.state.licence;
    let bill = this.state.bill;

    const formData = new FormData();

    let err = '';
    if (!licence && !bill) {
      err = 'You must attach an image of your licenes and bill';
      toastr.error('Sorry', err);
    } else {
      formData.append('fullname', formValues.fullname);
      formData.append('licensenumber', formValues.licensenumber);
      formData.append('email', formValues.email);
      formData.append('contact', formValues.contact);
      formData.append('password', formValues.password);
      formData.append('dob', formattedDob);
      formData.append('licence', licence);
      formData.append('bill', bill);

      this.props.userSignUp(formData);
    }
  };

  handleChange = (date) => {
    console.log('date', date);
    this.setState({
      startDate: date
    });
  };

  renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
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
        {touched &&
          ((error && (
            <span className='form-text text-muted'>
              <small style={{ color: 'red' }}>{error}</small>
            </span>
          )) ||
            (warning && (
              <span className='form-text text-muted'>
                <small style={{ color: 'red' }}> {warning}</small>
              </span>
            )))}
      </div>
    );
  };

  handlePhotoChange = (event) => {
    let image = event.target.files[0];

    if (this.checkImageType(event)) {
      this.setState({
        licence: image
      });
    }
  };
  handleBillPhotoChange = (event) => {
    let image = event.target.files[0];

    if (this.checkImageType(event)) {
      this.setState({
        bill: image
      });
    }
  };

  checkImageType = (event) => {
    let err = '';
    let image = event.target.files[0];

    const types = ['image/jpeg', 'image/png', 'image/svg'];
    if (types.every((type) => image.type !== type)) {
      err = 'The file format is not supported';
      toastr.error('Sorry', err);
    }

    if (err !== '') {
      // if message is changed that means there's an error
      event.target.value = null; // discard selected file

      return false;
    }

    return true;
  };

  renderPhotoInput = (field) => {
    const {
      meta: { touched, error }
    } = field;

    return (
      <div className='col'>
        <label htmlFor='fileupload'>{field.label}</label>

        <div className='custom-file'>
          <input
            type='file'
            className=''
            name='imageupload'
            onChange={(event) => this.handlePhotoChange(event, field.input)}
          />

          {touched && error && <small color='danger'>{error}</small>}
        </div>
      </div>
    );
  };
  renderBillPhotoInput = (field) => {
    const {
      meta: { touched, error }
    } = field;

    return (
      <div className='col'>
        <label htmlFor='fileupload'>{field.label}</label>

        <div className='custom-file'>
          <input
            type='file'
            className=''
            name='imageupload'
            onChange={(event) => this.handleBillPhotoChange(event, field.input)}
          />

          {touched && error && <small color='danger'>{error}</small>}
        </div>
      </div>
    );
  };
  renderDatePicker = ({ input, label, meta: { touched, error } }) => {
    return (
      <div className='col'>
        <label>{label}</label>
        <div>
          <DatePicker
            selected={input.value || new Date()}
            onChange={input.onChange}
            dateFormat='yyyy-MM-dd'
            className='form-control  form-control-md datepicker signup-datepicker'
          />
        </div>
      </div>
    );
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form
        onSubmit={handleSubmit(this.onSubmit)}
        style={{ maxHeight: '420px', overflow: 'auto' }}
      >
        <div className='text-center'>
          <h1>Sign Up</h1>
          <p className='text-muted'>Create an account, it is free</p>
        </div>
        <div>
          <Field
            name='fullname'
            className='form-row'
            type='text'
            component={this.renderField}
            label='Full name'
          />
          <Field
            name='email'
            className='form-row'
            type='email'
            component={this.renderField}
            label='Email'
          />

          <Field
            name='contact'
            className='form-row'
            type='text'
            component={this.renderField}
            label='Contact number'
          />
          <Field
            name='licensenumber'
            className='form-row'
            type='text'
            component={this.renderField}
            label='Driving License Number'
          />
          <Field
            name='password'
            type='password'
            component={this.renderField}
            label='Password'
            className='form-row'
          />
          <Field
            name='dob'
            component={this.renderDatePicker}
            label='Date of birth'
            className='form-row'
          />
          <Field
            name='licence'
            type='file'
            component={this.renderPhotoInput}
            label='Driving Licence image'
            className='form-row'
          />
          <Field
            name='bill'
            type='file'
            component={this.renderBillPhotoInput}
            label='Utility Bill image'
          />

          <button
            type='submit'
            disabled={this.props.submitting}
            className='btn btn-success'
            style={{
              display: 'block',
              width: '100%',
              fontSize: 18,
              marginTop: 20,
              border: '1px solid white'
            }}
          >
            Sign Up
          </button>
        </div>
      </form>
    );
  }
}

const validate = (values) => {
  const errors = {};

  // if (!values.licence) {
  //   errors.licence = 'Required';
  // }
  // if (!values.bill) {
  //   errors.bill = 'Required';
  // }
  if (!values.fullname) {
    errors.fullname = 'Required';
  }
  if (!values.contact) {
    errors.contact = 'Required';
  } else if (
    !/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/i.test(
      parseInt(values.contact)
    )
  ) {
    errors.contact = 'Invalid contact number';
  }

  if (!values.licensenumber) {
    errors.licensenumber = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};
export default connect(null, { userSignUp })(
  reduxForm({
    form: 'SignUpForm',
    validate
  })(SignUpForm)
);
