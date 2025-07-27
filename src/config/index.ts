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

export const UI_COLORS = {
  CARD_BG_COLOR_LIGHT: "#FFFFFF",
  CARD_BG_COLOR_DARK: "#1a1a1a", // Assuming dark mode cards are same as background
  ACTIVE_NAV_BG_COLOR_LIGHT: "#EBF5FF",
  ACTIVE_NAV_BG_COLOR_DARK: "rgba(67, 56, 202, 0.2)", // A darker transparent blue
};
