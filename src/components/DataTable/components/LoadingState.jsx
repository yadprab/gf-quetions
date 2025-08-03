import React from 'react';

export const LoadingState = ({ entityName }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '300px' 
    }}>
      <div>Loading {entityName}s...</div>
    </div>
  );
};

export default LoadingState;