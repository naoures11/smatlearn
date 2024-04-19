import React from 'react';
import  "./PannelItem.css";
function PannelItem({ icon, name , onClick,isSelected}) {
  return (
    <div  className={`pannel-item ${isSelected ? 'selected' : ''}`} onClick={onClick} >
      <div className='pannel-item-icon'>{icon}</div>
      <div className='pannel-item-name'>{name}</div>
    </div>
  );
}

export default PannelItem;
