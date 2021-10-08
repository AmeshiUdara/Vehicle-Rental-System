import React from 'react';
import person_1 from '../assets/images/person_1.jpeg';
import person_2 from '../assets/images/person_6.jpg';
import person_3 from '../assets/images/person_3.jpg';

import hero_2 from '../assets/images/hero_2.jpg';
import { BackTop } from 'antd';
const About = () => {
  return (
    <div class='site-wrap' id='home-section'>
      <BackTop />

      <div class='ftco-blocks-cover-1'>
        <div
          class='ftco-cover-1 overlay innerpage'
          style={{ backgroundImage: `url(${hero_2})` }}
        >
          <div class='container'>
            <div class='row align-items-center justify-content-center'>
              <div class='col-lg-6 text-center'>
                <h1>About Us</h1>
                <p>
                  Our services are tailor-made to meet any type of
                  transportation service you require.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class='site-section'>
        <div class='container'>
          <div class='row '>
            <div class='col-lg-6 mb-5 mb-lg-0 order-lg-2 hvr-rotate'>
              <img src={hero_2} alt='Image' class='img-fluid' />
            </div>
            <div class='col-lg-4 mr-auto hvr-forward'>
              <h2>Janahitha Tours</h2>
              <p>
                With over 15 years of industry experience, we aim to deliver the
                highest level of customer satisfaction and a highly personalized
                satisfaction to all of our customers looking for vehicle rental
                opportunities in Sri Lanka.
              </p>
              <p>
                With one of Sri Lanka's largest and most modern and diverse
                fleets, our service is backed by a networked front office.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class='site-section bg-light'>
        <div class='container'>
          <div class='row justify-content-center text-center mb-5 section-2-title'>
            <div class='col-md-6'>
              <h2 class='mb-4'>Meet Our Team</h2>
              <p>
                We're your squad. You need the best people to push your dream
                forward when your goal is to be stronger, quicker and cleverer.
              </p>
            </div>
          </div>
          <div class='row align-items-stretch'>
            <div
              class='col-lg-4 col-md-6 mb-5 hvr-grow'
              style={{ cursor: 'pointer' }}
            >
              <div class='post-entry-1 h-100 person-1'>
                <img src={person_1} alt='Image' class='img-fluid' />

                <div class='post-entry-1-contents '>
                  <span class='meta'>Founder & CEO</span>
                  <h2>Tharinda Kithulgoda</h2>
                  <p>
                  We believe in providing you with excellent and personalized customer service at low prices, 
                  yet high quality standards.Besides, we dedicate out time to make sure you have a fleet of a 
                  variety of modern cars at your disposal.

                  </p>
                </div>
              </div>
            </div>
            <div
              class='col-lg-4 col-md-6 mb-5 hvr-grow'
              style={{ cursor: 'pointer' }}
            >
              <div class='post-entry-1 h-100 person-1'>
                <img src={person_2} alt='Image' class='img-fluid' />

                <div class='post-entry-1-contents'>
                  <span class='meta'>Founder & COO</span>
                  <h2>Angelo Perera</h2>
                  <p>
                  Janahitha Tours is a founder member of the Rent A Car Association (RACA) Sri Lanka, recognised by the Automobile
                   Association (AA) of Sri Lanka and is a Sri Lanka Tourist Board approved transport provider.

                  </p>
                </div>
              </div>
            </div>

            <div
              class='col-lg-4 col-md-6 mb-5 hvr-grow'
              style={{ cursor: 'pointer' }}
            >
              <div class='post-entry-1 h-100 person-1'>
                <img src={person_3} alt='Image' class='img-fluid' />

                <div class='post-entry-1-contents'>
                  <span class='meta'>Sales Manager</span>
                  <h2>Jenny Fernando</h2>
                  <p>
                  We take pride in being able to offer the highest levels of service in the industry with
                  our service guarantee offering a replacement vehicle and driver in case of an 
                  emergency anywhere in Sri Lanka 24 hours a day, 7 days a week.

                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class='site-section'>
        <div class='container'>
          <div class='row'>
            <div class='col-lg-6 mb-5 mb-lg-0 hvr-rotate'>
              <img src={hero_2} alt='Image' class='img-fluid' />
            </div>
            <div class='col-lg-4 ml-auto hvr-backward'>
              <h2>Our History</h2>
              <p>
                Janahitha Tours is much more than just a vehicle rental company. We are
                a business that prides itself as being dedicated to the growing
                needs of people by providing a wide range of vehicles and
                services. We boast a rich history of significant first moves,
                bold ideas and creativity that has transformed our business into
                today's reputable brand.
              </p>
              <p>
                Discover why many of customers depend on Janahitha Tours for
                their rent each year.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class='container site-section mb-5'>
        <div class='row justify-content-center text-center'>
          <div class='col-7 text-center mb-5'>
            <h2>How it works</h2>
            <p>
              Janahitha Tours offers a very quick booking process where you can get
              the vehicle from the click of a button!
            </p>
          </div>
        </div>
        <div class='how-it-works d-flex cssanimation hu__hu__ '>
          <div class='step'>
            <span class='number'>
              <span>01</span>
            </span>
            <span class='caption'>Time &amp; Place</span>
          </div>
          <div class='step'>
            <span class='number'>
              <span>02</span>
            </span>
            <span class='caption'>Car & Equipments</span>
          </div>
          <div class='step'>
            <span class='number'>
              <span>03</span>
            </span>
            <span class='caption'>Details</span>
          </div>
          <div class='step'>
            <span class='number'>
              <span>04</span>
            </span>
            <span class='caption'>Checkout</span>
          </div>
          <div class='step'>
            <span class='number'>
              <span>05</span>
            </span>
            <span class='caption'>Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
