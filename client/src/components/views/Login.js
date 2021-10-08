import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { BackTop } from 'antd';

// import { userSignUp, userSignIn } from '../../actions';
import backgroundImage from '../../assets/images/bg2.jpg';
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';

const containerStyles = {
  backgroundColor: 'rgb(223,224,224)',
  maxHeight: 750,
  marginTop: 120,
  marginRight: 85,
  opacity: '0.9',
  minWidth: 420,
  filter: 'alpha(opacity=50)',
  border: '1px solid rgb(255,255,255)',
  borderRadius: ' 5px',
  padding: 20
};

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1'
    };

    this.toggleTab = this.toggleTab.bind(this);
  }

  // onSignIn = formValues => {
  //   console.log(formValues);
  //   this.props.userSignIn(formValues);
  // };

  // onSignUp = formValues => {
  //   this.props.userSignUp(formValues);
  // };

  toggleTab(tab) {
    this.setState({ activeTab: tab });
  }
  render() {
    console.log(this.props.security);

    return (
      <div
        style={{
          background: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        <BackTop />
        <div className='card float-right' style={containerStyles}>
          <div
            className='card-header'
            style={{ borderBottom: '1px solid rgba(0,0,0,0)' }}
          >
            <Nav tabs pills fill style={{ borderBottom: 'none' }}>
              <NavItem>
                <NavLink
                  onClick={() => {
                    this.toggleTab('1');
                  }}
                  style={{ cursor: 'pointer' }}
                  active={this.state.activeTab === '1' ? true : false}
                >
                  Sign In
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => {
                    this.toggleTab('2');
                  }}
                  active={this.state.activeTab === '2' ? true : false}
                  style={{ cursor: 'pointer' }}
                >
                  Sign Up
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId='1'>
              <LoginForm />
            </TabPane>
            <TabPane tabId='2'>
              <SignUpForm />
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}

export default Login;
