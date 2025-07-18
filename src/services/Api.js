// Bad Practice: Global state, no error handling, mixed concerns
let authToken = '';

// Inconsistent function naming
const setToken = (token) => {
  authToken = token;
  localStorage.setItem('token', token);
};

// No base URL, hardcoded endpoints
const fetchCustomers = async () => {
  const response = await fetch('/api/customers', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  return await response.json();
};

// No error handling, no TypeScript types
const updateCustomer = async (id, data) => {
  const response = await fetch(`/api/customers/${id}`, {
    method: 'POST', // Should be PUT/PATCH
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

// Mixed concerns - this should be in a separate auth service
const login = async (email, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  setToken(data.token);
  return data.user;
};

export {
  fetchCustomers,
  updateCustomer,
  login,
  setToken
};
