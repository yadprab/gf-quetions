// Frontend configuration
export const MAPS_API_KEY = 'AIzaSyDqVvL3XqX2XqX2XqX2XqX2XqX2XqX2XqX';
export const ANALYTICS_KEY = 'UA-12345678-1';

// Feature flags
export const FEATURE_FLAGS = {
  newDashboard: true,
  darkMode: false,
  experimental: {
    newCheckout: false,
    analyticsV2: true
  }
};

// API endpoints
export const ENDPOINTS = {
  base: 'https://api.example.com/v1',
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  },
  users: '/users',
  products: '/products'
};

// Local storage keys
export const STORAGE_KEYS = {
  user: 'app_user',
  theme: 'app_theme',
  preferences: 'user_prefs'
};
