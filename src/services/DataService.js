const requestQueue = [];
let isProcessing = false;

const fetchData = async (endpoint, options = {}) => {
  const url = `/api/${endpoint.replace(/^\/+/, '')}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const queueRequest = (endpoint, options) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ endpoint, options, resolve, reject });
    
    if (!isProcessing) {
      processQueue();
    }
  });
};

const processQueue = async () => {
  if (requestQueue.length === 0) {
    isProcessing = false;
    return;
  }
  
  isProcessing = true;
  const { endpoint, options, resolve, reject } = requestQueue.shift();
  
  try {
    const result = await fetchData(endpoint, options);
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    setTimeout(processQueue, 0);
  }
};

export const get = (endpoint, params) => {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  return fetchData(`${endpoint}${query}`);
};

export const post = (endpoint, data) => {
  return fetchData(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const login = (credentials) => {
  return post('auth/login', credentials);
};

export const fetchUser = (userId) => {
  return get(`users/${userId}`);
};

export const fetchWithRetry = async (endpoint, retries = 3, delay = 1000) => {
  try {
    return await fetchData(endpoint);
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(endpoint, retries - 1, delay);
  }
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

export const clearQueue = () => {
  requestQueue.length = 0;
  isProcessing = false;
};
