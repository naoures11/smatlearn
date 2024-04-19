import React from 'react';
import "./popup.css";

function Popup({ onClose }) {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Edit Profile</h2>
        {/* Add your input fields and save button here */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Popup;
