import React from 'react';
import "./PopUp.css"

function Popup({ title, placeholder, value, onChange, onSave, onCancel, onDescriptionChange,DescriptionValue, priceValue, onPriceChange }) {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      onChange(value);
    } else if (name === 'price') {
      onPriceChange(value);
    }
  };

  return (
    <div className='popup-container-add-course'>
      <div className='popup-overlay'></div>
      <div className='popup-content'>
        <h2>{title}</h2>
        <input
          type="text"
          name="name"
          placeholder="Enter Course name"
          value={value}
          onChange={handleInputChange}
        />
        <br/>
   <input
  type="text"
  placeholder="Enter Course price"
  value={priceValue}
  onChange={event => onPriceChange(event.target.value)}
/>
<textarea
  type="text"
  placeholder="Enter Course Description"
  value={DescriptionValue}
  onChange={event => onDescriptionChange(event.target.value)}
/>
        <button className='save-button' onClick={onSave}>Save</button>
        <button className='cancel-button' onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default Popup;
