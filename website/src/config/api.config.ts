// API configuration for production
// This file is loaded by the build process

export const API_CONFIG = {
  // Azure Function App endpoint (standalone)
  EMAIL_API_URL: 'https://artloop-email-function.azurewebsites.net/api/send-email',
  
  // Fallback to relative path if Function App is unavailable
  USE_FALLBACK: false,
};
