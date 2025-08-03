// This file contains various utility functions (some might be deprecated)
import { validateCustomer } from '../validation';

export const getCustomerData = () => {
  // This should be an API call but we're hardcoding for now
  return {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john@example.com'
  };
};


// Removed formatDate - use formatDate from formatting.js instead

// Removed calculateTotalAmount - use calculateTotalAmount from validation.js instead
