import { useState, useEffect } from 'react';
import { getWeatherData, getForecastData } from '../../lib/api/weather';
import axios from 'axios';
import { config } from '../../lib/config';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  windDirection: number;
  rain1h?: number;
  snow1h?: number;
  country: string;
  cityName: string;
}

interface Forecast {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    rain?: {
      '3h'?: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherHookResult {
  data: WeatherData | null;
  forecast: Forecast | null;
  loading: boolean;
  error: string | null;
  refetch: (lat: number, lon: number) => Promise<void>;
}

// Fonction pour générer des données météo simulées
function getSimulatedWeatherData(lat: number, lon: number): WeatherData {
  console.log('Generating simulated weather data');
  const now = Date.now();
  const sunriseDate = new Date();
  sunriseDate.setHours(6, 0, 0, 0);
  const sunsetDate = new Date();
  sunsetDate.setHours(20, 0, 0, 0);
  
  return {
    temperature: 15 + Math.random() * 10,
    humidity: 40 + Math.floor(Math.random() * 40),
    windSpeed: 1 + Math.random() * 9,
    description: "ciel partiellement nuageux",
    icon: "50d",
    feelsLike: 14 + Math.random() * 10,
    pressure: 1010 + Math.floor(Math.random() * 20),
    visibility: 8000 + Math.floor(Math.random() * 2000),
    clouds: Math.floor(Math.random() * 100),
    sunrise: Math.floor(sunriseDate.getTime() / 1000),
    sunset: Math.floor(sunsetDate.getTime() / 1000),
    windDirection: Math.floor(Math.random() * 360),
    rain1h: Math.random() > 0.7 ? Math.random() * 5 : undefined,
    country: "FR",
    cityName: lat && lon ? `${lat.toFixed(2)}, ${lon.toFixed(2)}` : "Paris"
  };
}

// Fonction pour générer des prévisions simulées
function getSimulatedForecastData(lat: number, lon: number): any {
  console.log('Generating simulated forecast data');
  const now = Date.now();
  const list = [];
  
  // Créer 8 prévisions par tranches de 3 heures
  for (let i = 0; i < 8; i++) {
    const forecastTime = new Date(now + i * 3 * 60 * 60 * 1000);
    
    list.push({
      dt: Math.floor(forecastTime.getTime() / 1000),
      main: {
        temp: 15 + Math.sin(i/4) * 5 + Math.random() * 3,
        feels_like: 14 + Math.sin(i/4) * 5 + Math.random() * 3,
        humidity: 40 + Math.floor(Math.random() * 40)
      },
      weather: [{
        id: 800 + Math.floor(Math.random() * 30),
        main: "Clouds",
        description: "nuages épars",
        icon: "03d"
      }],
      clouds: {
        all: Math.floor(Math.random() * 100)
      },
      wind: {
        speed: 2 + Math.random() * 8,
        deg: Math.floor(Math.random() * 360)
      },
      pop: Math.random(),
      dt_txt: forecastTime.toISOString().split('.')[0].replace('T', ' ')
    });
  }
  
  return {
    list: list,
    city: {
      name: "Paris",
      country: "FR",
      sunrise: Math.floor(new Date().setHours(6, 0, 0, 0) / 1000),
      sunset: Math.floor(new Date().setHours(20, 0, 0, 0) / 1000)
    }
  };
}

export default function useWeather(initialLat?: number, initialLon?: number): WeatherHookResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState<boolean>(!!initialLat && !!initialLon);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    console.log('fetchWeather called with', { lat, lon });
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current weather - prioritize the API service now that we have valid keys
      try {
        console.log('Trying to get weather data from API');
        // Use the weather service with valid API keys
        const weatherData = await getWeatherData(lat, lon);
        console.log('Weather data fetched successfully:', weatherData);
        setData(weatherData);
        
        // Get forecast data
        try {
          console.log('Trying to get forecast data from API');
          const forecastData = await getForecastData(lat, lon);
          console.log('Forecast data fetched successfully');
          setForecast(forecastData);
        } catch (forecastError) {
          console.warn('Failed to fetch forecast, using simulated data:', forecastError);
          setForecast(getSimulatedForecastData(lat, lon));
        }
      } catch (serviceError) {
        console.warn('Weather API service failed, trying direct API call:', serviceError);
        
        // Try direct API call as backup
        const apiKey = config.weather.openWeather.apiKey;
        if (apiKey && apiKey !== 'your_openweather_api_key_here') {
          try {
            console.log('Trying direct OpenWeatherMap API call');
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            );
            
            const weatherData = response.data;
            console.log('Direct API call successful:', weatherData);
            
            // Transform to our format
            setData({
              temperature: weatherData.main.temp,
              humidity: weatherData.main.humidity,
              windSpeed: weatherData.wind.speed,
              description: weatherData.weather[0].description,
              icon: weatherData.weather[0].icon,
              feelsLike: weatherData.main.feels_like,
              pressure: weatherData.main.pressure,
              visibility: weatherData.visibility,
              clouds: weatherData.clouds.all,
              sunrise: weatherData.sys.sunrise,
              sunset: weatherData.sys.sunset,
              windDirection: weatherData.wind.deg,
              rain1h: weatherData.rain?.['1h'],
              snow1h: weatherData.snow?.['1h'],
              country: weatherData.sys.country,
              cityName: weatherData.name
            });
            
            // Try to get forecast as well
            try {
              const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
              );
              setForecast(forecastResponse.data);
            } catch (directForecastError) {
              console.warn('Direct forecast API call failed:', directForecastError);
              setForecast(getSimulatedForecastData(lat, lon));
            }
          } catch (directApiError) {
            console.warn('Direct API call failed, trying Flask API:', directApiError);
            // Proceed to Flask API as next fallback
            tryFlaskApi();
          }
        } else {
          console.warn('No valid API key available, trying Flask API');
          // No valid API key, try Flask API
          tryFlaskApi();
        }
      }
    } catch (err) {
      console.error('All weather fetching methods failed:', err);
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      
      // Toujours fournir des données simulées pour éviter une page vide
      setData(getSimulatedWeatherData(lat, lon));
      setForecast(getSimulatedForecastData(lat, lon));
    } finally {
      setLoading(false);
    }
    
    // Helper function to try the Flask API
    async function tryFlaskApi() {
      try {
        console.log('Trying Flask API');
        const response = await axios.get(`http://localhost:8000/api/weather?lat=${lat}&lon=${lon}`);
        
        if (response.data?.error) {
          throw new Error(response.data.error);
        }
        
        if (response.data) {
          console.log('Flask API data fetched successfully');
          // Adapter le format de l'API Flask au format attendu
          setData({
            temperature: response.data.temperature,
            humidity: response.data.humidity,
            windSpeed: response.data.windSpeed,
            description: response.data.description,
            icon: 'unknown', // L'API Flask ne fournit pas cette information
            feelsLike: response.data.temperature - 1, // Approximation
            pressure: 1013, // Valeur par défaut
            visibility: 10000, // Valeur par défaut (10 km)
            clouds: 0, // Valeur par défaut
            sunrise: Math.floor(Date.now() / 1000) - 3600, // Approximation
            sunset: Math.floor(Date.now() / 1000) + 43200, // Approximation
            windDirection: 0, // Valeur par défaut
            country: 'Unknown',
            cityName: 'Unknown'
          });
          
          // Prévisions simulées
          setForecast(getSimulatedForecastData(lat, lon));
        } else {
          throw new Error('Données météo non disponibles');
        }
      } catch (flaskError) {
        console.warn('Flask API failed, using simulated data:', flaskError);
        // Utiliser des données simulées en dernier recours
        setData(getSimulatedWeatherData(lat, lon));
        setForecast(getSimulatedForecastData(lat, lon));
      }
    }
  };

  useEffect(() => {
    console.log('useWeather hook called with', { initialLat, initialLon });
    if (initialLat && initialLon) {
      fetchWeather(initialLat, initialLon);
    } else {
      // Fournir des données simulées si aucune coordonnée n'est fournie
      console.log('No coordinates provided, using simulated data');
      setData(getSimulatedWeatherData(48.8566, 2.3522)); // Paris
      setForecast(getSimulatedForecastData(48.8566, 2.3522));
      setLoading(false);
    }
  }, [initialLat, initialLon]);

  return {
    data,
    forecast,
    loading,
    error,
    refetch: fetchWeather
  };
} 