export const validateCustomer = (customer: { name: string; email?: string }): true | string[] => {
  const errors: string[] = [];
  
  if (!customer.name) {
    errors.push('Name is required');
  }
  
  if (customer.email && !customer.email.includes('@')) {
    errors.push('Invalid email format');
  }
  
  return errors.length === 0 ? true : errors;
};
