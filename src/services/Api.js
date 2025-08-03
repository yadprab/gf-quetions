// Bad Practice: Global state, no error handling, mixed concerns
let authToken = '';

// Inconsistent function naming
const setToken = (token) => {
  authToken = token;
  localStorage.setItem('token', token);
};

// No base URL, hardcoded endpoints
const fetchCustomers = async () => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/customers`, {
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

// Comment API functions
const fetchComments = async (invoiceId) => {
  const response = await fetch(`http://localhost:3001/comments?invoiceId=${invoiceId}`);
  return await response.json();
};

const addComment = async (invoiceId, commentText) => {
  const response = await fetch(`http://localhost:3001/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      invoiceId: invoiceId,
      author: "Current User",
      text: commentText,
      timestamp: new Date().toISOString()
    })
  });
  return await response.json();
};

export {
  fetchCustomers,
  updateCustomer,
  login,
  setToken,
  fetchComments,
  addComment
};
