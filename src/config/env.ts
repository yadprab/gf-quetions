export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_KEY: import.meta.env.VITE_API_KEY,
  ADMIN_TOKEN: import.meta.env.VITE_ADMIN_TOKEN,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
};

export const EMAIL_CONFIG = {
  service: "gmail",
  auth: {
    user: import.meta.env.VITE_EMAIL_USER,
    pass: import.meta.env.VITE_EMAIL_PASS,
    clientId: import.meta.env.VITE_EMAIL_CLIENT_ID,
    clientSecret: import.meta.env.VITE_EMAIL_CLIENT_SECRET,
    refreshToken: import.meta.env.VITE_EMAIL_REFRESH_TOKEN,
  },
};
