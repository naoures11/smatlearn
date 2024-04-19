

import React, { useState, useEffect } from 'react';
import './contact.css'; // Import the CSS file for styling



import FacebookOutlinedIcon from '@mui/icons-material/Facebook';
import TwitterOutlinedIcon from '@mui/icons-material/Twitter';
import LinkedInOutlinedIcon from '@mui/icons-material/LinkedIn';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOn';
import PhoneOutlinedIcon from '@mui/icons-material/Phone';
import EmailOutlinedIcon from '@mui/icons-material/Email';
const Contact = () => {


    const [websiteData, setWebsiteData] = useState({});

  useEffect(() => {
    fetchWebsiteData(); // Fetch website data when the component mounts
  }, []);

  const fetchWebsiteData = () => {
    fetch('http://localhost:3001/website')
      .then((response) => response.json())
      .then((data) => {
        setWebsiteData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching website data:', error);
      });
  };

  return (
    <div className="contact">
      <h2 className="title">Contact Us</h2>
      <div className="contact-info">
        <div className="contact-details">
          <h3 className="subtitle">Get in Touch</h3>
          <p className="description">We would love to hear from you. Feel free to reach out to us with any questions, comments, or feedback.</p>
          <ul className="contact-list">
            <li className="contact-item">
              <span className="icon">   <LocationOnOutlinedIcon /></span>
              <span className="info">{websiteData.physical_address}</span>
            </li>
            <li className="contact-item">
              <span className="icon"><EmailOutlinedIcon/></span>
              <span className="info">{websiteData.email_address}</span>
            </li>
            <li className="contact-item">
              <span className="icon"><PhoneOutlinedIcon/></span>
              <span className="info">{websiteData.phone_number}</span>
            </li>
          </ul>
        </div>
        <form className="contact-form">
          <h3 className="subtitle">Send us a Message</h3>
          <div className="form-group">
            <input type="text" name="name" placeholder="Your Name" />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Your Email" />
          </div>
          <div className="form-group">
            <textarea name="message" placeholder="Your Message"></textarea>
          </div>
          <div className="form-group">
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
