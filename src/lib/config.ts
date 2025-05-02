/**
 * Application configuration
 * This file centralizes environment variables and configuration settings
 */
export const config = {
  // Weather API configuration
  weather: {
    openWeather: {
      apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || 'your_openweather_api_key_here',
      baseUrl: 'https://api.openweathermap.org/data/2.5'
    }
  },
  
  // Climate and soil API configuration
  climate: {
    apiKey: import.meta.env.VITE_AGROMONITORING_API_KEY || 'your_agromonitoring_api_key_here',
    baseUrl: 'https://api.agromonitoring.com/agro/1.0'
  },
  
  // Chatbot API configuration (using OpenRouter for LLM access)
  openRouter: {
    apiKey: import.meta.env.VITE_OPEN_ROUTER_KEY || 'your_openrouter_api_key_here',
    baseUrl: 'https://openrouter.ai/api/v1'
  },
  
  // Air quality API
  airQuality: {
    apiKey: import.meta.env.VITE_AIRVISUAL_API_KEY || 'your_airvisual_api_key_here',
    baseUrl: 'https://api.airvisual.com/v2'
  },
  
  // API backend URL
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  },
  
  // Authentication settings
  auth: {
    tokenStorageKey: 'agritech_token',
    refreshTokenStorageKey: 'agritech_refresh_token',
    tokenExpiryKey: 'agritech_token_expiry'
  }
}; 