// Bad: Inconsistent function patterns, redundant code, no TypeScript

// Format date - multiple similar functions
function formatDate1(date) {
  return new Date(date).toLocaleDateString();
}

const formatDate2 = (date) => {
  const d = new Date(date);
  return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
};

// Format currency - inconsistent parameter order and style
function formatMoney(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Duplicate functionality with different names
const formatCurrency = (currency, amount) => {
  return formatMoney(amount, currency);
};

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

// Inconsistent export style
export {
  formatDate1, // Exposing internal implementation detail
  formatDate2,
  formatMoney,
  formatCurrency // Redundant with formatMoney
};

