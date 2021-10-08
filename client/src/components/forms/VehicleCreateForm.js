import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import history from '../../history';
import { createAdminVehicle } from '../../actions/vehicles';
import { fetchAdminPrices } from '../../actions/prices';

import _ from 'lodash';
export class VehicleCreateForm extends Component {
  state = {
    vehicle: null
  };

  componentDidMount() {
    this.props.fetchAdminPrices();
  }

  componentDidUpdate(prevProps) {
    if (this.props.vehicles.length !== prevProps.vehicles.length) {
      window.location.href = '/admin-vehicle';
    }
  }

  handlePhotoChange = event => {
    let image = event.target.files[0];

    if (this.checkImageType(event)) {
      this.setState({
        vehicle: image
      });
    }
  };

  checkImageType = event => {
    let err = '';
    let image = event.target.files[0];

    const types = ['image/jpeg', 'image/png', 'image/svg'];
    if (types.every(type => image.type !== type)) {
      err = 'The file format is not supported';
      console.log(err);
    }

    if (err !== '') {
      // if message is changed that means there's an error
      event.target.value = null; // discard selected file

      return false;
    }

    return true;
  };
  renderPhotoInput = field => {
    const {
      meta: { touched, error }
    } = field;

    return (
      <Fragment>
        <div className='custom-file'>
          <input
            type='file'
            className=''
            name='imageupload'
            onChange={event => this.handlePhotoChange(event, field.input)}
          />

          {touched && error && <small color='danger'>{error}</small>}
        </div>
      </Fragment>
    );
  };
  renderField = ({ input, placeholder, type, meta: { touched, error } }) => {
    return (
      <Fragment>
        <input
          {...input}
          type={type}
          className='form-control'
          autoComplete='off'
          placeholder={placeholder}
          style={{ width: '100%', height: 35 }}
        />
        {touched && error && (
          <span className='form-text text-muted'>
            <small style={{ color: 'red' }}>{error}</small>
          </span>
        )}
      </Fragment>
    );
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
  onSubmit = formValues => {
    let date_acquired = moment().format('YYYY-MM-DD hh:mm:ss');
    let vehicle = this.state.vehicle;

    const formData = new FormData();
    let err = '';
    if (!vehicle) {
      err = 'You must attach an image of your vehicle';
      console.log(err);
    } else {
      formData.append('name', formValues.name);
      formData.append('number_plate', formValues.number_plate);
      formData.append('transmission', formValues.transmission);
      formData.append('price_id', formValues.price_id);
      formData.append('minimum_age', formValues.minimum_age);
      formData.append('type', formValues.type);
      formData.append('doors', formValues.doors);
      formData.append('lugage', formValues.lugage);
      formData.append('seats', formValues.seats);
      formData.append('date_acquired', date_acquired);
      formData.append('rating', formValues.rating);
      formData.append('status', 1);
      formData.append('qty', 1);
      formData.append('vehicle', vehicle);

      this.props.createAdminVehicle(formData);
    }
  };
  render() {
    const { handleSubmit } = this.props;

    return (
      <Fragment>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className='row'>
            <div className='col'>
              <Field
                name='name'
                type='text'
                component={this.renderField}
                placeholder='Name of the vehicle'
              />
            </div>

            <div className='col'>
              <Field
                name='number_plate'
                type='text'
                component={this.renderField}
                placeholder='Number plate'
              />
            </div>
          </div>
          <div className='row' style={{ paddingTop: 8 }}>
            <div className='col'>
              <Field
                name='transmission'
                type='text'
                component={this.renderField}
                placeholder='Transmission'
              />
            </div>

            <div className='col'>
              <Field
                name='type'
                type='text'
                component={this.renderField}
                placeholder='Type'
              />
            </div>
          </div>
          <div className='row' style={{ paddingTop: 8 }}>
            <div className='col'>
              <Field
                name='price_id'
                className='form-control'
                component='select'
              >
                {this.renderPriceFields()}
              </Field>
            </div>

            <div className='col'>
              <Field
                name='minimum_age'
                type='number'
                component={this.renderField}
                placeholder='Minimum age'
              />
            </div>
          </div>
          <div className='row' style={{ paddingTop: 8 }}>
            <div className='col'>
              <Field
                name='doors'
                type='text'
                component={this.renderField}
                placeholder='Doors'
              />
            </div>

            <div className='col'>
              <Field
                name='lugage'
                type='number'
                component={this.renderField}
                placeholder='Lugage'
              />
            </div>
          </div>

          <div className='row' style={{ paddingTop: 8 }}>
            <div className='col'>
              <Field
                name='rating'
                type='number'
                component={this.renderField}
                placeholder='Rating'
              />
            </div>

            <div className='col'>
              <Field
                name='seats'
                type='number'
                component={this.renderField}
                placeholder='Seats'
              />
            </div>
          </div>
          <div className='row' style={{ paddingTop: 8 }}>
            <div className='col'>
              <Field
                name='img'
                type='file'
                component={this.renderPhotoInput}
                label='Vehicle image'
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
      </Fragment>
    );
  }
}
const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.doors) {
    errors.doors = 'Required';
  }
  if (!values.seats) {
    errors.seats = 'Required';
  }
  if (!values.minimum_age) {
    errors.minimum_age = 'Required';
  }
  if (!values.transmission) {
    errors.transmission = 'Required';
  }
  if (!values.type) {
    errors.type = 'Required';
  }
  if (!values.number_plate) {
    errors.number_plate = 'Required';
  }
  if (!values.lugage) {
    errors.lugage = 'Required';
  }
  if (!values.price_id) {
    errors.price_id = 'Required';
  }
  if (!values.rating) {
    errors.rating = 'Required';
  }
  return errors;
};
const mapStateToProps = state => {
  return {
    vehicles: Object.values(state.vehicleControl),
    prices: Object.values(state.prices)
  };
};
export default connect(mapStateToProps, {
  createAdminVehicle,
  fetchAdminPrices
})(
  reduxForm({
    form: 'VehicleCreateForm',
    validate
  })(VehicleCreateForm)
);
