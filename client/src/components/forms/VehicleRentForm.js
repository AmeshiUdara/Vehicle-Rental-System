import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/css/important.css';
import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import { Modal } from 'antd';
import history from '../../history';
import { createBooking } from '../../actions/bookings';
import Cart from '../views/Cart';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
export class VehicleRentForm extends Component {
  state = {
    startDate: new Date(),
    booking: {}
  };

  componentDidUpdate(prevProps) {
    if (this.props.bookings !== prevProps.bookings) {
      toastr.success('Success', 'Vehicle booked successfully');
      window.location.href = '/';
    }
  }
  handleChange = date => {
    this.setState({
      startDate: date,
      visible: false
    });
  };

  renderField = ({
    input,
    label,
    placeholder,
    type,
    meta: { touched, error }
  }) => {
    return (
      <div className='form-group col-md-3'>
        <label htmlFor='cf-1'>{label}</label>
        <input
          {...input}
          type={type}
          id='cf-1'
          placeholder={placeholder}
          className='form-control'
        />
        {touched && error && (
          <span className='form-text text-muted'>
            <small style={{ color: 'red' }}>{error}</small>
          </span>
        )}
      </div>
    );
  };
  renderDatePicker = ({ input, label, meta: { error } }) => {
    return (
      <div className='form-group col-md-3'>
        <label htmlFor='cf-3'>{label}</label>
        <DatePicker
          selected={input.value || new Date()}
          onChange={input.onChange}
          minDate={Date.now()}
          dateFormat='yyyy-MM-dd'
          className='form-control datepicker px-3 react-datepicker'
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='time'
          showTimeSelect
          dateFormat='Pp'
          minTime={setHours(setMinutes(new Date(), 0), 8)}
          maxTime={setHours(setMinutes(new Date(), 0), 16)}
        />
        {
          <span className='form-text text-muted'>
            <small style={{ color: 'red' }}>{error}</small>
          </span>
        }
      </div>
    );
  };

  onSubmit = formValues => {
    let id = localStorage.getItem('id');
    let status = localStorage.getItem('status');
    let _bookingdate = moment(formValues.journeydate).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    let _returndate = moment(formValues.returndate).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    const differenceInHours = moment(_returndate).diff(_bookingdate, 'hours');

    let err = null;
    if (differenceInHours < 5) {
      err = 'Return date should be minimum 5 hours after your booking date';

      toastr.error('Error', err);
      return;
    }

    if (this.props.cars.length === 0) {
      err = 'You must select a vehicle to continue';

      toastr.error('Error', err);
      return;
    }

    if (id === null) {
      err = 'You must sign in ';
      window.location.href = '/log-in';
      return;
    }
    if (status == 2) {
      err = 'You must return borrowed vehicles to add another booking';

      toastr.error('Error', err);
      return;
    }
    if (status == 3) {
      err = 'Sorry you are blocked from booking vehicles, Contact us';

      toastr.error('Error', err);
      return;
    }
    if (err === null) {
      const bookingData = {
        user_id: id,
        pickup_location: formValues.address,
        drop_location: formValues.droplocation,
        booking_date: moment(formValues.journeydate).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        return_date: moment(formValues.returndate).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        vehicles: this.props.cars,
        status: 1,
        equipments: this.props.tools
      };

      this.setState({
        booking: bookingData,
        visible: true
      });
    }
  };
  // handleOk = e => {
  //   this.props.createBooking(this.state.booking);
  // };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  render() {
    const { handleSubmit } = this.props;
    const modalTitleCart = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>Cart</span>
        <span
          class='badge badge-secondary badge-pill'
          style={{ marginRight: 35 }}
        >
          <i className='fa fa-shopping-cart'></i>
        </span>
      </h4>
    );
    return (
      <form
        className='trip-form hvr-glow'
        onSubmit={handleSubmit(this.onSubmit)}
        style={{ zIndex: 4 }}
      >
        <div className='row align-items-center mb-4'>
          <div className='col-md-6'>
            <h3 className='m-0 '>Begin your trip here</h3>
          </div>
          <div className='col-md-6 text-md-right'>
            <span className='text-primary' style={{ paddingRight: 4 }}>
              {this.props.cars.length}
            </span>
            <span style={{ paddingRight: 10 }}>vehicles selected</span>

            <span className='text-primary'>{this.props.tools.length}</span>
            <span style={{ paddingLeft: 4 }}>equipments selected</span>
          </div>
        </div>
        <div className='row'>
          <Field
            name='address'
            type='text'
            component={this.renderField}
            label='Where you from'
            placeholder='Your pickup address'
          />
          <Field
            name='droplocation'
            type='text'
            component={this.renderField}
            label='Where you go'
            placeholder='Your drop-off address'
          />

          <Field
            name='journeydate'
            component={this.renderDatePicker}
            label='Journey date'
          />
          <Field
            name='returndate'
            component={this.renderDatePicker}
            label='Return date'
          />
        </div>
        <div className='row'>
          <div className='col-lg-6'>
            <input
              type='submit'
              value='Submit'
              className='btn btn-primary hvr-grow'
            />
          </div>
          <Modal
            title={modalTitleCart}
            visible={this.state.visible}
            // onOk={this.handleOk}
            footer={false}
            onCancel={this.handleCancel}
          >
            <Cart
              vehicles={this.props.cars}
              equipments={this.props.tools}
              bookingData={this.state.booking}
            />
          </Modal>
        </div>
      </form>
    );
  }
}
const validate = values => {
  const errors = {};

  if (values.journeydate > values.returndate) {
    // toastr.error('Error', 'Date should be a future date');
    errors.returndate =
      'Return date should be with in minimum 5 hours and maximum 2 weeks';
  }

  let _bookingdate = moment(values.journeydate).format('YYYY-MM-DD HH:mm:ss');
  let _returndate = moment(values.returndate).format('YYYY-MM-DD HH:mm:ss');

  const differenceInHours = moment(_returndate).diff(_bookingdate, 'hours');

  if (differenceInHours > 336) {
    errors.returndate = 'Return date should be with in maximum 2 weeks';
  }

  // let minHours = moment(_bookingdate)
  //   .add(5, 'hours')
  //   .format('YYYY-MM-DD HH:mm:ss');
  // if (_returndate < minHours) {
  //   errors.returndate = 'Return date should be with in minimum 5 hours ';
  // }

  if (!values.address) {
    errors.address = 'Required';
  }
  if (!values.droplocation) {
    errors.droplocation = 'Required';
  }

  return errors;
};

const mapStateToProps = state => {
  return { bookings: state.bookings };
};
export default connect(mapStateToProps, { createBooking })(
  reduxForm({
    form: 'VehicleRentForm',
    validate
  })(VehicleRentForm)
);
