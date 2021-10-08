import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='site-footer' style={{ maxHeight: '490px' }}>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-3'>
            <h2 className='footer-heading mb-4'>Janahitha Tours</h2>
            <p>
              Discover why many of customers depend on Janahitha Tours for
              their rent each year.
            </p>
          </div>
          <div className='col-lg-8 ml-auto'>
            <div className='row'>
              <div className='col-lg-3'>
                <h2 className='footer-heading mb-4'>About us</h2>
                <ul className='list-unstyled'>
                  <li>
                    <Link to='/about-us'>About Us</Link>
                  </li>
                </ul>
              </div>
              <div className='col-lg-3'>
                <h2 className='footer-heading mb-4'>Our vehicles</h2>
                <ul className='list-unstyled'>
                  <li>
                    <Link to='/cars'>Our vehicles</Link>
                  </li>
                </ul>
              </div>
              <div className='col-lg-3'>
                <h2 className='footer-heading mb-4'>Our equipments</h2>
                <ul className='list-unstyled'>
                  <li>
                    <Link to='/equipments'>Our equipments</Link>
                  </li>
                </ul>
              </div>
              <div className='col-lg-3'>
                <h2 className='footer-heading mb-4'>Contact us</h2>
                <ul className='list-unstyled'>
                  <li>
                    <Link to='/contact-us'>Contact us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='row pt-5 mt-5 text-center'>
          <div className='col-md-12'>
            <div className='border-top pt-5'>
              <p>
                Copyright &copy;
                <script>document.write(new Date().getFullYear());</script> All
                rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
