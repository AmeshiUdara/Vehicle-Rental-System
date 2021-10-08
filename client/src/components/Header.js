import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import 'antd/dist/antd.css';

import header from '../assets/images/header.png';
import Cart from './views/Cart';
import BookingList from './lists/BookingList';
import LateReturnList from './lists/LateReturnList';
import { Badge } from 'antd';
import ExtendBookingList from './lists/ExtendBookingList';
import UserEditForm from './forms/UserEditForm';

export class Header extends Component {
  state = {
    visible: false,
    visibleLate: false,
    visibleExtend: false,
    visibleEdit: false,
    isLoggedin: false,
    username: null,
    isAdmin: false,
    isNewCustomer: true,
    user: {}
  };

  componentDidMount() {
    this.handleUserLogin();
    this.setUserDetails();
  }

  //get specific details to send to the edit form ps: delete if necessary
  setUserDetails = () => {
    if (localStorage.getItem('token') !== null) {
      const decodedToken = jwt_decode(localStorage.getItem('token'));

      let user = {
        fullname: decodedToken.user.fullname,
        contact: decodedToken.user.contact
      };
      this.setState({
        user
      });
    }
  };

  handleUserLogin = () => {
    let token = localStorage.getItem('token');
    if (token !== null) {
      this.setState({
        isLoggedin: true
      });
      let user = jwt_decode(token);
      if (user) {
        this.setState({ username: user.user.email });
        if (user.user.role === 'admin') {
          this.setState({
            isAdmin: true
          });
        }
        if (user.user.isnew === 0) {
          this.setState({
            isNewCustomer: false
          });
        }
        if (user.user.isnew === 1) {
          this.setState({
            isNewCustomer: true
          });
        }
      }
    }
  };

  handleSignout = e => {
    e.preventDefault();
    localStorage.clear();

    window.location.href = '/';
  };

  showLateModal = () => {
    this.setState({
      visibleLate: true
    });
  };

  handleLateCancel = e => {
    this.setState({
      visibleLate: false
    });
  };
  showExtendModal = () => {
    this.setState({
      visibleExtend: true
    });
  };
  showEditModal = () => {
    this.setState({
      visibleEdit: true
    });
  };
  handleEditCancel = e => {
    this.setState({
      visibleEdit: false
    });
  };

