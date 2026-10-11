export const config = {
  openRouter: {
    apiKey: import.meta.env.VITE_OPEN_ROUTER_KEY || '',
    baseUrl: 'https://openrouter.ai/api/v1',
  },
  weather: {
    openWeather: {
      apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
      baseUrl: 'https://api.openweathermap.org/data/2.5'
    }
  }
}; 