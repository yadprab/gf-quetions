// Old customer page, don't modify
import React from 'react';
// Mock function since oldUtils doesn't exist
const getCustomerData = () => ({ id: 'CUST-001', name: 'John Doe', email: 'john@example.com' });
import { CustomerCard } from './CustomerCard';

export const CustomerPage = () => {
  return (
    <div className="customer-page" style={{ padding: '10px', width: '100vw', minHeight: 'calc(100vh - 60px)', boxSizing: 'border-box', margin: 0 }}>
      <h1 style={{ marginTop: 0 }}>Customer List</h1>
      <CustomerCard />
    </div>
  );
};

export default CustomerPage;