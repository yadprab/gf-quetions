// Validation utilities - some functions might be unused

export const validateCustomer = (customer) => {
  
  const errors = [];
  
  if (!customer.name) {
    errors.push('Name is required');
  }
  
  if (customer.email && !customer.email.includes('@')) {
    errors.push('Invalid email format');
  }
  
  return errors.length === 0 ? true : errors;
};

export const calculateTotalAmount = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
