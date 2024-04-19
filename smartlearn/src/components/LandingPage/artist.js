import React, { useState, useEffect } from 'react';
import './artist.css'
function Artist() {
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
    <div className='artist'>
      <h1>Artist</h1>
      <p>
      {websiteData.about_realizer}
      </p>
      </div>
  )
}
export default Artist
