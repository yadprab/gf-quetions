// Bad: Inconsistent function patterns, redundant code, no TypeScript

// Format date - multiple similar functions
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

const formatDate2 = (date) => {
  const d = new Date(date);
  return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
};

// Format currency - inconsistent parameter order and style
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}


// Global variable - bad practice
window.formatSettings = {
  decimalPlaces: 2,
  thousandSeparator: ','
};

// Mutates input - side effect
const formatName = (user) => {
  user.fullName = `${user.firstName} ${user.lastName}`;
  return user;
};


export { formatDate, formatDate2, formatCurrency };

// Adding to window object - pollutes global namespace
window.formatUtils = {
  formatDate: formatDate2,
  formatCurrency: formatCurrency
};
