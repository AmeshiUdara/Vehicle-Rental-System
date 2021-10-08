import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

import { createAdminEquipment } from '../../actions/equipments';
import { fetchAdminPrices } from '../../actions/prices';

import _ from 'lodash';
export class EquipmentCreateForm extends Component {
  state = {
    equipment: null
  };

  componentDidMount() {
    this.props.fetchAdminPrices();
  }

  componentDidUpdate(prevProps) {
    if (this.props.equipments.length !== prevProps.equipments.length) {
      window.location.href = '/admin-equipment';
    }
  }

  handlePhotoChange = event => {
    let image = event.target.files[0];

    if (this.checkImageType(event)) {
      this.setState({
        equipment: image
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
    let equipment = this.state.equipment;

    const formData = new FormData();
    let err = '';
    if (!equipment) {
      err = 'You must attach an image of your equipment';
      console.log(err);
    } else {
      formData.append('name', formValues.name);
      formData.append('price_id', formValues.price_id);
      formData.append('qty', formValues.qty);
      formData.append('rating', formValues.rating);
      formData.append('status', 1);
      formData.append('equipment', equipment);

      this.props.createAdminEquipment(formData);
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
                placeholder='Name of the equipment'
              />
            </div>

            <div className='col'>
              <Field
                name='qty'
                type='number'
                component={this.renderField}
                placeholder='Quantity'
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
                name='rating'
                type='number'
                component={this.renderField}
                placeholder='Rating'
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
  if (!values.price_id) {
    errors.price_id = 'Required';
  }
  if (!values.qty) {
    errors.qty = 'Required';
  }
  if (!values.rating) {
    errors.rating = 'Required';
  }

  return errors;
};
const mapStateToProps = state => {
  return {
    equipments: Object.values(state.equipments),
    prices: Object.values(state.prices)
  };
};
export default connect(mapStateToProps, {
  createAdminEquipment,
  fetchAdminPrices
})(
  reduxForm({
    form: 'EquipmentCreateForm',
    validate
  })(EquipmentCreateForm)
);
