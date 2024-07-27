// RollingButton.js

import React from 'react';
import './load.css';

const RollingButton = ({ loading }) => {
  return (
    <div className={`rolling-button ${loading ? 'show' : 'hide'}`}>
      <div className="overlay"></div>
      <div className="spinner"></div>
      <div className="text">Loading...</div>
    </div>
  );
};

export default RollingButton;