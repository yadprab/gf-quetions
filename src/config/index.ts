// Frontend configuration
export const MAPS_API_KEY: string = import.meta.env.VITE_MAPS_API_KEY;
export const ANALYTICS_KEY: string = import.meta.env.VITE_ANALYTICS_KEY;

// API endpoints
export const ENDPOINTS = {
  base: "https://api.example.com/v1",
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  users: "/users",
  products: "/products",
  featureFlags: "/api/feature-flags",
};

// Local storage keys
export const STORAGE_KEYS = {
  user: "app_user",
  theme: "app_theme",
  preferences: "user_prefs",
  token: "app_token",
};
