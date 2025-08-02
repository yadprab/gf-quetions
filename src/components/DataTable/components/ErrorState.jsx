import React from 'react';

export const ErrorState = ({ error, fetchData }) => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#fff5f5', 
      color: '#e53e3e',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      {error}
      <button 
        onClick={fetchData}
        style={{
          marginLeft: '10px',
          padding: '5px 10px',
          backgroundColor: '#fff',
          border: '1px solid #e53e3e',
          color: '#e53e3e',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState;