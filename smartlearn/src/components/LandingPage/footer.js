import React, { useState, useEffect } from 'react';
import './footer.css';

import { Link } from 'react-router-dom';

import FacebookOutlinedIcon from '@mui/icons-material/Facebook';
import TwitterOutlinedIcon from '@mui/icons-material/Twitter';
import LinkedInOutlinedIcon from '@mui/icons-material/LinkedIn';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOn';
import PhoneOutlinedIcon from '@mui/icons-material/Phone';
import EmailOutlinedIcon from '@mui/icons-material/Email';

function Footer() {
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
    <footer className="footer-distributed">
      <div className="footer-left">
        <img src={websiteData.logo} alt='meow'/>
        <p className="footer-links">
          <Link to="" className="link-1">Home</Link>
          <Link to="courses">Courses</Link>
          <Link to="artist">Artist</Link>
          <Link to="contact">Contact</Link>
          <Link to="aboutUs">About Us</Link>
        </p>
        <p className="footer-company-name">{websiteData.company_name} © 2023</p>
      </div>

      <div className="footer-center">
        <div>
          <LocationOnOutlinedIcon />
          <p><span>{websiteData.physical_address}</span></p>
        </div>
        <div>
          <PhoneOutlinedIcon />
          <p>{websiteData.phone_number}</p>
        </div>
        <div>
          <EmailOutlinedIcon />
          <p><a href={`mailto:${websiteData.email_address}`}>{websiteData.email_address}</a></p>
        </div>
      </div>

      <div className="footer-right">
        <p className="footer-company-about">
          <span>About the company</span>
          {websiteData.about_us}
        </p>
        <div className="footer-icons">
          <a href={websiteData.facebook_url}><FacebookOutlinedIcon /></a>
          <a href={websiteData.instagram_url}><TwitterOutlinedIcon /></a>
          <a href={websiteData.linkedin_url}><LinkedInOutlinedIcon /></a>
          {/* <a href={websiteData.github_url}><GitHubOutlinedIcon /></a> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
