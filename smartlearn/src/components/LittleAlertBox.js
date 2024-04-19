import React, { useState, useEffect } from 'react';
import './LittleAlertBox.css';


import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
function LittleAlertBox({ message, isSuccess }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    setIsVisible(false);
  };

  const alertClass = isSuccess ? 'Alert-box success' : 'Alert-box error';

  return (
    <div className={`Alert-box ${alertClass} ${isVisible ? 'visible' : ''}`}>
<div className="icon" onClick={() => setIsVisible(false)}>
  <CancelOutlinedIcon />
</div>

      <div className="message">{message}</div>

    </div>
  );
}

export default LittleAlertBox;
