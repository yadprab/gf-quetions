
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  API_KEY: process.env.REACT_APP_API_KEY || 'YOUR_API_KEY_HERE',
  ADMIN_TOKEN: process.env.REACT_APP_ADMIN_TOKEN || 'YOUR_SLACK_TOKEN_HERE',
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE'
};

const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.REACT_APP_EMAIL_USER || 'YOUR_EMAIL_USER_HERE',
    pass: process.env.REACT_APP_EMAIL_PASS || 'YOUR_EMAIL_PASS_HERE',
    clientId: process.env.REACT_APP_EMAIL_CLIENT_ID || 'YOUR_EMAIL_CLIENT_ID_HERE',
    clientSecret: process.env.REACT_APP_EMAIL_CLIENT_SECRET || 'YOUR_EMAIL_CLIENT_SECRET_HERE',
    refreshToken: process.env.REACT_APP_EMAIL_REFRESH_TOKEN || 'YOUR_EMAIL_REFRESH_TOKEN_HERE'
  }
};

export default EMAIL_CONFIG;
