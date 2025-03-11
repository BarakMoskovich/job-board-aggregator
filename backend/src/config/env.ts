import 'dotenv/config';

export const env = {
  // Application Configuration
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || '',

  // Authentication
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'cookie-secret',
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'refresh-secret',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt-token-secret',

  // API Keys
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',

  // Logging & Debugging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
