// TODO: Refactor this later
import React, { useState } from 'react';
import '../../../styles/customerStyles/card.css';

export const CustomerCard = () => {
  const [data] = useState({
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  return (
    <div className="card">
      <div>Customer ID: {data.id}</div>
      <div>Name: {data.name}</div>
      <div>Email: {data.email}</div>
      <a href="/customer-details">View Details</a>
    </div>
  );
};
