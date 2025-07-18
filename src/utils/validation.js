// Validation utilities - some functions might be unused
import { getCustomerData } from './helpers/oldUtils';

export const validateCustomer = (customer) => {
  // This is a circular dependency
  const existingCustomer = getCustomerData();
  
  const errors = [];
  
  if (!customer.name) {
    errors.push('Name is required');
  }
  
  if (customer.email && !customer.email.includes('@')) {
    errors.push('Invalid email format');
  }
  
  return errors.length === 0 ? true : errors;
};

// This function is similar to one in oldUtils.js
export const calculateTotalAmount = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
