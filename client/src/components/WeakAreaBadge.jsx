import React from 'react';

const WeakAreaBadge = ({ label }) => {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 8px',
      backgroundColor: '#ffebee',
      color: '#c62828',
      fontSize: '12px',
      fontWeight: 'bold',
      borderRadius: '12px',
      border: '1px solid #ffcdd2'
    }}>
      ⚠️ {label}
    </span>
  );
};
export default WeakAreaBadge;
