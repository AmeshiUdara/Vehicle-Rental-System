import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { userSignIn } from '../../actions';
import history from '../../history';
import _ from 'lodash';
export class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      err: ''
    };
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      history.push('/');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.errmsgs !== prevProps.errmsgs) {
      this.setState({ err: 'Invalid credentials' });
    }
  }
  renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
    return (
      <div className='col'>
        <label>{label}</label>

        <input
          {...input}
          type={type}
          className='form-control'
          autoComplete='off'
          style={{ width: '100%', height: 35 }}
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
  onSubmit = formValues => {
    this.props.userSignIn(formValues);
  };
  render() {
    const { handleSubmit } = this.props;
    let errDisplay;
    if (this.state.err) {
      errDisplay = (
        <span className='form-text text-muted' style={{ marginLeft: 20 }}>
          <small style={{ color: 'red' }}>{this.state.err}</small>
        </span>
      );
    } else {
      errDisplay = null;
    }

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className='text-center'>
          <h1>Sign In</h1>
          <p className='text-muted'>Sign in to your account</p>
        </div>

        <Field
          name='email'
          type='email'
          component={this.renderField}
          label='Email'
          class='form-row'
        />

        <Field
          name='password'
          type='password'
          component={this.renderField}
          label='Password'
          class='form-row'
        />
        {errDisplay}
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
          Sign In
        </button>
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
  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

const mapStateToProps = state => {
  return {
    errmsgs: state.errmsgs
  };
};

export default connect(mapStateToProps, { userSignIn })(
  reduxForm({
    form: 'LoginForm',
    validate
  })(LoginForm)
);
