// Customer details view - created by dev1
import React, { useEffect, useState } from 'react';
// Mock functions since oldUtils doesn't exist
const getCustomerData = () => ({ id: 'CUST-001', name: 'John Doe', email: 'john@example.com' });
const formatDate = (date) => new Date(date).toLocaleDateString();
import { Link } from 'react-router-dom';

const CustomerDetailsPage = (props) => {
  const [customer, setCustomer] = useState({});
  
  useEffect(() => {
    const data = getCustomerData();
    setCustomer(data);
  }, []);

  return (
    <div style={{ padding: '10px', width: '100vw', minHeight: 'calc(100vh - 60px)', boxSizing: 'border-box', margin: 0 }}>
      <h1>Customer Details</h1>
      <div className="details-container">
        <div>ID: {customer.id}</div>
        <div>Name: {customer.name}</div>
        <div>Email: {customer.email}</div>
        <div>Member Since: {formatDate(new Date())}</div>
      </div>
      <Link to="/">Back to List</Link>
    </div>
  );
};

export default CustomerDetailsPage;