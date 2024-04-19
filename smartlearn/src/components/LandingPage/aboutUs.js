import React, { useState, useEffect } from 'react';
import "./aboutUs.css"
// function AboutUs() {
//   const [websiteData, setWebsiteData] = useState({});

//   useEffect(() => {
//     fetchWebsiteData(); // Fetch website data when the component mounts
//   }, []);

//   const fetchWebsiteData = () => {
//     fetch('http://localhost:3001/website')
//       .then((response) => response.json())
//       .then((data) => {
//         setWebsiteData(data);
//         console.log(data);
//       })
//       .catch((error) => {
//         console.error('Error fetching website data:', error);
//       });
//   };
//   return (
//     <div>{websiteData.about_us}</div>
//   )
// }

// export default AboutUs


const AboutUs = () => {
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
    <div className="about-us">
      <div className="about-us-content">
        <h2 className="title">About Us</h2>
        <p className="description">
          Welcome to our company! We are a team of dedicated professionals who are passionate about providing high-quality products and exceptional customer service.
        </p>
        <p className="description">
          With years of experience in the industry, we have built a strong reputation for delivering stylish and fashionable items that meet the evolving needs of our discerning customers.
        </p>
        <p className="description">
          Our mission is to inspire confidence and empower individuals through our carefully curated collections. We believe that fashion is not just about clothing; it's a form of self-expression that allows people to showcase their unique personality and style.
        </p>
        <p className="description">
          At our company, we strive to stay ahead of the latest trends and source the finest materials to create fashion-forward pieces that make a statement. Our commitment to quality craftsmanship ensures that each item is meticulously crafted to perfection.
        </p>
        <p className="description">
          We value our customers and aim to provide an exceptional shopping experience. Whether you're looking for a standout ensemble for a special occasion or everyday essentials that exude sophistication, we have you covered.
        </p>
        <p className="description">
          Thank you for choosing our brand. We look forward to serving you and helping you embrace your personal style with confidence and flair.
        </p>
      </div>
      {/* <div className="about-us-image">
        <img src="about-us-image.jpg" alt="Company Team" />
      </div> */}
      {/* {websiteData.about_us} */}
    </div>
  );
};

export default AboutUs;
