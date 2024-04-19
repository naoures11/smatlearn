import React, { useState, useEffect } from 'react';
import './ManageWebsite.css'
function ManageWebsite() {
  const [websiteData, setWebsiteData] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');

  useEffect(() => {
    fetchWebsiteData(); // Fetch website data when the component mounts
  }, []);

  const fetchWebsiteData = () => {
    fetch('http://localhost:3001/website')
      .then((response) => response.json())
      .then((data) => {
        setWebsiteData(data);
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching website data:', error);
      });
  };

  const handleFieldClick = (field) => {
    setCurrentField(field);
    setPopupVisible(true);
  };

  const handlePopupSave = () => {
    setPopupVisible(false);
    const updatedData = {
      ...websiteData,
      [currentField]: websiteData[currentField], // Fix this line
    };

    fetch('http://localhost:3001/website', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          console.log(`${currentField} updated successfully`);
          setWebsiteData(updatedData); // Update the websiteData state with the updated value
        } else {
          console.log(`Error updating ${currentField}`);
        }
      })
      .catch((error) => {
        console.error(`Error updating ${currentField}:`, error);
      });
  };

  const handlePopupCancel = () => {
    setPopupVisible(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWebsiteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


return (
  <div className="ManageWebsite">
    <h2>Manage Website Data</h2>

    <div className="button-container">
    <button onClick={() => handleFieldClick('logo')}>Edit Website Logo</button>
      <button onClick={() => handleFieldClick('header_text')}>Edit Header Text</button>
      <button onClick={() => handleFieldClick('features_text')}>Edit key Features text</button>

      <button onClick={() => handleFieldClick('company_name')}>Edit company Name</button>
      <button onClick={() => handleFieldClick('about_us')}>Edit About Us</button>
      <button onClick={() => handleFieldClick('about_realizer')}>Edit About Realizer</button>
      <button onClick={() => handleFieldClick('terms_and_conditions')}>Edit Terms and Conditions</button>
      <button onClick={() => handleFieldClick('privacy_policy')}>Edit Privacy Policy</button>
      <button onClick={() => handleFieldClick('phone_number')}>Edit Phone Number</button>
      <button onClick={() => handleFieldClick('email_address')}>Edit Email Address</button>
      <button onClick={() => handleFieldClick('physical_address')}>Edit Physical Address</button>
      <button onClick={() => handleFieldClick('facebook_url')}>Edit Facebook URL</button>
      <button onClick={() => handleFieldClick('instagram_url')}>Edit Instagram URL</button>
      <button onClick={() => handleFieldClick('linkedin_url')}>Edit LinkedIn URL</button>
    </div>

    {popupVisible && (
       <div className='popup-container-add-course'>
       <div className='popup-overlay'></div>
       <div className='popup-content'>
          <h3>Edit {currentField}</h3>
          <textarea
            name={currentField}
            value={websiteData[currentField] || ''}
            onChange={handleInputChange}
          ></textarea>
            <div className='popup-footer'>
            <div onClick={handlePopupSave} className='update-btn btn btn-success' >Save</div>
            <div onClick={handlePopupCancel}  className='cancel-btn btn btn-danger'>Cancel</div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}


export default ManageWebsite;
