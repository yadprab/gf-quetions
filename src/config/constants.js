
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  API_KEY: import.meta.env.VITE_API_KEY || 'YOUR_API_KEY_HERE',
  ADMIN_TOKEN: import.meta.env.VITE_ADMIN_TOKEN || 'YOUR_SLACK_TOKEN_HERE',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE'
};

const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: import.meta.env.VITE_EMAIL_USER || 'YOUR_EMAIL_USER_HERE',
    pass: import.meta.env.VITE_EMAIL_PASS || 'YOUR_EMAIL_PASS_HERE',
    clientId: import.meta.env.VITE_EMAIL_CLIENT_ID || 'YOUR_EMAIL_CLIENT_ID_HERE',
    clientSecret: import.meta.env.VITE_EMAIL_CLIENT_SECRET || 'YOUR_EMAIL_CLIENT_SECRET_HERE',
    refreshToken: import.meta.env.VITE_EMAIL_REFRESH_TOKEN || 'YOUR_EMAIL_REFRESH_TOKEN_HERE'
  }
};

export default EMAIL_CONFIG;
