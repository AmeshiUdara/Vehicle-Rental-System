import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export class SideNavigation extends Component {
  render() {
    return (
      <ul
        className='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled'
        id='accordionSidebar'
      >
        <Link
          className='sidebar-brand d-flex align-items-center justify-content-center'
          to='/admin-dashboard'
        >
          <div
            className='sidebar-brand-icon rotate-n-15'
            style={{ textAlign: 'center' }}
          >
            <i className='fa fa-cogs' aria-hidden='true'></i>
          </div>
          <div className='sidebar-brand-text mx-3'>
            Admin <sup>2</sup>
          </div>
        </Link>

        <hr className='sidebar-divider my-0' />

        <li className='nav-item active'>
          <Link className='nav-link' to='/admin-dashboard'>
            <i className='fa fa-dashboard' />
            <span style={{ fontSize: 14 }}>Dashboard</span>
          </Link>
        </li>

        <hr className='sidebar-divider' />

        <li className='nav-item'>
          <Link className='nav-link' to='/admin-user'>
            <i className='fa fa-user fa-3x'></i>
            <span style={{ fontSize: 14 }}>User Management</span>
          </Link>
        </li>

        <li className='nav-item'>
          <Link className='nav-link' to='/admin-vehicle'>
            <i className='fa fa-car'></i>
            <span style={{ fontSize: 14 }}>Vehicle Management</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin-equipment'>
            <i className='fa fa-wrench'></i>
            <span style={{ fontSize: 14 }}>Equipment Management</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/admin-booking'>
            <i className='fa fa-calendar-check-o'></i>
            <span style={{ fontSize: 14 }}>Booking Management</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='admin-price'>
            <i className='fa fa-money'></i>
            <span style={{ fontSize: 14 }}>Price Packages</span>
          </Link>
        </li>
      </ul>
    );
  }
}

export default SideNavigation;
