import React, { useState, useEffect } from 'react';

function Privacy() {
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
    <div>{(websiteData.privacy_policy)  }</div>
  )
}

export default Privacy