  handleExtendCancel = e => {
    this.setState({
      visibleExtend: false
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    let modalLateTitle;
    if (this.state.isNewCustomer) {
      modalLateTitle = (
        <Fragment>
          <h4 class='d-flex justify-content-between align-items-center mb-3'>
            <span class='text-muted'>Late returns</span>
          </h4>
          <small class='text-muted' color='red'>
            *You are still not elligable for this offer please contact
            <span
              className='badge badge-warning'
              style={{ marginLeft: 2, marginRight: 2 }}
            >
              admin
            </span>
            to return the vehicle .
          </small>
        </Fragment>
      );
    } else {
      modalLateTitle = (
        <Fragment>
          <h4 class='d-flex justify-content-between align-items-center mb-3'>
            <span class='text-muted'>Late returns</span>
          </h4>
        </Fragment>
      );
    }

    const modalTitle = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>My Bookings</span>
      </h4>
    );
    const modalEditTitle = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>Edit account</span>
      </h4>
    );
    const modalExtendTitle = (
      <Fragment>
        <h4 class='d-flex justify-content-between align-items-center mb-3'>
          <span class='text-muted'>Extend a booking</span>
        </h4>

        <small class='text-muted' color='red'>
          *You can only extend the return time untill{' '}
          <span className='badge badge-danger'>4.00 pm</span> of the returning
          date
        </small>
      </Fragment>
    );
    return (
      <Fragment>
        <div className='site-mobile-menu site-navbar-target'>
          <div className='site-mobile-menu-header'>
            <div className='site-mobile-menu-close mt-3'>
              <span className='icon-close2 js-menu-toggle'></span>
            </div>
          </div>
          <div className='site-mobile-menu-body'></div>
        </div>

        <header className='site-navbar site-navbar-target' role='banner'>
          <div className='container'>
            <div className='row align-items-center position-relative'>
              <div className='col-3 '>
                <div className='site-logo cssanimation electricity infinte'>
                  <Link to='/'>
                    <img src={header} />
                  </Link>
                </div>
              </div>

              <div className='col-9  text-right'>
                <span className='d-inline-block d-lg-none'>
                  <a
                    href='#'
                    className='text-white site-menu-toggle js-menu-toggle py-5 text-white'
                  >
                    <span className='icon-menu h3 text-white'></span>
                  </a>
                </span>

                <nav
                  className='site-navigation text-right ml-auto d-none d-lg-block'
                  role='navigation'
                >
                  <ul className='site-menu main-menu js-clone-nav ml-auto '>
                    <li>
                      <Link
                        to='/'
                        className='nav-link hvr-pulse-grow '
                        style={{ fontSize: 20 }}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to='/cars'
                        className='nav-link hvr-pulse-grow '
                        style={{ fontSize: 20 }}
                      >
                        Cars
                      </Link>
                    </li>
                    <li>
                      <Link
                        to='/equipments'
                        className='nav-link hvr-pulse-grow '
                        style={{ fontSize: 20 }}
                      >
                        Equipments
                      </Link>
                    </li>
                    {this.state.isAdmin ? null : (
                      <li>
                        <Link
                          to='about-us'
                          className='nav-link hvr-pulse-grow '
                          style={{ fontSize: 20 }}
                        >
                          About
                        </Link>
                      </li>
                    )}

                    <li>
                      <Link
                        to='contact-us'
                        className='nav-link hvr-pulse-grow '
                        style={{ fontSize: 20 }}
                      >
                        Contact
                      </Link>
                    </li>
                    {this.state.isLoggedin && !this.state.isAdmin ? (
                      <li>
                        <div className='dropdown '>
                          <button
                            className='btn btn-secondary dropdown-toggle '
                            type='button'
                            id='dropdownMenuButton'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                            style={{
                              backgroundColor: 'transparent',
                              borderColor: 'transparent',
                              fontSize: 20
                            }}
                          >
                            Bookings
                          </button>

                          <div
                            className='dropdown-menu'
                            aria-labelledby='dropdownMenuButton'
                          >
                            <div>
                              <a
                                className='dropdown-item'
                                onClick={this.showModal}
                              >
                                My Bookings
                              </a>
                              <Modal
                                title={modalTitle}
                                visible={this.state.visible}
                                onOk={this.handleCancel}
                                onCancel={this.handleCancel}
                                okText='Ok'
                                width='max-content'
                              >
                                <BookingList />
                              </Modal>
                            </div>

                            <div>
                              <a
                                className='dropdown-item'
                                onClick={this.showLateModal}
                              >
                                Late Returns
                              </a>
                              <Modal
                                title={modalLateTitle}
                                visible={this.state.visibleLate}
                                onOk={this.handleLateCancel}
                                onCancel={this.handleLateCancel}
                                okText='Ok'
                                width='max-content'
                              >
                                <LateReturnList />
                              </Modal>
                            </div>

                            <div>
                              <a
                                className='dropdown-item'
                                onClick={this.showExtendModal}
                              >
                                Extend a booking
                              </a>
                              <Modal
                                title={modalExtendTitle}
                                visible={this.state.visibleExtend}
                                onOk={this.handleExtendCancel}
                                onCancel={this.handleExtendCancel}
                                footer={false}
                                okText='Ok'
                                width='max-content'
                              >
                                <ExtendBookingList />
                              </Modal>
                            </div>
                          </div>
                        </div>
                      </li>
                    ) : null}

                    <li>
                      <div className='dropdown'>
                        <button
                          className='btn btn-secondary dropdown-toggle'
                          type='button'
                          id='dropdownMenuButton'
                          data-toggle='dropdown'
                          aria-haspopup='true'
                          aria-expanded='false'
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent'
                          }}
                        >
                          <i className='fa fa-user fa-lg'></i>
                          <small style={{ marginLeft: 10 }}>
                            {this.state.username}
                          </small>
                        </button>
                        <div
                          className='dropdown-menu'
                          aria-labelledby='dropdownMenuButton'
                        >
                          {this.state.isLoggedin ? (
                            <Fragment>
                              <a
                                className='dropdown-item'
                                onClick={this.showEditModal}
                              >
                                Edit account
                              </a>

                              <Modal
                                title={modalEditTitle}
                                visible={this.state.visibleEdit}
                                onOk={this.handleEditCancel}
                                onCancel={this.handleEditCancel}
                                okText='Ok'
                                footer={false}
                              >
                                <UserEditForm initialValues={this.state.user} />
                              </Modal>

                              <Link
                                className='dropdown-item'
                                onClick={this.handleSignout}
                              >
                                Log out
                              </Link>
                            </Fragment>
                          ) : (
                            <Link className='dropdown-item' to='/log-in'>
                              Log In
                            </Link>
                          )}
                          {/* <Link className='dropdown-item'>
                            {this.state.username}
                          </Link> */}
                        </div>
                      </div>
                    </li>
                    {this.state.isAdmin ? (
                      <li>
                        <Link
                          to='/admin-dashboard'
                          className='nav-link hvr-pulse-grow '
                          style={{ fontSize: 20 }}
                        >
                          <i className='fa fa-tachometer fa-2x'></i>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { security: state.security };
};

export default connect(mapStateToProps)(Header);
