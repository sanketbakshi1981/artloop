// API configuration for production
// This file is loaded by the build process

export const API_CONFIG = {
  // Azure Function App base URL
  FUNCTION_APP_URL: 'https://artloop-email-function-hqacacbcdwhtatct.westus2-01.azurewebsites.net',
  
  // API Endpoints
  EMAIL_API_URL: 'https://artloop-email-function-hqacacbcdwhtatct.westus2-01.azurewebsites.net/api/send-email',
  EVENTS_API_URL: 'https://artloop-email-function-hqacacbcdwhtatct.westus2-01.azurewebsites.net/api/events',
  EVENTS_SEARCH_URL: 'https://artloop-email-function-hqacacbcdwhtatct.westus2-01.azurewebsites.net/api/events/search',
  
  // Fallback to relative path if Function App is unavailable
  USE_FALLBACK: false,
  
  // For local development, use localhost
  // Uncomment this when running locally:
  // FUNCTION_APP_URL: 'http://localhost:7071',
};
