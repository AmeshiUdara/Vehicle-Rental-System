import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sendMessage } from '../actions/messages';
import hero_2 from '../assets/images/hero_2.jpg';
import ContactUsForm from './forms/ContactUsForm';
import { BackTop } from 'antd';

export class ContactUs extends Component {
  onContact = (formValues) => {
    Object.assign(formValues, { status: 1 });

    this.props.sendMessage(formValues);
  };

  render() {
    return (
      <div className='site-wrap' id='home-section'>
        <BackTop />
        <div className='ftco-blocks-cover-1'>
          <div
            className='ftco-cover-1 overlay innerpage'
            style={{ backgroundImage: `url(${hero_2})` }}
          >
            <div className='container'>
              <div className='row align-items-center justify-content-center'>
                <div className='col-lg-6 text-center'>
                  <h1>Contact Us</h1>
                  <p>Say Hi! Keep in touch with us</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='site-section bg-light' id='contact-section'>
          <div className='container'>
            <div className='row justify-content-center text-center'>
              <div className='col-7 text-center mb-5'>
                <h2>Contact Us Or Use This Form To Rent A Car</h2>
                <p>
                When wanting to reserve car rentals in Sri Lanka through Janahitha Tours do 
                take note of the contact details mentioned below.

                </p>
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-8 mb-5'>
                <ContactUsForm onSubmit={this.onContact} />
              </div>
              <div className='col-lg-4 ml-auto hvr-forward'>
                <div className='bg-white p-3 p-md-5'>
                  <h3 className='text-black mb-4'>Contact Info</h3>
                  <ul className='list-unstyled footer-link'>
                    <li className='d-block mb-3'>
                      <span className='d-block text-black'>Address:</span>
                      <span>Thalagaha junction, Akmimana, Galle</span>
                    </li>
                    <li className='d-block mb-3'>
                      <span className='d-block text-black'>Phone:</span>
                      <span>075 637 1182 </span>
                    </li>
                    <li className='d-block mb-3'>
                      <span className='d-block text-black'>Email:</span>
                      <span>janahithatours@gmail.com</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { sendMessage })(ContactUs);
